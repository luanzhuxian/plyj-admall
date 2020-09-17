<template>
    <div class="by-old-belt-new-activity">
        <div
            :class="$style.statusBar"
            v-show="$route.name !== 'AddByOldBeltNewActivity'"
        >
            <pl-svg name="icon-iconmonstr-marketing-5" width="24" />
            <span :class="$style.titleAndDesc">
                <i :class="$style.title">老带新享优惠</i>
                <i :class="$style.desc"> - 老用户邀请新用户购买，享受老生专属优惠</i>
            </span>
            <div :class="$style.date">
                <pl-svg name="icon-riqi" fill="#999" width="16" class="mr-10" />
                <span>使用有效期：2019.10.28 - 2020.04.30</span>
            </div>
            <el-button type="primary" round @click="$router.push({ name: 'AddByOldBeltNewActivity' })">
                新建活动 <i class="el-icon-plus" />
            </el-button>
            <el-button type="text" @click="explainFlag = true">
                活动说明
            </el-button>
        </div>
        <!--活动说明弹窗-->
        <el-dialog
            :visible.sync="explainFlag"
            width="50%"
            class="explain"
        >
            <div class="title" slot="title">
                <pl-svg name="icon-jinggao" class="tips-icon" width="16" />
                <span>活动规则介绍</span>
            </div>
            <div class="explain-content" slot="">
                <ul>
                    <li>活动说明：</li>
                    <li>1.设置活动，活动期间仅可参与用户可见该页面展示的所有商品的老带新价；</li>
                    <li>2.活动期间购买只需缴纳定金（不可退）；</li>
                    <li>3.线下支付该阶段尾款（订单核销）,或核销时间内线上支付尾款；</li>
                    <li>4.结束以时间和数量购买完截止；</li>
                </ul>
                <div>*商品可设置限购，活动可在活动页核销或订单页核销</div>
                <ul>
                    <li>活动设置：</li>
                    <li>第一步    打开“营销中心”，找到“预购”活动；</li>
                    <li>第二步    点开“创建活动”，开始创建活动；</li>
                    <li>1.活动细则，该活动细则在活动期间将在用户端显示；</li>
                    <li>2.选择适合用户，可以选择helper用户，全部用户，普通会员，选择某些分组可见；</li>
                    <li>3.选择活动商品，默认所有商品规格均有，设置活动总库存为该商品下所有规格商品的总库存，库存售罄活动完成；</li>
                    <li>4.设置限购，一个用户限制购买几个商品；</li>
                    <li>5.选择商品预交定金金额，活动期间支付定金，支付尾款阶段支付商品尾款，设置定金翻倍金额，设置翻倍后，尾款支付将减去定金和翻倍金额支付；</li>
                    <li>6.选择活动时间，指在该时间段内，该商品以活动价显示，选择补尾款时间，在该时间内补交尾款；</li>
                    <li>7.活动预热，设置该时间后，将在活动开始前显示该活动预告；</li>
                </ul>
            </div>
            <div class="footer">
                <el-button type="primary" @click="explainFlag = false">
                    我知道了
                </el-button>
            </div>
        </el-dialog>
        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>
<script>
export default {
    name: 'ByOldBeltNewActivity',
    data () {
        return {
            // 是否显示活动说明
            explainFlag: false
        }
    }
}
</script>
<style module lang="scss">
  .status-bar {
    display: flex;
    align-items: center;
    height: 52px;
    padding: 0 24px;
    background-color: #fff;
    > .title-and-desc {
      margin-left: 11px;
      margin-right: 42px;
      font-size: 16px;
      > .title {
        font-weight: bold;
      }
      > .desc {
        color: #999;
      }
    }
    > .date {
      display: inline-flex;
      align-items: center;
      height: 30px;
      margin-right: 24px;
      font-size: 16px;
      padding: 0 10px;
      border: 1px solid #ccc;
      border-radius: 15px;
      > span {
        margin-left: 8px;
        color: #666;
      }
    }
  }
</style>
