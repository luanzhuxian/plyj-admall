<template>
    <div class="bg-white pb-20">
        <ListHeader
            icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/龙门抽大奖.png"
            title="龙门抽大奖"
            description="回馈新老用户，加享赢大礼"
            :start-time="HappyLotteryInformation.createTime"
            end-time="2020-08-31"
        />
        <el-button type="primary" round icon="el-icon-plus" @click="$router.push({ name: 'AddHappyLottery' })">
            新建活动
        </el-button>
        <search-box inline class="mt-24">
            <el-form-item label="搜索内容：">
                <el-input clearable v-model="form.activityName" placeholder="活动名称" @change="getLottery(1)" />
            </el-form-item>
            <el-form-item label="时间选择：">
                <date-range
                    @change="dateChange"
                    clearable
                    ref="dateRange"
                />
            </el-form-item>
            <el-form-item>
                <el-button round type="primary" @click="getLottery(1)">
                    查询
                </el-button>
                <el-button type="text" @click="resetFilter">
                    清空筛选条件
                </el-button>
            </el-form-item>
        </search-box>

        <el-table :data="data">
            <el-table-column
                label="活动名称"
                prop="name"
                align="left"
                header-align="left"
            />
            <el-table-column label="活动对象">
                <template #default="{ row }">
                    <span v-text="userGroupMap[row.userRange]" />
                    <el-popover
                        placement="right"
                        trigger="hover"
                        title="查看分组"
                        v-if="row.userRange === 3"
                    >
                        <ul :class="$style.group">
                            <li
                                v-for="(item, i) of row.userGroups"
                                :key="i"
                            >
                                {{ item.groupName }}
                            </li>
                        </ul>
                        <el-button slot="reference" type="text">
                            &nbsp;&nbsp;
                            查看
                        </el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="礼品数量" width="150" prop="giftNumber" />
            <el-table-column label="参与人数" width="150" prop="joinUserNumber" />
            <el-table-column label="活动时间" width="300">
                <template #default="{ row }">
                    <span>{{ row.startTime }} ~ {{ row.endTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="活动状态" width="150">
                <template #default="{ row }">
                    <span v-text="statusMap[row.status]" />
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="right"
                header-align="right"
                width="100"
            >
                <template slot-scope="{ row }">
                    <Operating>
                        <template slot="button-box">
                            <!--                            <a-->
                            <!--                                @click="endLottery(row)" v-if="row.status === 1 || row.status === 2"-->
                            <!--                            >-->
                            <!--                                结束-->
                            <!--                            </a>-->
                            <!--                            <a-->
                            <!--                                v-if="row.status === 1 || row.status === 2" @click="$router.push({ name: 'EditHappyLottery', params: { id: row.id } })"-->
                            <!--                            >-->
                            <!--                                编辑-->
                            <!--                            </a>-->
                            <a
                                @click="$router.push({name: 'HappyLotteryInfo', params: {id : row.id},query: {status: row.status}})"
                            >
                                查看
                            </a>
                            <a
                                @click="$router.push({name: 'HappyLotteryData', params: {id : row.id},query: {status: row.status}})"
                            >
                                数据
                            </a>
                            <a
                                @click="delLottery(row)" v-if="row.status === 3 || row.status === 4"
                            >
                                删除
                            </a>
                            <!--                            <a-->
                            <!--                                @click="$router.push({ name: 'AddHappyLottery', params: { id: row.id }, query: { copy: 1 } })"-->
                            <!--                            >-->
                            <!--                                复制-->
                            <!--                            </a>-->
                            <!--                            <a-->
                            <!--                                v-if="row.status === 1 || row.status === 2" @click="share(row)"-->
                            <!--                            >-->
                            <!--                                分享活动-->
                            <!--                            </a>-->
                        </template>
                    </Operating>
                </template>
            </el-table-column>
        </el-table>
        <Pagination
            :total="total"
            v-model="form.current"
            @change="getLottery"
        />
        <Share
            :show.sync="showShare"
            :qrcode-text="shareText"
            qrcode-image-name="龙门抽大奖分享二维码"
        />
    </div>
</template>

<script>
import ListHeader from '../../components/List-Header'
import { mapGetters, mapActions } from 'vuex'
import Share from '../../../../components/common/Share.vue'
import moment from 'moment'
import {
    getLottery,
    endLottery,
    delLottery
} from '../../../../apis/marketing-manage/lonmen-festival/lottery'
import { MutationTypes } from '../../../../store/mutation-type'
export default {
    name: 'HappyLotteryList',
    components: {
        ListHeader,
        Share
    },
    data () {
        return {
            moment,
            form: {
                activityName: '',
                startDate: '',
                endDate: '',
                current: 1,
                size: 10
            },
            data: [],
            total: 0,
            userGroupMap: ['所有用户', 'Helper', '普通会员', '指定用户分组'],
            statusMap: ['', '未开始', '进行中', '已结束', '已关闭'],
            HappyLotteryInformation: {},
            showShare: false,
            shareText: ''
        }
    },
    computed: {
        ...mapGetters({
            marketStatusAuth: 'account/marketStatusAuth'
        })
    },
    async created () {
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this[MutationTypes.getMarketStatusAuth]()
        this.HappyLotteryInformation = this.marketStatusAuth.find(({ programId }) => programId === '7')
        try {
            await this.getLottery()
        } catch (e) {
            throw e
        }
    },
    methods: {
        ...mapActions('account', [MutationTypes.getMarketStatusAuth]),
        async getLottery (page) {
            if (page) {
                this.form.current = page
            }
            try {
                const { result } = await getLottery(this.form)
                this.total = result.total
                this.data = result.records
            } catch (e) {
                throw e
            }
        },
        async resetFilter () {
            this.form = {
                activityName: '',
                startDate: '',
                endDate: '',
                current: 1,
                size: 10
            }
            this.$refs.dateRange.clear()
            await this.getLottery()
        },
        dateChange ({ start, end }) {
            this.form.startDate = start || ''
            this.form.endDate = end || ''
            try {
                this.getLottery(1)
            } catch (e) {
                throw e
            }
        },
        async endLottery (row) {
            try {
                await this.$confirm({
                    title: '确定结束该活动吗？',
                    message: '活动结束后，用户不可获得抽奖机会，所有未抽奖的用户，抽奖次数新增'
                })
                await endLottery(row.id)
                this.$success('已结束')
                await this.getLottery()
            } catch (e) {
                if (e) throw e
            }
        },
        async delLottery (row) {
            try {
                await this.$confirm({
                    title: '确认要删除此活动吗？',
                    message: '活动删除后，将不可查看活动期间的相关数据！请谨慎进行删除操作。'
                })
                await delLottery(row.id)
                this.$success('已删除')
                await this.getLottery()
            } catch (e) {
                if (e) throw e
            }
        },
        share (row) {
            this.shareText = `${ this.$store.getters['user/mallUrl'] }/longmen-festival/lottery/${ row.id }`
            this.showShare = true
        }
    }
}
</script>

<style module lang="scss">
  .header {
    display: flex;
    /*justify-content: space-between;*/
    align-items: center;
    height: 52px;
    padding: 0 24px;
    background-color: #fff;
    .activity-icon{
      display: flex;
      align-items: center;
      img{
        width: 23px;
      }
    }
    button{
      margin-left: 16px;
    }
  }
  .group {
    display: inline-grid;
    grid-template-columns: auto auto auto;
    grid-gap: 5px 16px;
    > li {
      display: inline-flex;
      align-items: center;
      width: max-content;
      height: 24px !important;
      padding: 0 2px;
      line-height: 14px;
      border: 1px solid $--color-primary-orange;
      font-size: 12px;
      color: $--color-primary-orange;
    }
  }
</style>
