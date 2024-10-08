<template>
  <div class="a">
    <!-- 資料選擇器 -->
    <div class="cardc scrollbar">
      <div class="other">
        其他光電案場
        <select id="dataSelect" class="form-control" v-model="selectedDataType" @change="fetchData">
          <option value="0">無</option>
          <option value="1">不利農業經營區</option>
          <option value="2">漁業相關設施</option>
          <option value="3">畜禽舍</option>
          <option value="4">菇類栽培相關設施</option>
          <option value="5">溫室</option>
          <option value="6">農糧製儲銷設施</option>
          <option value="7">農地變更專案</option>
          <option value="8">埤塘圳路及農業水庫</option>
          <option value="9">漁電共生(地面型)</option>
        </select>
      </div><hr>

      <!-- 農場資訊卡片 -->
      <div v-for="farm in farms" :key="farm.id" class="card" style="padding-bottom: 0px;">
        <div>
          <div class="h-d-flex h-mb-3 h-align-items-center">
            <h2 class="h-flex-1">
              <a :href="`/Information/${farm.id}`" style="text-decoration: none; color: rgb(63, 63, 63);">
                {{ farm.name }}
              </a>
            </h2>
          </div>
          <p class="h5 h-text-dark">{{ farm.address }}</p>
          <p class="h5 h-text-dark">{{ farm.phone || '未提供' }}</p>
          <div class="card-body">
            <RouterLink :to="`/Information/${farm.id}`" class="card-body-t">
              詳細資料 <font-awesome-icon icon="fa-solid fa-arrow-right" />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
    
<!-- 地圖容器 -->
<div class="mapContainer" ref="mapContainer">
  <!-- 圖層選擇器 -->
  <div class="layer-select">
    <button class="layer-icon" @click="toggleLayerMenu">
      <span class="icon-letter">L</span>
    </button>
    <div v-if="isLayerMenuVisible" class="layer-dropdown">
      <!-- <label for="layerSelect">選擇地圖圖層:</label> -->
      <select id="layerSelect" class="form-control" v-model="selectedLayer" @change="changeLayer">
        <option value="streets">街道圖層</option>
        <option value="terrain">地形圖層</option>
      </select>
    </div>
  </div>
</div>

  </div>

    <!-- footer -->
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
import { onMounted, ref } from "vue";
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

// 自訂標記圖示
let customIcon;
let map;

// 獲取農場資料的函數
const fetchFarms = async () => {
  try {
    const response = await fetch('https://soezsell.com/test-map/1.php');
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
        </div>
      `);
    farmMarkers.addLayer(marker);
  });
};

// 添加新資料標記
const addNewMarkers = (data) => {
  data.forEach((item) => {
    if (item.X_84 && item.Y_84 && item.CapacityValNow > 0) {
      const circle = L.circle([item.X_84, item.Y_84], {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.5,
        radius: 50,
      }).bindPopup(`
        <div class="pop">
          <b>${item.Name}</b><br>
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
    console.log('繪製的圖層:', layer);
  });
});
</script>

<style>
.mapContainer {
  height: 500px; /* 調整地圖容器的高度 */
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
  width: 3px;
}

.scrollbar::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background-color: #ffffff;
}

.cardc {
  background-color: #ffffff;
  width: 100%;
  height: 30vh;
}

.Information {
  background-color: #ffffff;
  width: 100%;
  margin: 0px auto;
  height: 30vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.Information-img {
  max-width: 100%;
  margin: 10px auto;
}

.InformationT {
  width: 100%;
  margin: 10px auto;
  text-align: center;
}

.Information-title {
  color: #3f3f3f;
  font-size: 25px;
  text-decoration: none;
}

.Information-title:hover {
  color: #038686;
}

.Information-text {
  color: #3f3f3f;
  font-size: 16px;
  margin: 10px 0px;
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

/*搜尋*/
.c-shrinkIcon__input {
  font-size: 1rem;
  height: 31px;
  width: 90%;
  background-color: #fff;
  border-style: solid;
  border-color: #1e1c1b;
  border-width: 3px;
  padding-left: 10px;
  padding-right: 35px;
  border-radius: 20px;
  margin-top: 10px;
}

.p-sideContent {
  overflow-y: auto;
  background-color: #fff;
  height: 50vh;
  line-height: 32px;
}

.card {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #d9d9d9;
  margin: 20px 0px;
  -webkit-box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
}

.k {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.h-flex-1 {
  font-size: 20px;
  font-weight: 900;
  text-decoration: none;
  margin-bottom: 30px;
}

.h5 {
  font-size: 16px;
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
  position: absolute; /* 讓選單浮在地圖上 */
  top: 10px; /* 你可以根據需要調整 */
  left: 50px; /* 你可以根據需要調整 */
  z-index: 1000; /* 確保它在地圖之上 */
  background: white; /* 背景顏色 */
  padding: 10px; /* 內邊距 */
  border-radius: 5px; /* 圆角 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); /* 陰影效果 */
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
