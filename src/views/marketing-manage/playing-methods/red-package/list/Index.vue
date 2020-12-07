<template>
    <div class="red-package-list wrap">
        <ListHeader
            icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/福利红包.png"
            title="福利红包"
            description="低价购买福利红包  支付抵扣享优惠  "
            :start-time="info.createTime"
            :end-time="info.validity"
            :tags="['限','新']"
        />
        <PlTabs
            :tabs="tabs"
            :value="currentTab"
            @tabClick="handleTabClick"
        />
        <router-view />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import ListHeader from '../../../components/List-Header.vue'

@Component({
    components: {
        ListHeader
    }
})
export default class RedPackageList extends Vue {
    /* data */
    currentTab = 'RedPackageActivityList'
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

    @Prop() info!: object

    /* methods */
    async handleTabClick (tab: { name: string; label: string }) {
        try {
            this.currentTab = tab.name
            await this.$router.push({ name: tab.name })
        } catch (e) {
            if (e && tab.name === 'RedPackageRankList') this.currentTab = 'RedPackageActivityList'
            if (e && tab.name === 'RedPackageActivityList') this.currentTab = 'RedPackageRankList'
        }
    }
}
</script>

<style lang="scss">
</style>
