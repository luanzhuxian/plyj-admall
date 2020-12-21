<template>
    <header :class="$style.header">
        <div :class="$style.left">
            <h1 v-if="$route.name === 'Home'" class="fz-16">
                {{ mallName }}
            </h1>
            <el-breadcrumb v-else-if="matchedRoutes.length" separator-class="el-icon-arrow-right">
                <template v-for="(route, i) of matchedRoutes">
                    <el-breadcrumb-item
                        :key="i"
                        v-if="route.meta && route.meta.title && !route.meta.hide"
                        :to="route.meta.noClick ? null : { name: route.name }"
                    >
                        {{ route.meta.title }}
                    </el-breadcrumb-item>
                </template>
            </el-breadcrumb>
        </div>

        <HeaderRight />
    </header>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import HeaderRight from './Header-Rigtht.vue'
const userModule = namespace('user')

@Component({
    components: {
        HeaderRight
    }
})
export default class Header extends Vue {
    matchedRoutes: RouteConfig[] = []

    /*
       面包屑拦截器，可根据当前页面路由配置显示不同的面包屑
       拦截器的key是一个路由名称，一旦路由名称存在于route.matched中，将执行拦截器配置的方法
    */
    breadInterceptor: Map<string, (r: RouteConfig) => RouteConfig[]> = new Map()

    // computed
    @userModule.Getter('mallName') mallName!: string

    // watch
    @Watch('$route')
    onRouteChange (to: RouteConfig) {
        for (const r of to.matched || []) {
            if (this.breadInterceptor.has(r.name)) {
                const interceptor = this.breadInterceptor.get(r.name) as (r: RouteConfig) => RouteConfig[]
                this.matchedRoutes = interceptor(to)
                return
            }
        }
        this.matchedRoutes = to.matched ? [...to.matched] : []
    }

    created () {
        // 云课堂拦截器
        this.breadInterceptor.set('LineTeaching', (currentRoute: RouteConfig) => {
            const matched = currentRoute.matched ? [...currentRoute.matched] : []
            matched.splice(0, 1, {
                path: '/',
                name: 'Home',
                meta: {
                    title: '首页'
                }
            })
            return matched
        })
    }
}
</script>

<style module lang="scss">
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        padding: 0 24px;
        border-left: 1px solid #E7E7E7;
        background-color: #fff;
    }
</style>
