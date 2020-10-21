<template>
    <div class="newcomers-detail">
        <div class="newcomers-detail-content bg-white">
            <div class="statistic">
                <number-card
                    title="浏览量"
                    :value="newcomersInfo.viewNum || 0"
                    unit-name="次"
                />
                <number-card
                    title="访客量"
                    :value="newcomersInfo.visitorNum || 0"
                    unit-name="人"
                />
                <number-card
                    title="注册人数"
                    :value="newcomersInfo.registerNum || 0"
                    unit-name="人"
                />
                <number-card
                    title="领取量"
                    :value="newcomersInfo.claimNum || 0"
                    unit-name="人"
                />
            </div>
            <search-box class="mt-24">
                <el-form-item label="搜索内容：">
                    <el-input placeholder="搜索用户昵称/联系电话/分享人" v-model="queryFilter.keyWord" @change="doQuery" style="width: 200px" />
                </el-form-item>
                <el-form-item label="注册方式：">
                    <el-select v-model="queryFilter.registerType" @change="handleRegTypeChange">
                        <el-option label="全部" value="" />
                        <el-option label="自行注册" :value="0" />
                        <el-option label="分享注册" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="注册时间：">
                    <el-date-picker
                        v-model="queryFilter.time"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :editable="false"
                    />
                </el-form-item>
                <el-form-item label="领取状态：">
                    <el-select v-model="queryFilter.claimStatus" @change="handleClaimStatusChange">
                        <el-option label="全部" value="" />
                        <el-option label="未领取" :value="0" />
                        <el-option label="已领取" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button round type="primary" @click="doQuery">
                        查询
                    </el-button>
                    <el-button
                        type="text"
                        @click="handelShowExport"
                    >
                        导出数据
                    </el-button>
                    <el-button type="text" @click="resetFilter">
                        清空筛选条件
                    </el-button>
                </el-form-item>
            </search-box>
            <div class="query-data-grid">
                <el-table :data="usersInfo">
                    <span slot="empty" class="empty">
                        <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                        <span v-if="newcomersInfo.status === 1">活动未开始 暂无新用户数据哦~</span>
                        <span v-else-if="newcomersInfo.status === 2">暂无活动数据，快去分享吧~</span>
                        <span v-else>本活动没有新注册用户数据哦~</span>
                    </span>
                    <el-table-column
                        label="用户昵称"
                        prop="nickName"
                        align="left"
                        header-align="left"
                    />
                    <el-table-column
                        label="联系方式"
                        prop="mobile"
                    />
                    <el-table-column
                        label="性别"
                        prop="gender"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.gender === 0">保密</span>
                            <span v-if="scope.row.gender === 1">男</span>
                            <span v-if="scope.row.gender === 2">女</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="地址"
                        prop="address"
                    />
                    <el-table-column
                        label="注册时间"
                        prop="createTime"
                    />
                    <el-table-column
                        label="领取礼品"
                        width="200"
                    >
                        <template slot-scope="scope">
                            <el-button type="text" @click="handleViewPresent(scope.row)">
                                <span v-if="scope.row.couponModels.length">优惠券</span>
                                <span v-if="(scope.row.couponModels.length && scope.row.scholarships.length) ||
                                    (scope.row.couponModels.length && scope.row.gifts.length)"
                                > + </span>
                                <span v-if="scope.row.scholarships.length">奖学金</span>
                                <span v-if="scope.row.scholarships.length && scope.row.gifts.length"> + </span>
                                <span v-if="scope.row.gifts.length">礼品</span>
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="领取状态"
                    >
                        <template #default="{row}">
                            {{ CLAIMSTATUS[row.claimStatus] }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="领取时间"
                        prop="claimTime"
                    />
                    <el-table-column
                        label="注册方式"
                    >
                        <template #default="{row}">
                            {{ row.shareUser ? '分享注册' : '自行注册' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="right"
                        header-align="right"
                        label="分享人"
                        prop="shareUserName"
                    />
                </el-table>
                <Pagination
                    @change="query"
                    @sizeChange="sizeChange"
                    v-model="pagination.current"
                    :total="pagination.total"
                    :sizes="true"
                />
            </div>
        </div>
        <Verification :dialog-verification-visible.sync="isShowVerificationDialog" />
        <el-dialog :visible="showExport" width="484px" title="导出数据" @close="showExport = false">
            <el-form label-width="90px">
                <el-form-item label="搜索关键词">
                    <el-input placeholder="请输入用户昵称/联系电话/分享人" v-model="form.keyWord" style="width: 280px" />
                </el-form-item>
                <el-form-item label="注册方式">
                    <el-select v-model="form.registerType">
                        <el-option label="全部" value="" />
                        <el-option label="自行注册" :value="0" />
                        <el-option label="分享注册" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="领取状态">
                    <el-select v-model="form.claimStatus">
                        <el-option label="全部" value="" />
                        <el-option label="未领取" :value="0" />
                        <el-option label="已领取" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="注册时间" :error="regTimeError">
                    <el-radio-group v-model="regTimeType" @change="handleRegTimeType">
                        <el-radio :label="1">
                            7日内
                        </el-radio>
                        <el-radio :label="2">
                            30日内
                        </el-radio>
                        <el-radio :label="3">
                            自选时间
                        </el-radio>
                    </el-radio-group>
                    <el-date-picker
                        v-model="regTime"
                        type="daterange"
                        @change="regTimeChange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :disabled="regTimeType !== 3"
                    />
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="showExport = false">
                    取消
                </el-button>
                <el-button type="primary" @click="exportData">
                    确定导出
                </el-button>
            </div>
        </el-dialog>
        <PresentDialog :show.sync="presentDialog" :present-detail="presentDetail" />
    </div>
</template>

<script>
import moment from 'moment/moment'
import NumberCard from '../../components/NumberCard.vue'
import Pagination from '../../../../components/common/Pagination.vue'
import Verification from '../../../../components/order-center/Verification.vue'
import { createObjectUrl } from '../../../../assets/ts/upload'
import {
    getNewcomerActivitysStat,
    getNewcomersActivityUsersInfo,
    exportNewcomerActivitysDeatil
} from '../../../../apis/marketing-manage/newcomers'
import PresentDialog from './PresentDetail'
export default {
    name: 'NewcomersData',
    components: {
        NumberCard,
        Pagination,
        Verification,
        PresentDialog
    },
    data () {
        return {
            STATUS: ['已结束', '未开始', '进行中'],
            CLAIMSTATUS: ['未领取', '已领取'],
            queryFilter: {
                keyWord: '',
                claimStatus: '',
                time: [],
                registerType: ''
            },
            pagination: {
                current: 1,
                size: 10,
                total: 0
            },
            usersInfo: [],
            newcomersInfo: {},
            isShowVerificationDialog: false,
            showExport: false,
            form: {
                registerType: '',
                keyWord: '',
                claimStatus: '',
                startTime: '',
                endTime: ''
            },
            regTimeType: 1,
            regTime: [],
            regTimeError: '',
            presentDialog: false,
            presentDetail: {}
        }
    },
    async activated () {
        this.$parent.showTop = true
        await this.getDetail()
        await this.doQuery()
    },
    deactivated () {
        this.queryFilter = {
            keyWord: '',
            claimStatus: '',
            time: [],
            registerType: ''
        }
    },
    methods: {
        handleViewPresent (val) {
            this.presentDialog = true
            this.presentDetail = val
        },
        resetFilter () {
            this.queryFilter = {
                keyWord: '',
                claimStatus: '',
                time: [],
                registerType: ''
            }
            this.pagination = {
                current: 1,
                size: 10,
                total: 0
            }
            this.doQuery()
        },
        handelShowExport () {
            this.showExport = true
            const { registerType, keyWord, claimStatus, time } = this.queryFilter
            this.form.registerType = registerType
            this.form.keyWord = keyWord
            this.form.claimStatus = claimStatus
            if (time[0] && time[1]) {
                this.regTimeType = 3
                this.handleRegTimeType(3)
            } else {
                this.regTimeType = 1
                this.handleRegTimeType(1)
            }
        },
        handleRegTimeType (val) {
            if (val === 1) {
                this.form.startTime = moment().subtract(7, 'days')
                this.form.endTime = moment()
            }
            if (val === 2) {
                this.form.startTime = moment().subtract(1, 'month')
                this.form.endTime = moment()
            }
            if (val === 3) {
                this.form.startTime = this.queryFilter.time[0]
                this.form.endTime = this.queryFilter.time[1]
            }
            this.regTimeError = ''
            this.regTime = [this.form.startTime, this.form.endTime]
        },
        regTimeChange (val) {
            this.form.startTime = moment(val[0])
            this.form.endTime = moment(val[1])
            this.regTimeError = ''
            this.regTime = [this.form.startTime, this.form.endTime]
        },
        async getDetail () {
            const { result } = await getNewcomerActivitysStat(this.$route.params.id)
            this.$parent.newcomersInfo = result
            this.newcomersInfo = result
        },
        async query () {
            const queryParams = {}

            if (this.queryFilter.keyWord) {
                queryParams.keyWord = this.queryFilter.keyWord
            }
            queryParams.claimStatus = this.queryFilter.claimStatus
            queryParams.registerType = this.queryFilter.registerType
            const [startTime, endTime] = this.queryFilter.time || []
            if (startTime) {
                queryParams.startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss')
            }
            if (endTime) {
                queryParams.endTime = `${ moment(endTime).format('YYYY-MM-DD') } 23:59:59`
            }

            queryParams.current = this.pagination.current
            queryParams.size = this.pagination.size

            const { result } = await getNewcomersActivityUsersInfo(this.$route.params.id, queryParams)
            this.pagination.total = result.total
            this.usersInfo = result.records
        },
        async handleClaimStatusChange (val) {
            this.queryFilter.claimStatus = val
            await this.query()
        },
        async handleRegTypeChange (val) {
            this.queryFilter.registerType = val
            await this.query()
        },
        async doQuery () {
            this.pagination.current = 1
            await this.query()
        },
        async handlePageChange () {
            await this.query()
        },
        sizeChange (val) {
            this.pagination.current = 1
            this.pagination.size = val
            this.query()
        },
        // 导出数据
        async exportData () {
            if (!this.form.startTime && !this.form.endTime) {
                this.regTimeError = '请选择注册时间'
                return false
            }
            if (this.form.startTime) {
                this.form.startTime = moment(this.form.startTime).startOf('day')
                    .format('YYYY-MM-DD HH:mm:ss')
            }
            if (this.form.endTime) {
                this.form.endTime = moment(this.form.endTime).endOf('day')
                    .format('YYYY-MM-DD HH:mm:ss')
            }
            try {
                const blob = await exportNewcomerActivitysDeatil(this.$route.params.id, this.form)
                const url = createObjectUrl(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${ this.newcomersInfo.activityName }${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
                a.click()
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.newcomers-detail {
  .newcomers-detail-header {
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
      display: inline-block;
      box-sizing: border-box;
      height: 30px;
      line-height: 28px;
      padding-left: 10px;
      border-radius: 15px;
      border: 1px solid rgb(204, 204, 204);
      font-size: 16px;
      color: #666666;
    }
  }

  .newcomers-detail-content {
    .statistic {
      display: flex;
      justify-content: flex-start;
      height: 158px;
      padding: 23px 0;
    }
    .query-data-grid {
      padding: 20px 0;
    }
  }
}
</style>
