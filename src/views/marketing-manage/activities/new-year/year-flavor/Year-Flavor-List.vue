<template>
    <div class="coupon-list">
        <search-box class="mt-24">
            <el-form-item label="状态：">
                <el-select
                    :clearable="true"
                    v-model="form.status"
                    @change="search"
                >
                    <el-option
                        label="全部活动状态"
                        value=""
                    />
                    <el-option
                        label="待开始"
                        :value="0"
                    />
                    <el-option
                        label="进行中"
                        :value="1"
                    />
                    <el-option
                        label="已结束"
                        :value="2"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="活动时间：">
                <date-range
                    :clearable="true"
                    @change="dateChange"
                    type="date"
                    size="small"
                    start-label="活动时间："
                    range-separator="至"
                    end-label=""
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    round
                    type="primary"
                    @click="search"
                >
                    查询
                </el-button>
            </el-form-item>
        </search-box>
        <div>
            <el-table
                class="content-table"
                :data="table"
                ref="table"
            >
                <span
                    slot="empty"
                    class="empty"
                >
                    <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />暂无活动，快去创建吧！
                </span>
                <el-table-column
                    label="活动名称 "
                    header-align="center"
                    align="center"
                >
                    <template>
                        我心中的年味
                    </template>
                </el-table-column>
                <el-table-column
                    label="参与人数"
                    prop="takeSum"
                />
                <el-table-column
                    label="可抽奖人数"
                    prop="drawSum"
                />
                <el-table-column
                    label="中奖人数"
                    prop="hasSum"
                />
                <el-table-column
                    label="活动时间"
                    width="300"
                >
                    <template slot-scope="{row}">
                        {{ row.startTime }} ~ {{ row.endTime }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="statusText"
                    label="状态"
                    width="80"
                />
                <el-table-column
                    prop="pv"
                    label="浏览量"
                    width="100"
                />
                <el-table-column
                    prop="uv"
                    label="访客量"
                    width="100"
                />
                <el-table-column
                    label="操作"
                    align="right"
                    header-align="right"
                    width="450"
                >
                    <template slot-scope="{ row }">
                        <!--  除'已结束'以外的，'待开始/进行中/已停止'均可编辑 -->
                        <Operating>
                            <template slot="button-box">
                                <a
                                    v-if="![2,3].includes(row.status)"
                                    @click="$router.push({name: 'EditYearFlavor', params: { id: row.activityId}})"
                                >
                                    编辑
                                </a>
                                <!-- 除'已结束'以外的，'待开始/进行中/已停止'均可'结束'活动；与优惠卷领取方式无关 -->
                                <a
                                    v-if="![2,3].includes(row.status)"
                                    @click="finish(row)"
                                >
                                    结束
                                </a>
                                <a
                                    @click="viewYearFlavor(row)"
                                >
                                    查看
                                </a>
                                <a
                                    @click="viewYearFlavorData(row)"
                                >
                                    数据
                                </a>
                                <a
                                    v-if="row.status === 2"
                                    @click="deleteYearFlavor(row)"
                                >
                                    删除
                                </a>
                                <a @click="$router.push({ name: 'CopyYearFlavor', params: { id: row.activityId }, query: { isCopy: 1 } })">
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
                @change="getList"
                @sizeChange="sizeChange"
                v-model="form.current"
                :total="total"
                :sizes="true"
            />
            <Share
                :show.sync="showShare"
                :qrcode-text="shareText"
                qrcode-image-name="我心中的年味分享二维码"
            />
        </div>
    </div>
</template>
<script>
import Pagination from '../../../../../components/common/Pagination.vue'
import Share from '../../../../../components/common/Share.vue'
import { couponModifystatus } from '../../../../../apis/marketing-manage/coupon'
import { queryActivityInfo, endingActivity } from '../../../../../apis/marketing-manage/new-year/year-flavor'
export default {
    name: 'YearFlavorList',
    components: {
        Pagination,
        Share
    },
    data () {
        return {
            showShare: false,
            shareText: '',
            table: [],
            detail: {},
            keywords: '',
            form: {
                status: '',
                startTime: '',
                endTime: '',
                current: 1,
                size: 10
            },
            total: 0,
            guideStatus: false
        }
    },
    watch: {
    // $route (to, from) {
    //   this.form.size = 10
    //   this.getList()
    // }
    },
    created () {
        this.getList()
    },
    decreated () {
        this.form = {
            status: '',
            startTime: '',
            endTime: '',
            current: 1,
            size: 10
        }
    },
    methods: {
        async viewYearFlavor (row) {
            this.$router.push({ name: 'ViewYearFlavorInfo', params: { id: row.activityId } })
        },
        async viewYearFlavorData (row) {
            this.$router.push({ name: 'ViewYearFlavorData', params: { id: row.activityId } })
        },
        async switchChange (row) {
            try {
                const data = {
                    id: row.id,
                    status: row.pureStatus
                }
                await couponModifystatus(data)
                this.getList()
            } catch (e) {
                if (row.status) {
                    row.pureStatus = 0
                } else {
                    row.pureStatus = 1
                }
                throw e
            }
        },
        async finish ({ activityId }) {
            try {
                await this.$confirm({
                    title: '确认要结束活动？',
                    message: '活动结束后，用户将不可参与该活动，停止后将不影响已领取活动奖励的用户'
                })
                await endingActivity({ activityId, status: 2 })
                this.$success('结束成功')
                this.search()
            } catch (e) {
                throw e
            }
        },
        async deleteYearFlavor ({ activityId }) {
            try {
                await this.$confirm({
                    title: '确认要删除该活动吗？',
                    message: '活动删除后，将不可查看活动期间的相关数据！请谨慎进行删除操作。'
                })
                await endingActivity({ activityId, status: 3 })
                this.$success('删除成功')
                this.search()
            } catch (e) {
                throw e
            }
        },
        search () {
            this.form.current = 1
            this.getList()
        },
        share ({ activityId }) {
            this.shareText = `${ this.$store.getters['user/mallUrl'] }/new-year-activity/${ activityId }`
            this.showShare = true
        },
        sizeChange (val) {
            this.form.current = 1
            this.form.size = val
            this.getList()
        },
        async getList () {
            try {
                const { result } = await queryActivityInfo(this.form)
                this.table = result.records
                this.total = result.total
            } catch (e) {
                throw e
            }
        },
        dateChange (val) {
            this.form.startTime = val.start
            this.form.endTime = val.end
            this.form.current = 1
            this.getList()
        }
    }
}
</script>

<style scoped lang="scss">
  .inline-b{
    display: inline-block;
  }
  .flex-align {
    display: flex;
    align-items: center;
  }
  .coupon-list{
    min-height: calc(100vh - 120px);
    padding-bottom: 30px;
    background-color: #ffffff;

    .ml-40 {
      margin-left: 40px;
    }

    .empty{
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        width: 12px;
        margin-right: 8px;
      }
    }
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
