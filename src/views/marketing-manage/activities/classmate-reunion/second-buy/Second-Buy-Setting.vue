<template>
    <div class="together">
        <div class="together-top">
            <div class="together-top-left">
                <div class="together-top-title">
                    <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/marketing-manage/marketing-gameplay/icon_second.png">
                    秒杀 <span>- 限时抢购，引导用户消费</span>
                </div>
                <div class="activity-date">
                    <pl-svg name="icon-riqi" fill="#999" width="16" class="mr-10" />  使用有效期：{{ start | dateFormat('YYYY.MM.DD') }} - {{ end | dateFormat('YYYY.MM.DD') }}
                </div>
                <el-button
                    type="primary"
                    size="mini"
                    @click="$router.push({name:'AddTogether'})"
                    class="add-btn"
                >
                    新建活动 <i class="el-icon-plus el-icon--right" />
                </el-button>
            </div>
        </div>

        <pl-tabs
            value="SecondBuySetting"
            :tabs="[
                {label:'活动列表',name:'SecondBuyList'},
                {label:'活动设置',name:'SecondBuySetting'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />

        <div class="setting">
            <div class="title">
                活动说明：
            </div>
            <div class="content">
                秒杀是一种限时限量低价的促销方式，您可对指定商品设置在限定时间内进行低价限量销售， <br>
                秒杀活动的价格和库存是独立存在，库存是将原有商品的部分库存量直接锁定，可在营销活动中引流促活用户。 <br>
                秒杀活动每次仅支持对一件商品进行设置 。 <br>
                参与秒杀活动的商品，不能与其它优惠活动同时使用，例如不可使用满减券等；<br>
                参与秒杀活动的商品，除Helper活动之外，一种商品同一时段仅可参加一种活动，不可同时参与其它营销活动；<br>
                秒杀活动结束以时间和数量购买完截止秒杀活动结束； <br>
                秒杀活动可限制购买人数。
            </div>
        </div>
        <div class="setting">
            <div class="title">
                退款说明：
            </div>
            <div class="content">
                秒杀商品一旦支付成功后，不支持退款操作。
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { GET_MRKET_STATU_AUTH } from '../../../../../store/mutation-type'
export default {
    name: 'SecondBuySetting',
    data () {
        return {
            start: '',
            end: ''
        }
    },
    computed: {
        ...mapGetters(['mallUrl', 'mrketStatuAuth'])
    },
    async created () {
        if (!this.mrketStatuAuth) await this[GET_MRKET_STATU_AUTH]()
        if (!this.mrketStatuAuth || !this.mrketStatuAuth.length) return
        const secondBuyInformation = this.mrketStatuAuth.find(({ programId }) => programId === '3')
        this.start = secondBuyInformation.createTime || ''
        this.end = secondBuyInformation.validity || ''
        this.getList()
    },
    methods: {
        ...mapActions([GET_MRKET_STATU_AUTH])
    }
}
</script>

<style lang="scss" scoped>
  @import "second";
  .setting{
    margin: 32px 0 0 32px;
    display: flex;
    font-size: 18px;
    line-height: 32px;
    .title{
      width: 90px;
      margin-right: 10px;
    }
    .content{
      font-weight: bold;
      .sub-title{
        margin-bottom: 50px;
      }
    }
  }
</style>
