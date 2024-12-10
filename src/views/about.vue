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
  max-width: 80%;
  margin: 10px auto;
}

/*A*/
.aboutA {
  max-width: 100%;
  margin: 60px auto;
}

.aboutATitle {
  max-width: 100%;
  font-size: xx-large;
  text-align: center;
  margin: 10px auto;
  color: #000;
}

.aboutAImg {
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

hr {
  width: 100%;
  margin-bottom: 50px;
  color: #038686;
}

@media (min-width: 919px) {
  .aboutAInf {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .aboutAImg {
    width: 40%;
  }

  .aboutAtext {
    max-width: 55%;
    margin: 30px auto;
  }
}
</style>