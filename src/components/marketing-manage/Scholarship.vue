<template>
    <div class="gift">
        <!-- 新增礼品弹框 -->
        <el-dialog :title="giftTitle" :visible="show" :before-close="handleClose" width="660px">
            <el-form
                label-width="100px"
                :model="scholarshipForm"
                ref="scholarshipForm"
                label-position="left"
                :rules="scholarshipRules"
            >
                <el-form-item label="金额" prop="scholarshipPrice">
                    <el-input v-model.number="scholarshipForm.scholarshipPrice" autocomplete="off" placeholder="请输入金额" type="number" style="width:100px;" />
                    <span class="purchase-sort-description">（每个账号领取奖学金的红包金额）</span>
                </el-form-item>
                <el-form-item label="发放数量" prop="stock">
                    <el-input-number v-model="scholarshipForm.stock" :min="1" step-strictly label="礼品库存" /> 个
                    <span class="purchase-sort-description">（奖学金发放的数量，即可领取奖学金的人数最高限额）</span>
                </el-form-item>
                <el-form-item prop="scholarshipEffectiveTime">
                    <span slot="label">
                        <span>有效时间</span>
                        <el-tooltip class="item" effect="dark" placement="bottom">
                            <div slot="content">
                                有效期按自然天计算。<br>
                                如：设置奖学金领取当日起10天内可用，则用户在12月1日<br>
                                12：00时领取奖学金，则该奖学金的可用时间为12月1日<br>
                                12:00:00至12月10日的23:59:59.
                            </div>
                            <pl-svg name="yaji-jinggao" style="margin-left: 4px;" width="16" fill="#333" />
                        </el-tooltip>
                    </span>
                    奖学金领取当日起，<el-input v-model="scholarshipForm.scholarshipEffectiveTime" autocomplete="off" placeholder="请输入天数" type="number" style="width:100px;" /> 日内使用，过期自动作废
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" plain @click="handleClose" style="margin-right:30px;">
                    取消
                </el-button>
                <el-button type="primary" @click="submitscholarshipForm()" style="margin-right:30px;">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { checkNumber } from '../../assets/ts/validate'
export default {
    name: 'Scholarship',
    data () {
        return {
            // 新增礼品
            scholarshipForm: {
                scholarshipPrice: '',
                scholarshipEffectiveTime: 180,
                stock: 1
            },
            scholarshipRules: {
                scholarshipPrice: [
                    { required: true, message: '请输入金额', trigger: 'blur' },
                    { validator: checkNumber(9999999999, 1, 0), trigger: 'blur' }
                ],
                scholarshipEffectiveTime: [
                    { required: true, message: '请输入有效时间', trigger: 'blur' },
                    { validator: checkNumber(9999999999, 1, 0), trigger: 'blur' }
                ],
                stock: [
                    { required: true, message: '请输入发放数量', trigger: 'change' },
                    { validator: checkNumber(9999999999, 1, 0), trigger: 'blur' }
                ]
            },
            giftTitle: '新增奖学金'
        }
    },
    props: {
        status: {
            type: [Number, String],
            default: ''
        },
        show: Boolean,
        scholarshipData: {
            type: Object,
            default: () => null
        }
    },
    watch: {
        show (val) {
            if (val) {
                if (this.scholarshipData) {
                    this.scholarshipForm = JSON.parse(JSON.stringify(this.scholarshipData))
                }
            }
        }
    },
    methods: {
        handleClose () {
            this.resetForm()
            this.$emit('update:show', false)
        },
        submitscholarshipForm () {
            this.$refs.scholarshipForm.validate(valid => {
                if (valid) {
                    this.$emit('confirm', JSON.parse(JSON.stringify(this.scholarshipForm)))
                    this.handleClose()
                } else {
                    return false
                }
            })
        },
        // 重置表单
        resetForm () {
            this.$refs.scholarshipForm.resetFields()
            this.scholarshipForm = {
                scholarshipPrice: '',
                scholarshipEffectiveTime: '',
                stock: 1
            }
        }
    }
}
</script>

<style lang="scss" scoped>
  .el-table .el-button{
    min-width:auto;
    padding:0;
  }
  .el-table .cell img{
    vertical-align: middle;
    object-fit: cover;
  }

  .purchase-sort-description {
    font-weight: 400;
    font-size: 14px;
    color: #999;
  }

  .sort {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    text-align: center;

    i {
      flex: 1;
      width: 40px;
      height: 16px;
      border: 1px solid #dcdfe6;
      color: #606266;

      &:hover {
        color: #409eff;
      }
    }

    .disabled {
      border-color: #ebeef5 !important;
      color: #c0c4cc !important;
      cursor: not-allowed;
    }
  }
</style>
