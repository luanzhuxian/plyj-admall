<template>
    <div class="wrap">
        <pl-tabs
            :tabs="tabs"
            :value="currentTab"
            @tabClick="tabClick"
        />
        <router-view />
    </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class MallManage extends Vue {
    currentTab = 'Main'

    tabs = [
        {
            name: 'MallMain',
            label: '我的店铺'
        },
        {
            name: 'MallThemes',
            label: '店铺主题'
        }
    ]

    created () {
        this.currentTab = this.$route.name
    }

    tabClick (data) {
        this.currentTab = data.name
        this.$router.push({ name: data.name })
    }
}
</script>

<style lang="scss">

</style>
