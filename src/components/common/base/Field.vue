<template>
    <div
        :class="{ inline, field: true, size }"
        :style="{
            marginBottom: mb + 'px'
        }"
    >
        <div
            :style="{
                width: titleWidth,
                color: titleColor
            }"
            class="title"
            v-text="title"
        />
        <div
            :style="{
                color: textColor,
                width: textWidth,
                ...textStyle
            }"
            class="text"
        >
            <span v-if="text" v-text="text" />
            <slot v-else />
        </div>
    </div>
</template>

<script>
export default {
    name: 'Field',
    props: {
        title: {
            type: String,
            default: ''
        },
        text: {
            type: [String, Number, Boolean],
            default: ''
        },
        titleStyle: {
            type: Object,
            default () {
                return {}
            }
        },
        inline: Boolean,
        titleWidth: {
            type: String,
            default: 'auto'
        },
        textStyle: {
            type: Object,
            default () {
                return {}
            }
        },
        size: {
            type: String,
            default: 'middle'
        },
        mb: {
            type: Number,
            default: 16
        },
        titleColor: {
            type: String,
            default: '#333'
        },
        textColor: {
            type: String,
            default: '#333'
        },
        // 定义文本的宽度，超出宽度的将被裁剪
        textWidth: {
            type: String,
            default: null
        }
    }
}
</script>

<style scoped lang="scss">
    .field {
        display: flex;
        flex-wrap: nowrap;

        &.inline {
            display: inline-flex;
        }

        &.middle {
            font-size: 16px;
        }

        &.small {
            font-size: 14px;
        }

        .title {
            display: inline-block;
            margin-right: 18px;
            line-height: 20px;
            white-space: nowrap;
        }

        .text {
            display: inline-block;
            line-height: 20px;
        }

        &:nth-last-of-type(1) {
            margin-bottom: 0 !important;
        }
    }
</style>
