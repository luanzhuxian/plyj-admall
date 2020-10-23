<template>
    <div class="newcomers-gift-list wrap">
        <ListHeader
            v-if="$route.name === 'GeneralList' || $route.name === 'GeneralSetting'"
            icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/粽粽有礼.png"
            title="端午佳话粽粽有礼"
            description="签到参与端午活动，即可参与抽奖，有机会获得粽粽大礼"
            :start-time="start"
            :end-time="end"
        />
        <el-button type="primary" round @click="add" icon="el-icon-plus">
            新建活动
        </el-button>
        <pl-tabs
            v-if="$route.name === 'GeneralList' || $route.name === 'GeneralSetting'"
            :value="$route.name"
            :tabs="[
                {label:'活动列表',name:'GeneralList'},
                {label:'活动设置',name:'GeneralSetting'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />
        <router-view />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { MutationTypes } from '../../../../../store/mutation-type'
import ListHeader from '../../../components/List-Header'
import moment from 'moment'
export default {
    name: 'GeneralIndex',
    components: { ListHeader },
    data () {
        return {
            showTop: false,
            start: '',
            end: ''
        }
    },
    computed: {
        ...mapGetters({
            marketStatusAuth: 'account/marketStatusAuth'
        })
    },
    async created () {
        await this[MutationTypes.getMarketStatusAuth]()
        const info = this.marketStatusAuth.find(({ programId }) => programId === '2')
        if (!info || moment(info.validity).valueOf() < Date.now()) {
            this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: '2' } })
            return
        }

        this.start = info.createTime || ''
        this.end = info.validity || ''
    },

    methods: {
        ...mapActions([MutationTypes.getMarketStatusAuth]),
        add () {
            this.$router.push({ name: 'GeneralAdd' })
        }
    }
}
</script>

<style scoped lang="scss">
.newcomers-gift-list {
  .activity-icon{
    width: 23px;
  }
  .newcomers-list-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 52px;
    padding-left: 20px;
    // margin-bottom: 16px;

    .items {
      margin-right: 24px;
    }

    .description {
      color: #a8a8a8;
      font-size: 16px;
    }

    .time {
      border: 1px solid rgba(204,204,204,1);
      border-radius: 130px;
      padding: 2px 10px;
    }
  }
}

</style>
