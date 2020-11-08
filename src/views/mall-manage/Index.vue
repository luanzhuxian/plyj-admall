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
import { getActivityAuth } from '../../apis/marketing-manage/gameplay'

const mall = namespace('mall')

type lockStatusInfo = {
    activityName: string;
    activityValue: string;
    lockName: string;
    lockStatus: number;
}

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
    @mall.Mutation setDouble12LockStatus!: (payload: {}) => void
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
            getActivityAuth(), // 进入店铺管理要提前调用 getActivityAuth 主会场模板使用权限接口，通知后端更新草稿箱数据
            this.getCurrentTemplate(1),
            this.getCurrentTemplate(2)
        ]
        const [{
            result: live = {}
        }, {
            result: nianwei = []
        }, {
            result: lockStatusInfo = []
        }] = await Promise.all(requests.map((p: Promise<any>) => p.catch(e => {
            console.error(e)
            return { result: null }
        })))

        const double12 = lockStatusInfo.find(item => item.activityValue === '4')

        this.setLiveInfo(live)
        this.setNwEvent(nianwei.length ? nianwei[0] : {})
        // lockStatus 1 '开启', 2: '过期', 3: '未开启活动'
        this.setDouble12LockStatus(double12 ? double12.lockStatus : 3)
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
