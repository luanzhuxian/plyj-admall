<template>
    <div :class="$style.list">
        <search-box class="mt-24">
            <el-form-item label="搜索内容：">
                <el-input
                    v-model="filter.condition"
                    placeholder="请输入活动名称"
                    clearable
                    @change="getList(1)"
                />
            </el-form-item>
            <el-form-item label="状态: ">
                <el-select
                    v-model="filter.status"
                    @change="getList(1)"
                >
                    <el-option
                        :key="-1"
                        label="全部"
                        :value="''"
                    />
                    <el-option
                        v-for="(item, i) of statusMap"
                        :key="i"
                        :label="item"
                        :value="i"
                    >
                        {{ item }}
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动时间: ">
                <date-range
                    @change="dateChange"
                    clearable
                />
            </el-form-item>
            <el-form-item>
                <el-button round type="primary" @click="getList(1)">
                    查询
                </el-button>
            </el-form-item>
        </search-box>
        <el-table :data="list">
            <el-table-column label="活动名称" prop="activityName" />
            <el-table-column label="活动商品数" prop="productCount" width="120" />
            <el-table-column label="剩余总库存" prop="stockCount" width="120" />
            <el-table-column label="参与人数" prop="number" width="120" />
            <!--<el-table-column label="浏览量" prop="" />-->
            <el-table-column label="活动时间" width="290">
                <template #default="{ row }">
                    <span v-text="row.activityStartTime" />
                    ~
                    <span v-text="row.activityEndTime" />
                </template>
            </el-table-column>
            <el-table-column label="活动状态" prop="statusText" width="100" />
            <!--<el-table-column label="访客数" prop="" />-->
            <el-table-column
                label="操作"
                align="right"
                header-align="right"
                width="100"
            >
                <template slot-scope="{ row }">
                    <Operating>
                        <template slot="button-box">
                            <a
                                v-if="![2,3].includes(row.status)" @click="end(row.id)"
                            >
                                结束
                            </a>
                            <a
                                v-if="![2,3].includes(row.status)"
                                @click="$router.push({
                                    name: 'EditCoursePackage',
                                    params: { id: row.id },
                                    query: {
                                        activityStatus: row.status
                                    }
                                })"
                            >
                                编辑
                            </a>
                            <a
                                @click="$router.push({
                                    name: 'CoursePackageDetailInfo',
                                    params: { id: row.id },
                                    query: {
                                        activityName: row.activityName,
                                        start: row.activityStartTime,
                                        end: row.activityEndTime,
                                        activityStatus: row.status
                                    }
                                })"
                            >
                                查看
                            </a>
                            <a
                                @click="$router.push({
                                    name: 'CoursePackageDetailData',
                                    params: { id: row.id },
                                    query: {
                                        activityName: row.activityName,
                                        start: row.activityStartTime,
                                        end: row.activityEndTime,
                                        activityStatus: row.status
                                    }
                                })"
                            >
                                数据
                            </a>
                            <a
                                @click="deleteData(row)" v-if="row.status !== 1 && row.status !== 0"
                            >
                                删除
                            </a>
                            <a @click="$router.push({ name: 'EditCoursePackage', params: { id: row.id }, query: { copy: 1 } })">
                                复制
                            </a>
                            <a @click="share(row)">
                                分享
                            </a>
                        </template>
                    </Operating>
                </template>
            </el-table-column>
        </el-table>
        <Pagination
            v-model="filter.current"
            :size="filter.size"
            :total="total"
            @change="getList"
        />
        <Share
            :show.sync="showShare"
            :qrcode-text="shareText"
            qrcode-image-name="组合聚惠学分享二维码"
        />
    </div>
</template>

<script>
import Share from '../../../../components/common/Share.vue'
import {
    getSpringPloughingList,
    endSpringPloughing,
    deleteSpringPloughingActivity
} from '../../../../apis/marketing-manage/new-year/spring-ploughing'

export default {
    name: 'CoursePackageList',
    components: {
        Share
    },
    data () {
        return {
            list: [],
            total: 0,
            showShare: false,
            shareText: '',
            statusMap: [
                '未开始',
                '进行中',
                '已结束'
            ],
            filter: {
                current: 1,
                size: 10,
                condition: '',
                startTime: '',
                endTime: '',
                status: '',
                batchType: 1 // 组合课
            },
            qrcodeText: '', // 分享链接
            qrcodeShow: false// 分享开关
        }
    },
    async created () {
        try {
            await this.getList()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async getList (page = this.filter.current) {
            this.filter.current = page
            try {
                const data = await getSpringPloughingList(this.filter)
                this.list = data.result.records
                this.total = data.result.total
            } catch (e) {
                throw e
            }
        },
        dateChange ({ start = '', end = '' }) {
            this.filter.startTime = start
            this.filter.endTime = end
            this.getList(1)
        },
        async end (id) {
            try {
                await this.$confirm('确定结束该活动吗？')
                await endSpringPloughing(id)
                await this.getList()
            } catch (e) {
                if (e !== 'cancel') throw e
            }
        },
        share () {
            this.shareText = `${ this.$store.getters['user/mallUrl'] }/course-package`
            this.showShare = true
        },
        async deleteData ({ id }) {
            try {
                await this.$confirm('确认删除此活动？删除后不可恢复。')
                await deleteSpringPloughingActivity({ id })
                this.$success('删除成功')
                this.getList()
            } catch (error) {
                throw error
            }
        }
    }
}
</script>

<style module lang="scss">
.list {
    background-color: #fff;
    min-height: 80vh;
    padding: 1px 30px 0;
}
.popver {
    line-height: 30px;
    text-align: center;
    color: #333;
    > div {
        cursor: pointer;
    }
}

</style>
