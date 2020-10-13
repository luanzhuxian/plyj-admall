<template>
    <div
        class="date-range"
        ref="dateRange"
        title="请先点选开始时间，再点选结束时间"
    >
        <el-date-picker
            :style="{ width }"
            v-if="!disabledEndTime && !disabledStartTime"
            v-model="dateValue"
            :type="type === 'datetime' ? 'datetimerange' : 'daterange'"
            range-separator="至"
            :value-format="format"
            :start-placeholder="type === 'datetime' ? '开始时间' : '开始日期'"
            :end-placeholder="type === 'datetime' ? '结束时间' : '结束日期'"
            :default-time="defaultTime || '12:00:00'"
            unlink-panels
            :picker-options="{
                disabledDate: startDisabled
            }"
            @change="change"
        />
        <template v-if="disabledStartTime || disabledEndTime">
            <el-date-picker
                ref="start"
                v-model="start"
                style="width: 180px; box-sizing: border-box;"
                :key="'start'"
                :type="type"
                :format="format"
                :value-format="format"
                :clearable="clearable"
                :disabled="disabledStartTime"
                :default-time="defaultTime[0]"
                :picker-options="{
                    disabledDate: startDisabled
                }"
                placeholder="选择开始时间"
                :editable="false"
                @focus="focus"
                @change="startChange"
            />
            <span> 至 </span>
            <el-date-picker
                ref="end"
                v-model="end"
                style="width: 180px; box-sizing: border-box;"
                :key="'end'"
                :type="type"
                :format="format"
                :value-format="format"
                :clearable="clearable"
                :disabled="disabledEndTime"
                :default-time="defaultTime[1]"
                :picker-options="{
                    disabledDate: endDisabled
                }"
                :editable="false"
                placeholder="选择结束时间"
                @focus="focus"
                @change="endChange"
            />
        </template>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    name: 'DateRange',
    data () {
        return {
            dateValue: null,
            start: '',
            end: '',
            dateType: {
                date: 'yyyy-MM-dd',
                datetime: 'yyyy-MM-dd HH:mm:ss'
            },
            momentType: {
                date: 'YYYY-MM-DD',
                datetime: 'YYYY-MM-DD HH:mm:ss'
            }
        }
    },
    // model: {
    //   prop: 'value',
    //   event: 'change'
    // },
    props: {
    // value: {
    //   type: Object,
    //   default () {
    //     return {
    //       start: null,
    //       end: null
    //     }
    //   }
    // },
        size: {
            type: String,
            default: 'mini'
        },
        width: {
            type: String,
            default: null
        },
        separator: {
            type: String,
            default: '至'
        },
        // 禁用开始时间
        disabledStartTime: Boolean,
        // 禁用结束时间
        disabledEndTime: Boolean,
        clearable: Boolean,
        init: {
            type: Array,
            default () {
                return []
            }
        },
        // 禁用今天以后的日期
        disableAfter: Boolean,
        // 禁用今天以前的日期
        disableBefore: Boolean,
        // 仅支持 datetime or date
        type: {
            type: String,
            default: 'date',
            validator (val) {
                return ['date', 'datetime'].indexOf(val) !== -1
            }
        },
        defaultTime: {
            type: Array,
            default () {
                if (this.type === 'date') {
                    return [moment().format('HH:mm:ss'), moment().format('HH:mm:ss')]
                }
                return [moment().format('HH:mm:ss'), moment(Date.now() + 1000 * 60 * 60).format('HH:mm:ss')]
            }
        }
    },
    watch: {
        init: {
            handler (val) {
                this.dateValue = val || []
                this.start = val[0] || null
                this.end = val[1] || null
            },
            immediate: true
        }
    // value ({ start = null, end = null }) {
    //   const dateValue = []
    //   if (start) {
    //     dateValue.push(start)
    //   }
    //   if (end) {
    //     dateValue.push(end)
    //   }
    //   this.dateValue = dateValue
    // }
    },
    computed: {
        format () {
            return this.dateType[this.type]
        },
        momentFormat () {
            return this.momentType[this.type]
        },
        endTimestamp () {
            if (!this.end) {
                return Number.MAX_SAFE_INTEGER
            }
            if (this.type === 'date') {
                return moment(this.end.substr(0, 10)).valueOf()
            }
            return moment(this.end).valueOf()
        },
        startTimestamp () {
            if (!this.start) {
                return Number.MIN_SAFE_INTEGER
            }
            if (this.type === 'date') {
                return moment(this.start.substr(0, 10)).valueOf()
            }
            return moment(this.start).valueOf()
        }
    },
    created () {
        this.initDate()
        const unwatch = this.$watch('init', val => {
            if (val && val[0] && val[1]) {
                this.initDate()
                if (unwatch) unwatch()
            }
        })
    },
    methods: {
        initDate () {
            if (this.init.length === 2) {
                const dateValue = []
                for (let time of this.init) {
                    time = time ? moment(time).format(this.momentFormat) : moment().format(this.momentFormat)
                    dateValue.push(time)
                }
                this.dateValue = dateValue
            }
            if (this.dateValue) {
                this.start = this.dateValue[0] || ''
                this.end = this.dateValue[1] || ''
            }
        },
        // 仅判断日期，不判断时分秒
        startDisabled (date) {
            // 到当天的23:59:59
            const current = date.getTime()
            //  禁用今天之前和结束时间之后
            if (this.disableBefore) {
                // 到当天的00:00:00
                return current < moment().startOf('day')
                    .valueOf()
            }
            //  禁用今天之后
            if (this.disableAfter) {
                // 到当天的23:59:59
                return current > moment().endOf('day')
                    .valueOf()
            }
            return false
        },
        // 结束时间的禁用规则，仅判断日期，不判断时分秒
        endDisabled (date) {
            // 当天的 00:00:00
            const current = date.getTime()
            //  禁用今天之前和开始时间之前
            if (this.disableBefore) {
                // 到当天的00:00:00
                return current < moment().startOf('day')
                    .valueOf()
            }
            // 禁用今天之后
            if (this.disableAfter) {
                // 到当天的23:59:59
                return current > moment().endOf('day')
                    .valueOf()
            }
            return false
        },
        startChange (val) {
            if (!val) return
            if (moment(val).valueOf() >= moment(this.end).valueOf()) {
                this.$warning('开始时间必须小于结束时间')
                this.start = moment(moment(this.end).valueOf() - 60 * 60 * 1000).format(this.momentFormat)
            }
            this.$emit('change', {
                start: (this.type === 'date' && val) ? val += ' 00:00:00' : (val || null),
                end: (this.type === 'date' && this.end) ? moment(this.end).format('YYYY-MM-DD HH:mm:ss') : (this.end || null)
            })
        },
        endChange (val) {
            if (!val) return
            if (moment(val).valueOf() < moment(this.start).valueOf()) {
                this.$warning('结束时间必须大于开始时间')
                this.end = moment(moment(this.start).valueOf() + 60 * 60 * 1000).format(this.momentFormat)
            }
            this.$emit('change', {
                start: (this.type === 'date' && this.start) ? moment(this.start).format('YYYY-MM-DD HH:mm:ss') : (this.start || null),
                end: (this.type === 'date' && val) ? val += ' 23:59:59' : (val || null)
            })
        },
        change (val) {
            const data = {
                start: '',
                end: ''
            }
            data.start = val ? val[0] : ''
            data.end = val ? val[1] : ''
            this.start = data.start
            this.end = data.end
            if (this.type === 'date' && data.start && data.end) {
                data.start += ' 00:00:00'
                data.end += ' 23:59:59'
            }
            this.$emit('change', data)
        },
        clear () {
            this.start = null
            this.end = null
            this.$emit('change', {
                start: null,
                end: null
            })
        },
        // 禁用此刻按钮
        async focus (e) {
            this.$emit('focus', e)
            await this.$nextTick()
            const spans = document.querySelectorAll('.el-picker-panel__footer span') || []
            for (const span of spans) {
                if (span.innerText.indexOf('此刻') > -1) {
                    span.style.display = 'none'
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
.label {
    font-size: 14px;
    margin: 0 10px 0 0;
}
.separator {
    margin: 0 10px;
}
    ::v-deep {
        .el-range-separator {
            padding: 0 !important;
        }
    }

</style>
