
<template>
    <div class="newcomers-list bg-white">
        <search-box class="mt-24">
            <el-form-item label="搜索内容：">
                <el-input placeholder="活动名称/活动ID" v-model.trim="form.keyword" clearable @change="search" />
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model="form.status" @change="search" clearable>
                    <el-option v-for="(item,index) in activityStatus" :label="item.label" :value="item.value" :key="index" />
                </el-select>
            </el-form-item>
            <el-form-item label="活动时间：">
                <date-range
                    clearable
                    @change="dateChange"
                />
            </el-form-item>
            <el-form-item>
                <el-button round type="primary" @click="search">
                    查询
                </el-button>
            </el-form-item>
        </search-box>
        <div>
            <el-table :data="list">
                <el-table-column label="活动ID" prop="id" />
                <el-table-column label="活动名称" prop="activityName" />
                <el-table-column label="活动商品数量（个）" prop="productCount" width="150" />
                <el-table-column label="参与人数（个）" prop="participatorNum" width="150" />
                <el-table-column label="活动时间">
                    <template #default="{ row }">
                        {{ row.startTime }} - {{ row.endTime }}
                    </template>
                </el-table-column>
                <el-table-column label="活动状态" prop="statusDesc" width="90" />
                <el-table-column
                    label="操作"
                    align="right"
                    header-align="right"
                    width="100"
                >
                    <template slot-scope="{ row }">
                        <Operating>
                            <template slot="button-box">
                                <!--                                <a-->
                                <!--                                    v-if="[1,2].includes(row.definiteStatus)"-->
                                <!--                                    @click="$router.push({ name: 'EditLongmenPublicBenefit', params: { id: row.id } })"-->
                                <!--                                >-->
                                <!--                                    编辑-->
                                <!--                                </a>-->
                                <a
                                    @click="$router.push({ name: 'LongmenPublicBenefitDetail', params: { id: row.id } })"
                                >
                                    详情
                                </a>
                                <a
                                    @click="$router.push({ name: 'LongmenPublicBenefitData', params: { id: row.id } })"
                                >
                                    查看数据
                                </a>
                                <!-- definiteStatus 1未开始，2进行中，3已过期，4已结束 -->
                                <!--                                <a-->
                                <!--                                    v-if="row.definiteStatus === 4"-->
                                <!--                                    @click="deleteActivity(row)"-->
                                <!--                                >-->
                                <!--                                    删除-->
                                <!--                                </a>-->
                                <!--                                <a-->
                                <!--                                    v-if="[1,2,3].indexOf(row.definiteStatus) !== -1"-->
                                <!--                                    @click="overActivity(row.id)"-->
                                <!--                                >-->
                                <!--                                    结束-->
                                <!--                                </a>-->
                                <!--                                <a-->
                                <!--                                    style="margin-bottom:5px;"-->
                                <!--                                    @click="$router.push({ name: 'CopyLongmenPublicBenefit', params: { id: row.id, copy: '1' } })"-->
                                <!--                                >-->
                                <!--                                    复制-->
                                <!--                                </a>-->
                                <!--                                <a-->
                                <!--                                    @click="share(row.id)"-->
                                <!--                                >-->
                                <!--                                    分享-->
                                <!--                                </a>-->
                            </template>
                        </Operating>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination
                v-model="form.current"
                :total="total"
                :sizes="true"
                @sizeChange="sizeChange"
                @change="getList"
            />
        </div>
        <Share :show.sync="qrcodeShow" :qrcode-text="qrcodeText" ref="share" />
    </div>
</template>

<script>
import moment from 'moment'
import Share from '../../../../../components/common/Share.vue'
import { getPublicBenefitList, updatePublicBenefitStatus } from '../../../../../apis/marketing-manage/lonmen-festival/public-benefit'

export default {
    name: 'LongmenPublicBenefitList',
    components: {
        Share
    },
    data () {
        return {
            list: [],
            activityStatus: [
                { label: '全部', value: 'ALL' },
                { label: '未开始', value: 'NO_START' },
                { label: '进行中', value: 'STARTING' },
                { label: '已结束', value: 'END' },
                { label: '已过期', value: 'TIMED_OUT' }
            ],
            total: 0,
            form: {
                size: 10,
                current: 1,
                keyword: '',
                status: 'ALL',
                startTime: '',
                endTime: ''
            },
            // 分享链接
            qrcodeText: '',
            // 分享开关
            qrcodeShow: false
        }
    },
    async created () {
        try {
            await this.search()
        } catch (e) { throw e }
    },
    methods: {
        async search () {
            try {
                this.form.current = 1
                await this.getList()
            } catch (e) { throw e }
        },
        async getList () {
            try {
                const { result } = await getPublicBenefitList(this.form)
                this.list = result.records
                this.total = result.total
            } catch (e) { throw e }
        },
        async dateChange ({ start, end }) {
            try {
                this.form.startTime = start ? moment(start).format('YYYY-MM-DD') : ''
                this.form.endTime = end ? moment(end).format('YYYY-MM-DD') : ''
                await this.search()
            } catch (e) { throw e }
        },
        async sizeChange (val) {
            try {
                this.form.size = val
                await this.search()
            } catch (e) { throw e }
        },
        async overActivity (activityId) {
            try {
                await this.$confirm({
                    title: '确认要结束活动吗？',
                    message: '活动结束后，用户将不可参与该活动，停止后将不影响已领取活动奖励的用户。'
                })
                await updatePublicBenefitStatus({ activityId, status: 2 })
                this.$success('结束成功')
                await this.getList()
            } catch (e) { throw e }
        },
        async deleteActivity ({ definiteStatus, id: activityId }) {
            try {
                if (definiteStatus === 1) {
                    await this.$confirm({
                        title: '确认要删除此活动吗？'
                    })
                } else {
                    await this.$confirm({
                        title: '确认要删除此活动吗？',
                        message: '活动删除后，将不可查看活动期间的相关数据！请谨慎进行删除操作。'
                    })
                }
                await updatePublicBenefitStatus({ activityId, status: 0 })
                this.$success('删除成功')
                await this.getList()
            } catch (e) { throw e }
        },
        share (id) {
            this.qrcodeText = `${ this.$store.getters['user/mallUrl'] }/longmen-festival/action/${ id }?noCache=${ Date.now() }`
            this.qrcodeShow = true
        }
    }
}
</script>

<style lang="scss" scoped >

.newcomers-list {
    padding: 20px 0;
    .newcomers-list-content {
        background-color: white;
    }
}

</style>
