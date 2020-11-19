<template>
    <div :class="$style.redPackageRankList">
        <div :class="$style.explanation">
            可自定义设置所有储备金活动在商城活动界面的展示顺序
        </div>
        <el-form :class="$style.operation" inline>
            <el-button type="primary" round @click="showSelect">
                设置排序
                <i class="el-icon-plus el-icon--right" />
            </el-button>
            <el-button type="primary" plain round @click="reset">
                恢复默认
            </el-button>
            <span :class="$style.sugget">（默认按照活动领取开始时间和活动状态正序排列）</span>
            <el-form-item label="请选择排序方式：" style="margin-bottom: 0">
                <el-select
                    v-model="rankType"
                    clearable
                    @change="onSelectChange"
                >
                    <el-option
                        label="默认排序"
                        value=""
                    />
                    <el-option
                        label="按领取时间排序"
                        :value="0"
                    />
                    <el-option
                        label="按价格排序"
                        :value="2"
                    />
                </el-select>
            </el-form-item>
            <el-button :class="$style.preview" type="text">
                预览效果
            </el-button>
        </el-form>
        <section>
            <el-table
                ref="table"
                class="content-table"
                :data="table"
            >
                <span
                    slot="empty"
                    class="empty"
                >
                    <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" /> 活动暂未开始，暂无活动数据~
                </span>
                <el-table-column
                    prop="couponName"
                    label="排序"
                />
                <el-table-column
                    prop="useLimitAmount"
                    label="福利红包名称"
                    width="150"
                />
                <el-table-column
                    prop="useLimitAmount"
                    label="福利红包面额"
                    width="150"
                />
                <el-table-column
                    prop="useLimitAmount"
                    label="发放数量"
                />
                <el-table-column
                    prop="useLimitAmount"
                    label="适用产品"
                />
                <el-table-column
                    prop="useLimitAmount"
                    label="付费金额"
                />
                <el-table-column
                    label="领取时间"
                    width="200"
                >
                    <template slot-scope="{row}">
                        {{ row.useStartTime.split(' ')[0] }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="receiveAmount"
                    label="活动状态"
                />
                <el-table-column
                    prop="usedAmount"
                    label="显示状态"
                />
                <el-table-column
                    prop="usedAmount"
                    label="领取量"
                />
                <el-table-column
                    prop="statusText"
                    label="使用量"
                />
            </el-table>
            <Pagination
                v-model="current"
                :total="total"
                sizes
                @sizeChange="onSizeChange"
                @change="getList"
            />
        </section>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class RedPackageRankList extends Vue {
    /* data */
    showSelect = false
    rankType = ''
    table = []
    total = 0
    current = 1
    size = 10

    // created () {}

    /* methods */
    async getList () {
        console.log(123)
    }

    reset () {
        this.showSelect = true
    }

    async onSelectChange () {
        try {
            console.log(this.rankType)
            await this.getList()
        } catch (error) {
            throw error
        }
    }

    async onSizeChange (val: number) {
        try {
            this.size = val
            await this.getList()
        } catch (error) {
            throw error
        }
    }
}
</script>

<style lang="scss" module>
.explanation {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 55px;
    background: rgba(110, 123, 142, .2);
    font-size: 14px;
    color: #6E7B8E;
}
.operation {
    display: flex;
    align-items: center;
    margin-top: 30px;
}
.sugget {
    margin-left: 10px;
    font-size: 12px;
    color: #999999;
}
.preview {
    margin-left: auto;
}
</style>
