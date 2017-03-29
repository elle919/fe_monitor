<template>
  <div id="app">
    <nav class="top-bar navbar-fixed-top">
      <div class="container">
        <h4 class="monitor-header">点睛错误监控平台</h4>
      </div>
    </nav>
    <div class="left-sidebar">
      <div class="slimScrollDiv" style="position: relative; overflow: hidden; width: auto; height: 100%;">
        <div class="sidebar-scroll" style="overflow: hidden; width: auto; height: 100%;">
          <nav class="main-nav">
            <ul class="main-menu">
               <li><router-link to="/error/dianjing">点睛</router-link></li>
               <li><router-link to="/error/mobile">移动</router-link></li>
               <li><router-link to="/error/uc">UC</router-link></li>
               <li><router-link to="/error/admin">Admin</router-link></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <div class="content-wrapper" style="min-height:350px;">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  // watch: {
  //   '$route'(to,from){
  //     console.log(to)
  //     console.log(from)
  //   }
  // }
}
</script>

<style>
</style>
