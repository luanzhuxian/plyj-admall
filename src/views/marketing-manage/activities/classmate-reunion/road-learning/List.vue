<template>
    <div>
        <search-box class="mt-24">
            <el-form-item label="搜索内容：">
                <el-input placeholder="请输入活动奖品" v-model.trim="filterCondition.keyWord" class="mr-40" clearable />
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model="filterCondition.status" clearable>
                    <el-option :value="''" label="全部" />
                    <el-option v-for="(item, key) in activityStatus" :key="key" :value="key" :label="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="活动时间：">
                <date-range @change="formatTimeRange" />
            </el-form-item>
            <el-form-item>
                <el-button round type="primary" @click="getActivityList">
                    查询
                </el-button>
            </el-form-item>
        </search-box>
        <div>
            <el-table :data="activityList">
                <el-table-column label="活动名称">
                    <template>
                        <span>见学之旅</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="giftName"
                    label="特等奖"
                    align="left"
                    header-align="left"
                />
                <el-table-column
                    prop="checkInNum"
                    label="参与人数"
                />
                <el-table-column
                    prop="canLotteNum"
                    label="可抽奖人数"
                />
                <el-table-column
                    prop="prizewinnerNum"
                    label="中奖人数"
                />
                <el-table-column label="活动时间" width="160px">
                    <template slot-scope="scope">
                        {{ scope.row.activityStartTime }} - {{ scope.row.activityEndTime }}
                    </template>
                </el-table-column>
                <el-table-column label="活动状态">
                    <template slot-scope="scope">
                        {{ activityStatus[ scope.row.status] }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="viewNum"
                    label="浏览量"
                />
                <el-table-column
                    prop="visitorNum"
                    label="访客数"
                />
                <el-table-column
                    label="操作"
                    width="300px"
                    align="right"
                    header-align="right"
                >
                    <template #default="{row}">
                        <!--   活动'未开始'+'进行中'状态可编辑   -->
                        <Operating>
                            <template slot="button-box">
                                <a v-if="row.status"
                                   @click="goEdit(row, row.status)">
                                    编辑
                                </a>
                                <!--   活动所有状态均状态可查看数据   -->
                                <a @click="viewActivity(row)">
                                    查看数据
                                </a>
                                <!--   活动'未开始'+'已结束'状态均可删除   -->
                                <a v-if="row.status === 0 || row.status === 1"
                                   @click="deleteActivity(row)">
                                    删除
                                </a>
                                <!--   活动'进行中'+'未开始'状态均可结束   -->
                                <a v-if="row.status === 1 || row.status === 2"
                                   @click="finish(row)">
                                    结束
                                </a>
                                <!--   活动非'已结束'状态可复制 -->
                                <a @click="copy(row)">
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
            <pagination
                :total="total"
                v-model="filterCondition.current"
                @change="getActivityList"
            />
        </div>
        <Share :show.sync="qrcodeShow" :qrcode-text="qrcodeText" ref="share" />
    </div>
</template>

<script>
import { getActivityList, updateActivityStatus } from '../../../../../apis/marketing-manage/newcomers'
import { mapGetters } from 'vuex'
import Share from '../../../../../components/common/Share.vue'

export default {
    name: 'RoadLearning',
    components: {
        Share
    },
    data () {
        return {
            filterCondition: {
                keyWord: '',
                status: '',
                startTime: '',
                endTime: '',
                current: 1,
                size: 10
            },
            activityStatus: {
                0: '已结束',
                1: '未开始',
                2: '进行中'
            },
            activityList: [],
            // 活动列表总数
            total: 0,
            // 分享链接
            qrcodeText: '',
            // 分享开关
            qrcodeShow: false
        }
    },
    async created () {
        await this.getActivityList()
    },
    methods: {
        formatTimeRange ({ start, end }) {
            this.filterCondition.startTime = start || ''
            this.filterCondition.endTime = end || ''
        },
        async getActivityList () {
            try {
                const { result } = await getActivityList(this.filterCondition)
                // 如果当前页面没有数据，且页码大于1，则请求上一页
                if (result.records.length === 0 && this.filterCondition.current > 1) {
                    this.filter.current--
                    this.getActivityList()
                    return
                }
                this.activityList = result.records
                this.total = result.total
            } catch (e) {
                throw e
            }
        },
        goEdit (row, status) {
            // 编辑
            this.$router.push({ name: 'RoadLearningEdit', params: { id: row.id, status } })
        },
        viewActivity (row) {
            // 查看数据
            this.$router.push({ name: 'RoadLearningDetail', params: { id: row.id } })
        },
        async finish (row) {
            // 结束
            try {
                await this.$confirm({
                    title: '确认要结束见学之旅活动吗？',
                    message: '见学之旅活动结束后，用户将不可参与该活动， 结束后将不影响已领取奖励的用户'
                })
                await updateActivityStatus(row.id, '0')
                await this.getActivityList()
            } catch (e) {
                throw e
            }
        },
        async deleteActivity (row) {
            // 删除
            try {
                if (row.status === 1) {
                    await this.$confirm({
                        title: '确认要删除此活动吗？'
                    })
                } else {
                    await this.$confirm({
                        title: '确认要删除此活动吗？',
                        message: '活动删除后，将不可查看活动期间的相关数据！请谨慎进行删除操作。'
                    })
                }
                await updateActivityStatus(row.id, '2')
                await this.getActivityList()
            } catch (e) {
                throw e
            }
        },
        copy (row) {
            //  复制
            this.$router.push({ name: 'RoadLearningEdit', params: { id: row.id, isCopy: 'true' } })
        },
        share (row) {
            try {
                // TODO.当前只有一个活动链接，需要特殊定制的话，改变url即可
                this.qrcodeText = `${ this.mallUrl }/road-learning/${ row.id }?noCache=${ Date.now() }`
                this.qrcodeShow = true
            } catch (e) {
                throw e
            }
        }
    },
    watch: {
        filterCondition: {
            handler () {
                this.getActivityList()
            },
            deep: true
        }
    },
    computed: {
        ...mapGetters({
            mallUrl: 'user/mallUrl'
        })
    }
}
</script>

<style lang="scss" scoped>
.road-learning {
  padding: 20px;

  .road-learning-list-querybar {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 52px;
    .el-input {
      width: 220px !important;
    }
    .mr-40 {
      margin-right: 40px;
    }
  }
  .road-learning-list-content {
    background-color: white;
  }
}
</style>
