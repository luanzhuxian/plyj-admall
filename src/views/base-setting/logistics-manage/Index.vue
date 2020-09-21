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

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class LogisticsManage extends Vue {
    currentTab = 'Postage'

    tabs = [
        {
            name: 'Postage',
            label: '运费模板'
        },
        {
            name: 'AddressManager',
            label: '地址管理'
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

<style module lang="scss">

</style>
