<template>
    <div class="banner">
        <Swiper
            class="swiper"
            v-if="data.values.filter(item => item.image).length"
            :options="swiperOption"
        >
            <SwiperSlide
                class="swiper-banner"
                v-for="(banner, i) in data.values.filter(item => item.image)"
                :key="i"
            >
                <img
                    v-imgError
                    v-if="banner.image"
                    :src="banner.image"
                    width="100%"
                    height="100%"
                >
            </SwiperSlide>
            <div class="swiper-pagination" slot="pagination" />
        </Swiper>
        <Swiper class="swiper" v-else :options="swiperOption">
            <SwiperSlide>
                <img
                    v-imgError
                    :src="defaultImg"
                    width="100%"
                    height="100%"
                >
            </SwiperSlide>
            <div v-show="data.values.length > 1" class="swiper-pagination" slot="pagination" />
        </Swiper>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../utils/types'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import defaultData from '../../utils/template-default-data/basic'

@Component({
    components: {
        swiper,
        swiperSlide
    }
})
export default class Banner extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    @Prop({
        type: Number,
        default: 0
    }) readonly tmplId!: number

    /* data */
    swiperOption = {
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 6,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        loop: true
    }

    /* computed */
    get defaultImg () {
        const { Banner } = defaultData
        const banner = 'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/2.0.0/d12-banner.png'
        const src = this.tmplId === 4 ? Banner : banner
        return src
    }
}
</script>

<style lang="scss">
.banner {
    .swiper {
        height: 235px;
        border-radius: 10px;
        overflow: hidden;
        .swiper-banner {
            background: #fff;
        }
    }
    .swiper-pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        width: auto;
        height: 10px;
        margin: auto;
        background-color: rgba(0,0,0,.1);
        border-radius: 5px;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        bottom: 8px;
        .swiper-pagination-bullet {
            opacity: 1;
            width: 5px;
            height: 5px;
            background: #ccc;
            &.swiper-pagination-bullet-active {
                background-color: #fff;
            }
            &:nth-last-of-type(1) {
                margin-right: 0;
            }
        }
    }
    .temp-swiper {
        background: #f9f9f9;
        height: 150px;
        padding-top: 30px;
        border-radius: 4px;
        text-align: center;
        .swiper-tip {
            font-size: 12px;
            text-align: center;
            color: #999;
        }
    }
}

</style>
