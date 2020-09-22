<template>
    <div class="bg-white">
        <div class="newcomers-list-header">
            <img class="mr-10" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/marketing-manage/invite-newcomers-gift/gift@1x.png">
            <span class="mr-10 font-weight-bold">新人有礼</span>
            <span class="items description">- 新人注册&nbsp;送礼活动</span>
            <div class="active-time">
                <pl-svg width="16" name="icon-riqi" fill="#999" class="mr-10" />
                使用有效期：长期有效
            </div>
            <el-button type="primary" round @click="$router.push({ name: 'NewcomersAdd' })">
                新建活动
                <i class="el-icon-plus el-icon--right" />
            </el-button>
            <el-button type="text" @click="showExplanation = true">
                活动说明
            </el-button>
        </div>
        <div class="newcomers-list">
            <search-box class="mt-24">
                <el-form-item label="搜索内容：">
                    <el-input placeholder="请输入活动名称" v-model="queryFilter.activityName" @change="doQuery" clearable />
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select v-model="queryFilter.status" @change="doQuery">
                        <el-option label="全部" :value="-1" />
                        <el-option label="已结束" :value="0" />
                        <el-option label="未开始" :value="1" />
                        <el-option label="进行中" :value="2 " />
                    </el-select>
                </el-form-item>
                <el-form-item label="活动时间：">
                    <el-date-picker
                        v-model="queryFilter.time"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :editable="false"
                        @change="doQuery"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button round type="primary" @click="doQuery" plain>
                        查询
                    </el-button>
                    <el-button round type="text" @click="resetFilter">
                        清空筛选条件
                    </el-button>
                </el-form-item>
            </search-box>
            <div>
                <el-table
                    :data="activityList"
                >
                    <span slot="empty" class="empty">
                        <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                        还没有相关活动哦 快去新建吧~
                    </span>
                    <el-table-column
                        label="活动名称"
                        prop="activityName"
                    />
                    <el-table-column label="活动礼品" width="200">
                        <template slot-scope="scope">
                            <!-- <el-button type="text" @click="handleViewPresent(scope.row)"> -->
                            <span v-if="scope.row.couponModels.length">优惠券</span>
                            <span v-if="(scope.row.couponModels.length && scope.row.scholarships.length) ||
                                (scope.row.couponModels.length && scope.row.gifts.length)"
                            > + </span>
                            <span v-if="scope.row.scholarships.length">奖学金</span>
                            <span v-if="scope.row.scholarships.length && scope.row.gifts.length"> + </span>
                            <span v-if="scope.row.gifts.length">礼品</span>
                            <!-- </el-button> -->
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="发放数量"
                        width="80"
                    >
                        <template #default="{row}">
                            {{ row.limited === 0 ? '不限' : row.publishNum }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="领取量"
                        prop="claimNum"
                        width="150"
                    />
                    <el-table-column
                        label="隐藏/展示领取量"
                        width="150"
                    >
                        <template #default="{row}">
                            <el-switch
                                v-model="row.claimNumShow"
                                @change="handleClaimNumShow(row)"
                            />
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
            label="注册人数"
            prop="registerNum"
            width="90"
          /> -->
                    <el-table-column label="活动时间">
                        <template slot-scope="scope">
                            {{ scope.row.activityStartTime | dateFormat('YYYY-MM-DD') }} - {{ scope.row.activityEndTime | dateFormat('YYYY-MM-DD') }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="活动状态"
                        prop="status"
                        width="90"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.status === 0">已结束</span>
                            <span v-if="scope.row.status === 1">未开始</span>
                            <span v-if="scope.row.status === 2">进行中</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
            label="浏览量"
            prop="viewNum"
            width="80"
          />
          <el-table-column
            label="访客数"
            prop="visitorNum"
            width="80"
          /> -->
                    <el-table-column
                        label="操作"
                        align="right"
                        header-align="right"
                        width="100"
                    >
                        <template slot-scope="{ row }">
                            <Operating>
                                <template slot="button-box">
                                    <a v-if="row.status !==0" @click="editActivity(row.id)">
                                        编辑
                                    </a>
                                    <a @click="viewActivityDetail(row.id)">
                                        详情
                                    </a>
                                    <a @click="preview(row)">
                                        预览
                                    </a>
                                    <a @click="viewActivity(row.id)" v-if="row.status !== 1">
                                        查看数据
                                    </a>
                                    <a
                                        v-if="row.status === 0"
                                        @click="deleteActivity (row)"
                                    >
                                        删除
                                    </a>
                                    <a
                                        v-if="row.status === 1 || row.status === 2"
                                        @click="over(row.id, row.status)"
                                    >
                                        结束
                                    </a>
                                    <a
                                        @click="$router.push({name: 'NewcomersCopy',params: { id: row.id }})"
                                    >
                                        复制
                                    </a>
                                    <a
                                        @click="share(row.id)"
                                        v-if="row.status !== 0"
                                    >
                                        分享
                                    </a>
                                </template>
                            </Operating>
                        </template>
                    </el-table-column>
                </el-table>
                <Pagination
                    @change="query"
                    @sizeChange="sizeChange"
                    v-model="pagination.current"
                    :total="pagination.total"
                    :sizes="true"
                />
            </div>
            <el-dialog title="新人有礼活动升级啦~" :visible.sync="dlgCreate" width="484px" :show-close="false">
                <div class="tips-text mb24">
                    新人有礼活动升级后，除可设置给新注册用户赠送优惠券外， 还可赠送<span>小礼品</span>或<span>奖学金</span>哦~
                </div>
                <div class="tips-text">
                    大家快去创建新活动，体验一下新功能吧~~
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dlgCreate = false">
                        我知道了
                    </el-button>
                    <el-button type="primary" @click="dlgCreate = false;$router.push({ name: 'NewcomersAdd' })">
                        去创建活动
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="newcomersDialog" width="760px" custom-class="newcomers-dialog">
                <div class="newcomers">
                    <div class="example">
                        <img width="280" src="https://mallcdn.youpenglai.com/static/admall/2.11.0/newcomer_guide.png">
                    </div>
                    <div class="info">
                        <div class="title">
                            新人有礼
                        </div>
                        <div class="line" />
                        <div class="desc-title">
                            玩法介绍
                        </div>
                        <div class="desc">
                            引导新人注册成为会员，即可获得相应的新人优惠 大礼包，包括可设置优惠券、奖学金和礼品，并可 起到拉新，扩大用户池的作用。
                        </div>
                        <el-button type="primary" class="create-btn" @click="$router.push({ name: 'NewcomersAdd' })">
                            创建活动
                        </el-button>
                    </div>
                </div>
            </el-dialog>
            <Share :show.sync="qrcodeShow" :qrcode-text="qrcodeText" ref="share" />
            <NewcomersSetting :show.sync="showExplanation" />
            <PresentDialog :show.sync="presentDialog" :present-detail="presentDetail" />
        </div>
        <Preview :show.sync="showPreview">
            <NewUserPreview :data="currentPreData" />
        </Preview>
    </div>
</template>

<script>
import moment from 'moment/moment'
import Pagination from '../../../../components/common/Pagination.vue'
import Share from '../../../../components/common/Share.vue'
import { getCouponList } from '../../../../apis/marketing-manage/coupon'
import { getNewcomersActivities, updateNewcomersActivityStatus, deleteNewcomersActivityStatus, claimNumShowFunc, isShowGuide } from '../../../../apis/marketing-manage/newcomers'
import NewcomersSetting from './Newcomers-Setting'
import PresentDialog from './PresentDetail'
import Preview from '../../../../components/common/Preview'
import NewUserPreview from './components/New-User-Preview.vue'

export default {
    name: 'NewcomersList',
    components: {
        NewcomersSetting,
        Pagination,
        Share,
        PresentDialog,
        Preview,
        NewUserPreview
    },
    data () {
        return {
            dlgCreate: false,
            showPreview: false,
            activityList: [],
            currentPreData: {},
            queryFilter: {
                activityName: '',
                time: [],
                status: -1
            },
            pagination: {
                current: 1,
                size: 10,
                total: 0
            },
            // 分享链接
            qrcodeText: '',
            // 分享开关,
            qrcodeShow: false,
            showExplanation: false,
            newcomersDialog: false,
            presentDialog: false,
            presentDetail: {}
        }
    },
    async activated () {
        this.$parent.showTop = false
        try {
            // await this.getCouponList()
            await this.doQuery()
            const { data: { result } } = await isShowGuide()
            // 新用户
            if (result === 1) {
                this.newcomersDialog = true
                // 老用户
            } else if (result === 2) {
                this.dlgCreate = true
            } else {
                this.dlgCreate = false
                this.newcomersDialog = false
            }
        } catch (e) {
            throw e
        }
    },
    deactivated () {
        this.resetFilter()
    },
    methods: {
        handleViewPresent (val) {
            this.presentDialog = true
            this.presentDetail = val
        },
        async handleClaimNumShow (row) {
            const claimNumShow = row.claimNumShow ? 1 : 0
            try {
                await claimNumShowFunc(row.id, claimNumShow)
            } catch (e) {
                // 修改错误时恢复旧值
                this.$set(row, 'claimNumShow', !claimNumShow)
                throw e
            }
        },
        openDlgCreate () {
            this.dlgCreate = true
        },
        closeDlgCreate () {
            this.dlgCreate = false
        },

        editActivity (id) {
            this.$router.push({ name: 'NewcomersEdit', params: { id } })
        },
        viewActivity (id) {
            this.$router.push({ name: 'NewcomersData', params: { id } })
        },
        viewActivityDetail (id) {
            this.$router.push({ name: 'NewcomersDetail', params: { id } })
        },
        // 预览
        preview (row) {
            this.currentPreData = row
            this.showPreview = true
        },
        async getCouponList () {
            try {
                const { data: { result } } = await getCouponList({
                    distributionMethod: 1,
                    status: 4,
                    couponType: '1,2'
                })
                const records = result.records
                if (records.length === 0) {
                    this.openDlgCreate()
                }
            } catch (e) {
                throw e
            }
        },

        async query () {
            const queryParams = {}

            if (this.queryFilter.activityName) {
                queryParams.activityName = this.queryFilter.activityName
            }
            const [startTime, endTime] = this.queryFilter.time || []
            if (startTime) {
                queryParams.startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss')
            }
            if (endTime) {
                queryParams.endTime = `${ moment(endTime).format('YYYY-MM-DD') } 23:59:59`
            }
            if (this.queryFilter.status !== -1) {
                queryParams.status = this.queryFilter.status
            }
            // pagination
            queryParams.current = this.pagination.current
            queryParams.size = this.pagination.size

            try {
                const { data: { result } } = await getNewcomersActivities(queryParams)
                this.activityList = result.records
                this.pagination.total = result.total
            } catch (e) {
                throw e
            }
        },
        async doQuery () {
            this.pagination.current = 1
            try {
                await this.query()
            } catch (e) {
                throw e
            }
        },
        resetFilter () {
            this.queryFilter = {
                activityName: '',
                time: [],
                status: -1
            }
            this.pagination = {
                current: 1,
                size: 10,
                total: 0
            }
            this.doQuery()
        },
        async sizeChange (val) {
            this.pagination.current = 1
            this.pagination.size = val
            try {
                await this.query()
            } catch (e) {
                throw e
            }
        },
        async over (id, status) {
            await this.$confirm({
                title: '确认要结束新人有礼活动吗？',
                message: status === 2 ? '新人有礼活动结束后，新注册用户将不可获得新人礼包！ 结束后不影响已领取新人礼包的用户。' : '新人有礼活动结束后，活动不会在商城中展示。'
            })
            await updateNewcomersActivityStatus(id, 0)
            this.query()
        },
        async deleteActivity (row) {
            // 删除
            try {
                await this.$confirm({
                    title: '确认要删除此活动吗？',
                    message: '活动删除后，将不可查看活动期间的相关数据！ 请谨慎进行删除操作。'
                })
                await deleteNewcomersActivityStatus(row.id)
                if (this.activityList.length === 1 && this.pagination.current !== 1) this.pagination.current--
                await this.query()
            } catch (e) {
                throw e
            }
        },
        share (id) {
            this.qrcodeText = `${ this.$store.getters.mallUrl }/newcomers/${ id }?noCache=${ Date.now() }`
            this.qrcodeShow = true
        }
    }
}
</script>

<style lang="scss" scoped>
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
      color: #A8A8A8
    }
  }
  .active-time{
    margin-right: 16px;
    border:1px solid rgba(204,204,204,1);
    border-radius:130px;
    padding: 2px 10px;
    font-size:16px;
    color: #666666;
  }
  .newcomers-list {
    padding: 20px;
    .newcomers-list-content {
      background-color: white;
    }
  }
  .copy-btn{
    color: #222;
    padding: 8px 32px;
    &:hover{
      background: #eee;
    }
  }
  .tips-text{
    color: #666;
    line-height: 20px;
    span {
      color: #F2B036;
    }
  }
  .mb24{
    margin-bottom: 20px;
  }
  ::v-deep .el-dialog__wrapper{
    .newcomers-dialog{
      .el-dialog__header{
        padding: 0;
      }
      .el-dialog__body{
        padding: 0;
      }
      .newcomers{
        display: flex;
        .example{
          padding: 40px;
          background: #f8f8f8;
          margin-right: 56px;
          text-align: center;
        }
        .info{
          flex-grow: 1;
          margin-right: 36px;
          .title{
            margin-top: 100px;
            font-size: 24px;
            margin-bottom: 16px;
            font-weight: bold;
          }
          .line{
            width: 48px;
            height: 4px;
            background: linear-gradient(180deg,rgba(242,176,54,1) 0%,rgba(254,119,0,1) 100%);
          }
          .desc-title{
            margin-top: 24px;
            font-family: MicrosoftYaHeiSemibold;
            font-size: 14px;
            line-height: 28px;
          }
          .desc{
            font-size: 14px;
            line-height: 28px;
            padding-bottom: 36px;
            border-bottom: 1px solid #E7E7E7;
          }
          .create-btn{
            width: 100%;
            height: 60px;
            font-size: 24px;
            margin-top: 36px;
          }
        }
      }
    }
  }
  .el-popover-custom{
    padding: 0 !important;
  }
</style>
