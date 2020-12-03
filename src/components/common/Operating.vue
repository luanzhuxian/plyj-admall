<template>
    <div :class="$style.operating">
        <el-popover
            placement="bottom"
            trigger="click"
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
                更多 <i class="el-icon-arrow-down" :class="{ [$style.arrow]: true, [$style.show]: isShow }" />
            </a>
        </el-popover>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class Operating extends Vue {
    isShow = false
    beforeDestroy () {
        this.isShow = false
    }
}
</script>

<style lang="scss" module>
    .operating {
        display: inline-block;
        .arrow {
            transform: rotate(0deg);
            transition: transform .3s ease;
            font-size: 16px;
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
        padding: 12px 20px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        //   width: max-content;
        > a, button {
            display: inline-block;
            text-align: left;
            font-size: 12px;
            width: max-content;
            color: $--color-primary-blue;
            margin-right: 0;
            margin-bottom: 12px;
            background: none;
            border: none;
            &:nth-last-of-type(1) {
                margin-bottom: 0;
            }
        }
    }
    .icon-gengduo {
        margin: 0 5px;
        display: inline-block;
        cursor: pointer;
    }
    .operating-more {
        font-size: 14px;
        color: #4F63FF;
        cursor: pointer;
        &:hover,
        &:focus {
            background-color: #f8f8f8;
            color: mix(#FFFFFF, #4F63FF, 20%);
        }
        &:active {
            color: mix(#FFFFFF, #4F63FF, 10%);
        }
    }
    :global {
        .el-popover {
            min-width: auto !important;
        }
    }
</style>
