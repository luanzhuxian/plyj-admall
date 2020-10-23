<template>
    <div :class="$style.moduleWrapper" v-if="isModuleShow" @click="onClick">
        <div :class="$style.eye" v-if="isClickable" @click.stop="data.showStatue = ~data.showStatue + 2">
            <PlSvg width="16" name="icon-eye-open" v-show="data.showStatue === 1" />
            <PlSvg width="16" name="icon-eye-close" fill="#999999" v-show="data.showStatue === 0" />
        </div>
        <div :class="$style.mask" v-if="!isPreview && data.showStatue === 0">
            <PlSvg name="icon-eye-close" :width="iconWidth" />
        </div>
        <slot />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../utils/types'

@Component
export default class ModuleWrapper extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    @Prop({
        type: String,
        default: 'large'
    }) readonly size!: string

    /* computed */
    get iconWidth () {
        return this.size === 'small' ? 52 : 152
    }

    get isModuleShow () {
        return this.data &&
        this.data.moduleType &&
        !(this.isPreview && this.data.showStatue !== 1) && // 预览时 showStatue 必须为1，否则不展示该模块
        ((this.data.values && this.data.values.length && this.data.showStatue === 1) || this.isClickable || this.isEmptyShow)
    }

    get isClickable () {
        // @ts-ignore
        return this.$parent.isClickable
    }

    get isEmptyShow () {
        // @ts-ignore
        return this.$parent.isEmptyShow
    }

    get isPreview () {
        // @ts-ignore
        return this.$parent.isPreview
    }

    /* methods */
    onClick () {
        if (!this.isClickable) return
        if (!this.data.showStatue) return
        this.$emit('on-click')
    }
}
</script>

<style lang="scss" module>
.module-wrapper {
    position: relative;
    .eye {
        position: absolute;
        top: -2px;
        right: -31px;
        width: 28px;
        height: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        border: 1px solid rgba(231, 231, 231, 1);
        box-shadow: 0 0 12px rgba(0, 0, 0, .1);
        cursor: pointer;
    }

    .mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, .4);
        z-index: 9;
    }
}

</style>
