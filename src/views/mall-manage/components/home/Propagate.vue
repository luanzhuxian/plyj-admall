<template>
    <div :class="$style.propagate">
        <div :class="$style.top">
            <img :src="data.otherValue" :alt="data.values[0].mallName" v-if="data.otherValue">
            <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/45860979-6267-4f90-be7b-57e54ebd591b.png" v-else>
            <div :class="$style.name">
                <span>{{ data.values[0].mallName }}</span>
                <i class="el-icon-arrow-right" />
            </div>
        </div>
        <div :class="$style.middle">
            <div :class="$style.logo">
                <img
                    v-imgError
                    v-if="data.values[0].mallLogo"
                    :src="data.values[0].mallLogo + '?x-oss-process=style/thum-small'"
                >
            </div>
            <div :class="$style.intro" v-if="data.values[0].mallDesc">
                {{ data.values[0].mallDesc }}
            </div>
        </div>
        <div :class="$style.bottom" v-if="isBrandInfoShow">
            <label>教育特色：</label>
            <div :class="$style.labels">
                <span :class="$style.label" v-for="(item, i) of data.values[0].mallBrandingRequestModels.filter(item => item.titleName)" :key="i">
                    {{ item.titleName }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../utils/types'

@Component
export default class Propagate extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* computed */
    get isBrandInfoShow () {
        return this.data.show === 1 &&
        this.data.values[0].mallBrandingRequestModels &&
        this.data.values[0].mallBrandingRequestModels.length &&
        this.data.values[0].mallBrandingRequestModels.filter(item => item.titleName).length
    }
}
</script>

<style module lang="scss">
  .propagate {
    background: #FFF;
    border-radius: 10px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .el-icon-arrow-right {
      font-size: 16px;
      &::before {
        color: #FFF;
      }
    }
    .top {
      position: relative;
      height: 185px;
      overflow: hidden;
      .name {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        padding: 0 12px 0 97px;
        line-height: 24px;
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold;
        font-weight: bold;
        color: #FFFFFF;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%);
        span {
          flex: 1;
          width: 0;
          @include elps();
        }
      }
    }
    .middle {
      position: relative;
      box-sizing: content-box;
      height: 40px;
      padding: 6px 12px 0 97px;
      .intro {
        font-size: 12px;
        line-height: 18px;
        color: #999999;
        @include elps();
      }
    }
    .logo {
      position: absolute;
      left: 25px;
      top: 0;
      right: 0;
      transform: translateY(-55%);
      box-sizing: border-box;
      width: 60px;
      height: 60px;
      background: #EDEDED;
      border: 1px solid #F2D04A;
      border-radius: 50%;
      overflow: hidden;
    }
    .bottom {
      padding: 12px 15px 15px;
      margin-bottom: -8px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      font-size: 12px;
      line-height: 18px;
      color: #666666;
      border-top: 1px solid #D8D8D8;
      .labels {
        flex: 1;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
      .label {
        margin-left: 8px;
        margin-bottom: 8px;
        padding: 0 10px;
        height: 25px;
        line-height: 25px;
        background: #F2F4F5;
        border-radius: 50px;
        font-size: 12px;
        color: #999999;
      }
    }
  }
</style>
