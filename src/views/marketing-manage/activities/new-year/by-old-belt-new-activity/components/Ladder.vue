<template>
    <div :class="$style.ladder">
        <div>
            邀请 <el-input-number /> 单，购买后老生获得奖励
            <el-select v-model="giftType" style="width: 132px;" class="ml-10">
                <el-option :value="1" label="老生专享优惠券" />
                <el-option :value="2" label="奖学金" />
                <el-option :value="3" label="礼品" />
            </el-select>
            <el-button class="ml-20" type="primary plain" v-if="giftType === 1">
                选择优惠券
            </el-button>
            <el-button class="ml-20" type="primary plain" v-else-if="giftType === 2">
                新增奖学金
            </el-button>
            <el-button class="ml-20" type="primary plain" v-else-if="giftType === 3">
                新增礼品
            </el-button>
            <el-button class="ml-20" type="danger plain" @click="removeHandler">
                移除
            </el-button>
        </div>

        <el-table
            v-if="giftType === 1"
            :class="$style.table"
        >
            <el-table-column label="优惠券名称" />
            <el-table-column label="优惠券金额" />
            <el-table-column label="库存" />
            <el-table-column label="操作" align="right" header-align="right">
                <template>
                    <el-button type="text">
                        移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-table
            v-else-if="giftType === 2"
            :class="$style.table"
        >
            <el-table-column label="奖学金名称" />
            <el-table-column label="金额" />
            <el-table-column label="发放数量" />
            <el-table-column label="奖池总额" />
            <el-table-column label="操作" align="right" header-align="right">
                <template>
                    <el-button type="text">
                        编辑
                    </el-button>
                    <el-button type="text">
                        移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-table
            v-else
            :class="$style.table"
        >
            <el-table-column label="礼品名称" />
            <el-table-column label="库存" />
            <el-table-column label="兑换时间" />
            <el-table-column label="操作" align="right" header-align="right">
                <template>
                    <el-button type="text">
                        编辑
                    </el-button>
                    <el-button type="text">
                        移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'Ladder',
    data () {
        return {
            giftType: 1
        }
    },
    props: {
    // 只读，用于详情
        readonly: Boolean
    },
    methods: {
        removeHandler (e) {
            this.$emit('remove', e)
        }
    }
}
</script>

<style module lang="scss">
  .ladder {
    width: 856px;
    margin-bottom: 20px;
  }
  .table {
    margin-top: 10px;
    border: 1px solid #ebeef5;
    border-bottom: none;
  }
</style>
