<template>
    <div class="legal-person.vue">
        <h4>法定代表人证件&nbsp;&nbsp;&nbsp;&nbsp;<span class="tip">请上传法定代表人的证件信息</span></h4>

        <el-form
            label-width="150px"
            label-position="left"
            :model="form"
            :rules="rules"
            ref="form"
        >
            <!--<el-form-item label="证件持有人类型">
        <span class="gray-2">企业法人 (申请商户名下营业执照或民办非企业登记证书的主体法人, 需在开户后进行签约, 并接收日常重要管理信息和进行资金操作)</span>
      </el-form-item>-->

            <el-form-item label="持证类型">
                <span class="gray-2">身份证 (仅中国大陆居民)</span>
            </el-form-item>

            <el-form-item label="身份证人像面照片" prop="idCardCopyUrl">
                <p class="tip">
                    需微信服务号申请主体法人信息, 必须为彩色照片且小于2M, 文件格式为bmp 、png、jpg、jpeg
                </p>
                <ImageManager
                    :size="1"
                    :list="idCardFace"
                    @change="idCardFaceChange"
                    :count="1"
                    hide-edit-btn
                    :box-width="107"
                    :box-height="76"
                    @fileChange="(blobList) => sendImageToWeixin(blobList, 'idCardCopy')"
                />
            </el-form-item>

            <el-form-item label="身份证国徽面照片" prop="idCardNationalUrl">
                <p class="tip">
                    需微信服务号申请主体法人信息, 必须为彩色照片且小于2M, 文件格式为bmp 、png、jpg、jpeg
                </p>
                <ImageManager
                    :size="1"
                    :list="idCardBack"
                    @change="idCardBackChange"
                    :count="1"
                    hide-edit-btn
                    :box-width="107"
                    :box-height="76"
                    @fileChange="(blobList) => sendImageToWeixin(blobList, 'idCardNational')"
                />
            </el-form-item>

            <el-form-item label="证件号码" prop="idCardNumber">
                <el-input
                    placeholder="请输入证件号码"
                    v-model.trim="form.idCardNumber"
                />
            </el-form-item>

            <el-form-item label="证件持有人姓名" prop="idCardName">
                <el-input
                    placeholder="请输入证件持有人姓名"
                    v-model.trim="form.idCardName"
                />
            </el-form-item>

            <el-form-item label="证件有效期" prop="idCardValidTimeBegin">
                <div class="flex">
                    <DateRange
                        v-if="!isLongTime"
                        @change="dateChange"
                        :init="idCartTime"
                        clearable
                    />
                    <el-date-picker
                        v-else
                        v-model="form.idCardValidTimeBegin"
                        type="date"
                        placeholder="开始日期"
                        value-format="yyyy-MM-dd"
                        style="width: 184px"
                        :editable="false"
                    />
                    <el-checkbox v-model="isLongTime" class="ml-20" @change="isLongTimeChange">
                        长期
                    </el-checkbox>
                </div>
                <p class="tip">
                    （证件有效期限需与上传文件上所示期限一致，若有效期限超过2100年，请选择“长期”）
                </p>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import ImageManager from '../../../../components/common/file/Image-Manager.vue'
import DateRange from '../../../../components/common/base/Date-Range.vue'
import moment from 'moment'
import {
    testIdCard
} from '../../../../assets/ts/validate'
import {
    sendImageToWeixin,
    idCardSide
} from '../../../../apis/base/register'
export default {
    name: 'PayStep1',
    components: {
        ImageManager,
        DateRange
    },
    data () {
        return {
            idCardFace: [],
            idCardBack: [],
            idCartTime: [],
            isLongTime: false,
            form: {
                idCardCopy: '',
                idCardCopyUrl: '',
                idCardNational: '',
                idCardNationalUrl: '',
                idCardName: '',
                idCardNumber: '',
                idCardValidTimeBegin: '',
                idCardValidTimeEnd: ''
            },
            rules: {
                idCardCopyUrl: [{ required: true, message: '请上传身份证人像面照片', trigger: 'blur' }],
                idCardNationalUrl: [{ required: true, message: '请上传身份证国徽面照片', trigger: 'blur' }],
                idCardName: [
                    { required: true, message: '请输入法人姓名', trigger: 'blur' },
                    { min: 1, max: 20, message: '姓名最多可输入20个字符', trigger: 'blur' }
                ],
                idCardNumber: [
                    { required: true, message: '请输入法人身份证号码', trigger: 'blur' },
                    { validator: testIdCard, message: '身份证号格式错误', trigger: 'blur' }
                ],
                idCardValidTimeBegin: [{ required: true, message: '请选择身份证有效期', trigger: 'blur' }]
            }
        }
    },
    props: {
        detail: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    watch: {
        detail: {
            handler (val) {
                const {
                    idCardCopy = '',
                    idCardCopyUrl = '',
                    idCardNational = '',
                    idCardNationalUrl = '',
                    idCardName = '',
                    idCardNumber = '',
                    idCardValidTimeBegin = '',
                    idCardValidTimeEnd = ''
                } = val
                this.setIdCardTime(idCardValidTimeBegin, idCardValidTimeEnd)
                if (idCardCopyUrl) this.idCardFace = [idCardCopyUrl]
                if (idCardNationalUrl) this.idCardBack = [idCardNationalUrl]
                this.form = {
                    idCardCopy,
                    idCardCopyUrl,
                    idCardNational,
                    idCardNationalUrl,
                    idCardName,
                    idCardNumber,
                    idCardValidTimeBegin,
                    idCardValidTimeEnd
                }
            },
            immediate: true
        }
    },
    methods: {
        async sendImageToWeixin (files = [], field) {
            try {
                for (const file of files) {
                    if (!file) continue
                    const { result } = await sendImageToWeixin(file)
                    this.form[field] = result
                }
            } catch (e) {
                throw e
            }
        },
        dateChange ({ start, end }) {
            this.form.idCardValidTimeBegin = start ? start.split(' ')[0] : ''
            this.form.idCardValidTimeEnd = end ? end.split(' ')[0] : ''
        },
        // 识别身份证正面
        async idCardFaceChange (val) {
            this.form.idCardCopyUrl = val[0] || ''
            this.idCardFace = val
            if (val[0]) {
                try {
                    const { result } = await idCardSide('front', val[0])
                    const { idno, name } = result.idCardFrontModel
                    this.form.idCardNumber = idno
                    this.form.idCardName = name
                } catch (e) {
                    throw e
                }
            } else {
                this.form.idCardCopy = ''
            }
        },
        // 识别身份证背面
        async idCardBackChange (val) {
            this.form.idCardNationalUrl = val[0] || ''
            this.idCardBack = val
            if (val[0]) {
                try {
                    const { result } = await idCardSide('back', val[0])
                    const { dateOfIssue, expirationDate } = result.idCardBackModel || {}
                    this.setIdCardTime(dateOfIssue, expirationDate)
                } catch (e) {
                    throw e
                }
            } else {
                this.form.idCardNational = ''
            }
        },
        isLongTimeChange (val) {
            this.form.idCardValidTimeEnd = val ? '长期' : ''
        },
        async setIdCardTime (start, end) {
            if (!start || !end) {
                return
            }
            this.idCartTime = []
            start = moment(start).format('YYYY-MM-DD')
            // 长期的显示方式
            if (end.indexOf('期') > -1) {
                this.isLongTime = true
                await this.$nextTick()
                this.form.idCardValidTimeBegin = start !== 'Invalid Date' ? start : ''
                this.form.idCardValidTimeEnd = '长期'
                return
            }
            end = moment(end).format('YYYY-MM-DD')
            if (start !== 'Invalid Date') {
                this.idCartTime.push(start)
                this.form.idCardValidTimeBegin = start
            }
            if (end !== 'Invalid Date') {
                this.idCartTime.push(end)
                this.form.idCardValidTimeEnd = end
            }
        },
        async submit () {
            try {
                await this.$refs.form.validate()
                return this.form
            } catch (e) {
                if (e) throw e
                return false
            }
        }
    }
}
</script>

<style module lang="scss">
</style>
