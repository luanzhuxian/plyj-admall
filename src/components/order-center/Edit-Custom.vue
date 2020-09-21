<template>
    <div>
        <el-dialog
            width="500px"
            :title="customTitle"
            :visible="show"
            @close="cancel()"
        >
            <el-form label-width="170px" label-position="left">
                <el-form-item
                    class="mb-20"
                    v-for="(item,index) in localItem" :key="index"
                >
                    <span slot="label">
                        <span>{{ `${item.fieldName}:` }}</span>
                        <span v-if="item.required" class="red">*</span>
                    </span>
                    <el-input
                        v-model="item.fieldValue"
                        onblur="value=value.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g,'')"
                        placeholder="未填写"
                    />
                </el-form-item>
            </el-form>
            <div
                slot="footer"
            >
                <el-button @click="cancel()">
                    取 消
                </el-button>
                <el-button
                    type="primary"
                    @click="confirm()"
                >
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'EditCustom',
    data () {
        return {
            localItem: []
        }
    },
    props: {
        show: Boolean,
        customTitle: {
            type: String,
            default: ''
        },
        customItem: {
            type: Array,
            default: () => []
        }
    },
    watch: {
        show (val) {
            if (val) this.localItem = JSON.parse(JSON.stringify(this.customItem))
        }
    },
    methods: {
        cancel () {
            this.localItem = []
            this.$emit('update:show', false)
        },
        confirm () {
            for (const item of this.localItem) {
                if (item.required && !item.fieldValue) {
                    this.$warning(`${ item.fieldName }不能为空`)
                    return
                }
            }
            this.$emit('update:show', false)
            this.$emit('customConfirm', this.localItem)
        }
    }
}
</script>

<style scoped lang="scss">
  .red{
    color: #D0423C;
  }
  .draft-upperLimit{
    ::v-deep .el-dialog{
      .el-dialog__header {
        padding: 16px;
      }
      .el-dialog__body {
        padding-bottom: 0;
      }
    }
    .draft-upperLimit-box{
      display: flex;
      justify-content: center;
      .content-text{
        width:323px;
        height:42px;
        font-size:16px;
        font-weight:bold;
        color: #333333;
        line-height:21px;
        text-align: center;
      }
    }
  }

  .tipTtitle {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    > .icon-jinggao {
      margin-right: 10px;
    }
  }
  .verification-status-text{
    padding-bottom: 10px;
    border-bottom: 1px solid #E7E7E7;
  }
  .font-bold{
    font-weight: bold;
  }
</style>
