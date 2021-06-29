<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style>
* {
    box-sizing: border-box;
}

html, body {
    margin: 0;
}

#app {
    width: 100vw;
    height: 100vh;
    font-size: 14px;
    overflow: hidden;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
