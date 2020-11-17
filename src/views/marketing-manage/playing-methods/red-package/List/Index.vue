<template>
    <div class="red-package-list wrap">
        <ListHeader
            icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/福利红包.png"
            title="福利红包"
            description="低价购买福利红包  支付抵扣享优惠  "
            start-time="2019.10.28"
            end-time="2020.01.31"
            :tags="['限','新']"
        />
        <PlTabs
            :tabs="tabs"
            :value="currentTab"
            @tabClick="handleTabClick"
        />
        <router-view class="red-package-list__container" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import ListHeader from '../../../components/List-Header.vue'

@Component({
    components: {
        ListHeader
    }
})
export default class RedPackageList extends Vue {
    /* data */
    currentTab = ''
    tabs = [{
        name: 'RedPackageActivityList',
        label: '活动列表'
    }, {
        name: 'RedPackageRankList',
        label: '排序设置'
    }]

    /* watch */
    @Watch('$route.name', { immediate: true })
    onChange (newVal: string) {
        this.currentTab = newVal
    }

    /* methods */
    handleTabClick (tab: { name: string; label: string }) {
        this.currentTab = tab.name
        this.$router.push({ name: tab.name })
    }
}
</script>

<style lang="scss">
.red-package-list {
    &__container {
        padding-top: 30px;
    }
}
</style>
