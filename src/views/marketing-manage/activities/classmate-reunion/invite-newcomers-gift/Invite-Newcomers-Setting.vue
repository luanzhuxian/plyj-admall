<template>
    <div class="invite-newcomers-setting bg-white">
        <div>活动说明：</div>
        <p class="font-weight-bold">
            1.赢取豪礼是在营销活动中，通过老带新（已注册用户，邀请未注册用户），让更多新用户注册成为会员的活动，帮助机构快速扩大用户池；<br>
            2.奖品发放采用礼品+满减券的形式，完成规定任务，成功邀请一定数量的新用户注册，即可随机抽取奖品一次；<br>
            3.活动期间，用户可多次发起活动，帮助机构发展新用户。
        </p>
    </div>
</template>

<script>
export default {
    name: 'InviteNewcomersSetting',
    activated () {
        this.$parent.showTop = true
    }
}
</script>

<style scoped lang="scss">
.invite-newcomers-setting {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  min-height: 400px;
  padding: 32px;
  font-size: 18px;

  div {
    width: 140px;
  }

  p {
    line-height: 32px;
  }
}
</style>
