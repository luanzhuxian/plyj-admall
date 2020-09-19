<template>
    <div :class="$style.propagateSmall">
        <div
            :class="$style.top"
            :style="{ paddingBottom: isBrandInfoShow ? '12px' : '0' }"
        >
            <div :class="$style.left">
                <div :class="$style.name" v-if="data.values[0].mallName">
                    {{ data.values[0].mallName }}
                </div>
                <p :class="$style.intro" v-if="data.values[0].mallDesc">
                    {{ data.values[0].mallDesc }}
                </p>
            </div>
            <div :class="$style.logo">
                <img
                    v-imgError
                    v-if="data.values[0].mallLogo"
                    :src="data.values[0].mallLogo + '?x-oss-process=style/thum-small'"
                >
            </div>
            <i class="el-icon-arrow-right" />
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
export default class PropagateSmall extends Vue {
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
  .propagate-small {
    padding: 12px;
    background: #FFF;
    border-radius: 10px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      .left {
        flex: 1;
        font-size: 12px;
        line-height: 18px;
        color: #999999;
      }
      .name {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 600;
        line-height: 25px;
        color: #333333;
        margin-bottom: 8px;
      }
      .intro {
        height: 36px;
        @include elps-wrap(2);
      }
      .logo {
        margin: 0 20px 0 24px;
        width: 64px;
        height: 64px;
        background: #EDEDED;
        border: 1px solid #CCCCCC;
        border-radius: 50%;
        overflow: hidden;
      }
      .el-icon-arrow-right {
        font-size: 16px;
        font-weight: bold;
        &::before {
          color: #CCCCCC;
        }
      }
    }
    .bottom {
      padding-top: 12px;
      margin-bottom: -8px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      font-size: 12px;
      line-height: 25px;
      color: #666666;
      border-top: 1px solid #E7E7E7;
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
