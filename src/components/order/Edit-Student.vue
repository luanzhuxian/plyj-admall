<template>
    <div>
        <el-dialog
            width="480px"
            title="编辑学员信息"
            :visible="show"
            @close="cancel()"
        >
            <el-form label-width="150px" ref="form" label-position="left" :model="localItem" :rules="rules">
                <el-form-item
                    class="mb-20"
                    label="姓名"
                    prop="userName"
                >
                    <el-input
                        v-model="localItem.userName"
                    />
                </el-form-item>
                <el-form-item
                    class="mb-20"
                    label="手机号码"
                    prop="userMobile"
                >
                    <el-input
                        v-model="localItem.userMobile"
                        onblur="value=value.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g,'')"
                        placeholder="请填写信息"
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
import { testPhone, testName } from '../../assets/ts/validate'
export default {
    name: 'EditStudent',
    data () {
        return {
            localItem: {},
            rules: {
                userMobile: [
                    { required: true, message: '手机号不能为空', trigger: 'blur' },
                    { validator: testPhone, message: '请输入正确的手机号码', trigger: 'blur' }
                ],
                userName: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' },
                    { validator: testName, message: '请输入正确的2~20位中英文姓名', trigger: 'blur' }
                ]
            }
        }
    },
    props: {
        show: Boolean,
        studentItem: {
            type: Object,
            default: () => ({})
        }
    },
    watch: {
        show (val) {
            if (val) {
                this.localItem = JSON.parse(JSON.stringify(this.studentItem))
            } else {
                this.$refs.form.clearValidate()
            }
        }
    },
    methods: {
        cancel () {
            this.localItem = {}
            this.$emit('update:show', false)
        },
        async confirm () {
            try {
                await this.$refs.form.validate()
                this.$emit('update:show', false)
                this.$emit('studentConfirm', this.localItem)
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style scoped lang="scss">
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
