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
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.img {
  width: 100%;
  height: 300px;
  background-image: url("https://www.asia.edu.tw/uploads/asset/data/61c1e6878199fbf80ea9e204/yard0.jpg");
    background-size: cover;
  background-position: center;
  border-radius: 20px;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
}

.img::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.aboutO {
  background: #fff;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(3, 134, 134, 0.08);
  position: relative;
  margin-top: -100px;
  z-index: 1;
  animation: slideUp 0.8s ease-out forwards;
}

.aboutOTitle {
  color: #038686;
  font-size: 32px !important;
  font-weight: bold;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 1rem;
}

.aboutOTitle::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #038686, #04a4a4);
  border-radius: 2px;
}

.aboutO p {
  color: #555;
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  padding: 0 !important;
  text-align: justify;
  position: relative;
  transition: all 0.3s ease;
}

.aboutO p:hover {
  transform: translateY(-2px);
}

hr {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, transparent, #038686, transparent);
  margin: 3rem 0;
  opacity: 0.3;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .about {
    padding: 2rem 1rem;
  }
  
  .img {
    height: 200px;
    margin-bottom: 2rem;
  }
  
  .aboutO {
    padding: 2rem 1.5rem;
    margin-top: -50px;
  }
  
  .aboutOTitle {
    font-size: 24px !important;
    margin-bottom: 1.5rem;
  }
  
  .aboutO p {
    font-size: 15px;
  }
}

/*O*/
.aboutO {
  width: 100%;
  margin: 20px auto;
  padding: 20px;
}

/*A*/
.aboutA {
  max-width: 1200px;
  margin: 80px auto;
  padding: 0 2rem;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s ease-out forwards;
}

.aboutATitle {
  font-size: 32px;
  text-align: center;
  margin: 0 auto 40px;
  color: #038686;
  font-weight: bold;
  position: relative;
  padding-bottom: 15px;
}

.aboutATitle::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #038686, #04a4a4);
  border-radius: 2px;
}

.aboutAInf {
  display: flex;
  gap: 40px;
  align-items: center;
  margin: 40px 0;
  position: relative;
}

.aboutAImg {
  flex: 1;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
}

.aboutAImg:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(3, 134, 134, 0.15);
}

.aboutAImg::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(3, 134, 134, 0.4), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.aboutAImg:hover::after {
  opacity: 1;
}

.aboutAtext {
  flex: 1;
  font-size: 17px;
  line-height: 1.8;
  color: #444;
  text-align: justify;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  border-left: 4px solid #038686;
}

.aboutAtext:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(3, 134, 134, 0.1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 968px) {
  .aboutA {
    margin: 60px auto;
    padding: 0 1.5rem;
  }

  .aboutAInf {
    flex-direction: column;
    gap: 30px;
  }

  .aboutAImg {
    width: 100%;
    height: 300px;
  }

  .aboutAtext {
    width: 100%;
    font-size: 16px;
    padding: 15px;
  }

  .aboutATitle {
    font-size: 28px;
    margin-bottom: 30px;
  }
}

@media (max-width: 480px) {
  .aboutA {
    margin: 40px auto;
    padding: 0 1rem;
  }

  .aboutAImg {
    height: 250px;
  }

  .aboutAtext {
    font-size: 15px;
    padding: 15px;
  }

  .aboutATitle {
    font-size: 24px;
    margin-bottom: 20px;
  }
}

/*footer*/
.wrapper {
  width: 100%;
  height: 380px;
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