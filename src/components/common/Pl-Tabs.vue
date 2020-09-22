<template>
    <el-tabs class="pl-tabs" :value="value" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name" />
    </el-tabs>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

interface TabItem {
    name: string;
    label: string;
}

@Component
export default class PlTabs extends Vue {
  @Prop([String, Number]) value!: string | number
  @Prop({ default: () => [] }) tabs!: TabItem[]
  @Prop(Function) tabClick?: () => void

  @Emit('tabClick')
  handleClick (data: any) {
      return data
  }
}
</script>
