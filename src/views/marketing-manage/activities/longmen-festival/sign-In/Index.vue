<template>
    <div class="newcomers-gift-list wrap">
        <ListHeader
            v-if="$route.name === 'GeneralList'"
            icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/粽粽有礼.png"
            title="端午佳话粽粽有礼"
            description="签到参与端午活动，即可参与抽奖，有机会获得粽粽大礼"
            :start-time="start"
            :end-time="end"
        />
        <!--        <el-button type="primary" round @click="add" icon="el-icon-plus" v-show="$route.name === 'GeneralList'">-->
        <!--            新建活动-->
        <!--        </el-button>-->
        <el-button type="text" @click="showExplanation = true" v-show="$route.name === 'GeneralList'">
            活动说明
        </el-button>
        <router-view />
        <GeneralSetting :show.sync="showExplanation" />
    </div>
</template>

<script>
import GeneralSetting from './Setting'
import { mapGetters, mapActions } from 'vuex'
import { MutationTypes } from '../../../../../store/mutation-type'
import ListHeader from '../../../components/List-Header'
import moment from 'moment'
export default {
    name: 'GeneralIndex',
    components: { ListHeader, GeneralSetting },
    data () {
        return {
            showTop: false,
            start: '',
            end: '',
            showExplanation: false
        }
    },
    computed: {
        ...mapGetters({
            marketStatusAuth: 'account/marketStatusAuth'
        })
    },
    async created () {
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this[MutationTypes.getMarketStatusAuth]()
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) return
        const info = this.marketStatusAuth.find(({ programId }) => programId === '2')
        if (!info || moment(info.validity).valueOf() < Date.now()) {
            await this.$router.replace({ name: 'MarketingGameplayList' })
            await this.$alert('龙门节专属活动，若要开通请联系城市经理或者客服')
            return
        }

        this.start = info.createTime || ''
        this.end = info.validity || ''
    },

    methods: {
        ...mapActions('account', [MutationTypes.getMarketStatusAuth]),
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
