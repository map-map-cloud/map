<template>
  <navbar />
  <div class="wrapper">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Home from "./views/HomeView.vue";
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@1,100&family=Noto+Sans+TC:wght@400&display=swap');

html,
body {
  font-family: 'Lato', sans-serif;
  font-family: 'Noto Sans TC', sans-serif;
}
html {
  scroll-behavior: smooth;
}
#app {
  font-family: 'Lato', sans-serif;
  font-family: 'Noto Sans TC', sans-serif;
  line-height: 32px;
  letter-spacing: 2.5px;
  font-size:16px;
}
</style>
