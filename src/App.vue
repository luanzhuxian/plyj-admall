<template>
    <div id="main-app" :class="$style.mainApp">
        <!--<section v-show="$route.name">
            <h1 v-text="title" />
            <button @click="alert">alert</button>
            <router-link to="/admall/login">v2</router-link>
            <router-view />
        </section>
        &lt;!&ndash; 子应用渲染区 &ndash;&gt;
        <section id="child-app" v-show="!$route.name" />

        <button @click="weixinLogin">微信登录</button>
        <div id="login-container" />-->
        <router-view v-if="noMenu.includes(routeName)" />
        <template v-else>
            <MainNavbar />
            <Header />
            <main :class="$style.main">
                <keep-alive>
                    <router-view />
                </keep-alive>
            </main>
        </template>
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
    // 不显示菜单的页面
    noMenu: Array<string> = [
        'Login',
        'Register',
        'ForgetPassword',
        'ForgetPasswordMobile',
        'ModifyPassword'
    ];

    title = '这是一个title'
    get routeName (): string | undefined | null{
        return this.$route.name
    }

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
<style module lang="scss">
    .main-app {
        display: grid;
        grid-template-columns: 120px auto;
        grid-template-rows: 60px auto;
        > .main {
            height: calc(100vh - 60px);
            padding: 10px;
            background-color: #f4f5f8;
            grid-column-start: 2;
            box-sizing: border-box;
            overflow: auto;
        }
    }
</style>
