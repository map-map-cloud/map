<template>
  <div class="dashboard" v-if="dataLoaded">
    <div class="name">
      <div>
        <p class="name-title">{{ name }}</p>
      </div>
    </div>
    <!-- 第一排 -->
    <div class="row">
      <!-- 第1個 -->
      <div class="col-xl-8">
        <div class="card-box-4">
          <h4 class="header-title mt-0 mb-3">場域資訊</h4>
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <tbody>
                <tr>
                  <td>場域地址:</td>
                  <td>{{ address }}</td>
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
    </div>

    <!-- 農作物資訊 -->
    <div class="name">
      <div>
        <p class="name-title">農作物資訊</p>
      </div>
    </div>

    <!-- 第2排 -->
    <div class="row">
      <!-- 種植面積 -->
      <div class="col-xl-3 col-md-6">
        <div class="card-box-3 widget-user">
          <div>
            <div class="wid-u-info">
              <h5 class="mt-0">種植面積:</h5>
              <p class="text-muted-3 mb-1 font-13 text-truncate">{{ area }}</p>
              <small class="text-warning"><b>分地</b></small>
            </div>
          </div>
        </div>
      </div>

      <!-- 農作物型態 -->
      <div class="col-xl-3 col-md-6">
        <div class="card-box-3 widget-user">
          <div>
            <div class="wid-u-info">
              <h5 class="mt-0">農作物型態:</h5>
              <p class="text-muted-3 mb-1 font-13 text-truncate">{{ cropType }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 第3個 -->
      <div class="col-xl-3 col-md-6">
        <div class="card-box-3 widget-user">
          <div>
            <div class="wid-u-info">
              <h5 class="mt-0">預估每株農作產量:</h5>
              <p class="text-muted-3 mb-1 font-13 text-truncate">
                {{ amount }}
              </p>
              <small class="text-warning"><b>公斤</b></small>
            </div>
          </div>
        </div>
      </div>
      <!-- 預估總農作產量 -->
      <div class="col-xl-3 col-md-6">
        <div class="card-box-3 widget-user">
          <div>
            <div class="wid-u-info">
              <h5 class="mt-0">預估總農作產量:</h5>
              <p class="text-muted-3 mb-1 font-13 text-truncate">{{ totalOutput }}</p>
              <small class="text-warning"><b>噸</b></small>
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

    <!-- 第3排 -->
    <div class="row" style="margin-bottom: 100px">
      <!-- 發電設備類型 -->
      <div class="col-xl-3 col-md-6">
        <div class="card-box-1">
          <h4 class="header-title mt-0 mb-4">發電設備類型:</h4>
          <div class="widget-chart-1">
            <div class="widget-detail-1 text-right">
              <h2 class="font-weight-normal pt-2 mb-1">{{ equipment }}</h2>
            </div>
          </div>
        </div>
      </div>

      <!-- 再生能源類型 -->
      <div class="col-xl-3 col-md-6">
        <div class="card-box-1">
          <h4 class="header-title mt-0 mb-4">再生能源類型:</h4>
          <div class="widget-chart-1">
            <div class="widget-detail-1 text-right">
              <h2 class="font-weight-normal pt-2 mb-1">{{ energyType }}</h2>
              <p class="text-muted mb-1">PV</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 裝置設置位置 -->
      <div class="col-xl-3 col-md-6">
        <div class="card-box-1">
          <h4 class="header-title mt-0 mb-4">裝置設置位置:</h4>
          <div class="widget-chart-1">
            <div class="widget-detail-1 text-right">
              <h2 class="font-weight-normal pt-2 mb-1">{{ location }}</h2>
            </div>
          </div>
        </div>
      </div>

      <!-- 總裝置容量 -->
      <div class="col-xl-3 col-md-6">
        <div class="card-box-1">
          <h4 class="header-title mt-0 mb-4">總裝置容量:</h4>
          <div class="widget-chart-1">
            <div class="widget-detail-1 text-right">
              <h2 class="font-weight-normal pt-2 mb-1">{{ capacity }}</h2>
              <p class="text-muted mb-1">KW</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 第4排 -->
    <div class="row" style="margin-bottom: 100px">
      <!-- 第1個 -->
      <div class="col-xl-2 col-md-6">
        <div class="card-box-1">
          <h4 class="header-title mt-0 mb-4">溫室氣體排放量( ISO 14064):</h4>
          <div class="widget-chart-1">
            <div class="widget-detail-1 text-right">
              <h2 class="font-weight-normal pt-2 mb-1">{{ emissions }}</h2>
              <p class="text-muted mb-1">KG</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 第2個 -->
      <div class="col-xl-2 col-md-6">
        <div class="card-box-1">
          <h4 class="header-title mt-0 mb-4">減碳量( 每年發電量(kWh) *0.509/1000):</h4>
          <div class="widget-chart-1">
            <div class="widget-detail-1 text-right">
              <h2 class="font-weight-normal pt-2 mb-1">{{ reduceCo2 }}</h2>
              <p class="text-muted mb-1">KG</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Loading Spinner -->
  <div v-else>
    <p>Loading...</p>
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
import axios from 'axios';

export default {
  data() {
    return {
      name: "",
      address: "",
      longitude: 0,
      latitude: 0,
      area: "",
      cropType: "",
      totalOutput: "",
      equipment: "",
      energyType: "",
      location: "",
      capacity: "",
      dataLoaded: false
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        // 获取当前 URL
        const currentUrl = window.location.href;
        // 使用正则表达式提取 URL 中最后一个斜杠后的所有数字
        const countParam = currentUrl.match(/\/(\d+)$/)[1]; // 提取最后一个斜杠后的数字

        // 构建请求 URL
        const response = await axios.get(`https://soezsell.com/test-map/1.php?count=${countParam}`);
        const data = response.data[0];

        this.name = data.name;
        this.address = data.address;
        this.longitude = data.longitude;
        this.latitude = data.latitude;
        this.area = data.area;
        this.cropType = data.cropType;
        this.totalOutput = data.totalOutput;
        this.equipment = data.equipment;
        this.energyType = data.energyType;
        this.location = data.location;
        this.capacity = data.capacity;
        this.emissions = data.emissions;
        this.reduceCo2 = data.reduceCo2;
        this.amount = data.amount;

        this.dataLoaded = true; // 表示資料已載入完成
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }
};
</script>


<style scoped>
.dashboard {
  max-width: 80%;
  margin: 20px auto;
}

.name {
  width: 100%;
  margin: 0px 0px;
  text-align: center;
}

.name-title {
  font-size: 35px;
  margin: 70px 0px;
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
  width: 50%;
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
  margin-bottom: 1.5rem;
  color: #6c757d;
}

.table td,
.table th {
  padding: 0.55rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

.table-hover tbody tr:hover {
  color: #6c757d;
  background-color: #f1f5f7;
}

.table-responsive {
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.badge {
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
  -webkit-transition: color 0.15s ease-in-out,
    background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .badge {
    -webkit-transition: none;
    transition: none;
  }
}

a.badge:focus,
a.badge:hover {
  text-decoration: none;
}

.badge:empty {
  display: none;
}

.badge-pill {
  padding-right: 0.6em;
  padding-left: 0.6em;
  border-radius: 10rem;
}

.badge-primary {
  color: #fff;
  background-color: #71b6f9;
}

a.badge-primary:focus,
a.badge-primary:hover {
  color: #fff;
  background-color: #409df7;
}

a.badge-primary.focus,
a.badge-primary:focus {
  outline: 0;
  -webkit-box-shadow: 0 0 0 0.2rem rgba(113, 182, 249, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(113, 182, 249, 0.5);
}

.badge-success {
  color: #fff;
  background-color: #10c469;
}

a.badge-success:focus,
a.badge-success:hover {
  color: #fff;
  background-color: #0c9550;
}

a.badge-success.focus,
a.badge-success:focus {
  outline: 0;
  -webkit-box-shadow: 0 0 0 0.2rem rgba(16, 196, 105, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(16, 196, 105, 0.5);
}

.badge-warning {
  color: #343a40;
  background-color: #f9c851;
}

a.badge-warning:focus,
a.badge-warning:hover {
  color: #343a40;
  background-color: #f7b820;
}

a.badge-warning.focus,
a.badge-warning:focus {
  outline: 0;
  -webkit-box-shadow: 0 0 0 0.2rem rgba(249, 200, 81, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(249, 200, 81, 0.5);
}

.badge-danger {
  color: #fff;
  background-color: #ff5b5b;
}

a.badge-danger:focus,
a.badge-danger:hover {
  color: #fff;
  background-color: #ff2828;
}

a.badge-danger.focus,
a.badge-danger:focus {
  outline: 0;
  -webkit-box-shadow: 0 0 0 0.2rem rgba(255, 91, 91, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(255, 91, 91, 0.5);
}

.badge-pink {
  color: #fff;
  background-color: #ff8acc;
}

a.badge-pink:focus,
a.badge-pink:hover {
  color: #343a40;
  background-color: #ff57b6;
}

a.badge-pink.focus,
a.badge-pink:focus {
  outline: 0;
  -webkit-box-shadow: 0 0 0 0.2rem rgba(255, 138, 204, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(255, 138, 204, 0.5);
}

.badge-purple {
  color: #fff;
  background-color: #5b69bc;
}

a.badge-purple:focus,
a.badge-purple:hover {
  color: #fff;
  background-color: #4250a2;
}

a.badge-purple.focus,
a.badge-purple:focus {
  outline: 0;
  -webkit-box-shadow: 0 0 0 0.2rem rgba(91, 105, 188, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(91, 105, 188, 0.5);
}

.progress {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  height: 0.625rem;
  overflow: hidden;
  font-size: 0.75rem;
  background-color: #e9ecef;
  border-radius: 0.25rem;
}

.progress-bar {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  background-color: #71b6f9;
  -webkit-transition: width 0.6s ease;
  transition: width 0.6s ease;
}

@media (prefers-reduced-motion: reduce) {
  .progress-bar {
    -webkit-transition: none;
    transition: none;
  }
}

.float-left {
  float: left !important;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.text-right {
  text-align: right !important;
}

.text-center {
  text-align: center !important;
}

.font-weight-normal {
  font-weight: 400 !important;
}

.text-success {
  color: #10c469 !important;
}

a.text-success:focus,
a.text-success:hover {
  color: #0a7d43 !important;
}

.text-info {
  color: #35b8e0 !important;
}

a.text-info:focus,
a.text-info:hover {
  color: #1b8bae !important;
}

.text-warning {
  color: #98a6ad !important;
}

a.text-warning:focus,
a.text-warning:hover {
  color: #f5b008 !important;
}

.text-pink {
  color: #ff8acc !important;
}

a.text-pink:focus,
a.text-pink:hover {
  color: #ff3eab !important;
}

.text-muted {
  color: #98a6ad !important;
}

.badge {
  color: #fff;
}

.card-box-1 {
  height: 200px;
  background-color: #faf6f6;
  padding: 1.5rem;
  -webkit-box-shadow: 0 0.75rem 6rem rgba(56, 65, 74, 0.03);
  box-shadow: 0 0.75rem 6rem rgba(56, 65, 74, 0.03);
  margin-bottom: 24px;
  border-radius: 0.25rem;
}

.card-box-1 .card-drop {
  color: #98a6ad;
  font-size: 20px;
  display: inline-block;
  line-height: 1px;
}

.card-box-2 {
  height: 350px;
  background-color: #faf6f6;
  padding: 1.5rem;
  -webkit-box-shadow: 0 0.75rem 6rem rgba(56, 65, 74, 0.03);
  box-shadow: 0 0.75rem 6rem rgba(56, 65, 74, 0.03);
  margin-bottom: 24px;
  border-radius: 0.25rem;
}

.card-box-2 .card-drop {
  color: #98a6ad;
  font-size: 20px;
  display: inline-block;
  line-height: 1px;
}

.card-box-3 {
  height: 150px;
  background-color: #faf6f6;
  padding: 1.5rem;
  -webkit-box-shadow: 0 0.75rem 6rem rgba(56, 65, 74, 0.03);
  box-shadow: 0 0.75rem 6rem rgba(56, 65, 74, 0.03);
  margin-bottom: 24px;
  border-radius: 0.25rem;
}

.card-box-3 .card-drop {
  color: #98a6ad;
  font-size: 20px;
  display: inline-block;
  line-height: 1px;
}

.card-box-4 {
  background-color: #faf6f6;
  padding: 1.5rem;
  -webkit-box-shadow: 0 0.75rem 6rem rgba(56, 65, 74, 0.03);
  box-shadow: 0 0.75rem 6rem rgba(56, 65, 74, 0.03);
  margin-bottom: 24px;
  border-radius: 0.25rem;
}

.card-box-4 .card-drop {
  color: #98a6ad;
  font-size: 16px;
  display: inline-block;
  line-height: 1px;
}

.header-title {
  font-size: 1rem;
  margin: 0 0 7px 0;
}

.progress {
  margin-top: 18px;
}

.h2,
.h4,
.h5,
h2,
h4,
h5 {
  margin: 10px 0;
  font-weight: 600;
  font-family: Karla, sans-serif;
  color: #343a40;
}
</style>