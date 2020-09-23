<template>
    <div :class="$style.workbench">
        <div :class="$style.banner">
            <div :class="$style.detail">
                <span>互动直播把教育装口袋</span>
                <el-button round :class="$style.btn">客户端下载</el-button>
            </div>
        </div>

        <div :class="$style.liveInfo" class="wrap">
            <div :class="$style.label">
                <div :class="$style.name">互动直播</div>
                <div :class="$style.content">可预约房间数：3/3</div>
            </div>
            <div :class="$style.roomInfo">
                <div :class="$style.rooms" v-if="num">
                    <div :class="$style.scrollBar" :style="{ 'width': `${cks}%` }">
                        <LivePack :class="$style.pack" v-for="item in num" :key="item" />
                    </div>
                </div>
                <div
                    :class="{
                        [$style.roomControl]: true,
                        [$style.noRoom]: !num
                    }"
                >
                    <div :class="$style.addLive">
                        <div :class="$style.addStatus">空闲中</div>
                        <div :class="$style.addInfo">
                            <img :class="$style.img" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/摄像头.png" alt="">
                            <span>点击预约直播房间</span>
                        </div>
                    </div>
                    <div :class="$style.livePrevious">
                        <img :class="$style.img" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/摄像头.png" alt="">
                        <div :class="$style.previousInfo">
                            <div>查看直播</div>
                            <img :class="$style.more" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/更多.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div :class="$style.liveStatistics" class="wrap">
            <div :class="$style.statisticsLeft">
                <SchemeLabel name="互动直播" content="互动直播，让教育更简单" />
                <div :class="$style.content">
                    <div :class="$style.comboInfo">
                        <div :class="$style.comboTitle">剩余套餐量</div>
                        <div :class="$style.comboTime">
                            <span :class="$style.comboNum">10</span>
                            <span>分钟</span>
                        </div>
                        <Progress
                            show-text
                            text="66666"
                            color="#F5F6FA"
                            percentage-color="#2DCA72"
                            :percentage="60"
                        />
                    </div>
                    <div :class="$style.comboBtn">
                        <div>
                            <el-button round type="primary">续费</el-button>
                            <el-button round>订单记录</el-button>
                        </div>
                        <div><el-button type="text">视频下载</el-button></div>
                    </div>
                </div>
            </div>
            <div :class="$style.statisticsRight">
                <SchemeLabel name="数据统计" content="互动直播，让教育更简单" />
                <div :class="$style.content">
                    <div :class="$style.statisticsItem">
                        <div :class="$style.label">访问次数</div>
                        <div :class="$style.value">4090</div>
                    </div>
                    <div :class="$style.statisticsItem">
                        <div :class="$style.label">直播观看时长</div>
                        <div :class="$style.value">
                            <span>139141</span>
                            <span :class="$style.unit">分钟</span>
                        </div>
                    </div>
                    <div :class="$style.statisticsItem">
                        <div :class="$style.label">已点播流量</div>
                        <div :class="$style.value">
                            <span>101.4</span>
                            <span :class="$style.unit">G</span>
                        </div>
                    </div>
                    <div :class="$style.statisticsItem">
                        <div :class="$style.label">观看IP数</div>
                        <div :class="$style.value">4090</div>
                    </div>
                    <div :class="$style.statisticsItem">
                        <div :class="$style.label">人均访问次数</div>
                        <div :class="$style.value">4090</div>
                    </div>
                    <div :class="$style.more">
                        <div>全部数据</div>
                        <img :class="$style.moreImg" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/更多.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'

import SchemeLabel from './../../../../../marketing-manage/components/Scheme-Label.vue'
import LivePack from './../components/Live-Pack.vue'
import Progress from './../../../../../../components/base-setting/account-manage/Progress.vue'

@Component({
    components: {
        SchemeLabel,
        LivePack,
        Progress
    }
})
export default class Workbench extends Vue {
    num = 13

    get cks () {
        return Math.ceil(this.num / 2) * 100
    }
}
</script>

<style lang='scss' module>

.workbench {
    > .banner {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 120px;
        background: url('https://mallcdn.youpenglai.com/static/admall-new/3.0.0/营销中心-banner.png') no-repeat;
        background-size: cover;
        > .detail {
            font-size: 24px;
            color: #fff;
            > .btn {
                margin-left: 20px;
            }
        }
    }
    > .live-info {
        > .label {
            display: flex;
            align-items: baseline;
            margin-bottom: 24px;
            font-size: 14px;
            > .name {
                margin-right: 20px;
                font-size: 16px;
                font-weight: 600;
            }
        }
        > .room-info {
            display: flex;
            box-sizing: border-box;
            padding: 15px;
            border-radius: 20px;
            background-color: #fefeff;
            > .rooms {
                flex: 1;
                overflow-x: auto;
                margin-right: 30px;
                > .scroll-bar {
                    display: grid;
                    grid-template-rows: calc(50% - 15px) calc(50% - 15px);
                    grid-auto-flow: column;
                    grid-row-gap: 30px;
                    grid-column-gap: 15px;
                    > .pack {
                        min-height: 189px;
                    }
                }
            }
            > .room-control {
                display: grid;
                grid-template-rows: 190px 190px;
                grid-template-columns: 100%;
                grid-row-gap: 30px;
                flex: 1;
                > .add-live {
                    box-sizing: border-box;
                    height: 190px;
                    padding: 20px;
                    border: 1px solid #e7e7e7;
                    border-radius: 10px;
                    background-color: #fff;
                    > .add-status {
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        margin-bottom: 4px;
                        color: #2dca72;
                        &:before {
                            display: inline-block;
                            width: 8px;
                            height: 8px;
                            margin-right: 4px;
                            border-radius: 50%;
                            background-color: #2dca72;
                            content: '';
                        }
                    }
                    > .add-info {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: calc( 100% - 24px);
                        border: 1px dashed #e7e7e7;
                        border-radius: 4px;
                        color: #999;
                        cursor: pointer;
                        > .img {
                            width: 144px;
                            height: 70px;
                        }
                    }
                }
                > .live-previous {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 10px;
                    color: #4f63ff;
                    background-color: #fff;
                    cursor: pointer;
                    > .img {
                        width: 144px;
                        height: 70px;
                    }
                    > .previous-info {
                        > .more {
                            width: 36px;
                            margin-top: 12px;
                        }
                    }
                }
            }
            > .no-room {
                grid-template-columns: calc(50% - 15px) calc(50% - 15px);
                grid-column-gap: 30px;
                grid-template-rows: 100%;
            }
        }
    }
    > .live-statistics {
        display: flex;
        margin-top: 10px;
        > .statistics-left {
            flex: 1;
            padding-right: 42px;
            border-right: 1px solid #e7e7e7;
            > .content {
                display: flex;
                justify-content: space-between;
                padding: 20px 0 0 30px;
                > .combo-info {
                    > .combo-title {
                        font-size: 14px;
                        color: #666;
                    }
                    > .combo-time {
                        margin: 11px 0;
                        font-size: 16px;
                        font-weight: bold;
                        > .combo-num {
                            font-size: 48px;
                            font-weight: 600;
                        }
                    }
                }
                > .combo-btn {
                    display: grid;
                    align-content: space-between;
                }
            }
        }
        > .statistics-right {
            flex: 1;
            padding-left: 42px;
            > .content {
                display: grid;
                grid-template-rows: 1fr 1fr;
                grid-template-columns: 1fr 1fr 1fr;
                grid-row-gap: 34px;
                padding: 20px 0 0 30px;
                > .statistics-item {
                    font-size: 12px;
                    color: #666;
                    > .value {
                        font-size: 24px;
                        font-weight: 600;
                        color: #333;
                        > .unit {
                            margin-left: 10px;
                            font-size: 16px;
                        }
                    }
                }
                > .more {
                    color: #4f63ff;
                    cursor: pointer;
                    > .more-img {
                        width: 36px;
                        margin-top: 5px;
                    }
                }
            }
        }
    }
}

</style>
