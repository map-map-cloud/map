<template>
    <div class="power-info">
        <div class="sidebar">
            <div class="summary">
                <span>光電案場數量：{{ totalSites }} 個</span>
                <span>總發電容量：{{ totalPower }} MW</span>
            </div>

            <button class="toggle-all-btn" @click="toggleAll">
                <span class="toggle-icon" :class="{ 'expanded': isAllExpanded }">▼</span>
            </button>

            <div class="category">
                <div class="category-title" @click="expanded.city = !expanded.city"
                    :class="{ 'expanded': expanded.city }">
                    市
                </div>
                <ul v-show="expanded.city">
                    <li v-for="item in areas.city" :key="item" @click="selectArea(item)">{{ item }}</li>
                </ul>
            </div>

            <div class="category">
                <div class="category-title" @click="expanded.town = !expanded.town"
                    :class="{ 'expanded': expanded.town }">
                    鎮
                </div>
                <ul v-show="expanded.town">
                    <li v-for="item in areas.town" :key="item" @click="selectArea(item)">{{ item }}</li>
                </ul>
            </div>

            <div class="category">
                <div class="category-title" @click="expanded.village = !expanded.village"
                    :class="{ 'expanded': expanded.village }">
                    鄉
                </div>
                <ul v-show="expanded.village">
                    <li v-for="item in areas.village" :key="item" @click="selectArea(item)">{{ item }}</li>
                </ul>
            </div>
        </div>

        <div class="content">
            <div v-if="!selectedArea">
                <h2>雲林縣各鄉鎮市發電量統計</h2>
                <div class="tabs">
                    <button @click="activeTab = 'map'" :class="{ active: activeTab === 'map' }">地圖顯示</button>
                    <button @click="activeTab = 'chart'" :class="{ active: activeTab === 'chart' }">可視化圖</button>
                    <button @click="activeTab = 'comparison'"
                        :class="{ active: activeTab === 'comparison' }">縣市比較</button>
                    <button @click="activeTab = 'table'" :class="{ active: activeTab === 'table' }">資料表格</button>
                </div>
                <div class="overview-section">
                    <div v-show="activeTab === 'map'" id="overviewMap" class="overview-map"></div>
                    <div v-show="activeTab === 'chart'" class="charts-container">
                        <div class="charts-row">
                            <div class="chart-wrapper">
                                <canvas id="myPieChart" class="chart"></canvas>
                            </div>
                            <div class="chart-wrapper">
                                <canvas id="myStackedChart" class="chart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div v-show="activeTab === 'comparison'" class="comparison-container">
                        <div class="comparison-row">
                            <div class="chart-wrapper">
                                <canvas id="comparisonPieChart" class="chart"></canvas>
                            </div>
                            <div class="chart-wrapper">
                                <canvas id="comparisonChart" class="chart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div v-show="activeTab === 'table'" class="table-container">
                        <div class="state-filter">
                            <span>狀態篩選：</span>
                            <button v-for="state in states" :key="state" @click="selectedState = state"
                                :class="{ active: selectedState === state }">
                                {{ state }}
                            </button>
                        </div>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>鄉鎮市</th>
                                    <th>狀態</th>
                                    <th>案場數量</th>
                                    <th>發電容量 (kW)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in filteredTownData" :key="item.Town + item.State">
                                    <td>{{ item.Town }}</td>
                                    <td>{{ item.State }}</td>
                                    <td>{{ item.Count }}</td>
                                    <td>{{ parseFloat(item.CapacityValNow).toLocaleString() }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div v-if="selectedArea">
                <button class="back-btn" @click="goBack">← 返回雲林縣各鄉鎮市發電量統計</button>
                <h2>{{ selectedArea }} 統計資訊</h2>
                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-content">
                            <h3>案場數量</h3>
                            <p class="stat-value">{{ selectedStats.sites }}</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⚡</div>
                        <div class="stat-content">
                            <h3>總發電容量</h3>
                            <p class="stat-value">{{ selectedStats.power }} kW</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🏗️</div>
                        <div class="stat-content">
                            <h3>施工中數量</h3>
                            <p class="stat-value">{{ selectedStats.construction }}</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📝</div>
                        <div class="stat-content">
                            <h3>申請中數量</h3>
                            <p class="stat-value">{{ selectedStats.application }}</p>
                        </div>
                    </div>
                </div>
                <div id="map" class="map"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, onMounted, watch, computed } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const areas = {
    city: ['斗六市'],
    town: ['土庫鎮', '斗南鎮', '北港鎮', '虎尾鎮', '西螺鎮'],
    village: ['大埤鄉', '元長鄉', '四湖鄉', '口湖鄉', '古坑鄉', '台西鄉', '崙背鄉', '東勢鄉', '林內鄉', '莿桐鄉', '褒忠鄉', '麥寮鄉']
}

const expanded = ref({ city: true, town: true, village: true })
const isAllExpanded = ref(true)
const selectedArea = ref('')
const selectedStats = ref({ 
    sites: 0, 
    power: 0, 
    construction: 0, 
    application: 0 
})
const totalSites = ref(0)
const totalPower = ref(0)
let map = null
let geojsonLayer = null
let pieChart = null
let overviewMap = null
let overviewLayer = null
let stackedChart = null
let comparisonPieChart = null
let comparisonChart = null
const activeTab = ref('map')
let lastMapView = null
const townData = ref([])
const selectedState = ref('全部')
const states = ref(['全部', '已併聯', '施工中', '申請中'])

const filteredTownData = computed(() => {
    if (selectedState.value === '全部') {
        return townData.value
    }
    return townData.value.filter(item => item.State === selectedState.value)
})

// 監聽 activeTab 的變化
watch(activeTab, (newTab) => {
    if (newTab === 'map') {
        nextTick(() => {
            if (overviewMap) {
                overviewMap.invalidateSize()
                // 如果有保存的視圖狀態，則恢復
                if (lastMapView) {
                    overviewMap.setView(lastMapView.center, lastMapView.zoom)
                }
            }
        })
    } else if (overviewMap) {
        // 保存當前視圖狀態
        lastMapView = {
            center: overviewMap.getCenter(),
            zoom: overviewMap.getZoom()
        }
    }
})

function toggleAll() {
    const expand = !isAllExpanded.value
    expanded.value.city = expand
    expanded.value.town = expand
    expanded.value.village = expand
    isAllExpanded.value = expand
}

async function goBack() {
    selectedArea.value = ''
    nextTick(async () => {
        await fetchTotalData()
        await fetchYunlinData()
        await renderOverviewMap()
        await fetchCountyData()
        await fetchTownData()
        // 重置地圖相關變量
        if (map) {
            map.remove()
            map = null
        }
        if (geojsonLayer) {
            geojsonLayer = null
        }
    })
}

async function selectArea(area) {
    selectedArea.value = area
    nextTick(async () => {
        try {
            const response = await fetch('https://soezsell.com/test-map/info.php?state_stats=%E9%9B%B2%E6%9E%97%E7%B8%A3')
            const data = await response.json()
            
            // 找到對應鄉鎮的所有狀態資料
            const townInfo = data.filter(item => item.Town === area)
            
            // 顯示已併聯的數據
            const connectedInfo = townInfo.find(item => item.State === '已併聯')
            const constructionInfo = townInfo.find(item => item.State === '施工中')
            const applicationInfo = townInfo.find(item => item.State === '申請中')
            
            if (connectedInfo) {
                selectedStats.value = {
                    sites: parseInt(connectedInfo.Count),
                    power: parseFloat(connectedInfo.CapacityValNow).toFixed(2),
                    construction: constructionInfo ? parseInt(constructionInfo.Count) : 0,
                    application: applicationInfo ? parseInt(applicationInfo.Count) : 0
                }
            }
            
            // 每次點擊都重新初始化地圖
            if (map) {
                map.remove()
            }
            initMap()
            await updateMapForArea(area)
        } catch (error) {
            console.error('無法獲取鄉鎮資料:', error)
        }
    })
}

function initMap() {
    map = L.map('map').setView([23.709, 120.431], 11)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map)

    updateMapForArea(selectedArea.value)
}

async function updateMapForArea(areaName) {
    if (!map) return
    if (geojsonLayer) map.removeLayer(geojsonLayer)

    try {
        const res = await fetch('http://192.168.31.230/geo/yunlin-townships.geojson')
        const data = await res.json()

        // 獲取鄉鎮市資料
        const response = await fetch('https://soezsell.com/test-map/info.php?state_stats=%E9%9B%B2%E6%9E%97%E7%B8%A3')
        const townData = await response.json()
        
        // 建立鄉鎮市資料映射，只使用已併聯的數據
        const townPowerData = {}
        townData.forEach(item => {
            if (item.State === '已併聯') {
                townPowerData[item.Town] = {
                    count: parseInt(item.Count),
                    power: parseFloat(item.CapacityValNow)
                }
            }
        })

        // 找到選中的鄉鎮市
        const selectedFeature = data.features.find(f => f.properties.town === areaName)
        if (selectedFeature) {
            // 顯示所有鄉鎮市，但將未選中的鄉鎮市設置為半透明白色
            geojsonLayer = L.geoJSON(data, {
                style: (feature) => {
                    if (feature.properties.town === areaName) {
                        return {
                            color: '#038686',
                            fillColor: '#038686',
                            fillOpacity: 0,
                            weight: 3
                        }
                    } else {
                        return {
                            color: '#ffffff',
                            fillColor: '#ffffff',
                            fillOpacity: 0.3,
                            weight: 0
                        }
                    }
                }
            }).addTo(map)

            // 調整地圖視圖
            const bounds = L.geoJSON(selectedFeature).getBounds()
            map.fitBounds(bounds, {
                padding: [10, 10],
                maxZoom: 18
            })
        }

        // 更新選中區域的統計資料
        if (areaName && townPowerData[areaName]) {
            const currentStats = { ...selectedStats.value }
            selectedStats.value = {
                sites: townPowerData[areaName].count,
                power: townPowerData[areaName].power.toFixed(2),
                construction: currentStats.construction,
                application: currentStats.application
            }
        }
    } catch (e) {
        console.error('無法載入地圖資料', e)
    }
}

async function fetchYunlinData() {
    try {
        const response = await fetch('https://soezsell.com/test-map/info.php?County=%E9%9B%B2%E6%9E%97%E7%B8%A3');
        const data = await response.json();
        
        // 整理資料並排序
        const sortedData = data.sort((a, b) => parseFloat(b.CapacityValNow) - parseFloat(a.CapacityValNow));
        const towns = sortedData.map(item => item.Town);
        const townData = {
            sites: sortedData.map(item => parseInt(item.Count)),
            power: sortedData.map(item => parseFloat(item.CapacityValNow))
        };
        
        // 更新圖表
        renderPieChart(towns, townData);
        renderStackedChart(towns, townData);
    } catch (error) {
        console.error('無法獲取雲林縣資料:', error);
    }
}

function renderPieChart(towns, townData) {
    const ctx = document.getElementById('myPieChart');
    if (pieChart) pieChart.destroy();

    pieChart = new window.Chart(ctx, {
        type: 'pie',
        data: {
            labels: towns,
            datasets: [{
                data: townData.power,
                backgroundColor: towns.map(() => `hsl(${Math.random() * 360}, 70%, 70%)`)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 20,
                    right: 20
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const meta = context.chart.getDatasetMeta(0);
                        if (meta.data[context.dataIndex].hidden) {
                            return null;
                        }
                        const visibleData = context.chart.data.datasets[0].data.filter((_, i) => !meta.data[i].hidden);
                        const total = visibleData.reduce((a, b) => a + b, 0);
                        const percentage = ((context.raw / total) * 100).toFixed(1);
                        return `${context.label}：${context.raw} kW (${percentage}%)`;
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    align: 'center',
                    onClick: function(e, legendItem, legend) {
                        const index = legendItem.index;
                        const ci = legend.chart;
                        const meta = ci.getDatasetMeta(0);
                        meta.data[index].hidden = !meta.data[index].hidden;
                        ci.update();
                    },
                    labels: {
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const meta = chart.getDatasetMeta(0);
                                    const value = data.datasets[0].data[i];
                                    const isHidden = meta.data[i] ? meta.data[i].hidden : false;
                                    return {
                                        text: `${label}\n${value} kW`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: isHidden,
                                        lineCap: 'butt',
                                        lineDash: [],
                                        lineDashOffset: 0,
                                        lineJoin: 'miter',
                                        lineWidth: 1,
                                        strokeStyle: data.datasets[0].backgroundColor[i],
                                        pointStyle: 'circle',
                                        rotation: 0,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        },
                        font: {
                            size: 11
                        },
                        usePointStyle: true,
                        boxWidth: 12,
                        padding: 15,
                        textDecoration: function(context) {
                            const meta = context.chart.getDatasetMeta(0);
                            if (meta.data[context.index] && meta.data[context.index].hidden) {
                                return 'line-through';
                            }
                            return '';
                        }
                    }
                },
                datalabels: {
                    formatter: (value, ctx) => {
                        const meta = ctx.chart.getDatasetMeta(0);
                        if (meta.data[ctx.dataIndex].hidden) {
                            return null;
                        }
                        const visibleData = ctx.chart.data.datasets[0].data.filter((_, i) => !meta.data[i].hidden);
                        const total = visibleData.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${percentage}%`;
                    },
                    anchor: 'end',
                    align: 'center',
                    offset: 8,
                    display: function(context) {
                        const meta = context.chart.getDatasetMeta(0);
                        if (meta.data[context.dataIndex].hidden) {
                            return false;
                        }
                        const value = context.dataset.data[context.dataIndex];
                        const visibleData = context.dataset.data.filter((_, i) => !meta.data[i].hidden);
                        const total = visibleData.reduce((a, b) => a + b, 0);
                        const percentage = (value / total) * 100;
                        return percentage > 0.1;
                    }
                }
            }
        }
    });
}

function renderStackedChart(towns, townData) {
    const ctx = document.getElementById('myStackedChart');
    if (stackedChart) stackedChart.destroy();

    stackedChart = new window.Chart(ctx, {
        type: 'bar',
        data: {
            labels: towns,
            datasets: [
                {
                    label: '案場數量',
                    data: townData.sites,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: '發電容量 (kW)',
                    data: townData.power,
                    backgroundColor: 'rgba(255, 159, 64, 0.7)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '案場數量與發電容量對比',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 5,
                        bottom: 10
                    }
                },
                legend: {
                    position: 'top',
                    padding: 10
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: '案場數量',
                        font: {
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        stepSize: 10
                    }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: '發電容量 (kW)',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

async function renderOverviewMap() {
    if (overviewMap) {
        // 保存當前視圖狀態
        lastMapView = {
            center: overviewMap.getCenter(),
            zoom: overviewMap.getZoom()
        }
        overviewMap.remove()
    }
    overviewMap = L.map('overviewMap').setView([23.709, 120.431], 8)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(overviewMap)

    try {
        const res = await fetch('/geo/yunlin-townships.geojson')
        const geo = await res.json()
        const powerData = {}

        if (overviewLayer) overviewMap.removeLayer(overviewLayer)
        overviewLayer = L.geoJSON(geo, {
            style: feature => {
                const color = `hsl(${Math.random() * 360}, 80%, 80%)`
                return {
                    color: '#ccc',
                    fillColor: color,
                    fillOpacity: 0.3,
                    weight: 1
                }
            }
        }).addTo(overviewMap)

        // 如果有保存的視圖狀態，則恢復
        if (lastMapView) {
            overviewMap.setView(lastMapView.center, lastMapView.zoom)
        } else {
            // 自動調整視圖以顯示整個雲林縣
            overviewMap.fitBounds(overviewLayer.getBounds(), {
                padding: [0, 0],
                maxZoom: 11
            })
        }

        geo.features.forEach(f => {
            const town = f.properties.TOWNNAME
            powerData[town] = Math.floor(Math.random() * 10000) + 1000

            const center = L.geoJSON(f).getBounds().getCenter()
            const label = L.divIcon({
                className: 'town-label',
                html: `<div>${powerData[town]}kW</div>`
            })
            L.marker(center, { icon: label }).addTo(overviewMap)
        })
    } catch (e) {
        console.error('載入 GeoJSON 錯誤', e)
    }
}

async function fetchCountyData() {
    try {
        const response = await fetch('https://soezsell.com/test-map/info.php?county_stats=County');
        const data = await response.json();
        
        // 整理資料並排序
        const sortedData = data.sort((a, b) => parseFloat(b.CapacityValNow) - parseFloat(a.CapacityValNow));
        const counties = sortedData.map(item => item.County);
        const countyData = {
            sites: sortedData.map(item => parseInt(item.Count)),
            power: sortedData.map(item => parseFloat(item.CapacityValNow))
        };
        
        // 更新圖表
        renderComparisonPieChart(counties, countyData);
        renderComparisonChart(counties, countyData);
    } catch (error) {
        console.error('無法獲取縣市資料:', error);
    }
}

function renderComparisonPieChart(counties, countyData) {
    const ctx = document.getElementById('comparisonPieChart');
    if (comparisonPieChart) comparisonPieChart.destroy();

    comparisonPieChart = new window.Chart(ctx, {
        type: 'pie',
        data: {
            labels: counties,
            datasets: [{
                data: countyData.power,
                backgroundColor: counties.map(() => `hsl(${Math.random() * 360}, 70%, 70%)`)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '各縣市發電容量佔比',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 5,
                        bottom: 10
                    }
                },
                legend: {
                    position: 'right',
                    onClick: function(e, legendItem, legend) {
                        const index = legendItem.index;
                        const ci = legend.chart;
                        const meta = ci.getDatasetMeta(0);
                        meta.data[index].hidden = !meta.data[index].hidden;
                        ci.update();
                    },
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        font: {
                            size: 11
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const meta = chart.getDatasetMeta(0);
                                    const value = data.datasets[0].data[i];
                                    const isHidden = meta.data[i] ? meta.data[i].hidden : false;
                                    return {
                                        text: `${label}\n${value.toLocaleString()} kW`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: isHidden,
                                        lineCap: 'butt',
                                        lineDash: [],
                                        lineDashOffset: 0,
                                        lineJoin: 'miter',
                                        lineWidth: 1,
                                        strokeStyle: data.datasets[0].backgroundColor[i],
                                        pointStyle: 'circle',
                                        rotation: 0,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                datalabels: {
                    color: '#333',
                    textAlign: 'center',
                    font: {
                        size: 11,
                        weight: 'bold'
                    },
                    formatter: (value, ctx) => {
                        const meta = ctx.chart.getDatasetMeta(0);
                        if (meta.data[ctx.dataIndex].hidden) {
                            return null;
                        }
                        const visibleData = ctx.chart.data.datasets[0].data.filter((_, i) => !meta.data[i].hidden);
                        const total = visibleData.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${percentage}%`;
                    },
                    display: function(context) {
                        const meta = context.chart.getDatasetMeta(0);
                        if (meta.data[context.dataIndex].hidden) {
                            return false;
                        }
                        const value = context.dataset.data[context.dataIndex];
                        const visibleData = context.dataset.data.filter((_, i) => !meta.data[i].hidden);
                        const total = visibleData.reduce((a, b) => a + b, 0);
                        const percentage = (value / total) * 100;
                        return percentage > 2;
                    }
                }
            }
        }
    });
}

function renderComparisonChart(counties, countyData) {
    const ctx = document.getElementById('comparisonChart');
    if (comparisonChart) comparisonChart.destroy();

    comparisonChart = new window.Chart(ctx, {
        type: 'bar',
        data: {
            labels: counties,
            datasets: [
                {
                    label: '案場數量',
                    data: countyData.sites,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: '發電容量 (kW)',
                    data: countyData.power,
                    backgroundColor: 'rgba(255, 159, 64, 0.7)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '台灣各縣市光電案場比較',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 5,
                        bottom: 10
                    }
                },
                legend: {
                    position: 'top',
                    padding: 10
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toLocaleString();
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: '案場數量',
                        font: {
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        stepSize: 50
                    }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: '發電容量 (kW)',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        stepSize: 50000
                    }
                }
            }
        }
    });
}

async function fetchTotalData() {
    try {
        const response = await fetch('https://soezsell.com/test-map/info.php?county_stats=County&filterCounty=%E9%9B%B2%E6%9E%97%E7%B8%A3');
        const data = await response.json();
        
        if (data && data.length > 0) {
            totalSites.value = parseInt(data[0].Count);
            totalPower.value = (parseFloat(data[0].CapacityValNow) / 1000).toFixed(2);
        }
    } catch (error) {
        console.error('無法獲取總計資料:', error);
    }
}

async function fetchTownData() {
    try {
        const response = await fetch('https://soezsell.com/test-map/info.php?state_stats=%E9%9B%B2%E6%9E%97%E7%B8%A3')
        const data = await response.json()
        // 按照鄉鎮市和狀態排序
        townData.value = data.sort((a, b) => {
            if (a.Town === b.Town) {
                // 如果鄉鎮市相同，按照狀態排序
                const stateOrder = { '已併聯': 1, '施工中': 2, '申請中': 3 }
                return stateOrder[a.State] - stateOrder[b.State]
            }
            // 先按鄉鎮市排序
            return a.Town.localeCompare(b.Town, 'zh-TW')
        })
    } catch (error) {
        console.error('無法獲取鄉鎮資料:', error)
    }
}

onMounted(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js'
    script.onload = () => {
        const datalabelsScript = document.createElement('script')
        datalabelsScript.src = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0'
        datalabelsScript.onload = () => {
            window.Chart.register(window.ChartDataLabels)
            fetchTotalData()
            fetchYunlinData()
            renderOverviewMap()
            fetchCountyData()
            fetchTownData()
        }
        document.head.appendChild(datalabelsScript)
    }
    document.head.appendChild(script)
})
</script>

<style scoped>
.power-info {
    display: flex;
    height: 100vh;
    overflow: hidden;
    width: 100%;
    max-width: 100vw;
}

.sidebar {
    width: 300px;
    height: 100%;
    overflow-y: auto;
    background: #f8f9fa;
    border-right: 1px solid #eee;
    padding: 20px;
    flex-shrink: 0;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.content {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    width: calc(100% - 300px);
}

.tabs {
    padding: 15px;
    background: #fff;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: center;
    gap: 20px;
    position: sticky;
    top: 0;
    z-index: 10;
}

.tabs button {
    padding: 10px 20px;
    border: none;
    background: transparent;
    color: #666;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
}

.tabs button::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background: #038686;
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.tabs button:hover {
    color: #038686;
}

.tabs button.active {
    color: #038686;
    font-weight: bold;
}

.tabs button.active::after {
    transform: scaleX(1);
}

.overview-section {
    flex: 1;
    display: flex;
    margin-top: 20px;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
}

.overview-map {
    width: 100%;
    height: calc(100vh - 280px);
    margin-top: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

#map {
    width: 100%;
    height: calc(100vh - 400px);
        border-radius: 8px;
}

h2 {
    margin: 20px;
    color: #038686;
    font-size: 24px;
    text-align: center;
}

.overview-section {
    flex: 1;
    display: flex;
    margin-top: 20px;
}

.town-label {
    background: rgba(255, 255, 255, 0.8);
    padding: 4px 6px;
    border-radius: 6px;
    font-size: 12px;
    text-align: center;
    border: 1px solid #ccc;
    color: #333;
}

.category {
    margin-bottom: 15px;
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.category-title {
    font-weight: 600;
    cursor: pointer;
    padding: 12px 15px;
    background-color: #f1f5f9;
    color: #038686;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s ease;
}

.category-title::after {
    content: '▼';
    font-size: 0.8em;
    transition: transform 0.3s ease;
}

.category-title:hover {
    background-color: #e2e8f0;
}

.category ul {
    list-style-type: none;
    padding: 8px 0;
    margin: 0;
    background: white;
}

.category li {
    cursor: pointer;
    padding: 8px 15px;
    margin: 0;
    color: #334155;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
}

.category li:hover {
    background-color: #f1f5f9;
    color: #038686;
    text-decoration: none;
    padding-left: 25px;
}

/* 自定義滾動條 */
.sidebar::-webkit-scrollbar {
    width: 6px;
}

.sidebar::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.sidebar::-webkit-scrollbar-thumb {
    background: #038686;
    border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
    background: #026d6d;
}

/* 當類別展開時箭頭旋轉 */
.category[expanded="true"] .category-title::after {
    transform: rotate(180deg);
}

.summary {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    background: #038686;
    color: white;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 8px rgba(3, 134, 134, 0.2);
}

.summary span {
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

.toggle-all-btn {
    width: 100%;
    margin-bottom: 10px;
    padding: 6px;
    background-color: #038686;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(3, 134, 134, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
}

.toggle-icon {
    font-size: 0.6em;
    transition: transform 0.3s ease;
    line-height: 1;
}

.toggle-icon.expanded {
    transform: rotate(180deg);
}

.back-btn {
    width: 97%;
    margin-top: 20px;
    padding: 12px;
    background-color: #038686;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(3, 134, 134, 0.2);
}

.back-btn:hover {
    background-color: #026d6d;
    transform: translateY(-1px);
}

.comparison-container {
    width: 100%;
    height: calc(100vh - 200px);
    padding: 20px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.comparison-row {
    display: flex;
    height: 100%;
    gap: 20px;
    width: 100%;
}

.comparison-row .chart-wrapper {
    flex: 1;
    min-width: 0;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.comparison-row .chart {
    width: 100%;
    height: 100%;
}

.table-container {
    width: 100%;
    padding: 20px;
    overflow-x: auto;
    max-width: 100%;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
}

.data-table th,
.data-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.data-table th {
    background-color: #038686;
    color: white;
    font-weight: 600;
}

.data-table tr:hover {
    background-color: #f5f5f5;
}

.data-table td {
    color: #333;
}

.data-table tr:last-child td {
    border-bottom: none;
}

.state-filter {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.state-filter span {
    font-weight: 600;
    color: #333;
}

.state-filter button {
    padding: 6px 12px;
    border: 1px solid #038686;
    background: white;
    color: #038686;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.state-filter button:hover {
    background: #038686;
    color: white;
}

.state-filter button.active {
    background: #038686;
    color: white;
}

.stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    padding: 20px;
    margin-bottom: 20px;
    width: 100%;
    max-width: 100%;
}

.stat-card {
    background: white;
    border-radius: 15px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.stat-icon {
    font-size: 2.5em;
    background: #f0f9f9;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    color: #038686;
}

.stat-content {
    flex: 1;
}

.stat-content h3 {
    margin: 0;
    font-size: 1em;
    color: #666;
    font-weight: 500;
}

.stat-value {
    margin: 5px 0 0;
    font-size: 1.5em;
    font-weight: 600;
    color: #038686;
}

.back-btn {
    margin: 20px;
    padding: 12px 24px;
    background-color: #038686;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(3, 134, 134, 0.2);
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.back-btn:hover {
    background-color: #026d6d;
    transform: translateX(-5px);
}

h2 {
    margin: 20px;
    color: #038686;
    font-size: 28px;
    text-align: center;
    font-weight: 600;
}

.charts-container {
    width: 100%;
    height: calc(100vh - 200px);
    padding: 20px;
    overflow: hidden;
}

.charts-row {
    display: flex;
    height: 100%;
    gap: 20px;
    width: 100%;
}

.chart-wrapper {
    flex: 1;
    min-width: 0;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chart {
    width: 100%;
    height: 100%;
}
</style>