<template>
  <header>
    <RouterLink to="/" class="navbarBrand">綠能下的數位地圖</RouterLink>
    <input type="checkbox" class="navbarToggle" id="navbarToggle" v-model="isMenuOpen" />
    <nav class="nav navbar-light">
      <ul class="navList">
        <li class="navItem">
          <RouterLink to="/" class="nav-link" @click="closeMenu">首頁</RouterLink>
        </li>
        <!-- 桌面版下拉菜單 -->
        <li class="navItem dropdown desktop-only" :class="{ 'active': isDataPageActive }">
          <a href="#" class="nav-link dropdown-toggle" @click="toggleDropdown('data')">
            資料與統計
            <span class="dropdown-arrow" :class="{ 'expanded': openDropdown === 'data' }">▼</span>
          </a>
          <ul class="dropdown-menu" :class="{ 'show': openDropdown === 'data' }">
            <li><RouterLink to="/Map" class="dropdown-item" :class="{ 'active': $route.path === '/Map' }" @click="closeMenu">地圖</RouterLink></li>
            <li><RouterLink to="/powerinfo" class="dropdown-item" :class="{ 'active': $route.path === '/powerinfo' }" @click="closeMenu">綠能統計</RouterLink></li>
            <li><RouterLink to="/bubble" class="dropdown-item" :class="{ 'active': $route.path === '/bubble' }" @click="closeMenu">數據氣泡圖</RouterLink></li>
            <li><RouterLink to="/table" class="dropdown-item" :class="{ 'active': $route.path === '/table' }" @click="closeMenu">表格下載</RouterLink></li>
          </ul>
        </li>
        
        <!-- 手機版樹狀結構 -->
        <li class="navItem mobile-only">
          <div class="nav-link mobile-category">資料與統計</div>
        </li>
        <li class="navItem mobile-only mobile-sub-item">
          <RouterLink to="/Map" class="nav-link" :class="{ 'active': $route.path === '/Map' }" @click="closeMenu">地圖</RouterLink>
        </li>
        <li class="navItem mobile-only mobile-sub-item">
          <RouterLink to="/powerinfo" class="nav-link" :class="{ 'active': $route.path === '/powerinfo' }" @click="closeMenu">綠能統計</RouterLink>
        </li>
        <li class="navItem mobile-only mobile-sub-item">
          <RouterLink to="/bubble" class="nav-link" :class="{ 'active': $route.path === '/bubble' }" @click="closeMenu">數據氣泡圖</RouterLink>
        </li>
        <li class="navItem mobile-only mobile-sub-item">
          <RouterLink to="/table" class="nav-link" :class="{ 'active': $route.path === '/table' }" @click="closeMenu">表格下載</RouterLink>
        </li>
        <li class="navItem">
          <RouterLink to="/about" class="nav-link" @click="closeMenu">合作資訊</RouterLink>
        </li>
        <li class="navItem">
          <RouterLink to="/aboutme" class="nav-link" @click="closeMenu">關於我們</RouterLink>
        </li>
      </ul>
    </nav>
    <label class="navbarToggle-label" for="navbarToggle">
      <span class="hamburger"></span>
    </label>
  </header>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      isMenuOpen: false,
      openDropdown: null
    }
  },

  computed: {
    isDataPageActive() {
      const dataPages = ['/Map', '/powerinfo', '/bubble', '/table']
      return dataPages.includes(this.$route.path)
    }
  },
  methods: {
    closeMenu() {
      this.isMenuOpen = false;
      this.openDropdown = null;
    },
    toggleDropdown(dropdown) {
      if (this.openDropdown === dropdown) {
        this.openDropdown = null;
      } else {
        this.openDropdown = dropdown;
      }
    }
  }
}
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
}

body {
  font-size: 1rem;
  line-height: 1.4;
  margin: 0;
}

h1,
h2,
h3,
h4,
h5 {
  margin: 0;
  line-height: 0.9;
}

p {
  margin: 0;
}

ul,
li {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
}

/*Main Header*/
header {
  width: 100%;
  height: 60px;
  z-index: 999;
  text-align: center;
  background-color: #038686;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
}

.navbarBrand {
  color: #F7F5ED;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 60px;
}

.navbarBrand:hover {
  color: #F7F5ED;
}

.nav {
  position: absolute;
  top: 100%;
  background: #ffffff;
  width: 100%;
  transform: scale(1, 0);
  transform-origin: top;
  transition: transform 0.3s ease-out;
  z-index: 1;
  text-align: center;
}

.navList {
  width: 100%;
}

.navbarToggle {
  position: absolute;
  visibility: hidden;
}

.navbarToggle:checked~.nav {
  transform: scale(1, 1);
}

.navbarToggle:checked~.nav .navItem {
  transition: opacity 0.2s ease-out 0.15s;
  opacity: 1;
}

.navbarToggle-label {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 7.5%;
  display: flex;
  align-items: center;
}

.hamburger {
  position: relative;
}

.hamburger,
.hamburger::before,
.hamburger::after {
  width: 25px;
  height: 3px;
  background: #F7F5ED;
  margin: 0.2rem 0;
}

.hamburger::before,
.hamburger::after {
  position: absolute;
  content: "";
  left: 0;
}

.hamburger::before {
  top: 8px;
}

.hamburger::after {
  bottom: 8px;
}

.navItem {
  margin: 1.4rem 0;
  opacity: 0;
  text-align: center;
  position: relative;
}

.nav-link {
  color: #038686;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.nav-link:hover {
  color: #000;
}

.navbar-light .navItem.active .nav-link,
.navbar-light .navItem .nav-link:active,
.navbar-light .navItem .nav-link:focus,
.navbar-light .navItem:hover .nav-link {
  color: #000;
}

/* 響應式顯示控制 */
.desktop-only {
  display: none;
}

.mobile-only {
  display: block;
}

/* 下拉菜單樣式 */
.dropdown {
  position: relative;
}

.dropdown-toggle {
  cursor: pointer;
  /* 移除瀏覽器默認的下拉箭頭 */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.dropdown-toggle::after {
  display: none;
}

.dropdown-arrow {
  font-size: 0.8em;
  transition: transform 0.3s ease;
  display: inline-block;
}

.dropdown-arrow.expanded {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
}

.dropdown-item {
  display: block;
  padding: 10px 15px;
  color: #038686;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s ease;
}

  .dropdown-item:hover {
    background-color: #f8f9fa;
    color: #000;
  }

  .dropdown-item.active {
    background-color: #038686;
    color: white;
    font-weight: bold;
  }

  .dropdown-item.active:hover {
    background-color: #026d6d;
    color: white;
  }

.dropdown-item.active {
  background-color: #038686;
  color: white;
  font-weight: bold;
}

.dropdown-item.active:hover {
  background-color: #026d6d;
  color: white;
}

.dropdown-item:last-child {
  border-bottom: none;
}

/* 手機版樹狀結構樣式 */
.mobile-category {
  font-weight: bold;
  color: #038686;
  background-color: #f8f9fa;
  border-left: 3px solid #038686;
  padding-left: 20px;
}

.mobile-sub-item {
  margin: 0.5rem 0;
}

.mobile-sub-item .nav-link {
  padding-left: 30px;
  font-size: 0.9em;
  color: #666;
}

.mobile-sub-item .nav-link.active {
  color: #038686;
  font-weight: bold;
  background-color: #f0f9f9;
  border-left: 3px solid #038686;
}

@media screen and (min-width: 850px) {
  header {
    display: grid;
    grid-template-columns: 1fr auto minmax(600px, 3fr) 1fr;
  }

  .navbarToggle-label {
    display: none;
  }

  .navbarBrand {
    grid-column: 2 / 3;
  }

  .nav {
    all: unset;
    grid-column: 3 / 4;
  }

  .navList {
    height: 100%;
    display: grid;
    grid-auto-flow: column;
    justify-content: end;
    align-items: center;
    grid-gap: 1rem;
  }

  .navItem {
    margin: 0;
    opacity: 1;
  }

  .nav-link {
    color: #F7F5ED;
  }

  /* 桌面版顯示控制 */
  .desktop-only {
    display: block;
  }

  .mobile-only {
    display: none;
  }

  /* 桌面版下拉菜單樣式 */
  .dropdown-toggle {
    /* 確保桌面版也移除默認箭頭 */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  .dropdown-toggle::after {
    display: none;
  }

  /* 桌面版下拉菜單樣式 */
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    transform: none;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    min-width: 250px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
  }

  /* 桌面版使用懸停展開 */
  .dropdown:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
  }

  /* 桌面版不使用 show 類別 */
  .dropdown-menu.show {
    opacity: 0;
    visibility: hidden;
  }

  .dropdown-item {
    color: #038686;
    padding: 12px 20px;
    white-space: nowrap;
  }

  .dropdown-item:hover {
    background-color: #f8f9fa;
    color: #000;
  }
}
</style>