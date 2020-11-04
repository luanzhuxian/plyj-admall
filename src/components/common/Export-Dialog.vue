<template>
    <el-dialog
        :visible="show"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="40%"
        @open="$emit('open')"
        @close="close"
    >
        <template #title>
            <div :class="$style.header">
                <span :class="$style.title">{{ title }}</span>
                <span :class="$style.des"> - 可选择导出条件后导出相应数据</span>
            </div>
        </template>

        <slot />

        <div :class="$style.footer">
            <el-button round @click="close">
                取消
            </el-button>
            <el-button round @click="confirm" type="primary">
                确定导出
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'ExportDialog',
    props: {
        show: Boolean,
        title: {
            type: String,
            default: '导出订单'
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
            this.$emit('close')
        },
        confirm () {
            this.$emit('confirm')
        }
    }
}
</script>

<style lang='scss' module>

.header {
    > .title {
        font-size: 16px;
        font-weight: bold;
        color: #333333;
    }
    > .des {
        font-size: 14px;
        color: #999999;
    }
}

.footer {
    text-align: center;
}

</style>
