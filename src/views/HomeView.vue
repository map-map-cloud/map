<template>
  <div class="about">
    <swiper
      :spaceBetween="30"
      :centeredSlides="true"
      :autoplay="{
        delay: 3500,
        disableOnInteraction: false,
      }"
      :pagination="{
        clickable: true,
      }"
      :modules="modules"
      @autoplayTimeLeft="onAutoplayTimeLeft"
      class="mySwiper"
    >
      <swiper-slide class="swiperSlide1"></swiper-slide>
      <swiper-slide class="swiperSlide2"></swiper-slide>
      <swiper-slide class="swiperSlide3"></swiper-slide>
      <template #container-end>
        <div class="autoplay-progress">
          <svg viewBox="0 0 48 48" ref="progressCircle">
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref="progressContent"></span>
        </div>
      </template>
    </swiper>
    <div class="about-img">
      <div class="about-t">
        <p class="about-title">綠能下的數位地圖</p>
        <p class="about-text">
          歡迎來體驗農電共生數位地圖，這是一款智慧化的應用，結合了農業與能源產業，透過資訊科技，提供全面性、即時性、準確性的數據分析，協助農業、能源業及政府相關單位制定最佳的農電共生模式，以達到節能減碳，提高農業效益等多重效益。
        </p>
      </div>
    </div>
    <div class="about-i">
      <p class="about-text-r">
        透過數位地圖，瞭解農地的能源潛力、太陽能、風能、水力等能源的利用現況及未來潛力，依據數據分析，推算出最佳的農電共生模式及配電規劃，以達到區域性的能源整合與協調，促進區域經濟發展及社會永續。
      </p>
      <br />
      <div class="o">
        <RouterLink to="/Map" class="about-button">
          <button type="button" class="btn btn-outline-success">
            開始使用<font-awesome-icon icon="arrow-right" />
          </button>
        </RouterLink>
      </div>
    </div>
  </div>
  <div class="introduce-a">
    <div class="introduce-img-a"></div>
    <div class="introduce-text-a">
      <p class="introduce-ti-a">農業為本 綠能加值</p>
      <p class="introduce-te-a">
        農電共生數位地圖能夠協助您實現能源與農業的共生，實現環境保護、節能減碳、提高農業效益的目標。此外，它還可以幫助您進一步降低能源成本，提高能源利用效率，並且為您提供更多的商業價值。
      </p>
      <p class="introduce-te-a">
        如果您是農民，您可以透過農電共生數位地圖，了解農地的能源潛力，制定最佳的農業種植及能源利用策略，提高農產品的品質和產量；如果您是能源業者，您可以透過農電共生數位地圖，了解能源資源的利用現況及未來潛力，制定最佳的能源利用策略，實現能源的最大化效益；如果您是政府相關部門，您可以透過農電共生數位地圖，了解區域性的能源整合及協調，實現經濟發展與社會永續。
      </p>
    </div>
  </div>
  <div class="introduce-b">
    <div class="introduce-text-b">
      <p class="introduce-ti-b">農業綠能</p>
      <p class="introduce-te-b">
        農電共生數位地圖具有即時性、全面性及準確性，能夠協助各界了解農業、能源資源的利用現況及未來潛力，協助決策者進行區域性的能源整合與協調，促進區域經濟發展及社會永續。
      </p>
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
// Import Swiper Vue.js components
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import required modules
import { Autoplay, Pagination } from "swiper";
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const progressCircle = ref(null);
    const progressContent = ref(null);
    const onAutoplayTimeLeft = (s, time, progress) => {
      progressCircle.value.style.setProperty("--progress", 1 - progress);
      progressContent.value.textContent = `${Math.ceil(time / 1000)}s`;
    };
    return {
      onAutoplayTimeLeft,
      progressCircle,
      progressContent,
      modules: [Autoplay, Pagination],
    };
  },
};
</script>

<style scoped>
.about {
  width: 100%;
  margin: 0 auto;
}
/*swiper*/
.mySwiper {
  width: 100%;
  height: 700px;
}
.swiperSlide1 {
  background-image: url("https://images.unsplash.com/photo-1491677533189-49af044391ed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80");
  background-position: center;
  background-size: cover;
}
.swiperSlide2 {
  background-image: url("https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80");
  background-position: center;
  background-size: cover;
}
.swiperSlide3 {
  background-image: url("https://images.unsplash.com/photo-1630672607721-48e0a0187a92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1202&q=80");
  background-position: center;
  background-size: cover;
}
.about-img {
  width: 100%;
  margin: 0 auto;
  z-index: 1;
  position: absolute;
  top: 0px;
}
.about-img{
  height: 700px;
  margin: -20px auto;
  display: flex;
  align-items:flex-end;
}
.about-t {
  max-width: 70%;
  margin: 0px auto;
  color: #fff;
}

.about-title {
  font-size: 30px;
  padding: 1rem 0rem;
  font-weight: bold;
}
.about-i {
  max-width: 70%;
  margin: 60px auto;
}

.about-text-r {
  color: #141b18;
  width: 100%;
}
.o{
  width: 100%;
  display: flex;
  justify-content: end;
}
.about-button {
  color: #141b18;
  font-weight: bold;
  font-size: 20px;
  height: 40px;
  text-decoration: none;
}

/*a*/
.introduce-a {
  max-width: 70%;
  margin: 150px auto;
}

.introduce-img-a {
  width: 100%;
  height: 400px;
  background-color: #cccccc;
  background-image: url("../assets/10.jpg");
  /*17*/
  background-position: center;
  background-size: cover;
}

.introduce-text-a {
  color: #141b18;
  max-width: 100%;
  margin: 50px auto;
}

.introduce-ti-a {
  font-size: 30px;
  text-align: center;
  font-weight: bold;
}

.introduce-te-a {
  margin: 30px 0px;
}

/*b*/
.introduce-b {
  width: 100%;
  margin: 100px auto 100px auto;
  padding: 2rem;
  background-color: #cccccc;
  background-color: #cccccc;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)),
    url("../assets/6.jpg");
  background-position: center;
  background-size: cover;
}

.introduce-text-b {
  color: #fff;
  width: 80%;
  margin: 0px auto;
}

.introduce-ti-b {
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  padding: 2rem 0rem;
}

.introduce-te-b {
  max-width: 100%;
  margin: 0px auto;
  padding: 2rem 0rem;
}

a {
  text-decoration: none;
  color: #000;
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

@media (min-width: 739px) {
  .introduce-a {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .introduce-img-a {
    width: 45%;
    height: 600px;
  }

  .introduce-text-a {
    width: 50%;
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
    left: 0%;
  }
}
@media (min-width: 1499px) {
  .wave {
    left: 10%;
  }
}
</style>
