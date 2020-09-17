<template>
    <div class="road-learning-detail wrap">
        <top-back />
        <div class="road-learning-detail-header bg-white mb-20">
            <div class="flex align-item-center">
                <img class="mr-10" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/marketing-manage/invite-newcomers-gift/gift@1x.png">
                <span class="mr-30 font-weight-bold fz-16">见学之旅</span>
                <span class="status mr-30">
                    <img style="vertical-align: middle;"
                         src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/marketing-manage/invite-newcomers-gift/clock-white@1x.png"
                    >
                    {{ statusDesc[checkInStatModel.status] }}
                </span>
                <span class="valid-date">
                    <img style="vertical-align: middle;"
                         src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/marketing-manage/invite-newcomers-gift/cale@1x.png"
                    >
                    活动时间：{{ checkInStatModel.activityStartTime | dateFormat('YYYY.MM.DD') }} - {{ checkInStatModel.activityEndTime | dateFormat('YYYY.MM.DD') }}
                </span>
            </div>
        </div>
        <div class="road-learning-detail-content bg-white">
            <div class="statistic">
                <number-card
                    title="浏览量"
                    :value="checkInStatModel.viewNum"
                    unit-name="人"
                />
                <number-card
                    title="访客量"
                    :value="checkInStatModel.visitorNum"
                    unit-name="人"
                />
                <number-card
                    title="参与签到人数"
                    :value="checkInStatModel.checkInNum"
                    unit-name="人"
                />
                <number-card
                    title="获得抽奖机会人数"
                    :value="checkInStatModel.canLotteNum"
                    unit-name="人"
                />
                <number-card
                    title="获得奖品人数"
                    :value="checkInStatModel.prizewinnerNum"
                    unit-name="人"
                />
            </div>
            <search-box class="mt-24" label-width="85px">
                <el-form-item label="搜索内容：">
                    <el-input placeholder="请输入真实姓名/昵称/联系方式" v-model="filterCondition.keyWord" clearable />
                </el-form-item>
                <el-form-item label="抽奖时间：">
                    <date-range
                        class="mr-20"
                        clearable
                        @change="formatTimeRange"
                    />
                </el-form-item>
                <div />
                <el-form-item>
                    <el-button round type="primary" @click="getActivityGiftList">
                        查询
                    </el-button>
                    <el-button round plain @click="isShowVerificationDialog = true">
                        去核销
                    </el-button>
                    <el-button round plain @click="exportList">
                        导出数据
                    </el-button>
                </el-form-item>
            </search-box>
            <div class="query-data-grid">
                <el-table :data="giftList">
                    <el-table-column
                        label="真实姓名"
                        prop="name"
                    />
                    <el-table-column
                        prop="nickName"
                        label="昵称"
                    />
                    <el-table-column
                        prop="mobile"
                        label="联系方式"
                    />
                    <el-table-column
                        prop="numberOfCheckIns"
                        label="签到次数"
                    />
                    <el-table-column
                        prop="createTime"
                        label="抽奖时间"
                    />
                    <el-table-column
                        prop="giftName"
                        label="获得奖励"
                    />
                    <el-table-column
                        label="兑换有效期"
                        width="280"
                    >
                        <template #default="{ row }">
                            <span>{{ row.useStartTime }}-{{ row.useEndTime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template #default="{ row }">
                            <span>{{ giftStatus[row.status] || '--' }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination
                    :total="total"
                    :sizes="true"
                    v-model="filterCondition.current"
                    @change="getActivityGiftList"
                    @sizeChange="sizeChange"
                />
            </div>
        </div>
        <Verification :dialog-verification-visible.sync="isShowVerificationDialog" />
    </div>
</template>

<script>
import NumberCard from '../../../components/NumberCard'
import Verification from '../../../../../components/order/Verification.vue'
import moment from 'moment/moment'
import { createObjectUrl } from '../../../../../assets/ts/upload'
import { getActivityStat, getActivityGiftList, exportActivityGiftList } from '../../../../../apis/marketing-manage/newcomers'

export default {
    name: 'RoadLearningDetail',
    components: {
        NumberCard,
        Verification
    },
    data () {
        return {
            id: '',
            filterCondition: {
                keyWord: '',
                startTime: '',
                endTime: '',
                current: 1,
                size: 10
            },
            checkInStatModel: {
                // 浏览量
                viewNum: 0,
                // 访客量
                visitorNum: 0,
                // 参与签到人数
                checkInNum: 0,
                // 获得抽奖机会人数
                canLotteNum: 0,
                // 获得奖品人数
                prizewinnerNum: 0,
                // 活动状态
                status: 0,
                activityStartTime: '', // 活动开始时间
                activityEndTime: '' // 活动结束时间
            },
            giftStatus: {
                0: '未领取',
                1: '已领取'
            },
            statusDesc: {
                0: '已结束',
                1: '未开始',
                2: '进行中'
            },
            giftList: [],
            total: 0,
            isShowVerificationDialog: false
        }
    },
    async activated () {
        const params = this.$route.params
        if (params.id) this.id = params.id
        if (this.id) {
            await this.init()
        }
    },
    async deactivated () {
        this.filterCondition = {
            keyWord: '',
            startTime: '',
            endTime: '',
            current: 1,
            size: 10
        }
    },
    methods: {
        async init () {
            try {
                await this.getActivityStat()
                await this.getActivityGiftList()
            } catch (e) {
                throw e
            }
        },
        async getActivityStat () {
            const { data } = await getActivityStat(this.id)
            this.checkInStatModel = {
                viewNum: Number(data.result.viewNum),
                visitorNum: Number(data.result.visitorNum),
                checkInNum: Number(data.result.checkInNum),
                canLotteNum: Number(data.result.canLotteNum),
                prizewinnerNum: Number(data.result.prizewinnerNum),
                status: Number(data.result.status),
                activityStartTime: data.result.activityStartTime,
                activityEndTime: data.result.activityEndTime
            }
        },
        async getActivityGiftList () {
            const { data: res } = await getActivityGiftList(this.id, this.filterCondition)
            if (res.result.records.length === 0 && this.filterCondition.current > 1) {
                this.filter.current--
                this.getActivityGiftList()
                return
            }
            this.giftList = res.result.records
            this.giftList.forEach(item => {
                item.createTime = item.createTime || '--'
                item.giftName = item.giftName || '--'
                item.useStartTime = item.useStartTime || '-'
            })
            this.total = res.result.total
        },
        async sizeChange (newSize) {
            this.filterCondition.current = 1
            this.filterCondition.size = newSize
            try {
                await this.getActivityGiftList()
            } catch (e) {
                throw e
            }
        },
        formatTimeRange ({ start, end }) {
            this.filterCondition.startTime = start || ''
            this.filterCondition.endTime = end || ''
        },
        async exportList () {
            // 导出数据
            try {
                const giftList = await exportActivityGiftList(this.id)
                const url = createObjectUrl(giftList)
                const aElement = document.createElement('a')
                aElement.href = url
                aElement.download = `见学之旅${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
                aElement.click()
            } catch (e) {
                throw e
            }
        }
    },
    watch: {
        filterCondition: {
            handler () {
                this.getActivityGiftList()
            },
            deep: true
        }
    }
}
</script>

<style lang="scss" scoped>
.road-learning-detail {
  .road-learning-detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 52px;
    padding-left: 24px;
    padding-right: 24px;
    .mr-30 {
      margin-right: 30px;
    }

    .status {
      display: inline-block;
      width: 104px;
      height: 30px;
      line-height: 28px;
      border-radius: 15px;
      font-size: 16px;
      color: white;
      background-color: #ec742e;
      text-align: center;
    }

    .valid-date {
      display: inline-flex;
      align-items: center;
      justify-content: space-around;
      box-sizing: border-box;
      height: 30px;
      width: 320px;
      padding: 0 10px;
      border-radius: 15px;
      border: 1px solid rgb(204, 204, 204);
      font-size: 16px;
      color: #666666;
    }
  }

  .road-learning-detail-content {
    .statistic {
      display: flex;
      justify-content: flex-start;
      height: 158px;
      padding: 23px 0;
    }
    .query-filters {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 54px;
      padding-left: 30px;

      .search{
        width: 240px!important;
      }

      .el-input {
        width: 200px;
      }

      .mr-40 {
        margin-right: 40px;
      }

      .fz-12 {
        font-size: 12px;
      }
    }
    .query-data-grid {
      padding: 20px 0;
    }
  }
}
</style>
