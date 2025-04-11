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
    <div class="introduce-content">
      <div class="introduce-header">
        <h2 class="introduce-ti-a">農業為本 綠能加值</h2>
        <p class="introduce-subtitle">智慧農業與綠能科技的完美結合</p>
        <p class="introduce-description">農電共生數位地圖能夠協助您實現能源與農業的共生，實現環境保護、節能減碳、提高農業效益的目標。此外，它還可以幫助您進一步降低能源成本，提高能源利用效率，並且為您提供更多的商業價值。</p>
      </div>
      
      <div class="introduce-features">
        <div class="feature-card">
          <div class="feature-icon">
            <font-awesome-icon :icon="['fas', 'leaf']" />
          </div>
          <h3>農業效益</h3>
          <p>提高農產品品質和產量，優化種植策略</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">
            <font-awesome-icon :icon="['fas', 'sun']" />
          </div>
          <h3>能源整合</h3>
          <p>最大化能源利用效率，降低營運成本</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">
            <font-awesome-icon :icon="['fas', 'chart-line']" />
          </div>
          <h3>數據分析</h3>
          <p>精準掌握能源潛力，制定最佳策略</p>
        </div>
      </div>

      <div class="introduce-details">
        <div class="detail-section">
          <h3>農民</h3>
          <p>透過農電共生數位地圖，了解農地的能源潛力，制定最佳的農業種植及能源利用策略，提高農產品的品質和產量。</p>
        </div>
        
        <div class="detail-section">
          <h3>能源業者</h3>
          <p>了解能源資源的利用現況及未來潛力，制定最佳的能源利用策略，實現能源的最大化效益。</p>
        </div>
        
        <div class="detail-section">
          <h3>政府部門</h3>
          <p>了解區域性的能源整合及協調，實現經濟發展與社會永續。</p>
        </div>
      </div>
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
  height: 720px;
  margin: -20px auto;
  display: flex;
  align-items: flex-end;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6));
}
.about-t {
  max-width: 70%;
  margin: 0px auto;
  color: #fff;
  text-align: center;
  padding: 2rem 0;
  animation: fadeInUp 1s ease-out;
}
.about-title {
  font-size: 48px;
  padding: 1rem 0rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
  position: relative;
}
.about-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  background: #038686;
  margin: 15px auto;
  border-radius: 2px;
}
.about-text {
  font-size: 18px;
  line-height: 1.8;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
}
.about-i {
  max-width: 70%;
  margin: 60px auto;
  text-align: center;
  animation: fadeInUp 1s ease-out 0.3s;
  opacity: 0;
  animation-fill-mode: forwards;
}
.about-text-r {
  color: #141b18;
  width: 100%;
  font-size: 18px;
  line-height: 1.8;
  margin-bottom: 2rem;
}
.o {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
.about-button {
  color: #141b18;
  font-weight: bold;
  font-size: 20px;
  height: 40px;
  text-decoration: none;
  transition: all 0.3s ease;
}
.about-button .btn {
  padding: 0.8rem 2rem;
  font-size: 18px;
  border-radius: 30px;
  transition: all 0.3s ease;
  border-width: 2px;
}
.about-button .btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(3, 134, 134, 0.3);
  background-color: #038686;
  border-color: #038686;
  color: white;
}
.about-button .btn svg {
  margin-left: 10px;
  transition: transform 0.3s ease;
}
.about-button .btn:hover svg {
  transform: translateX(5px);
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (max-width: 768px) {
  .about-title {
    font-size: 36px;
  }
  
  .about-text, .about-text-r {
    font-size: 16px;
  }
  
  .about-t, .about-i {
    max-width: 90%;
  }
}
/*a*/
.introduce-a {

  background: 
    url("../assets/unnamed.jpg");
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.3s ease;
  padding: 4rem 2rem;
  position: relative;
  /* box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); */
}

.introduce-a:hover {
  transform: translateY(-5px);
}

.introduce-a::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95));
  z-index: 0;
}

.introduce-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.introduce-header {
  text-align: center;
  margin-bottom: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.introduce-img-a {
  width: 100%;
  height: 400px;
  background-color: #cccccc;
  background-image: url("../assets/10.jpg");
  background-position: center;
  background-size: cover;
  position: relative;
}

.introduce-img-a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
}

.introduce-text-a {
  color: #141b18;
  max-width: 100%;
  margin: 50px auto;
  padding: 0 30px;
}

.introduce-ti-a {
  font-size: 42px;
  color: #038686;
  font-weight: bold;
  margin-bottom: 1rem;
  position: relative;
}

.introduce-ti-a::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  background: #038686;
  margin: 15px auto;
  border-radius: 2px;
}

.introduce-subtitle {
  font-size: 20px;
  color: #666;
  margin-top: 1rem;
}

.introduce-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.feature-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(3, 134, 134, 0.1);
  border-color: #038686;
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #038686, #026d6d);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(3, 134, 134, 0.2);
}

.feature-icon svg {
  font-size: 2.5rem;
  color: white;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: translateY(-5px) rotate(5deg);
  box-shadow: 0 6px 20px rgba(3, 134, 134, 0.3);
}

.feature-card:hover .feature-icon svg {
  transform: scale(1.1);
}

.feature-card h3 {
  color: #038686;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.introduce-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.detail-section {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.detail-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(3, 134, 134, 0.1);
  border-color: #038686;
}

.detail-section h3 {
  color: #038686;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.detail-section h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: #038686;
  border-radius: 2px;
}

.detail-section p {
  color: #666;
  line-height: 1.8;
}

@media (max-width: 768px) {
  .introduce-a {
    padding: 2rem 1rem;
    background-attachment: scroll;
  }
  
  .introduce-ti-a {
    font-size: 32px;
  }
  
  .introduce-subtitle {
    font-size: 18px;
  }
  
  .feature-card, .detail-section {
    padding: 1.5rem;
  }
  
  .feature-icon {
    width: 60px;
    height: 60px;
  }
  
  .feature-icon svg {
    font-size: 1.5rem;
  }
}
/*b*/
.introduce-b {
  width: 100%;
  margin: 100px auto;
  padding: 4rem 2rem;
  background-color: #038686;
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)),
    url("../assets/6.jpg");
  background-position: center;
  background-size: cover;
  position: relative;
  overflow: hidden;
}

.introduce-b::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(3, 134, 134, 0.9), rgba(0, 0, 0, 0.7));
}

.introduce-text-b {
  color: #fff;
  width: 80%;
  margin: 0px auto;
  position: relative;
  z-index: 1;
}

.introduce-ti-b {
  font-size: 36px;
  text-align: center;
  font-weight: bold;
  padding: 2rem 0rem;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.introduce-te-b {
  max-width: 100%;
  margin: 0px auto;
  padding: 2rem 0rem;
  line-height: 1.8;
  font-size: 16px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
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
justify-content: center;
    align-items: center;
    padding: 30px;
  }

  .introduce-img-a {
    width: 45%;
    height: 600px;
    border-radius: 15px;
  }

  .introduce-text-a {
    width: 50%;
    padding: 0 40px;
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

.introduce-description {
  font-size: 18px;
  color: #555;
  line-height: 1.8;
  max-width: 800px;
  margin: 2rem auto 0;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(3, 134, 134, 0.08);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid #038686;
}

.introduce-description::before {
  content: '"';
  position: absolute;
  top: 10px;
  left: 20px;
  font-size: 60px;
  color: rgba(3, 134, 134, 0.1);
  font-family: Georgia, serif;
}

.introduce-description::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #038686, transparent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.introduce-description:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(3, 134, 134, 0.12);
}

.introduce-description:hover::after {
  transform: scaleX(1);
}

@media (max-width: 768px) {
  .introduce-description {
    font-size: 16px;
    margin: 1.5rem 1rem;
    padding: 2rem 1.5rem 1.5rem;
  }
  
  .introduce-description::before {
    font-size: 40px;
    top: 5px;
    left: 10px;
  }
}
</style>
