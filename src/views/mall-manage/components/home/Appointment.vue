<template>
    <div
        class="appointment"
        :class="{
            [$style.appointment]: true,
            [$style.orangeStyle]: styleType === 2
        }"
        :style="{
            '--height': (slidesPerView * 20) + 'px'
        }"
    >
        <PlSvg v-if="styleType === 1" name="icon-gift" width="35" height="25" />
        <div :class="$style.content">
            <div :class="$style.left">
                <PlSvg name="icon-yuyueli" width="47" height="26" :fill="styleType === 1 ? '' : '#FFF'" />
            </div>
            <div :class="$style.middle">
                <Swiper :options="swiperOption">
                    <SwiperSlide
                        :class="$style.swiperNoSwiping"
                        v-for="(item, index) of data.values.filter(item => item.value)"
                        :key="index"
                    >
                        <p :class="$style.text">
                            {{ item.value }}
                        </p>
                    </SwiperSlide>
                </Swiper>
            </div>
            <div :class="$style.right">
                <span>立即预约</span>
                <i class="el-icon-arrow-right" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { TemplateModule } from '../../utils/types'

@Component({
    components: {
        swiper,
        swiperSlide
    }
})
export default class Appointment extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    @Prop({
        type: Number,
        default: 1
    }) readonly slidesPerView!: number

    @Prop({
        type: Number,
        default: 1
    }) readonly styleType!: number

    /* data */
    swiperOption = {
        direction: 'vertical',
        autoplay: {
            delay: 2000
        },
        speed: 1000,
        slidesPerView: this.slidesPerView,
        slidesPerGroup: 1,
        loop: this.data.values.filter(item => item && item.value).length > this.slidesPerView,
        noSwiping: true
    }
}
</script>

<style module lang="scss">
.appointment {
    .swiper-container {
        height: var(--height);
    }
}
</style>

<style module lang="scss">
  .appointment {
    > svg {
      position: absolute;
      top: 6px;
      left: 12px;
      width: 47px;
      height: 32px;
    }
    .content {
      padding: 10px 0;
      display: flex;
      align-items: center;
      background: linear-gradient( 90deg, rgba(254, 239, 209, 1) 0%, rgba(231, 215, 156, 1) 100%);
      border-radius: 10px;
      overflow: hidden;
    }
    .left {
      display: flex;
      align-items: center;
      padding: 0 12px;
      height: 17px;
      border-right: 2px solid #F0CD80;
    }
    .middle {
      flex: 1;
      padding: 0 12px;
      font-size: 14px;
      line-height: 20px;
      color:#AB8F58;
      overflow: hidden;
      .text {
        @include elps();
      }
    }
    .right {
      padding-right: 12px;
      font-size: 12px;
      line-height: 17px;
      color: #7E6E4D;
      > i {
        font-size: 16px;
        font-weight: bold;
        vertical-align: bottom;
        &::before {
            color: #7E6E4D;
        }
      }
    }
    &.orange-style {
      .content {
        padding: 18px 0;
        background: linear-gradient(180deg, rgba(250,133,57,1) 0%, rgba(246,77,27,1) 100%);
      }
      .left {
        border-right: 2px solid #FFF;
      }
      .middle {
        color: #FFF;
      }
      .right {
        color: #FFD4BA;
        > i {
            &::before {
                color: #FFD4BA;
            }
        }
      }
    }
  }
</style>
