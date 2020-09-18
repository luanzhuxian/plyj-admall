<template>
    <div class="wrap mall-manage">
        <pl-tabs
            :tabs="tabs"
            :value="currentTab"
            @tabClick="tabClick"
        />
        <router-view />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { getLiveInfo, getNianweiInfo } from '../../apis/mall-manage'

const mall = namespace('mall')

@Component
export default class MallManage extends Vue {
    currentTab = 'MallMain'
    tabs = [
        {
            name: 'MallMain',
            label: '我的店铺'
        }, {
            name: 'MallThemes',
            label: '店铺主题'
        }
    ]

    @mall.Mutation setLiveInfo!: (payload: {}) => void
    @mall.Mutation setNwEvent!: (payload: {}) => void

    async created () {
        // this.currentTab = this.$route.name

        const requests = [
            getLiveInfo(),
            getNianweiInfo()
        ]
        const [{ result: live = {} }, { result: nianwei = [] }] = await Promise.all(requests.map(p => p.catch(e => {
            console.error(e)
            return { result: null }
        })))

        this.setLiveInfo(live)
        this.setNwEvent(nianwei.length ? nianwei[0] : {})
    }

    tabClick (data: { name: string; label: string }) {
        this.currentTab = data.name
        this.$router.push({ name: data.name })
    }
}
</script>

<style lang="scss">
.mall-manage {
    min-height: calc(100vh - 110px);
}

</style>
