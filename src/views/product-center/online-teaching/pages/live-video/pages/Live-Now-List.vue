<template>
    <div :class="$style.workbench" class="wrap">
        <PlTabs
            :value="$route.name"
            :tabs="[
                {label: '直播工作台', name: 'LiveNowList'},
                { label: '往期直播', name: 'LivePreviousList'}
            ]"
            @tabClick="data => $router.push({ name: data.name })"
        />
        <search-box class="mt-24">
            <el-form-item label="搜索内容：">
                <el-input
                    v-model.trim="params.keyword"
                    placeholder="请输入直播名称"
                    clearable
                    @change="doQuery"
                />
            </el-form-item>
            <el-form-item label="类型：">
                <el-select v-model="params.liveType" @change="doQuery">
                    <el-option
                        v-for="item in liveTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="形式：">
                <el-select v-model="params.liveMode" @change="doQuery">
                    <el-option
                        v-for="item in liveModeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model="params.status" @change="doQuery">
                    <el-option
                        v-for="item in statusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="房间名称：">
                <el-select v-model="params.roomId" @change="doQuery">
                    <el-option
                        v-for="item in roomList"
                        :key="item.roomId"
                        :label="item.roomName"
                        :value="item.roomId"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="查询时间：">
                <date-range
                    @change="dateChange"
                    :init="params.timeRange"
                    clearable
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" round @click="doQuery">
                    查询
                </el-button>
            </el-form-item>
        </search-box>
        <el-table :data="data">
            <el-table-column width="140" prop="liveStartTime" label="直播时间" />
            <el-table-column label="状态">
                <template #default="{row:{statueText}}">
                    <span v-if="statueText === '直播中'" style="color: #EC742E;" v-text="statueText" />
                    <span v-else style="color: #999;" v-text="statueText" />
                </template>
            </el-table-column>
            <el-table-column prop="name" label="直播名称" />
            <el-table-column label="类型">
                <template #default="{row:{liveType}}">
                    {{ liveType === 'live' ? '实时直播' : '录制直播' }}
                </template>
            </el-table-column>
            <el-table-column label="形式">
                <template #default="{row:{liveMode}}">
                    <span v-if="liveMode === 'private'" :class="$style.privateLesson">
                        私享课
                    </span>
                    <span v-else :class="$style.publicLesson">
                        公开课
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="roomId" label="房间号" />
            <el-table-column prop="roomName" label="房间名称" />
            <el-table-column label="收费形式">
                <template #default="{row}">
                    <span v-if="row.isPay === 0">
                        {{ row.roomToken? '口令' : '免费' }}
                    </span>
                    <span v-else>{{ row.paidAmount }}元</span>
                </template>
            </el-table-column>
            <el-table-column prop="signUpCount" label="报名" />
            <el-table-column prop="viewObjectCount" label="添加人数" />
            <el-table-column prop="sendLiveCount" label="送课人数" />
            <el-table-column prop="visitTimes" label="观看人数" />
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
                                v-if="isDoing(row)" @click="goToLive(row)"
                            >
                                开始直播
                            </a>
                            <a
                                @click="$router.push({ name: 'LiveDetail', params: { id: row.id } })"
                            >
                                直播详情
                            </a>
                            <a
                                @click="$router.push({ name: 'WatchDetail', params: { id: row.id, liveMode: row.liveMode === 'public' ? '1' : '2' } })"
                            >
                                数据查看
                            </a>
                            <!--只有私享课可以添加学员-->
                            <a
                                v-if="row.liveMode === 'private'" @click="addStudent(row)"
                            >
                                添加学员
                            </a>
                            <!--收费的直播才可送课-->
                            <a
                                v-if="row.paidAmount" @click="sendLive(row)"
                            >
                                送课
                            </a>
                            <!--只要直播开始后就需要一直显示关闭直播-->
                            <a
                                v-if="isStart(row)" @click="closeLive(row)"
                            >
                                关闭直播
                            </a>
                            <!--只有 未开始 + 已点击关闭直播的 可删除直播-->
                            <a
                                v-if="!isStart(row)" @click="deleteLive(row)"
                            >
                                删除直播
                            </a>
                            <a
                                @click="share(row)"
                            >
                                分享
                            </a>
                        </template>
                    </Operating>
                    <!--在用户设置的直播时间内显示-->
                </template>
            </el-table-column>
        </el-table>
        <Pagination :total="total" v-model="params.current" @change="getList" />
        <!--开始直播-->
        <StartLive
            :show.sync="showStartLiveDialog"
            :live-id="selectedLiveInfo.id"
            :room-id="selectedLiveInfo.roomId"
            :is-live="selectedLiveInfo.liveType === 'live'"
        />
        <!--添加学员-->
        <SelectStudent
            ref="selectStudent"
            :show.sync="showSelectedStudentDialog"
            :live-id="selectedLiveInfo.id"
            @confirm="getList"
        />
        <!--送课-->
        <SendLive
            ref="sendLive"
            :show.sync="showSendLiveDialog"
            :live-id="selectedLiveInfo.id"
            @confirm="getList"
        />
        <!--分享-->
        <share :show.sync="qrcodeShow" @close="shareClose" qrcode-image-name="直播二维码：" :qrcode-text="qrcodeText">
            <template v-if="selectedLiveInfo.roomToken" #liveWord>
                <el-form-item :error="roomTokenError" label="直播间口令：">
                    <el-input style="width: 125px; margin-right: 50px" disabled :value="selectedLiveInfo.roomToken" />
                    <el-button type="primary" v-clipboard:copy="selectedLiveInfo.roomToken" v-clipboard:success="copyWord">
                        复制
                    </el-button>
                    <el-button class="ml-10" @click="updateRoomToken">
                        更换
                    </el-button>
                </el-form-item>
            </template>
        </share>
    </div>
</template>

<script>
import SelectStudent from './../components/Select-Students.vue'
import SendLive from './../components/Send-Live.vue'
import Share from './../../../../../../components/common/Share.vue'
import StartLive from './../components/Start-Live.vue'
import {
    getAllRooms,
    getLiveList,
    closeLive,
    deleteLive,
    updateRoomToken,
    getActiveCompleteInfo
} from './../../../../../../apis/product-center/online-teaching/live'
import { copyFields, resetForm } from './../../../../../../assets/ts/utils'
import moment from 'moment'
export default {
    name: 'LiveNow',
    components: {
        StartLive,
        SelectStudent,
        SendLive,
        Share
    },
    data () {
        return {
            selectedLiveInfo: {},
            showStartLiveDialog: false,
            showSelectedStudentDialog: false,
            showSendLiveDialog: false,
            qrcodeShow: false,
            qrcodeText: '',
            roomTokenError: '', // 直播口令错误信息
            data: [],
            total: 0,
            params: {
                keyword: '', // 直播名称
                liveMode: '', // 直播形式
                liveType: '', // 直播类型
                status: '', // 直播状态
                roomId: '',
                startTime: '',
                endTime: '',
                current: 1,
                size: 10,
                timeRange: []
            },
            liveModeList: [
                { label: '全部', value: '' },
                { label: '私享课', value: 'private' },
                { label: '公开课', value: 'public' }
            ],
            liveTypeList: [
                { label: '全部', value: '' },
                { label: '实时直播', value: 'live' },
                { label: '录制直播', value: 'video' }
            ],
            statusList: [
                { label: '全部', value: '' }, // ALL --- [START, READY, LIVING]
                { label: '未开始', value: 'START' },
                { label: '预告中', value: 'READY' },
                { label: '直播中', value: 'LIVING' }
            ],
            roomList: []
        }
    },
    async created () {
        try {
            this.clearFrom()
            await this.getAllRooms()
            await this.getList()
        } catch (e) {
            throw e
        }
    },
    methods: {
        clearFrom () {
            resetForm(this.params, {
                current: 1,
                size: 10,
                timeRange: []
            })
            this.params.roomId = ''
        },
        // 获取列表
        // 方法名称不要修改
        async getList () {
            try {
                const { result } = await getLiveList(this.setParams())
                this.data = result.records
                this.total = result.total
            } catch (e) {
                throw e
            }
        },
        setParams () {
            const params = {
                keyword: '', // 直播名称
                liveMode: '', // 直播形式
                liveType: '', // 直播类型
                status: '', // 直播状态
                roomId: '',
                startTime: '',
                endTime: '',
                current: 1,
                size: 10
            }
            copyFields(params, this.params)
            params.liveMode = params.liveMode ? params.liveMode : 'ALL'
            params.liveType = params.liveType ? params.liveType : 'ALL'
            params.roomId = params.roomId ? params.roomId : 'ALL'
            params.status = params.status ? params.status : 'ALL'
            return params
        },
        async getAllRooms () {
            try {
                const { result } = await getAllRooms()
                this.roomList = [{ roomName: '全部', roomId: '' }].concat([], ...result.rooms)
            } catch (e) {
                throw e
            }
        },
        dateChange ({ start, end }) {
            this.params.startTime = start ? start.split(' ')[0] : ''
            this.params.endTime = end ? end.split(' ')[0] : ''
            this.doQuery()
        },
        async doQuery () {
            this.params.current = 1
            try {
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        isDoing (row) {
            return moment(row.liveStartTime).isBefore(moment()) && moment(row.liveEndTime).isAfter(moment())
        },
        isStart (row) {
            return moment(row.liveStartTime).isBefore(moment())
        },
        goToLive (row) {
            this.selectedLiveInfo = row
            this.showStartLiveDialog = true
        },
        addStudent (row) {
            this.selectedLiveInfo = row
            this.showSelectedStudentDialog = true
        },
        async closeLive (row) {
            try {
                await this.$confirm({
                    title: '关闭直播',
                    message: '该直播正在进行中，是否确认关闭？关闭后新用户将无法观看该直播。'
                })
                await closeLive(row.id)
                await this.getList()
                // 让外部知道列表状态发送了变化
                this.$emit('childUpdate')
            } catch (e) {
                throw e
            }
        },
        async deleteLive (row) {
            try {
                const message = row.paidAmount ? '该直播为付费直播，删除后会给已购买用户造成损失，请谨慎操作！' : '直播还未开始，确定删除该直播吗？删除将不可恢复。'
                await this.$confirm({
                    title: '删除直播',
                    message
                })
                await deleteLive(row.id)
                await this.getList()
                this.$emit('childUpdate')
            } catch (e) {
                throw e
            }
        },
        async sendLive (row) {
            this.selectedLiveInfo = row
            this.showSendLiveDialog = true
        },
        async share (row) {
            this.selectedLiveInfo = row
            this.qrcodeText = `${ this.$store.getters['user/mallUrl'] }/lived/room/${ row.roomValue }`
            this.qrcodeShow = true
        },
        copyWord () { // 复制口令
            this.$success('复制成功')
        },
        // 生成随机直播口令
        getRandom (oldToken) {
            let num = Math.floor((Math.random() * (10000 - 1000)) + 1000)
            num = oldToken === num ? this.getRandom(oldToken) : num
            return num
        },
        // 更新直播口令
        async updateRoomToken () {
            const token = this.getRandom(this.selectedLiveInfo.roomToken)
            try {
                await updateRoomToken({
                    activityId: this.selectedLiveInfo.id,
                    roomToken: token
                })
                this.$success('直播间口令更换成功')
                const { data: { result: baseInfo } } = await getActiveCompleteInfo(this.selectedLiveInfo.id)
                this.selectedLiveInfo.roomToken = baseInfo.roomToken
            } catch (e) { throw e }
        },
        shareClose () {
            this.roomTokenError = ''
        }
    }
}
</script>

<style module lang="scss">

.workbench {
    margin-bottom: 30px;
    padding: 12px;
    background-color: #fff;
}
.private-lesson {
    padding: 0 6px;
    background-color: #e3ebff;
    border: 1px solid #ccc;
    border-radius: 3px;
    color: #7890c0;
}
.public-lesson {
    padding: 0 6px;
    background-color: #dbfbe6;
    border: 1px solid #ccc;
    border-radius: 3px;
    color: #17a254;
}

</style>
