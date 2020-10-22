<template>
    <div class="newcomers-gift-list">
        <div class="newcomers-list-header">
            <img class="mr-10"
                 src="https://mallcdn.youpenglai.com/static/admall/2.0.0/74b79faf-04ae-4507-ae69-85aa63391d4b.png"
            >
            <span class="mr-10 font-weight-bold">端午佳话粽粽有礼</span>
            <div v-if="status === 1" class="coupon-status active-coupon">
                <pl-svg width="16" name="icon-shijian1" fill="#fff" />
                {{ activeStatus[status] }}...
            </div>
            <div v-else class="coupon-status disabled-coupon">
                <pl-svg width="16" name="icon-shijian1" fill="#fff" />
                {{ activeStatus[status] }}…
            </div>
            <span class="items description time"><pl-svg name="icon-riqi" fill="#999" width="16" class="mr-10" /> 使用有效期：{{ start | dateFormat('YYYY.MM.DD') }} - {{ end | dateFormat('YYYY.MM.DD') }}</span>
        </div>

        <pl-tabs
            v-if="activeTab === 'GeneralInfo' || activeTab === 'GeneralData' || activeTab === 'GeneralGiftData'"
            :value="$route.name"
            :tabs="[
                {label:'活动详情',name:'GeneralInfo'},
                {label:'活动数据',name:'GeneralData'},
                {label:'礼品发放数据',name:'GeneralGiftData'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />

        <router-view />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { signinActivityDetail } from '../../../../../apis/marketing-manage/new-year/spring-ploughing'
import { MutationTypes } from '../../../../../store/mutation-type'
export default {
    name: 'GeneralDetail',
    data () {
        return {
            status: '',
            activeStatus: {
                0: '活动未开始',
                1: '活动进行中',
                2: '活动已结束'
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
            this.status = result.entity.status
        }
    }
}
</script>

<style scoped lang="scss">
  .newcomers-gift-list {
    .coupon-status {
      margin-left: 20px;
      margin-right: 20px;
      padding: 2px 12px;
      background-color: #ec742e;
      border-radius: 130px;
      color: #fff;
    }

    .active-coupon {
      background-color: #ec742e;
      color: #fff;
    }

    .disabled-coupon {
      background-color: #eee;
      color: #666;
    }

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
