<template>
    <el-dialog
        class="add-present"
        :visible="show"
        :title="isNewPresent ? '新增礼品' : '编辑礼品'"
        width="800px"
        @close="closeHandler"
        :close-on-click-modal="false"
    >
        <el-form
            label-width="150px"
            :model="form"
            :rules="rules"
            ref="presentForm"
            class="wrap border-bottom"
            label-position="left"
        >
            <el-form-item prop="giftName" label="礼品名称">
                <el-input style="width: 320px" v-model="form.giftName" placeholder="请输入4-12字礼品名称" clearable />
            </el-form-item>
            <el-form-item prop="giftBrief" label="礼品介绍">
                <el-input
                    type="textarea"
                    placeholder="礼品介绍(100字以内)"
                    v-model="form.giftBrief"
                    maxlength="100"
                    style="width: 420px;"
                    :rows="8"
                    resize="none"
                    show-word-limit
                    clearable
                />
            </el-form-item>

            <el-form-item prop="giftImage" label="礼品图片">
                <UploadImage
                    need-edit
                    v-model="imgArr"
                    :width="300"
                    :height="300"
                    :count="1"
                />
                <span class="purchase-sort-description">只支持.jpg .png 格式，最多上传1张，大小为2M以内</span>
            </el-form-item>

            <el-form-item label="礼品库存" prop="stock">
                <el-input-number
                    v-model="form.stock"
                    :min="minStock"
                    :max="maxStock"
                    label="库存"
                    :precision="0"
                />
            </el-form-item>
            <el-form-item prop="useEndTime" label="兑换时间">
                <date-range
                    :init="timeRange"
                    :type="dateType"
                    :default-time="['00:00:00', '23:00:00']"
                    disable-before
                    clearable
                    @change="formatTime"
                />
            </el-form-item>
        </el-form>

        <div class="mt-20 text-center">
            <el-button @click="closeHandler">
                取 消
            </el-button>
            <el-button type="primary" @click="okHandler">
                确 定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import moment from 'moment'
import UploadImage from '../file/Image-Manager.vue'
import { copyFields } from '../../assets/ts/utils'
import { checkNumber } from '../../assets/ts/validate'

export default {
    name: 'EditPresent',
    components: {
        UploadImage
    },
    props: {
        initDate: {
            type: Array,
            default () {
                return []
            }
        },
        // 是否显示弹框
        show: Boolean,
        // 礼品类型，0 - 奖品， 1- 安慰奖
        giftType: {
            type: [String, Number],
            default: 0
        },
        // 奖品详情
        giftDetail: {
            type: Object,
            default () {
                return null
            }
        },
        // 最大结束时间
        endMaxDate: {
            type: [String, Number],
            default: 0
        },
        // 最小结束时间
        endMinDate: {
            type: [String, Number],
            default: 0
        },
        // 最大开始时间
        startMaxDate: {
            type: [String, Number],
            default: 0
        },
        // 最小开始时间
        startMinDate: {
            type: [String, Number],
            default: 0
        },
        dateType: {
            type: String,
            default: 'date'
        },
        minStock: {
            type: Number,
            default: 1
        },
        maxStock: {
            type: Number,
            default: 99999
        }
    },
    data () {
        const checkDateTime = (val, rule, callback) => {
            if (this.startMinDate && moment(this.form.useStartTime).valueOf() < moment(this.startMinDate).valueOf()) {
                callback(new Error(`开始时间必须在${ moment(this.startMinDate).format(this.dateFormat) }之后`))
                return
            }
            if (this.startMaxDate && moment(this.form.useStartTime).valueOf() > moment(this.startMaxDate).valueOf()) {
                callback(new Error(`开始时间必须在${ moment(this.startMaxDate).format(this.dateFormat) }之前`))
                return
            }
            if (this.endMinDate && moment(this.form.useEndTime).valueOf() < moment(this.endMinDate).valueOf()) {
                callback(new Error(`结束时间必须在${ moment(this.endMinDate).format(this.dateFormat) }之后`))
                return
            }
            if (this.endMaxDate && moment(this.form.useEndTime).valueOf() > moment(this.endMaxDate).valueOf()) {
                callback(new Error(`结束时间必须在${ moment(this.maxDate).format(this.dateFormat) }之前`))
                return
            }
            callback()
        }
        return {
            form: {
                checkinId: '',
                // 礼品描述，string
                giftBrief: '',
                // 礼品图片
                giftImage: '',
                // 礼品名称
                giftName: '',
                // 0 - 奖品， 1- 安慰奖
                giftType: 0,
                // 只修改时需要传
                id: '',
                // 库存，默认为1
                stock: 1,
                // 礼品领用量
                salesVolume: '0',
                // 显示，默认为0，显示
                status: 0,
                // 使用截至时间
                useEndTime: '',
                // 使用开始时间
                useStartTime: ''
            },
            imgArr: [],
            timeRange: [],
            rules: {
                giftName: [
                    { required: true, message: '礼品名称不能为空', trigger: 'blur' },
                    { max: 12, message: '礼品名称不能超过12个字符', trigger: 'blur' },
                    { min: 4, message: '礼品名称不能少于4个字符', trigger: 'blur' }
                ],
                giftBrief: [
                    { required: true, message: '礼品介绍不能为空', trigger: 'blur' },
                    { max: 100, message: '礼品介绍不能超过100个字符', trigger: 'blur' }
                ],
                useEndTime: [
                    { required: true, message: '兑换时间不能为空', trigger: 'none' },
                    { validator: checkDateTime, trigger: 'none' }
                ],
                giftImage: [
                    { required: true, message: '礼品图片不能为空', trigger: 'blur' }
                ],
                stock: [
                    { validator: checkNumber(this.maxStock, this.minStock, 0), trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        isNewPresent () {
            return !this.giftDetail
        },
        dateFormat () {
            return this.dateType === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
        }
    },
    watch: {
        imgArr (arr) {
            this.form.giftImage = arr[0] || ''
        },
        show: {
            handler (val) {
                // 打开时清空表单校验状态更加有效
                if (val) {
                    let initStart = ''
                    let initEnd = ''
                    if (this.initDate.length === 2) {
                        initStart = moment(this.initDate[0]).format('YYYY-MM-DD HH:mm:ss')
                        initEnd = moment(this.initDate[1]).format('YYYY-MM-DD HH:mm:ss')
                        this.timeRange = [this.form.useStartTime || initStart || '', this.form.useEndTime || initEnd || '']
                        this.form.useStartTime = initStart
                        this.form.useEndTime = initEnd
                    }
                    if (this.$refs.presentForm) {
                        this.$refs.presentForm.clearValidate()
                    }
                    if (this.giftDetail) {
                        copyFields(this.form, this.giftDetail)
                        this.form.giftType = this.giftType
                        this.imgArr = this.form.giftImage ? [this.form.giftImage] : []
                        this.timeRange = [this.form.useStartTime, this.form.useEndTime]
                    }
                } else {
                    this.$emit('update:giftDetail', null)
                }
            },
            immediate: true
        }
    },
    methods: {
        formatTime ({ start, end }) {
            this.form.useStartTime = start || ''
            this.form.useEndTime = end || ''
        },
        async okHandler () {
            this.$refs.presentForm.validate(valid => {
                if (valid) {
                    const params = {
                        giftType: this.giftType,
                        giftDetail: JSON.parse(JSON.stringify(this.form))
                    }
                    // 新增加的礼品没有id
                    if (this.isNewPresent) delete params.giftDetail.id
                    this.$emit('confirm', params)
                    this.closeHandler()
                }
            })
        },
        closeHandler () {
            this.$emit('update:show', false)
            this.clearData()
        },
        clearData () {
            //  清除数据
            this.form = {
                checkinId: 0,
                // 礼品描述，string
                giftBrief: '',
                // 礼品图片
                giftImage: '',
                // 礼品名称
                giftName: '',
                // 0 - 奖品， 1- 安慰奖
                giftType: 0,
                // 只修改时需要传
                id: 0,
                // 库存，默认为1
                stock: 1,
                // 使用截至时间
                useEndTime: '',
                // 使用开始时间
                useStartTime: '',
                timeRange: ''
            }
            this.imgArr = []
            this.timeRange = []
        }
    }
}
</script>

<style scoped lang="scss">

</style>
