<template>
    <div class="wrap">
        <pl-tabs
            :value="activeName"
            :tabs="tabs"
            @tabClick="handleClick"
        />
        <router-view />
    </div>
</template>
<script>
import { Vue, Component } from 'vue-property-decorator'

  @Component
export default class HelperManage extends Vue {
  tabs = [{
      name: 'LiveServiceOrder',
      label: '直播套餐订单'
  },
  {
      name: 'SourceServiceOrder',
      label: '资源库'
  },
  {
      name: 'MarketingServiceOrder',
      label: '营销方案订单'
  }]

    activeName = ''
    created () {
        this.activeName = this.$route.name
    }

    handleClick (e) {
        this.$router.push({ name: e.name })
    }
}
</script>

<style scoped>

</style>
