<template>
    <div class="detail-info">
        <div class="wrap">
            <el-button
                v-if="status !== 2"
                type="primary"
                @click="$router.push({ name: 'EditCoursePackage', params: { id } })"
            >
                编 辑
            </el-button>
        </div>
        <Add
            v-if="isShowDetail"
            :id="id"
            readonly
            @init="init"
        />
    </div>
</template>

<script>
import Add from './Add.vue'
export default {
    name: 'CoursePackageDetailInfo',
    components: {
        Add
    },
    data () {
        return {
            status: 2,
            isShowDetail: false
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    created () {
        this.isShowDetail = true
    },
    beforeDestroy () {
        this.isShowDetail = false
    },
    methods: {
        init (detail) {
            this.status = detail.status
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
