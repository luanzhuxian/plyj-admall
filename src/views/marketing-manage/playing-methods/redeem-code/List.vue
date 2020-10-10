<template>
    <div>
        <div class="redeem-code-top">
            <div class="redeem-code-top-left">
                <div class="redeem-code-top-title">
                    <img src="https://mallcdn.youpenglai.com/static/admall/2.10.0/redeem_code_icon.png">
                    兑换码 <span>- 支持多商品兑换，使用即可减免商品费用</span>
                </div>
                <div class="activity-date">
                    <pl-svg name="icon-riqi" fill="#999" width="16" class="mr-10" />  使用有效期：{{ start | dateFormat('YYYY.MM.DD') }} - {{ end | dateFormat('YYYY.MM.DD') }}
                </div>
                <el-button
                    type="primary"
                    size="mini"
                    @click="$router.push({ name: 'AddRedeemCode' })"
                    class="add-btn"
                >
                    新建活动 <i class="el-icon-plus el-icon--right" />
                </el-button>
            </div>
        </div>

        <pl-tabs
            :value="$route.name"
            :tabs="[
                {label:'活动列表',name:'RedeemCodeListData'},
                {label:'活动设置',name:'RedeemCodeSetting'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />

        <router-view />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { MutationTypes } from '../../../../store/mutation-type'
export default {
    name: 'RedeemCodeList',
    data () {
        return {
            start: '',
            end: ''
        }
    },
    computed: {
        ...mapGetters({
            marketStatusAuth: 'account/marketStatusAuth'
        })
    },
    async mounted () {
        try {
            if (!this.marketStatusAuth) await this[MutationTypes.getMarketStatusAuth]()
            if (!this.marketStatusAuth || !this.marketStatusAuth.length) return
            const redeemCodeInformation = this.marketStatusAuth.find(({ programId }) => programId === '8')
            this.start = (redeemCodeInformation && redeemCodeInformation.createTime) || ''
            this.end = (redeemCodeInformation && redeemCodeInformation.validity) || ''
        } catch (e) {
            throw e
        }
    },
    methods: {
        ...mapActions([MutationTypes.getMarketStatusAuth])
    }
}
</script>
<style lang="scss" scoped>
  .redeem-code-top{
    display: flex;
    height: 52px;
    align-items: center;
    padding: 0 24px;
    .redeem-code-top-left{
      display: flex;
      align-items: center;
      .redeem-code-top-title{
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #333333;
        font-weight: bold;
        img{
          margin-right: 10px;
        }
        span{
          color: #999999;
          margin-left: 10px;
        }
      }
      .add-btn{
        width: 106px;
        height: 35px;
        border-radius: 121px;
        margin-left: 32px;
      }
    }
    .activity-date{
      margin-left: 32px;
      height: 31px;
      border: 1px solid #cccccc;
      border-radius: 130px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      color: #666666;
      padding: 0 10px;
      i{
        margin-right: 10px;
      }
    }
  }
</style>
