<template>
    <div :class="$style.operating">
        <el-popover
            placement="bottom"
            trigger="hover"
            @show="isShow = true"
            @hide="isShow = false"
            :value="isShow"
            ref="popver"
            :popper-class="$style.popver"
        >
            <div :class="$style.moreCtrl">
                <!-- 放入相关button按钮或者a标签 -->
                <slot name="button-box" />
            </div>
            <a :class="$style.operatingMore" slot="reference">
                更多 <pl-svg :class="{ [$style.arrow]: true, [$style.show]: isShow }" width="14" fill="#458bff" class="icon-gengduo" name="icon-xia" />
            </a>
        </el-popover>
    </div>
</template>

<script>
export default {
    name: 'Operating',
    data () {
        return {
            isShow: false
        }
    },
    deactivated () {
        this.isShow = false
    }
}
</script>

<style lang="scss" module>
  .operating {
    .arrow {
      transform: rotate(0deg);
      transition: transform .3s ease;
      &.show {
        transform: rotate(180deg);
      }
    }
  }
  .popver {
    text-align: center;
    padding: 12px 0 !important;
  }
    .more-ctrl {
      display: flex;
      text-align: center;
      flex-direction: column;
      justify-content: center;
      width: max-content;
      > a, button {
        text-align: left;
        padding: 12px 20px;
        font-size: 12px;
        background: none;
        border: none;
        &:hover {
          background-color: #f8f8f8;
          color: #458bff;
        }
      }
    }
    .icon-gengduo {
      margin: 0 5px;
      display: inline-block;
      cursor: pointer;
    }
    .operating-more{
      font-size: 12px;
      color: #458bff !important;
      cursor: pointer;
    }
</style>
