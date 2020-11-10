<template>
    <div :class="$style.status">
        <div :class="$style.statusText" v-if="applymentState === 'APPLYMENT_STATE_AUDITING'">
            <strong class="mb-24">正在开通微信支付商户号……</strong>
            <br>
            <strong>让超级管理员扫码完成绑定微信号，申请进度将通过微信公众号通知超级管理员，引导完成后续步骤</strong>
            <img v-imgError :src="signUrl" alt="">
        </div>

        <div :class="$style.statusText" v-if="applymentState === 'APPLYMENT_STATE_EDITTING'">
            <strong class="mb-24">微信支付开通失败</strong>
            <br>
            <strong>提交申请发生错误，请尝试重新提交，如有任何问题可致电朋来雅集  400-833-0529</strong>
            <br>
            <el-button class="mt-24" type="primary" @click="again" round>
                重新提交申请
            </el-button>
        </div>

        <div :class="$style.statusText" v-if="applymentState === 'APPLYMENT_STATE_REJECTED'">
            <strong class="mb-24">已驳回</strong>
            <br>
            <strong>{{ auditDetailModels.rejectReason || applymentStateMsg }}</strong>
            <br>
            <strong>如有任何问题可致电朋来雅集  400-833-0529</strong>
            <br>
            <el-button class="mt-24" type="primary" @click="again" round>
                重新提交申请
            </el-button>
        </div>

        <div :class="$style.statusText" v-if="applymentState === 'APPLYMENT_STATE_CANCELED'">
            <strong class="mb-24">已撤销</strong>
            <br>
            <strong>申请单已被撤销， 如有任何问题可致电朋来雅集  400-833-0529</strong>
            <br>
            <el-button class="mt-24" type="primary" @click="again" round>
                重新提交申请
            </el-button>
        </div>

        <div :class="$style.statusText" v-if="applymentState === 'APPLYMENT_STATE_TO_BE_CONFIRMED'">
            <strong class="mb-24">待账户验证</strong>
            <br>
            <strong>请超级管理员使用微信扫描二维码，根据指引完成账户验证。</strong>
            <img v-imgError :src="signUrl" alt="">
        </div>

        <div :class="$style.statusText" v-if="applymentState === 'APPLYMENT_STATE_TO_BE_SIGNED'">
            <strong class="mb-24">待签约</strong>
            <br>
            <strong>请超级管理员使用微信扫描二维码，根据指引完成账户验证。</strong>
            <img v-imgError :src="signUrl" alt="">
        </div>

        <div :class="$style.statusText" v-if="applymentState === 'APPLYMENT_STATE_SIGNING'">
            <strong class="mb-24">开通权限中</strong>
            <br>
            <strong>系统开通相关权限中，请耐心等待。</strong>
            <img v-imgError :src="signUrl" alt="">
        </div>

        <div :class="$style.statusText" v-if="applymentState === 'APPLYMENT_STATE_FINISHED'">
            <strong class="mb-24">微信支付商户已开通</strong>
            <br>
            <strong class="mb-24">商户法人姓名：{{ idName }}</strong>
            <br>
            <strong>微信支付商户号：{{ mchId }}</strong>
        </div>

        <div style="margin: 44px 0;">
            <el-button type="primary" @click="showDetail = !showDetail" round>
                {{ showDetail ? '收起查看' : '查看资料' }}
            </el-button>
        </div>

        <Detail :detail="detail" :show="showDetail" />
    </div>
</template>

<script>
import Detail from './Detail.vue'
import { mapGetters } from 'vuex'
export default {
    name: 'Status',
    components: {
        Detail
    },
    data () {
        return {
            showDetail: false,
            status: [
                'APPLYMENT_STATE_EDITTING',
                'APPLYMENT_STATE_AUDITING',
                'APPLYMENT_STATE_REJECTED',
                'APPLYMENT_STATE_TO_BE_CONFIRMED',
                'APPLYMENT_STATE_TO_BE_SIGNED',
                'APPLYMENT_STATE_SIGNING',
                'APPLYMENT_STATE_FINISHED',
                'APPLYMENT_STATE_CANCELED'
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
        ...mapGetters({
            wechatPayStatus: 'user/wechatPayStatus',
            auditDetailModels: 'user/auditDetailModels',
            auditStatus: 'user/auditStatus',
            mchId: 'user/mchId',
            idName: 'user/idName'
        }),
        applymentState () {
            return this.wechatPayStatus.applymentState
        },
        signUrl () {
            return this.wechatPayStatus.signUrl
        },
        applymentStateMsg () {
            return this.wechatPayStatus.applymentStateMsg
        }
    },
    methods: {
        again () {
            this.$emit('again')
        }
    }
}
</script>

<style module lang="scss">
  .status {
    .status-text {
      position: relative;
      padding-left: 16px;
      > strong {
        display: inline-block;
        font-size: 18px;
        white-space: pre-wrap;
      }
      > img {
        display: block;
        width: 189px;
        height: 189px;
        padding: 10px;
        margin-top: 24px;
        object-fit: cover;
        border: 1px solid #000;
      }
      &:before {
        position: absolute;
        top: -7px;
        left: 0;
        content: '·';
        height: 100%;
        font-size: 28px;
        font-weight: bolder;
      }
    }
  }
</style>
