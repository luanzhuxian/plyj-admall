<template>
    <Preview :show="show" @close="close">
        <div class="header" />
        <div class="course-info">
            <div class="banner">
                <img :src="data.courseImg || data.courseMainImg" alt="">
            </div>
            <div class="selling-price pl-pr-10">
                <span>￥</span>{{ data.priceType === 1 ? data.sellingPrice : 0 }}
            </div>
            <div v-if="data.originalPrice > data.sellingPrice" class="original-price pl-pr-10">
                原价 <span>￥{{ data.originalPrice }}</span>
            </div>
            <div class="course-name pl-pr-10">
                {{ data.courseName }}
            </div>
            <div class="course-brief pl-pr-10">
                {{ data.courseBrief }}
            </div>
        </div>
        <div class="fields">
            <pl-svg name="icon-riqi" fill="#999" width="16" class="mr-10" />
            有效期：
            <span class="time">
                <template v-if="data.validityType === 0">购买后不限观看次数</template>
                <template v-else>
                    {{ data.validity ? `购买后${data.validity}天内学完` : `购买后${ data.validityDate && data.validityDate.split(' ')[0] }前可免费观看学习` }}
                </template>
            </span>
        </div>
        <div class="details">
            <div class="title">
                <span v-if="data.details" @click="activeTab = 1" :class="activeTab === 1 ? 'active' : ''">课程介绍</span>
                <span @click="activeTab = 2" :class="activeTab === 2 ? 'active' : ''">目录</span>
            </div>
            <div v-show="activeTab === 1" class="desc pl-pr-10" v-html="data.details" />
            <div v-show="activeTab === 2" class="directory">
                <div class="count">
                    知识内容({{ data.allLiveInfo && data.allLiveInfo.length }})
                    <span>持续更新中</span>
                </div>
                <div
                    :class="['item', item.liveId ? 'hasLogo' : '']"
                    v-for="(item, index) of data.allLiveInfo" :key="index"
                >
                    <img :src="item.lessonsImg || data.courseImg" alt="">
                    <div class="course-info">
                        <div class="course-name">
                            第{{ index + 1 }}节{{ item.lessonsTiltle }}
                        </div>
                        <div v-if="item.lecturer" class="lecturer">
                            主讲人: {{ item.lecturer }}
                        </div>
                        <div :class="['live-info', item.lecturer ? '' : 'large-mt']">
                            <template v-if="item.liveId">
                                <span>
                                    <template v-if="item.resourceTime > 60" class="mr-10">{{ (item.resourceTime - item.resourceTime % 60) / 60 }}分{{ item.resourceTime % 60 }}秒</template>
                                    <template v-else class="mr-10">{{ item.resourceTime }}秒</template>
                                </span>
                                <span>{{ Math.floor(Math.random() * 100) }}观看</span>
                                <span>学习0%</span>
                            </template>
                            <span v-else class="no-content">暂未开始   敬请期待</span>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    课程内容{{ data.updateTime | dateFormat('YYYY.MM.DD ') }}已更新，请及时查看学习~
                </div>
            </div>
        </div>
        <div class="pay-notice" v-show="activeTab === 1">
            <div class="pay-notice-title">
                订购须知
            </div>
            <div class="pay-notice-content">
                <div class="desc pl-pr-10" v-html="data.payNotice && data.payNotice.replace(/\n/g, '<br>')" />
            </div>
        </div>
    </Preview>
</template>
<script>
import Preview from './../../../../../../components/common/Preview'
export default {
    name: 'VideoCoursePreview',
    components: {
        Preview
    },
    data () {
        return {
            swiperOption: {
                autoplay: true,
                pagination: {
                    el: '.swiper-pagination'
                }
            },
            activeTab: 1 // 1-详情介绍, 2-目录
        }
    },
    props: {
        show: Boolean,
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    watch: {
        show (val) {
            if (val) {
                this.activeTab = this.data.details ? 1 : 2
            }
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>
<style scoped lang="scss">
$em: 330 / 750;
.header {
    height: 76px * $em;
    background: url('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/base/page-top1.png');
    background-size: 100%;
}
.course-info {
    background-color: #fff;
}
.pl-pr-10 {
    padding: 0 10px;
}
.banner img {
    width: 100%;
    height: 500px * $em;
    object-fit: cover;
}
.selling-price {
    font-size: 24px* $em;
    color: #fe7700;
    span {
        font-size: 12px* $em;
    }
}
.original-price {
    margin-top: 10px* $em;
    font-size: 14px* $em;
    color: #999;
    span {
        text-decoration: line-through;
    }
}
.course-name {
    margin-top: 15px* $em;
    font-size: 24px* $em;
    line-height: 36px* $em;
    font-weight: 800;
    color: #000;
}
.course-brief {
    margin-top: 10px* $em;
    padding-bottom: 20px* $em;
    font-size: 16px* $em;
    color: #666;
}
.fields {
    display: flex;
    align-items: center;
    height: 88px * $em;
    padding: 0 24px * $em;
    margin-top: 20px * $em;
    background-color: #fff;
    color: #999;
    span {
        font-size: 16px * $em;
        color: #000;
    }
}
.time {
    width: 400px* $em;
    @include elps();
}
.details {
    margin-top: 20px* $em;
    ::v-deep img {
        width: 100% !important;
    }
    .title {
        display: flex;
        margin-bottom: 3px* $em;
        justify-content: space-around;
        align-items: center;
        background-color: #fff;
        span {
            margin-bottom: 6px* $em;
            padding: 3px* $em;
            line-height: 45px* $em;
            font-size: 24px* $em;
            font-weight: 600;
            color: #999;
            &.active {
                border-bottom: 2px solid #000;
                color: #000;
            }
        }
    }
    .desc {
        padding: 10px;
        background-color: #fff;
    }
}
.directory {
    .count {
        margin-bottom: 18px* $em;
        padding: 0 24px * $em;
        line-height: 80px* $em;
        background-color: #fff;
        color: #666;
        > span {
            margin-left: 36px* $em;
            color: #999;
        }
    }
    .item {
        display: flex;
        position: relative;
        margin: 36px* $em 0;
        border-bottom: 2px* $em solid #e7e7e7;
        border-radius: 30px* $em;
        overflow: hidden;
        &.hasLogo:before {
            content: '视频课';
            position: absolute;
            top: 0;
            left: 0;
            width: 100px* $em;
            height: 46px* $em;
            border-radius: 20px* $em 0 20px* $em 0;
            background: #f2b036;
            color: #fff;
        }
        img {
            width: 280px* $em!important;
            height: 186px* $em;
            object-fit: cover;
        }
        .course-info {
            width: 412px* $em;
            padding-left: 12px* $em;
            .course-name {
                @include elps();
            }
            .lecturer {
                margin-top: 16px* $em;
                line-height: 36px* $em;
                font-size: 24px* $em;
                color: #666;
                @include elps();
            }
            .live-info {
                margin-top: 42px* $em;
                line-height: 34px* $em;
                color: #666;
                &.large-mt {
                    margin-top: 94px* $em;
                }
                @include elps();
                span {
                    margin-right: 24px* $em;
                    font-size: 24px* $em;
                    color: #999;
                }
                .no-content {
                    font-size: 26px* $em;
                    color: #f2b036;
                }
            }
        }
    }
}
.bottom {
    font-size: 24px* $em;
    text-align: center;
    color: #828282;
}
.pay-notice {
    width: 100%;
    margin-top: 20px* $em;
    background-color: #fff;
}
.pay-notice-title {
    border-bottom: 1px* $em solid #eee;
    font-size: 40px* $em;
    line-height: 80px* $em;
    text-align: center;
    color: #2e2e2e;
}
.pay-notice-content {
    padding: 20px* $em;
    line-height: 40px* $em;
}

</style>
