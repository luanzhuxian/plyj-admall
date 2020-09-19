<template>
    <div class="live-wrapper" v-if="isLiveShow">
        <div class="live-head">
            <PlSvg name="icon-live-red-f0ae2" width="18" height="20" />
            <b>互动直播</b>
            <div class="live-head__more">
                查看全部
                <i class="el-icon-arrow-right" />
            </div>
        </div>
        <div class="live-head__sub">
            <span>{{ `直播中 ${data.nowCount || 0}` }}</span>
            <span>{{ `即将开始 ${data.futrueCount || 0}` }}</span>
            <span>{{ `往期直播 ${data.pastCount || 0}` }}</span>
        </div>
        <div class="live">
            <div class="img-wrapper">
                <img :src="(isNoticeShow ? live.noticeImg : live.coverImg) + '?x-oss-process=style/thum-small'">
                <div class="label" v-if="isNoticeShow">
                    预告
                </div>
                <PlSvg name="icon-bofang" width="32" />
            </div>
            <div class="info">
                <div class="top" v-text="live.name" />
                <div class="bottom" v-if="live.statue !== 0">
                    <div class="bottom-left">
                        <PlSvg name="icon-clock" width="13" />
                    </div>
                    <div class="bottom-right">
                        <span v-if="isNoticeShow">距开始仅剩</span>
                        <span v-if="live.statue === 4" class="highlight">正在直播</span>
                        <span v-if="live.statue === 0" class="highlight">已结束</span>
                        <countdown
                            v-if="isNoticeShow"
                            :duration="duration"
                            format="DD天HH:mm:ss"
                            @finish="done"
                        />
                        <span v-if="live.statue === 4" class="highlight">
                            {{ `${live.visitTimes}人观看` }}
                        </span>
                        <span v-if="live.statue === 0" class="highlight">
                            直播已结束，去看回放
                        </span>
                    </div>
                </div>
                <div class="lock" v-if="live.roomToken">
                    <PlSvg name="icon-lock-plain-fc397" width="15" />
                    观看需验证口令
                </div>
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
            const { liveStartTime, hasNotice } = this.live
            let ts
            if (hasNotice && liveStartTime) {
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
                this.data.nowCount += 1
                this.data.futrueCount -= 1
            } else if (this.live.statue === 4) {
                this.live.statue = 0
                this.data.nowCount -= 1
                this.data.pastCount += 1
            }
        }
    }
}
</script>

<style scoped lang="scss">
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
    &__sub {
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
    &__more {
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
        align-items: end;
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
