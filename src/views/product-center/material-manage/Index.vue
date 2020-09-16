<template>
    <div class="material-manage wrap">
        <!-- 素材中心 -->
        <pl-tabs
            :tabs="tabs"
            @tabClick="tabClick"
        />
        <router-view />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class MaterialManage extends Vue {
    tabs = [
        {
            label: '视频库',
            name: 'VideoLibrary'
        },
        {
            label: '资源库',
            name: 'RepositoryLibrary'
        }
    ]

    tabClick (el) {
        this.$router.push({ name: el.name })
    }
}
</script>

<style module lang="scss">

</style>
