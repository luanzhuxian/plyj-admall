<template>
    <div id="main-app" :class="$style.mainApp">
        <!--<section v-show="$route.name">
            <h1 v-text="title" />
            <button @click="alert">alert</button>
            <router-link to="/admall/login">v2</router-link>
            <router-view />
        </section>
        &lt;!&ndash; 子应用渲染区 &ndash;&gt;

        <button @click="weixinLogin">微信登录</button>
        <div id="login-container" />-->
        <router-view v-if="noMenu.includes(routeName)" />
        <template v-else>
            <MainNavbar />
            <Header />
            <main :class="$style.main">
                <!-- 主应用渲染区 -->
                <section v-if="$route.name">
                    <keep-alive>
                        <router-view />
                    </keep-alive>
                </section>
                <!-- 子应用渲染区 -->
                <section id="child-app" v-else />
            </main>
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import MainNavbar from './components/common/Main-Navbar.vue'
import Header from './components/common/Header.vue'
import { namespace } from 'vuex-class'
import startQiankun from './micro'

const userModule = namespace('user')
const goodsModule = namespace('goods')

@Component({
    components: {
        MainNavbar,
        Header
    }
})
export default class App extends Vue {
    // 不显示菜单的页面
    noMenu: Array<string> = [
        'WxLogin',
        'PasswordLogin',
        'PhoneLogin',
        'WxBindPassword',
        'WxBindPhone',
        'Register',
        'ForgetPassword',
        'ResetPassword',
        'ModifyPassword',
        'CompleteLogin'
    ]

    NOLOGIN: Array<string> = [
        'WxLogin',
        'PasswordLogin',
        'PhoneLogin',
        'WxBindPassword',
        'WxBindPhone',
        'Register',
        'ForgetPassword',
        'ResetPassword',
        'CompleteLogin'
    ]

    title = '这是一个title'

    @Watch('routeName')
    onrouteName (val: string) {
        console.log(val)
    }

    @userModule.Getter('currentStep') currentStep!: number

    @userModule.Getter('agencyCode') agencyCode!: string
    @userModule.Action('SET_LOGININFO') SET_LOGININFO!: Function
    @userModule.Action('GET_ALL_MALL_INFO') GET_ALL_MALL_INFO!: Function
    @goodsModule.Action('GET_CLASSIFY_TREE') getClassifyTree!: Function

    @userModule.Mutation('LOGOUT') LOGOUT!: Function

    created () {
        try {
            this.step()
        } catch (e) {
            throw e
        }
    }

    get routeName (): string | undefined | null{
        return this.$route.name
    }

    async step () {
        // 没有选中机构
        if (!this.agencyCode && !this.NOLOGIN.includes(this.routeName as string)) {
            this.LOGOUT()
            return
        }
        try {
            this.SET_LOGININFO()
            // 刷新登录信息缓存时效
            await this.GET_ALL_MALL_INFO()
            if (this.currentStep === 1) {
                this.$router.replace({ name: 'Register' })
                return
            }
            // this.loaded = true
            await this.getClassifyTree()
            startQiankun()
        } catch (e) {
            throw e
        }
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
