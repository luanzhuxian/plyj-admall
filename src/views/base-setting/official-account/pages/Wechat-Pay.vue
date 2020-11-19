<template>
    <div :class="$style.wechatPay">
        <div :class="$style.content" v-if="step < 6" v-show="!loading">
            <div :class="$style.steps">
                <i :class="{ [$style.active]: step >= 1 }">① 主体资料 <span>></span></i>
                <i :class="{ [$style.active]: step >= 2 }">② 经营资料 <span>></span></i>
                <i :class="{ [$style.active]: step >= 3 }">③ 结算账户 <span>></span></i>
                <i :class="{ [$style.active]: step >= 4 }">④ 超级管理员</i>
            </div>
            <main :class="$style.main">
                <components :is="`Step${ step }`" :detail="detail" :ref="`step${ step }`" />
            </main>
        </div>
        <status ref="step6" :detail="detail" v-else v-show="!loading" @again="step = 1" />
        <div :class="$style.control">
            <el-button v-if="step > 1" @click="step--" round>
                上一步
            </el-button>
            <el-button v-if="step === 1" type="primary" @click="save1" round>
                保存，并下一步
            </el-button>
            <el-button v-else-if="step === 2" type="primary" @click="save2" round>
                保存，并下一步
            </el-button>
            <el-button v-else-if="step === 3" type="primary" @click="save3" round>
                保存，并下一步
            </el-button>
            <el-button v-else-if="step === 4" type="primary" @click="save4" round>
                保存，并下一步
            </el-button>
            <el-button v-else-if="step === 5" type="primary" @click="submit" round>
                确认，并提交
            </el-button>
        </div>
    </div>
</template>

<script>
import Step1 from '../components/Pay-Step1.vue'
import Step2 from '../components/Pay-Step2.vue'
import Step3 from '../components/Pay-Step3.vue'
import Step4 from '../components/Pay-Step4.vue'
import Step5 from '../components/Pay-Step5.vue'
import Status from '../components/Status.vue'
import { getWchatPayInfo } from '../../../../apis/base/register'
import { mapGetters } from 'vuex'
export default {
    name: 'WechatPay',
    components: {
        Step1,
        Step2,
        Step3,
        Step4,
        Step5,
        Status
    },
    data () {
        return {
            step: 1,
            detail: {},
            loading: true
        }
    },
    computed: {
        ...mapGetters({
            auditStatus: 'user/auditStatus',
            wechatPayStatus: 'user/wechatPayStatus'
        }),
        applymentState () {
            return this.wechatPayStatus.applymentState
        },
        showStatus () {
            return this.auditStatus === 'OPEN_WECHAT_PAYMENT' || this.auditStatus === 'AUDITING' || this.auditStatus === 'AUTHENTICATE'
        }
    },
    watch: {
        step: {
            async handler () {
                try {
                    const data = await getWchatPayInfo()
                    this.detail = data.result
                } catch (e) {
                    throw e
                }
            }
        }
    },
    async created () {
        try {
            this.loading = true
            const data = await getWchatPayInfo()
            this.detail = data.result
            if (this.showStatus && this.applymentState) this.step = 6
            this.loading = false
        } catch (e) {
            throw e
        }
    },
    methods: {
        async save1 () {
            try {
                const res = await this.$refs.step1.submit()
                if (res) this.step = 2
            } catch (e) {
                throw e
            }
        },
        async save2 () {
            try {
                const res = await this.$refs.step2.submit()
                if (res) this.step = 3
            } catch (e) {
                throw e
            }
        },
        async save3 () {
            try {
                const res = await this.$refs.step3.submit()
                if (res) this.step = 4
            } catch (e) {
                throw e
            }
        },
        async save4 () {
            try {
                const res = await this.$refs.step4.submit()
                if (res) this.step = 5
            } catch (e) {
                throw e
            }
        },
        async submit () {
            try {
                const res = await this.$refs.step5.submit()
                if (res) this.step = 6
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style module lang="scss">
  .wechat-pay {
    > .content {
        padding: 20px;
        background: #F5F6FA;
        border-radius: 10px;
    }
    :global {
      .el-form-item {
        .el-input {
          width: 184px;
        }
        textarea {
          width: 420px;
        }
      }
    }
  }
  .steps {
    padding:  0 28px ;
    line-height: 54px;
    color: #666;
    span {
      margin: 0 7px;
    }
    .active {
      color: #4F63FF;
    }
  }
  .main {
    padding: 16px 24px;
    overflow: hidden;
    h4 {
      font-size: 14px;
      color: $--color-primary-orange;
      margin-bottom: 28px;
      > span {
        font-weight: normal;
      }
    }
  }
  .control {
      position: absolute;
      left: -10px;
      bottom: -10px;
      width: calc(100% + 20px);
      padding: 16px 0;
      text-align: center;
      background-color: #fff;
    button:nth-of-type(1) {
      margin-right: 74px;
    }
  }
</style>
