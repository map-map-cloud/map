<template>
  <div class="about">
    
    <!-- 國科會 -->
    <div class="aboutA">
      <div class="aboutATitle">國家科學及技術委員會</div>
      <div class="aboutAInf">
        <div class="aboutAImg3"></div>
        <div class="aboutAtext">
          科技部於本111年7月27日改制為國家科學及技術委員會，未來透過集中科技發展事務權責，妥善配置科技資源，通盤掌握、整合政府科技發展能量，聚焦推動國家重點科技政策；強化行政院科技幕僚規劃及統合協調等功能角色，攜手各部會，以臺灣長遠前瞻的宏觀視野，對內打造高效的行政運作體系，對外則整合跨部會科研能量，共同開創未來科技新局。
        </div>
      </div>
    </div>
    <hr/>
    <!-- 雲林縣政府 -->
    <div class="aboutA">
      <div class="aboutATitle">雲林縣政府</div>
      <div class="aboutAInf">
        <div class="aboutAtext">
          雲林縣有二十個鄉鎮市，以農業立縣、橫跨20個鄉鎮的雲林，自然純樸的農村風光與得天獨厚的農產物品，一直以來都是雲林人最引以為傲的資源。倚山傍海的地理優勢，也因此孕育出各式農特產美食。
        </div>
        <div class="aboutAImg2"></div>
      </div>
    </div>
    <hr/>
    <!-- 晁陽 -->
    <div class="aboutA">
      <div class="aboutATitle">晁陽農產科技股份有限公司</div>
      <div class="aboutAInf">
        <div class="aboutAImg1"></div>
        <div class="aboutAtext">
          晁陽成立於2012年9月，是台灣最早將太陽能發電與農業結合的公司，藉著太陽能的穩定收入，投入安心無毒的六級化農業，發展休閒農場、推廣環境教育並推出具有因應全球淨零碳排的解決方案--【農電共榮】。藉著綠色農業的佈局，帶動太陽能的建置，期待能為台灣2050年達成淨零碳排的目標貢獻一份心力；也藉著綠色教育的推動，實踐低碳生活、全人健康的永續發展目標。
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

<style scoped>
.about {
  max-width: 80%;
  margin: 10px auto;
}

.img {
  background-image: url("https://www.asia.edu.tw/uploads/asset/data/61c1e6878199fbf80ea9e204/yard0.jpg");
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 60vh;
  margin: 20px auto;
}

/*O*/
.aboutO {
  width: 100%;
  margin: 20px auto;
  padding: 20px;
}

/*A*/
.aboutA {
  max-width: 100%;
  margin: 60px auto;
}
.aboutATitle {
  max-width: 100%;
  font-size: 24px;
  text-align: center;
  margin: 10px auto;
  color: #000;
}
.aboutAImg1 {
  background-image: url("../assets/22.jpg");
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 50vh;
  margin: 20px auto;
}
.aboutAtext {
  max-width: 100%;
  margin: 30px auto;
}
.aboutAImg2 {
  background-image: url("../assets/21.jpg");
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 50vh;
  margin: 20px auto;
}
.aboutAImg3 {
  background-image: url("https://cdn.discordapp.com/attachments/965299322046537822/1093566385684238366/unnamed.jpg");
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 50vh;
  margin: 20px auto;
}

hr {
  width: 100%;
  margin-bottom: 50px;
  color: #038686;
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
  .wave {
    left: -30%;
  }
}
@media (min-width: 919px) {
  .aboutAInf {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .aboutAImg1,.aboutAImg2 {
    width: 40%;
  }
  .aboutAtext {
    max-width: 55%;
    margin: 30px auto;
  }
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