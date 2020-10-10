<template>
    <div :class="$style.accountSet">
        <pl-tabs
            :tabs="tabs"
        />
        <el-form
            label-width="103px"
            class="mt-30"
        >
            <el-form-item label="头像：" :class="$style.avatar">
                <ImageManage
                    need-edit
                    :width="300"
                    :height="300"
                    v-model="avatar"
                    :count="1"
                    @change="avatarChange"
                />
            </el-form-item>
            <div :class="$style.content">
                <el-form-item label="姓名：">
                    <span v-text="accountInfo.name" />
                    <el-button @click="updateName = true" type="text">修改</el-button>
                </el-form-item>
                <el-form-item label="手机号码：">
                    <span>{{ accountInfo.mobile | formatAccount }}</span>
                    <el-button @click="updateMobileHandler" type="text">修改</el-button>
                </el-form-item>
                <el-form-item label="账户：">
                    <span v-text="accountInfo.account" />
                </el-form-item>
                <el-form-item label="登录密码：">
                    <span>已设置，可通过账号密码登录</span>
                    <el-button type="text" @click="modify">更换</el-button>
                </el-form-item>
                <el-form-item label="账号绑定：">
                    <div v-if="accountInfo.unionId">
                        <div>绑定后通过第三方帐号快速扫码登录</div>
                        <div :class="$style.wechat">
                            <img width="24" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/wechat.png" alt="">
                            <span class="ml-10" v-text="accountInfo.wxNickName" />
                            <el-button type="text" @click="unBind">解绑微信</el-button>
                        </div>
                    </div>
                    <div v-else>
                        <div>绑定后通过第三方帐号快速扫码登录</div>
                        <div :class="$style.wechat">
                            <img width="24" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/wechat.png" alt="">
                            <el-button type="text" @click="bingWechat">绑定微信</el-button>
                        </div>
                    </div>
                </el-form-item>
            </div>
        </el-form>

        <!-- 修改姓名 -->
        <el-dialog
            title="修改姓名"
            width="480px"
            :visible.sync="updateName"
        >
            <el-form ref="form_name" :model="form" :rules="rules">
                <el-form-item
                    label-width="80px"
                    label="姓名："
                    prop="name"
                >
                    <el-input v-model="form.name" style="width: 240px" />
                </el-form-item>
            </el-form>
            <el-button :class="$style.saveBtn" type="primary" round @click="save('name')">保存</el-button>
        </el-dialog>

        <!-- 修改手机 -->
        <el-dialog
            title="更换手机号"
            width="480px"
            :visible.sync="updateMobile"
        >
            <el-form
                ref="form_mobile"
                :model="form"
                :rules="rules"
                label-width="90px"
            >

                <el-form-item
                    label="手机号："
                    prop="mobile"
                >
                    <el-input v-model="form.mobile" style="width: 240px" placeholder="请输入手机号" />
                </el-form-item>

                <el-form-item
                    label="验证码："
                    prop="verifyCode"
                >
                    <el-input
                        v-model="form.verifyCode"
                        style="width: 240px"
                        placeholder="请输入验证码"
                        :class="$style.verifyCode"
                    >
                        <el-button slot="append" type="text">获取验证码</el-button>
                    </el-input>
                </el-form-item>
            </el-form>
            <el-button :class="$style.saveBtn" type="primary" round @click="save('mobile')" :loading="loading">保存</el-button>
        </el-dialog>

        <!-- 绑定微信 -->
        <el-dialog
            title="绑定微信"
            width="480px"
            :visible.sync="bindWechat"
        >
            <div :id="$style.bindWechatContainer" :class="$style.bindWechatContainer" />
        </el-dialog>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import ImageManage from '../../components/common/file/Image-Manager.vue'
import { namespace, State } from 'vuex-class'
import { updateAvatarOrName, updateMobile, WxBind, WxUnBind } from '../../apis/account-set'
import SendCode from './../../components/common/Send-Code.vue'
import validateIdentity from '../../components/common/validate-identity'
import { testName, testPhone } from '../../assets/ts/validate'
import { Watch } from 'vue-property-decorator'
import { sessionEnum } from '@/enum/storage'
const userModule = namespace('user')
@Component({
    components: {
        ImageManage,
        SendCode
    }
})
export default class AccountSet extends Vue {
    private updateName = false
    private updateMobile = false
    private bindWechat = false
    private loading = false

    private form = {
        name: '',
        mobile: '',
        verifyCode: '',
        avatar: ''
    }

    private rules = {
        name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { validator: testName(20), message: '请输入1~20位英文或汉字的组合', trigger: 'blur' }
        ],
        mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: testPhone, message: '手机号格式错误', trigger: 'blur' }
        ],
        verifyCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { max: 4, message: '请输入4位数字验证码', trigger: 'blur' }
        ]
    }

    private tabs = [{
        name: '',
        label: '账号设置'
    }]

    // 头像
    avatar: string[] = []

    @userModule.Getter('accountInfo') accountInfo!: DynamicObject
    @userModule.Action('GET_ACCOUNT_INFO') getAccountInfo!: Function
    @userModule.Action('AGENCY_USER_INFO') getAgencyUserInfo!: Function
    @State('bindWechatInfo') bindWechatInfo!: DynamicObject
    @State('weChatStyle') weChatStyle!: string
    @Watch('accountInfo', { immediate: true })
    onAccountInfoChange (val: DynamicObject) {
        const avatar = val.headImgUrl
        this.avatar = avatar ? [avatar] : []
    }

    async mounted () {
        const wechatCode = sessionStorage.getItem(sessionEnum.redirectCode)
        if (wechatCode) {
            WxBind(wechatCode)
                .then(() => {
                    sessionStorage.removeItem(sessionEnum.redirectCode)
                    sessionStorage.removeItem(sessionEnum.redirectState)
                    this.$alert('绑定微信成功！')
                    this.getAccountInfo()
                })
                .catch(err => {
                    this.$alert({
                        title: '绑定失败',
                        message: JSON.parse(err.message).message
                    })
                })
        }
    }

    // 修改头像
    async avatarChange (imgs: string[]) {
        if (imgs[0]) {
            this.form.avatar = imgs[0] || ''
            await this.save('avatar')
        }
    }

    validate (field1: string, field2?: string) {
        return new Promise((resolve, reject) => {
            (this.$refs[`form_${ field1 }`] as HTMLFormElement).validateField(field2 || field1, (err: string) => {
                if (err) {
                    reject(false)
                } else {
                    resolve()
                }
            })
        })
    }

    async updateMobileHandler () {
        await validateIdentity(this.accountInfo.mobile)
        this.updateMobile = true
    }

    /**
     * 保存修改
     * @param field {string} 保存的字段名称
     */
    async save (field: string) {
        try {
            this.loading = true
            let result = false
            switch (field) {
                // 修改手机号
                case 'mobile':
                    await this.validate(field, 'mobile')
                    await this.validate(field, 'verifyCode');
                    ({ result } = await updateMobile({
                        mobile: this.form.mobile,
                        verifyCode: this.form.verifyCode
                    }))
                    this.updateMobile = false
                    break
                case 'name':
                    await this.validate(field);
                    ({ result } = await updateAvatarOrName({
                        name: this.form.name
                    }))
                    this.updateName = false
                    break
                case 'avatar':
                    ({ result } = await updateAvatarOrName({
                        headImgUrl: this.form.avatar
                    }))
            }
            if (result) {
                this.$success('修改成功')
                await this.getAgencyUserInfo()
                await this.getAccountInfo()
            } else {
                this.$error('修改失败')
            }
        } catch (e) {
            throw e
        } finally {
            this.loading = false
        }
    }

    // 绑定微信
    async bingWechat () {
        await validateIdentity(this.accountInfo.mobile)
        const { appId, redirectUrl } = this.bindWechatInfo
        const state = Date.now().toString(16)
        sessionStorage.setItem('login_state', state)
        this.bindWechat = true
        await this.$nextTick()
        /* eslint-disable */
        new window.WxLogin({
            self_redirect: false,
            id: (this as any).$style.bindWechatContainer,
            appid: appId,
            scope: 'snsapi_login',
            redirect_uri: `${ redirectUrl }/account-set`,
            state,
            style: 'black',
            href: this.weChatStyle
        })
    }

    // 解绑微信
    async unBind () {
        await validateIdentity(this.accountInfo.mobile)
        await this.$confirm({
            title: '您确认解绑微信吗？',
            message: '解绑后，您可以重新绑定微信号'
        })
        await WxUnBind()
    }

    // 修改密码
    modify () {
        this.$router.push({ name: 'ModifyPassword' })
    }
}
</script>

<style module lang="scss">
    .account-set {
        width: 1000px;
        margin: 10px auto;
        padding: 26px 32px 110px;
        border: 1px solid $--border-color;
        background-color: #fff;
    }
    .avatar {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        > div {
            margin-left: 0!important;
        }
    }
    .content {
        background-color: #F5F6FA;
        padding-top: 18px;
        border-radius: 10px;
        overflow: hidden;
    }
    .wechat {
        display: flex;
        align-items: center;
    }
    .save-btn {
        display: block;
        margin: 36px auto 14px;
        min-width: 106px;
    }
    .verify-code {
        > input {
            border-right: none !important;
        }
        > div {
            > button {
                color: $--color-primary-blue !important;
            }
        }
    }
    .bind-wechat-container {
        height: 260px !important;
        text-align: center;
        overflow: hidden;
    }
</style>
