<template>
  <header>
      <RouterLink to="/" class="navbarBrand">綠能下的數位地圖</RouterLink>
      <input type="checkbox" class="navbarToggle" id="navbarToggle" />
      <nav class="nav navbar-light" >
        <ul class="navList">
          <li class="navItem">
            <RouterLink to="/" class="nav-link">首頁</RouterLink>
          </li>
          <li class="navItem">
            <RouterLink to="/Map" class="nav-link active" aria-current="page">地圖</RouterLink>
          </li>
          <li class="navItem">
            <RouterLink to="/about" class="nav-link">合作單位</RouterLink>
          </li>
          <li class="navItem">
            <RouterLink to="/aboutme" class="nav-link">關於我們</RouterLink>
          </li>
        </ul>
      </nav>
      <label class="navbarToggle-label" for="navbarToggle">
        <span class="hamburger"></span>
      </label>
  </header>
</template>


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
  -webkit-box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
}
.navbarBrand:hover{
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
.navList{
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
  /*只有開啟時 delay .15s */
  transition: opacity 0.2s ease-out 0.15s;
  /*開啟時透明度為1*/
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

.navbarBrand {
  color: #F7F5ED;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 60px;
}

.navItem {
  margin: 1.4rem 0;
  /*預設透明度 0*/
  opacity: 0;
  text-align: center;
}

.nav-link {
  color: #038686;
}
.nav-link:hover{
  color: #000;
}

.navbar-light .navItem.active .nav-link,
.navbar-light .navItem .nav-link:active,
.navbar-light .navItem .nav-link:focus,
.navbar-light .navItem:hover .nav-link {
    color: #000;
}


@media screen and (min-width: 850px) {
  .action {
    font-size: 1.2rem;
    padding: 0.75rem 2rem;
  }

  /*Main Header*/
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
}
</style>