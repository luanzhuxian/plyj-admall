<template>
    <div class="together">
        <div class="together-top">
            <div class="together-top-left">
                <div class="together-top-title">
                    <img v-imgError src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/marketing-manage/marketing-gameplay/icon_together.png">
                    预购 <span>- 分批支付，提前享服务</span>
                </div>
                <div class="activity-date">
                    <pl-svg name="icon-riqi" fill="#999" width="16" class="mr-10" />使用有效期：2019.10.28 - 2020.01.31
                </div>
                <el-button
                    type="primary"
                    size="mini"
                    @click="$router.push({name:'AddTogether'})"
                    class="add-btn"
                >
                    新建活动
                    <i class="el-icon-plus el-icon--right" />
                </el-button>
            </div>
        </div>

        <pl-tabs
            value="BookingBuySetting"
            :tabs="[
                {label:'活动列表',name:'BookingBuyList'},
                {label:'活动设置',name:'BookingBuySetting'},
            ]"
            @tabClick="data => $router.replace({ name: data.name })"
        />

        <div class="setting">
            <div class="title">
                活动说明：
            </div>
            <div class="content">
                预购是一种提前支付定金，在指定时间内交付尾款，达到促销目的。<br>
                预购活动的价格是独立存在，库存是将原有商品的部分库存量直接锁定，可在营销活动中引流促活用户。<br>
                预购活动每次仅支持对一件商品进行设置，目前仅支持虚拟商品和课程商品。<br>
                活动期间购买只需缴纳定金（不可退），线下支付该阶段尾款（订单核销）<br>
                参与预购活动的商品，不能与其它优惠活动同时使用，例如不可使用满减券等；<br>
                参与预购活动的商品，除Helper活动之外，一种商品同一时段仅可参加一种活动，不可同时参与其它营销活动；<br>
                预购结束以时间和数量购买完截止预购结束。
            </div>
        </div>
        <div class="setting">
            *商品不设置限购，活动可在活动页核销或订单页核销。
        </div>
    </div>
</template>

<script>
export default {
    name: 'BookingBuySetting'
}
</script>

<style lang="scss" scoped>
  @import "booking";
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
