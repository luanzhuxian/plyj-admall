<template>
    <div :class="$style.liveWrapper" v-if="isLiveShow">
        <div :class="$style.liveHead">
            <PlSvg name="icon-live-red-f0ae2" width="18" height="20" />
            <b>互动直播</b>
            <div :class="$style.liveHeadMore">
                查看全部
                <i class="el-icon-arrow-right" />
            </div>
        </div>
        <div :class="$style.liveHeadSub">
            <span>{{ `直播中 ${data.nowCount || 0}` }}</span>
            <span>{{ `即将开始 ${data.futrueCount || 0}` }}</span>
            <span>{{ `往期直播 ${data.pastCount || 0}` }}</span>
        </div>
        <div :class="$style.live">
            <div :class="$style.imgWrapper">
                <img :src="(isNoticeShow ? live.noticeImg : live.coverImg) + '?x-oss-process=style/thum-small'">
                <div :class="$style.label" v-if="isNoticeShow">
                    预告
                </div>
                <PlSvg name="icon-bofang" width="32" />
            </div>
            <div :class="$style.info">
                <div :class="$style.top" v-text="live.name" />
                <div :class="$style.bottom" v-if="live.statue !== 0">
                    <div :class="$style.bottomLeft">
                        <PlSvg name="icon-clock" width="13" />
                    </div>
                    <div :class="$style.bottomRight">
                        <span v-if="isNoticeShow">距开始仅剩</span>
                        <span v-if="live.statue === 4" :class="$style.highlight">正在直播</span>
                        <span v-if="live.statue === 0" :class="$style.highlight">已结束</span>
                        <Countdown
                            v-if="isNoticeShow"
                            :duration="duration"
                            format="DD天HH:mm:ss"
                            @finish="done"
                        />
                        <span v-if="live.statue === 4" :class="$style.highlight">
                            {{ `${live.visitTimes}人观看` }}
                        </span>
                        <span v-if="live.statue === 0" :class="$style.highlight">
                            直播已结束，去看回放
                        </span>
                    </div>
                </div>
                <div :class="$style.lock" v-if="live.roomToken">
                    <PlSvg name="icon-lock-plain-fc397" width="15" />
                    观看需验证口令
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import moment from 'moment'
import Countdown from '../../Countdown.vue'
import { LiveStatus } from '../../../utils/map'

@Component({
    components: { Countdown }
})
export default class Live extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { liveModel: [] }
        }
    }) readonly data!: {
        futrueCount: number;
        nowCount: number;
        pastCount: number;
        liveModel: DynamicObject[];
    }

    /* computed */
    get liveModel () {
        const { data } = this

        if (!data.liveModel || !data.liveModel.length) {
            return []
        }
        return data.liveModel.filter(item => item.statue === LiveStatus.Finished || item.statue === LiveStatus.Started || (item.statue === LiveStatus.NotStarted && item.hasNotice))
    }

    get isLiveShow () {
        return !!this.liveModel.length
    }

    get live () {
        return this.isLiveShow ? this.liveModel[0] : {}
    }

    get isNoticeShow () {
        return this.live && this.live.statue === LiveStatus.NotStarted && this.live.hasNotice
    }

    get duration () {
        const { liveStartTime, hasNotice } = this.live
        let ts = 0
        if (hasNotice && liveStartTime) {
            ts = moment(liveStartTime).valueOf()
        }
        const duration = Date.now().valueOf() - ts
        return Math.abs(duration)
    }

    /* methods */
    done () {
        if (this.live.statue === LiveStatus.NotStarted) {
            this.live.statue = LiveStatus.Started
            this.data.nowCount += 1
            this.data.futrueCount -= 1
        } else if (this.live.statue === LiveStatus.Started) {
            this.live.statue = LiveStatus.Finished
            this.data.nowCount -= 1
            this.data.pastCount += 1
        }
    }
}
</script>

<style module lang="scss">
.live-wrapper {
    padding: 10px 8px 10px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
}
.live-head {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    > b {
        margin-left: 8px;
        font-size: 16px;
        color: #333;
    }
    &-sub {
        margin-bottom: 16px;
        > span {
            font-size: 11px;
            line-height: 16px;
            color: #1592e6;
            margin-left: 5px;
            padding-left: 5px;
            border-left: 1px solid #e7e7e7;
            &:nth-of-type(1) {
                margin-left: 0;
                padding-left: 0;
                border-left: none;
            }
        }
    }
    &-more {
        display: flex;
        align-items: center;
        margin-left: auto;
        font-size: 12px;
        color: #999;
    }
}
.live {
    display: flex;
    background-color: #fff;
    overflow: hidden;
    .img-wrapper {
        position: relative;
        width: 120px;
        height: 80px;
        border-radius: 10px;
        overflow: hidden;
        > svg {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .label {
        position: absolute;
        top: 0;
        left: 0;
        width: 50px;
        height: 20px;
        line-height: 20px;
        background: #fb7d55;
        border-radius: 0 0 10px 0;
        font-size: 12px;
        font-family: Microsoft YaHei;
        color: #fff;
        text-align: center;
    }
    .info {
        flex: 1;
        width: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 4px 0px 4px 10px;
    }
    .top {
        margin-bottom: 0;
        height: 38px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 18px;
        color: #333;
        text-align: justify;
        @include elps-wrap(2);
    }
    .bottom {
        display: inline-flex;
        width: max-content;
        min-width: 150px;
        height: 20px;
        border: 1px solid #ff9800;
        border-radius: 10px;
        overflow: hidden;
        &-left {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 30px;
            font-size: 13px;
            color: #fff;
            background: linear-gradient(360deg, rgba(247, 91, 35, 1) 0%, rgba(250, 133, 57, 1) 100%);
            overflow: hidden;
        }
        &-right {
            flex: 1;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            padding: 0 6px;
            font-size: 12px;
            color: #333;
            span {
                margin-right: 5px;
            }
        }
        .highlight {
            color: #fe7b21;
            font-weight: bold;
        }
    }
    .lock {
        display: flex;
        align-items: flex-end;
        margin-top: 7px;
        padding: 0 9px;
        font-size: 12px;
        line-height: 16px;
        color: #666;
        > svg {
            margin-right: 6px;
        }
    }
}

</style>
