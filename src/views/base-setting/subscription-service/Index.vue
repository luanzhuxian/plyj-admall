<template>
    <div class="wrap">
        <pl-tabs
            :value="activeName"
            :tabs="tabs"
            @tabClick="handleClick"
            v-if="$route.name !== 'SourceServiceOrderDetail'"
        />
        <router-view />
    </div>
</template>
<script lang="ts">
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
        this.activeName = this.$route.name || 'LiveServiceOrder'
    }

    handleClick (e: any) {
        this.$router.push({ name: e.name })
    }
}
</script>

<style scoped>

</style>
