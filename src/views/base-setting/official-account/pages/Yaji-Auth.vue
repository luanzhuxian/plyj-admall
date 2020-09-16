<template>
    <div :class="$style.yajiAuth">
        <div :class="$style.statusText" v-if="auditStatus === 'AUDITING'">
            <strong class="mb-24">您的企业认证资料已提交，请耐心等待1个工作日雅集认证审核</strong>
            <br>
            <strong>如有问题联系雅集客服清风 029-84046883</strong>
            <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/qingfeng-weixin.png" alt="">
            <el-button class="mt-24 mb-24" type="primary" @click="showDetail = !showDetail">
                查看提交资料
            </el-button>
        </div>

        <div :class="$style.statusText + ' ' + $style.success" v-if="auditStatus === 'AUTHENTICATE'">
            <pl-svg name="icon-success" width="162" fill="#EF8C53" />
            <p :class="$style.tip">
                您的雅集认证已通过，可以开始正常使用机构功能
            </p>
            <strong>如有问题联系雅集客服清风 029-84046883</strong>
            <el-button class="mt-24 mb-24" type="primary" @click="showDetail = !showDetail">
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
    padding: 0;
  }
  .status-text {
    position: relative;
    padding-left: 16px;
    > strong {
      display: inline-block;
      font-size: 18px;
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
  .success {
    display: flex;
    flex-direction: column;
    align-items: center;
    > svg {
      margin-bottom: 44px;
    }
    > .tip {
      margin-bottom: 15px;
      font-size: 26px;
      color: #EF8C53;
    }
      &:before {
          display: none;
      }
  }
</style>
