<template>
    <div class="online-number">
        <el-form inline>
            <el-form-item class="mb-0" label="房间号：">
                <el-select v-model="localRoomId" @change="getCountInTwoMinute">
                    <el-option v-for="item of rooms" :key="item.roomId" :value="item.roomId" :label="item.name" />
                </el-select>
            </el-form-item>
            <el-form-item class="mb-0">
                <el-button
                    type="primary"
                    style="width: 98px;"
                    @click="getCountInTwoMinute"
                >
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
import { getCountInTwoMinute } from './../../../../../../apis/product-center/online-teaching/live'
import VCharts from 'v-charts'
const VeLine = VCharts.VeLine
export default {
    name: 'RealTimeOnlineNumber',
    components: {
        VeLine
    },
    data () {
        return {
            loading: false,
            empty: true,
            grid: {
                left: 20,
                top: 50,
                bottom: 50,
                right: 50
            },
            lineYAxis: {
                type: 'value',
                name: '单位：人次',
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
                    return `${ params[0].value }人次`
                }
            },
            localRoomId: ''
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
            type: [Number, String],
            default: ''
        }
    },
    watch: {
        rooms (val) {
            if (val.length) {
                this.localRoomId = Number(this.roomId) || val[0].roomId
                this.getCountInTwoMinute()
            }
        }
    },
    async activated () {
        try {
            this.realTimer = setInterval(() => {
                this.getCountInTwoMinute()
            }, 10000)
        } catch (e) {
            throw e
        }
    },
    deactivated () {
        clearInterval(this.realTimer)
    },
    methods: {
    // 最近两分钟（实时）
        async getCountInTwoMinute () {
            if (!this.roomId) return
            try {
                this.loading = true
                let { data } = await getCountInTwoMinute(this.roomId)
                data = data.result.data || []
                data = data.splice(0, 15)
                this.empty = !data.length
                this.lineXAxis.data = data.map(item => item.time)
                this.earningsSeries[0].data = data.map(item => item.count)
            } catch (e) {
                throw e
            } finally {
                this.loading = false
            }
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
