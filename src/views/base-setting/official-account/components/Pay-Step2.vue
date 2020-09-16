<template>
    <div class="wechat-pay-step2">
        <h4>经营信息</h4>

        <el-form
            label-width="150px"
            label-position="left"
            :model="form"
            :rules="rule"
            ref="form"
        >
            <el-form-item label="商户简称" prop="merchantShortname">
                <el-input
                    v-model.trim="form.merchantShortname"
                    placeholder="请输入商户简称"
                />
                <span class="tip ml-10">若营业执照经营范围无教育培训，简称请勿填写教育和培训词汇，该简称将在微信支付完成页面商家展示需与商家实际经营场景相符</span>
            </el-form-item>

            <el-form-item label="客服电话" prop="servicePhone">
                <el-input
                    v-model.trim="form.servicePhone"
                    placeholder="请输入客服电话"
                />
                <p class="tip">
                    请正确填写客服电话，座机务必填写区号，格式如（座机：0755-XXXXXXXX；手机：136XXXXXXXX；400电话：400XXXXXXX）
                </p>
            </el-form-item>

            <el-form-item label="经营场景" prop="businessScene">
                <el-checkbox-group v-model="form.businessScene" @change="businessSceneChange">
                    <el-checkbox
                        v-for="item of businessSceneTypes"
                        :key="item.value"
                        :label="item.value"
                    >
                        {{ item.label }}
                    </el-checkbox>
                </el-checkbox-group>
                <p class="tip">
                    请勾选实际售卖商品/提供服务场景（至少一项），以便为你开通需要的支付权限
                </p>
                <p class="tip">
                    建议只勾选目前必须的场景，以便尽快通过入驻审核，其他支付权限你可在入驻后再根据实际需要发起申请
                </p>
            </el-form-item>

            <template v-if="form.businessScene.includes('SALES_SCENES_STORE')">
                <h4>线下门店</h4>
                <el-form-item label="门店名称" prop="storeName">
                    <el-input
                        v-model.trim="form.storeName"
                        placeholder="请输入门店名称"
                    />
                </el-form-item>

                <el-form-item label="门店地址" prop="storeAddressCode">
                    <CityPickerWexin v-model="form.storeAddressCode" :default="defaultAddress" />
                    <el-input class="mt-10" v-model="form.storeStreet" placeholder="请输入详情地址" />
                </el-form-item>

                <el-form-item label="门店门口照片" prop="indoorPicUrl">
                    <ImageManager
                        :size="1"
                        :count="1"
                        v-model="indoorImage"
                        @change="indoorChange"
                        @fileChange="blobList => sendImageToWeixin(blobList[0], 'indoorPic')"
                        hide-edit-btn
                    />
                </el-form-item>

                <el-form-item label="店内环境照片" prop="storeEntrancePicUrl">
                    <ImageManager
                        :size="1"
                        :count="1"
                        v-model="storeEntranceImage"
                        @change="storeEntranceChange"
                        @fileChange="blobList => sendImageToWeixin(blobList[0], 'storeEntrancePic')"
                        hide-edit-btn
                    />
                </el-form-item>
            </template>

            <template v-if="form.businessScene.includes('SALES_SCENES_MP')">
                <h4>公众号</h4>
                <el-form-item label="公众号页面截图" prop="mpPicsUrl">
                    <ImageManager
                        :size="1"
                        v-model="form.mpPicsUrl"
                        @remove="removeMpPic"
                        @fileChange="blobList => sendMpPicToWeixin(blobList)"
                        hide-edit-btn
                        multiple
                        :count="5"
                    />
                </el-form-item>
            </template>
        </el-form>
    </div>
</template>

<script>
import {
    sendImageToWeixin,
    wechatPayStep2
} from '../../../../apis/base/register'
import ImageManager from '../../../../components/file/Image-Manager.vue'
import CityPickerWexin from './City-Picker-Wexin.vue'
export default {
    name: 'WechatPayStep2',
    components: {
        ImageManager,
        CityPickerWexin
    },
    data () {
        const testBusinessScene = (rule, value, callback) => {
            if (!value || !value.length) {
                callback(new Error('请选择经营场景'))
                return
            }
            callback()
        }
        const testMpPicsUrl = (rule, value, callback) => {
            if (this.form.businessScene.includes('SALES_SCENES_MP') && (!value || !value.length)) {
                callback(new Error('请上传公众号页面截图，最多5张'))
                return
            }
            callback()
        }
        this.testMpPicsUrl = testMpPicsUrl
        return {
            storeEntranceImage: [],
            indoorImage: [],
            form: {
                merchantShortname: '',
                storeName: '',
                storeAddressCode: '',
                storeStreet: '',
                storeEntrancePic: '',
                storeEntrancePicUrl: '',
                indoorPic: '',
                indoorPicUrl: '',
                businessScene: ['SALES_SCENES_STORE'],
                servicePhone: '',
                mpPics: [],
                mpPicsUrl: []
            },
            rule: {
                merchantShortname: [{ required: true, message: '请输入商户简称', trigger: 'blur' }],
                storeName: [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
                storeStreet: [{ required: true, message: '请输入门店街道名称', trigger: 'blur' }],
                indoorPicUrl: [{ required: true, message: '请上传店门门口照片', trigger: 'blur' }],
                storeEntrancePicUrl: [{ required: true, message: '请上传店内照片', trigger: 'blur' }],
                storeAddressCode: [{ required: true, message: '请选择门店地址', trigger: 'blur' }],
                businessScene: [{ validator: testBusinessScene, trigger: 'blur' }],
                mpPicsUrl: [
                    { required: true, message: '请上传微信页面截图', trigger: 'change' },
                    { validator: testMpPicsUrl, trigger: 'change' }
                ],
                servicePhone: [
                    { required: true, message: '请输入客服电话', trigger: 'blur' },
                    { min: 7, max: 20, message: '客服电话最多可输入20位', trigger: 'blur' }
                ]
            },
            businessSceneTypes: [
                {
                    label: '线下门店',
                    value: 'SALES_SCENES_STORE'
                },
                {
                    label: '公众号',
                    value: 'SALES_SCENES_MP'
                }
            ],
            defaultAddress: []
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
                    merchantShortname = '',
                    storeName = '',
                    storeAddressCode = '',
                    storeStreet = '',
                    storeEntrancePic = '',
                    storeEntrancePicUrl = '',
                    indoorPic = '',
                    indoorPicUrl = '',
                    servicePhone = '',
                    storeAddressCode1 = '',
                    storeAddressCode2 = '',
                    storeAddressCode3 = '',
                    businessScene = [],
                    mpPics,
                    mpPicsUrl
                } = val
                this.form = {
                    merchantShortname,
                    storeName,
                    storeAddressCode,
                    storeStreet,
                    storeEntrancePic,
                    storeEntrancePicUrl,
                    indoorPic,
                    indoorPicUrl,
                    servicePhone,
                    businessScene: businessScene.length ? businessScene : ['SALES_SCENES_STORE'],
                    mpPics: mpPics || [],
                    mpPicsUrl: mpPicsUrl || []
                }
                this.defaultAddress = [
                    storeAddressCode1,
                    storeAddressCode2,
                    storeAddressCode3
                ]
                if (storeEntrancePicUrl) this.storeEntranceImage = [storeEntrancePicUrl]
                if (indoorPicUrl) this.indoorImage = [indoorPicUrl]
            },
            immediate: true
        }
    },
    methods: {
        async storeEntranceChange (val) {
            if (!val[0]) {
                this.form.storeEntrancePicUrl = ''
                this.form.storeEntrancePic = ''
                return
            }
            this.form.storeEntrancePicUrl = val[0]
        },
        async indoorChange (val) {
            if (!val[0]) {
                this.form.indoorPicUrl = ''
                this.form.indoorPic = ''
                return
            }
            this.form.indoorPicUrl = val[0]
        },
        async sendImageToWeixin (file, field) {
            if (!file) {
                return
            }
            try {
                const data = await sendImageToWeixin(file)
                this.form[field] = data.result
            } catch (e) {
                throw e
            }
        },
        async sendMpPicToWeixin (files) {
            if (!files.length) {
                return
            }
            const reqs = []
            for (const file of files) {
                reqs.push(sendImageToWeixin(file))
            }
            try {
                const data = await Promise.all(reqs)
                this.form.mpPics = [...this.form.mpPics, ...data.map(item => item.result)]
            } catch (e) {
                throw e
            }
        },
        removeMpPic (url, index) {
            this.form.mpPics.splice(index, 1)
        },
        businessSceneChange (val) {
            const isOffline = val.includes('SALES_SCENES_STORE')
            const isMp = val.includes('SALES_SCENES_MP')
            this.rules = Object.assign({}, this.rules, {
                storeName: [{ required: isOffline, message: '请输入门店名称', trigger: 'blur' }],
                storeStreet: [{ required: isOffline, message: '请输入门店街道名称', trigger: 'blur' }],
                indoorPicUrl: [{ required: isOffline, message: '请上传店内照片', trigger: 'blur' }],
                storeEntrancePicUrl: [{ required: isOffline, message: '请上传店门门口照片', trigger: 'blur' }],
                storeAddressCode: [{ required: isOffline, message: '请选择门店地址', trigger: 'blur' }],
                mpPicsUrl: [
                    { required: isMp, message: '请上传微信页面截图', trigger: 'change' },
                    { validator: this.testMpPicsUrl, trigger: 'change' }
                ]
            })
        },
        async submit () {
            const businessScene = this.form.businessScene
            const haveOffLine = businessScene.includes('SALES_SCENES_STORE')
            const haveMp = businessScene.includes('SALES_SCENES_MP')
            try {
                await this.$refs.form.validate()
                if (!haveOffLine) {
                    // 删除门店信息
                    this.form = Object.assign({}, this.form, {
                        indoorPic: '',
                        indoorPicUrl: '',
                        storeName: '',
                        storeAddressCode: '',
                        storeStreet: '',
                        storeEntrancePic: '',
                        storeEntrancePicUrl: ''
                    })
                    this.storeEntranceImage = []
                    this.indoorImage = []
                }
                if (!haveMp) {
                    // 删除微信公众号数据
                    this.form.mpPics = []
                    this.form.mpPicsUrl = []
                }
                const data = await wechatPayStep2(this.form)
                return data.result
            } catch (e) {
                if (e) throw e
                return false
            }
        }
    }
}
</script>

<style module lang="scss">
  .step3 {
    color: #333;
  }
</style>
