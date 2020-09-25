<template>
    <ExportDialog :show="show" title="导出数据" @open="open" @confirm="confirm" @close="exportClose">
        <el-form ref="exportForm" :model="exportData" :rules="exportRules" label-width="100px" label-position="left">
            <el-form-item label="搜索关键词" prop="keyword">
                <el-input
                    v-model.trim="exportData.keyword"
                    placeholder="搜索关键词"
                    style="width: 369px;"
                    clearable
                />
            </el-form-item>
            <el-form-item v-if="type === 'users'" label="时间" prop="startTime">
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
    </ExportDialog>
</template>

<script>
import moment from 'moment'
import ExportDialog from './../../../../../order-manage/components/Export-Dialog'
export default {
    name: 'ExportData',
    components: {
        ExportDialog
    },
    props: {
        show: Boolean,
        type: {
            type: String,
            // courses users
            default: 'courses'
        },
        form: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            exportData: {
                dateRange: 3, // 1 7日内 2 30日内 3自选
                courseId: '',
                keyword: '',
                startTime: '',
                endTime: ''
            },
            exportRules: {
                startTime: [
                    { required: true, message: '请选择时间', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        open () {
            this.exportData = {
                ...this.exportData,
                ...this.form
            }
        },
        exportClose () {
            this.exportData = {
                dateRange: 3, // 1 7日内 2 30日内 3自选
                keyword: '',
                startTime: '',
                endTime: ''
            }
            this.$refs.exportForm.clearValidate()
            this.$emit('update:show', false)
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
        exportRangeChange (val) {
            let start = new Date()
            let end = new Date()
            const formatType = 'YYYY-MM-DD'

            if (val === 1) {
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            } else if (val === 2) {
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            } else {
                start = this.form.startTime || ''
                end = this.form.endTime || ''
            }

            this.exportDatechange({
                start: start && `${ moment(start).format(formatType) } 00:00:00`,
                end: end && `${ moment(end).format(formatType) } 23:59:59`
            })
        },
        async confirm () {
            try {
                if (this.type === 'users') await this.$refs.exportForm.validate()

                this.$emit('confirm', this.exportData)
                this.exportClose()
            } catch (e) { throw e }
        }
    }
}
</script>
