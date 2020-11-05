<template>
    <el-dialog :visible="show"
               :title="form.scholarshipId ? '编辑奖学金' : '新增奖学金'"
               width="600px"
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @close="close"
    >
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item prop="scholarshipPrice">
                <template slot="label">
                    金额<span class="red">*</span><el-tooltip
                        effect="dark"
                        placement="bottom"
                    >
                        <div slot="content" style="line-height: 2">
                            金额范围在0.01 ~ 9999.99之间
                        </div>
                        <pl-svg width="20" name="icon-jinggao" style="margin-left: 5px" fill="#999999" />
                    </el-tooltip>
                </template>
                <el-input-number v-model="form.scholarshipPrice" :precision="2" :step="0.1" :min="0.01" :max="9999.99" placeholder="请输入金额" :controls="false" /> 元
                <span style="font-size: 10px; color: #999">（每个账号领取奖学金的红包金额）</span>
            </el-form-item>
            <el-form-item label="有效时间" prop="scholarshipEffectiveTime">
                <div slot="label">
                    活动时间<span class="red">*</span><el-tooltip
                        effect="dark"
                        placement="bottom"
                    >
                        <div slot="content" style="width: 520px; line-height: 2">
                            <div>有效期按自然天计算，有效时间仅支持输入1~999天以内的整数。</div>
                            <div>如：设置奖学金领取当日起10天内可用，则用户在12月1日12：00时领取奖学金，则该奖学金的可用时间为12月1日12:00:00至12月10日的23:59:59.</div>
                        </div>
                        <pl-svg width="20" name="icon-jinggao" style="margin-left: 5px" fill="#999999" />
                    </el-tooltip>
                </div>
                奖学金领取当日起，<el-input-number v-model="form.scholarshipEffectiveTime" controls-position="right" :min="1" :max="999" :step="1" step-strictly placeholder="请输入天数" /> 天内可使用，过期自动作废
            </el-form-item>
            <el-form-item>
                <el-button @click="close">
                    取消
                </el-button>
                <el-button type="primary" :loading="loading" @click="submitForm('form')">
                    保存
                </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
export default {
    name: 'AddScholarship',
    props: {
        show: Boolean,
        form: {
            type: Object,
            default () {
                return {
                    scholarshipId: '',
                    scholarshipPrice: '',
                    scholarshipEffectiveTime: ''
                }
            }
        }
    },
    data () {
        const validatePass = (rule, value, callback) => {
            if (value) {
                if (Number(value) < 0.01 || Number(value) > 9999.99) {
                    callback(new Error('金额范围在0.01 ~ 9999.99之间'))
                }
                callback()
            } else {
                callback(new Error('请输入金额'))
            }
        }
        const validatePass2 = (rule, value, callback) => {
            if (value) {
                callback()
            } else {
                callback(new Error('请输入天数'))
            }
        }
        return {
            loading: false,
            rules: {
                scholarshipPrice: [{ validator: validatePass, trigger: 'blur' }],
                scholarshipEffectiveTime: [{ validator: validatePass2, trigger: 'blur' }]
            }
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
            this.$refs.form.clearValidate()
        },
        async submitForm (formName) {
            try {
                this.loading = true
                await this.$refs[formName].validate()
                if (this.form.scholarshipId) {
                    const data = JSON.parse(JSON.stringify(this.$parent.form.scholarships))
                    data[this.form.scholarshipId] = this.form
                    this.$parent.form.scholarships = data
                } else {
                    this.$parent.form.scholarships.push(this.form)
                }
                this.close()
            } catch (e) {
                throw e
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-input-number .el-input__inner{
    text-align: left;
    width: 130px;
  }
</style>
