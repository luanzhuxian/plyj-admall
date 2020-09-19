<template>
    <div class="live" v-if="isLiveShow">
        <div class="cover">
            <span class="status" v-if="isNoticeShow">距开始</span>
            <span class="status" v-if="live.statue === 4">正在直播</span>
            <!-- <span class="status" v-if="live.statue === 0">已结束</span> -->
            <countdown
                v-if="isNoticeShow"
                :duration="duration"
                @finish="done"
            >
                <template #default="{time}">
                    <i class="block">{{ String(time.days).padStart(2, '0') }}</i>
                    <span class="colon">天</span>
                    <i class="block">{{ String(time.hours).padStart(2, '0') }}</i>
                    <span class="colon">:</span>
                    <i class="block">{{ String(time.minutes).padStart(2, '0') }}</i>
                    <span class="colon">:</span>
                    <i class="block">{{ String(time.seconds).padStart(2, '0') }}</i>
                </template>
            </countdown>
            <span v-if="live.statue === 4">
                {{ `${live.visitTimes}人观看` }}
            </span>
        </div>
        <div class="img-wrapper">
            <img :src="(isNoticeShow ? live.noticeImg : live.coverImg) + '?x-oss-process=style/thum-small'">
            <PlSvg name="icon-bofang" width="50" height="50" />
            <div class="info">
                <div class="status">
                    <span v-if="isNoticeShow">预告</span>
                    <span v-if="live.statue === 4">直播中</span>
                </div>
                <span class="name" v-text="live.name" />
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import Countdown from '../../components/Countdown.vue'

export default {
    name: 'Live',
    components: {
        Countdown
    },
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {}
    },
    computed: {
        liveModel () {
            const { data } = this

            if (!data.liveModel || !data.liveModel.length) {
                return []
            }
            return data.liveModel.filter(item => item.statue === 0 || item.statue === 4 || (item.statue === 2 && item.hasNotice))
        },
        isLiveShow () {
            return !!this.liveModel.length
        },
        live () {
            return this.isLiveShow ? this.liveModel[0] : {}
        },
        isNoticeShow () {
            return this.live && this.live.statue === 2 && this.live.hasNotice
        },
        duration () {
            const { liveStartTime, hasNotice, statue } = this.live
            let ts
            if (statue === 2 && hasNotice && liveStartTime) {
                ts = moment(liveStartTime).valueOf()
            }
            const duration = Date.now().valueOf() - ts
            return Math.abs(duration)
        }
    },
    methods: {
        done () {
            if (this.live.statue === 2) {
                this.live.statue = 4
            } else if (this.live.statue === 4) {
                this.live.statue = 0
            }
        }
    }
}
</script>

<style lang="scss" scoped>
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
    ::v-deep .count-down > .time > span {
        padding: 0 4px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 24px;
        color: #fff;
    }
}

</style>
