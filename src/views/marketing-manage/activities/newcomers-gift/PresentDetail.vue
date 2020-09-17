<template>
    <el-dialog :visible="show" width="760px" title="查看礼品" class="view-present" @close="close">
        <el-tabs v-model="activeName">
            <el-tab-pane label="" name="1" v-if="presentDetail.couponModels && presentDetail.couponModels.length">
                <div slot="label">
                    优惠券({{ presentDetail.couponModels.length }})
                </div>
                <el-table :data="presentDetail.couponModels">
                    <el-table-column>
                        <template slot="header">
                            <div class="ml-20">
                                优惠券类型
                            </div>
                        </template>
                        <template #default="{row}">
                            <div class="ml-20">
                                {{ row.couponType === 1 ? '满减券' : '品类券' }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="优惠券名称" prop="couponName" />
                    <el-table-column label="面值">
                        <template #default="{row}">
                            满{{ row.useLimitAmount }}减{{ row.amount }}元
                        </template>
                    </el-table-column>
                    <el-table-column label="用券有效期" width="200">
                        <template #default="{row}">
                            {{ row.useStartTime | dateFormat('YYYY-MM-DD') }} - {{ row.useEndTime | dateFormat('YYYY-MM-DD') }}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template #default="{row}">
                            {{ STATUS_TEXT[row.status] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="使用时间">
                        <template #default="{row}">
                            {{ row.useTime }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="2" v-if="presentDetail.scholarships && presentDetail.scholarships.length">
                <div slot="label">
                    奖学金({{ presentDetail.scholarships.length }})
                </div>
                <el-table :data="presentDetail.scholarships">
                    <el-table-column label="奖学金名称">
                        <template slot="header">
                            <div class="ml-20">
                                奖学金名称
                            </div>
                        </template>
                        <div class="ml-20">
                            新人奖学金
                        </div>
                    </el-table-column>
                    <el-table-column label="金额（元）" prop="scholarshipPrice" />
                    <el-table-column label="有效时间" width="200">
                        <template #default="{row}">
                            <span v-if="row.useStartTime">{{ row.useStartTime | dateFormat('YYYY-MM-DD') }} - {{ row.useEndTime | dateFormat('YYYY-MM-DD') }}</span>
                            <span v-else>奖学金领取当日起{{ row.scholarshipEffectiveTime }}日内使用，过期自动作废</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template #default="{row}">
                            {{ STATUS_TEXT1[row.status] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="使用时间">
                        <template #default="{row}">
                            {{ row.useTime }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="礼品" name="3" v-if="presentDetail.gifts && presentDetail.gifts.length">
                <div slot="label">
                    礼品({{ presentDetail.gifts.length }})
                </div>
                <el-table :data="presentDetail.gifts">
                    <el-table-column label="礼品图片">
                        <template slot="header">
                            <div class="ml-20">
                                礼品图片
                            </div>
                        </template>
                        <template #default="{row}">
                            <div class="ml-20">
                                <img :src="row.giftImage" width="60" height="60" v-viewer>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="礼品名称" prop="giftName" />
                    <el-table-column label="兑换有效期" width="200">
                        <template #default="{row}">
                            {{ row.useStartTime | dateFormat('YYYY-MM-DD') }} - {{ row.useEndTime | dateFormat('YYYY-MM-DD') }}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template #default="{row}">
                            {{ STATUS_TEXT2[row.status] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="使用时间">
                        <template #default="{row}">
                            {{ row.useTime }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script>
export default {
    name: 'PresentDetail',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        presentDetail: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            activeName: '1',
            STATUS_TEXT: ['未使用', '已使用', '已过期'],
            STATUS_TEXT1: ['未使用', '未使用', '已使用', '已过期', '已失效', '已删除'],
            STATUS_TEXT2: ['未兑换', '已兑换', '已过期']
        }
    },
    watch: {
        presentDetail (val) {
            this.activeName = val.couponModels.length > 0 ? '1' : (val.scholarships.length > 0 ? '2' : '3')
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style lang="scss" scoped>
  .view-present{
    ::v-deep .el-dialog__header{
      border-bottom: 1px solid #E7E7E7;
    }
    ::v-deep .el-dialog__body{
      padding: 0 0 32px;
      .el-tabs__header{
        padding-left: 12px;
        .el-tabs__nav-wrap::after{
          height: 0;
          background-color: none;
        }
        .el-tabs__item{
          font-size: 12px;
        }
      }
    }
  }
::v-deep .el-tabs__nav{
  margin-left: 20px;
}
</style>
