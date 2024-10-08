<template>
  <div class="about">
    <div class="img"></div>
    <div class="aboutO">
      <p class="aboutOTitle" style="font-size: 24px; text-align: center">
        亞洲大學-精準健康研究中心
      </p>
      <p style="padding: 15px 0px">
        本中心以精準營養健康為主要產業發展核心，透過智慧健康產業技術研發與人才培育及軟體
        平台開發為導向；應用人工智慧、生物資訊、自然語言處理和霎端運算於健康營養產業；整合與分析精準營養大數據、建立混合式雲端健康平台、協助資訊安全等，引領台灣智薏精準營養健康產業及永續城市1社區之發展。
      </p>
      <p style="padding: 15px 0px">
        整合醫療大數據與人工智慧，達成精準醫療之目的。精準醫療是未來新的醫療模式，透過醫療大數據之整合基因檢測、疾病治療、日常活動、癒後追蹤等數據，結合人工智慧能協助臨床醫生準確地選擇出適合病人的標靶藥物及相關治療方案，如此一來，不但能降低罹病風險，更可達到預防疾病發生的機會，更有機會提高病人存活率。
        本研究中心研究主題包括：應用人工智慧與大數據於•
        大數據於基因體分析、表觀基因體分析、微生物體體群分析及抗癌藥物的開發，以及開發精準醫療智慧報告系統。
      </p>
    </div>
    <hr/>
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