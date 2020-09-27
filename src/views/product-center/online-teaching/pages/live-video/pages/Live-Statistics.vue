<template>
    <div :class="$style.liveStatistics" class="wrap">
        <search-box inline>
            <el-form-item label="查询时间：">
                <date-range
                    clearable
                    @change="getData"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" round @click="getData">
                    查询
                </el-button>
            </el-form-item>
        </search-box>
        <div :class="$style.dataWrap">
            <div :class="$style.dataBox">
                <div :class="$style.dataTypeName">
                    访问次数
                </div>
                <div :class="$style.dataValue">
                    <span v-text="summary.mobileVideoView + summary.pcVideoView || 0" />
                </div>
            </div>
            <div :class="$style.dataBox">
                <div :class="$style.dataTypeName">
                    直播观看时长(分钟)
                </div>
                <div :class="$style.dataValue" v-text="summary.mobilePlayDuration + summary.pcPlayDuration || 0" />
            </div>
            <div :class="$style.dataBox">
                <div :class="$style.dataTypeName">
                    已消耗点播流量(G)
                </div>
                <div :class="$style.dataValue" v-text="flowUsed" />
            </div>
            <div :class="$style.dataBox">
                <div :class="$style.dataTypeName">
                    观看IP数
                </div>
                <div :class="$style.dataValue">
                    <span v-text="summary.mobileUniqueViewer + summary.pcUniqueViewer || 0" />
                </div>
            </div>
            <div :class="$style.dataBox">
                <div :class="$style.dataTypeName">
                    人均访问次数
                </div>
                <div :class="$style.dataValue">
                    <span v-text="Number.parseInt((summary.mobileVideoView + summary.pcVideoView) / (summary.mobileUniqueViewer + summary.pcUniqueViewer)) || 0" />
                </div>
            </div>
        </div>
        <el-table
            :data="rooms"
            :row-style="{ paddingLeft: '90px' }"
        >
            <el-table-column prop="roomId" label="房间号" align="left" header-align="left" />
            <el-table-column prop="name" label="房间名称" />
            <el-table-column prop="videoView" label="访问次数" />
            <el-table-column prop="playDuration" label="观看时长" />
            <el-table-column prop="uniqueViewer" label="观看IP数" />
            <el-table-column prop="name" label="操作" align="right" header-align="right">
                <template #default="{ row }">
                    <el-button
                        type="text"
                        @click="editRoom(row)"
                    >
                        编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div :class="$style.chart">
            <!-- 实时在线人数 -->
            <div :class="$style.chartModule">
                <div :class="$style.title">
                    实时在线人数
                </div>
                <RealTimeOnlineNumber
                    :rooms="rooms"
                    :room-id="roomId"
                />
            </div>
            <!-- 历史在线人数 -->
            <div :class="$style.chartModule">
                <div :class="$style.title">
                    历史点击量
                </div>
                <OnlineNumber
                    :rooms="rooms"
                    :room-id="roomId"
                />
            </div>
        </div>
        <AddRoom
            :show.sync="showAddRoom"
            :room-name="editRoomModel.name"
            :room-id="editRoomModel.roomId"
            @success="getAllRooms"
        />
    </div>
</template>

<script>
import OnlineNumber from './../components/Online-Number'
import AddRoom from './../components/Add-Room.vue'
import RealTimeOnlineNumber from './../components/Real-Time-Online-Number'
import {
    getChanneStatistics,
    getRoomStatistics,
    getFlowHasUsed
} from './../../../../../../apis/product-center/online-teaching/live'
export default {
    name: 'LiveStatistics',
    components: {
        OnlineNumber,
        RealTimeOnlineNumber,
        AddRoom
    },
    data () {
        return {
            showAddRoom: false,
            // 所有房间
            rooms: [],
            summaryForm: {
                startDate: '',
                endDate: ''
            },
            summary: {},
            editRoomModel: {},
            flowUsed: 0
        }
    },
    props: {
        roomId: {
            type: [String, Number],
            default: ''
        }
    },
    async activated () {
        try {
            await this.getData()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async getStatistics (date) {
            if (date) {
                this.summaryForm.startDate = date.start ? date.start.split(' ')[0] : ''
                this.summaryForm.endDate = date.end ? date.end.split(' ')[0] : ''
            }
            try {
                const { result } = await getChanneStatistics(this.summaryForm)
                this.summary = result
            } catch (e) {
                throw e
            }
        },
        // 获取所有直播房间
        async getAllRooms (date) {
            if (date) {
                this.summaryForm.startDate = date.start ? date.start.split(' ')[0] : ''
                this.summaryForm.endDate = date.end ? date.end.split(' ')[0] : ''
            }
            try {
                const { result } = await getRoomStatistics(this.summaryForm)
                this.rooms = result || []
            } catch (e) { throw e }
        },
        async getFlowHasUsed () {
            try {
                const { result } = await getFlowHasUsed()
                this.flowUsed = result
            } catch (e) {
                throw e
            }
        },
        async getData (date) {
            try {
                await Promise.all([
                    this.getAllRooms(date),
                    this.getStatistics(date),
                    this.getFlowHasUsed()
                ])
            } catch (e) {
                throw e
            }
        },
        editRoom (row) {
            this.editRoomModel = row
            this.showAddRoom = true
        }
    }
}
</script>

<style lang="scss" module>
.live-statistics {
    background-color: #fff;
}
.chart {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    margin-top: 20px;
    padding: 20px;
    background: #fff;
    > .chart-module {
        flex: 1;
        > .title {
            display: flex;
            align-items: center;
            line-height: 46px;
            &:before {
                display: inline-block;
                content: '';
                width: 4px;
                height: 20px;
                margin-right: 10px;
                background-color: #598bf8;
            }
        }
    }
}
.data-wrap {
    display: flex;
    box-sizing: border-box;
    margin-bottom: 1px;
    padding: 18px 28px 24px 56px;
    background: #fff;
    .data-box {
        flex: 1;
        margin-right: 33px;
        border-right: 1px solid #e7e7e7;
        &:nth-last-of-type(1) {
            border-right: none;
        }
    }
    .data-type-name {
        margin-bottom: 28px;
        font-size: 18px;
        line-height: 24px;
        font-weight: bold;
    }
    .data-value {
        margin-bottom: 6px;
        font-size: 50px;
        line-height: 50px;
    }
}
@media screen and (max-width: 1500px) {
    .data-wrap {
        .data-type-name {
            font-size: 16px !important;
            margin-bottom: 18px;
        }
        .data-value {
            margin-bottom: 0;
            > span {
                font-size: 30px;
            }
        }
    }
}

</style>
