<template>
    <div>
        <div class="wrap">
            <el-form label-width="150px" :model="form" :rules="rules" ref="ruleForm" label-position="left" class="main-form">
                <div class="content-title">
                    活动设置
                </div>
                <el-form-item label="公众号名称" prop="name">
                    <el-input
                        maxlength="15"
                        show-word-limit
                        style="width: 350px"
                        v-model="form.name"
                        clearable
                        placeholder="请输入公众号名称或简称"
                    />
                    <span class="form-item-tips">
                        （至多可输入15个字）
                    </span>
                </el-form-item>
                <el-form-item prop="qrCodeImgUrl">
                    <div slot="label">
                        公众号二维码<span class="red">*</span>
                    </div>
                    <UploadImage
                        need-edit
                        v-model="imageList"
                        :width="300"
                        :height="300"
                        :count="1"
                        @change="changeQrCodeImgUrl"
                    />
                    <span class="purchase-sort-description">（请上传单独的二维码图片即可）</span>
                </el-form-item>
                <el-form-item label="引导关注话术" prop="description">
                    <el-input
                        maxlength="20"
                        show-word-limit
                        style="width: 350px"
                        v-model="form.description"
                        clearable
                        placeholder="这个公众号好精彩，你不得不关注"
                    />
                    <span class="form-item-tips">
                        （至多可输入20个字）
                    </span>
                </el-form-item>
                <el-form-item label="展示区域" prop="regionScope">
                    <el-checkbox-group v-model="form.regionScope">
                        <el-checkbox label="1">
                            商城首页
                        </el-checkbox>
                        <el-checkbox label="2">
                            商品详情页底部
                        </el-checkbox>
                        <el-checkbox label="3">
                            直播界面
                        </el-checkbox>
                    </el-checkbox-group>
                    <el-button type="text" @click="handleShowPreview">
                        预览展示效果
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="add-btn-wrap">
            <el-button round @click="cancel">
                取消
            </el-button>
            <el-button round type="primary" :loading="loading" @click="save">
                保存
            </el-button>
        </div>
        <MpWeixinPreview :show.sync="showPreview" :qr-code-url="this.form.qrCodeImgUrl" />
    </div>
</template>

<script>
import UploadImage from '../../../../components/common/file/Image-Manager.vue'
import MpWeixinPreview from './Preview'
import { mpWeixinDetail, addMmpWeixin, updateMmpWeixin } from '../../../../apis/marketing-manage/mp-weixin'
export default {
    name: 'Add',
    components: {
        UploadImage,
        MpWeixinPreview
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        const validatePass = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请上传公众号二维码'))
            }
            callback()
        }
        const validateEmoji = (rule, value, callback) => {
            if (value) {
                if (value.match(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g)) {
                    callback(new Error('不支持输入表情符号'))
                }
                callback()
            }
        }
        return {
            loading: false,
            form: {
                id: '',
                name: '',
                qrCodeImgUrl: '',
                description: '',
                regionScope: []
            },
            imageList: [],
            showPreview: false,
            rules: {
                name: [{ required: true, message: '公众号名称不能为空', trigger: 'blur' },
                    { validator: validateEmoji, trigger: 'blur' }],
                qrCodeImgUrl: [{ validator: validatePass, trigger: 'blur' }],
                description: [{ required: true, message: '引导关注话术不能为空', trigger: 'blur' },
                    { validator: validateEmoji, trigger: 'blur' }],
                regionScope: [{ required: true, message: '请至少选择一个展示区域', trigger: 'change' }]
            }
        }
    },
    async created () {
        if (this.id) {
            const { result } = await mpWeixinDetail(this.id)
            this.form = {
                id: result.id,
                name: result.name,
                qrCodeImgUrl: result.qrCodeImgUrl,
                description: result.description,
                regionScope: result.regionScope ? result.regionScope.split(',') : []
            }
            this.imageList = [result.qrCodeImgUrl]
        } else {
            this.form = {
                id: '',
                name: '',
                qrCodeImgUrl: '',
                description: '',
                regionScope: []
            }
        }
    },
    methods: {
        changeQrCodeImgUrl (val) {
            this.imageList = val
            this.form.qrCodeImgUrl = this.imageList[0] || ''
            this.$refs.ruleForm.clearValidate('qrCodeImgUrl')
        },
        async save () {
            try {
                this.loading = true
                await this.$refs.ruleForm.validate()
                this.form.regionScope = this.form.regionScope.length ? this.form.regionScope.join(',') : ''
                if (this.id) {
                    await updateMmpWeixin(this.form)
                } else {
                    await addMmpWeixin(this.form)
                }
                this.$router.back()
                this.$success('保存成功')
            } catch (e) {
                throw e
            } finally {
                this.loading = false
            }
        },
        cancel () {
            this.$router.back()
        },
        handleShowPreview () {
            if (this.form.qrCodeImgUrl) {
                this.showPreview = true
            } else {
                this.$warning('请先上传公众号二维码')
            }
        }
    },
    beforeRouteLeave (to, from, next) {
        if (to.name !== 'MpWeixinList') {
            this.$confirm({
                title: '确定离开该页面吗？',
                message: '请确定您所作的修改已经保存！'
            }).then(() => {
                next()
            })
        } else {
            next()
        }
    }
}
</script>

<style lang="scss" scoped>
    .content-title {
        margin-bottom: 24px;
        height: 60px;
        line-height: 60px;
        padding-left: 30px;
        font-size: 14px;
        font-weight: bold;
    }
    .main-form {
        ::v-deep .el-form-item__label {
            padding-left: 30px !important;
        }
    }
    .btn-box {
        position: absolute;
        left: -10px;
        right: -10px;
        bottom: -10px;
        padding: 16px 0;
        background: #fff;
        text-align: center;
        button{
            min-width: 90px;
        }
    }
</style>
