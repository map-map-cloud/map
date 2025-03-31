<template>
  <div class="dashboard" v-if="dataLoaded">
    <div class="name">
      <div>
        <p class="name-title">{{ name }}</p>
      </div>
      <div class="systemurl-title text-end" v-if="systemurl" style="bottom: 10px;">
        <a :href="systemurl" target="_blank">
          <button class="btn btn-secondary">後台網址：{{ systemurl }}</button>
        </a>
      </div>
    </div>

    <!-- 場域資訊 -->
    <div class="row">
      <div class="col-xl-7">
        <div class="card-box-4">
          <h4 class="header-title mt-0 mb-3">場域資訊</h4>
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <tbody>
                <tr>
                  <td>場域地址:</td>
                  <td>
                    {{ address }}
                    <a :href="`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`"
                      target="_blank" class="google-maps-link">
                      <img src="/src/assets/Google-maps-icon.png" alt="Google Maps"
                        style="margin-left: 8px; width: 24px; height: 24px; vertical-align: middle;" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>場域經度座標:</td>
                  <td>{{ longitude }}</td>
                </tr>
                <tr>
                  <td>場域緯度座標:</td>
                  <td>{{ latitude }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-xl-5">
        <!-- 嵌入 OpenStreetMap iframe -->
        <iframe v-if="mapUrl" :src="mapUrl" style="width: 100%; height: 250px; border: 0; position: relative;"
          allowfullscreen="" loading="lazy"></iframe>
        <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 25px; background: white;"></div>
      </div>
    </div>

    <!-- 農作物資訊 -->
    <div class="name">
      <div>
        <p class="name-title">農作物資訊</p>
      </div>
    </div>

    <div class="row">
      <div class="col-xl-4 col-md-4 col-sm-6" v-for="(value, key) in cropData" :key="key">
        <div class="card-box-3 widget-user">
          <div>
            <div class="wid-u-info">
              <h5 class="mt-0">{{ key }}:</h5>
              <p class="text-muted-3 mb-1 font-13 text-truncate">
                {{ value }}
                <small v-if="unitMapping[key]">{{ unitMapping[key] }}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 能源資訊 -->
    <div class="name">
      <div>
        <p class="name-title">能源資訊</p>
      </div>
    </div>

    <div class="row">
      <div class="col-xl-4 col-md-4 col-sm-6" v-for="(value, key) in energyData" :key="key">
        <div class="card-box-3 widget-user">
          <div>
            <div class="wid-u-info">
              <h5 class="mt-0">{{ key }}:</h5>
              <p class="text-muted-3 mb-1 font-13 text-truncate">
                {{ value }}
                <small v-if="unitMapping[key]">{{ unitMapping[key] }}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
  <!-- footer -->
  <div class="wrapper">
    <div class="wave"></div>
    <div class="wave two"></div>
    <div class="wave three"></div>
    <div class="fo">
      <div class="footer_logo">
        <span style="font-size: 24px">
          <p>亞洲大學</p>
        </span>
      </div>
      <div class="footer-text">
        <p class="footer-text-i">聯絡我們</p>
        <hr />
        <p class="footer-text-i">地址:41354台中市霧峰區柳豐路500號</p>
        <p class="footer-text-i">電話: 04-23323456#6502</p>
        <p class="footer-text-i">信箱:cnwang@aisa.edu.tw</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      systemurl: "",
      address: "",
      longitude: 0,
      latitude: 0,
      mapUrl: "",
      cropData: {
        "作物名稱": "",
        "種植面積": "",
        "種植時間": "",
        "預估收成日期": "",
        "預估每株農作產量": "",
        "預估總農作產量": "",
      },
      energyData: {
        "能源類型": "",
        "能源設備名稱": "",
        "裝置容量": "",
        "每月預估產量": "",
        "每月預估耗能": "",
        "溫室氣體排放量": "",
        "減碳量": "",
      },
      unitMapping: {
        "種植面積": "平方公尺",
        "預估每株農作產量": "公斤",
        "預估總農作產量": "公斤",
        "裝置容量": "kW",
        "每月預估產量": "kWh",
        "每月預估耗能": "kWh",
        "溫室氣體排放量": "公斤",
        "減碳量": "公斤",
      },
      dataLoaded: false,
    };
  },
  setup() {
    const route = useRoute();
    return { route };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const id = this.route.params.id;
        const response = await axios.get(
          `https://soezsell.com/test-map/data.php?count=${id}`
        );
        const data = response.data[0];

        this.name = data.name;
        this.systemurl = data.systemurl;
        this.address = data.address;
        this.longitude = data.longitude;
        this.latitude = data.latitude;

        // 設定地圖的 iframe URL
        this.mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${this.longitude - 0.01},${this.latitude - 0.01},${this.longitude + 0.01},${this.latitude + 0.01}&layer=mapnik&marker=${this.latitude},${this.longitude}`;

        // 農作物資訊
        this.cropData["作物名稱"] = data.crop_name;
        this.cropData["種植面積"] = data.cultivation_area;
        this.cropData["種植時間"] = data.planting_time;
        this.cropData["預估收成日期"] = data.harvest_time;
        this.cropData["預估每株農作產量"] = data.estimated_yield_per_unit;
        this.cropData["預估總農作產量"] = data.estimated_total_yield;

        // 能源資訊
        this.energyData["能源類型"] = data.energy_type;
        this.energyData["能源設備名稱"] = data.energy_equipment_name;
        this.energyData["裝置容量"] = data.capacity;
        this.energyData["每月預估產量"] = data.monthly_production_rate;
        this.energyData["每月預估耗能"] = data.monthly_consumption_rate;
        this.energyData["溫室氣體排放量"] = data.greenhouse_gas_emissions;
        this.energyData["減碳量"] = data.carbon_reduction;

        this.dataLoaded = true;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  },
};
</script>

<style scoped>
#map {
  height: 300px;
}

.dashboard {
  max-width: 90%;
  margin: 40px auto;
  padding: 0 20px;
}

.name {
  width: 100%;
  margin: 40px 0;
  text-align: center;
}

.name-title {
  font-size: 2.5em;
  font-weight: 700;
  color: #038686;
  margin: 0;
  position: relative;
  display: inline-block;
}

.name-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: #038686;
  border-radius: 2px;
}

.hrname {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact {
  position: fixed;
  bottom: 50px;
  right: 50px;
  margin-left: -25px;
  width: 50px;
  height: 50px;
  line-height: 50px;
  background: #333;
  color: #fff;
  text-align: center;
  border-radius: 50%;
  box-shadow: 1px 1px 5px 0px #666;
  cursor: pointer;
  z-index: 5;
}

.contact:hover {
  transform: translateY(-5px);
  transition-duration: 0.3s;
}

/*3排*/
.widget-chart-1 {
  display: inline-flex;
  justify-content: space-around;
  align-self: flex-end;
  width: 100%;
  margin: 20px auto;
}

.circle {
  --width: 100px;
  --percent: 60;
  --deg: calc(360deg * calc(var(--percent) / 100));
  width: var(--width);
  height: var(--width);
  border-radius: 50%;
  margin: 0px auto;
  background-image: conic-gradient(red var(--deg), #ccc var(--deg));
  position: relative;
}

.circle-inside {
  --bar-width: 15px;
  position: absolute;
  display: flex;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: #eee;
  width: calc(var(--width) - var(--bar-width));
  height: calc(var(--width) - var(--bar-width));
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.circle-2 {
  --width: 100px;
  --percent: 80;
  --deg: calc(360deg * calc(var(--percent) / 100));
  width: var(--width);
  height: var(--width);
  border-radius: 50%;
  margin: 0px auto;
  background-image: conic-gradient(rgb(255, 149, 0) var(--deg),
      #ccc var(--deg));
  position: relative;
}

.circle-inside-2 {
  --bar-width: 15px;
  position: absolute;
  display: flex;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: #eee;
  width: calc(var(--width) - var(--bar-width));
  height: calc(var(--width) - var(--bar-width));
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.circle-3 {
  --width: 100px;
  --percent: 30;
  --deg: calc(360deg * calc(var(--percent) / 100));
  width: var(--width);
  height: var(--width);
  border-radius: 50%;
  margin: 0px auto;
  background-image: conic-gradient(rgb(1, 138, 15) var(--deg), #ccc var(--deg));
  position: relative;
}

.circle-inside-3 {
  --bar-width: 15px;
  position: absolute;
  display: flex;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: #eee;
  width: calc(var(--width) - var(--bar-width));
  height: calc(var(--width) - var(--bar-width));
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.widget-box-2 {
  width: 100%;
  margin: 20px auto;
}

.badge-1 {
  top: 50px;
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
  color: #fff;
}

.card-box-1:hover {
  background-color: #cfcfcf;
}

/*2排*/
.text-warning {
  left: 80%;
  font-size: 15px;
}

.text-muted-3 {
  margin: 0px auto;
  margin-top: 10px;
  font-size: 30px;
  color: #000;
  margin-top: 30px;
}

.card-box-3:hover {
  background-color: #cfcfcf;
}

/*4*/
.inbox-item {
  display: inline-flex;
  justify-content: space-around;
  align-self: flex-end;
  width: 100%;
  margin: 10px auto;
}

.inbox-item-date {
  top: 40px;
}

/*footer*/
.wrapper {
  width: 100%;
  height: 350px;
  background: #fff;
  position: relative;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
}

.wave {
  background: #038686;
  width: 1800px;
  height: 1800px;
  border-radius: 40%;
  opacity: 0.4;
  position: absolute;
  top: 95%;
  left: -100%;
  margin-left: -250px;
  margin-top: -250px;
  transform-origin: center;
  animation: drift 7s infinite linear;
}

.wave.two {
  animation: drift 9s infinite linear;
}

.wave.three {
  animation: drift 11s infinite linear;
  opacity: 0.1;
}

@keyframes drift {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.fo {
  max-width: 95%;
  margin: 0px auto;
  color: #f7f5ed;
  top: 110px;
  line-height: 24px;
}

.footer_logo {
  margin: 0px auto;
  margin-bottom: 40px;
  text-align: center;
  width: 100%;
  z-index: 1;
}

.footer-text {
  margin: 0px auto;
  width: 70%;
  text-align: center;
}

a {
  text-decoration: none;
  color: #fff;
}

/*響應式*/
@media (min-width: 359px) {
  .wave {
    left: -80%;
  }
}

@media (min-width: 524px) {
  .wave {
    left: -50%;
  }
}

@media (min-width: 779px) {
  .nametext {
    display: inline-flex;
    justify-content: space-around;
    align-self: flex-end;
    font-size: 18px;
  }

  .wave {
    left: -30%;
  }
}

@media (min-width: 919px) {
  .wave {
    left: -10%;
  }
}

@media (min-width: 1109px) {
  .wave {
    left: 5%;
  }
}

@media (min-width: 1499px) {
  .wave {
    left: 10%;
  }
}

/*分隔線*/
:root {
  --blue: #71b6f9;
  --indigo: #675aa9;
  --purple: #5b69bc;
  --pink: #ff8acc;
  --red: #ff5b5b;
  --orange: #fd7e14;
  --yellow: #f9c851;
  --green: #10c469;
  --teal: #02a8b5;
  --cyan: #35b8e0;
  --white: #fff;
  --gray: #98a6ad;
  --gray-dark: #343a40;
  --primary: #71b6f9;
  --secondary: #6c757d;
  --success: #10c469;
  --info: #35b8e0;
  --warning: #f9c851;
  --danger: #ff5b5b;
  --light: #f1f5f7;
  --dark: #323a46;
  --pink: #ff8acc;
  --purple: #5b69bc;
  --blue: #71b6f9;
  --breakpoint-xs: 0;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

p {
  margin-top: 0;
  margin-bottom: 1rem;
}

ul {
  margin-top: 0;
  margin-bottom: 1rem;
}

small {
  font-size: 80%;
}

img {
  vertical-align: middle;
  border-style: none;
}

table {
  border-collapse: collapse;
}

th {
  text-align: inherit;
}

input {
  margin: 0px;
  width: 80px;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  overflow: visible;
}

.h2,
.h4,
.h5,
h2,
h4,
h5 {
  margin-bottom: 1.5rem;
  font-weight: 400;
  line-height: 1.1;
}

.h2,
h2 {
  font-size: 1.875rem;
}

.h4,
h4 {
  font-size: 1.125rem;
}

.h5,
h5 {
  font-size: 0.9375rem;
}

.small,
small {
  font-size: 0.75rem;
  font-weight: 400;
}

.list-inline {
  padding-left: 0;
  list-style: none;
}

.list-inline-item {
  display: inline-block;
}

.list-inline-item:not(:last-child) {
  margin-right: 6px;
}

.img-fluid {
  max-width: 100%;
  height: auto;
}

.row {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-right: -12px;
  margin-left: -12px;
}

.col-md-6,
.col-xl-3,
.col-xl-4,
.col-xl-8 {
  position: relative;
  width: 100%;
  padding-right: 12px;
  padding-left: 12px;
}

@media (min-width: 768px) {
  .col-md-6 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (min-width: 1200px) {
  .col-xl-3 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 25%;
    flex: 0 0 25%;
    max-width: 25%;
  }

  .col-xl-4 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 33.33333%;
    flex: 0 0 33.33333%;
    max-width: 33.33333%;
  }
}

.table {
  width: 100%;
  margin-bottom: 0;
}

.table td {
  padding: 15px;
  vertical-align: middle;
  border-top: 1px solid #e2e8f0;
  color: #64748b;
}

.table td:first-child {
  font-weight: 600;
  color: #1e293b;
  width: 40%;
}

.google-maps-link {
  display: inline-flex;
  align-items: center;
  margin-left: 10px;
  transition: transform 0.3s ease;
}

.google-maps-link:hover {
  transform: scale(1.1);
}

.card-box-3 {
  background-color: #ffffff;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 25px;
  transition: all 0.3s ease;
  height: auto;
}

.card-box-3:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.wid-u-info h5 {
  font-size: 1.1em;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px;
}

.text-muted-3 {
  font-size: 1.5em;
  font-weight: 600;
  color: #038686;
  margin: 0;
}

.btn-secondary {
  background-color: #038686;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: #026d6d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(3, 134, 134, 0.2);
}

.systemurl-title {
  margin-top: 20px;
}

/* 響應式調整 */
@media (max-width: 768px) {
  .dashboard {
    max-width: 95%;
    margin: 20px auto;
    padding: 0 15px;
  }

  .name-title {
    font-size: 2em;
  }

  .card-box-3 {
    padding: 20px;
  }

  .text-muted-3 {
    font-size: 1.3em;
  }
}

/* 地圖容器樣式 */
.col-xl-5 {
  position: relative;
}

.col-xl-5 iframe {
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.col-xl-5 iframe:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

/* 移除不需要的樣式 */
.card-box-1,
.card-box-2,
.badge,
.progress,
.float-left,
.sr-only,
.text-right,
.text-center,
.font-weight-normal,
.text-success,
.text-info,
.text-warning,
.text-pink,
.text-muted {
  display: none;
}

</style>