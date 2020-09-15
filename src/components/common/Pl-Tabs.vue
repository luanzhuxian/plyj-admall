<template>
    <el-tabs class="pl-tabs" :value="value" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name" />
    </el-tabs>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component
export default class PlTabs extends Vue {
  @Prop([String, Number]) value?: string | number
  @Prop({ default: [] }) tabs?: any[]
  @Prop(Function) tabClick?: () => void

  @Emit('tabClick')
  handleClick (data: any) {
      return data
  }
}
</script>

<style lang='scss'>

.pl-tabs {
    .el-tabs__item {
        font-size: 16px;
        color: #999999;
        &:hover {
            color: #333333;
        }
    }
    .is-active {
        font-weight: 600;
        color: #333333 !important;
    }
    .el-tabs__active-bar {
        height: 4px;
        border-radius: 20px;
    }
}

</style>
