<template>
    <div class="bg-white wrap">
        <ListHeader
            icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/%E6%8A%BD%E5%A5%96%E4%B9%90%E7%BF%BB%E5%A4%A9.png"
            title="抽奖乐翻天"
            description="低成本高引流，多种主题任意选"
            :start-time="HappyLotteryInformation.createTime"
            end-time="2021-03-31"
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
                    <span>{{ row.startTime | dateFormat('YYYY-MM-DD') }} ~ {{ row.endTime | dateFormat('YYYY-MM-DD') }}</span>
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
                            <a
                                @click="endLottery(row)" v-if="row.status === 1 || row.status === 2"
                            >
                                结束
                            </a>
                            <a
                                v-if="row.status === 1 || row.status === 2" @click="$router.push({ name: 'EditHappyLottery', params: { id: row.id } })"
                            >
                                编辑
                            </a>
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
                            <a
                                @click="$router.push({ name: 'AddHappyLottery', params: { id: row.id }, query: { copy: 1 } })"
                            >
                                复制
                            </a>
                            <a
                                v-if="row.status === 1 || row.status === 2" @click="share(row)"
                            >
                                分享活动
                            </a>
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
            qrcode-image-name="抽奖乐翻天分享二维码"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ListHeader from '../../../../components/marketing-manage/List-Header.vue'
import { namespace } from 'vuex-class'
import Share from '../../../../components/common/Share.vue'
import moment from 'moment'
import {
    getLottery,
    endLottery,
    delLottery,
    GetLotteryFrom
} from '../../../../apis/marketing-manage/lonmen-festival/lottery'
import { MutationTypes } from '../../../../store/mutation-type'

const accountModule = namespace('account')
@Component({
    components: {
        ListHeader,
        Share
    }
})
export default class HappyLotteryList extends Vue {
    moment = moment
    form = new GetLotteryFrom({
        size: 10,
        type: 2,
        current: 1,
        startDate: '',
        endDate: '',
        activityName: ''
    })

    data = []
    total = 0
    userGroupMap = ['所有用户', 'Helper', '普通会员', '指定用户分组']
    statusMap = ['', '未开始', '进行中', '已结束', '已关闭']
    HappyLotteryInformation = {}
    showShare = false
    shareText = ''

    @accountModule.Getter('marketStatusAuth') marketStatusAuth!: any[]
    @accountModule.Action(MutationTypes.getMarketStatusAuth) getMarketStatusAuth!: Function

    async created () {
        if (!this.marketStatusAuth || !this.marketStatusAuth.length) await this.getMarketStatusAuth()
        this.HappyLotteryInformation = this.marketStatusAuth.find(({ programId }) => programId === '7')
        try {
            await this.getLottery(1)
        } catch (e) {
            throw e
        }
    }

    // methods
    async getLottery (page = 0) {
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
    }

    async resetFilter () {
        this.form = new GetLotteryFrom({
            size: 10,
            type: 2,
            current: 1,
            startDate: '',
            endDate: '',
            activityName: ''
        });
        (this.$refs.dateRange as HTMLFormElement).clear()
        await this.getLottery(1)
    }

    dateChange ({ start, end }: { start: string; end: string }) {
        this.form.startDate = start || ''
        this.form.endDate = end || ''
        try {
            this.getLottery(1)
        } catch (e) {
            throw e
        }
    }

    async endLottery (row: any) {
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
    }

    async delLottery (row: any) {
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
    }

    share (row: any) {
        this.shareText = `${ this.$store.getters['user/mallUrl'] }/happy-lottery/${ row.id }`
        this.showShare = true
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
