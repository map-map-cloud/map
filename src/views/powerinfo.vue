<template>
    <div class="power-info">
        <div class="sidebar">
            <div class="summary">
                <span>光電案場數量：{{ totalSites }} 個</span>
                <span>總發電容量：{{ totalPower }} kW</span>
            </div>

            <button class="toggle-all-btn" @click="toggleAll">
                <span class="toggle-icon" :class="{ 'expanded': isAllExpanded }">▼</span>
            </button>

            <div class="category">
                <div class="category-title" 
                     @click="expanded.city = !expanded.city"
                     :class="{ 'expanded': expanded.city }">
                    市
                </div>
                <ul v-show="expanded.city">
                    <li v-for="item in areas.city" :key="item" @click="selectArea(item)">{{ item }}</li>
                </ul>
            </div>

            <div class="category">
                <div class="category-title" 
                     @click="expanded.town = !expanded.town"
                     :class="{ 'expanded': expanded.town }">
                    鎮
                </div>
                <ul v-show="expanded.town">
                    <li v-for="item in areas.town" :key="item" @click="selectArea(item)">{{ item }}</li>
                </ul>
            </div>

            <div class="category">
                <div class="category-title" 
                     @click="expanded.village = !expanded.village"
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
                </div>
            </div>

            <div v-if="selectedArea">
                <button class="back-btn" @click="goBack">← 返回雲林縣各鄉鎮市發電量統計</button>
                <h2>{{ selectedArea }} 統計資訊</h2>
                <p>案場數量：{{ selectedStats.sites }}</p>
                <p>總發電容量：{{ selectedStats.power }} kW</p>
                <div id="map" class="map"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
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
const selectedStats = ref({ sites: 0, power: 0 })
const totalSites = 320
const totalPower = 158000
let map = null
let geojsonLayer = null
let pieChart = null
let overviewMap = null
let overviewLayer = null
let stackedChart = null
const activeTab = ref('map')

function toggleAll() {
    const expand = !isAllExpanded.value
    expanded.value.city = expand
    expanded.value.town = expand
    expanded.value.village = expand
    isAllExpanded.value = expand
}

function goBack() {
    selectedArea.value = ''
    nextTick(() => {
        renderPieChart()
        renderStackedChart()
        renderOverviewMap()
    })
}

function selectArea(area) {
    selectedArea.value = area
    selectedStats.value = {
        sites: Math.floor(Math.random() * 100),
        power: Math.floor(Math.random() * 10000)
    }

    nextTick(() => {
        if (!map) initMap()
        else updateMapForArea(area)
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
        const res = await fetch('/geo/yunlin-townships.geojson')
        const data = await res.json()

        geojsonLayer = L.geoJSON(data, {
            style: feature => {
                const isMatch = feature.properties.TOWNNAME === areaName
                return {
                    color: '#007bff',
                    fillColor: isMatch ? '#007bff' : '#ffffff',
                    fillOpacity: isMatch ? 0.5 : 0.9,
                    weight: isMatch ? 2 : 1
                }
            }
        }).addTo(map)

        const selectedFeature = data.features.find(f => f.properties.TOWNNAME === areaName)
        if (selectedFeature) {
            const bounds = L.geoJSON(selectedFeature).getBounds()
            map.fitBounds(bounds)
        }
    } catch (e) {
        console.error('無法載入地圖資料', e)
    }
}

function renderPieChart() {
    const labels = [...areas.city, ...areas.town, ...areas.village]
    const values = labels.map(() => Math.floor(Math.random() * 10000) + 1000)

    const ctx = document.getElementById('myPieChart')
    if (pieChart) pieChart.destroy()

    pieChart = new window.Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: labels.map(() => `hsl(${Math.random() * 360}, 70%, 70%)`)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 30,
                    bottom: 30,
                    left: 30,
                    right: 30
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    color: '#333',
                    textAlign: 'center',
                    font: {
                        size: 11,
                        weight: 'bold'
                    },
                    formatter: (value, ctx) => {
                        const label = ctx.chart.data.labels[ctx.dataIndex]
                        return `${label}\n${value} kW`
                    },
                    anchor: function(context) {
                        return 'end'
                    },
                    align: function(context) {
                        return 'center'
                    },
                    offset: function(context) {
                        return 8
                    },
                    clamp: true,
                    display: function(context) {
                        const value = context.dataset.data[context.dataIndex]
                        const total = context.dataset.data.reduce((a, b) => a + b, 0)
                        const percentage = (value / total) * 100
                        return percentage > 0.1
                    },
                    listeners: {
                        enter: function(context) {
                            context.element.opacity = 1
                        },
                        leave: function(context) {
                            context.element.opacity = 0.8
                        }
                    },
                    draw: function(context) {
                        const ctx = context.chart.ctx
                        const element = context.element
                        const meta = context.chart.getDatasetMeta(0)
                        const dataIndex = context.dataIndex
                        const arc = meta.data[dataIndex]
                        const center = arc.getCenterPoint()
                        const angle = (dataIndex / meta.data.length) * 2 * Math.PI - Math.PI / 2
                        
                        // 計算標籤的最終位置
                        const radius = arc.outerRadius + 50
                        const labelRadius = radius + 50
                        
                        // 計算引線的起點（在圓餅圖邊緣）
                        const startX = center.x + Math.cos(angle) * radius
                        const startY = center.y + Math.sin(angle) * radius
                        
                        // 計算標籤的位置
                        const labelX = center.x + Math.cos(angle) * labelRadius
                        const labelY = center.y + Math.sin(angle) * labelRadius
                        
                        // 更新元素位置
                        element.x = labelX
                        element.y = labelY
                        
                        // 繪製引線
                        ctx.beginPath()
                        ctx.strokeStyle = '#666'
                        ctx.lineWidth = 1
                        ctx.moveTo(startX, startY)
                        ctx.lineTo(labelX, labelY)
                        ctx.stroke()
                    }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => {
                            const total = values.reduce((a, b) => a + b, 0)
                            const percentage = ((ctx.raw / total) * 100).toFixed(1)
                            return `${ctx.label}：${ctx.raw} kW (${percentage}%)`
                        }
                    }
                }
            }
        }
    })
}

function renderStackedChart() {
    const labels = [...areas.city, ...areas.town, ...areas.village]
    const sites = labels.map(() => Math.floor(Math.random() * 50) + 10)
    const power = labels.map(() => Math.floor(Math.random() * 10000) + 1000)
    
    // 創建數據對象數組並排序
    const data = labels.map((label, index) => ({
        label,
        sites: sites[index],
        power: power[index]
    })).sort((a, b) => b.power - a.power)

    const ctx = document.getElementById('myStackedChart')
    if (stackedChart) stackedChart.destroy()

    stackedChart = new window.Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.label),
            datasets: [
                {
                    label: '案場數量',
                    data: data.map(item => item.sites),
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: '發電容量 (kW)',
                    data: data.map(item => item.power),
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
    })
}

async function renderOverviewMap() {
    if (overviewMap) overviewMap.remove()
    overviewMap = L.map('overviewMap').setView([23.709, 120.431], 11)
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

        overviewMap.fitBounds(overviewLayer.getBounds(), {
            padding: [20, 20]
        })

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

onMounted(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js'
    script.onload = () => {
        const datalabelsScript = document.createElement('script')
        datalabelsScript.src = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0'
        datalabelsScript.onload = () => {
            window.Chart.register(window.ChartDataLabels)
            renderPieChart()
            renderStackedChart()
            renderOverviewMap()
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
    display: flex;
    flex-direction: column;
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
    padding: 0;
}

.overview-map {
    width: 100%;
    height: 100%;
}

.charts-container {
    width: 100%;
    height: calc(100vh - 200px);
    padding: 0;
}

.charts-row {
    display: flex;
    height: 100%;
    gap: 0;
}

.chart-wrapper {
    flex: 1;
    max-width: 50%;
    background: white;
    padding: 10px;
    border-radius: 0;
    box-shadow: none;
}

.chart {
    width: 100%;
    height: 100%;
}

#map {
    width: 100%;
    height: calc(100vh - 180px);
}

h2 {
    margin: 20px;
    color: #038686;
    font-size: 24px;
    text-align: center;
}

.map,
.overview-map {
    width: 100%;
    height: calc(100vh - 180px);
    margin-top: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
    width: 100%;
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
</style>