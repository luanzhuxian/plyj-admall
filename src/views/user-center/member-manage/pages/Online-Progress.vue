<template>
    <div>
        <SearchBox>
            <el-form-item label="搜索内容：">
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
                    <el-option :value="1" label="知识课程" />
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
                <el-button
                    type="text"
                    @click="resetLineLearningList">清空筛选条件</el-button>
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
                    {{ Number(row.courseType) === 1 ? '知识课程' : '系列课' }}
                </template>
            </el-table-column>
            <el-table-column
                label="分类"
            >
                <template #default="{ row }">
                    {{ row.courseCategory }}
                    <span v-if="row.subCourseCategory">/{{ row.subCourseCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="learnStatus"
                label="学习状态"
            >
                <template #default="{ row }">
                    {{ learnStatus[row.learnStatus] }}
                </template>
            </el-table-column>
            <el-table-column
                label="首次观看时间"
                prop=""
            >
                <template #default="{ row }">
                    {{ row.firstViewingTime ? row.firstViewingTime: '--' }}
                </template>
            </el-table-column>
            <el-table-column
                label="消耗流量"
                prop="dataFlowSizeShow"
            >
                <template #default="{ row }">
                    {{ row.dataFlowSizeShow ? row.dataFlowSizeShow: '0M' }}
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="学习进度"
            >
                <template #default="{ row }">
                    <el-button class="button-box" v-if="Number(row.courseType) === 2 && row.learnStatus !== '3'" type="text" @click="watchDetail(row)">
                        查看
                    </el-button>
                    <span v-if="Number(row.courseType) !== 2 ">{{ row.learnProgress ? `${row.learnProgress}%`: '0%' }}</span>
                </template>
            </el-table-column>
        </el-table>
        <Pagination
            @change="getLineLearningList"
            v-model="lineLearningListForm.current"
            :total="lineLearningListTotal"
            :size="lineLearningListForm.size"
        />

        <!--查看学习进度-->
        <WatchDetailList
            :show.sync="showWatchDetailList"
            :course-id="courseResourceId"
            :user-id="userId"
        />
        <!--        导出-->
        <ExportDialog :show.sync="showExport" title="导出数据" @confirm="exportList" @close="exportClose">
            <el-form ref="exportForm" :model="exportData" label-width="110px" label-position="left">
                <el-form-item label="搜索内容：">
                    <el-input
                        clearable
                        @change="search"
                        placeholder="请输入课程名称"
                        v-model="exportData.keyword"
                        style="width: 300px;"
                    />
                </el-form-item>
                <el-form-item label="类型：">
                    <el-select
                        v-model="exportData.courseType"
                        @change="search"
                        clearable
                    >
                        <el-option :value="''" label="全部" />
                        <el-option :value="1" label="知识课程" />
                        <el-option :value="2" label="系列课" />
                    </el-select>
                </el-form-item>
                <el-form-item label="分类：" v-show="exportData.courseType">
                    <SelectCategory
                        v-model="classification"
                        :category-type="exportData.courseType ? exportData.courseType : 0"
                        @change="changeClassification"
                    />
                </el-form-item>
            </el-form>
        </ExportDialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    exportWatchQuery,
    getLineLearningList
} from '../../../../apis/member'
import { Prop, Component } from 'vue-property-decorator'
import WatchDetailList from '../components/Watch-Detail-List.vue'
import SelectCategory from '../../../../components/product-center/category-manage/Select-Category.vue'
import ExportDialog from '../../../../components/common/Export-Dialog.vue'
import { createObjectUrl } from '@/assets/ts/upload'
import moment from 'moment'
@Component({
    components: {
        WatchDetailList,
        SelectCategory,
        ExportDialog
    }
})
export default class MemberOnlineProgress extends Vue {
    lineLearningList = []
    classification =[]
    lineLearningListTotal = 0
    showWatchDetailList = false
    courseResourceId = ''
    lineLearningListForm: DynamicObject = {
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

    // 导出
    showExport = false
    exportData: DynamicObject = {
        mallUserId: '',
        keyword: '',
        courseType: '',
        courseCategory: ''
    }

    @Prop() userId!: string
    @Prop({ type: Array }) orderType!: DynamicObject[]
    @Prop({ type: Array }) orderStatusMap!: DynamicObject[]

    // async created () {
    //     await this.search()
    // }
    // changeClassification会执行

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
        this.lineLearningListForm.courseCategory = val[val.length - 1] || ''
        this.search()
    }

    watchDetail (row: DynamicObject) {
        this.showWatchDetailList = true
        this.courseResourceId = row.courseId
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
        for (const item of Object.keys(this.exportData)) {
            this.exportData[item] = this.lineLearningListForm[item]
        }
        this.showExport = true
    }

    exportClose () {
        this.exportData = {
            mallUserId: '',
            keyword: '',
            courseType: '',
            courseCategory: ''
        }
        this.showExport = false
    }

    async exportList () {
        await (this.$refs.exportForm as HTMLFormElement).validate()
        const blob = await exportWatchQuery(this.exportData)
        const url = createObjectUrl(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `云课堂学习进度${ moment(new Date()).format('YYYY-MM-DD HH-mm-ss') }.xls`
        a.click()
        this.showExport = false
    }
}
</script>

<style scoped lang="scss">
.button-box{
    text-align: left;
}
</style>
