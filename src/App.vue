<template>
    <div id="hello-education">
        <!--<section v-show="$route.name">
            <h1 v-text="title" />
            <button @click="alert">alert</button>
            <router-link to="/admall/login">v2</router-link>
            <router-view />
        </section>
        &lt;!&ndash; 子应用渲染区 &ndash;&gt;

        <button @click="weixinLogin">微信登录</button>
        <div id="login-container" />-->
        <div v-if="noMenu.includes(routeName)">
            <Header2 />
            <router-view />
        </div>
        <div :class="$style.mainApp" v-else-if="allLoaded">
            <transition name="fade-left">
                <components :is="navBarName" />
            </transition>
            <Header />
            <div :class="$style.container">
                <main id="main" :class="$style.main">
                    <keep-alive :include="includes">
                        <router-view />
                    </keep-alive>
                </main>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import MainNavbar from './components/common/layout/Main-Navbar.vue'
import OnlineTeachingNavbar from './components/common/layout/Online-Teaching-NavBar.vue'
import Header from './components/common/layout/Header.vue'
import Header2 from './components/common/layout/Header2.vue'
import { Getter, Mutation, namespace } from 'vuex-class'
import { SessionEnum } from '@/enum/storage'
import { MutationTypes } from '@/store/mutation-type'
Component.registerHooks([
    'beforeRouteEnter',
    'beforeRouteLeave',
    'beforeRouteUpdate'
])

const userModule = namespace('user')
// const goodsModule = namespace('goods')

@Component({
    components: {
        OnlineTeachingNavbar,
        MainNavbar,
        Header,
        Header2
    }
})
export default class App extends Vue {
    includes: string[] = [
        'Home'
    ]

    // 不显示菜单的页面
    noMenu: Array<string> = [
        'WxLogin',
        'PasswordLogin',
        'PhoneLogin',
        'WxBindPassword',
        'WxBindPhone',
        'Register',
        'RegisterAccount',
        'ForgetPassword',
        'ResetPassword',
        'ModifyPassword',
        'CompleteLogin',
        'AccountSet'
    ]

    NOLOGIN: Array<string> = [
        'WxLogin',
        'PasswordLogin',
        'PhoneLogin',
        'WxBindPassword',
        'WxBindPhone',
        'Register',
        'RegisterAccount',
        'ForgetPassword',
        'ResetPassword',
        'CompleteLogin'
    ]

    navComponent = 'MainNavbar'
    title = '这是一个title'

    @Watch('$route', { immediate: true })
    navBarChange ({ matched }: any) {
        // MainNavbar OnlineTeachingNavbar
        const isOnline = matched.some((item: any) => item.name === 'LineTeaching')
        const navBarName = isOnline ? 'OnlineTeachingNavbar' : 'MainNavbar'
        this.$store.commit('changeNavBarName', navBarName)
    }

    @Getter navBarName!: string

    // @userModule.Getter('currentStep') currentStep!: number
    @userModule.Getter('token') tokenFoo!: string
    @userModule.Getter('allLoaded') allLoaded!: boolean
    @userModule.Getter('agencyCode') agencyCode!: string
    // @goodsModule.Getter('categoryTree') categoryTree!: any
    // @userModule.Action(MutationTypes.setLoginInfo) setLoginInfo!: Function
    // @userModule.Action(MutationTypes.getAllMallInfo) getAllMallInfo!: Function
    // @userModule.Action(MutationTypes.getAgencyList) getAgencyList!: Function
    // @goodsModule.Action(MutationTypes.getClassifyTree) getClassifyTree!: Function

    @Mutation('changeNavBarName') changeNavBarName!: Function
    @userModule.Mutation(MutationTypes.logout) logout!: Function

    created () {
        try {
            const code = sessionStorage.getItem(SessionEnum.redirectCode)
            if (!code) this.step()
        } catch (e) {
            throw e
        }
    }

    get routeName (): string | undefined | null{
        return this.$route.name
    }

    step () {
        // 没有token return
        if (!this.tokenFoo && this.NOLOGIN.includes(this.routeName as string)) {
            return
        }
        // 没有选中机构
        if (!this.agencyCode && !this.NOLOGIN.includes(this.routeName as string)) {
            this.logout()
            // return
        }
        // try {
        //     this.setLoginInfo()
        //     // 刷新登录信息缓存时效
        //     await this.getAgencyList()
        //     await this.getAllMallInfo()
        //     // this.loaded = true
        //     if (!this.categoryTree || !this.categoryTree.length) await this.getClassifyTree()
        //     // startQiankun()
        // } catch (e) {
        //     throw e
        // }
    }
}
</script>
<style module lang="scss">
.main-app {
    display: grid;
    grid-template-columns: 140px auto;
    grid-template-rows: 60px auto;

    width: 100vw;
    height: 100vh;
    overflow: hidden;
    > .container {
        grid-column-start: 2;
        width: calc(100vw - 140px);
        overflow-x: auto;
        overflow-y: hidden;

        > .main {
            min-width: 1350px;
            height: calc(100vh - 60px);
            padding: 10px;
            background-color: #f4f5f8;
            box-sizing: border-box;
            overflow: auto;
        }
        // > div {
        //     height: 100%;
        //     overflow: auto;
        // }
    }

}

</style>
