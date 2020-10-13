<template>
    <div class="banner" :class="$style.banner">
        <swiper
            :class="$style.swiper"
            v-if="data.values.filter(item => item.image).length"
            :options="swiperOption"
        >
            <swiperSlide
                :class="$style.swiperBanner"
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
            </swiperSlide>
            <div class="swiper-pagination" slot="pagination" />
        </swiper>
        <swiper :class="$style.swiper" v-else :options="swiperOption">
            <swiperSlide>
                <img
                    v-imgError
                    :src="defaultImg"
                    width="100%"
                    height="100%"
                >
            </swiperSlide>
            <div v-show="data.values.length > 1" class="swiper-pagination" slot="pagination" />
        </swiper>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import defaultData from '../../utils/template-default-data/basic'
import { TemplateModule } from '../../utils/types'
import { TemplateTypes } from '../../utils/map'

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
    }) readonly tmplType!: number

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
        const src = this.tmplType === TemplateTypes.TemplateB2 ? banner : Banner
        return src
    }
}
</script>

<style lang="scss">
.banner {
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
}
</style>
<style module lang="scss">
.swiper {
    height: 235px;
    border-radius: 10px;
    overflow: hidden;
    &-banner {
        background: #fff;
    }
}

</style>
