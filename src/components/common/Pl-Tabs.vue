<template>
    <el-tabs class="pl-tabs" :value="value" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabs" :key="item.name" :name="item.name">
            <span slot="label">
                {{ item.label }}
                <el-tooltip
                    v-if="item.content"
                    effect="dark"
                    :content="item.content"
                    placement="top-start"
                >
                    <div class="desc-tip">?</div>
                </el-tooltip>
            </span>
        </el-tab-pane>
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

<style lang="scss">
    .desc-tip {
        display: inline-block;
        margin: 0 20px 0 10px;
        width: 16px;
        line-height: 16px;
        border-radius: 50%;
        font-size: 12px;
        text-align: center;
        color: #fff;
        background-color: #999;
        cursor: pointer;
    }
</style>
