<template>
    <div :class="$style.templateItem">
        <div
            :class="$style.itemTop"
            @mouseover="data.isHover = true"
            @mouseleave="data.isHover = false"
        >
            <img :src="data.img">
            <img
                v-if="isActive"
                :class="$style.topUsing"
                src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/base/template-using.svg"
            >
            <transition name="fade">
                <div :class="$style.topMask" v-if="data.isHover">
                    <slot name="buttons">
                        <el-button plain @click="use">
                            使用模板
                        </el-button>
                        <el-button plain @click="preview">
                            预览模板
                        </el-button>
                    </slot>
                </div>
            </transition>
        </div>
        <div :class="$style.itemInfo">
            <p :class="$style.infoTitle">
                <span :class="$style.active" v-text="data.templateName" />
                <span :style="{ color: data.chargeTextColor }">{{ data.charge }}</span>
            </p>
            <p>设计者：朋来雅集</p>
            <p>{{ `到期日：${data.expire}` }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { TemplateModel, SkinModel } from '../utils/types'

const isSkin = (data: TemplateModel | SkinModel): data is SkinModel => data.category === 'skin'
const isTemplate = (data: TemplateModel | SkinModel): data is TemplateModel => data.category === 'template'

@Component
export default class TemplateItem extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return {}
        }
    }) readonly data!: TemplateModel | SkinModel

    @Prop(Number) current!: number

    get isActive () {
        if (isSkin(this.data)) {
            return this.data.skinId === this.current
        }
        if (isTemplate(this.data)) {
            return this.data.type === this.current
        }
        return false
    }

    /* methods */
    @Emit('use')
    use () {
        return true
    }

    @Emit('preview')
    preview () {
        return true
    }
}
</script>

<style lang="scss" module>
.template-item {
  width: 250px;
  height: 375px;
  margin: 0 76px 76px 0;
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  &:last-of-type {
    margin-right: 0;
  }
  .item-top {
    width: 250px;
    height: 280px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .top-using {
      position: absolute;
      top: 0;
      right: 0;
      width: 54px;
      height: 54px;
    }
    .top-mask {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: #ffffff;
      border-bottom: 1px solid #CCCCCC;
      position: absolute;
      top: 0;
      left: 0;
      > button {
        width: 120px;
        height: 30px;
        margin-bottom: 10px;
        margin-left: 0;
        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }
  }
  .item-info {
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    color: #999999;
    font-size: 12px;
    > p {
      margin-top: 10px;
      &:first-of-type {
        margin-top: 0;
      }
    }
    .info-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      span:first-of-type {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .active {
        color: #598BF8;
        font-weight: 600;
      }
    }
  }
}
</style>
