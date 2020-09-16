<template>
    <div :class="$style.bingWechat">
        <div :class="$style.progress">
            <router-link tag="div" :class="$style.stepBox" :to="{ name: 'WechatAuth' }">
                <div :class="$style.progressCircle">
                    <div :class="$style.inner">
                        <pl-svg name="icon-success-8db26" width="44" />
                    </div>
                </div>
                <div :class="$style.text" class="bing-wechat-step">
                    商城授权
                </div>
            </router-link>

            <div :class="$style.line + ' ' + $style.one" />

            <router-link
                :class="$style.stepBox"
                tag="div"
                :to="{ name: (auditStatus === 'OPEN_WECHAT_PAYMENT' || auditStatus === 'AUDITING' || auditStatus === 'AUTHENTICATE') ? 'WechatPay' : $route.name }"
            >
                <div :class="$style.progressCircle">
                    <div :class="$style.inner" v-show="auditStatus === 'OPEN_WECHAT_PAYMENT' || auditStatus === 'AUDITING' || auditStatus === 'AUTHENTICATE'">
                        <pl-svg name="icon-success-8db26" width="44" />
                    </div>
                </div>
                <div class="bing-wechat-step">
                    开通微信支付
                </div>
            </router-link>

            <div :class="$style.line + ' ' + $style.two" />

            <router-link :class="$style.stepBox" tag="div" :to="{ name: applymentState === 'APPLYMENT_STATE_FINISHED' ? 'YajiAuthenticate' : $route.name }">
                <div :class="$style.progressCircle">
                    <div
                        :class="$style.inner"
                        v-show="auditStatus !== 'OPEN_WECHAT_PAYMENT' && auditStatus !== 'MP_NOT_AUTHORIZED' && auditStatus !== 'MALL_NOT_COMPLETED'"
                    >
                        <pl-svg name="icon-success-8db26" width="44" />
                    </div>
                </div>
                <div class="bing-wechat-step">
                    雅集认证
                </div>
            </router-link>
        </div>
        <main>
            <router-view />
        </main>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'BindWechat',
    computed: {
        ...mapGetters({
            auditStatus: 'user/auditStatus',
            wechatPayStatus: 'user/wechatPayStatus',
            currentStep: 'user/currentStep'
        }),
        applymentState () {
            return this.wechatPayStatus.applymentState
        }
    },
    async activated () {
        const auditStatus = this.auditStatus
        try {
            if (this.$route.name !== 'WechatAuth' && auditStatus === 'MP_NOT_AUTHORIZED') {
                await this.$router.replace({ name: 'WechatAuth', query: this.$route.query })
                return
            }
            if (this.$route.name !== 'WechatPay' && auditStatus === 'OPEN_WECHAT_PAYMENT') {
                await this.$router.replace({ name: 'WechatPay', query: this.$route.query })
                return
            }
            if (this.$route.name !== 'YajiAuthenticate' && (auditStatus === 'AUDITING' || auditStatus === 'AUTHENTICATE')) {
                await this.$router.replace({ name: 'YajiAuthenticate', query: this.$route.query })
            }
        } catch (e) {
            console.log(e)
        }
    }
}
</script>

<style module lang="scss">
  .bing-wechat {
    padding: 33px 105px;
    background-color: #fff;
  }
  .progress {
    display: flex;
    justify-content: space-between;
    width: 603px;
    margin-bottom: 54px;
    text-align: center;
    > .line {
      flex: 1;
      height: 4px;
      background-color: #4F63FF;
      &.one {
        transform: scaleX(1.1) translateY(38px) translateX(6px);
      }
      &.two {
        transform: scaleX(1.1) translateY(38px) translateX(-6px);
      }
    }
  }
  .stepBox {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    > .text {
      position: relative;
    }
  }
  :global {
    .bing-wechat-step {
      padding: 4px 9px;
      border: 1px solid #fff;
      color: #333;
    }
    .router-link-active {
      .bing-wechat-step {
        color: #4F63FF;
        border-color: #4F63FF;
      }
    }
  }
  .progressCircle {
    position: relative;
    display: inline-block;
    margin-bottom: 12px;
    min-width: 38px;
    min-height: 38px;
    padding: 8px;
    font-size: 0;
    background-color: #D1E0FF;
    z-index: 5;
    border-radius: 50%;
    > .inner {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 60px;
      background-color: #4F63FF;
      border-radius: 30px;
    }
  }

</style>
