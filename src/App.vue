<template>
  <HomeView />
</template>

<script>
// Component
import HomeView from '@/views/HomeView.vue'

export default {
  name: 'App',
  components: { HomeView }
}
</script>

<style>
#app {
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
  margin-top: 60px;
}
html {
  background: #aaaaaa;
}
</style>
