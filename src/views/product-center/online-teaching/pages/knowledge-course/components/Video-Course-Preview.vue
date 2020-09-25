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
        <div class="fields" v-if="data.lecturer">
            <pl-svg name="icon-lecturer-132fb" fill="#999" width="16" class="mr-10" />
            主讲人： <span>{{ data.lecturer }}</span>
        </div>
        <div class="fields">
            <pl-svg name="icon-riqi" fill="#999" width="16" class="mr-10" />
            有效期：
            <span class="time">
                <template v-if="data.validityType === 0">购买后不限观看次数</template>
                <template v-else>
                    {{ data.validity ? `购买后${data.validity}天内学完` : `购买后${data.validityDate && data.validityDate.split(' ')[0] }前可免费观看学习` }}
                </template>
            </span>
        </div>
        <div class="details" v-if="data.details">
            <div class="title">
                <span>课程介绍</span>
            </div>
            <div class="desc pl-pr-10" v-html="data.details" />
        </div>
        <div class="pay-notice">
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
import Preview from '../../../../../../components/common/Preview.vue'
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
            tab: 2
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
    computed: {},
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
        background-color: #fff;
        text-align: center;
        line-height: 65px * $em;
        span {
            display: inline-block;
            margin-bottom: 6px* $em;
            padding: 3px* $em;
            border-bottom: 2px solid #000;
            font-size: 24px* $em;
            font-weight: 600;
        }
    }
    .desc {
        padding: 10px;
        margin-top: 20px* $em;
        background-color: #fff;
    }
}
.pay-notice {
    width: 100%;
    margin-top: 30px* $em;
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
