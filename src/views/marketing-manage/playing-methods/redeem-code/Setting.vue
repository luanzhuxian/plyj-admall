<template>
    <div class="setting">
        <div class="title">
            活动说明：
        </div>
        <div class="content">
            设置发放的兑换码活动：时间，个数，兑换知识课程课、系列课；<br>
            活动期间均支持兑换未下架的商品；<br>
            一个未作废的兑换码可以兑换兑换范围内的任意商品；<br>
            时间结束或商品兑换完，该兑换码均无法兑换。
        </div>
    </div>
</template>

<script>
export default {
    name: 'Setting'
}
</script>

<style lang="scss" scoped>
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
