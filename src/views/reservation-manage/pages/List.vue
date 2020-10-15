<template>
    <div class="reservation-list">
        <search-box>
            <el-form-item label="搜索内容：">
                <el-input
                    v-model.trim="form.keyword"
                    placeholder="用户姓名/用户电话/服务人员姓名"
                    style="width: 369px;"
                    @change="search"
                    clearable
                />
            </el-form-item>
            <el-form-item label="预约时间：">
                <date-range
                    :clearable="true"
                    disable-after
                    @change="dateChange"
                    size="small"
                    start-label="预约时间："
                    range-separator="至"
                    end-label=""
                    ref="dateRange"
                />
            </el-form-item>
            <div />
            <el-form-item>
                <el-button
                    type="primary"
                    round
                    @click="search"
                >
                    查询
                </el-button>
                <el-button
                    type="primary"
                    plain
                    round
                    @click="resetState"
                >
                    清空筛选条件
                </el-button>
                <el-button
                    type="primary"
                    plain
                    round
                    @click="changeExport"
                    v-if="table && table.length"
                >
                    导出表单
                </el-button>
            </el-form-item>
        </search-box>

        <el-table :data="table">
            <span
                slot="empty"
                class="empty"
            >
                <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" /> 没有查到相关信息，请确认后重新查看！
            </span>
            <el-table-column
                prop="userNickName"
                label="预约用户昵称"
                header-align="left"
                align="left"
            />
            <el-table-column
                prop="userMobile"
                label="用户电话"
            />
            <el-table-column
                prop="reservedMobile"
                label="预留电话"
            />
            <el-table-column
                prop="reservationName"
                label="预留姓名"
            />
            <el-table-column
                prop="statusText"
                label="预约状态"
            />
            <el-table-column
                prop="applyTime"
                label="预约时间"
            />
            <el-table-column
                prop="operatorTime"
                label="处理时间"
            />
            <el-table-column
                prop="operatorUser"
                label="服务人员"
            />
            <el-table-column
                prop="count"
                label="反馈次数"
                width="80"
            />
            <el-table-column
                prop="count"
                label="数据来源"
                width="80"
            >
                <template #default="{ row }">
                    <span>{{ row.source === 1 ? '双十二' : '首页' }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="right"
                header-align="right"
                width="100"
            >
                <template slot-scope="{ row }">
                    <Operating>
                        <template slot="button-box">
                            <a
                                v-if="row.status === 0"
                                @click="feedback(row.id, row.status)"
                            >
                                沟通反馈
                            </a>
                            <a
                                v-if="row.status === 1"
                                @click="feedback(row.id, row.status)"
                            >
                                添加反馈
                            </a>
                            <a
                                v-if="row.status === 1"
                                @click="seeDetails(row.id)"
                            >
                                查看
                            </a>
                        </template>
                    </Operating>
                </template>
            </el-table-column>
        </el-table>

        <Pagination
            v-model="form.current"
            @change="getList"
            :total="total"
        />

        <ExportDialog :show.sync="showExport" title="导出数据" @confirm="exportList" @close="exportClose">
            <el-form ref="exportForm" :model="exportData" :rules="exportRules" label-width="100px" label-position="left">
                <el-form-item label="搜索关键词" prop="keyword">
                    <el-input
                        v-model.trim="exportData.keyword"
                        placeholder="搜索关键字"
                        style="width: 369px;"
                        clearable
                    />
                </el-form-item>
                <el-form-item prop="status" label="状态">
                    <el-select v-model="exportData.status">
                        <el-option
                            v-for="(item, index) in Object.keys(orderStatusText)"
                            :label="orderStatusText[item]"
                            :value="item"
                            :key="index"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="参与时间" prop="startTime">
                    <el-radio-group @change="exportRangeChange" v-model="exportData.dateRange">
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
                    <date-range
                        v-if="showExport"
                        style="margin-top: 20px"
                        size="small"
                        ref="exportDatePicker"
                        :disabled-start-time="exportData.dateRange !== 3"
                        :disabled-end-time="exportData.dateRange !== 3"
                        disable-after
                        :init="exportData.startTime ? [exportData.startTime,exportData.endTime] : []"
                        :clearable="true"
                        @change="exportDatechange"
                        range-separator="至"
                        end-label=""
                    />
                </el-form-item>
            </el-form>
        </ExportDialog>

        <el-dialog
            title="用户预约"
            :visible.sync="feedbackDetailsVisible"
            width="443px"
        >
            <div class="detail-Box">
                <div class="detail-content">
                    <span>用户姓名：{{ feedbackDetailsData.userNickName }}</span>
                    <span>用户电话：{{ feedbackDetailsData.userMobile }}</span>
                    <span>预约姓名：{{ feedbackDetailsData.reservationName }}</span>
                    <span>预约电话：{{ feedbackDetailsData.reservedMobile }}</span>
                    <span>预约时间：{{ feedbackDetailsData.applyTime }}</span>
                </div>
                <div class="details-title">
                    沟通反馈
                </div>
                <div class="order-box" style="max-height: 500px;overflow-y: scroll;">
                    <div
                        class="order-content"
                        v-for="(item,index) in feedbackDetailsData.childs"
                        :key="index"
                    >
                        <div class="detail-content">
                            <span>{{ changeNum(feedbackDetailsData.childs.length - index) }}次反馈：{{ item.operatorTime }}</span>
                            <span>沟通人员：{{ item.operatorUser }}</span>
                            <span ref="feedbackContent" :class="[item.more? 'show-line' : 'hide-line' ]">反馈结果：{{ item.remark }}</span>
                            <div class="more" @click="seeMore(item)" v-if="item.moreButton">
                                展示更多
                                <pl-svg :key="1" v-if="item.more" name="icon-shang" width="16" fill="#999" style="vertical-align: -3px;" />
                                <pl-svg :key="2" v-else name="icon-xia" width="16" fill="#999" style="vertical-align: -3px;" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <el-button plain style="width: 100%" @click="feedback(feedbackDetailsData.id)">
                添加反馈
            </el-button>
        </el-dialog>

        <el-dialog
            :title="feedbackTitle"
            :visible.sync="feedbackVisible"
            @close="feedbackCancel()"
            width="500px"
        >
            <el-form label-position="left" :model="feedbackForm" :rules="rules">
                <el-form-item
                    label="服务人员:"
                    label-width="100px"
                >
                    <el-select
                        v-model="feedbackForm.operatorUserId"
                        style="width: 320px;"
                    >
                        <el-option
                            v-for="(item,index) of baseUserInfo"
                            :key="index"
                            :label="item.roleName"
                            :value="item.userId"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    label=""
                    label-width="100px"
                    prop="operatorUserName"
                    v-if="feedbackForm.operatorUserId === '0'"
                >
                    <el-input
                        validate-event
                        type="text"
                        style="width: 320px;"
                        placeholder="请输入服务人员名称"
                        maxlength="12"
                        v-model="feedbackForm.operatorUserName"
                    />
                </el-form-item>
                <el-form-item
                    label="反馈备注"
                    label-width="100px"
                    prop="remark"
                >
                    <el-input
                        validate-event
                        type="textarea"
                        maxlength="500"
                        resize="none"
                        style="width: 320px;"
                        :autosize="{ minRows: 6, maxRows: 10 }"
                        placeholder="请输入沟通结果，最多500字"
                        show-word-limit
                        v-model="feedbackForm.remark"
                    />
                </el-form-item>
            </el-form>
            <div
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="feedbackCancel">
                    取消
                </el-button>
                <el-button
                    type="primary"
                    @click="feedbackConfirm"
                >
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import Component from 'vue-class-component'
import {
    getReservationQuery,
    exportReservationQuery,
    getReservationDetail,
    getBaseUserInfo,
    addReservation
} from '../../../apis/reservation'
import { createObjectUrl } from '../../../assets/ts/upload'
import { SectionToChinese } from '../../../assets/ts/utils'
import ExportDialog from '../../../components/common/Export-Dialog.vue'
@Component({
    components: {
        ExportDialog
    }
})
export default class ReservationManage extends Vue {
    total = 0
    showExport = false
    table = []
    feedbackTitle = ''

    feedbackDetailsVisible = false
    feedbackVisible = false

    form: {
        [key: string]: string | number;
        status: '' | '0' | '1';
    } = {
        keyword: '',
        status: '',
        startTime: '',
        endTime: '',
        current: 1,
        size: 10
    }

    exportData = {
        keyword: '',
        dateRange: 3, // 1 7日内 2 30日内 3自选
        status: '',
        startTime: '',
        endTime: ''
    }

    exportRules = {
        startTime: [
            { required: true, message: '请选择时间', trigger: 'blur' }
        ]
    }

    orderStatusText = {
        '': '全部',
        0: '待处理',
        1: '已处理'
    }

    feedbackForm = {
        operatorUserId: '',
        remark: '',
        id: '',
        operatorUserName: ''
    }

    baseUserInfo: { userId: string }[] = []

    feedbackDetailsData: { childs: DynamicObject[] } = {
        childs: []
    }

    rules = {
        remark: [
            { required: true, message: '反馈备注不能为空', trigger: 'blur' },
            { max: 500, message: '反馈备注不能超过500个字符', trigger: 'blur' }
        ],
        operatorUserName: [
            { required: true, message: '服务人员名称不能为空', trigger: 'blur' },
            { max: 12, message: '服务人员名称不能超过12个字符', trigger: 'blur' }
        ]
    }

    async activated () {
        await this.search()
        await this.getBaseUserInfo()
    }

    // methods
    async search () {
        this.form.current = 1
        await this.getList()
    }

    async getList () {
        try {
            const { result } = await getReservationQuery(this.form)
            this.table = result.records
            this.total = result.total
        } catch (e) {
            throw e
        }
    }

    async dateChange (val: { start: string; end: string }) {
        this.form.startTime = val.start
        this.form.endTime = val.end
        await this.search()
    }

    async resetState () {
        this.form = {
            keyword: '',
            status: '',
            startTime: '',
            endTime: '',
            current: 1,
            size: 10
        }
        await this.search()
    }

    async seeDetails (id: string) {
        try {
            const { result } = await getReservationDetail({ id })
            if (result.childs && result.childs.length) {
                result.childs.forEach((item: DynamicObject) => {
                    item.more = true
                    item.moreButton = true
                })
            }
            this.feedbackTitle = '添加反馈'
            this.feedbackDetailsData = result
            this.feedbackDetailsVisible = true
            await this.$nextTick();
            (this.$refs.feedbackContent as DynamicObject[]).forEach((item: DynamicObject, index: number) => {
                if (item.offsetHeight < 60) {
                    this.feedbackDetailsData.childs[index].moreButton = false
                }
                this.feedbackDetailsData.childs[index].more = false
            })
        } catch (e) {
            throw e
        }
    }

    feedback (id: string, status: number) {
        this.feedbackForm.id = id
        this.feedbackVisible = true
        status = Number(status)
        if (status === 1) {
            this.feedbackTitle = '添加反馈'
        }
        if (status === 0) {
            this.feedbackTitle = '沟通反馈'
        }
        this.feedbackDetailsVisible = false
    }

    seeMore (item: DynamicObject) {
        item.more = !item.more
    }

    changeNum (index: number) {
        return SectionToChinese(index) === '一' ? '首' : SectionToChinese(index)
    }

    feedbackCancel () {
        this.feedbackVisible = false
        this.feedbackForm = {
            operatorUserId: this.baseUserInfo[0].userId,
            remark: '',
            id: '',
            operatorUserName: ''
        }
    }

    async feedbackConfirm () {
        if (!this.feedbackForm.remark) {
            return this.$warning('反馈备注不能为空')
        }
        if (this.feedbackForm.operatorUserId === '0' && !this.feedbackForm.operatorUserName) return this.$warning('服务人员不能为空')
        try {
            await addReservation(this.feedbackForm)
            this.$success(`${ this.feedbackTitle }提交成功`)
            await this.getList()
            this.feedbackVisible = false
            this.feedbackForm = {
                operatorUserId: this.baseUserInfo[0].userId,
                remark: '',
                id: '',
                operatorUserName: ''
            }
        } catch (e) {
            throw e
        }
    }

    async getBaseUserInfo () {
        if (this.baseUserInfo.length) return
        try {
            const { result } = await getBaseUserInfo()
            this.baseUserInfo = result
            this.feedbackForm.operatorUserId = this.baseUserInfo[0].userId
        } catch (e) {
            throw e
        }
    }

    async changeExport () {
        this.exportData = {
            ...this.exportData,
            ...this.form
        }
        this.showExport = true
    }

    exportRangeChange (val: number) {
        let start: Date | string = new Date()
        let end: Date | string = new Date()
        const formatType = 'YYYY-MM-DD'

        if (val === 1) {
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        } else if (val === 2) {
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        } else {
            start = (this.form.startTime || '') as string
            end = (this.form.endTime || '') as string
        }

        this.exportDatechange({
            start: start ? `${ moment(start).format(formatType) } 00:00:00` : '',
            end: end && `${ moment(end).format(formatType) } 23:59:59`
        })
    }

    async exportDatechange ({ start, end }: { start: string; end: string }) {
        this.exportData.startTime = start
        this.exportData.endTime = end
        if (!start || !end) {
            return
        }
        await this.$nextTick();
        (this.$refs.exportDatePicker as HTMLFormElement).initDate()
    }

    exportClose () {
        this.exportData = {
            keyword: '',
            // 1 7日内 2 30日内 3自选
            dateRange: 3,
            status: '',
            startTime: '',
            endTime: ''
        };
        (this.$refs.exportForm as HTMLFormElement).clearValidate()
        this.showExport = false
    }

    async exportList () {
        try {
            await (this.$refs.exportForm as HTMLFormElement).validate()
            const { exportData } = this
            const blob = await exportReservationQuery({
                keyword: exportData.keyword,
                status: exportData.status,
                startTime: exportData.startTime,
                endTime: exportData.endTime
            })
            const url = createObjectUrl(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `预约-${ this.orderStatusText[this.form.status] }${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
            a.click()
            a.remove()
            this.exportClose()
        } catch (e) {
            throw e
        }
    }
}
</script>

<style scoped lang="scss">
    .flex-align {
        display: flex;
        align-items: center;
    }
    .invoice{
        min-height: calc(100vh - 120px);
        padding-bottom: 30px;
        background-color: #ffffff;
        .right-btn {
            position: absolute;
            right: 40px;
        }

        .ml-40 {
            margin-left: 40px;
        }

        .empty{
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                width: 12px;
                margin-right: 8px;
            }
        }
    }

    .detail-Box {
        display: flex;
        flex-direction: column;
        font-size: 16px;
        color: rgba(51, 51, 51, 1);
        line-height: 21px;

        > .detail-content {
            display: flex;
            flex-direction: column;
            padding: 16px 0;
            border-bottom: 1px solid #E7E7E7;
            span {
                padding: 6px 0;
            }
        }

        .details-title{
            font-size: 18px !important;
            font-weight: bold !important;
            line-height: 24px;
            padding-top: 16px;
        }

        .order-box {
            padding: 16px 0;
            font-size: 14px;
            color: #666;
            .order-content {
                padding: 16px 0;
                border-bottom: 1px solid #E7E7E7;
                .detail-content {
                    display: flex;
                    flex-direction: column;
                    background-color: #F6F6F6;
                    padding: 16px;
                    .more {
                        text-align: center;
                        color: #999;
                    }
                    .show-line {
                        max-height: 1000px;
                        transition: max-height 1s;
                        -webkit-line-clamp: 0;
                    }
                    .hide-line {
                        max-height: 50px;
                        transition: max-height 1s;
                        -webkit-line-clamp: 2;
                    }
                    > span {
                        padding: 4px 0;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                }
            }
            .order-content:first-child {
                padding-top: 0;
            }
            .order-content:last-child {
                padding-bottom: 0;
                border: none;
            }
        }
    }
</style>
