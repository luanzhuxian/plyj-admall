<template>
    <Preview :show="show" @close="close">
        <div class="header" />
        <div class="course-info">
            <div class="banner">
                <img :src="mainImg" alt="">
            </div>
            <div class="selling-price pl-pr-10">
                <span>￥</span>{{ data.priceType === 1 ? data.sellingPrice : 0 }}
            </div>
            <div v-if="data.originalPrice > data.sellingPrice" class="original-price pl-pr-10">
                原价 <span>￥{{ data.originalPrice }}</span>
            </div>
            <div class="course-name pl-pr-10">
                {{ data.graphicName }}
            </div>
            <div class="course-brief pl-pr-10">
                {{ data.graphicBrief }}
            </div>
        </div>
        <div class="fields-author" v-if="data.author">
            <div>
                <pl-svg name="icon-lecturer-132fb" fill="#999" width="16" class="mr-10" />
                作者： <span>{{ data.author }}</span>
            </div>
        </div>
        <div class="detai-tabs">
            <div class="tabs">
                <div
                    @click="tabvalue = 1"
                    :class="{ 'active-tab': tabvalue === 1 }"
                >
                    详情资料
                </div>
                <div
                    @click="tabvalue = 2"
                    :class="{ 'active-tab': tabvalue === 2 }"
                >
                    图文资料
                </div>
            </div>
            <div class="content">
                <div
                    class="details"
                    v-show="tabvalue === 1"
                    v-html="data.details"
                />
                <ul v-show="tabvalue === 2" class="image-text-list">
                    <li class="image-text-list-item" v-for="(item, index) of data.graphicPdfs" :key="index">
                        <pl-svg
                            name="icon-pdf-8edfa"
                            width="16"
                        />
                        <p>
                            <i v-text="item.name" />
                        </p>
                        <div class="image-text-list-button">
                            购买后可查看
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="pay-notice">
            <div class="pay-notice-title">
                订购须知
            </div>
            <div class="pay-notice-content" v-html="data.payNotice && data.payNotice.replace(/\n/g, '<br>')" />
        </div>
    </Preview>
</template>
<script>
import Preview from './../../../../../../components/common/Preview.vue'
export default {
    name: 'BooksMaterialsPreview',
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
            tabvalue: 1
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
    computed: {
        mainImg () {
            return this.data.graphicMainImg || (this.data.graphicImgs ? this.data.graphicImgs[0] : '')
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
    background-color: #fff;
    color: #999;
    span {
        font-size: 24px * $em;
        color: #000;
    }
}
.fields-author {
    display: flex;
    align-items: center;
    height: 88px * $em;
    padding: 0 24px * $em;
    background-color: #fff;
    color: #999;
    > div {
        width: 100vw;
        padding: 20px* $em 20px* $em 20px* $em 0;
        border-top: 1px solid #e7e7e7;
    }
    span {
        font-size: 24px * $em;
        color: #000;
    }
}
.time {
    width: 400px* $em;
    @include elps();
}
.detai-tabs {
    margin-top: 20px* $em;
    background-color: #fff;
    > .tabs {
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-bottom: 1px* $em solid #e7e7e7;
        > div {
            width: max-content;
            font-size: 26px* $em;
            color: #999;
            height: 90px* $em;
            line-height: 90px* $em;
            box-sizing: border-box;
            font-weight: bold;
            &.active-tab {
                color: #000;
                border-bottom: 2px* $em solid #000;
            }
        }
    }
    .content {
        .details {
            padding: 40px* $em 20px* $em;
        }
        .image-text-list {
            padding: 0 30px* $em;
            background-color: #fff;
            &-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 10px* $em;
                height: 120px* $em;
                line-height: 32px* $em;
                font-size: 24px* $em;
                color: #666;
                border-bottom: 2px* $em solid #f0f0f0;
                &:nth-last-child(1) {
                    border-bottom: none;
                }
                > p {
                    display: flex;
                    flex: 1;
                    width: 0;
                    padding: 0 20px* $em;
                    @include elps();
                    > i {
                        @include elps();
                    }
                }
            }
            &-button {
                margin-left: 10px* $em;
                color: #666;
            }
        }
    }
}
.pay-notice {
    margin-top: 20px* $em;
    padding: 0 24px* $em;
    background-color: #fff;
    .pay-notice-title {
        line-height: 100px* $em;
        color: #000;
        font-size: 32px* $em;
        font-weight: bold;
        border-bottom: 1px solid #e7e7e7;
    }
    .pay-notice-content {
        width: 100%;
        padding: 40px* $em 0 48px* $em 0;
        font-size: 28px* $em;
        line-height: 45px* $em;
        word-break: break-all;
        white-space: pre-wrap;
        color: #666;
    }
}

</style>
