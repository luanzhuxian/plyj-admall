<template>
    <el-dialog
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible="visible"
        title="全部商品"
        @close="closeAddListDialog"
        @open="open"
        class="product-selector"
    >
        <el-form :inline="true" :model="form">
            <el-form-item>
                <el-input
                    prefix-icon="el-icon-search"
                    placeholder="请输入商品名称"
                    style="width: 200px;"
                    v-model="form.searchParam"
                    @change="search"
                    clearable
                />
                <el-button
                    type="primary"
                    style="width: 98px;margin-left: 28px;"
                    @click="search"
                >
                    搜索
                </el-button>
            </el-form-item>
        </el-form>

        <el-table :row-key="row => row.id" ref="table" :data="courseList" @selection-change="selectGoods">
            <el-table-column reserve-selection type="selection" width="55" />
            <el-table-column>
                <template #default="{ row }">
                    <img
                        width="60"
                        height="60"
                        style="object-fit: cover;"
                        :src="row.courseImg"
                        v-viewer
                    >
                </template>
            </el-table-column>
            <el-table-column prop="courseName" label="知识课程名称" />
            <el-table-column prop="productTypeText" label="类型" width="100">
                <template #default="{ row }">
                    {{ row.courseType === 1 ? '单课程' : '系列课' }}
                </template>
            </el-table-column>
            <el-table-column prop="sellingPrice" label="价格（元）" width="150">
                <template #default="{ row }">
                    {{ row.priceType === 1? row.sellingPrice : '免费' }}
                </template>
            </el-table-column>
            <el-table-column prop="productStatusText" label="状态" width="100">
                上架中
            </el-table-column>
        </el-table>

        <Pagination
            :total="total"
            v-model="form.current"
            :size="form.size"
            @change="getGoodsList"
        />
        <div style="margin-top: 32px; text-align: center;">
            <el-button
                type="primary"
                style="width: 70px;"
                @click="confirmGoods"
                :disabled="!isInRange"
            >
                确定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getVideoList as getList } from '../../../../../apis/product-center/online-teaching/knowledge-course'
export default {
    name: 'KnowledgeProduct',
    props: {
        visible: Boolean,
        defaultList: {
            type: Array,
            default () {
                return []
            }
        },
        // 最大选择数量
        maxSelectNum: {
            type: Number,
            default: 0,
            required: true
        }
    },
    data () {
        return {
            selectedCourses: [],
            courseList: [],
            total: 0,
            form: {
                current: 1,
                size: 4,
                courseType: null,
                searchParam: '',
                category1: '',
                category2: '',
                status: 1,
                startTime: ''
            }
        }
    },
    methods: {
        async open () {
            try {
                await this.search()
            } catch (e) { throw e }
        },
        async search () {
            try {
                this.form.current = 1
                await this.getGoodsList()
            } catch (e) { throw e }
        },
        async getGoodsList () {
            try {
                const { data: { result } } = await getList(this.form)
                this.total = result.total
                this.courseList = result.records
                this.defaultSelect()
            } catch (e) { throw e }
        },
        async defaultSelect () {
            try {
                await this.$nextTick()
                for (const item of this.courseList) {
                    if (
                        this.defaultList.some(({ id }) => id === item.id ||
            this.selectedCourses.some(({ id }) => id === item.id))
                    ) {
                        this.$refs.table.toggleRowSelection(item, true)
                    } else {
                        this.$refs.table.toggleRowSelection(item, false)
                    }
                }
            } catch (e) { throw e }
        },
        async clearGoodsSearch () {
            this.form = {
                current: 1,
                size: 4,
                courseType: null,
                searchParam: '',
                category1: '',
                category2: '',
                status: 1,
                startTime: ''
            }
            this.selectedCourses = []
        },
        selectGoods (list) {
            this.selectedCourses = list
        },
        closeAddListDialog () {
            this.$emit('update:visible', false)
            this.clearGoodsSearch()
        },
        async confirmGoods () {
            const list = JSON.parse(JSON.stringify(this.selectedCourses))
            this.$emit('confirm', list)
            this.$emit('update:visible', false)
        }
    },
    computed: {
    // 是否在可添加数量内
        isInRange () {
            return this.selectedCourses.length <= this.maxSelectNum
        }
    }
}
</script>

<style scoped lang="scss">

</style>
