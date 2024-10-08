<template>
  <div class="a">
    <div class="cardc scrollbar">
      <div
        class="card"
        style="width: 100% margin: 0px 0px;padding: 0rem 1rem;"
        v-if="area"
      >
        <img :src="img" class="Information-img" />
        <div class="InformationT">
          <RouterLink :to="`/Information/${id}`" class="Information-title">{{
            name
          }}</RouterLink>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <h6 class="list-group-item-h6">農作物資訊</h6>
            <p class="Information-text">{{ area }}</p>
            <p class="Information-text">{{ c }}</p>
            <P class="Information-text">{{ amount }}</P>
          </li>
          <li class="list-group-item">
            <h6 class="list-group-item-h6">能源資訊</h6>
            <P class="Information-text">{{ category }}</P>
            <P class="Information-text">{{ electricity }}</P>
            <P class="Information-text">{{ location }}</P>
            <P class="Information-text">{{ capacity }}</P>
          </li>
          <li class="list-group-item">
            <h6 class="list-group-item-h6">溫室氣體盤查資訊</h6>
            <P class="Information-text">{{ co2 }}</P>
          </li>
        </ul>
        <div class="card-body">
          <RouterLink :to="`/Information/${id}`" class="card-body-t">
            詳細資料<font-awesome-icon icon="fa-solid fa-arrow-right" />
          </RouterLink>
        </div>
      </div>
      <div class="p-sideContent scrollbar" v-else>
        <div class="card" v-for="(item, key) in data" :key="key">
          <div class="h-d-flex h-mb-3 h-align-items-center">
            <h2 class="h-flex-1">
              <RouterLink
                :to="`/Information/${item.id}`"
                style="text-decoration: none; color: #3f3f3f"
                >{{ item.name }}
              </RouterLink>
            </h2>
          </div>
          <p class="h5 h-text-dark">{{ item.address }}</p>
          <!-- <p class="h5 h-text-dark">{{ item.iphon }}</p> -->
          <div class="k">
            <RouterLink :to="`/Information/${item.id}`" class="card-body-t">
              詳細資料<font-awesome-icon icon="fa-solid fa-arrow-right" />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
    <!--地圖呈現在此-->
    <div class="mapContainer" ref="mapContainer"></div>
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
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/leaflet.markercluster";
import "../assets/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet-draw/dist/leaflet.draw";
import "leaflet-draw/dist/leaflet.draw.css";
import allData from "../data/xinyi.json";
import cityName from "../data/cityName.json";
import { onMounted, ref } from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

const mapContainer = ref(null);
const img = ref(null);
const id = ref(null);
const name = ref(null);
const area = ref(null);
const c = ref(null);
const amount = ref(null);
const proele = ref(null);
const co2 = ref(null);
const reduceCo2 = ref(null);
const category = ref(null);
const electricity = ref(null);
const location = ref(null);
const capacity = ref(null);
const markers = L.markerClusterGroup();
const data =ref(null);
const length = ref(null);

onMounted(() => {
  axios
    .get("https://soezsell.com/test-map/1.php")
    .then((response) => {
      console.log("2222", response);
      data.value = response.data.sites;
      length.value = data.value.length;
      
      for (let i = 0; length.value > i; i++) {
        console.log("data.length55", length.value);
        markers.addLayer(
          L.marker([data.value[i].latitude, data.value[i].longitude], { icon: customIcon })
            .bindPopup(
              `<div class="InfoWindowOpened-text ">
        <h3>` +
                data.value[i].name +
                `</h3><p style="font-size: 12px;">地址:` +
                data.value[i].address +
                `</p>`
            )
            .on("click", () => {
              console.log("id", data.value[i].id);
              axios.get(`https://soezsell.com/test-map/1.php?count=${data.value[i].id}`)
                .then((response) => {
                  area.value = "種植面積: " + response.data.site.Crops.area + "分地";
                  c.value = "農作物型態: " + response.data.site.Crops.cropType;
                  amount.value = "預估總農作產量: " + response.data.site.Crops.totalOutput + "噸";
                  category.value = "發電設備類型: " + response.data.site.Energies.equipment;
                  electricity.value = "再生能源類型: " + response.data.site.Energies.energyType;
                  location.value = "裝置設置位置: " + response.data.site.Energies.location;
                  capacity.value = "總裝置容量: " + response.data.site.Energies.capacity;
                  co2.value = "溫室氣體排放量: " + response.data.site.Gas.emissions + "公斤";
                })
              img.value = data.value[i].image;
              id.value = data.value[i].id;
              name.value = data.value[i].name;

            })
        );
      }
    })
    .catch((response) => {
      console.log(response);
    });
  //建立地圖物件
  const map = L.map(mapContainer.value, {
    center: [23.7101, 120.602125],
    zoom: 10,
  });

  //L.tileLayer建立圖資
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  //繪圖工具&繪圖
  var drawItem = new L.FeatureGroup();
  map.addLayer(drawItem);
  var option = {
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
  var drawControl = new L.Control.Draw(option);
  map.addControl(drawControl);
  map.on(L.Draw.Event.CREATED, function (e) {
    var layer = e.layer;
    drawItem.addLayer(layer); // 必須將畫完的圖層加入
    console.log(arguments);
  });

  //客製化Marker
  const customIcon = L.icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    iconSize: [22, 32],
  });

  //Marker for迴圈標記 ,圖標上顯示訊息
  // for (let i = 0; data.length > i; i++) {
  //   markers.addLayer(
  //     L.marker([data[i].lat, data[i].lng], { icon: customIcon })
  //       .bindPopup(
  //         `<div class="InfoWindowOpened-text ">
  //       <h3>` +
  //           data[i].name +
  //           `</h3><p style="font-size: 12px;">地址:` +
  //           data[i].address +
  //           `<br>電話` +
  //           data[i].iphon +
  //           `</p>`
  //       )
  //       .on("click", () => {
  //         img.value = data[i].img;
  //         id.value = data[i].id;
  //         name.value = data[i].name;
  //         area.value = "種植面積: " + data[i].area + "分地";
  //         c.value = "農作物型態: " + data[i].c;
  //         amount.value = "預估總農作產量: " + data[i].amount + "噸";
  //         category.value = "發電設備類型: " + data[i].category;
  //         electricity.value = "再生能源類型: " + data[i].electricity;
  //         location.value = "裝置設置位置: " + data[i].location;
  //         capacity.value = "總裝置容量: " + data[i].capacity;
  //         co2.value = "溫室氣體排放量: " + data[i].co2 + "公斤";
  //       })
  //   );
  // }
  map.addLayer(markers);
});
</script>

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
}
</style>
