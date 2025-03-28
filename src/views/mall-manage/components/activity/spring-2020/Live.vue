<template>
    <div :class="$style.live" v-if="isLiveShow">
        <div :class="$style.cover">
            <span :class="$style.status" v-if="isNoticeShow">距开始</span>
            <span :class="$style.status" v-if="live.statue === 4">正在直播</span>
            <!-- <span :class="$style.status" v-if="live.statue === 0">已结束</span> -->
            <Countdown
                v-if="isNoticeShow"
                :duration="duration"
                @finish="done"
            >
                <template #default="{time}">
                    <i :class="$style.block">{{ String(time.days).padStart(2, '0') }}</i>
                    <span :class="$style.colon">天</span>
                    <i :class="$style.block">{{ String(time.hours).padStart(2, '0') }}</i>
                    <span :class="$style.colon">:</span>
                    <i :class="$style.block">{{ String(time.minutes).padStart(2, '0') }}</i>
                    <span :class="$style.colon">:</span>
                    <i :class="$style.block">{{ String(time.seconds).padStart(2, '0') }}</i>
                </template>
            </Countdown>
            <span v-if="live.statue === 4">
                {{ `${live.visitTimes}人观看` }}
            </span>
        </div>
        <div :class="$style.imgWrapper">
            <img :src="(isNoticeShow ? live.noticeImg : live.coverImg) + '?x-oss-process=style/thum-small'">
            <PlSvg name="icon-bofang" width="50" height="50" />
            <div :class="$style.info">
                <div :class="$style.status">
                    <span v-if="isNoticeShow">预告</span>
                    <span v-if="live.statue === 4">直播中</span>
                </div>
                <span :class="$style.name" v-text="live.name" />
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
        return data.liveModel.filter(item => item.statue === 0 || item.statue === 4 || (item.statue === 2 && item.hasNotice))
    }

    get isLiveShow () {
        return !!this.liveModel.length
    }

    get live () {
        return this.isLiveShow ? this.liveModel[0] : {}
    }

    get isNoticeShow () {
        return this.live && this.live.statue === 2 && this.live.hasNotice
    }

    get duration () {
        const { liveStartTime, hasNotice, statue } = this.live
        let ts = 0
        if (statue === 2 && hasNotice && liveStartTime) {
            ts = moment(liveStartTime).valueOf()
        }
        const duration = Date.now().valueOf() - ts
        return Math.abs(duration)
    }

    /* methods */
    done () {
        if (this.live.statue === LiveStatus.NotStarted) {
            this.live.statue = LiveStatus.Started
        } else if (this.live.statue === LiveStatus.Started) {
            this.live.statue = LiveStatus.Finished
        }
    }
}
</script>

<style lang="scss" module>
.live {
    position: relative;
    padding: 10px;
    background: #fff;
    box-shadow: 0 8px 12px rgba(121, 30, 5, .2);
    border-radius: 10px;
    .cover {
        display: flex;
        justify-content: center;
        align-items: center;
        background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/f48d1f18-3399-42d9-8d5c-c92534eb536d.png') no-repeat center;
        background-size: 100%;
        position: absolute;
        top: -11px;
        left: 50%;
        transform: translateX(-50%);
        width: 262px;
        height: 43px;
        font-size: 14px;
        color: #fff;
        z-index: 1;
        .status {
            margin-right: 5px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            line-height: 17px;
        }
        .block {
            display: inline-block;
            box-sizing: border-box;
            padding: 0 2px;
            height: 23px;
            line-height: 23px;
            background: #fff;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            color: #ff4b00;
        }
        .colon {
            padding: 0 4px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
        }
    }
    .img-wrapper {
        position: relative;
        height: 229px;
        border-radius: 10px;
        overflow: hidden;
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .info {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        padding-left: 10px;
        height: 40px;
        line-height: 40px;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .4) 100%);
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #fff;
        .status {
            margin-right: 6px;
            padding: 0 8px;
            height: 24px;
            background: #fff;
            border-radius: 5px;
            font-size: 12px;
            line-height: 24px;
            color: #ff6739;
            text-align: center;
        }
        .name {
            flex: 1;
            width: 0;
            @include elps();
        }
    }
    svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    // ::v-deep .countdown > .time > span {
    //     padding: 0 4px;
    //     font-size: 12px;
    //     font-family: Microsoft YaHei;
    //     font-weight: bold;
    //     line-height: 24px;
    //     color: #fff;
    // }
}

</style>
