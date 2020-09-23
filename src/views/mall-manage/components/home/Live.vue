<template>
    <div :class="$style.liveWrapper">
        <div :class="$style.liveHead">
            <PlSvg name="icon-live-red-f0ae2" width="18" height="20" />
            <b>{{ data.moduleName }}</b>
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
        <ul :class="$style.liveList" v-if="data.values.length">
            <template v-for="(live, index) of data.values">
                <li :class="$style.first" :key="index" v-if="data.values.length % 2 && index === 0">
                    <div :class="$style.imgWrapper">
                        <img :src="(isNoticeShow(live) ? live.noticeImg : live.coverImg) + '?x-oss-process=style/thum-middle'">
                        <PlSvg name="icon-bofang" height="50" />
                    </div>
                    <div :class="$style.liveInfo">
                        <h4 v-text="live.name" />
                        <p>
                            <template v-if="isNoticeShow(live)">
                                <span>即将开始</span>
                                <span>|</span>
                                <span>{{ `直播时间 ${getTime(live.liveStartTime)}` }}</span>
                            </template>
                            <template v-if="live.statue === 4">
                                <span>直播中</span>
                                <span>|</span>
                                <span>{{ `${live.visitTimes}人观看` }}</span>
                            </template>
                            <template v-if="live.statue === 0">
                                <span>直播已结束，去看回放</span>
                            </template>
                        </p>
                    </div>
                </li>
                <li :class="$style.others" :key="index" v-else>
                    <label>
                        <span v-if="isNoticeShow(live)">即将开始</span>
                        <span v-if="live.statue === 4">直播中</span>
                        <span v-if="live.statue === 0">看回放</span>
                    </label>
                    <div :class="$style.imgWrapper">
                        <img :src="(isNoticeShow(live) ? live.noticeImg : live.coverImg) + '?x-oss-process=style/thum-small'">
                    </div>
                    <div :class="$style.liveInfo">
                        <h4 v-text="live.name" />
                        <p v-if="isNoticeShow(live)">
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
        <ul :class="$style.liveList" v-else>
            <li :class="$style.first">
                <div :class="$style.imgWrapper">
                    <img :src="'https://mallcdn.youpenglai.com/static/admall/mall-management/default.png' + '?x-oss-process=style/thum-middle'">
                </div>
                <div :class="$style.liveInfo">
                    <h4>李老师初中地理七年级上</h4>
                    <p>
                        <span>正在直播</span>
                        <span>|</span>
                        <span>99人观看</span>
                    </p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { LiveStatus } from '../../utils/types'

@Component
export default class Live extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: object

    /* methods */
    isNoticeShow (live: { statue: number; hasNotice: boolean }) {
        return live.statue === LiveStatus.NotStarted && live.hasNotice
    }

    getTime (time: string) {
        if (!time) return ''
        const index = time.lastIndexOf(':')
        return time.slice(0, index)
    }
}
</script>

<style module lang="scss">
.live-wrapper {
    padding: 10px;
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
.live-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    > li {
        position: relative;
        margin-top: 10px;
        border-radius: 10px;
        overflow: hidden;
        > label {
            position: absolute;
            top: 0;
            left: 0;
            box-sizing: border-box;
            text-align: center;
            width: 50px;
            line-height: 20px;
            background: #f2b036;
            border-radius: 10px 0px 10px 0px;
            font-size: 10px;
            font-family: Microsoft YaHei;
            color: #fff;
        }
    }
    > li.first {
        margin-top: 0;
        width: 100%;
        height: 213px;
        .img-wrapper {
            width: 100%;
            height: 100%;
            border-radius: 10px;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            svg {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
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
        .img-wrapper {
            flex: 1;
            width: 100%;
            height: 0;
            border-radius: 10px 10px 0 0;
            overflow: hidden;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .live-info {
            height: 48px;
            box-sizing: border-box;
            padding: 4px 0;
            background: #fff;
            font-size: 10px;
            color: #666;
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
