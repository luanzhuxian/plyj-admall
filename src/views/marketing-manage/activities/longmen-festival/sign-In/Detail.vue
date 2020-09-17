<template>
    <div class="newcomers-gift-list">
        <div class="newcomers-list-header bg-white">
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
import { GET_MRKET_STATU_AUTH } from '../../../../../store/mutation-type'
import { signinActivityDetail } from '../../../../../apis/marketing-manage/new-year/spring-ploughing'
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
            mrketStatuAuth: 'account/mrketStatuAuth'
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
        if (!this.mrketStatuAuth) await this[GET_MRKET_STATU_AUTH]()
        if (!this.mrketStatuAuth || !this.mrketStatuAuth.length) return
        const dumplingsInformation = this.mrketStatuAuth.find(({ programId }) => programId === '2')
        this.start = dumplingsInformation.createTime || ''
        this.end = dumplingsInformation.validity || ''
    },

    methods: {
        ...mapActions([GET_MRKET_STATU_AUTH]),
        async getDetail () {
            const { data: { result: { entity: res } } } = await signinActivityDetail(this.$route.params.id)
            this.status = res.status
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
        border: 1px solid rgba(204, 204, 204, 1);
        border-radius: 130px;
        padding: 2px 10px;
      }
    }
  }

</style>
