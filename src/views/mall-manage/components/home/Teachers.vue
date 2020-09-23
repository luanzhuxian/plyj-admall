<template>
    <div :class="$style.teachers">
        <Swiper v-if="data.values.length" :options="swiperOption">
            <SwiperSlide v-for="(item, i) of data.values" :key="i">
                <li :class="$style.listItem">
                    <div :class="$style.imgWrapper">
                        <img v-imgError :src="item.image ? item.image : 'https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/162bff67-ab61-427b-8470-be7674f6058d.png'" alt="">
                        <p :class="$style.name" v-text="item.name ? item.name : '教师名称'" />
                    </div>
                    <div :class="$style.info">
                        <p :class="$style.main" v-text="item.value ? item.value : '主讲课程'" />
                        <p :class="$style.intro">
                            简介：{{ item.valueName ? item.valueName : '' }}
                        </p>
                    </div>
                </li>
            </SwiperSlide>
        </Swiper>

        <ul :class="$style.list" v-else>
            <li :class="$style.listItem" v-for="(item, i) of 3" :key="i">
                <div :class="$style.imgWrapper">
                    <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/162bff67-ab61-427b-8470-be7674f6058d.png" alt="">
                    <p :class="$style.name">
                        Wendy老师
                    </p>
                </div>
                <div :class="$style.info">
                    <p :class="$style.main">
                        英语高级教师
                    </p>
                    <p :class="$style.intro">
                        简介：留学硕士，诙谐睿智，热爱外语教学，课堂上注重多元互动，因材施教，深入浅出，真正做到快乐学习。
                    </p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../utils/types'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

@Component({
    components: {
        swiper,
        swiperSlide
    }
})
export default class Teachers extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* data */
    swiperOption = {
        slidesPerView: 3,
        spaceBetween: 5,
        grabCursor: true
    }
}
</script>

<style module lang="scss">
.teachers {
  .list {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }
  .list-item {
    width: 112px;
    border-radius: 10px;
    overflow: hidden;
    font-size: 12px;
    font-family: Microsoft YaHei;
  }
  .img-wrapper {
    position: relative;
    height: 112px;
    overflow: hidden;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .name {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    padding: 0 5px;
    height: 21px;
    line-height: 21px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
    color: #FFF;
    @include elps();
  }
  .info {
    box-sizing: border-box;
    padding: 7px 5px;
    background: #FFF;
    color: #7B7B7B;
    height: 82px;
  }
  .main {
    color: #000;
    line-height: 13px;
    font-weight: bold;
    @include elps();
  }
  .intro {
    margin-top: 5px;
    @include elps-wrap(3);
  }
}
</style>
