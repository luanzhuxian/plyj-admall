<template>
    <panel custom-class="live-panel" :title="panelTitle">
        <ul class="live-list">
            <template v-for="(live, index) of liveModel.slice(0, 3)">
                <li class="first" :key="index" v-if="~(liveModel.length > 2 ? [0] : [0, 1]).indexOf(index)">
                    <label>
                        <span v-if="live.isNoticeShow">即将开始</span>
                        <span v-if="live.statue === 4">直播中</span>
                        <span v-if="live.statue === 0">看回放</span>
                    </label>
                    <div class="img-wrapper">
                        <img :src="(live.isNoticeShow ? live.noticeImg : live.coverImg) + '?x-oss-process=style/thum-middle'">
                    </div>
                    <div class="live-info">
                        <h4 v-text="live.name" />
                        <p>
                            <template v-if="live.isNoticeShow">
                                <span>{{ `直播时间 ${getTime(live.liveStartTime)}` }}</span>
                            </template>
                            <template v-if="live.statue === 4">
                                <span>正在直播</span>
                                <span>|</span>
                                <span>{{ `${live.visitTimes}人观看` }}</span>
                            </template>
                            <template v-if="live.statue === 0">
                                <span>直播已结束，去看回放</span>
                            </template>
                        </p>
                    </div>
                </li>
                <li class="others" :key="index" v-else>
                    <label>
                        <span v-if="live.isNoticeShow">即将开始</span>
                        <span v-if="live.statue === 4">直播中</span>
                        <span v-if="live.statue === 0">看回放</span>
                    </label>
                    <div class="img-wrapper">
                        <img :src="(live.isNoticeShow ? live.noticeImg : live.coverImg) + '?x-oss-process=style/thum-small'">
                    </div>
                    <div class="live-info">
                        <h4 v-text="live.name" />
                        <p v-if="live.isNoticeShow">
                            {{ `直播时间 ${getTime(live.liveStartTime)}` }}
                        </p>
                        <p v-if="live.statue === 4">
                            {{ `${live.visitTimes}人正在观看` }}
                        </p>
                        <p v-if="live.statue === 0">
                            直播已结束，去看回放
                        </p>
                    </div>
                </li>
            </template>
        </ul>
    </panel>
</template>

<script>
import moment from 'moment'
import Panel from './Panel.vue'

export default {
    name: 'Live',
    components: {
        Panel
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
        return {
            panelTitle: {
                name: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/zbfys.png',
                width: 184,
                height: 27
            }
        }
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
        }
    },
    created () {
        for (const live of this.liveModel) {
            const { liveStartTime, hasNotice } = live

            if (hasNotice && liveStartTime) {
                this.$set(live, 'ts', moment(liveStartTime).valueOf())
            }
            this.$set(live, 'isNoticeShow', live.statue === 2 && live.hasNotice)
        }
    },
    methods: {
        done () {
            if (this.live.statue === 2) {
                this.live.statue = 4
            } else if (this.live.statue === 4) {
                this.live.statue = 0
            }
        },
        getTime (time) {
            if (!time) return ''
            const index = time.lastIndexOf(':')
            return time.slice(0, index)
        }
    }
}
</script>

<style lang="scss" scoped>
.live-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    > li {
        position: relative;
        margin-top: 8px;
        border: 2px solid #222;
        border-radius: 10px;
        &:nth-of-type(1) {
            margin-top: 0;
        }
    }
    > li.first {
        width: 100%;
        height: 213px;
        > label {
            position: absolute;
            top: -6px;
            left: 10px;
            box-sizing: border-box;
            padding: 6px 10px 0 0;
            text-align: center;
            width: 68px;
            height: 38px;
            background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/label.png') no-repeat center;
            background-size: 100%;
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: 800;
            color: #00237a;
        }
        .img-wrapper {
            width: 100%;
            height: 100%;
            border-radius: 10px;
            overflow: hidden;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .live-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            box-sizing: border-box;
            text-align: center;
            padding: 10px 10px 8px;
            height: 57px;
            background: rgba(0, 0, 0, .32);
            border-radius: 0 0 10px 10px;
            font-size: 12px;
            color: #fff;
            > h4 {
                font-size: 16px;
                @include elps();
            }
            > p {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 5px;
                @include elps();
                > span {
                    padding: 0 2.5px;
                }
            }
        }
    }
    > li.others {
        display: flex;
        flex-direction: column;
        width: 160px;
        height: 160px;
        overflow: hidden;
        > label {
            position: absolute;
            top: 4px;
            left: 4px;
            box-sizing: border-box;
            text-align: center;
            width: 56px;
            height: 19px;
            line-height: 17px;
            background: #ffe100;
            border: 1px solid #222;
            border-radius: 5px;
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: 800;
            color: #00237a;
        }
        .img-wrapper {
            flex: 1;
            width: 100%;
            height: 0;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .live-info {
            height: 48px;
            box-sizing: border-box;
            padding: 4px 7px;
            background: #fff;
            font-size: 10px;
            color: #999;
            > h4 {
                font-size: 13px;
                color: #333;
                @include elps();
            }
            > p {
                margin-top: 3px;
                @include elps();
            }
        }
    }
}

</style>
