<template>
    <div>
        <SearchBox>
            <el-form-item label="关键字：">
                <el-input
                    clearable
                    @change="search"
                    placeholder="请输入直播名称"
                    v-model="liveWatchListForm.keyword"
                />
            </el-form-item>
            <el-form-item label="类型：">
                <el-select
                    v-model="liveWatchListForm.liveType"
                    @change="search"
                    clearable
                >
                    <el-option :value="''" label="全部" />
                    <el-option :value="'live'" label="实时直播" />
                    <el-option :value="'video'" label="录制直播" />
                </el-select>
            </el-form-item>
            <el-form-item label="直播时间：">
                <date-range
                    @change="formatLiveWatchListTimeRange"
                    disable-after
                    clearable
                    ref="dateRange"
                />
            </el-form-item>
            <el-form-item label="形式：">
                <el-select
                    v-model="liveWatchListForm.liveMode"
                    @change="search"
                    clearable
                >
                    <el-option :value="''" label="全部" />
                    <el-option :value="'public'" label="公开课" />
                    <el-option :value="'private'" label="私享课" />
                </el-select>
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
                    @click="changeExportLiveWatchList"
                    type="primary"
                    plain
                    round
                    v-if="liveWatchList && liveWatchList.length"
                >
                    导出数据
                </el-button>
                <el-button type="text" @click="resetLiveWatchList">清空筛选条件</el-button>
            </el-form-item>
        </SearchBox>

        <el-table
            key="LiveWatchList"
            :data="liveWatchList"
            class="table-customer"
            style="width: 100%"
        >

            <el-table-column
                prop="liveStartTime"
                label="直播时间"
            />
            <el-table-column
                prop="liveName"
                label="直播信息"
                width="200px"
            >
                <template #default="{ row }">
                    <div>
                        <img style="width: 75px; height: 50px; margin-right: 10px; vertical-align: top;" :src="row.liveFrontCover" alt="">
                        <span style="display:inline-block; width: 90px">{{ row.liveName }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="liveMode"
                label="形式"
            >
                <template #default="{ row }">
                    {{ row.liveType === 'public' ? '公开课' : '私享课' }}
                </template>
            </el-table-column>
            <el-table-column
                prop="liveType"
                label="类型"
            >
                <template #default="{ row }">
                    {{ row.liveType === 'live' ? '实时直播' : '录制直播' }}
                </template>
            </el-table-column>
            <el-table-column
                prop="amount"
                label="实付款（元）">
                <template #default="{ row }">
                    {{ row.amount / 100 }}
                </template>
            </el-table-column>
            <el-table-column
                prop="amount"
                label="支付优惠"
            />
            <el-table-column
                prop="firstViewingTime"
                label="首次观看时间"
            />
            <!--<el-table-column
                fixed="right"
                label="操作"
            >
                <template #default="{ row }">
                    <el-button type="text" @click="$router.push({ name: 'OnlineSchoolOrderDetail', params: { id: row.orderId } })">
                        订单详情
                    </el-button>
                </template>
            </el-table-column>-->
        </el-table>
        <Pagination
            @change="getLiveWatchList"
            v-model="liveWatchListForm.current"
            :total="liveWatchListTotal"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator'
import {
    getLiveWatchList
} from '../../../../apis/member'
@Component
export default class MemberLiveRecord extends Vue {
    liveWatchList = []
    liveWatchListTotal = 0
    // 直播观看记录
    liveWatchListForm = {
        mallUserId: '',
        current: 1,
        size: 10,
        keyword: '',
        liveMode: '',
        liveType: '',
        liveStartTime: '',
        liveEndTime: '',
        liveWatchStartTime: '',
        liveWatchEndTime: ''
    }

    @Prop() userId!: string
    @Prop({ type: Array }) orderType!: DynamicObject[]
    @Prop({ type: Array }) orderStatusMap!: DynamicObject[]

    async activated () {
        await this.search()
    }

    // methods
    // 直播观看记录
    async getLiveWatchList () {
        try {
            this.liveWatchListForm.mallUserId = this.userId
            const { result: { records, total } }: DynamicObject = await getLiveWatchList(this.liveWatchListForm)
            this.liveWatchList = records || []
            this.liveWatchListTotal = total || 0
        } catch (e) {
            throw e
        }
    }

    async search () {
        try {
            this.liveWatchListForm.current = 1
            await this.getLiveWatchList()
        } catch (e) {
            throw e
        }
    }

    async formatLiveWatchListTimeRange ({ start, end }: DynamicObject) {
        try {
            this.liveWatchListForm.liveWatchStartTime = start
            this.liveWatchListForm.liveWatchEndTime = end
            await this.search()
        } catch (e) {
            throw e
        }
    }

    async resetLiveWatchList () {
        this.liveWatchListForm = {
            mallUserId: '',
            current: 1,
            size: 10,
            keyword: '',
            liveMode: '',
            liveType: '',
            liveStartTime: '',
            liveEndTime: '',
            liveWatchStartTime: '',
            liveWatchEndTime: ''
        }
        await this.getLiveWatchList()
    }

    changeExportLiveWatchList () {
        // todo
        console.log(1111)
    }
}
</script>

<style module lang="scss">

</style>
