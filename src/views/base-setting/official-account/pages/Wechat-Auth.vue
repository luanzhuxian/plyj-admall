<template>
    <div :class="$style.wechatAuth">
        <template v-if="auditStatus === 'MP_NOT_AUTHORIZED'">
            <div :class="$style.authBtn">
                <strong>· 请使用已认证的微信服务号授权给雅集</strong>
                <el-button type="primary" class="ml-24" @click="auth(false)">
                    立即授权
                </el-button>
            </div>

            <article :class="$style.tips">
                <p>注意：</p>
                <p>
                    1.什么是服务号? 查看如何申请服务号？
                    <el-link type="primary" href="https://kf.qq.com/faq/120911VrYVrA150918fMZ77R.html?scene_id=kf3386" target="_blank">
                        查看
                    </el-link>
                </p>
                <p>2.申请雅集商城的营业资质必须与微信服务号的资质一致 (服务号号申请的营业资质与后期提交资料营业资质相同)</p>
                <p>
                    3.申请雅集的服务号需微信公众平台认证通过, 且在认证有效期三个月以上
                    <el-link type="primary" href="https://kf.qq.com/faq/161219Uj6jQF161219FB3Iz2.html" target="_blank">
                        查看是否认证, 如何认证?
                    </el-link>
                </p>
            </article>
        </template>

        <div :class="$style.wechatInfo" v-else>
            <div :class="$style.baseInfo">
                <img v-imgError :class="$style.logo" :src="weixinInfo.headImg" alt="">
                <div :class="$style.right">
                    <span :class="$style.name" v-text="weixinInfo.nickName" />
                    <span :class="$style.bindTime">主体：{{ weixinInfo.principalName }}</span>
                    <el-button type="text" @click="auth(true)">
                        更换授权服务号
                    </el-button>
                </div>
            </div>

            <article :class="$style.tips">
                <p>特别说明：</p>
                <p>
                    1.若出现服务号与微信支付申请营业执照主体不一致时, 需重新授权服务号, 或重新开通微信支付 (若需要重新开通微信支付, 请联系朋来雅集客服)
                    <el-link type="primary">
                        查看
                    </el-link>
                </p>
                <p>2.若出现服务号底部菜单无法自定义且显示雅集授权, 则需重新授权取消改授权即可</p>
            </article>
        </div>
    </div>
</template>

<script>
import { getAuthUrl, setAuthCode, getWexinInfo } from '../../../../apis/base/register'
import { AGENCY_USER_INFO, WECHAT_PAY_STATUS } from '../../../../store/mutation-type'
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'WechatAuth',
    computed: {
        ...mapGetters({
            auditStatus: 'user/auditStatus',
            mallNumber: 'user/mallNumber'
        })
    },
    data () {
        return {
            weixinInfo: {}
        }
    },
    async created () {
        try {
            await this.setAuthCode()
            await this.getWexinInfo()
        } catch (e) {
            throw e
        }
    },
    async beforeRouteUpdate (to, from, next) {
        next()
        try {
            await this.setAuthCode()
            await this.getWexinInfo()
        } catch (e) {
            throw e
        }
    },
    methods: {
        ...mapActions(['WECHAT_PAY_STATUS', 'AGENCY_USER_INFO']),
        async auth (flag) {
            try {
                if (flag) {
                    await this.$confirm({
                        title: '重新授权',
                        message: '重新授权将影响机构正常使用商城，请谨慎操作，确定重新授权？'
                    })
                }
                const data = await getAuthUrl()
                location.href = data.result
            } catch (e) {
                if (e) throw e
            }
        },
        async setAuthCode () {
            let authCode = this.$route.query.auth_code || ''
            if (authCode) {
                sessionStorage.setItem('authCode', authCode)
                await this.$router.replace({ name: 'WechatAuth' })
                return null
            }
            authCode = sessionStorage.getItem('authCode')
            if (authCode) {
                try {
                    const data = await setAuthCode(this.mallNumber, encodeURIComponent(authCode))
                    if (data.result.authResult) {
                        this.$success('授权成功')
                        await this.$router.push({ name: 'WechatPay' })
                    } else {
                        await this.$alert({
                            title: '授权失败',
                            message: data.result.authMessage
                        })
                    }
                } catch (e) {
                    if (e) {
                        throw e
                    }
                } finally {
                    sessionStorage.removeItem('authCode')
                    this[AGENCY_USER_INFO]()
                    this[WECHAT_PAY_STATUS]()
                }
            }
            return null
        },
        async getWexinInfo () {
            if (this.auditStatus === 'MP_NOT_AUTHORIZED' || this.auditStatus === 'MALL_NOT_COMPLETED') return
            try {
                const data = await getWexinInfo()
                this.weixinInfo = data.result
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style module lang="scss">
  .wechatAuth {
    > .auth-btn {
      margin-bottom: 25px;
    }
  }
  .tips {
    color: #E4585D;
    > p {
      margin-bottom: 9px;
    }
  }
  .wechatInfo {
    .baseInfo {
      display: flex;
      margin-bottom: 24px;
      > .logo {
        width: 70px;
        height: 70px;
        border-radius: 35px;
        background-color: #ccc;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-left: 20px;
      > .name {
        font-size: 16px;
        margin-bottom: 3px;
      }
      > .bind-time {
        margin-bottom: 7px;
        color: #999;
      }
    }
  }
</style>
