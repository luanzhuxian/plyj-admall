<template>
    <div :class="$style.yajiAuth">
        <div :class="$style.statusText" v-if="auditStatus === 'AUDITING'">
            <div :class="$style.tip1">
                <div :class="$style.dot" />
                <div>
                    您的企业认证资料已提交，请耐心等待1个工作日雅集认证审核
                    <p :class="$style.subTip">如有问题联系雅集客服清风 029-84046883</p>
                </div>
            </div>
            <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/qingfeng-weixin.png" alt="">
            <el-button class="mt-24 mb-24" plain round @click="showDetail = !showDetail">
                查看提交资料
            </el-button>
        </div>

        <div :class="$style.statusText + ' ' + $style.success" v-if="auditStatus === 'AUTHENTICATE'">
            <div :class="$style.successBg">
                <pl-svg name="icon-success-8db26" width="20" />
            </div>
            <p :class="$style.iconText">认证已通过</p>
            <div :class="$style.tip">
                您的雅集认证已通过，可以开始正常使用机构功能
                <p :class="$style.subTip">如有问题联系雅集客服清风 029-84046883</p>
            </div>
            <el-button class="mt-24 mb-24" plain round @click="showDetail = !showDetail">
                查看提交资料
            </el-button>
        </div>
        <Detail :detail="detail" :show="showDetail" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Detail from '../components/Detail.vue'
import { getWchatPayInfo } from '../../../../apis/base/register'
export default {
    name: 'YajiAuth',
    components: {
        Detail
    },
    data () {
        return {
            detail: {},
            showDetail: false
        }
    },
    computed: {
        ...mapGetters({
            auditStatus: 'user/auditStatus'
        })
    },
    async created () {
        try {
            const data = await getWchatPayInfo()
            this.detail = data.result
        } catch (e) {
            throw e
        }
    }
}
</script>

<style module lang="scss">
  .yajiAuth {
      margin-left: 120px;
      background: #F5F6FA;
      width: 800px;
      border-radius: 8px;
      padding: 55px 0;
  }
  .status-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      .tip1{
          .dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #5A5A5A;
              margin: 5px 10px 0 0;
          }
          color: #5A5A5A;
          display: flex;
          .sub-tip{
              margin-top: 5px;
              color: #999;
          }
      }
      img {
          display: block;
          width: 110px;
          height: 110px;
          padding: 5px;
          margin-top: 24px;
          object-fit: cover;
          border: 2px solid #000;
      }
      button{
          width: 320px;
          height: 48px;
          border-radius: 120px !important;
          color: #4F63FF;
      }
  }
  .success {
      display: flex;
      flex-direction: column;
      align-items: center;
      .success-bg{
          background: #2DCA72;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
      }
      > svg {
          margin-bottom: 6px;
      }
      .icon-text{
          font-size: 16px;
          color: #000;
      }
      > .tip {
          margin: 20px 0 35px;
          font-size: 14px;
          text-align: center;
          .sub-tip{
              margin-top: 5px;
              color: #999;
          }
      }
      &:before {
          display: none;
      }
  }
</style>
