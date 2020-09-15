<template>
    <label
        class="file-selector"
        @click="clickHandler"
        :style="{
            width: boxWidth + 'px',
            height: boxHeight + 'px',
            marginLeft: marginLeft + 'px',
            borderRadius: borderRadius + 'px'
        }"
    >
        <i class="el-icon-upload fz-20" />
        <i v-text="uploadText" />
        <input
            @change="fileChange"
            ref="Input"
            type="file"
            :accept="accept"
            style="display: none;"
            :multiple="multiple"
        >
        <slot />
    </label>
</template>

<script>
export default {
    name: 'FileSelector',
    data () {
        return {
            Input: null
        }
    },
    props: {
        boxWidth: {
            type: Number,
            default: 72
        },
        boxHeight: {
            type: Number,
            default: 72
        },
        listLength: {
            type: Number,
            default: 0
        },
        uploadText: {
            type: String,
            default: '上传图片'
        },
        accept: {
            type: String,
            default: 'image/jpeg,image/jpg,image/png,image/bmp'
        },
        marginLeft: {
            type: Number,
            default: 20
        },
        borderRadius: {
            type: Number,
            default: 0
        },
        multiple: Boolean
    },
    computed: {
        input () {
            return this.$refs.Input
        }
    },
    methods: {
        clickHandler (e) {
            this.$emit('click', e)
        },
        fileChange (e) {
            this.$emit('change', e)
            this.input.type = 'text'
            this.input.type = 'file'
        }
    }
}
</script>

<style scoped lang="scss">
  .file-selector {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    line-height: 22px;
    background-color: #f8f8f8;
    border: 1px solid #ccc;
    cursor: pointer;
    color: #999;
  }
</style>
