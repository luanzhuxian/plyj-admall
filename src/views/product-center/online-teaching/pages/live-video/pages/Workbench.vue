<template>
    <div :class="$style.workbench">
        <div :class="$style.banner">
            <div :class="$style.detail">
                <span>互动直播把教育装口袋</span>
                <el-button round :class="$style.btn" @click="showDownload = true">客户端下载</el-button>
            </div>
        </div>

        <div :class="$style.liveInfo" class="wrap">
            <div :class="$style.label">
                <div :class="$style.name">互动直播</div>
                <div :class="$style.content">可预约房间数：{{ maxRooms - useRooms }}/{{ maxRooms }}</div>
            </div>
            <div :class="$style.roomInfo">
                <div :class="$style.rooms" v-if="liveColums">
                    <div :class="$style.scrollBar" :style="{ '--liveColums': liveColums }">
                        <LivePack
                            :class="$style.pack"
                            v-for="(item) in liveList"
                            :key="item.roomId"
                            :data="item"
                            @add-student="addStudent"
                            @give-class="giveClass"
                            @close-live="closeLive"
                            @remove-live="removeLive"
                            @share="share"
                        />
                    </div>
                </div>
                <div
                    :class="{
                        [$style.roomControl]: true,
                        [$style.noRoom]: !liveColums
                    }"
                >
                    <div :class="$style.addLive" @click="addLive">
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
                            <span :class="$style.comboNum">{{ surplus.available }}</span>
                            <span>分钟</span>
                        </div>
                        <Progress
                            show-text
                            :text="`${surplus.available + surplus.used}分钟`"
                            color="#F5F6FA"
                            percentage-color="#2DCA72"
                            :percentage="flowPercentage"
                        />
                    </div>
                    <div :class="$style.comboBtn">
                        <div>
                            <el-button round type="primary" @click="$router.push({ name: 'PayAndOrder', params: { isRenew: '1', type: '1' } })">续费</el-button>
                            <el-button round @click="$router.push({ name: 'LineTeachingOrderOfFunctional' })">订单记录</el-button>
                        </div>
                        <div><el-button type="text" @click="$router.push({ name: 'VideoDownload' })">视频下载</el-button></div>
                    </div>
                </div>
            </div>
            <div :class="$style.statisticsRight">
                <SchemeLabel name="数据统计" content="互动直播，让教育更简单" />
                <div :class="$style.content">
                    <div :class="$style.statisticsItem">
                        <div :class="$style.label">访问次数</div>
                        <div :class="$style.value">{{ summary.mobileVideoView + summary.pcVideoView || 0 }}</div>
                    </div>
                    <div :class="$style.statisticsItem">
                        <div :class="$style.label">直播观看时长</div>
                        <div :class="$style.value">
                            <span>{{ summary.mobilePlayDuration + summary.pcPlayDuration || 0 }}</span>
                            <span :class="$style.unit">分钟</span>
                        </div>
                    </div>
                    <div :class="$style.statisticsItem">
                        <div :class="$style.label">已点播流量</div>
                        <div :class="$style.value">
                            <span>{{ flowUsed }}</span>
                            <span :class="$style.unit">G</span>
                        </div>
                    </div>
                    <div :class="$style.statisticsItem">
                        <div :class="$style.label">观看IP数</div>
                        <div :class="$style.value">{{ summary.mobileUniqueViewer + summary.pcUniqueViewer || 0 }}</div>
                    </div>
                    <div :class="$style.statisticsItem">
                        <div :class="$style.label">人均访问次数</div>
                        <div :class="$style.value">{{ Number.parseInt((summary.mobileVideoView + summary.pcVideoView) / (summary.mobileUniqueViewer + summary.pcUniqueViewer)) || 0 }}</div>
                    </div>
                    <div :class="$style.more" @click="$router.push({ name: 'LiveStatistics' })">
                        <div>全部数据</div>
                        <img :class="$style.moreImg" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/更多.png" alt="">
                    </div>
                </div>
            </div>
        </div>

        <el-dialog
            :visible.sync="showDownload"
            title="下载客户端"
            width="500px"
        >
            <div :class="$style.download">
                <div :class="$style.qrcode">
                    <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/2.1.0/QR-code.png" alt="">
                    <!--&lt;!&ndash;<span class="fz-12 gray-3" style="margin: 3px;">下载安卓版</span>&ndash;&gt;-->
                </div>
                <div :class="$style.apps">
                    <a href="https://mallcdn.youpenglai.com/static/download/PengLai-Live-Setup.exe"
                       download="PengLai-Live-Setup.exe"
                    >
                        <pl-svg name="icon-pc" width="18" fill="#fff" />
                        <span>电脑版下载</span>
                    </a>
                    <a
                        href="https://mallcdn.youpenglai.com/static/download/%E6%9C%8B%E6%9D%A5%E9%9B%85%E9%9B%86%E7%9B%B4%E6%92%AD%E5%8A%A9%E6%89%8B.apk"
                        download="朋来雅集直播助手.apk"
                    >
                        <pl-svg name="icon-Android" width="18" fill="#fff" />
                        <span>安卓版下载</span>
                    </a>
                    <el-tooltip class="item" effect="dark" content="敬请期待" placement="bottom-end">
                        <a>
                            <pl-svg name="icon-Apple" width="18" fill="#fff" />
                            <span>苹果版下载</span>
                        </a>
                    </el-tooltip>
                </div>
            </div>
        </el-dialog>

        <share
            :show.sync="showQrCode"
            @close="roomTokenError = ''"
            qrcode-image-name="直播二维码："
            :qrcode-text="`${mallUrl}/lived/room/${currentLive.roomValue}`"
        >
            <template #liveWord>
                <el-form-item v-if="currentLive.roomToken" :error="roomTokenError" label="直播间口令：">
                    <el-input style="width: 125px; margin-right: 50px" disabled :value="currentLive.roomToken" />
                    <el-button type="primary" v-clipboard:copy="currentLive.roomToken" v-clipboard:success="() => $success('复制成功')">
                        复制
                    </el-button>
                    <el-button class="ml-10" @click="updateRoomToken">
                        更换
                    </el-button>
                </el-form-item>
            </template>
        </share>

        <SelectStudents
            :show.sync="selectStudent"
            :live-id="currentLive.id"
        />
        <SendLive
            ref="sendLive"
            :show.sync="showSendLiveDialog"
            :live-id="currentLive.id"
        />

    </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

import SelectStudents from './../components/Select-Students.vue'
import SendLive from './../components/Send-Live.vue'
import Share from './../../../../../../components/common/Share.vue'
import SchemeLabel from './../../../../../marketing-manage/components/Scheme-Label.vue'
import LivePack, { LiveData } from './../components/Live-Pack.vue'
import Progress from './../../../../../../components/base-setting/account-manage/Progress.vue'

import {
    updateRoomToken,
    deleteLive,
    closeLive,
    getLiveList,
    getFreeRooms,
    getSurplusMinute,
    getFlowHasUsed,
    getChanneStatistics,
    getAllRoomsOfDetail
} from './../../../../../../apis/product-center/line-teaching/live'

@Component({
    components: {
        SelectStudents,
        SendLive,
        Share,
        SchemeLabel,
        LivePack,
        Progress
    }
})
export default class Workbench extends Vue {
    @Getter('mallUrl') mallUrl!: string

    useRooms = 0
    maxRooms = 1
    flowUsed = 0 // 已消耗流量
    showDownload = false
    selectStudent = false
    showSendLiveDialog = false
    showQrCode = false
    roomTokenError = ''
    liveList = []
    summary = {}
    currentLive: LiveData = {
        id: '',
        roomId: '',
        name: '',
        roomToken: 111,
        liveStatus: 'LIVING',
        roomName: ''
    }

    surplus = {
        available: 1,
        used: 1
    }

    async activated () {
        await Promise.all([
            this.getSurplusMinute(),
            this.getChanneStatistics(),
            this.getFlowHasUsed(),
            this.getRooms(),
            this.getAllLiveList()
        ])
    }

    private async getChanneStatistics () {
        const { result }: any = await getChanneStatistics({
            startDate: '',
            endDate: ''
        })
        this.summary = result
    }

    private async getFlowHasUsed () {
        const { result }: any = await getFlowHasUsed()
        this.flowUsed = result
    }

    private async getRooms () {
        const { result: { maxRooms, useRooms } }: any = await getAllRoomsOfDetail()
        this.maxRooms = maxRooms
        this.useRooms = useRooms
    }

    // 剩余套餐
    private async getSurplusMinute () {
        const { result }: any = await getSurplusMinute()
        this.surplus = result
    }

    private async addLive () {
        const { result }: any = await getFreeRooms()
        if (!result.rooms.length) {
            this.$warning('暂无空闲的直播房间')
            return
        }
        this.$router.push({ name: 'AddLive' })
    }

    private async getAllLiveList () {
        const data: any[] = await Promise.all([
            this.getLiveList('LIVING'),
            this.getLiveList('READY_START')
        ])
        this.liveList = data.reduce((n: any[], p: any[]) => n.concat(p))
    }

    private async getLiveList (status: ('LIVING' | 'READY_START')) {
        const { result }: any = await getLiveList({
            current: 1,
            size: 1e8,
            status
        })
        return result.records.map((item: LiveData) => {
            item.liveStatus = status
            return item
        })
    }

    private addStudent (item: LiveData) {
        this.currentLive = item
        this.selectStudent = true
    }

    private giveClass (item: LiveData) {
        this.currentLive = item
        this.showSendLiveDialog = true
    }

    // 关闭直播
    private async closeLive ({ id }: LiveData) {
        await this.$confirm({
            title: '关闭直播',
            message: '直播正在进行中，是否关闭？关闭后用户将不可观看。'
        })
        await closeLive(id)
        await this.getAllLiveList()
    }

    private async removeLive ({ id }: LiveData) {
        await this.$confirm({
            title: '删除直播',
            message: '直播还未开始，确定删除该直播吗？删除将不可恢复。'
        })
        await deleteLive(id)
        await this.getAllLiveList()
    }

    // 更新直播口令
    private async updateRoomToken () {
        const token = this.getRandom(this.currentLive.roomToken)
        await updateRoomToken({
            activityId: this.currentLive.id,
            roomToken: token
        })
        this.$success('直播间口令更换成功')
        this.currentLive.roomToken = token
    }

    // 生成随机直播口令
    private getRandom (oldToken: number) {
        let num = Math.floor((Math.random() * (10000 - 1000)) + 1000)
        num = oldToken === num ? this.getRandom(oldToken) : num
        return num
    }

    async share (item: LiveData) {
        this.currentLive = item
        this.showQrCode = true
    }

    get liveColums () {
        return Math.ceil(this.liveList.length / 2)
    }

    get flowPercentage () {
        return this.surplus.used / (this.surplus.available + this.surplus.used) * 100
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
                    grid-template-columns: repeat(var(--liveColums), 1fr);
                    grid-auto-flow: column;
                    grid-row-gap: 30px;
                    grid-column-gap: 15px;
                    width: calc(var(--liveColums) * 100%);
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
                        margin: 11px  0;
                        font-size: 16px;
                        font-weight: bold;
                        > .combo-num {
                            margin-right: 20px;
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

.download {
    position: relative;
    display: flex;
    justify-content: center;
    margin-top: 30px;

    &:after {
        position: absolute;
        left: 27px;
        top: -6px;
        content: '';
        width: 20px;
        height: 20px;
        border-top: 1px solid #598bf8;
        border-left: 1px solid #598bf8;
    }

    &:before {
        position: absolute;
        left: 27px;
        bottom: -6px;
        content: '';
        width: 20px;
        height: 20px;
        border-bottom: 1px solid #598bf8;
        border-left: 1px solid #598bf8;
    }

    .qrcode {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px;
        background-color: #ececec;

        &:after {
            position: absolute;
            right: -6px;
            top: -6px;
            content: '';
            width: 20px;
            height: 20px;
            border-top: 1px solid #598bf8;
            border-right: 1px solid #598bf8;
        }

        &:before {
            position: absolute;
            right: -6px;
            bottom: -6px;
            content: '';
            width: 20px;
            height: 20px;
            border-bottom: 1px solid #598bf8;
            border-right: 1px solid #598bf8;
        }

        > img {
            width: 156px;
            height: 156px;
            padding: 10px;
            background-color: #fffeff;
            box-sizing: border-box;
            border: 1px dashed #888;
        }
    }

    .apps {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 32px;

        > a {
            width: 180px;
            margin-bottom: 16px;
            border: 1px solid #999;
            line-height: 35px;
            text-align: center;
            font-size: 16px;
            color: #fff;
            border-radius: 4px;

            &:nth-last-of-type(1) {
                margin-bottom: 0;
            }

            &:nth-of-type(1) {
                background-color: #37619a;
            }

            &:nth-of-type(2) {
                background-color: #333;
            }

            &:nth-of-type(3) {
                background-color: #cb5e55;
                cursor: not-allowed;
            }

            > svg {
                margin-right: 6px;
                vertical-align: -4px;
            }
        }
    }
}

</style>
