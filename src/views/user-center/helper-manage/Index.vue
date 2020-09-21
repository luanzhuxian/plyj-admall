<template>
    <div class="wrap">
        <pl-tabs
            v-if="$route.name !== 'HelperDetail'"
            :value="activeName"
            :tabs="tabs"
            @tabClick="handleClick"
        />
        <!-- 空的路由入口，仅作为导航 -->
        <router-view />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

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

    activeName = ''

    created () {
        this.activeName = this.$route.name
    }

    handleClick (e) {
        this.$router.push({ name: e.name })
    }
}
</script>

<style module lang="scss">
</style>
