<template>
    <el-dialog :visible="show"
               :title="currentForm.giftId ? '编辑礼品' : '新增礼品'"
               width="550px"
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @close="close"
    >
        <el-form :model="currentForm" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="礼品名称" prop="giftName">
                <el-input v-model="currentForm.giftName" maxlength="12" placeholder="请输入礼品名称" show-word-limit />
            </el-form-item>
            <el-form-item label="礼品介绍" prop="giftBrief">
                <el-input type="textarea" v-model="currentForm.giftBrief" maxlength="100" placeholder="请输入礼品介绍内容" show-word-limit />
            </el-form-item>
            <el-form-item label="礼品图片" prop="giftImage">
                <UploadImage
                    need-edit
                    v-model="imageList"
                    :width="300"
                    :height="300"
                    :count="1"
                    @change="changeGiftImage"
                />
                <span class="purchase-sort-description">只支持.jpg .png 格式，最多上传1张，尺寸为500*500，大小为2M以内</span>
            </el-form-item>
            <el-form-item label="兑换有效期" prop="useStartTime">
                <date-range
                    :init="changeTime"
                    @change="dateChange"
                    disable-before
                    clearable
                />
                <span class="purchase-sort-description">线下到店兑换礼品的有效时间，兑换时间过期，则兑换二维码将失效</span>
            </el-form-item>
            <el-form-item>
                <el-button @click="close">
                    取消
                </el-button>
                <el-button type="primary" @click="submitForm">
                    保存
                </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import UploadImage from '../../../../components/common/file/Image-Manager.vue'
import moment from 'moment'
export default {
    name: 'AddPresent',
    components: {
        UploadImage
    },
    props: {
        show: Boolean,
        form: {
            type: Object,
            default () {
                return {
                    giftId: '',
                    giftName: '',
                    giftBrief: '',
                    giftImage: '',
                    useStartTime: '',
                    useEndTime: ''
                }
            }
        }
    },
    watch: {
        form: {
            handler (val) {
                if (val && val.giftId) {
                    const {
                        giftId = '',
                        giftName = '',
                        giftBrief = '',
                        giftImage = '',
                        useStartTime = '',
                        useEndTime = ''
                    } = this.form
                    this.currentForm = {
                        giftId,
                        giftName,
                        giftBrief,
                        giftImage,
                        useStartTime,
                        useEndTime
                    }
                } else {
                    this.currentForm = {
                        giftId: '',
                        giftName: '',
                        giftBrief: '',
                        giftImage: '',
                        useStartTime: '',
                        useEndTime: ''
                    }
                }
            },
            immediate: true
        },
        currentForm: {
            handler (val) {
                this.imageList = val.giftImage ? [val.giftImage] : []
                this.changeTime = (val.useStartTime && val.useEndTime) ? [val.useStartTime, val.useEndTime] : []
            },
            immediate: true
        }
    },
    data () {
        const checkTime = (rule, value, callBack) => {
            if (!value) {
                callBack(new Error('请选择兑换有效期'))
            }
            if (!this.currentForm.useEndTime) {
                callBack(new Error('请选择兑换有效期'))
            }
            callBack()
        }
        return {
            currentForm: {
                giftId: '',
                giftName: '',
                giftBrief: '',
                giftImage: '',
                useStartTime: '',
                useEndTime: ''
            },
            imageList: [],
            changeTime: [],
            rules: {
                giftName: [
                    { required: true, message: '礼品名称不能为空', trigger: 'blur' },
                    { max: 12, message: '礼品最大字数12字' }
                ],
                giftBrief: [
                    { required: true, message: '礼品介绍不能为空', trigger: 'blur' },
                    { max: 100, message: '礼品介绍的最大字数100字' }
                ],
                giftImage: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
                useStartTime: [
                    { required: true, message: '请选择兑换有效期', trigger: 'blur' },
                    { validator: checkTime, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
            this.$refs.form.clearValidate()
        },
        changeGiftImage (val) {
            this.imageList = val
            this.currentForm.giftImage = this.imageList[0] || ''
            this.$refs.form.clearValidate('giftImage')
        },
        dateChange (val) {
            this.currentForm.useStartTime = val.start ? moment(val.start).format('YYYY-MM-DD HH:mm:ss') : ''
            this.currentForm.useEndTime = val.end ? moment(val.end).format('YYYY-MM-DD HH:mm:ss') : ''
            this.$refs.form.validateField('useStartTime')
            if (val.start && val.end) {
                this.$refs.form.clearValidate('useStartTime')
            }
        },
        async submitForm () {
            await this.$refs.form.validate()
            if (this.currentForm.giftId) {
                const data = JSON.parse(JSON.stringify(this.$parent.form.gifts))
                this.currentForm.giftImage = this.imageList[0] || ''
                data[this.currentForm.giftId] = this.currentForm
                this.$parent.form.gifts = data
            } else {
                this.$parent.form.gifts.push(this.currentForm)
            }
            this.close()
        }
    }
}
</script>

<style lang="scss" scoped>
.purchase-sort-description{
  font-size: 10px;
  color: #999;
}
</style>
