<template>
    <div class="red-package-activity-list">
        <section>
            <el-button type="primary" round @click="$router.push({name:'AddCategoryCoupon'})">
                新建活动
                <i class="el-icon-plus el-icon--right" />
            </el-button>
            <el-button type="text" @click="showExplaination = true">
                活动说明
            </el-button>
        </section>
        <SearchBox class="mt-24">
            <el-form-item label="搜索内容：">
                <el-input
                    v-model.trim="form.name"
                    placeholder="请输入福利红包活动名称"
                    clearable
                    @change="search"
                />
            </el-form-item>
            <el-form-item label="状态：">
                <el-select
                    v-model="form.status"
                    clearable
                    @change="search"
                >
                    <el-option
                        label="全部"
                        value=""
                    />
                    <el-option
                        label="待使用"
                        :value="0"
                    />
                    <el-option
                        label="已使用"
                        :value="2"
                    />
                    <el-option
                        label="已过期"
                        :value="3"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="领取时间：">
                <date-range
                    ref="dateRange"
                    type="date"
                    size="small"
                    start-label="领取时间："
                    end-label=""
                    range-separator="至"
                    clearable
                    @change="dateChange"
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
                <el-button type="text" @click="resetFilter">
                    清空筛选条件
                </el-button>
            </el-form-item>
        </SearchBox>
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
                    label="福利红包名称"
                    width="200"
                />
                <el-table-column
                    prop="useLimitAmount"
                    label="福利红包面额（元）"
                    width="150"
                />
                <el-table-column
                    prop="useLimitAmount"
                    label="发放数量"
                />
                <el-table-column
                    label="适用用户"
                    width="200"
                >
                    <template slot-scope="{row}">
                        <div v-if="row.receiveLimit !== 3">
                            {{ row.receiveLimit === '' && row.distributionMethod === 1 ? '所有注册用户' : receiveLimitType[row.receiveLimit] }}
                        </div>
                        <el-dropdown v-else trigger="click">
                            <span class="user-category-dropdown">
                                部分用户<i class="el-icon-arrow-down el-icon--right" />
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(item,index) in row.couponTagList" :key="index">
                                    {{ item.tagName }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="useLimitAmount"
                    label="适用产品数量"
                    width="150"
                />
                <el-table-column
                    prop="useLimitAmount"
                    label="支付金额"
                />
                <el-table-column
                    label="活动时间"
                    width="200"
                >
                    <template slot-scope="{row}">
                        {{ row.useStartTime.split(' ')[0] }} ~ {{ row.useEndTime.split(' ')[0] }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="receiveAmount"
                    label="领取量"
                    width="100"
                />
                <el-table-column
                    prop="usedAmount"
                    label="使用量"
                    width="100"
                />
                <el-table-column
                    prop="statusText"
                    label="活动状态"
                />
                <el-table-column
                    label="操作"
                    align="right"
                    header-align="right"
                    width="100"
                >
                    <template slot-scope="{ row }">
                        <Operating>
                            <template slot="button-box">
                                <!--  除'已结束'以外的，'待开始/进行中/已停止'均可编辑 -->
                                <a
                                    v-if="row.status !== 3"
                                    @click="$router.push({
                                        name: 'EditCategoryCoupon',
                                        params: { id: row.id }
                                    })"
                                >
                                    编辑
                                </a>
                                <!-- 除'已结束'以外的，'待开始/进行中/已停止'均可'结束'活动；与优惠卷领取方式无关 -->
                                <a v-if="row.status !==3" @click="finish(row)">
                                    结束
                                </a>
                                <a @click="$router.push({
                                    name: 'RedPackageStatistics',
                                    params: { id: row.id }
                                })">
                                    数据
                                </a>
                                <a>
                                    分享
                                </a>
                                <a @click="$router.push({
                                    name: 'CopyCategoryCoupon',
                                    params: { id: row.id }
                                })">
                                    复制
                                </a>
                                <!-- 仅'已结束'的优惠券支持删除 -->
                                <a v-if="row.status === 3" @click="delete(row.id)">
                                    删除
                                </a>
                                <!--  除'待开始/已结束'以外的，只有'进行中/已停止'的'自行领取'的品类券均可开启/停止 -->
                                <div class="inline-b" v-if="row.status !==2 && row.status !==3 && row.distributionMethod === 0">
                                    <el-switch
                                        class="switch"
                                        v-model="row.pureStatus"
                                        active-color="#4F63FF"
                                        :active-value="1"
                                        :inactive-value="0"
                                        :disabled="row.status === 2"
                                        @change="switchChange(row)"
                                    />
                                    <span v-if="row.pureStatus" style="color: #4F63FF">
                                        开启
                                    </span>
                                    <span v-else style="color: #ccc">
                                        停止
                                    </span>
                                </div>
                            </template>
                        </Operating>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination
                v-model="form.current"
                :total="total"
                sizes
                @sizeChange="sizeChange"
                @change="getList"
            />
        </section>

        <!--活动说明弹窗-->
        <Explanation :show.sync="showExplaination" />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Explanation from '../components/Explanation.vue'
import {
    getCouponList,
    couponModifystatus,
    // coupleIsFirstTime,
    getActivityListUseCoupon,
    deleteCoupon
} from '../../../../../apis/marketing-manage/coupon'

@Component({
    components: {
        Explanation
    }
})
export default class RedPackageActivityList extends Vue {
    /* data */
    form = {
        couponType: 2,
        name: '',
        status: '',
        startTime: '',
        endTime: '',
        current: 1,
        size: 10
    }

    table = []
    total = 0
    receiveLimitType = ['所有注册用户', 'helper可用', '普通会员', '部分用户']
    showExplaination = false

    async created () {
        try {
            await this.getList()
        } catch (error) {
            throw error
        }
    }

    /* methods */
    async getList () {
        try {
            const { result = {} } = await getCouponList(this.form)
            this.table = result.records
            this.total = result.total
        } catch (error) {
            throw error
        }
    }

    async search () {
        try {
            this.form.current = 1
            await this.getList()
        } catch (error) {
            throw error
        }
    }

    async resetFilter () {
        try {
            this.form = {
                couponType: 2,
                name: '',
                status: '',
                startTime: '',
                endTime: '',
                current: 1,
                size: 10
            }
            // @ts-ignore
            this.$refs.dateRange.clear()
            await this.getList()
        } catch (error) {
            throw error
        }
    }

    async dateChange (val: { start: string; end: string }) {
        try {
            this.form.startTime = val.start
            this.form.endTime = val.end
            await this.search()
        } catch (error) {
            throw error
        }
    }

    async sizeChange (val: number) {
        try {
            this.form.size = val
            await this.search()
        } catch (error) {
            throw error
        }
    }

    async switchChange (row: { id: string; status: number; pureStatus: number }) {
        try {
            const data = {
                id: row.id,
                status: row.pureStatus
            }
            await couponModifystatus(data)
            await this.getList()
        } catch (error) {
            if (row.status) {
                row.pureStatus = 0
            } else {
                row.pureStatus = 1
            }
            throw error
        }
    }

    async delete (id: string) {
        try {
            await this.$confirm({
                title: '确认要删除该优惠券吗？',
                message: '优惠券删除后，将不可查看活动期间的相关数据！请谨慎进行删除操作。'
            })
            await deleteCoupon(id)
            this.$success('删除成功')
            await this.getList()
        } catch (error) {
            throw error
        }
    }

    async finish (row: { id: string }) {
        try {
            const { result = {} } = await getActivityListUseCoupon(row.id)
            if (result.containInviting || result.containLiveActivity || result.containNewcomer) {
                await this.$confirm({
                    title: '确认结束该品类券？',
                    message: `结束后${ result.containInviting ? '赢取豪礼活动将移除该品类券，' : '' }${ result.containNewcomer ? '新人有礼活动将结束或移除该品类券，' : '' }${ result.containLiveActivity ? '直播活动将移除该品类券，' : '' }请慎重考虑！！！`
                })
            } else {
                await this.$confirm({ title: '确认要结束品类券发放活动吗？', message: '该品类券结束发放后，其他营销活动不可选择进行活动发放，且不可重新进行开启，已领取成功用户不受此改动的影响' })
            }
            const data = {
                id: row.id,
                status: 3
            }
            await couponModifystatus(data)
            this.$success('该券结束成功')
            await this.search()
        } catch (error) {
            throw error
        }
    }
}
</script>

<style lang="scss">
.red-package-activity-list {
    padding-top: 30px;
    .inline-b {
        display: inline-block;
        padding-right: 10px;
    }
    .switch {
        margin-left: 10px;
    }
    .user-category-dropdown {
        padding: 3px 10px;
        font-size: 12px;
        color: #222222;
        background-color: #eee;
        border: 1px solid #ccc;
    }
}

</style>
