<template>
    <div class="online-number">
        <el-form inline>
            <el-form-item class="mb-0" label="房间号：">
                <el-select v-model="params.roomId" @change="getData">
                    <el-option v-for="item of rooms" :key="item.roomId" :value="item.roomId" :label="item.name" />
                </el-select>
            </el-form-item>
            <el-form-item class="mb-0">
                <el-radio-group size="small" v-model="radio1" @change="radioChange">
                    <el-radio border label="今日" />
                    <el-radio border label="昨日" />
                </el-radio-group>
            </el-form-item>
            <el-form-item class="mb-0" label="查询时间">
                <el-date-picker
                    v-model="params.startTime"
                    type="month"
                    @focus="dateFocus"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择月份"
                    @change="getData"
                    :clearable="false"
                    :editable="false"
                />
            </el-form-item>
            <el-form-item class="mb-0">
                <el-button @click="getData" type="primary" round>
                    查询
                </el-button>
            </el-form-item>
        </el-form>

        <div>
            <ve-line
                :loading="loading"
                :data-empty="empty"
                height="550px"
                :y-axis="lineYAxis"
                :x-axis="lineXAxis"
                :series="earningsSeries"
                :tooltip="earningsTip"
                :grid="grid"
            />
        </div>
    </div>
</template>

<script>
import 'v-charts/lib/style.css'
import {
    getHistoryData
    // getCountInTwoMinute
} from './../../../../../../apis/product-center/online-teaching/live'
import moment from 'moment'
import VCharts from 'v-charts'
const VeLine = VCharts.VeLine
export default {
    name: 'OnlineNumber',
    components: {
        VeLine
    },
    data () {
        return {
            radio1: '',
            loading: false,
            empty: true,
            originalData: [],
            grid: {
                left: 30,
                top: 50,
                bottom: 50,
                right: 50
            },
            lineYAxis: {
                type: 'value',
                name: '单位：次',
                splitNumber: 6,
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 1
                    }
                },
                show: true,
                axisLabel: {
                    fontSize: 16
                },
                axisTick: {
                    show: false
                }
            },
            lineXAxis: {
                type: 'category',
                name: '日期',
                data: [],
                axisLabel: {
                    fontSize: 16
                }
            },
            earningsSeries: [{
                type: 'line',
                data: [],
                // smooth: false, // 是否平滑
                symbol: 'circle',
                symbolSize: 8, // 折点大小
                itemStyle: {
                    color: '#3872E5'
                },
                lineStyle: {
                    width: 2 // 折线粗细
                },
                areaStyle: {
                    opacity: 0.2
                },
                // 高亮时的折点样式
                emphasis: {
                    itemStyle: {
                        color: '#fff',
                        borderColor: '#3872E5',
                        borderWidth: 2
                    }
                }
            }],
            // tip 配置
            earningsTip: {
                show: true,
                backgroundColor: '#3872E5',
                trigger: 'axis',
                padding: [5, 10, 5, 10],
                triggerOn: 'mousemove|click',
                textStyle: {
                    fontSize: 16
                },
                formatter (params) {
                    return `${ params[0].value }次`
                }
            },
            params: {
                startTime: moment().startOf('month')
                    .format('YYYY-MM-DD'),
                endTime: moment().endOf('month')
                    .format('YYYY-MM-DD'),
                roomId: ''
            }
        }
    },
    props: {
        rooms: {
            type: Array,
            default () {
                return []
            }
        },
        roomId: {
            type: [String, Number],
            default: ''
        }
    },
    watch: {
        'params.startTime' (val) {
            this.params.endTime = moment(val).endOf('month')
                .format('YYYY-MM-DD')
        },
        rooms (val) {
            if (val.length) {
                this.params.roomId = Number(this.roomId) || val[0].roomId
                this.getData()
            }
        }
    },
    methods: {
    // 获取数据，并处理为合适的格式
        async getData () {
            if (!this.params.roomId) return
            try {
                this.loading = true
                this.empty = false
                this.radio1 = ''
                const { result } = await getHistoryData(this.params)
                this.originalData = result.data
                const data = new Map()
                // 将数据按天就行规整
                for (const item of this.originalData) {
                    if (!data.has(item.day)) {
                        data.set(item.day, 0)
                    }
                    data.set(item.day, data.get(item.day) + item.viewers)
                }
                this.lineXAxis.data = [...data.keys()]
                this.earningsSeries[0].data = [...data.values()]
                this.loading = false
                if (!this.lineXAxis.data.length) {
                    this.empty = true
                }
            } catch (e) {
                throw e
            }
        },
        // 选择今日或者昨日的时候不发起请求，从当前列表中筛选
        radioChange (val) {
            this.empty = false
            let key = ''
            switch (val) {
                case '昨日':
                    key = moment().subtract(1, 'days')
                        .format('YYYY-MM-DD')
                    break
                case '今日':
                    key = moment().format('YYYY-MM-DD')
                    break
            }
            const originalData = this.originalData.filter(item => item.day === key)
            const newData = new Map()
            // 按小时规整数据
            for (const item of originalData) {
                const time = moment(`${ item.day } ${ item.minute }`).format('MM月DD日 HH时')
                if (!newData.has(time)) {
                    newData.set(time, 0)
                }
                newData.set(time, newData.get(time) + item.viewers)
            }
            this.lineXAxis.data = [...newData.keys()]
            this.earningsSeries[0].data = [...newData.values()]
            this.empty = !this.lineXAxis.data.length
        },
        // 月份选择获取焦点的时候取消昨日、今日选项
        dateFocus () {
            this.radio1 = ''
            const data = new Map()
            // 将数据按天就行规整
            for (const item of this.originalData) {
                if (!data.has(item.day)) {
                    data.set(item.day, 0)
                }
                data.set(item.day, data.get(item.day) + item.viewers)
            }
            this.lineXAxis.data = [...data.keys()]
            this.earningsSeries[0].data = [...data.values()]
            this.empty = !this.lineXAxis.data.length
        }
    }
}
</script>

<style scoped lang="scss">
::v-deep {
    .el-radio__input {
        display: none;
    }
    .el-radio__label {
        padding-left: 0;
    }
    .el-radio {
        position: relative;
        top: -1px;
        height: 30px;
        margin-right: 10px;
        margin-left: 0 !important;
        padding: 7px 18px;
    }
    .el-date-editor {
        height: 31px;
    }
    .el-range-separator {
        width: 30px;
    }
}

</style>
