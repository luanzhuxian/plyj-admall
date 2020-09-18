<template>
    <div
        class="pl-cell"
        :class="{
            [customClass]: customClass,
            'pl-cell--center': center,
            'pl-cell--border': border,
            'pl-cell--link': isLink
        }"
        @click="onClick"
    >
        <slot name="icon" />
        <div
            v-if="showTitle"
            class="pl-cell__title"
            :class="titleClass"
            :style="titleStyle"
        >
            <slot name="title">
                <span class="pl-cell__title-text">{{ title }}</span>
            </slot>
        </div>
        <div
            v-if="showValue"
            class="pl-cell__value"
            :class="{ alone: !showTitle, ...valueClass }"
            :style="valueStyle"
        >
            <slot>
                <span class="pl-cell__value-text">{{ value }}</span>
            </slot>
        </div>
        <slot name="right-icon" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { Location } from 'vue-router'

@Component
export default class Cell extends Vue {
    /* props */
    @Prop(String) private customClass!: string
    @Prop([String, Number]) private title!: string | number
    @Prop([String, Number]) private value!: string | number
    @Prop(Object) private titleClass!: object
    @Prop(Object) private titleStyle!: object
    @Prop({
        type: Object,
        required: false,
        default () {
            return {}
        }
    }) private valueClass!: object

    @Prop(Object) private valueStyle!: object
    // @Prop(String) private icon: string,
    @Prop(String) private size!: string
    @Prop(Boolean) private center!: boolean
    @Prop(Boolean) private border!: boolean
    @Prop(Boolean) private isLink!: boolean
    @Prop(String) private arrowDirection!: string
    @Prop(String) private url!: string
    @Prop() private to!: Location

    /* computed */
    get showTitle (): boolean {
        return !!this.title || !!this.$slots.title
    }

    get showValue (): boolean {
        return !!this.value || !!this.$slots.default
    }

    /* methods */

    @Emit('click')
    // eslint-disable-next-line
    onClick (event: Event) {
    }
}
</script>

<style lang="scss">
    .pl-cell {
        position: relative;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        background-color: #fff;
        overflow: hidden;
        &__title,
        &__value {
            position: relative;
            overflow: hidden;
            flex: 1;
        }
        &__value {
            // color: @cell-value-color;
            text-align: right;
            vertical-align: middle;
            word-wrap: break-word;
            &.alone {
                // color: @text-color;
                text-align: left;
            }
        }
        &--center {
            align-items: center;
        }
        &--border {
        }
        &--link {
            cursor: pointer;
            // &:active {
            //     background-color: ;
            // }
        }
    }
</style>
