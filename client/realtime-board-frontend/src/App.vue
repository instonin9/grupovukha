<template>
  <div id="app">
    <BoardList />
  </div>
</template>

<script>
import BoardList from './components/BoardList.vue'

export default {
  name: 'App',
  components: {
    BoardList
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  width: 100%;
  height: 100%;

}

#app {
    width: 100%;
  min-height: 100vh;
}

</style>