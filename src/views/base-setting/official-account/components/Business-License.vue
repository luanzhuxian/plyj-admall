<template>
    <div class="business-license">
        <h4>商户信息&nbsp;&nbsp;&nbsp;&nbsp;<span class="tip">请上传“营业执照”，需要检章齐全，当年注册除外</span></h4>

        <el-form
            label-width="150px"
            label-position="left"
            ref="form"
            :model="form"
            :rules="rules"
        >
            <el-form-item label="主体类目" prop="organizationType">
                <p class="gray-2">
                    请在下方正确选择经营类目后，按提示继续填写所需申请资料
                </p>
                <el-select
                    v-model="form.organizationType"
                    @change="organizationTypeChange"
                >
                    <el-option
                        v-for="(item, index) of organizationTypes"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
                <el-link class="ml-24" type="primary" target="_blank" :underline="false" href="https://kf.qq.com/faq/180910IBZVnQ180910naQ77b.html">
                    如何选择类目？
                </el-link>
                <p class="tip">
                    (请根据你的营业执照和实际售卖商品来选择主体和类目，审核通过后类目不可修改)
                </p>
            </el-form-item>

            <el-form-item label="登记证书照片" prop="businessLicenseCopyUrl">
                <p class="tip">
                    该证书需与申请服务号申请证书一致
                </p>
                <p class="tip">
                    需年检章齐全 （当年成立公司除外）
                </p>
                <p class="tip">
                    必须为彩色图片大小不超过2M，文件格式为png、jpeg、jpg、bmp
                </p>
                <ImageManager
                    v-model="license"
                    :size="1"
                    :count="1"
                    hide-edit-btn
                    @change="recognition"
                    @fileChange="blobList => sendImageToWeixin(blobList, 'businessLicenseCopy')"
                    @remove="removeLicense"
                />
            </el-form-item>

            <el-form-item label="登记证书号码" prop="businessLicenseNumber">
                <el-input placeholder="请输入证书号码" v-model.trim="form.businessLicenseNumber" />
                <p class="tip">
                    您输入的是18位统一社会信用代码，无需再提交组织机构代码证
                </p>
            </el-form-item>

            <el-form-item label="法人姓名" prop="legalPerson">
                <el-input placeholder="请输入法人姓名" v-model.trim="form.legalPerson" />
            </el-form-item>

            <el-form-item label="营业期限" prop="certTimeStart">
                <div class="flex">
                    <DateRange
                        :init="businessLicenseTime"
                        v-if="!isLongTime"
                        @change="dateChange"
                    />
                    <el-date-picker
                        v-else
                        type="date"
                        placeholder="开始日期"
                        v-model="form.certTimeStart"
                        value-format="yyyy-MM-dd"
                        style="width: 184px"
                        :editable="false"
                    />
                    <el-checkbox v-model="isLongTime" class="ml-20" @change="longTimeChange">
                        长期
                    </el-checkbox>
                </div>
                <p class="tip">
                    （证件有效期限需与上传文件上所示期限一致，若有效期限超过2100年，请选择“长期”）
                </p>
            </el-form-item>

            <el-form-item label="商户名称" prop="entName">
                <el-input placeholder="请输入名称" v-model.trim="form.entName" />
            </el-form-item>

            <el-form-item label="注册地址" prop="companyAddress">
                <el-input placeholder="请输入地址" v-model.trim="form.companyAddress" />
                <p class="tip">
                    注册地址需与营业执照登记住所一致
                </p>
            </el-form-item>

            <el-form-item label="经营范围" prop="entBusScope">
                <el-input
                    type="textarea"
                    placeholder="请输入经营范围"
                    v-model="form.entBusScope"
                    :rows="6"
                />
            </el-form-item>

            <el-form-item label="所属行业" prop="settlementId">
                <el-select
                    v-model="qualificationTypeId"
                    placeholder="请选择所属行业"
                    :disabled="!industryInvolved.length"
                    @change="qualificationTypeChange"
                >
                    <el-option
                        v-for="item in industryInvolved"
                        :key="item.subQualificationType"
                        :label="item.subQualificationType"
                        :value="item.id"
                    />
                </el-select>
                <template v-if="currentQualificationType">
                    <p class="tip" v-text="currentQualificationType.settlementRules" />
                    <pre class="tip" v-text="currentQualificationType.qualificationType" />
                    <pre class="tip" v-if="currentQualificationType.qualifications.length > 1" v-text="`需要特殊资质：\n${ currentQualificationType.qualifications }`" />
                </template>
            </el-form-item>

            <el-form-item label="特殊资质">
                <ImageManager
                    v-model="form.qualificationsUrl"
                    :size="1"
                    :count="5"
                    multiple
                    hide-edit-btn
                    @remove="removeQualification"
                    @fileChange="(blobList) => sendImageToWeixin(blobList, 'qualifications')"
                />
                <p class="tip">
                    须为彩色照片且小于2M，文件格式为bmp, png, jpeg, jpg
                </p>
                <p class="tip">
                    若办学许可证办理中等特殊情况，请上传法定代表人或负责人亲笔签属的承诺函扫描件
                    <el-button type="text" @click="downloadTemplate">
                        (下载模板)
                    </el-button>
                </p>
                <p class="tip">
                    亲笔签名的承诺函内容清晰可辨，不得有涂污，破损，字迹不清晰现象
                </p>
            </el-form-item>

            <el-form-item label="补充材料">
                <ImageManager
                    :size="1"
                    :count="5"
                    multiple
                    v-model="form.businessAdditionPicsUrl"
                    hide-edit-btn
                    @remove="removeBusinessAddition"
                    @fileChange="(blobList) => sendImageToWeixin(blobList, 'businessAdditionPics')"
                />
                <span class="tip">根据实际审核需求，额外上传补充材料，例如上传过有效期内的身份证等</span>
            </el-form-item>

            <el-form-item label="补充说明">
                <el-input
                    type="textarea"
                    placeholder="请输入补充说明"
                    :rows="6"
                    v-model.trim="form.businessAdditionDesc"
                />
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import ImageManager from '../../../../components/common/file/Image-Manager.vue'
import moment from 'moment'
import {
    getBusLicenseInfo,
    sendImageToWeixin,
    getTradeByMainPart
} from '../../../../apis/base/register'
import { downloadFile } from '../../../../assets/ts/upload'
export default {
    name: 'PayStep2',
    components: {
        ImageManager
    },
    data () {
        return {
            form: {
                organizationType: 'SUBJECT_TYPE_ENTERPRISE',
                businessLicenseCopy: '',
                businessLicenseCopyUrl: '',
                businessLicenseNumber: '',
                legalPerson: '',
                certTimeStart: '',
                certTimeEnd: '',
                entName: '',
                companyAddress: '',
                entBusScope: '',
                qualificationType: '',
                settlementId: '',
                qualifications: [],
                qualificationsUrl: [],
                businessAdditionPics: [],
                businessAdditionPicsUrl: [],
                businessAdditionDesc: ''
            },
            rules: {
                organizationType: [{ required: true, message: '请选择主体类目', trigger: 'blur' }],
                businessLicenseCopyUrl: [{ required: true, message: '请上传营业执照照片', trigger: 'blur' }],
                businessLicenseNumber: [{ required: true, message: '请输入营业执照号', trigger: 'blur' }],
                legalPerson: [{ required: true, message: '请输入法人姓名', trigger: 'blur' }],
                certTimeStart: [{ required: true, message: '请选择营业执照有效期', trigger: 'blur' }],
                entName: [{ required: true, message: '请输入商户名称', trigger: 'blur' }],
                // legalPerson: [{ required: true, message: '请输入法定代表人姓名', trigger: 'blur' }],
                companyAddress: [{ required: true, message: '请输入注册地址', trigger: 'blur' }],
                entBusScope: [{ required: true, message: '请输入经营范围', trigger: 'blur' }],
                qualificationsUrl: [{ required: true, message: '请上传让特殊资质', trigger: 'blur' }],
                settlementId: [{ required: true, message: '请选择所属行业', trigger: 'blur' }]
            },
            // 当前选择的所属行业数据id
            qualificationTypeId: '',
            industryInvolved: [],
            settle: true,
            license: [],
            businessLicenseTime: [],
            isLongTime: false,
            organizationTypes: [
                {
                    label: '企业',
                    value: 'SUBJECT_TYPE_ENTERPRISE'
                },
                {
                    label: '个体工商户',
                    value: 'SUBJECT_TYPE_INDIVIDUAL'
                },
                {
                    label: '民办非企业',
                    value: 'SUBJECT_TYPE_OTHERS'
                }
            ]
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
    computed: {
        currentQualificationType () {
            return this.industryInvolved.find(item => item.id === this.qualificationTypeId) || null
        }
    },
    watch: {
        detail: {
            handler (val) {
                const {
                    organizationType = '',
                    businessLicenseCopy = '',
                    businessLicenseCopyUrl = '',
                    businessLicenseNumber = '',
                    certTimeStart = '',
                    certTimeEnd = '',
                    entName = '',
                    companyAddress = '',
                    entBusScope = '',
                    qualifications = [],
                    qualificationsUrl = [],
                    businessAdditionPics = [],
                    businessAdditionPicsUrl = [],
                    businessAdditionDesc = '',
                    legalPerson = '',
                    qualificationType = '',
                    business = ''
                } = val
                this.form = {
                    organizationType,
                    businessLicenseCopy,
                    businessLicenseCopyUrl,
                    businessLicenseNumber,
                    certTimeStart,
                    certTimeEnd,
                    entName,
                    companyAddress,
                    entBusScope,
                    qualifications,
                    qualificationsUrl,
                    businessAdditionPics,
                    businessAdditionPicsUrl,
                    businessAdditionDesc,
                    legalPerson,
                    qualificationType,
                    settlementId: business
                }
                if (businessLicenseCopyUrl) this.license = [businessLicenseCopyUrl]
                this.setTime(certTimeStart, certTimeEnd)
                this.setIndustryInvolved(organizationType, qualificationType)
            },
            immediate: true
        }
    },
    methods: {
    // 识别营业执照
        async recognition (val) {
            this.form.businessLicenseCopyUrl = val[0] || ''
            if (!val[0]) return
            try {
                const data = await getBusLicenseInfo(val[0])
                if (data.result) {
                    const {
                        address,
                        businessScope,
                        companyName,
                        establishDate,
                        validityPeriod,
                        socialCreditCode,
                        legalPerson
                    } = data.result
                    const form = this.form
                    form.companyAddress = address
                    form.businessLicenseNumber = socialCreditCode
                    form.entBusScope = businessScope
                    form.entName = companyName
                    form.legalPerson = legalPerson
                    this.setTime(establishDate, validityPeriod)
                }
            } catch (e) {
            }
        },
        async organizationTypeChange (val) {
            try {
                await this.setIndustryInvolved(val)
            } catch (e) {
                throw e
            }
        },

        /**
       * 根据主题类目动态设置运营场景
       * @param organizationType {string} 主体类目
       * @param [qualificationType] {string} 所属行业名称
       * @return {Promise<void>}
       */
        async setIndustryInvolved (organizationType, qualificationType) {
            this.qualificationTypeId = ''
            try {
                const { result } = await getTradeByMainPart(organizationType)
                this.industryInvolved = result
                if (qualificationType) {
                    const selected = result.find(item => item.subQualificationType === qualificationType)
                    this.qualificationTypeId = selected.id
                }
            } catch (e) {
                throw e
            }
        },
        // 所属行业改变
        qualificationTypeChange () {
            this.form.settlementId = this.currentQualificationType.settlementId
            this.form.qualificationType = this.currentQualificationType.subQualificationType
        },
        setTime (establishDate, validityPeriod) {
            const start = moment(establishDate).format('YYYY-MM-DD')
            const end = moment(validityPeriod).format('YYYY-MM-DD')
            this.businessLicenseTime = []
            if (validityPeriod === '长期' && start !== 'Invalid date') {
                this.form.certTimeEnd = '长期'
                this.form.certTimeStart = start
                this.isLongTime = true
                return
            }
            if (start !== 'Invalid date' && end !== 'Invalid date') {
                this.businessLicenseTime.push(start)
                this.businessLicenseTime.push(end)
                this.form.certTimeEnd = end
                this.form.certTimeStart = start
                this.isLongTime = false
            }
        },
        async sendImageToWeixin (files, field) {
            try {
                for (const file of files) {
                    const data = await sendImageToWeixin(file)
                    if (field === 'qualifications' || field === 'businessAdditionPics') {
                        this.form[field].push(data.result)
                    } else {
                        this.form[field] = data.result
                    }
                }
            } catch (e) {
                throw e
            }
        },
        dateChange ({ start, end }) {
            this.form.certTimeStart = start ? start.split(' ')[0] : ''
            this.form.certTimeEnd = end ? end.split(' ')[0] : ''
        },
        longTimeChange (val) {
            this.form.certTimeEnd = val ? '长期' : ''
        },
        // 删除补充材料
        removeBusinessAddition (url, index) {
            this.form.businessAdditionPics.splice(index, 1)
        },
        // 删除特殊资质
        removeQualification (url, index) {
            this.form.qualifications.splice(index, 1)
        },
        removeLicense () {
            this.form.businessLicenseCopyUrl = ''
            this.form.businessLicenseCopy = ''
        },
        async submit () {
            try {
                await this.$refs.form.validate()
                return this.form
            } catch (e) {
                if (e) throw e
                return false
            }
        },
        downloadTemplate () {
            downloadFile('https://mallcdn.youpenglai.com/static/download/wechat-pay-template.docx', '微信支付-承诺函（模板）.docx')
        }
    }
}
</script>

<style module lang="scss">
</style>
