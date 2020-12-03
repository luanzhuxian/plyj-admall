<template>
    <div class="red-package-activity-list">
        <section>
            <el-button type="primary" round @click="$router.push({name:'AddRedPackage'})">
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
                    v-model="form.activityStatus"
                    clearable
                    @change="search"
                >
                    <el-option
                        label="全部"
                        value=""
                    />
                    <el-option
                        label=" 未开始"
                        :value="0"
                    />
                    <el-option
                        label="进行中"
                        :value="1"
                    />
                    <el-option
                        label="停止"
                        :value="2"
                    />
                    <el-option
                        label="结束"
                        :value="3"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="领取时间：">
                <date-range
                    ref="dateRange"
                    type="date"
                    size="small"
                    disable-after
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
                    prop="name"
                    label="福利红包名称"
                    width="200"
                />
                <el-table-column
                    prop="amount"
                    label="福利红包面额（元）"
                    width="150"
                />
                <el-table-column
                    prop="issueVolume"
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
                                <el-dropdown-item v-for="(item,index) in row.tagIdNames" :key="index">
                                    {{ item }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="applicableGoodsVolume"
                    label="适用产品数量"
                    width="150"
                />
                <el-table-column
                    prop="price"
                    label="支付金额"
                />
                <el-table-column
                    label="领取时间"
                >
                    <template #default="{ row }">
                        {{ row.receiveStartTime | dateFormat('YYYY.MM.DD') }}-{{ row.receiveEndTime | dateFormat('YYYY.MM.DD') }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="活动状态"
                    width="150"
                >
                    <template #default="{row}">
                        <div>
                            <span style="display: inline-block;width: 40px">{{ activityStatusMap[row.activityStatus] }}</span>
                            <template v-if="row.id !== 3">
                                <el-switch
                                    class="switch"
                                    v-model="row.showStatus"
                                    active-color="#4F63FF"
                                    :active-value="true"
                                    :inactive-value="false"
                                    @change="switchShowChange(row)"
                                />
                                <span v-if="row.showStatus" style="color: #4F63FF">
                                    显示
                                </span>
                                <span v-else style="color: #ccc">
                                    隐藏
                                </span>
                            </template>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="claimVolume"
                    label="领取量"
                    width="100"
                />
                <el-table-column
                    prop="useVolume"
                    label="使用量"
                    width="100"
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
                                    v-if="row.activityStatus !== 3"
                                    @click="$router.push({
                                        name: 'EditRedPackage',
                                        params: { id: row.id }
                                    })"
                                >
                                    编辑
                                </a>
                                <!-- 除'已结束'以外的，'待开始/进行中/已停止'均可'结束'活动；与优惠卷领取方式无关 -->
                                <a v-if="row.activityStatus !==3" @click="finish(row)">
                                    结束
                                </a>
                                <a @click="$router.push({
                                    name: 'RedPackageStatistics',
                                    params: { id: row.id }
                                })">
                                    数据
                                </a>
                                <a @click="share(row)">
                                    分享
                                </a>
                                <a @click="$router.push({name:'CopyRedPackage',params: { id:row.id }})">
                                    复制
                                </a>
                                <!-- 仅'已结束'的优惠券支持删除 -->
                                <a v-if="row.activityStatus === 3" @click="deleteRow(row.id)">
                                    删除
                                </a>
                                <!--  除'待开始/已结束'以外的，只有'进行中/已停止'的'自行领取'的品类券均可开启/停止 -->
                                <div v-if="row.activityStatus !==0 && row.activityStatus !==3" class="mt-12">
                                    <el-switch
                                        class="switch"
                                        v-model="row.pauseStatus"
                                        active-color="#4F63FF"
                                        :active-value="false"
                                        :inactive-value="true"
                                        @change="switchChange(row)"
                                    />
                                    <span v-show="row.pauseStatus" style="color: #ccc">
                                        停止
                                    </span>
                                    <span v-show="!row.pauseStatus" style="color: #4F63FF">
                                        开启
                                    </span>
                                </div>
                            </template>
                        </Operating>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination
                v-model="form.page"
                :total="total"
                sizes
                @sizeChange="sizeChange"
                @change="getList"
            />
        </section>

        <!--活动说明弹窗-->
        <Explanation :show.sync="showExplaination" />
        <Share :show.sync="qrcodeShow" :qrcode-text="qrcodeText" ref="share" />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Explanation from '../components/Explanation.vue'
import Share from '../../../../../components/common/Share.vue'
import { namespace } from 'vuex-class'
import {
    getRedPackageList,
    pauseRedPackage,
    overRedPackage,
    showRedPackage,
    deleteRedPackage
} from '../../../../../apis/marketing-manage/red-package'
const userModule = namespace('user')

@Component({
    components: {
        Explanation,
        Share
    }
})
export default class RedPackageActivityList extends Vue {
    @userModule.Getter('mallUrl') mallUrl!: string;
    activityStatusMap = {
        0: '未开始',
        1: '进行中',
        2: '停止',
        3: '结束'
    }

    form = {
        name: '',
        activityStatus: '',
        receiveEndTime: '',
        receiveStartTime: '',
        page: 1,
        size: 10
    }

    table = []
    total = 0
    receiveLimitType = ['所有注册用户', 'helper可用', '普通会员', '部分用户']
    showExplaination = false

    // 分享链接
    qrcodeText = ''
    // 分享开关
    qrcodeShow = false

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
            const { result = {} } = await getRedPackageList(this.form)
            this.table = result.records
            this.total = result.total
        } catch (error) {
            throw error
        }
    }

    async search () {
        try {
            this.form.page = 1
            await this.getList()
        } catch (error) {
            throw error
        }
    }

    async resetFilter () {
        try {
            this.form = {
                name: '',
                activityStatus: '',
                receiveEndTime: '',
                receiveStartTime: '',
                page: 1,
                size: 10
            };
            (this.$refs.dateRange as HTMLFormElement).clear()
            await this.getList()
        } catch (error) {
            throw error
        }
    }

    async dateChange (val: { start: string; end: string }) {
        try {
            this.form.receiveEndTime = val.start
            this.form.receiveStartTime = val.end
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

    async switchShowChange (row: { id: string;activityStatus: number; showStatus: boolean }) {
        try {
            await showRedPackage(row.id, row.showStatus)
            await this.getList()
            this.$success('操作成功')
        } catch (error) {
            if (row.activityStatus) {
                row.showStatus = false
            } else {
                row.showStatus = true
            }
            throw error
        }
    }

    async switchChange (row: { id: string;activityStatus: number; pauseStatus: boolean }) {
        try {
            if (row.pauseStatus) {
                await this.$confirm({
                    title: '确认要停止该福利红包活动吗？',
                    message: '该福利红包活动停止后，用户不可在店铺中查看和领取该福利红包活动。'
                })
            }
            await pauseRedPackage(row.id, row.pauseStatus)
            await this.getList()
            this.$success('操作成功')
        } catch (error) {
            if (row.activityStatus) {
                row.pauseStatus = false
            } else {
                row.pauseStatus = true
            }
            throw error
        }
    }

    async deleteRow (id: string) {
        try {
            await this.$confirm({
                title: '确认要删除该活动吗？删除后不可数据恢复',
                message: '活动删除后，经不可查看活动期间的相关数据！请谨慎进行删除'
            })
            await deleteRedPackage(id)
            this.$success('删除成功')
            await this.getList()
        } catch (error) {
            throw error
        }
    }

    async finish (row: { id: string;activityStatus: number }) {
        try {
            row.activityStatus === 0 ? await this.$confirm({ title: '该福利红包活动还未开始，确定要结束吗？', message: '该品福利红包活动结束后，用户不可在店铺中查看和领取该福利红包，且结束后不可重新开启活动' }) : await this.$confirm({ title: '确认结束该福利红包得活动吗？', message: '该品福利红包活动结束后，用户不可在店铺中查看和领取该福利红包，且结束后不可重新开启活动，已领取成功得用户不受此改动的影响' })
            await overRedPackage(row.id)
            this.$success('该福利红包活动结束成功')
            await this.search()
        } catch (error) {
            throw error
        }
    }

    async share (row: { id: string }) {
        try {
            this.qrcodeText = `${ this.mallUrl }/red-package/detail/${ row.id }?noCache=${ Date.now() }`
            this.qrcodeShow = true
        } catch (e) {
            throw e
        }
    }
}
</script>

<style lang="scss">
.red-package-activity-list {
    padding-top: 30px;
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
