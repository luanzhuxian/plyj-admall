<template>
    <div :class="$style.functionPack">
        <div :class="$style.banner">
            <img :class="$style.titleImg" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/logo.png" alt="">
            <div :class="$style.desc">支持进行视频课程、互动直播等多种类型的课程模式 为您保驾护航</div>
            <div>
                <el-button
                    round
                    type="primary"
                    @click="$router.push({ name: 'PayAndOrder', params: { isRenew: '1' } })"
                >
                    购买/续费
                </el-button>
                <el-button
                    round
                    @click="$router.push({ name: 'LineTeachingOrder' })"
                >
                    订单记录
                </el-button>
            </div>
        </div>
        <div :class="$style.content" class="wrap">
            <SchemeLabel name="云课堂" content="支持进行视频课程、互动直播等多种类型的课程模式" />
            <div :class="$style.liveInfo">
                <div :class="$style.infoItem">
                    <div :class="$style.title">
                        剩余直播流量（分钟）
                        <el-tooltip placement="top">
                            <template #content>
                                进行实时直播时，根据观看人数和观看时长计算消耗的直播流量分钟。
                            </template>
                            <div :class="$style.descTip">?</div>
                        </el-tooltip>
                    </div>
                    <div :class="$style.detail">{{ statisticsInfo.available }}</div>
                    <Progress
                        show-text
                        text="2000分钟"
                        color="#4F63FF"
                        percentage-color="#FFFFFF"
                        :percentage="60"
                    />
                    <div :class="$style.desc">观看总时长=观看人数x平均每人观看时长</div>
                </div>
                <div :class="$style.infoItem">
                    <div :class="$style.title">
                        剩余点播流量
                        <el-tooltip placement="top">
                            <template #content>
                                知识课程和录播课程的视频观看均会自动扣除相应的点播流量。
                            </template>
                            <div :class="$style.descTip">?</div>
                        </el-tooltip>
                    </div>
                    <div :class="$style.detail">{{ statisticsInfo.remainderDatalowSize_G }}G</div>
                    <Progress
                        show-text
                        text="50G"
                        color="#4F63FF"
                        percentage-color="#FFFFFF"
                        :percentage="60"
                    />
                </div>
                <div :class="$style.infoItem">
                    <div :class="$style.title">视频库存储空间</div>
                    <div :class="$style.detail">{{ statisticsInfo.storageSize_G }}G</div>
                    <Progress
                        show-text
                        text="3G"
                        color="#4F63FF"
                        percentage-color="#FFFFFF"
                        :percentage="60"
                    />
                </div>
            </div>
        </div>
        <div :class="$style.packages" class="wrap">
            <OnlinePack
                name="互动直播"
                desc="互动直播，让教育更简单"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/互动直播.png"
                :tags="['https://mallcdn.youpenglai.com/static/admall-new/3.0.0/新.png']"
                @click="$router.push({ name: 'Live' })"
            >
                <div>直播中：{{ statisticsInfo.ongoing }}</div>
                <div>即将开始：{{ statisticsInfo.notStarted }}</div>
                <div>往期直播：{{ statisticsInfo.over }}</div>
            </OnlinePack>
            <OnlinePack
                name="知识课程管理"
                desc="知识付费课程，让学习更便捷"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/知识课程管理.png"
                @click="$router.push({ name: 'KnowledgeCourseManagement' })"
            >
                <div>上架课程 {{ statisticsInfo.numberOfCourse }}</div>
            </OnlinePack>
            <OnlinePack
                name="系列课"
                desc="系列课程，组合学习，进阶更快"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/系列课.png"
                :tags="['https://mallcdn.youpenglai.com/static/admall-new/3.0.0/新.png']"
                @click="$router.push({ name: 'SeriesOfCourses' })"
            >
                <div>上架课程 {{ statisticsInfo.numberOfSeriesCourse }}</div>
            </OnlinePack>
            <OnlinePack
                name="图文资料"
                desc="图文资料，在线学习"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/图文资料.png"
                @click="$router.push({ name: 'BooksMaterials' })"
            >
                <div>上架资料 {{ statisticsInfo.numberOfgraphic }}</div>
            </OnlinePack>
            <OnlinePack
                name="视频库"
                desc="便捷的视频存储空间"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/视频库.png"
                :tags="['https://mallcdn.youpenglai.com/static/admall-new/3.0.0/新.png']"
                @click="$router.push({ name: 'VideoLibraryList' })"
            >
                <div>视频文件 {{ statisticsInfo.numberOfVideos }}</div>
            </OnlinePack>
            <OnlinePack
                name="资源库"
                desc="海量在线课程视频"
                img-src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/资源库.png"
                :tags="['https://mallcdn.youpenglai.com/static/admall-new/3.0.0/新.png']"
                @click="$router.push({ name: 'VideoRepository' })"
            >
                <div>资源文件 {{ statisticsInfo.numberOfResources }}</div>
            </OnlinePack>
        </div>
    </div>
</template>

<script lang='ts'>
/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Component } from 'vue-property-decorator'

import SchemeLabel from './../../../marketing-manage/components/Scheme-Label.vue'
import Progress from '../../../../components/base-setting/account-manage/Progress.vue'
import OnlinePack from './../compoonents/Online-Pack.vue'

@Component({
    components: {
        SchemeLabel,
        Progress,
        OnlinePack
    }
})
export default class FunctionPack extends Vue {
    statisticsInfo = {
        available: 0,
        remainderDatalowSize_G: 0,
        storageSize_G: 0,
        ongoing: 0,
        notStarted: 0,
        over: 0,
        numberOfCourse: 0,
        numberOfSeriesCourse: 0,
        numberOfgraphic: 0,
        numberOfVideos: 0,
        numberOfResources: 0
    }
}
</script>

<style lang="scss" module>

.function-pack {
    .desc-tip {
        display: inline-block;
        width: 16px;
        margin-left: 10px;
        line-height: 16px;
        border-radius: 50%;
        font-size: 12px;
        text-align: center;
        color: #fff;
        background-color: #999;
        cursor: pointer;
    }
    > .banner {
        display: flex;
        align-content: center;
        justify-content: center;
        flex-wrap: wrap;
        height: 274px;
        text-align: center;
        color: #fff;
        background: url('https://mallcdn.youpenglai.com/static/admall-new/3.0.0/new-login-bg.png') no-repeat;
        background-size: 100% 100%;
        > .title-img {
            height: 35px;
        }
        > .desc {
            width: 100%;
            margin: 18px 0 28px 0;
        }
    }
    > .content {
        > .live-info {
            display: flex;
            box-sizing: border-box;
            margin: 24px 0;
            padding: 34px 78px;
            border-radius: 10px;
            background-color: #f5f6fa;
            > .info-item {
                flex: 1;
                font-size: 14px;
                > .detail {
                    margin: 16px 0;
                    font-size: 48px;
                    font-weight: 600;
                }
                > .desc {
                    margin-top: 6px;
                    color: #999;
                }
            }
        }
    }
    > .packages {
        display: grid;
        justify-content: space-between;
        grid-template-columns: repeat(4, 24%);
        grid-row-gap: 30px;
        box-sizing: border-box;
        padding: 0 40px 30px 40px;
        background-color: #fff;
    }
}

</style>
