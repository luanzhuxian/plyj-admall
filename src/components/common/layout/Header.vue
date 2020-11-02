<template>
    <header :class="$style.header">
        <div :class="$style.left">
            <h1 v-if="$route.name === 'Home'" class="fz-16">
                {{ mallName }}
            </h1>
            <el-breadcrumb v-else-if="$route.matched.length" separator-class="el-icon-arrow-right">
                <template v-for="(route, i) of $route.matched">
                    <el-breadcrumb-item
                        :key="i"
                        v-if="route.meta && route.meta.title && !route.meta.hide"
                        :to="{ path: route.path }"
                    >
                        {{ route.meta.title }}
                    </el-breadcrumb-item>
                </template>
            </el-breadcrumb>
            <el-breadcrumb v-else-if="childRoute" separator-class="el-icon-arrow-right">
                <template v-for="(route, i) of childRoute.matched">
                    <el-breadcrumb-item
                        :key="i"
                        v-if="route.meta && route.meta.title"
                        :to="{ path: `/admall/${ route.path }` }"
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
import { Component } from 'vue-property-decorator'
import { namespace, Getter } from 'vuex-class'
import HeaderRight from './Header-Rigtht.vue'
const userModule = namespace('user')

@Component({
    components: {
        HeaderRight
    }
})
export default class Header extends Vue {
    // computed
    @userModule.Getter('mallName') mallName!: string
    @Getter('childRoute') childRoute!: any
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
