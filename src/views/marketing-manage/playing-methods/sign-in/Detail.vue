<template>
    <div class="newcomers-gift-list">
        <!--        <div class="newcomers-list-header">-->
        <!--            <img class="mr-10"-->
        <!--                 width="48"-->
        <!--                 src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/打卡聪明年.png"-->
        <!--            >-->
        <!--            <span class="mr-30 font-weight-bold">打卡聪明年</span>-->
        <!--            <div :class="{-->
        <!--                'activity-status': true,-->
        <!--                'not-started': status === 0,-->
        <!--                'ongoing': status === 1,-->
        <!--                'finished': status === 2-->
        <!--            }">-->
        <!--                <pl-svg width="16" name="icon-shijian1" fill="#fff" />-->
        <!--                {{ activeStatus[status] }}-->
        <!--            </div>-->
        <!--            <span class="items description time"><pl-svg name="icon-riqi" fill="#999" width="16" class="mr-10" /> 使用有效期：{{ start | dateFormat('YYYY.MM.DD') }} - {{ end | dateFormat('YYYY.MM.DD') }}</span>-->
        <!--        </div>-->

        <ListHeader
            icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/打卡聪明年.png"
            title="打卡聪明年"
            description="打卡签到答题，即可参与抽奖，有机会获得智慧礼"
            :status="status"
            :start-time="start"
            :end-time="end"
        />

        <pl-tabs
            v-if="activeTab === 'SignInInfo' || activeTab === 'SignInData' || activeTab === 'SignInGiftData'"
            :value="$route.name"
            :tabs="[
                {label:'活动详情',name:'SignInInfo'},
                {label:'活动数据',name:'SignInData'},
                {label:'礼品发放数据',name:'SignInGiftData'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />

        <router-view v-if="data" :data="data" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { signinActivityDetail } from '../../../../apis/marketing-manage/new-year/spring-ploughing'
import ListHeader from '../../../../components/marketing-manage/List-Header'
import { MutationTypes } from '../../../../store/mutation-type'
export default {
    name: 'SignInDetail',
    components: { ListHeader },
    data () {
        return {
            data: '',
            status: '',
            activeStatus: {
                0: '未开始',
                1: '进行中',
                2: '已结束'
            },
            showTop: false,
            activeTab: '',
            start: '',
            end: ''
        }
    },
    computed: {
        ...mapGetters({
            marketStatusAuth: 'account/marketStatusAuth'
        })
    },
    watch: {
        $route (to) {
            this.activeTab = to.name
        }
    },
    async created () {
        this.status = this.$route.query.status
        this.activeTab = this.$route.name
        try {
            await this.getDetail()
        } catch (e) {
            throw e
        }
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this[MutationTypes.getMarketStatusAuth]()
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) return
        const dumplingsInformation = this.marketStatusAuth.find(({ programId }) => programId === '2')
        this.start = dumplingsInformation.createTime || ''
        this.end = dumplingsInformation.validity || ''
    },

    methods: {
        ...mapActions('account', [MutationTypes.getMarketStatusAuth]),
        async getDetail () {
            const { result } = await signinActivityDetail(this.$route.params.id)
            this.data = result
            this.status = result.entity.status
        }
    }
}
</script>

<style scoped lang="scss">
  .newcomers-gift-list {
    .newcomers-list-header {
        display: flex;
        align-items: center;
        padding: 20px;
        background: #F5F6FA;
        border-radius: 10px;
        margin-bottom: 20px;

      .items {
        margin-right: 24px;
      }

      .description {
        color: #a8a8a8;
        font-size: 16px;
      }

      .time {
          margin-left: 100px;
          font-size:12px;
          color: #999;
      }
    }
  }

</style>
