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
        // props
        @Prop() private customClass!: string
        @Prop() private title!: number | string
        @Prop() private value!: number | string
        @Prop() private titleClass!: object
        @Prop() private titleStyle!: object
        @Prop({
            type: Object,
            required: false,
            default () {
                return {}
            }
        }) private valueClass!: object

        @Prop() private valueStyle!: object
        // @Prop() private icon: string,
        @Prop() private size!: string
        @Prop() private center!: boolean
        @Prop() private border!: boolean
        @Prop() private isLink!: boolean
        @Prop() private arrowDirection!: string
        @Prop() private url!: string
        @Prop() private to!: Location

        // computed
        get showTitle (): boolean {
            return !!this.title || !!this.$slots.title
        }

        get showValue (): boolean {
            return !!this.value || !!this.$slots.default
        }

        // methods

        /* eslint-disable @typescript-eslint/no-unused-vars */
        /* eslint-disable @typescript-eslint/no-empty-function */
        @Emit('click')
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
            flex: 1;
        }
        &__value {
            position: relative;
            overflow: hidden;
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
