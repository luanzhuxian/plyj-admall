<template>
    <div :class="$style.detailContainer" class="bg-white">
        <div :class="$style.content">
            <div :class="$style.detail">
                <div :class="$style.head">
                    查看详情
                </div>
                <div :class="$style.description">
                    <div :class="$style.course">
                        <div :class="$style.courseType">
                            {{ detail.courseType === 1 ? '单课程' : '系列课' }}
                        </div>
                        <img :src="detail.courseImg || defaultImg" alt="">
                        <ul :class="$style.courseContent">
                            <li :class="$style.courseName">
                                <span v-if="isGive" :class="$style.give">赠课</span>
                                {{ detail.courseName }}
                            </li>
                            <li :class="$style.courseTag">
                                <span v-for="(item,index) in detail.tags" :key="index">{{ item }}</span>
                            </li>
                            <li :class="$style.courseNum">
                                <!-- <span>已购数量：{{ detail.sales || 0 }}</span> -->
                            </li>
                            <li :class="$style.coursePrice">
                                <template>
                                    <span v-if="isGive || !detail.sellingPrice">免费</span>
                                    <span v-else :class="$style.hasPrice">{{ detail.sellingPrice || 0 }}</span>
                                </template>
                                <span v-if="detail.originalPrice !== detail.sellingPrice" :class="$style.originalPrice">
                                    原价：<span :class="$style.price">{{ detail.originalPrice }}</span>
                                </span>
                            </li>
                            <li :class="$style.courseBuy">
                                <el-button
                                    v-if="isGive"
                                    :disabled="detail.isAuthorize === 1"
                                    type="primary"
                                    @click="$router.push({ name: 'VideoRepositoryBuyNow', query: { isFirstBuy: 1, giveRecordId: detail.giveRecordId } })"
                                >
                                    立即授权
                                </el-button>
                                <el-button
                                    v-else
                                    :disabled="!detail.priceType && !detail.isFirstBuy"
                                    @click="$router.push({ name: 'VideoRepositoryBuyNow', query: { isFirstBuy: Number(detail.isFirstBuy) } })"
                                    type="primary"
                                >
                                    {{ detail.isFirstBuy ? '立即购买': '续费' }}
                                </el-button>
                                <el-button
                                    v-if="detail.supportWatchUrl && detail.courseType === 1"
                                    @click="preview(detail.supportWatchUrl)"
                                >
                                    试看
                                </el-button>
                            </li>
                        </ul>
                    </div>
                    <div :class="$style.courseValidity">
                        使用有效期：
                        <template v-if="isGive">
                            <span v-if="detail.expirationDate">
                                授权后 {{ detail.expirationDate }} 之前可用
                            </span>
                            <span v-else>
                                授权后 {{ detail.validity || 0 }} 天内可使用
                            </span>
                        </template>
                        <span v-else>
                            购买后 {{ detail.validity || 0 }} 天内可使用
                        </span>
                    </div>
                    <div :class="$style.courseBrief" v-if="detail.courseBrief">
                        {{ detail.courseBrief }}
                    </div>
                </div>
                <!-- 仅单课程显示 -->
                <div v-if="detail.courseType === 1" :class="$style.relatedResource">
                    <div :class="$style.hr" />
                    <div :class="$style.title">
                        <span>资源内容</span>
                    </div>
                    <div :class="$style.resourceContent">
                        <el-table key="table-1" :data="resourceRModelList">
                            <el-table-column prop="date" label="封面图">
                                <template #default="{ row }">
                                    <img style="width: 42px; height: 28px" :src="row.courseImg || defaultImg" alt="">
                                </template>
                            </el-table-column>
                            <el-table-column prop="resouceName" label="资源名称" />
                            <el-table-column prop="resourceTime" label="视频时长">
                                <template #default="{ row }">
                                    {{ formatVideoDuration(row.resourceTime) }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="resourceSize" label="文件大小">
                                <template #default="{ row }">
                                    {{ (Number(row.resourceSize) / (1024 * 1024) ).toFixed(2) }} M
                                </template>
                            </el-table-column>
                            <el-table-column prop="resouceSource" label="来源" />
                        </el-table>
                    </div>
                </div>
                <!-- 相关系列课和资源内容 -->
                <div :class="$style.relatedResource" v-if="!(detail.courseType === 1 && resourceEntityList && resourceEntityList.length === 0)">
                    <div :class="$style.hr" />
                    <div :class="$style.title">
                        <span v-if="detail.courseType === 1">相关系列课</span>
                        <span v-else>资源内容（{{ (detail.resourceRModelList && detail.resourceRModelList.length) || 0 }}）</span>
                    </div>
                    <div :class="$style.resourceContent">
                        <!-- 相关系列课 -->
                        <template v-if="detail.courseType === 1">
                            <div @click="target(item.id)" v-for="(item,index) in resourceEntityList" :key="index" :class="$style.seriesLessons">
                                <img :src="item.courseImg || 'https://mallcdn.youpenglai.com/static/plmall/videoDefaul.jpg'" alt="">
                                <span>{{ item.courseName }}</span>
                                <span :class="$style.watch">去看看></span>
                            </div>
                            <div v-if="resourceEntityList && resourceEntityList.length === 0" :class="$style.noContent">
                                暂无相关系列课
                            </div>
                        </template>
                        <!-- 资源内容 -->
                        <template v-else>
                            <el-table key="table-2" :data="resourceRModelList">
                                <el-table-column prop="date" label="封面图">
                                    <template #default="{ row }">
                                        <img style="width: 42px; height: 28px" :src="row.courseImg || defaultImg" alt="">
                                    </template>
                                </el-table-column>
                                <el-table-column prop="lecturer" label="主讲人">
                                    <template #default="{ row }">
                                        {{ row.lecturer || '无' }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="resouceName" label="资源名称" />
                                <el-table-column prop="resourceTime" label="视频时长">
                                    <template #default="{ row }">
                                        {{ formatVideoDuration(row.resourceTime) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="resourceSize" label="文件大小">
                                    <template #default="{ row }">
                                        {{ (Number(row.resourceSize) / (1024 * 1024) ).toFixed(2) }} M
                                    </template>
                                </el-table-column>
                                <el-table-column prop="resouceSource" label="来源" />
                                <el-table-column prop="date" label="操作">
                                    <template #default="{ row }">
                                        <el-button @click="target(row.supportOnlyBuyCourseId)" v-if="row.supportOnlyBuyCourseId">
                                            单课购买
                                        </el-button>
                                        <el-button @click="preview(row.resouceUrl)" v-if="row.supportWatch">
                                            点击试看
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                        <div v-if="hasMore" :class="$style.more">
                            <div :class="$style.button" @click="expand = !expand">
                                <span>{{ !expand ? '查看更多': '收起' }}</span>
                                <pl-svg :class="{ [$style.icon]: expand }" name="icon-sanjiao" width="9" />
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 课程详情 -->
                <div :class="$style.courseDetail">
                    <div :class="$style.hr" />
                    <div :class="$style.courseDetailContent">
                        <div :class="$style.tabs">
                            <span :class="{ [$style.focus]:tab === 'detail' }" @click="tab = 'detail'">课程详情</span>
                            <span :class="{ [$style.focus]:tab === 'explain' }" @click="tab = 'explain'">订购须知</span>
                            <!-- 课程详情 -->
                            <div v-if="tab === 'detail'" v-html="detail.courseDetail || '暂无内容'" :class="$style.tabContent" />
                            <!-- 订购须知 -->
                            <div v-else :class="$style.tabContent">
                                <!-- 单课 -->
                                <ul :class="$style.orderNotice" v-if="detail.courseType === 1">
                                    <li>1.该课程资源为单课课程，您未订购该课程资源时，可点击试看，查看视频试看片段的内容。</li>
                                    <li>2.您付费购买课程资源后，该课程资源相关的视频资源将自动放入您的视频库中，根据购买的视频资源的使用时间内进行使用。</li>
                                    <li>3.{{ notice }}</li>
                                    <li>4.如果您购买课程资源的使用有效期已过期，则您需要提前进行续费操作，否则您已购买的视频资源将在过期后，自动从您的视频库删除。</li>
                                    <li>5.购买的课程资源续费后，则该课程的视频资源使用有效期将自动进行时间累加。</li>
                                    <li>6.购买的视频资源，均可在互动直播的录播和知识课程中的单课和系列课中选择使用。</li>
                                    <li>7.如果因您未及时续费，造成用户购买后无法正常观看视频的情况，您需自行承担责任。</li>
                                    <li>8.课程资源中视频资源内容的版权归我们所有，所有视频资源不支持下载，如果您通过其他方式将视频进行下载，将侵犯视频的使用版权</li>
                                </ul>
                                <!-- 系列课 -->
                                <ul :class="$style.orderNotice" v-else>
                                    <li>1.该课程资源为系列课程，您未订购该系列课时，可点击试看，查看支持试看的视频片段。</li>
                                    <li>2.您付费购买系列课后，该系列课相关的视频资源将自动放入您的视频库中，根据购买的视频资源的使用时间内进行使用。</li>
                                    <li>3.{{ notice }}</li>
                                    <li>4.如果您购买的系列课资源的使用有效期已过期，则您需要提前进行续费操作，否则您已购买的视频资源将在过期后，自动从您的视频库中删除。</li>
                                    <li>5.购买的系列课资源续费后，则所有视频资源的有效期将在自动进行时间的累加。</li>
                                    <li>6.购买的视频资源，均可在互动直播的录播和知识课程中的单课和系列课中选择使用。</li>
                                    <li>7.如果因您未及时续费，造成用户购买后无法正常观看视频的情况，您需自行承担责任。</li>
                                    <li>8.系列课中视频资源内容的版权归我们所有，所有视频资源不支持下载，如果您通过其他方式将视频进行下载，将侵犯视频的的使用版权。</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--预览视频-->
            <VideoPreview :show.sync="videoShow" :src="videoSrc" />
        </div>
    </div>
</template>

<script>
import VideoPreview from './../../../../../../components/common/Preview-Video'
import { getRepositoryDetail } from './../../../../../../apis/product-center/line-teaching/repository'
export default {
    name: 'VideoRepositoryDetail',
    components: {
        VideoPreview
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            tab: 'detail',
            videoShow: false,
            videoSrc: '',
            expand: false,
            detail: {
                tags: [],
                resourceRModelList: [],
                resourceEntityList: []
            }
        }
    },
    async activated () {
        try {
            await this.getRepositoryDetail()
        } catch (e) { throw e }
    },
    deactivated () {
        this.expand = false
    },
    methods: {
        formatVideoDuration (seconds) {
            if (seconds === '') {
                return '/'
            } else if (seconds < 60) {
                return `${ seconds } 秒`
            } else if (seconds % 60 === 0) {
                return `${ seconds / 60 } 分钟`
            }
            return `${ parseInt(seconds / 60) } 分钟 ${ seconds % 60 } 秒`
        },
        preview (url) {
            this.videoSrc = url
            this.videoShow = true
        },
        async target (id) {
            try {
                this.expand = false
                this.$router.push({ name: 'VideoRepositoryDetail', params: { id } })
            } catch (e) { throw e }
        },
        async getRepositoryDetail () {
            try {
                const { giveRecordId } = this.$route.query
                const { result } = await getRepositoryDetail({
                    id: this.id,
                    giveRecordId
                })
                this.detail = result
            } catch (e) { throw e }
        }
    },
    computed: {
        isGive () {
            return this.detail.giveRecordId !== '0'
        },
        defaultImg () {
            return this.detail.courseImg || 'https://mallcdn.youpenglai.com/static/plmall/videoDefaul.jpg'
        },
        hasMore () {
            // 单课
            if (this.detail.courseType === 1) {
                return this.detail.resourceEntityList && this.detail.resourceEntityList.length > 10
            }
            return this.detail.resourceRModelList && this.detail.resourceRModelList.length > 10
        },
        resourceEntityList () {
            return this.expand ? this.detail.resourceEntityList : this.detail.resourceEntityList.slice(0, 10)
        },
        resourceRModelList () {
            return this.expand ? this.detail.resourceRModelList : this.detail.resourceRModelList.slice(0, 10)
        },
        notice () {
            const { expirationDate, validity } = this.detail
            if (expirationDate) {
                return `该视频的使用有效期为 ${ expirationDate } 前，则使用有效期从您购买时间开始计算， ${ expirationDate } 前均可正常使用。`
            }
            return `该视频的使用有效期为购买后的 ${ validity || 0 } 天，则使用有效期从您购买时间开始计算， ${ validity || 0 } 天内均可正常使用。`
        }
    }
}
</script>

<style module lang='scss'>

.detail-container {
    > .content {
        padding: 20px 80px;
        box-sizing: border-box;
        .hr {
            height: 1px;
            background-color: #e7e7e7;
        }
        > .detail {
            box-shadow: 0 3px 8px rgba(44,48,58,.08);
            > .head {
                padding: 20px 30px;
                box-sizing: border-box;
                font-size: 14px;
                background-color: #fbfbfb;
            }
            > .description {
                width: 882px;
                padding: 30px;
                > .course {
                    display: flex;
                    position: relative;
                    justify-content: flex-end;
                    height: 267px;
                    > .courseType {
                        position: absolute;
                        z-index: 2;
                        top: 0;
                        left: 0;
                        padding: 0 4px;
                        line-height: 25px;
                        text-align: center;
                        font-size: 18px;
                        color: #ff3323;
                        background-color: #efe0c3;
                    }
                    > img {
                        position: absolute;
                        left: 0;
                        width: 400px;
                        height: 100%;
                    }
                    > .course-content {
                        display: flex;
                        flex-wrap: wrap;
                        width: calc(100% - 430px);
                        > li {
                            width: 100%;
                            .original-price {
                                margin-left: 10px;
                                font-size: 12px;
                                color: #999;
                                text-decoration: line-through;
                                .price {
                                    &:before {
                                        content: '￥';
                                        font-family: Microsoft YaHei;
                                    }
                                }
                            }
                        }
                        > .course-name {
                            display: flex;
                            position: relative;
                            align-items: center;
                            font-size: 24px;
                            font-weight: bold;
                            > .give {
                                display: inline-block;
                                padding: 0 8px;
                                margin-right: 4px;
                                line-height: 25px;
                                font-size: 14px;
                                color: #fff;
                                background-color: #ec742e;
                            }
                        }
                        > .course-tag {
                            display: flex;
                            flex-wrap: wrap;
                            justify-content: space-between;
                            margin: 10px 0;
                            > span {
                                height: 30px;
                                padding: 0 26px;
                                margin-bottom: 5px;
                                border: 1px solid #ec742e;
                                line-height: 30px;
                                color: #ec742e;
                            }
                        }
                        > .course-num {
                            > span {
                                display: block;
                                font-size: 16px;
                                &:nth-of-type(1) {
                                    margin-bottom: 5px;
                                }
                            }
                        }
                        > .course-price {
                            font-size: 36px;
                            font-weight: bold;
                            color: #ec742e;
                            > .has-price::before {
                                position: relative;
                                top: -4px;
                                content: '￥';
                                font-size: 18px;
                            }
                        }
                        > .course-buy {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-end;
                            > button {
                                width: 280px;
                                height: 48px;
                                &:nth-of-type(2) {
                                    width: 160px;
                                }
                            }
                        }
                    }
                }
                > .course-validity {
                    margin: 24px 0;
                    font-size: 18px;
                    font-weight: bold;
                    > span {
                        color: #ec742e;
                    }
                }
                > .course-brief {
                    padding: 24px;
                    box-sizing: border-box;
                    background-color: #f8f8f8;
                }
            }
            > .related-resource {
                box-sizing: border-box;
                margin: 0 0 24px 0;
                padding-left: 30px;
                > .title {
                    margin-top: 24px;
                    font-size: 18px;
                    font-weight: bold;
                }
                > .resource-content {
                    margin: 16px 30px 0 0;
                    border: 1px solid #ccc;
                    > .series-lessons {
                        display: flex;
                        align-items: center;
                        padding: 12px;
                        border-bottom: 1px solid #e7e7e7;
                        font-size: 18px;
                        font-weight: bold;
                        cursor: pointer;
                        &:hover {
                            background-color: #eef7ff;
                        }
                        > img {
                            width: 88px;
                            height: 60px;
                            margin-right: 16px;
                        }
                        > .watch {
                            margin-left: 32px;
                            font-size: 14px;
                            font-weight: normal;
                            color: #598bf8;
                        }
                        &:nth-last-of-type(1) {
                            border-bottom: 0;
                        }
                    }
                    > .noContent {
                        padding: 12px;
                        text-align: center;
                    }
                    > .more {
                        display: flex;
                        justify-content: center;
                        box-sizing: border-box;
                        padding: 16px;
                        > .button {
                            display: flex;
                            align-items: center;
                            cursor: pointer;
                            > span {
                                margin-right: 6px;
                            }
                            > .icon {
                                transform: rotate(180deg);
                            }
                        }
                    }
                }
            }
            > .course-detail {
                box-sizing: border-box;
                padding: 0 0 0 30px;
                > .course-detail-content {
                    margin-top: 24px;
                    > .tabs {
                        > span {
                            display: inline-block;
                            position: relative;
                            margin-right: 32px;
                            padding-bottom: 13px;
                            font-size: 18px;
                            cursor: pointer;
                            &.focus {
                                font-weight: bold;
                                &:before {
                                    content: '';
                                    position: absolute;
                                    left: 0;
                                    bottom: 0;
                                    width: 100%;
                                    height: 3px;
                                    background-color: #000;
                                }
                            }
                        }
                        .tab-content {
                            box-sizing: border-box;
                            margin-right: 30px;
                            padding: 24px;
                            border: 1px solid #ccc;
                            > .order-notice {
                                > li {
                                    margin-bottom: 10px;
                                    &:nth-last-of-type(1) {
                                        margin-bottom: 0;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

</style>
