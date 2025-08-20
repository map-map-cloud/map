<template>
  <div class="a">
    <!-- 資料選擇器 -->
    <div class="cardc scrollbar">
      <div class="other">
        光電案場
        <select id="dataSelect" class="form-control" v-model="selectedDataType" @change="fetchData">
          <option value="0">無</option>
          <optgroup label="農業">
            <option value="1">不利農業經營區</option>
            <option value="4">菇類栽培相關設施</option>
            <option value="5">溫室</option>
            <option value="6">農糧製儲銷設施</option>
            <option value="7">農地變更專案</option>
          </optgroup>
          <optgroup label="漁業">
            <option value="2">漁業相關設施</option>
            <option value="9">漁電共生(地面型)</option>
          </optgroup>
          <optgroup label="畜牧業">
            <option value="3">畜禽舍</option>
          </optgroup>
          <option value="8">埤塘圳路及農業水庫</option>
        </select>
      </div>
      <hr>
      <div class="search">
        <input type="text" class="form-control" name="search" placeholder="搜尋青培站資訊" v-model="searchQuery">
      </div>
      <!-- 農場資訊卡片 -->
      <div v-for="farm in filteredFarms" :key="farm.id" class="card" style="padding-bottom: 0px;" @click="focusOnLocation(farm.address)">
        <div>
          <div class="h-d-flex h-mb-3 h-align-items-center">
            <h2 class="h-flex-1">
              <a style="text-decoration: none; color: rgb(63, 63, 63); cursor: pointer;">
                {{ farm.name }}
              </a>
            </h2>
          </div>
          <p class="h5 h-text-dark" style="cursor: pointer;">
            {{ farm.address }}
          </p>
          <div class="card-body">
            <a :href="farm.website" class="card-body-t" target="_blank">
              詳細資料 <font-awesome-icon :icon="['fas', 'arrow-right']" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="mapContainer" ref="mapContainer">
      <!-- 移除自訂圖層切換 UI -->
    </div>
  </div>

  <div class="footer" id="footer">
    <div class="fo">
      <div class="footer_logo">
        <span style="font-size: 20px">
          <p>亞洲大學</p>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw/dist/leaflet.draw.js";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHouse, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import youthIcon from '../assets/youth.svg'

library.add(faHouse, faArrowRight);

// 地圖及資料初始化
const farms = ref([]);
const mapContainer = ref(null);
const farmMarkers = L.markerClusterGroup({
  iconCreateFunction: function(cluster) {
    const count = cluster.getChildCount();
    let size = 'small';
    if (count > 100) {
      size = 'large';
    } else if (count > 10) {
      size = 'medium';
    }
    return L.divIcon({
      html: `<div><span>${count}</span></div>`,
      className: `marker-cluster-youth marker-cluster-youth-${size}`,
      iconSize: L.point(40, 40)
    });
  }
});
const newMarkers = L.markerClusterGroup();
const selectedDataType = ref(0);
const searchQuery = ref('');

// 過濾農場資料的計算屬性
const filteredFarms = computed(() => {
  if (!searchQuery.value) return farms.value;
  const query = searchQuery.value.toLowerCase();
  return farms.value.filter(farm =>
    farm.name.toLowerCase().includes(query)
  );
});

// 自訂標記圖示
let customIcon;
let map;

// 自訂青培站標記圖示
const youthIconDiv = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class=\"marker-pin blue\"><img src=\"${youthIcon}\" style=\"width:40px;height:40px;display:block;margin:auto;\" /></div>`,
  iconSize: [30, 42],
  iconAnchor: [15, 42]
});

// 獲取農場資料的函數
const fetchFarms = async () => {
  try {
    const response = await fetch('https://map.soezsell.com/api_youth_bases.php');
    const result = await response.json();
    
    if (result.status === 'success') {
      const farmsWithCoordinates = result.data.map((item) => {
        return {
          id: item.id,
          name: item.base_name,
          company_name: item.company_name,
          address: `${item.county}${item.town}${item.address}`,
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
          website: item.website,
          image_url: item.image_url
        };
      });
      
      farms.value = farmsWithCoordinates;
      addFarmMarkers(farms.value);
    } else {
      console.error('API 回傳錯誤:', result);
    }
  } catch (error) {
    console.error('獲取資料時出錯:', error);
  }
};

// 獲取選擇器資料的函數
const fetchData = async () => {
  const selectedValue = selectedDataType.value;
  try {
    const response = await fetch(`https://soezsell.com/test-map/Get_info.php?type=${selectedValue}`);
    const data = await response.json();
    newMarkers.clearLayers();
    addNewMarkers(data);
  } catch (error) {
    console.error('獲取資料時出錯:', error);
  }
};

const farmMarkersMap = {};

// 添加農場標記
const addFarmMarkers = (farmData) => {
  farmMarkers.clearLayers();
  Object.keys(farmMarkersMap).forEach(key => delete farmMarkersMap[key]);

  farmData.forEach((farm) => {
    if (farm.latitude && farm.longitude) {
      const marker = L.marker([farm.latitude, farm.longitude], { 
        icon: youthIconDiv
      })
        .bindPopup(`
          <div class="pop" style="text-align:center;min-width:180px;">
            <h3 style="font-size:1.15em;color:#1976d2;font-weight:bold;margin-bottom:6px;border-bottom:1.5px solid #90caf9;display:inline-block;padding:0 8px 2px 8px;">
              ${farm.name}
            </h3>
            <div style="margin:8px 0;">
              <img src="${farm.image_url}" alt="網站圖片" style="max-width:120px;max-height:80px;box-shadow:0 2px 8px #bbb;border-radius:10px;border:1.5px solid #e3f2fd;background:#fff;" />
            </div>
            <div style="color:#388e3c;font-weight:500;margin-bottom:2px;">${farm.company_name}</div>
            <div style="color:#616161;font-size:0.95em;margin-bottom:8px;">${farm.address}</div>
            <a href="${farm.website}" target="_blank" style="display:inline-block;padding:6px 16px;background:#1976d2;color:#fff;border-radius:20px;text-decoration:none;font-weight:500;box-shadow:0 2px 6px #90caf9;transition:background 0.2s;">
              查看詳細資料
            </a>
          </div>
        `);
      farmMarkers.addLayer(marker);
      farmMarkersMap[farm.id] = marker;
    }
  });
  
  map.addLayer(farmMarkers);
};

// 定義光電案場類型的對應標籤
const dataTypeLabels = {
  0: '', // 無
  1: '不利農業經營區',
  2: '漁業相關設施',
  3: '畜禽舍',
  4: '菇類栽培相關設施',
  5: '溫室',
  6: '農糧製儲銷設施',
  7: '農地變更專案',
  8: '埤塘圳路及農業水庫',
  9: '漁電共生(地面型)',
};

const addNewMarkers = (data) => {
  const selectedLabel = dataTypeLabels[selectedDataType.value] || '';

  data.forEach((item) => {
    if (item.X_84 && item.Y_84 && item.CapacityValNow > 0) {
      const displayName = selectedLabel ? `${item.Name} (${selectedLabel})` : item.Name;

      const circle = L.circle([item.X_84, item.Y_84], {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.5,
        radius: 50,
      }).bindPopup(`
        <div class="pop">
          <b>${displayName}</b><br>
          ${item.Land}<br>
          容量: ${item.CapacityValNow} kW
        </div>
      `);
      newMarkers.addLayer(circle);
    } else {
      console.error('無效的座標或容量不符合要求: ', item);
    }
  });
};

// 聚焦到指定座標
const focusOnLocation = (address) => {
  const farm = farms.value.find(f => f.address === address);
  if (farm && map) {
    map.setView([farm.latitude, farm.longitude], 15);
    if (farmMarkersMap[farm.id]) {
      farmMarkersMap[farm.id].openPopup();
    }
  }
};

onMounted(() => {
  // 初始化地圖
  map = L.map(mapContainer.value, {
    center: [23.7101, 120.602125],
    zoom: 10,
  });

  // 定義多個底圖
  const streetLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });
  const terrainLayer = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
  });

  // 預設加街道圖層
  streetLayer.addTo(map);

  // 建立底圖切換控制
  const baseLayers = {
    "街道圖層": streetLayer,
    "地形圖層": terrainLayer
  };
  L.control.layers(baseLayers, null, { position: 'topleft' }).addTo(map);

  // 自訂標記圖示
  customIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class=\"marker-pin\"><img src=\"/house.svg\" style=\"width:40px;height:40px;display:block;margin:auto;\" /></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  });

  // 添加標記群集層
  map.addLayer(farmMarkers);
  map.addLayer(newMarkers);

  fetchFarms();

  // 初始化繪圖控制
  const drawItem = new L.FeatureGroup();
  map.addLayer(drawItem);

  const option = {
    position: "topleft",
    collapsed: true,
    draw: {
      rectangle: false,
      marker: false,
      circlemarker: false,
    },
    edit: {
      featureGroup: drawItem,
    },
  };

  const drawControl = new L.Control.Draw(option);
  map.addControl(drawControl);

  map.on(L.Draw.Event.CREATED, function (e) {
    const layer = e.layer;
    drawItem.addLayer(layer);
    console.log("繪製的圖層:", layer);
  });

  // 添加「定位」圖標按鈕
  const locateIcon = L.Control.extend({
    options: {
      position: "topleft",
    },
    onAdd: function () {
      const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
      const icon = L.DomUtil.create("a", "", container);
      icon.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" style="width:24px;height:24px;" alt="定位" />`;
      icon.href = "#";

      L.DomEvent.on(icon, "click", function (e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        locateUser();
      });

      return container;
    },
  });

  map.addControl(new locateIcon());

  // 定義定位函數
  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 15);

          const currentLocationMarker = L.marker([latitude, longitude], {
            icon: customIcon,
          })
            .addTo(map)
            .bindPopup("目前位置")
            .openPopup();

          console.log("目前位置:", { latitude, longitude });
        },
        (error) => {
          console.error("定位失敗:", error.message);
          alert("無法取得目前位置，請檢查瀏覽器定位權限是否開啟。");
        },
        {
          enableHighAccuracy: true,
        }
      );
    } else {
      alert("您的瀏覽器不支援地理定位功能。");
    }
  };
});
</script>

<style>
.mapContainer {
  height: 500px;
}

/* 青培站標記群集樣式 */
.marker-cluster-youth {
  background: transparent !important;
  border-radius: 50%;
  overflow: hidden;
}

.marker-cluster-youth div {
  background: rgba(0, 123, 255, 0.85) !important;
  color: white;
  font-weight: bold;
  border-radius: 50% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255,255,255,0.8);
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.marker-cluster-youth-small {
  width: 34px !important;
  height: 34px !important;
}

.marker-cluster-youth-medium {
  width: 44px !important;
  height: 44px !important;
}

.marker-cluster-youth-large {
  width: 54px !important;
  height: 54px !important;
}

.marker-cluster-youth-small div {
  font-size: 12px;
}

.marker-cluster-youth-medium div {
  font-size: 14px;
}

.marker-cluster-youth-large div {
  font-size: 16px;
}

/* 自訂標記樣式 */
.custom-div-icon {
  background: none;
  border: none;
}

.marker-pin {
  background: none !important;
  border: none !important;
  width: auto !important;
  height: auto !important;
  position: static !important;
  transform: none !important;
  margin: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none !important;
}

.marker-pin.blue {
  background: none !important;
}

.marker-pin.green {
  background: none !important;
}

.marker-pin svg {
  color: white;
  transform: rotate(45deg);
  font-size: 16px;
  width: 16px;
  height: 16px;
}

.marker-pin::after {
  content: none !important;
  display: none !important;
}

.leaflet-control-layers {
  font-size: 1em;
  border-radius: 8px !important;
  box-shadow: 0 2px 8px #90caf9;
  padding: 2px 4px !important;
  min-width: 36px;
  min-height: 36px;
}

.leaflet-control-layers-toggle {
  width: 21px !important;
  height: 21px !important;
  background-size: 20px 20px !important;
}

.leaflet-control-layers-expanded {
  min-width: 120px;
  font-size: 1em;
  border-radius: 10px !important;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.15);
  border: 1.5px solid #90caf9;
  padding: 8px 10px 8px 10px !important;
}
</style>

<style scoped>
.a {
  width: 100%;
}

.mapContainer {
  width: 100%;
  height: 80vh;
}

.scrollbar {
  overflow-y: scroll;
  padding-left: 6px;
}

.scrollbar::-webkit-scrollbar {
  width: 6px;
}

.scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.scrollbar::-webkit-scrollbar-thumb {
  background: #038686;
  border-radius: 3px;
}

.scrollbar::-webkit-scrollbar-thumb:hover {
  background: #026d6d;
}

.cardc {
  background-color: #ffffff;
  width: 100%;
  height: 30vh;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.other {
  font-size: 1.2em;
  font-weight: 600;
  color: #038686;
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95em;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.form-control:focus {
  border-color: #038686;
  box-shadow: 0 0 0 3px rgba(3, 134, 134, 0.1);
  outline: none;
}

.search {
  margin: 20px 0;
}

.search input {
  width: 100%;
  padding: 12px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  font-size: 0.95em;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.search input:focus {
  border-color: #038686;
  box-shadow: 0 0 0 3px rgba(3, 134, 134, 0.1);
  outline: none;
}

.card {
  padding: 15px;
  border: none;
  border-radius: 10px;
  margin: 15px 0;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.h-flex-1 {
  font-size: 1.2em;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px;
  transition: color 0.3s ease;
}

.h-flex-1:hover {
  color: #038686;
}

.h5 {
  font-size: 0.95em;
  color: #64748b;
  margin: 8px 0;
}

.card-body-t {
  color: #038686;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.card-body-t:hover {
  color: #026d6d;
  transform: translateX(5px);
}

.card-body {
  width: 100%;
  display: flex;
  justify-content: end;
}

.card-body-t {
  text-decoration: none;
  color: #3f3f3f;
}

.card-body-t:hover {
  color: #038686;
}

.list-group-item-h6 {
  color: #7d848b;
  margin: 10px 0px;
  text-align: center;
}

.footer {
  position: fixed;
  bottom: 0px;
  width: 100%;
  background-color: #038686;
  color: white;
  text-align: center;
  z-index: 1000;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fo {
  max-width: 95%;
  margin: 0;
  color: #f7f5ed;
}

.footer_logo {
  margin: 0;
  text-align: center;
}

.footer_logo p {
  margin: 0;
}

a {
  text-decoration: none;
  color: #fff;
}

@media (min-width: 389px) {
  .cardc {
    height: 30vh;
  }

  .Information {
    width: 100%;
  }

  .p-sideContent {
    height: 60vh;
  }

  .card {
    padding: 0.9375rem 0.75rem;
  }
}

@media (min-width: 539px) {
  .cardc {
    height: 30vh;
  }
}

@media (min-width: 699px) {
  .cardc {
    height: 30vh;
  }

  .Information {
    width: 100%;
  }
}

@media (min-width: 819px) {
  .a {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .mapContainer {
    width: 75vw;
    height: 91vh;
  }

  .cardc {
    width: 25vw;
    height: 90vh;
    margin: 0px 10px;
  }

  .Information {
    width: 25vw;
  }

  .Information-img {
    max-width: 100%;
    margin: 10px auto;
    height: 250px;
  }

  .c-shrinkIcon__input {
    width: 100%;
  }

  .p-sideContent {
    height: 90vh;
  }

  .pop {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  .pop h3,
  .pop p {
    margin: 0px;
  }
}

.layer-select {
  position: absolute;
  top: 18px;
  left: 68px;
  z-index: 1000;
  background: transparent;
  padding: 0;
}

.layer-icon {
  background: #1976d2;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  box-shadow: 0 2px 8px #90caf9;
  color: #fff;
  font-size: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, box-shadow 0.2s;
  cursor: pointer;
  outline: none;
}

.layer-icon:hover {
  background: #1565c0;
  box-shadow: 0 4px 16px #1976d2;
}

.icon-letter {
  font-weight: bold;
  font-size: 1em;
  letter-spacing: 1px;
}

.layer-dropdown {
  position: absolute;
  top: 54px;
  left: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.15);
  border: 1.5px solid #90caf9;
  z-index: 10;
  padding: 16px 18px 12px 18px;
  min-width: 140px;
}

.layer-dropdown select.form-control {
  width: 100%;
  border-radius: 8px;
  border: 1.5px solid #90caf9;
  padding: 8px 12px;
  font-size: 1em;
  background: #f5fafd;
  color: #1976d2;
  outline: none;
  transition: border 0.2s;
}

.layer-dropdown select.form-control:focus {
  border: 1.5px solid #1976d2;
}
</style> 