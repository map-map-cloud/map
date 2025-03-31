<template>
  <div class="a">
    <!-- 資料選擇器 -->
    <div class="cardc scrollbar">
      <div class="other">
        其他光電案場
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
        <input type="text" class="form-control" name="search" placeholder="搜尋已登記場案" v-model="searchQuery">
      </div>
      <!-- 農場資訊卡片 -->
      <div v-for="farm in filteredFarms" :key="farm.id" class="card" style="padding-bottom: 0px;">
        <div>
          <div class="h-d-flex h-mb-3 h-align-items-center">
            <h2 class="h-flex-1">
              <a :href="`/Information/${farm.id}`" style="text-decoration: none; color: rgb(63, 63, 63);">
                {{ farm.name }}
              </a>
            </h2>
          </div>
          <p class="h5 h-text-dark" @click="focusOnLocation(farm.latitude, farm.longitude)"
            style="cursor: pointer;">
            {{ farm.address }}
          </p>
          <p class="h5 h-text-dark">{{ farm.phone || '未提供' }}</p>
          <div class="card-body">
            <RouterLink :to="`/Information/${farm.id}`" class="card-body-t">
              詳細資料 <font-awesome-icon icon="fa-solid fa-arrow-right" />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- 其餘的模板代碼保持不變 -->
    <div class="mapContainer" ref="mapContainer">
      <div class="layer-select">
        <button class="layer-icon" @click="toggleLayerMenu">
          <span class="icon-letter">L</span>
        </button>
        <div v-if="isLayerMenuVisible" class="layer-dropdown">
          <select id="layerSelect" class="form-control" v-model="selectedLayer" @change="changeLayer">
            <option value="streets">街道圖層</option>
            <option value="terrain">地形圖層</option>
          </select>
        </div>
      </div>
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

// 地圖及資料初始化
const farms = ref([]);
const mapContainer = ref(null);
const farmMarkers = L.markerClusterGroup();
const newMarkers = L.markerClusterGroup();
const selectedDataType = ref(0);
const selectedLayer = ref('streets');
const searchQuery = ref(''); // 新增搜尋查詢變數

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

// 獲取農場資料的函數
const fetchFarms = async () => {
  try {
    const response = await fetch('https://soezsell.com/test-map/data.php');
    const data = await response.json();
    farms.value = data;
    addFarmMarkers(data);
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

// 添加農場標記
const addFarmMarkers = (farmData) => {
  farmData.forEach((farm) => {
    const marker = L.marker([farm.latitude, farm.longitude], { icon: customIcon })
      .bindPopup(`
        <div class="pop">
          <h3>${farm.name}</h3>
          <div>地址: ${farm.address}</div>
          <div>電話: ${farm.phone || '未提供'}</div>
          <div style="margin-top: 10px;">
            <a href="/Information/${farm.id}" style="color: blue; text-decoration: underline;" target="_blank">
              查看詳細資料
            </a>
          </div>
        </div>
      `);
    farmMarkers.addLayer(marker);
  });
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
      // 動態附加類型標籤
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

// 更改地圖圖層的函數
const changeLayer = () => {
  map.eachLayer((layer) => {
    if (layer instanceof L.TileLayer) {
      map.removeLayer(layer);
    }
  });

  let layerUrl;
  switch (selectedLayer.value) {
    case 'satellite':
      layerUrl = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
      break;
    case 'terrain':
      layerUrl = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
      break;
    default:
      layerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  }

  L.tileLayer(layerUrl, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
};

// 聚焦到指定座標
const focusOnLocation = (lat, lng) => {
  if (map) {
    map.setView([lat, lng], 15);
  }
};

onMounted(() => {
  // 初始化地圖
  map = L.map(mapContainer.value, {
    center: [23.7101, 120.602125],
    zoom: 10,
  });

  // 初始化默認的底圖
  changeLayer();

  // 自訂標記圖示
  customIcon = L.icon({
    iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    iconSize: [22, 32],
  });

  // 自訂目前位置的圖示
  const currentLocationIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/map-map-cloud/map/refs/heads/main/src/assets/location.png", // 修改圖標顏色或樣式
    iconSize: [22, 32],
  });

  // 添加標記群集層
  map.addLayer(farmMarkers);
  map.addLayer(newMarkers);

  fetchFarms(); // 獲取並顯示農場資料

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
    drawItem.addLayer(layer); // 必須將畫完的圖層加入
    console.log("繪製的圖層:", layer);
  });

  // 添加「定位」圖標按鈕
  const locateIcon = L.Control.extend({
    options: {
      position: "topleft", // 設定圖標位置
    },
    onAdd: function () {
      const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
      const icon = L.DomUtil.create("a", "", container);
      icon.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" style="width:24px;height:24px;" alt="定位" />`; // 定位圖標
      icon.href = "#";

      // 點擊事件：定位使用者
      L.DomEvent.on(icon, "click", function (e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        locateUser(); // 呼叫定位函數
      });

      return container;
    },
  });

  // 在地圖上新增定位按鈕
  map.addControl(new locateIcon());

  // 定義定位函數
  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // 將地圖中心設為目前位置
          map.setView([latitude, longitude], 15);

          // 在地圖上顯示目前位置的標記
          const currentLocationMarker = L.marker([latitude, longitude], {
            icon: currentLocationIcon, // 使用不同的圖示
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
          enableHighAccuracy: true, // 啟用高精度模式
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
  /* 調整地圖容器的高度 */
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

/*footer*/
.footer {
  width: 100%;
  background-color: #038686;
  height: 50px;
  line-height: 50px;
}

.fo {
  max-width: 95%;
  margin: 0px auto;
  color: #f7f5ed;
}

.footer_logo {
  margin: 0px auto;
  text-align: center;
}

a {
  text-decoration: none;
  color: #fff;
}

/*響應式*/
@media (min-width: 389px) {
  .cardc {
    height: 30vh;
  }

  .Information {
    width: 100%;
  }

  /*搜尋*/
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

  /*搜尋*/
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
  /* 讓選單浮在地圖上 */
  top: 10px;
  /* 你可以根據需要調整 */
  left: 50px;
  /* 你可以根據需要調整 */
  z-index: 1000;
  /* 確保它在地圖之上 */
  background: white;
  /* 背景顏色 */
  padding: 10px;
  /* 內邊距 */
  border-radius: 5px;
  /* 圆角 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  /* 陰影效果 */
}
</style>


<script>
export default {
  data() {
    return {
      selectedLayer: 'streets',
      isLayerMenuVisible: false,
    };
  },
  methods: {
    toggleLayerMenu() {
      this.isLayerMenuVisible = !this.isLayerMenuVisible;
    },
    changeLayer() {
      console.log('Selected Layer:', this.selectedLayer);
      this.isLayerMenuVisible = false; // 選擇圖層後自動關閉選單
    },
  },
};
</script>

<style>
.layer-select {
  padding: 0px !important;
  position: relative;
}

.layer-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  /* font-size: 24px; */
  color: #007bff;
  width: 30px;
  height: 30px;
}

.layer-dropdown {
  position: absolute;
  top: 40px;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  z-index: 10;
  padding: 10px;
  width: max-content;

}
</style>