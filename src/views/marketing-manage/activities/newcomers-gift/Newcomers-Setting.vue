<template>
    <el-dialog :visible="show"
               width="600px"
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @close="close"
               title="新人有礼"
    >
        <div class="newcomers-setting">
            <div class="newcomers-setting-title">
                <div class="line" />活动说明：
            </div>
            <p class="text">
                1.新人有礼活动，仅限新注册，并成功绑定手机号的用户参与；<br>
                2.新人有礼的礼品仅限发放优惠券、奖学金和礼品自由组合的优惠大礼包；<br>
                3.用户注册成功后，系统自动将优惠券发放到我的卡券中，奖学金自动发放到我的奖学金中，礼品自动发放到我的礼品中；<br>
                4.优惠券发放后，用户需在优惠券用券有效期内进行使用；<br>
                5.奖学金发放后，用户需在奖学金有效期内进行使用；<br>
                6.礼品发放后，用户需在礼品兑换有效期内进行兑换；
            </p>
            <div class="newcomers-setting-title">
                <div class="line" />活动设置：
            </div>
            <p class="text">
                第一步 打开<span class="blue">“营销中心”</span>，找到<span class="blue">“新人有礼”</span>活动；<br>
                第二步 点开<span class="blue">“创建活动”</span>，开始创建活动内容；<br>
                1.可设置活动名称；<br>
                2.选择活动时间，即设置本次活动的时间；<br>
                3.活动细则，该活动细则在活动期间将在用户端显示；<br>
                4.可领取礼品，可支持设置优惠券、奖学金、礼品三种不同类型的组合形式，形成新人优惠大礼包；<br>
                5.可设置发放数量，不限量则活动期间均可领取，限量则需设置发放新人优惠大礼包的数量，发放完毕则活动将自动结束；<br>
                6.设置品牌曝光，可支持上传品牌logo图片，在活动海报中展示。
            </p>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="close">
                确 定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'NewcomersSetting',
    props: {
        show: Boolean
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-dialog__header{
    border-bottom: 1px solid #E7E7E7;
  }
.newcomers-setting {
  height: 450px;
  overflow-y: auto;
  padding: 0 4px;
  font-size: 14px;

  .newcomers-setting-title {
    display: flex;
    align-items: center;
    font-weight: bold;
    margin-top: 32px;
    margin-bottom: 10px;
    .line{
      width: 2px;
      height: 12px;
      background: #4F63FF;
      margin-right: 10px;
    }
  }
  .text {
    line-height: 28px;
    margin-left: 12px;
    .blue{
      color: #4F63FF;
    }
  }
}
</style>
