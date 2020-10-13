<template>
    <div>
        <div>
            <search-box class="mt-24" label-width="85px">
                <el-form-item label="搜索内容：">
                    <el-input
                        v-model.trim="params.keyWord"
                        clearable
                        placeholder="活动名称"
                        @change="search"
                    />
                </el-form-item>
                <el-form-item
                    label="状态："
                >
                    <el-select
                        :clearable="true"
                        v-model="params.status"
                        @change="search"
                    >
                        <el-option
                            label="全部"
                            value=""
                        />
                        <el-option
                            label="已结束"
                            :value="0"
                        />
                        <el-option
                            label="未开始"
                            :value="1"
                        />
                        <el-option
                            label="进行中"
                            :value="2"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="活动时间：">
                    <el-date-picker
                        v-model="daterange"
                        @change="daterangeChange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :editable="false"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button
                        round
                        type="primary"
                        @click="search"
                    >
                        查询
                    </el-button>
                </el-form-item>
            </search-box>
            <div>
                <el-table :data="data" ref="data">
                    <el-table-column
                        prop="activityName"
                        label="活动名称"
                        width="180"
                    />
                    <el-table-column
                        label="活动礼品"
                        width="150"
                    >
                        <template slot-scope="scope">
                            <el-popover
                                width="500"
                                placement="bottom"
                                content="this is a test string"
                            >
                                <!-- 当删除优惠券时,赢取豪礼的活动的优惠券会被删除,返回为字符串前端会报错,所以兼容处理 -->
                                <el-table :data="scope.row.invitingGiftStatModels || []">
                                    <el-table-column
                                        label="奖品类型"
                                        width="80"
                                    >
                                        <template slot-scope="{row}">
                                            <span v-if="row.type === 0">优惠券</span>
                                            <span v-if="row.type === 1">礼品</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="奖品名称"
                                        prop="name"
                                    />
                                    <el-table-column
                                        label="使用时间"
                                        width="160"
                                    >
                                        <template slot-scope="coupon">
                                            {{ coupon.row.useStartTime }}-{{ coupon.row.useEndTime }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="已领/剩余"
                                        width="90"
                                    >
                                        <template slot-scope="coupon">
                                            {{ coupon.row.salesVolume }} / {{ coupon.row.stock }}
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <a slot="reference" style="color:#4F63FF">
                                    {{ scope.row.giftName ? `${scope.row.giftName}...` : '--' }}
                                </a>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="activityStatModel.invitedPeopleNumber"
                        label="发起人数"
                        width="100"
                    />
                    <el-table-column
                        prop="activityStatModel.registerNum"
                        label="邀请注册人数"
                        width="110"
                    />
                    <el-table-column label="活动时间">
                        <template slot-scope="{row}">
                            {{ row.activityStartTime }} - {{ row.activityEndTime }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="活动状态"
                        width="100"
                        header-align="center"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.status === 0">已结束</span>
                            <span v-if="scope.row.status === 1">未开始</span>
                            <span v-if="scope.row.status === 2">进行中</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="activityStatModel.viewNum"
                        label="浏览量"
                        width="70"
                    />
                    <el-table-column
                        prop="activityStatModel.visitorNum"
                        label="访客数"
                        width="70"
                    />
                    <el-table-column
                        label="操作"
                        align="right"
                        header-align="right"
                    >
                        <template slot-scope="{ row }">
                            <el-button
                                v-if="row.status !==0"
                                size="mini"
                                type="text"

                                @click="$router.push({name: 'InviteNewcomersEdit',params: { id: row.id}})"
                            >
                                编辑
                            </el-button>
                            <el-button
                                size="mini"
                                type="text"

                                @click="$router.push({name: 'InviteNewcomersDetail',params: { id: row.id}})"
                            >
                                查看数据
                            </el-button>
                            <el-button
                                v-if="row.status === 0 || row.status === 1"
                                size="mini"
                                type="text"

                                @click="deleteActivity(row)"
                            >
                                删除
                            </el-button>
                            <el-button
                                v-if="row.status === 2 || row.status === 1"
                                size="mini"
                                type="text"

                                @click="over(row.id)"
                            >
                                结束
                            </el-button>
                            <el-popover
                                placement="bottom"
                                trigger="hover"
                                style="margin-left:10px;"
                            >
                                <el-button
                                    size="mini"
                                    type="text"
                                    class="f-mb5"
                                    @click="$router.push({name: 'InviteNewcomersCopy',params: { id: row.id }})"
                                >
                                    复制
                                </el-button>
                                <br>
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="share(row.id)"
                                >
                                    分享
                                </el-button>
                                <i class="el-icon-more" slot="reference" />
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
                <Pagination
                    @change="getInviting"
                    v-model="params.current"
                    :total="total"
                />
                <el-dialog title="您可先去创建赠送给用户的满减券" :visible.sync="dlgCreate" width="560px">
                    <span>再进行赢取豪礼活动设置！</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dlgCreate = false">我知道了</el-button>
                        <el-button type="primary" @click="dlgCreate = false;$router.push({ name: 'ReductionCouponList' })">去创建满减券</el-button>
                    </span>
                </el-dialog>
                <Share :show.sync="showShare" :qrcode-text="`${$store.getters.mallUrl}/invitenewcomers/${shareId}?noCache=${Date.now()}`" />
            </div>
        </div>
    </div>
</template>

<script>
import Pagination from '../../../../../components/common/Pagination.vue'
import { getInviting, changeInvitingStatus } from '../../../../../apis/marketing-manage/inviting'
import moment from 'moment/moment'
import Share from '../../../../../components/common/Share.vue'

export default {
    name: 'InviteNewcomersList',
    components: {
        Pagination,
        Share
    },
    data () {
        return {
            params: {
                keyWord: '',
                status: '',
                startTime: '',
                endTime: '',
                current: 1,
                size: 10
            },
            total: 0,
            data: [],
            daterange: [],
            dlgCreate: false,
            showShare: false,
            shareId: ''
        }
    },
    activated () {
        this.getInviting()
        this.$parent.showTop = true
    },
    deactivated () {
        this.params = {
            keyWord: '',
            status: '',
            startTime: '',
            endTime: '',
            current: 1,
            size: 10
        }
    },
    methods: {
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
            this.getInviting()
        },
        async getInviting () {
            try {
                const { result } = await getInviting(this.params)
                this.data = result.records
                this.total = result.total
                // if (this.data.length === 0) {
                //   this.dlgCreate = true
                // }
            } catch (e) {
                throw e
            }
        },
        dateChange (val) {
            this.form.startTime = val.start
            this.form.endTime = val.end
            this.form.current = 1
            this.getInviting()
        },
        async over (id) {
            await this.$confirm({
                title: '确认要结束赢取豪礼活动吗？',
                message: '赢取豪礼活动结束止后，用户将不可参与该活动，结束后将不影响已获得奖品的用户'
            })
            await changeInvitingStatus(id, 0)
            this.getInviting()
        },
        async deleteActivity (row) {
            // 删除
            try {
                if (row.status === 1) {
                    await this.$confirm({
                        title: '确认要删除此活动吗？'
                    })
                } else {
                    await this.$confirm({
                        title: '确认要删除此活动吗？',
                        message: '活动删除后，将不可查看活动期间的相关数据！请谨慎进行删除操作。'
                    })
                }
                await changeInvitingStatus(row.id, 2)
                this.getInviting()
            } catch (e) {
                throw e
            }
        },
        share (id) {
            this.shareId = id
            this.showShare = true
        }
    }
}
</script>

<style scoped lang="scss">
.f-mb5{margin-bottom:5px;}
.f-ml10{margin-left:10px;}
.invite-newcomers-list {
  padding: 20px;
  .invite-newcomers-list-content {
    background-color: white;
  }
}
.el-popover{
  .el-button{
    min-width: 66px;
    padding: 4px 5px;
  }
}
</style>
