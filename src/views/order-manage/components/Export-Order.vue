<!-- 商品订单，课程订单，网校订单导出 -->
<template>
    <ExportDialog :show="show" @confirm="confirm" @open="open" @close="close">
        <el-form ref="exportForm" :model="exportData" :rules="exportRules" label-width="100px" label-position="left">
            <el-form-item prop="keywords" label="搜索关键词">
                <el-input
                    style="width: 200px;"
                    v-model="exportData.keywords"
                    placeholder="搜索内容"
                    clearable
                />
            </el-form-item>
            <el-form-item v-if="orderType !== 'networkCourse'" prop="selectedOptions" label="分类">
                <SelectCategoryName
                    check-strictly
                    show-all
                    v-model="exportData.classification"
                    @change="exportCategoryChange"
                />
            </el-form-item>
            <el-form-item
                v-if="orderType !== 'course'"
                label="类型"
                prop="goodsType"
            >
                <el-select
                    v-model="exportData.goodsType"
                    @change="goodsTypesChange"
                >
                    <el-option v-for="(item,index) in goodsTypes" :label="item" :value="index" :key="index" />
                </el-select>
            </el-form-item>
            <el-form-item prop="orderStatus" label="状态">
                <el-select v-model="exportData.orderStatus">
                    <el-option v-for="(item,index) in orderStatus" :label="item" :value="index" :key="index" />
                </el-select>
            </el-form-item>
            <el-form-item label="时间类型">
                <el-radio-group @change="exportTypeChange" v-model="exportData.dateType">
                    <el-radio :label="1">
                        下单时间
                    </el-radio>
                    <el-radio :label="2">
                        支付时间
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="选择时间" prop="startTime">
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
                    v-if="show"
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
            <el-form-item v-if="orderType !== 'networkCourse'" prop="operatorUser" label="核销人员">
                <el-select
                    clearable
                    v-model="exportData.operatorUser"
                >
                    <el-option
                        v-for="(item,index) of redeemUserList"
                        :key="index"
                        :value="item"
                        :label="item"
                    />
                </el-select>
            </el-form-item>
        </el-form>
    </ExportDialog>
</template>

<script>
import moment from 'moment'
import { redeemUserList as getRedeemUserList, exportOrderQuery } from '../../../apis/order'
import { createObjectUrl } from '../../../assets/ts/upload'
import ExportDialog from '../../../components/common/Export-Dialog'
import SelectCategoryName from '../../../components/product-center/category-manage/Select-Category-Name.vue'
export default {
    name: 'ExportOrder',
    components: {
        ExportDialog,
        SelectCategoryName
    },
    props: {
        show: Boolean,
        // 列表搜索条件
        searchForm: {
            type: Object,
            default () {
                return {}
            }
        },
        // 订单类型 product 商品 course 课程 networkCourse 网课
        orderType: {
            type: String,
            default: 'goods'
        },
        goodsType: {
            type: String,
            default: ''
        },
        // 分类
        classification: {
            type: Array,
            default () {
                return ['']
            }
        }
    },
    data () {
        return {
            orderInfo: {
                product: {
                    orderStatus: {
                        '': '全部订单',
                        WAIT_SHIP: '待发货',
                        WAIT_RECEIVE: '待收货',
                        WAIT_PAY: '待付款',
                        FINISHED: '订单完成',
                        CLOSED: '订单关闭'
                    },
                    goodsTypes: {
                        '': '全部',
                        PHYSICAL_GOODS: '实体订单',
                        VIRTUAL_GOODS: '虚拟订单'
                    }
                },
                course: {
                    orderStatus: {
                        '': '全部订单',
                        WAIT_RECEIVE: '待使用',
                        WAIT_PAY: '待付款',
                        FINISHED: '订单完成',
                        CLOSED: '订单关闭'
                    }
                },
                networkCourse: {
                    orderStatus: {
                        '': '全部订单',
                        WAIT_PAY: '待付款',
                        FINISHED: '订单完成',
                        CLOSED: '订单关闭'
                    },
                    goodsTypes: {
                        '': '全部',
                        KNOWLEDGE_COURSE: '知识课程',
                        SERIES_OF_COURSE: '系列课程',
                        LIVE_GOODS: '直播',
                        VIDEO_GOODS: '录播'
                    }
                }
            },
            // 核销人
            redeemUserList: [],
            exportData: {
                goodsType: '',
                goodsTypes: '',
                orderStatus: '',
                keywords: '',
                startTime: '',
                endTime: '',
                operatorUser: '',
                categoryName: '',
                classification: [''],
                //  1 下单 2 支付
                dateType: 1,
                // 1 7日内 2 30日内 3自选
                dateRange: 3
            },
            exportRules: {
                startTime: [
                    { required: true, message: '请选择时间', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
    // 获取核销人
        async getRedeemUserList () {
            try {
                const { result } = await getRedeemUserList()
                this.redeemUserList = result
            } catch (e) { throw e }
        },
        exportRangeChange (val) {
            const start = new Date()
            const end = new Date()
            const formatType = 'YYYY-MM-DD'

            if (val === 1) {
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            } else if (val === 2) {
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            } else {
                this.exportTypeChange(this.exportData.dateType)
            }

            this.exportDatechange({
                start: start && `${ moment(start).format(formatType) } 00:00:00`,
                end: end && `${ moment(end).format(formatType) } 23:59:59`
            })
        },
        async exportTypeChange (type) {
            if (this.exportData.dateRange !== 3) {
                return
            }

            await this.$nextTick()
            // 1 下单 2 支付
            if (type === 1 && this.searchForm.startTime) {
                this.exportDatechange({
                    start: this.searchForm.startTime,
                    end: this.searchForm.endTime
                })
            }
            if (type === 2 && this.searchForm.payStartTime) {
                this.exportDatechange({
                    start: this.searchForm.payStartTime,
                    end: this.searchForm.payEndTime
                })
            }
        },
        async exportDatechange ({ start, end }) {
            this.exportData.startTime = start
            this.exportData.endTime = end

            if (!start || !end) {
                return
            }

            await this.$nextTick()
            this.$refs.exportDatePicker.initDate()
        },
        exportCategoryChange (val) {
            console.log(val)
            this.exportData.categoryName = val[0] || ''
            this.exportData.subCategoryName = val[1] || ''
        },
        goodsTypesChange (val) {
            if (!val) {
                this.exportData.goodsTypes = Object.keys(this.goodsTypes).filter(key => !!key)
                return
            }
            this.exportData.goodsTypes = [val]
        },
        setExportData () {
            const obj = JSON.parse(JSON.stringify(this.searchForm))
            const data = {
                goodsTypes: [],
                orderStatus: '',
                keywords: '',
                operatorUser: '',
                categoryName: '',
                subCategoryName: ''
            }

            for (const key of Object.keys(data)) {
                data[key] = obj[key]
            }

            this.exportData.classification = this.classification.slice()

            this.exportData.goodsType = this.goodsType

            // 若选择了下单时间
            if (obj.startTime) {
                data.startTime = obj.startTime
                data.endTime = obj.endTime
                data.dateType = 1
            }
            // 若选择了支付时间（不可用 else if ）
            if (obj.payStartTime) {
                data.startTime = obj.payStartTime
                data.endTime = obj.payEndTime
                data.dateType = 2
            }

            this.exportData = {
                ...this.exportData,
                ...data
            }
        },
        async confirm () {
            await this.$refs.exportForm.validate()
            // dateType 1 下单 2 支付
            const isPay = this.exportData.dateType === 2
            const { startTime, endTime } = this.exportData
            const exportData = this.exportData
            const query = this.searchForm

            const data = {
                goodsTypes: exportData.goodsTypes,
                orderStatus: exportData.orderStatus,
                keywords: exportData.keywords,
                startTime: isPay ? '' : startTime,
                endTime: isPay ? '' : endTime,
                payStartTime: isPay ? startTime : '',
                payEndTime: isPay ? endTime : '',
                operatorUser: exportData.operatorUser,
                categoryName: exportData.categoryName,
                subCategoryName: exportData.subCategoryName
            }

            try {
                const blob = await exportOrderQuery(data)
                const url = createObjectUrl(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${ this.orderStatus[query.orderStatus] }${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
                a.click()
                a.remove()
                this.close()
            } catch (e) {
                throw e
            }
        },
        async open () {
            try {
                this.setExportData()
                await this.getRedeemUserList()
            } catch (e) { throw e }
        },
        close () {
            this.exportData = {
                goodsType: '',
                goodsTypes: '',
                orderStatus: '',
                keywords: '',
                startTime: '',
                endTime: '',
                operatorUser: '',
                categoryName: '',
                subCategoryName: '',
                classification: [''],
                //  1 下单 2 支付
                dateType: 1,
                // 1 7日内 2 30日内 3自选
                dateRange: 3
            }
            this.$refs.exportForm.clearValidate()
            this.$emit('update:show', false)
        }
    },
    computed: {
        goodsTypes () {
            return this.orderInfo[this.orderType].goodsTypes || {}
        },
        orderStatus () {
            return this.orderInfo[this.orderType].orderStatus || {}
        }
    }
}
</script>

<style>

</style>
