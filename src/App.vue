<template>
    <div id="main-app">
        <Header />
        <section v-show="$route.name">
            <h1 v-text="title" />
            <button @click="alert">alert</button>
            <router-link to="/admall/login">v2</router-link>
            <router-view />
        </section>
        <!-- 子应用渲染区 -->
        <section id="child-app" v-show="!$route.name" />

        <button @click="weixinLogin">微信登录</button>
        <div id="login-container" />
        <MainNavbar />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import MainNavbar from './components/common/Main-Navbar.vue'
import Header from './components/common/Header.vue'
@Component({
    components: {
        MainNavbar,
        Header
    }
})
export default class App extends Vue {
    title = '这是一个title'
    alert () {
        alert('这是一个方法')
    }

    weixinLogin () {
        /* eslint-disable @typescript-eslint/camelcase */
        /* eslint-disable no-new */
        const state = Date.now().toString(16)
        sessionStorage.setItem('login_state', state)
        new window.WxLogin({
            self_redirect: false,
            id: 'login-container',
            appid: 'wx7f8e7e4ea457931d',
            scope: 'snsapi_login',
            redirect_uri: 'http://joint.xijun.youpenglai.com',
            state,
            style: 'black',
            href: ''
        })
    }
}
</script>
<style lang="scss">
</style>
