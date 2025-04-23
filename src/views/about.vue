<template>
  <div class="about">
    <div v-for="item in aboutData" :key="item.title" class="aboutA">
      <div class="aboutATitle">{{ item.title }}</div>
      <div class="aboutAInf">
        <!-- 動態根據奇數偶數決定圖片和文字位置 -->
        <template v-if="isEven(aboutData.indexOf(item))">
          <div :style="{ backgroundImage: 'url(' + item.image + ')' }" class="aboutAImg"></div>
          <div class="aboutAtext">{{ item.content }}</div>
        </template>
        <template v-else>
          <div class="aboutAtext">{{ item.content }}</div>
          <div :style="{ backgroundImage: 'url(' + item.image + ')' }" class="aboutAImg"></div>
        </template>
      </div>
      <hr />
    </div>
    <!-- footer -->
    <!-- 嵌入 Footer 元件 -->
    <Footer />
  </div>
</template>

<script>
import Footer from "@/components/footer.vue";
import axios from "axios";

export default {
  components: {
    Footer, // 註冊 Footer 元件
  },
  data() {
    return {
      aboutData: [], // 存放從 API 獲取的資料
    };
  },
  mounted() {
    this.fetchAboutData();
  },
  methods: {
    async fetchAboutData() {
      try {
        const response = await axios.get("https://soezsell.com/test-map/about.php");
        this.aboutData = response.data; // 將獲取的 JSON 資料賦值到 aboutData
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    },
    isEven(index) {
      return index % 2 === 0;
    },
  },
};
</script>

<style scoped>
.about {
  margin: 0 auto;
  background: #fff;
  max-width: 100%;
  overflow-x: hidden;
  height: 100%;
}

.aboutA {
  margin: 100px auto;
  opacity: 0;
  transform: translateY(40px);
  animation: fadeInUp 0.8s ease-out forwards;
  max-width: 100%;
  padding: 0 20px;
  overflow: visible;
}

.aboutA:nth-child(even) {
  animation-delay: 0.2s;
}

.aboutATitle {
  font-size: 36px;
  color: #038686;
  text-align: center;
  margin-bottom: 3rem;
  font-weight: bold;
  position: relative;
  padding-bottom: 1rem;
  letter-spacing: 1px;
}

.aboutATitle::after {
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

.aboutAInf {
  display: flex;
  gap: 60px;
  align-items: center;
  margin: 40px auto;
  max-width: 100%;
  position: relative;
  padding: 0 20px;
  overflow: visible;
}

.aboutAImg {
  flex: 1;
  height: 450px;
  border-radius: 20px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(3, 134, 134, 0.1);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.aboutAImg::before {
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

.aboutAImg:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(3, 134, 134, 0.15);
}

.aboutAImg:hover::before {
  opacity: 1;
}

.aboutAtext {
  flex: 1;
  font-size: 17px;
  line-height: 1.8;
  color: #444;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: all 0.4s ease;
  border-left: 4px solid #038686;
  backdrop-filter: blur(10px);
}

.aboutAtext:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(3, 134, 134, 0.1);
}

hr {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, transparent, #038686, transparent);
  margin: 4rem auto;
  max-width: 200px;
  opacity: 0.3;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 968px) {


  .aboutA {
    margin: 60px auto;
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
    padding: 1.5rem;
    font-size: 16px;
  }

  .aboutATitle {
    font-size: 28px;
    margin-bottom: 2rem;
  }

  hr {
    margin: 3rem auto;
  }
}

@media (max-width: 768px) {
  .aboutAInf {
    flex-direction: column;
    gap: 30px;
  }

  .aboutAImg {
    width: 100%;
    height: 300px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .aboutAtext {
    width: 100%;
    padding: 1.5rem;
    font-size: 16px;
  }
}

@media (max-width: 480px) {


  .aboutA {
    margin: 40px auto;
  }

  .aboutAImg {
    height: 250px;
    min-height: 250px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .aboutAtext {
    font-size: 15px;
    padding: 1.25rem;
  }

  .aboutATitle {
    font-size: 24px;
    margin-bottom: 1.5rem;
  }

  hr {
    margin: 2rem auto;
  }
}
</style>