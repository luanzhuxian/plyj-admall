<template>
    <div>
        <SearchBox>
            <el-form-item label="关键字：">
                <el-input
                    clearable
                    @change="search"
                    placeholder="请输入课程名称"
                    v-model="lineLearningListForm.keyword"
                />
            </el-form-item>
            <el-form-item label="类型：">
                <el-select
                    v-model="lineLearningListForm.courseType"
                    @change="search"
                    clearable
                >
                    <el-option :value="''" label="全部" />
                    <el-option :value="1" label="视频单课" />
                    <el-option :value="2" label="系列课" />
                </el-select>
            </el-form-item>
            <el-form-item label="分类：" v-show="lineLearningListForm.courseType">
                <SelectCategory
                    v-model="classification"
                    :category-type="lineLearningListForm.courseType ? lineLearningListForm.courseType : 0"
                    @change="changeClassification"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    round
                    @click="search"
                >
                    查询
                </el-button>
                <el-button
                    @click="changeExportLineLearningList"
                    type="primary"
                    plain
                    round
                    v-if="lineLearningList && lineLearningList.length"
                >
                    导出数据
                </el-button>
                <el-button type="text" @click="resetLineLearningList">清空筛选条件</el-button>
            </el-form-item>
        </SearchBox>
        <el-table
            key="LineLearningList"
            :data="lineLearningList"
            class="table-customer"
            style="width: 100%"
        >

            <el-table-column
                prop="courseName"
                label="课程名称"
            />
            <el-table-column
                prop="courseType"
                label="类型"
            >
                <template #default="{ row }">
                    {{ row.courseType === 1 ? '单课程' : '系列课' }}
                </template>
            </el-table-column>
            <el-table-column
                prop="courseCategory"
                label="分类"
            />
            <el-table-column
                prop="learnStatus"
                label="学习状态"
            >
                <template #default="{ row }">
                    {{ learnStatus[row.learnStatus] }}
                </template>
            </el-table-column>
            <el-table-column
                prop="firstViewingTime"
                label="首次观看时间"
            />
            <el-table-column
                prop="dataFlowSizeShow"
                label="消耗流量"
            />
            <el-table-column
                fixed="right"
                label="学习进度"
            >
                <template #default="{ row }">
                    <div class="operate" v-if="row.courseType === 2">
                        <a @click="watchDetail(row)">
                            查看
                        </a>
                    </div>
                    <span v-else>{{ row.learnProgress }}</span>
                </template>
            </el-table-column>
        </el-table>
        <Pagination
            @change="getLineLearningList"
            v-model="lineLearningListForm.current"
            :total="lineLearningListTotal"
        />

        <!--查看学习进度-->
        <WatchDetailList
            :show.sync="showWatchDetailList"
            :course-id="courseResourceId"
            :user-id="userId"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    getLineLearningList
} from '../../../../apis/member'
import { Prop, Component } from 'vue-property-decorator'
import WatchDetailList from '../components/Watch-Detail-List.vue'
import SelectCategory from '../../../../components/product-center/category-manage/Select-Category.vue'

@Component({
    components: {
        WatchDetailList,
        SelectCategory
    }
})
export default class MemberOnlineProgress extends Vue {
    lineLearningList = []
    classification =[]
    lineLearningListTotal = 0
    showWatchDetailList = false
    courseResourceId = ''
    lineLearningListForm = {
        mallUserId: '',
        current: 1,
        size: 10,
        keyword: '',
        courseType: '',
        courseCategory: ''
    }

    learnStatus = {
        1: '未学习',
        2: '已学习',
        3: '已过期'
    }

    @Prop() userId!: string
    @Prop({ type: Array }) orderType!: DynamicObject[]
    @Prop({ type: Array }) orderStatusMap!: DynamicObject[]

    async activated () {
        await this.search()
    }

    // methods
    async getLineLearningList () {
        try {
            this.lineLearningListForm.mallUserId = this.userId
            const { result: { records, total } }: DynamicObject = await getLineLearningList(this.lineLearningListForm)
            this.lineLearningList = records || []
            this.lineLearningListTotal = total || 0
        } catch (e) {
            throw e
        }
    }

    async search () {
        try {
            if (!this.lineLearningListForm.courseType) this.lineLearningListForm.courseCategory = ''
            this.lineLearningListForm.current = 1
            await this.getLineLearningList()
        } catch (e) {
            throw e
        }
    }

    changeClassification (val: DynamicObject) {
        this.lineLearningListForm.courseCategory = val[0] || ''
        this.search()
    }

    watchDetail (row: DynamicObject) {
        this.showWatchDetailList = true
        this.courseResourceId = row.id
    }

    async resetLineLearningList () {
        this.lineLearningListForm = {
            mallUserId: '',
            current: 1,
            size: 10,
            keyword: '',
            courseType: '',
            courseCategory: ''
        }
        await this.getLineLearningList()
    }

    changeExportLineLearningList () {
        // todo
        console.log(1111)
    }
}
</script>

<style module lang="scss">

</style>
