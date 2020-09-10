<template>
    <div :class="$style.searchBox">
        <el-form
            :class="$style.container"
            inline
            :label-position="labelPosition"
            :label-width="labelWidth"
        >
            <slot />
        </el-form>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class SearchBox extends Vue {
  @Prop({ default: 'left' }) labelPosition?: string
  @Prop({ default: '120px' }) labelWidth?: string
}
</script>

<style module lang="scss">
  .search-box {
    display: flex;
    padding: 20px 32px;
    background-color: #F5F6FA;
    border-radius: 10px;
    > .container {
      display: inline-grid;
      grid-template-columns: auto auto auto;
      grid-gap: 10px;
    }
  }
</style>
<style scoped lang="scss">
  ::v-deep {
    .el-form-item {
      margin-bottom: 0 !important;
      margin-right: 0 !important;
    }
  }
</style>
