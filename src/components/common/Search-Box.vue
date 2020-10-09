<template>
    <div :class="$style.searchBox">
        <el-form
            :class="$style.container"
            inline
            ref="form"
            v-bind="{
                ...$attrs
            }"
        >
            <slot />
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'SearchBox',
    mounted () {
        // 动态设置label的宽度
        // 将表单项按“列”存储，一共3列
        const form = this.$refs.form
        const formItemColumns = [[], [], []]
        const formItem = form.$el.querySelectorAll('.el-form > *')
        for (let i = 0; i < formItemColumns.length; i++) {
            let j = 0
            while (formItem[i + j]) {
                formItemColumns[i].push(formItem[i + j])
                j += 3
            }
        }
        for (const col of formItemColumns) {
            // 找出每一列中label最大宽度
            const labelWidthList = col.map(item => {
                item.isFormItem = item.classList.contains('el-form-item')
                // 只处理 form-item 组件
                if (item.isFormItem) {
                    item.formItemLabel = item.querySelector('.el-form-item__label')
                    if (item.formItemLabel) {
                        return item.formItemLabel.offsetWidth
                    }
                }
                return 0
            })
            const maxLabelWidth = Math.max(...labelWidthList)
            // 所有的label都用最大宽度
            for (const item of col) {
                if (item.formItemLabel) {
                    // 如果有label，就设置label的宽度
                    item.formItemLabel.style.width = `${ maxLabelWidth }px`
                } else if (item.isFormItem) {
                    // 如果没有label, 但是该元素是FormItem，就设置paddingLeft，从而和当前列的其它项对齐
                    item.style.paddingLeft = `${ maxLabelWidth }px`
                }
            }
        }
    }
}
</script>

<style module lang="scss">
  .search-box {
    display: flex;
    padding: 20px 32px;
    background-color: #F5F6FA;
    border-radius: 10px;
    > .container {
      display: inline-grid;
      grid-template-columns: auto auto auto;
      grid-gap: 10px 40px;
    }
  }
</style>
<style scoped lang="scss">
  ::v-deep {
    .el-form-item {
      margin-bottom: 0 !important;
      margin-right: 0 !important;
    }
  }
</style>
