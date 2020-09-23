<template>
    <transition name="fade">
        <div :class="$style.templatePreview" v-if="show" @click.stop="close">
            <div :class="$style.templateMobile" @click.stop="() => { return false }">
                <PlSvg name="icon-shibai" width="45" height="45" @click.stop="close" />
                <div :class="$style.templateContent" title="滚动转轮，上下滚动">
                    <slot />
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TemplatePreview extends Vue {
    @Prop(Boolean) show!: boolean

    close () {
        this.$emit('update:show', false)
    }
}
</script>

<style module lang="scss">
// $em: 330 / 750;
.template-preview {
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    overflow: auto;
    z-index: 99;
}
.template-mobile {
    position: relative;
    width: 410px;
    height: 846px;
    background: url('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/phone.png') no-repeat center center;
    background-size: 100%;
    z-index: 9;
    > svg {
        position: absolute;
        top: 0;
        right: -45px;
        cursor: pointer;
    }
}
.template-content {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 375px;
    height: 667px;
    transform: translate3d(-50%, -50%, 0);
    background-color: #eee;
    overflow: scroll;
    z-index: 10;
    &::-webkit-scrollbar {
        display: none;
    }
    &::-moz-viewport-scroll {
        display: none;
    }
}
@media screen and (max-height: 846px) {
    .template-preview {
        align-items: flex-start !important;
    }
}

</style>
