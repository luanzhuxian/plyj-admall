<template>
    <div class="sign-in wrap">
        <ListHeader
            v-if="$route.name === 'SignInList'"
            icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/打卡聪明年.png"
            title="打卡聪明年"
            description="打卡签到答题，即可参与抽奖，有机会获得智慧礼"
            :start-time="start"
            :end-time="end"
        />
        <el-button type="primary" round @click="add" icon="el-icon-plus" v-show="$route.name === 'SignInList'">
            新建活动
        </el-button>
        <el-button type="text" @click="showExplanation = true" v-show="$route.name === 'SignInList'">
            活动说明
        </el-button>
        <router-view />
        <SignInSetting :show.sync="showExplanation" />
    </div>
</template>

<script>
import SignInSetting from './Setting'
import { mapGetters, mapActions } from 'vuex'
import { MutationTypes } from '../../../../store/mutation-type'
import ListHeader from '../../../../components/marketing-manage/List-Header'
import moment from 'moment'
export default {
    name: 'SignInIndex',
    components: { ListHeader, SignInSetting },
    data () {
        return {
            showTop: false,
            start: '',
            end: '',
            showExplanation: false,
            programId: '11'
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
        const info = this.marketStatusAuth.find(({ programId }) => programId === this.programId)
        if (!info || moment(info.validity).valueOf() < Date.now()) {
            this.$router.replace({ name: 'MarketingUnpaidDetail', params: { programId: this.programId } })
            return
        }

        this.start = info.createTime || ''
        this.end = info.validity || ''
    },

    methods: {
        ...mapActions('account', [MutationTypes.getMarketStatusAuth]),
        add () {
            this.$router.push({ name: 'SignInAdd' })
        }
    }
}
</script>

<style scoped lang="scss">
.sign-in {
    background-color: #ffffff;
    border: 1px solid #e7e7e7;
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
