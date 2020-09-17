<template>
    <div class="marketing-manage-tab">
        <div
            v-for="(lbl, k) in labels" :key="k"
            class="tab pointer"
            :class="{current: activeTab === lbl.router}"
            @click="$router.push({name: lbl.router})"
        >
            {{ lbl.label }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'MarketingManageTab',
    props: {
        labels: {
            type: Array,
            required: true
        },
        activeTab: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="scss" scoped>
.marketing-manage-tab {
  height: 55px;
  background: #F6F6F6;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  .tab {
    height: 39px;
    line-height: 39px;
    font-size: 14px;
    color: #333333;
    padding: 0 30px;
    &.current {
      font-weight: bold;
      background: #ffffff;
    }
  }
}
</style>
