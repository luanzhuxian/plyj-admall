<template>
    <div :class="$style.redPackageRankList">
        <div :class="$style.explanation">
            可自定义设置所有储备金活动在商城活动界面的展示顺序
        </div>
        <el-form v-show="!showSortTable" :class="$style.operation" inline>
            <el-button type="primary" round @click="showSortTable = true">
                设置排序
                <i class="el-icon-plus el-icon--right" />
            </el-button>
            <el-button type="primary" plain round @click="resetData">
                恢复默认
            </el-button>
            <div :class="$style.preview">
                <el-button type="text">
                    预览效果
                </el-button>
            </div>
        </el-form>

        <el-form v-show="showSortTable" :class="$style.operation" inline>
            <el-button style="width: 96px" type="primary" round @click="saveSort">
                保存
            </el-button>
            <el-button style="width: 96px" plain round @click="cancel">
                取消
            </el-button>
            <span :class="$style.sugget">（默认按照活动领取开始时间和活动状态正序排列）</span>
            <el-form-item label="请选择排序方式：" style="margin-bottom: 0">
                <el-select
                    v-model="sortType"
                    clearable
                    @change="onSelectChange"
                >
                    <el-option
                        label="默认排序"
                        :value="1"
                    />
                    <el-option
                        label="按领取时间排序"
                        :value="3"
                    />
                    <el-option
                        label="按价格排序"
                        :value="6"
                    />
                </el-select>
            </el-form-item>
        </el-form>
        <el-table
            ref="table"
            :data="[]"
            v-show="!showSortTable"
        >
            <span
                slot="empty"
                :class="$style.empty"
            >
                <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" /> 暂无活动数据~
                <el-button @click="$router.push({name:'AddRedPackage'})" round type="primary" plain>创建福利红包</el-button>
            </span>
            <el-table-column
                type="index"
                width="50"
                label="排序"
            />
            <el-table-column
                prop="name"
                label="福利红包名称"
                width="150"
            />
            <el-table-column
                prop="amount"
                label="福利红包面额"
                width="150"
            />
            <el-table-column
                prop="issueVolume"
                label="发放数量"
            />
            <el-table-column
                prop="applicableGoodsVolume"
                label="适用产品(个)"
                width="120"
            />
            <el-table-column
                prop="price"
                label="付费金额"
            />
            <el-table-column
                label="领取时间"
            >
                <template #default="{ row }">
                    {{ row.receiveStartTime | dateFormat('YYYY.MM.DD') }}-{{ row.receiveEndTime | dateFormat('YYYY.MM.DD') }}
                </template>
            </el-table-column>
            <el-table-column
                label="活动状态"
                width="150"
            >
                <template #default="{row}">
                    {{ activityStatusMap[row.activityStatus] }}
                </template>
            </el-table-column>
            <el-table-column
                label="显示状态"
            >
                <template #default="{row}">
                    {{ row.showStatus ? '显示': '隐藏' }}
                </template>
            </el-table-column>
            <el-table-column
                prop="claimVolume"
                label="领取量"
                width="100"
            />
            <el-table-column
                prop="useVolume"
                label="使用量"
                width="100"
            />
        </el-table>
        <pl-table v-show="showSortTable" :data="SortStyleList">
            <span
                slot="empty"
                class="empty"
            >
                <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" /> 暂无活动数据~
                <el-button @click="$router.push({name:'AddRedPackage'})" round type="primary" plain>创建福利红包</el-button>
            </span>
            <el-table-column
                type="index"
                width="50"
                label="排序"
            />
            <el-table-column
                prop="name"
                label="福利红包名称"
                width="150"
            />
            <el-table-column
                prop="amount"
                label="福利红包面额"
                width="150"
            />
            <el-table-column
                prop="issueVolume"
                label="发放数量"
            />
            <el-table-column
                prop="applicableGoodsVolume"
                label="适用产品(个)"
                width="120"
            />
            <el-table-column
                prop="price"
                label="付费金额"
            />
            <el-table-column
                label="领取时间"
            >
                <template #default="{ row }">
                    {{ row.receiveStartTime | dateFormat('YYYY.MM.DD') }}-{{ row.receiveEndTime | dateFormat('YYYY.MM.DD') }}
                </template>
            </el-table-column>
            <el-table-column
                label="活动状态"
                width="150"
            >
                <template #default="{row}">
                    {{ activityStatusMap[row.activityStatus] }}
                </template>
            </el-table-column>
            <el-table-column
                label="显示状态"
            >
                <template #default="{row}">
                    {{ row.showStatus ? '显示': '隐藏' }}
                </template>
            </el-table-column>
            <el-table-column
                prop="claimVolume"
                label="领取量"
                width="100"
            />
            <el-table-column
                prop="useVolume"
                label="使用量"
                width="100"
            />
        </pl-table>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getRedPackageSortStyleList, getRedPackageSortListListNew, saveSortStyleRedPackageList, redPackageRevertDefault } from '../../../../../apis/marketing-manage/red-package'

@Component
export default class RedPackageRankList extends Vue {
    /* data */
    activityStatusMap = {
        0: '未开始',
        1: '进行中',
        2: '停止',
        3: '结束'
    }

    sortType = 1
    table = []
    SortStyleList: DynamicObject[] = []
    showSortTable = false
    async created () {
        try {
            await this.getList()
        } catch (e) {
            throw e
        }
    }

    /* methods */

    async resetData () {
        try {
            await redPackageRevertDefault()
            this.$success('操作成功')
        } catch (e) {
            throw e
        }
    }

    async saveSort () {
        try {
            const data: string[] = []
            for (const item of this.SortStyleList) {
                data.push(item.id)
            }
            await saveSortStyleRedPackageList(data)
            this.showSortTable = false
            this.$success('操作成功')
            this.sortType = 1
            await this.getList()
        } catch (e) {
            throw e
        }
    }

    async cancel () {
        try {
            this.sortType = 1
            await this.getList()
            this.showSortTable = false
        } catch (e) {
            throw e
        }
    }

    async getList () {
        try {
            const { result: data1 } = await getRedPackageSortListListNew()
            const { result: data2 } = await getRedPackageSortStyleList(this.sortType)
            data1 && data1.length ? this.table = data1 : this.table = data2 || []
            this.SortStyleList = data2
        } catch (e) {
            throw e
        }
    }

    async onSelectChange () {
        try {
            await this.getList()
        } catch (e) {
            throw e
        }
    }
}
</script>

<style lang="scss" module>

.empty{
    button{
        display: block;
        margin: 0 auto;
    }
}
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
    margin-left: 50px;
    font-size: 12px;
    color: #999999;
}
.preview {
    width: 100%;
    display: flex;
    >button{
        margin-left: auto;
    }
}
</style>
