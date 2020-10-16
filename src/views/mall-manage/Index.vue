<template>
    <div id="mall-manage" class="wrap mall-manage">
        <PlTabs
            v-show="showTabs"
            :tabs="tabs"
            :value="currentTab"
            @tabClick="handleTabClick"
        />
        <router-view />
    </div>
</template>

<script lang="ts">
// @ts-noCheck
import { Vue, Component, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { getLiveInfo, getNianweiInfo } from '../../apis/mall'

const mall = namespace('mall')
@Component
export default class MallManage extends Vue {
    /* data */
    currentTab = ''
    tabs = [{
        name: 'MallMain',
        label: '我的店铺'
    }, {
        name: 'MallThemes',
        label: '模板中心'
    }]

    /* computed */
    @mall.Mutation setLiveInfo!: (payload: {}) => void
    @mall.Mutation setNwEvent!: (payload: {}) => void
    get showTabs () {
        return !!this.$route.name && this.tabs.map(tab => tab.name).includes(this.$route.name)
    }

    /* watch */
    @Watch('$route.name', { immediate: true })
    onChange (newVal: string) {
        this.currentTab = newVal
    }

    async created () {
        if (this.$route.name && this.showTabs) {
            this.currentTab = this.$route.name
        }

        const requests = [
            getLiveInfo(),
            getNianweiInfo(),
            this.getCurrentTemplate(1),
            this.getCurrentTemplate(2)
        ]
        const [{ result: live = {} }, { result: nianwei = [] }] = await Promise.all(requests.map((p: Promise<any>) => p.catch(e => {
            console.error(e)
            return { result: null }
        })))

        this.setLiveInfo(live)
        this.setNwEvent(nianwei.length ? nianwei[0] : {})
    }

    /* methods */
    @mall.Action('getCurrentTemplate') getCurrentTemplate!: (type: number) => Promise<void>

    handleTabClick (tab: { name: string; label: string }) {
        this.currentTab = tab.name
        this.$router.push({ name: tab.name })
    }
}
</script>

<style lang="scss">
.mall-manage {

}

</style>
