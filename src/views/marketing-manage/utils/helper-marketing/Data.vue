<template>
    <div>
        <div class="header border-bottom">
            <div>
                <span class="fz-16 font-weight-bold">{{ detail.activityName }}</span>
            </div>
            <div class="status">
                <pl-svg width="16" name="icon-shijian1" fill="#fff" />
                <template v-if="detail.activityStatus === 'NOT_OPEN'">
                    未开始
                </template>
                <template v-else-if="detail.activityStatus === 'ONGOING'">
                    进行中...
                </template>
                <template v-else-if="detail.activityStatus === 'PAUSE'">
                    已暂停
                </template>
                <template v-else>
                    已结束
                </template>
            </div>
            <ActiveTime title="活动时间" :time="`${detail.activityStartTime} - ${detail.activityEndTime}`" />
        </div>
        <div class="data-wrap">
            <div class="data-box">
                <div class="data-type-name">
                    活动商品数量
                </div>
                <div class="data-value">
                    <span>{{ statistics.orderTotal || 0 }}</span>个
                </div>
            </div>
            <div class="data-box">
                <div class="data-type-name">
                    知识课程数量
                </div>
                <div class="data-value">
                    <span>{{ statistics.orderTotalPrice || 0 }}</span>个
                </div>
            </div>
            <div class="data-box">
                <div class="data-type-name">
                    参与Helper人数
                </div>
                <div class="data-value">
                    <span>{{ statistics.ovdNumberTotal || 0 }}</span>人
                </div>
            </div>
            <div class="data-box">
                <div class="data-type-name">
                    购买数量
                </div>
                <div class="data-value">
                    <span>{{ statistics.ipNumberTotal || 0 }}</span>个
                </div>
            </div>
            <div class="data-box">
                <div class="data-type-name">
                    收益金额
                </div>
                <div class="data-value">
                    <span>{{ statistics.watchTimeTotalTime || 0 }}</span>元
                </div>
            </div>
            <div class="data-box">
                <div class="data-type-name">
                    润笔金额
                </div>
                <div class="data-value">
                    <span>{{ statistics.useDataFlowSize_G || 0 }}</span>元
                </div>
            </div>
        </div>
        <pl-tabs :tabs="tabs" />
        <div class="helper-data">
            <keep-alive>
                <router-view />
            </keep-alive>
        </div>
    </div>
</template>

<script>
import ActiveTime from '../../components/Active-Time.vue'
import { getStatistics, getActivity } from '../../../../apis/marketing-manage/helper'
export default {
    name: 'Data',
    components: {
        ActiveTime
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            detail: {},
            statistics: {},
            tabs: [
                {
                    name: 'MarketingManageDataOfProduct',
                    label: '商品数据'
                },
                {
                    route: 'MarketingManageDataOfHelper',
                    name: 'helper数据'
                }
            ]
        }
    },
    async activated () {
        try {
            this.addParam()
            await this.getDetail()
            await this.getStatistics()
        } catch (e) {
            throw e
        }
    },
    methods: {
        addParam () {
            this.tabs.forEach(item => {
                item.params = { id: this.id }
            })
        },
        // 活动详情
        async getDetail () {
            try {
                const { data } = await getActivity(this.id)
                const { activityName, activityStartTime, activityEndTime, activityStatus } = data.result
                this.detail = { activityName, activityStartTime, activityEndTime, activityStatus }
            } catch (e) {
                throw e
            }
        },
        // 获取统计数据
        async getStatistics () {
            try {
                const { data: { result } } = await getStatistics(this.id)
                this.statistics = result
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style scoped lang="scss">
  .data-wrap {
    display: flex;
    padding: 24px 56px;
    margin-bottom: 20px;
    border-bottom: 1px solid #E7E7E7;
    background-color: #fff;
    .data-box {
      flex: 1;
      margin-right: 40px;
      border-right: 1px solid #e7e7e7;
      &:nth-last-of-type(1) {
        border-right: none;
        margin-right: 0;
      }
    }
    .data-type-name {
      margin-bottom: 28px;
      font-size: 18px;
      line-height: 24px;
      font-weight: bold;
    }
    .data-value {
      margin-bottom: 6px;
      color: #666;
      > span {
        margin-right: 14px;
        font-size: 50px;
        line-height: 50px;
        color: #333;
      }
    }
  }
  .header {
    display: flex;
    /*justify-content: space-between;*/
    align-items: center;
    height: 52px;
    padding: 0 24px;
    background-color: #fff;
    .status {
      margin-left: 20px;
      margin-right: 20px;
      padding: 2px 12px;
      background-color: #ec742e;
      border-radius: 130px;
      color: #fff;
    }
  }
  .helper-data {
    margin-top: 20px;
    margin-left: 20px;
  }
</style>
