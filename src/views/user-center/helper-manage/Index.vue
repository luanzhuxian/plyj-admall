<template>
    <div class="wrap">
        <pl-tabs
            v-show="showTabRouterNameList.includes(activeName)"
            :value="activeName"
            :tabs="tabs"
            @tabClick="handleClick"
        />
        <!-- 空的路由入口，仅作为导航 -->
        <router-view />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

  @Component
export default class HelperManage extends Vue {
  tabs = [{
      name: 'HelperManageList',
      label: 'Helper管理'
  },
  {
      name: 'HelperReviewList',
      label: 'Helper审核'
  }]

    activeName = 'HelperManageList'

    showTabRouterNameList = ['HelperManageList', 'HelperReviewList']

    @Watch('$route.name')
    onChangeValue (newVal: string) {
        this.activeName = newVal
    }

    handleClick (e: any) {
        this.$router.push({ name: e.name })
    }
}
</script>

<style module lang="scss">
</style>
