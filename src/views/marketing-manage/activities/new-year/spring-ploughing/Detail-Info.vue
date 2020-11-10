<template>
    <div class="detail-info">
        <div class="wrap">
            <el-button type="primary" round @click="$router.push({ name: 'EditSpringPloughing', params: { id } })">
                编 辑
            </el-button>
        </div>
        <Add
            :id="id"
            readonly
        />
    </div>
</template>

<script>
import Add from './Add.vue'
export default {
    name: 'SpringPloughingDetailInfo',
    components: {
        Add
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    }
}
</script>

<style scoped lang="scss">
  .detail-info {
    padding: 20px 0;
    ::v-deep .el-form-item {
      margin-bottom: 5px !important;
    }
    ::v-deep .el-form-item__label {
      font-size: 16px;
      color: #999;
    }
  }
</style>
