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

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    props: {
        customClass: String,
        title: [Number, String],
        value: [Number, String],
        titleClass: Object,
        titleStyle: Object,
        valueClass: {
            type: Object,
            default () {
                return {}
            }
        },
        valueStyle: Object,
        // icon: String,
        size: String,
        center: Boolean,
        border: Boolean,
        isLink: Boolean,
        arrowDirection: String,
        url: String,
        to: [String, Object]
    }
})
export default class Cell extends Vue {
    // computed
    get showTitle () {
        return this.title || this.$slots.title
    }

    get showValue () {
        return this.value || this.$slots.default
    }

    // methods
    onClick (event) {
        this.$emit('click', event)
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
