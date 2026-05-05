<template>
  <div id="app">

    <h1>Realtime Board</h1>

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

  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f0f2f5;
}

#app {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #1a1a1a;
}

</style>