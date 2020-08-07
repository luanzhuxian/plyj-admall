<template>
    <div id="main-app">
        <section v-show="$route.name">
            <h1 v-text="title" />
            <button @click="alert">alert</button>
            <router-link to="/admall/login">v2</router-link>
            <router-view />
        </section>
        <!-- 子应用渲染区 -->
        <section id="child-app" v-show="!$route.name" />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
@Component
export default class App extends Vue {
    title = '这是一个title'
    alert () {
        alert('这是一个方法')
    }
}
</script>
<style lang="scss">
</style>
