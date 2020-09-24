<template>
    <div :class="$style.previous" class="wrap">
        <PlTabs
            :value="$route.name"
            :tabs="[
                {label: '近期直播', name: 'LiveNowList'},
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
            <el-form-item label="查询时间：">
                <date-range
                    @change="dateChange"
                    :init="params.timeRange"
                    clearable
                />
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
            <div />
            <el-form-item>
                <el-button type="primary" round @click="doQuery">
                    查询
                </el-button>
            </el-form-item>
        </search-box>
        <el-table :data="data">
            <el-table-column width="140" prop="liveStartTime" label="直播时间" />
            <el-table-column prop="name" label="直播名称" />
            <el-table-column prop="liveStartTime" label="类型">
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
            <el-table-column label="回放">
                <template #default="{row:{supportReview}}">
                    {{ supportReview === 1? '支持': '不支持' }}
                </template>
            </el-table-column>
            <el-table-column label="收费形式">
                <template #default="{row}">
                    <span v-if="row.isPay === 0">
                        {{ row.roomToken? '口令' : '免费' }}
                    </span>
                    <span v-else>{{ row.paidAmount }}元</span>
                </template>
            </el-table-column>
            <el-table-column prop="signUpCount" label="报名" />
            <el-table-column prop="isShow" label="商城显示" width="110">
                <template #default="{ row }">
                    <!-- 上架中 -->
                    <div
                        style="display: inline-flex; vertical-align: middle;"
                    >
                        <el-switch
                            @change="showLive(row)"
                            :value="row.isShow"
                            :active-value="1"
                            :inactive-value="0"
                        />
                        <span class="primary-color-blue ml-10" v-if="row.isShow">显示</span>
                        <span v-else class="gray-4 ml-10">隐藏</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="sendLiveCount" label="送课人数" />
            <!--TODO.visitUserCount实际统计到的是未观看+实际观看的总人数-->
            <el-table-column v-if="false" prop="visitUserCount" label="可观看人数" />
            <el-table-column prop="visitTimes" label="观看人数" />
            <!--TODO.后台统计不到-->
            <!--
        <el-table-column prop="visitTimes" label="消耗分钟数" />
        <el-table-column prop="visitTimes" label="消耗流量" />
      -->
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
                                @click="$router.push({ name: 'LiveDetail', params: { id: row.id } })"
                            >
                                直播详情
                            </a>
                            <a
                                @click="$router.push({ name: 'WatchDetail', params: { id: row.id, liveMode: row.liveMode === 'public' ? '1' : '2' } })"
                            >
                                数据查看
                            </a>
                            <a
                                v-if="row.videoLibId && row.videoLibId !== '0'" @click="cancelPlayBack(row.id)"
                            >
                                取消回放
                            </a>
                            <a
                                v-else @click="addPlayBack(row)"
                            >
                                添加回放
                            </a>
                            <!--有回放 且 只有私享课可以添加学员-->
                            <a
                                v-if="row.videoLibId && row.videoLibId !== '0' && row.liveMode === 'private'" @click="addStudent(row)"
                            >
                                添加学员
                            </a>
                            <!--有回放 且 收费的直播才可送课-->
                            <a
                                v-if="row.videoLibId && row.videoLibId !== '0' && row.paidAmount" @click="sendLive(row)"
                            >
                                送课
                            </a>
                            <a
                                v-if="row.liveType === 'live'" @click="$router.push({name:'VideoDownload'})"
                            >
                                下载视频
                            </a>
                            <!--<a @click="e => { row.liveType === 'live' ? $router.push({name:'VideoDownload'}) : $router.push({name:'VideoLibraryList'}) }">下载视频</a>-->
                            <!-- 已点击关闭直播的 可删除直播 -->
                            <a
                                @click="deleteLive(row)"
                            >
                                删除直播
                            </a>
                            <!--有回放的才可分享-->
                            <a
                                v-if="row.videoLibId && row.videoLibId !== '0'" @click="share(row)"
                            >
                                分享
                            </a>
                        </template>
                    </Operating>
                </template>
            </el-table-column>
        </el-table>
        <Pagination :total="total" v-model="params.current" @change="getList" />
        <!--添加回放-->
        <check-live-video
            @confirm="addLiveSucess"
            :live-mes="selectedLiveInfo"
            :show.sync="showVideoList"
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
import Share from './../../../../../../components/common/Share.vue'
import CheckLiveVideo from './../../../../../../components/select/Check-Live-Video.vue'
import SelectStudent from './../components/Select-Students.vue'
import SendLive from './../components/Send-Live.vue'
import {
    getLiveList,
    cancelPlayBack,
    deleteLive,
    getAllRooms,
    updateRoomToken,
    getActiveCompleteInfo,
    addPlayBack,
    showLive
} from './../../../../../../apis/product-center/line-teaching/live'
import { copyFields, resetForm } from './../../../../../../assets/ts/utils'
export default {
    name: 'LivePrevious',
    components: {
        Share,
        SelectStudent,
        SendLive,
        CheckLiveVideo
    },
    data () {
        return {
            selectedLiveInfo: {}, // 选中的直播信息
            showAddStudentDialog: false,
            showSelectedStudentDialog: false,
            showSendLiveDialog: false,
            showVideoList: false,
            qrcodeShow: false,
            qrcodeText: '',
            roomTokenError: '', // 直播口令错误信息
            data: [],
            total: 0,
            params: {
                keyword: '', // 直播名称
                liveMode: '', // 直播形式
                liveType: '', // 直播类型
                status: 'END', // 直播状态
                roomId: '', // 房间号
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
            roomList: []
        }
    },
    async activated () {
        try {
            this.clearFrom()
            await this.getAllRooms()
            await this.getList()
        } catch (e) {
            throw e
        }
    },
    methods: {
    // C 端显示隐藏
        async showLive ({ id, isShow }) {
            try {
                const show = isShow === 1
                if (show) {
                    await this.$confirm({
                        title: '确定要隐藏该商品在商城的显示吗？',
                        message: '隐藏后用户仅在商城不可见该商品，不影响商品已参加的活动，指定发送给用户时用户可见'
                    })
                }
                await showLive({ id, status: show ? 0 : 1 })
                this.$success(`${ show ? '隐藏' : '显示' }成功`)
                await this.getList()
            } catch (e) { throw e }
        },
        clearFrom () {
            resetForm(this.params, {
                status: 'END',
                timeRange: [],
                current: 1,
                size: 10
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
                status: 'END', // 直播状态
                roomId: '', // 房间号
                startTime: '',
                endTime: '',
                current: 1,
                size: 10
            }
            copyFields(params, this.params)
            params.liveMode = params.liveMode ? params.liveMode : 'ALL'
            params.liveType = params.liveType ? params.liveType : 'ALL'
            params.roomId = params.roomId ? params.roomId : 'ALL'
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
        // 取消回放
        async cancelPlayBack (id) {
            await this.$confirm({
                title: '取消回放',
                message: '确定取消该视频的回放吗？取消后所有用户均不可见该视频'
            })
            try {
                await cancelPlayBack(id)
                this.$success('取消成功')
                this.getList()
            } catch (e) { throw e }
        },
        // 添加回放
        async addPlayBack (row) {
            const live = row.liveType === 'live'
            await this.$confirm({
                title: `添加回放（${ live ? '直播' : '录播' }）`,
                message: `确定开放该${ live ? '直播' : '视频' }回放，添加后浏览或购买过的用户均可在我的视频库内反复查看`
            })
            this.selectedLiveInfo = row
            this.showVideoList = true
        },
        async addLiveSucess (video) {
            try {
                await addPlayBack({ id: this.selectedLiveInfo.id, videoId: video.id })
                this.$success('添加成功')
                this.showVideoList = false
                this.getList()
            } catch (e) {
                throw e
            }
        },
        addStudent (row) {
            this.selectedLiveInfo = row
            this.showSelectedStudentDialog = true
        },
        async sendLive (row) {
            this.selectedLiveInfo = row
            this.showSendLiveDialog = true
        },
        async deleteLive (row) {
            try {
                await this.$confirm({
                    title: '删除直播',
                    message: '直播已结束，是否删除该直播信息，删除后将清空该直播数据？',
                    showClose: false
                })
                await deleteLive(row.id)
                // 让外部知道列表状态发送了变化
                await this.getList()
                this.$emit('childUpdate')
            } catch (e) {
                throw e
            }
        },
        async share (row) {
            this.selectedLiveInfo = row
            this.qrcodeText = `${ this.$store.getters.mallUrl }/lived/play-back/${ row.videoLibId }/${ row.id }/0`
            this.qrcodeShow = true
        },
        copyWord () { // 复制口令
            this.$success('复制成功')
        },
        // 生成随机直播口令
        getRandom () {
            const num = Math.floor((Math.random() * (10000 - 1000)) + 1000)
            this.selectedLiveInfo.roomToken = this.selectedLiveInfo.roomToken === num ? this.getRandom() : num
            return this.selectedLiveInfo.roomToken
        },
        // 更新直播口令
        async updateRoomToken () {
            this.getRandom()
            try {
                await updateRoomToken({
                    activityId: this.selectedLiveInfo.id,
                    roomToken: this.selectedLiveInfo.roomToken
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
.previous {
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
