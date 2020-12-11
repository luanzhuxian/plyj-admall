<template>
    <!--中奖弹窗-->
    <div>
        <el-dialog
            title=""
            width="640px"
            :visible="show"
            :before-close="closeGiftPreview"
        >
            <el-table :data="giftData">
                <el-table-column label="礼品图片">
                    <template slot-scope="{ row }">
                        <div>
                            <img
                                v-if="row.awardType === 1"
                                height="50"
                                :src="row.awardUrl"
                                v-img-error
                                v-viewer
                            >
                            <img
                                v-if="row.awardType === 2"
                                height="50"
                                src="https://mallcdn.youpenglai.com/static/admall/2.9.0/奖学金icon.png"
                                v-img-error
                            >
                            <img
                                v-if="row.awardType === 3 || row.awardType === 4"
                                height="50"
                                src="https://mallcdn.youpenglai.com/static/admall/2.9.0/优惠券icon.png"
                                v-img-error
                            >
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="礼品名称" prop="awardName" />
                <el-table-column label="有效时间">
                    <template slot-scope="{ row }">
                        {{ row.startTime }}-{{ row.endTime }}
                    </template>
                </el-table-column>
                <el-table-column label="使用时间" prop="useLuckDrawNumber">
                    <template slot-scope="{ row }">
                        {{ row.useTime }}
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'GiftList',
    props: {
        show: Boolean,
        giftData: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        closeGiftPreview () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style scoped>

</style>
