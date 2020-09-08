<template>
    <div :class="$style.helper">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane
                v-for="item in tabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
            />
        </el-tabs>
        <!-- 空的路由入口，仅作为导航 -->
        <router-view />
    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'

  @Component
export default class HelperManage extends Vue {
  tabs = [{
      name: 'HelperManageList',
      title: 'Helper管理'
  },
  {
      name: 'HelperReviewList',
      title: 'Helper审核'
  }]

    activeName = this.tabs[0]

    handleClick () {
        this.$router.push({ name: this.activeName })
    }
}
</script>

<style module lang="scss">
.helper{
    background: #fff;
    padding: 40px;
    border: 1px solid #ddd;
}
</style>
