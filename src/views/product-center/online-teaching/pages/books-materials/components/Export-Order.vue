<!-- 商品订单，课程订单，网校订单导出 -->
<template>
    <el-dialog
        :visible="show"
        width="700px"
        @confirm="confirm"
        @open="open"
        @close="close"
    >
        <div>
            <div :class="$style.header">
                <span :class="$style.title">导出图文数据</span>
                <span :class="$style.des"> - 可选择导出条件后导出相应数据</span>
            </div>
        </div>
        <el-form ref="exportForm" :model="exportData" :rules="exportRules" label-width="100px" label-position="left">
            <el-form-item prop="keywords" label="搜索内容">
                <el-input
                    style="width: 200px;"
                    v-model="exportData.keywords"
                    placeholder="请输入搜索内容"
                    clearable
                />
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
        </el-form>
        <div :class="$style.footer">
            <el-button @click="close">
                取消
            </el-button>
            <el-button @click="confirm" type="primary">
                确定导出
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import moment from 'moment'
import { createObjectUrl } from '../../../../../../assets/ts/upload'
import { exportBooksMaterials } from './../../../../../../apis/product-center/online-teaching/books-materials'

export default {
    name: 'ExportOrder',
    props: {
        show: Boolean,
        // 列表搜索条件
        searchForm: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            exportData: {
                graphicId: '',
                keywords: '',
                startTime: '',
                endTime: '',
                dateRange: 3 // 1 7日内 2 30日内 3自选
            },
            exportRules: {
                startTime: [
                    { required: true, message: '请选择时间', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        exportRangeChange (val) {
            const start = new Date()
            const end = new Date()
            const formatType = 'YYYY-MM-DD'

            if (val === 1) {
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            } else if (val === 2) {
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            }
            this.exportDatechange({
                start: start && `${ moment(start).format(formatType) } 00:00:00`,
                end: end && `${ moment(end).format(formatType) } 23:59:59`
            })
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

        setExportData () {
            const obj = JSON.parse(JSON.stringify(this.searchForm))
            const data = {
                graphicId: '',
                keywords: '',
                startTime: '',
                endTime: ''
            }
            for (const key of Object.keys(data)) {
                data[key] = obj[key]
            }
            // 若选择了下单时间
            // if (obj.startTime) {
            //   data.startTime = obj.startTime
            //   data.endTime = obj.endTime
            // }

            this.exportData = {
                ...this.exportData,
                ...data
            }
        },
        async confirm () {
            await this.$refs.exportForm.validate()
            const { startTime, endTime } = this.exportData
            const exportData = this.exportData
            const data = {
                graphicId: exportData.graphicId,
                keywords: exportData.keywords,
                startTime,
                endTime
            }

            try {
                const blob = await exportBooksMaterials(data)
                const url = createObjectUrl(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `图文资料${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
                a.click()
                a.remove()
                this.close()
            } catch (e) {
                throw e
            }
        },
        open () {
            this.setExportData()
        },
        close () {
            this.exportData = {
                graphicId: '',
                keywords: '',
                startTime: '',
                endTime: '',
                dateRange: 3 // 1 7日内 2 30日内 3自选
            }
            this.$refs.exportForm.clearValidate()
            this.$emit('update:show', false)
        }
    },
    computed: {

    }
}
</script>
<style lang='scss' module>

.header {
    padding-bottom: 20px;
    > .title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
    }
    > .des {
        font-size: 14px;
        color: #999;
    }
}

.footer {
    text-align: center;
}

</style>
