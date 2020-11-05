<template>
    <div :class="$style.downloadContainer" class="wrap">
        <div :class="$style.downloadCon">
            <div style="color:red" class="mb-10">
                *直播暂存视频文件只保留180天，视频直播结束后下载显示有一定的时间延迟，请耐心等待
            </div>
            <search-box>
                <el-form-item label="查询时间">
                    <date-range
                        clearable
                        @change="dateChange"
                    />
                </el-form-item>
                <el-form-item label="直播房间" prop="roomId">
                    <el-select @change="getTableList" v-model="form.roomId" placeholder="请选择房间">
                        <el-option
                            v-for="(item,index) in roomList"
                            :key="index"
                            :label="item.roomName"
                            :value="item.roomId"
                        />
                    </el-select>
                </el-form-item>
                <div />
                <el-form-item>
                    <el-button type="primary" round @click="getTableList">查询</el-button>
                    <el-button :loading="mergeLoading" @click="openMergeFile" type="primary" round>
                        合并
                    </el-button>
                </el-form-item>
            </search-box>

            <el-table
                :data="tableData"
                @selection-change="handleSelectionChange"
            >
                <el-table-column :selectable="selectable" type="selection" width="55" />
                <el-table-column prop="fileName" label="直播名称" />
                <el-table-column prop="fileName" label="类型">
                    <template #default="{row:{fileType}}">
                        {{ fileType === 'live' ? '直播视频' : '合并视频' }}
                    </template>
                </el-table-column>
                <el-table-column prop="liveStartTime" label="文件大小">
                    <template #default="{row:{fileSize}}">
                        {{ (Number(fileSize) / (1024 * 1024) ).toFixed(2) }} M
                    </template>
                </el-table-column>
                <el-table-column prop="startTimeFormat" label="直播开始时间" />
                <el-table-column prop="durationString" label="视频时长" />
                <el-table-column prop="liveStartTime" label="暂存剩余天数">
                    <template #default="{row:{remainDay}}">
                        {{ remainDay === -1 ? '失败' : remainDay }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    header-align="center"
                    width="100"
                >
                    <template slot-scope="{ row }">
                        <Operating>
                            <template slot="button-box">
                                <a
                                    @click="deleteFile(row.channelSessionId)"
                                >
                                    删除
                                </a>
                                <a
                                    @click="previewFile(row.url)"
                                >
                                    预览
                                </a>
                                <a
                                    @click="downloadFile(row.url)"
                                >
                                    下载
                                </a>
                            </template>
                        </Operating>
                    </template>
                </el-table-column>
            </el-table>

            <!--预览弹窗-->
            <el-dialog
                title="预览"
                :visible.sync="showVideo"
                width="640px"
                :before-close="previewClose"
            >
                <div>
                    <hr class="hr">
                    <div class="fz-12 gray-3" style="line-height: 24px; margin-top: 20px;">
                        <video autoplay ref="video" style="width:100%;height:320px" :src="videoSrc" controls="controls" />
                    </div>
                </div>
            </el-dialog>

            <!--合并弹窗-->
            <el-dialog
                title="视频合并"
                :visible.sync="showMerge"
                width="460px"
            >
                <div>
                    <hr class="hr">
                    <div class="fz-12 gray-3" style="line-height: 24px; margin-top: 20px;">
                        <el-form :model="mergeData" ref="mergeForm" label-width="100px">
                            <el-form-item
                                label="视频名称"
                                prop="fileName"
                                :rules="[
                                    { required: true, message: '文件名称不能为空'},
                                ]"
                            >
                                <el-input v-model="mergeData.fileName" />
                            </el-form-item>
                        </el-form>
                        <div style="text-align: center;">
                            <el-button @click="showMerge = false">
                                取 消
                            </el-button>
                            <el-button @click="mergeFile" type="primary">
                                确 定
                            </el-button>
                        </div>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { getDownloadList, mergeDownloadFile, deleteDownloadFile, getAllRooms } from './../../../../../../apis/product-center/online-teaching/live'
export default {
    name: 'VideoDownload',
    data () {
        return {
            mergeLoading: false,
            showMerge: false,
            showVideo: false,
            videoSrc: 'https://www.w3school.com.cn/i/movie.ogg',
            tableData: [],
            roomList: [], // 房间列表
            form: {
                roomId: 0,
                startDate: '',
                endDate: ''
            },
            mergeData: {
                fileName: '',
                fileIds: []
            }
        }
    },
    async created () {
        try {
            await this.getAllRooms()
            await this.getTableList()
        } catch (e) { throw e }
    },
    methods: {
    // 获取全部房间
        async getAllRooms () {
            try {
                const { result } = await getAllRooms()
                this.roomList = [...result.rooms]
                this.form.roomId = this.roomList[0] && this.roomList[0].roomId
            } catch (e) {
                throw e
            }
        },
        // 禁止选择已合并的视频
        selectable ({ fileType }) {
            return fileType === 'live'
        },
        async getTableList () {
            try {
                const { result } = await getDownloadList(this.form)
                this.tableData = result
            } catch (e) { throw e }
        },
        async dateChange ({ start, end }) {
            try {
                if (start && end) {
                    this.form.startDate = start.split(' ')[0]
                    this.form.endDate = end.split(' ')[0]
                } else {
                    this.form.startDate = ''
                    this.form.endDate = ''
                }
                await this.getTableList()
            } catch (e) { throw e }
        },
        async deleteFile (channelSessionId) {
            await this.$confirm({
                title: '删除',
                message: '确定删除该视频，删除后视频将不可恢复'
            })
            try {
                const mes = await deleteDownloadFile({ sessionId: channelSessionId, roomId: this.form.roomId })
                if (mes.data.result.code === 200) {
                    this.$success('删除成功')
                    await this.getTableList()
                } else {
                    this.$error('删除失败')
                }
                if (mes) {}
            } catch (e) { throw e }
        },
        previewFile (url) {
            this.videoSrc = url
            this.showVideo = true
        },
        previewClose () {
            this.$refs.video.pause()
            this.showVideo = false
        },
        downloadFile (url) {
            const a = document.createElement('a')
            a.href = url
            a.download = ''
            a.target = '_blank'
            a.click()
            a.remove()
        },
        openMergeFile () {
            if (this.mergeData.fileIds.length < 2) return this.$error('请至少选择两个文件')
            this.showMerge = true
        },
        async mergeFile () {
            await this.$refs.mergeForm.validate()
            this.mergeLoading = true
            this.showMerge = false
            try {
                const { result: { code, message } } = await mergeDownloadFile({
                    fileName: this.mergeData.fileName,
                    fileIds: this.mergeData.fileIds.join(','),
                    roomId: this.form.roomId
                })
                if (code === 200) {
                    this.$success('视频合并较慢，请耐心等待，请勿重复操作')
                    this.mergeData.fileName = ''
                    this.mergeData.fileIds = []
                } else {
                    this.$error(message)
                }
            } catch (e) {
                throw e
            } finally {
                this.mergeLoading = false
                await this.getTableList()
            }
        },
        handleSelectionChange (rows) {
            // 按照从新到晚排序
            rows.sort((pre, next) => Number(pre.startTime) - Number(next.startTime))
            this.mergeData.fileIds = rows.map(({ fileId }) => fileId)
        }
    }
}
</script>

<style lang="scss" module>
.download-con {
    > form {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}

</style>
