<template>
    <div class="detail">
        <div class="header border-bottom" v-show="Object.keys(statistics).length">
            <div>
                <span class="fz-16 font-weight-bold">{{ statistics.name }}</span>
            </div>
            <div v-if="statistics.status === 2" class="coupon-status active-coupon">
                <pl-svg width="16" name="icon-shijian1" fill="#fff" />
                {{ activeStatus[statistics.status] }}...
            </div>
            <div v-else class="coupon-status disabled-coupon">
                <pl-svg width="16" name="icon-shijian1" fill="#fff" />
                {{ activeStatus[statistics.status] }}…
            </div>
            <ActiveTime title="活动时间" :time="`${statistics.startTime} - ${statistics.endTime}`" />
        </div>

        <pl-tabs
            :value="$route.name"
            :tabs="[
                {label:'活动详情', name:'LongmenLotteryInfo'},
                {label:'活动数据', name:'LongmenLotteryData'},
            ]"
            @tabClick=" data => {
                $router.replace({
                    name: data.name,
                    params: { id },
                    query: {
                        ...$route.query,
                        status:statistics.status
                    }
                })
            }"
        />

        <div class="content">
            <router-view :statistics="statistics" />
        </div>
    </div>
</template>

<script>
import ActiveTime from '../../../components/Active-Time.vue'
import { getLotteryStatistics } from '../../../../../apis/marketing-manage/lonmen-festival/lottery'
export default {
    name: 'LongmenLotteryDetail',
    components: {
        ActiveTime
    },
    data () {
        return {
            statistics: {},
            activeStatus: {
                1: '未开始',
                2: '进行中',
                3: '已结束',
                4: '已关闭'
            }
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    async created () {
        try {
            await this.getLotteryStatistics()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async getLotteryStatistics () {
            try {
                const { result } = await getLotteryStatistics(this.id)
                this.statistics = result
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style scoped lang="scss">
  .detail{
    .header {
      display: flex;
      /*justify-content: space-between;*/
      align-items: center;
      height: 52px;
      padding: 0 24px;
      background-color: #fff;
      button{
        margin-left: 16px;
      }
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
    }
    .top {
      display: flex;
      align-items: flex-end;
      height: 55px;
      background-color: #f6f6f6;
      > span {
        display: inline-block;
        width: 116px;
        line-height: 39px;
        font-size: 14px;
        text-align: center;
        font-weight: bold;
        cursor: pointer;
        &.active {
          background-color: #fff;
        }
      }
      .share-btn{
        width: 60px;
        position: absolute;
        right: 20px;
      }
    }
    .content {
      background-color: #fff;
    }
  }
</style>
