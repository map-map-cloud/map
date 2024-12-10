<template>
  <footer class="wrapper">
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
        <p class="footer-text-i">地址: 41354 台中市霧峰區柳豐路 500 號</p>
        <p class="footer-text-i">電話: 04-23323456 #6502</p>
        <p class="footer-text-i">信箱: cnwang@aisa.edu.tw</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.wrapper {
  width: 110%;
  height: 350px;
  background: #fff;
  position: relative;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  margin-bottom: -10px;
}

.wave {
  background: #038686;
  width: 1800px;
  height: 1800px;
  border-radius: 40%;
  opacity: 0.4;
  position: absolute;
  top: 95%;
  /* left: -100%;
  margin-left: -250px; */
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
  z-index: 1;
  max-width: 95%;
  margin: 0 auto;
  color: #333;
  text-align: center;
  padding: 20px;
}

.footer_logo {
  margin: 0 auto;
  margin-bottom: 40px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.footer-text {
  margin: 10px auto;
  font-size: 14px;
  color: white;
}

.footer-text hr {
  width: 50%;
  margin: 10px auto;
  border: 0.5px solid #038686;
}

/* 響應式設計 */
@media screen and (min-width: 768px) {
  .footer-text {
    font-size: 16px;
  }
}
</style>