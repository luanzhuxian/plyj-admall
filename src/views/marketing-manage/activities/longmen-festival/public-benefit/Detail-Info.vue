<template>
    <div class="detail-info">
        <div class="wrap">
            <el-button class="btn" type="primary" :disabled="!([1,2].includes(detail.definiteStatus))" @click="$router.push({ name: 'EditLongmenPublicBenefit', params: { id } })">
                编 辑
            </el-button>
        </div>
        <Add :id="id" read-only />
    </div>
</template>

<script>
import Add from './Add.vue'
import { getPublicBenefitDetail } from '../../../../../apis/marketing-manage/lonmen-festival/public-benefit'
export default {
    name: 'LongmenPublicBenefitInfo',
    components: {
        Add
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            detail: {
                // 1未开始，2进行中，3已过期，4已结束
                definiteStatus: 1
            }
        }
    },
    async created () {
        try {
            await this.getDetail()
        } catch (e) { throw e }
    },
    methods: {
        async getDetail () {
            try {
                const { result } = await getPublicBenefitDetail(this.id)
                this.detail = result
            } catch (e) { throw e }
        }
    }
}
</script>

<style scoped lang="scss">

.detail-info {
    padding: 20px 0;
    .btn {
        margin-left: 60px;
    }
    ::v-deep .row{
        .el-form-item {
            margin-bottom: 0px !important;
        }
    }
    ::v-deep .el-form-item__label {
        font-size: 16px;
        color: #999;
    }
}

</style>
