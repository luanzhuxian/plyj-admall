<template>
    <el-pagination
        background
        :layout="layouts"
        :page-size="size"
        :page-sizes="[10, 15, 20, 30]"
        :total="total"
        :current-page="page"
        @current-change="change"
        @size-change="sizeChange"
    />
</template>

<script>
export default {
    name: 'Pagination',
    model: {
        event: 'change',
        prop: 'page'
    },
    props: {
        size: {
            type: Number,
            default: 10
        },
        // 是否可配置每页的条数
        sizes: Boolean,
        total: {
            type: Number,
            default: 0
        },
        page: {
            type: Number,
            default: 1
        },
        layout: {
            type: String,
            default: 'total, prev, pager, next, jumper'
        }
    },
    data () {
        return {
            layouts: this.layout
        }
    },
    created () {
        this.changeLayout()
    },
    methods: {
        changeLayout () {
            if (this.sizes) {
                const array = this.layout.split(',')
                array.splice(1, 0, ' sizes')
                this.layouts = array.join()
            }
        },
        change (page) {
            this.$emit('change', page)
        },
        sizeChange (size) {
            this.$emit('update:size', size)
            this.$emit('sizeChange', size)
        }
    }
}
</script>

<style scoped lang="scss">
.el-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
