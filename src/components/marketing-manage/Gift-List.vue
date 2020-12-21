<template>
    <!--中奖弹窗-->
    <div>
        <el-dialog
            title=""
            width="1000px"
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
                <el-table-column align="center" prop="awardCount" label="获得数量" />
                <el-table-column v-if="obtainTime" label="获奖时间">
                    <template slot-scope="{ row }">
                        {{ row.gainTime }}
                    </template>
                </el-table-column>
                <el-table-column v-else label="有效时间">
                    <template slot-scope="{ row }">
                        {{ row.startTime }}-{{ row.endTime }}
                    </template>
                </el-table-column>
                <el-table-column label="使用时间" prop="useLuckDrawNumber">
                    <template slot-scope="{ row }">
                        {{ row.useTime }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="address" label="状态">
                    <template #default="{row:{status,awardType}}">
                        <span v-if="awardType === 1">{{ giftStatus[status] || '其他' }}</span>
                        <span v-else-if="awardType === 2">{{ useStatus[status] || '其他' }}</span>
                        <span v-else>{{ couponStatus[status] || '其他' }}</span>
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
        obtainTime: {
            type: Boolean,
            default: false
        },
        giftData: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            // 礼品状态
            giftStatus: ['待使用', '已使用', '已过期'],
            // 奖学金状态
            useStatus: ['待领取', '未使用', '已使用', '已过期', '已失效', '已删除'],
            // 券使用状态
            couponStatus: ['待使用', '已使用', '已过期']
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
