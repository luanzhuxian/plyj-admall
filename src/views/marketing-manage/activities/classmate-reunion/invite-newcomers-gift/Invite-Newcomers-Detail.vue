<template>
    <div class="invite-newcomers-detail">
        <div class="invite-newcomers-detail-header">
            <div class="flex align-item-center">
                <img class="mr-10" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/marketing-manage/invite-newcomers-gift/ticket@1x.png">
                <span class="mr-30 font-weight-bold fz-16">{{ detail.invitingEventsEntity.activityName }}</span>
                <span class="status mr-30">
                    <img style="vertical-align: middle;" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/marketing-manage/invite-newcomers-gift/clock-white@1x.png">&nbsp;
                    <span v-if="detail.invitingEventsEntity.status === 0">已停止</span>
                    <span v-if="detail.invitingEventsEntity.status === 1">未开始</span>
                    <span v-if="detail.invitingEventsEntity.status === 2">进行中</span>...
                </span>
                <span class="valid-date mr-30">
                    <img style="vertical-align: middle;" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/marketing-manage/invite-newcomers-gift/cale@1x.png">
                    活动时间：{{ detail.invitingEventsEntity.activityStartTime }} - {{ detail.invitingEventsEntity.activityEndTime }}&nbsp;
                </span>
                <el-button round type="primary" @click="share()">
                    分享活动
                </el-button>
            </div>
        </div>
        <div class="invite-newcomers-detail-content bg-white">
            <div class="statistic border-bottom">
                <div class="number-card">
                    <div class="style1">
                        <div class="title fz-18 font-weight-bold">
                            浏览量
                        </div>
                        <div class="value-line">
                            <span class="value">{{ detail.activityStatModel.viewNum }}</span>
                            <span class="unit-name">人</span>
                        </div>
                    </div>
                </div>
                <div class="number-card">
                    <div class="style1">
                        <div class="title fz-18 font-weight-bold">
                            访客量
                        </div>
                        <div class="value-line">
                            <span class="value">{{ detail.activityStatModel.visitorNum }}</span>
                            <span class="unit-name">人</span>
                        </div>
                    </div>
                </div>
                <div class="number-card">
                    <div class="style1">
                        <div class="title fz-18 font-weight-bold">
                            发起人数
                        </div>
                        <div class="value-line">
                            <span class="value">{{ detail.activityStatModel.invitedPeopleNumber }}</span>
                            <span class="unit-name">人</span>
                        </div>
                    </div>
                </div>
                <div class="number-card">
                    <div class="style1">
                        <div class="title fz-18 font-weight-bold">
                            邀请注册新人数
                        </div>
                        <div class="value-line">
                            <span class="value">{{ detail.activityStatModel.registerNum }}</span>
                            <span class="unit-name">人</span>
                        </div>
                    </div>
                </div>
                <div class="number-card">
                    <div class="style1">
                        <div class="title fz-18 font-weight-bold">
                            获奖人数
                        </div>
                        <div class="value-line">
                            <span class="value">{{ detail.activityStatModel.claimerNum }}</span>
                            <span class="unit-name">人</span>
                        </div>
                    </div>
                </div>
            </div>
            <search-box class="mt-24">
                <el-form-item label="搜索内容：">
                    <el-input
                        v-model.trim="params.keyWord"
                        clearable
                        placeholder="搜索发起人昵称/手机号"
                        @change="search"
                    />
                </el-form-item>
                <!-- 目前列表按照发起人展示，礼品合并到弹框招式，状态暂时不可查，隐藏 -->
                <el-form-item
                    v-if="false"
                    label="状态："
                    style="margin-left:20px;"
                >
                    <el-select
                        :clearable="true"
                        v-model="params.status"
                        @change="search"
                        style="width: 128px;"
                    >
                        <el-option
                            label="全部"
                            value=""
                        />
                        <el-option
                            label="未使用"
                            :value="0"
                        />
                        <el-option
                            label="已使用"
                            :value="1"
                        />
                        <el-option
                            label="已过期"
                            :value="99"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="领取奖品时间：">
                    <el-date-picker
                        v-model="daterange"
                        @change="daterangeChange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                        :editable="false"
                    />
                </el-form-item>
                <div />
                <el-form-item>
                    <el-button
                        round
                        type="primary"
                        @click="search"
                    >
                        查询
                    </el-button>
                    <el-button
                        round
                        type="primary"
                        @click="exportData"
                        :disabled="total === 0"
                    >
                        导出数据
                    </el-button>
                    <el-button round plain @click="isShowVerificationDialog = true">
                        去核销
                    </el-button>
                </el-form-item>
            </search-box>

            <el-table :data="data">
                <el-table-column
                    label="发起人"
                    prop="userName"
                    align="left"
                    header-align="left"
                />
                <el-table-column
                    label="手机号"
                    prop="mobile"
                />
                <el-table-column
                    label="邀请注册新人数"
                >
                    <template slot-scope="scope">
                        <el-popover
                            width="480"
                            placement="bottom"
                        >
                            <div :class="{'popover-height': scope.row.helperAmount > 3 }">
                                <el-table :data="scope.row.helpers || []">
                                    <el-table-column
                                        label="头像"
                                    >
                                        <template #default="{ row: helper }">
                                            <img
                                                width="50"
                                                height="50"
                                                style="object-fit: cover; vertical-align: middle;"
                                                :src="helper.headImgUrl + '?x-oss-process=style/thum-middle'"
                                                v-viewer
                                            >
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="手机号"
                                        width="160"
                                        prop="mobile"
                                    />
                                    <el-table-column
                                        label="昵称"
                                        width="130"
                                        prop="nickName"
                                    />
                                </el-table>
                            </div>
                            <el-button slot="reference" type="text">
                                {{ scope.row.helperAmount || 0 }}
                            </el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    label="获得奖品数"
                    align="right"
                    header-align="right"
                >
                    <template slot-scope="scope">
                        <el-popover
                            width="600"
                            placement="bottom"
                        >
                            <div :class="{'popover-height': scope.row.presentAcount > 3 }">
                                <el-table :data="scope.row.presents || []">
                                    <el-table-column
                                        label="奖品类型"
                                        prop="type"
                                    >
                                        <template #default="{ row: present }">
                                            <span v-if="present.type === 0">优惠券</span>
                                            <span v-if="present.type === 1">礼品</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="获得礼品"
                                        prop="name"
                                    />
                                    <el-table-column
                                        label="领取奖品时间"
                                        prop="createTime"
                                        width="150"
                                    />
                                    <el-table-column
                                        label="使用有效期"
                                        width="160"
                                    >
                                        <template #default="{ row: present }">
                                            {{ present.useStartTime }}-{{ present.useEndTime }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="状态"
                                        prop="status"
                                    >
                                        <template #default="{ row: present }">
                                            <span v-if="present.status === 0">未使用</span>
                                            <span v-if="present.status === 1">已使用</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <el-button slot="reference" type="text">
                                {{ scope.row.presentAcount > 1 ? `${scope.row.presents[0].name}等${scope.row.presentAcount}个奖品` :
                                    scope.row.presentAcount || 0 }}
                            </el-button>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination
                @change="getInvitingDetailList"
                v-model="params.current"
                :total="total"
            />
        </div>
        <Share :show.sync="qrcodeShow" :qrcode-text="qrcodeText" ref="share" />
        <Verification :dialog-verification-visible.sync="isShowVerificationDialog" />
    </div>
</template>

<script>
import { getInvitingDetail, getInvitingDetailList, exportInvitingDetailList } from '../../../../../apis/marketing-manage/inviting'
import moment from 'moment/moment'
import Share from '../../../../../components/common/Share.vue'
import Verification from '../../../../../components/order-center/Verification.vue'
import { createObjectUrl } from '../../../../../assets/ts/upload'

export default {
    name: 'InviteNewcomersDetail',
    components: {
        Share,
        Verification
    },
    data () {
        return {
            params: {
                activityId: '',
                keyWord: '',
                status: '',
                startTime: '',
                endTime: '',
                current: 1,
                size: 10
            },
            total: 0,
            detail: {
                activityStatModel: {},
                invitingEventsEntity: {}
            },
            data: [],
            daterange: [],
            isShowVerificationDialog: false,
            // 分享链接
            qrcodeText: '',
            // 分享开关
            qrcodeShow: false
        }
    },
    async created () {
        this.params.activityId = this.$route.params.id
        await this.getInvitingDetail()
        await this.getInvitingDetailList()
        this.$parent.showTop = false
    },
    methods: {
        async getInvitingDetail () {
            try {
                const { result } = await getInvitingDetail(this.params.activityId)
                this.detail = result
            } catch (e) {
                throw e
            }
        },
        // 时间格式转换
        daterangeChange () {
            if (!this.daterange) {
                this.params.startTime = ''
                this.params.endTime = ''
            }
            if (this.daterange && this.daterange.length === 2) {
                this.params.startTime = moment(this.daterange[0]).format('YYYY-MM-DD HH:mm:ss')
                this.params.endTime = moment(this.daterange[1]).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        search () {
            this.params.current = 1
            this.getInvitingDetailList()
        },
        async getInvitingDetailList () {
            try {
                const { result } = await getInvitingDetailList(this.params)
                this.data = result.records
                this.total = result.total
            } catch (e) {
                throw e
            }
        },
        dateChange (val) {
            this.form.startTime = val.start
            this.form.endTime = val.end
            this.form.current = 1
            this.getInvitingDetailList()
        },
        share () {
            this.qrcodeText = `${ this.$store.getters['user/mallUrl'] }/invitenewcomers/${ this.$route.params.id }?noCache=${ Date.now() }`
            this.qrcodeShow = true
        },
        // 导出数据
        async exportData () {
            try {
                const blob = await exportInvitingDetailList(this.params)
                const url = createObjectUrl(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${ this.detail.invitingEventsEntity.activityName }${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
                a.click()
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style scoped lang="scss">
.invite-newcomers-detail {
  .invite-newcomers-detail-header {
      display: flex;
      align-items: center;
      padding: 20px;
      background: #F5F6FA;
      border-radius: 10px;
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
        margin-left: 100px;
        font-size:12px;
        color: #999;
    }
  }

  .invite-newcomers-detail-content {
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
.number-card {
  width: 299px;
  height: 112px;
  padding-top: 10px;
  padding-left: 40px;
  border-right: 1px solid rgb(231,231,231);
  color: #333;

  .style1 {
    .title {
      margin-bottom: 20px;
    }

    .value-line {
      display: flex;
      align-items: baseline;
    }

    .value {
      font-size: 50px;
      color: #333;
      margin-right: 25px;
    }

    .unit-name {
      font-size: 14px;
    }
  }
}

.popover-height {
  height: 250px;
  overflow-y: scroll;
}
</style>
