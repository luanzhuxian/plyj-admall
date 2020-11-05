<template>
    <div :class="$style.lineTeachingVideoLibrary">
        <div :class="$style.content">
            <div :class="$style.headTitle">
                <span :class="$style.title">视频库</span>
                <el-button type="text" @click="showImportant = true">
                    重要说明
                </el-button>
            </div>
            <div :class="$style.strategy" @click="strategy = true">
                <div :class="$style.strategyLeft">
                    <img src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/cloud_banner.png">
                    <div :class="$style.strategyText">省流量<span :class="$style.high">攻略</span></div>
                    <img src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/cloud_banner_view.png" :class="$style.viewImg">
                </div>
                <div><img src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/cloud_banner.png"></div>
            </div>
            <el-button round plain @click="inputFileName" type="primary">
                上传视频
            </el-button>
            <p class="fz-12 gray-3 mt-10">
                *仅支持mp4格式视频文件，请上传格式为MP4，分辨率在720p-1080p的视频到视频库
            </p>
            <div class="fz-16 font-weight-bold mt-30">视频库存储空间</div>
            <div class="mt-16 mb-16">
                <span class="fz-33 font-weight-bold">{{ teachingInfo.useRemainderStorageSize_G }}<span class="fz-18">G</span></span>
                <span class="fz-33 font-weight-bold"> / </span>
                <span class="fz-33 font-weight-bold">{{ teachingInfo.storageSize_G }}<span class="fz-18">G</span></span>
            </div>
            <div :class="$style.headBottom">
                <div :class="$style.capacity">
                    <div :class="$style.process">
                        <div :class="$style.high" style="width: 20%" />
                    </div>
                    <el-link type="primary" @click="$router.push({ name: 'PayAndOrder', params: { isRenew: '1', type: '2' } })">
                        去扩容
                    </el-link>
                    <i
                        v-if="teachingInfo.remainderStorageSize_G < 2"
                        class="ml-20"
                        style="font-size: 12px; color: #D0423C;"
                    >
                        (视频存储空间不足2G，您可进行视频库空间扩容)
                    </i>
                </div>
                <el-link type="primary" @click="$router.push({ name: 'RecycleBin'})">
                    回收站({{ teachingInfo.recyleCount }})
                </el-link>
            </div>
            <el-table
                class="video-table"
                ref="table"
                :data="tableData"
                row-key="id"
                :tree-props="{children: 'children'}"
            >
                <el-table-column prop="name" label="视频名称">
                    <template #default="{row}">
                        <div class="expand-button">
                            <span>{{ row.name }}</span>
                            <pl-svg v-if="row.children && row.children.length" @click="expandRow(row)" :class="{ 'icon': row.expand }" name="icon-sanjiao" width="9" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="上传时间">
                    <template #default="{ row }">
                        <template v-if="!(row.children && row.children.length)">
                            {{ row.createTime }}
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="resourceTime" label="视频时长">
                    <template #default="{ row }">
                        <template v-if="!(row.children && row.children.length)">
                            <span v-if="row.resourceTime === ''">/</span>
                            <span v-else-if="row.resourceTime < 60">
                                {{ row.resourceTime }} 秒
                            </span>
                            <span v-else-if="row.resourceTime % 60 === 0">
                                {{ row.resourceTime / 60 }} 分钟
                            </span>
                            <span v-else>
                                {{ parseInt(row.resourceTime / 60) }} 分钟 {{ row.resourceTime % 60 }} 秒
                            </span>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="fileSize" label="文件大小">
                    <template #default="{ row }">
                        <template v-if="!(row.children && row.children.length)">
                            {{ (Number(row.fileSize) / (1024 * 1024) ).toFixed(2) }} M
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="视频来源">
                    <template #default="{ row }">
                        <template v-if="!(row.children && row.children.length)">
                            {{ row.resourceType === 1 ? '自行上传' : '资源库' }}
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="有效时间">
                    <template #default="{ row }">
                        <template v-if="!(row.children && row.children.length)">
                            <span v-if="row.resourceType === 1">永久有效</span>
                            <template v-else>
                                <div>截止至 {{ row.validity }}</div>
                                <div style="color:red">
                                    {{ formatter(row) }}
                                </div>
                            </template>
                        </template>
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
                                <a v-if="row.resourceType === 1 || (row.resourceType === 2 && row.supportWatchUrl )" @click="previewFile(row)">
                                    预览
                                </a>
                                <a v-if="row.resourceType === 1" @click="downloadFile(row)">
                                    下载
                                </a>
                                <a @click="deleteFile(row)">
                                    删除
                                </a>
                                <template v-if="row.isGive !== 1">
                                    <a
                                        :disabled="row.resourceStatus !== '2' || !row.priceType"
                                        v-if="row.resourceType !== 1 && !row.isChildren"
                                        @click="renewals(row)"
                                    >
                                        续费
                                    </a>
                                </template>
                            </template>
                        </Operating>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :total="total" v-model="params.current" @sizeChange="sizeChange" @change="getList" :sizes="true" />
        </div>
        <VideoManager
            ref="VideoManager"
            :show-list="false"
            :count="50"
            :size="4096"
            :total-size="remainingSpaceSize"
            :show-selector="false"
            v-model="videos"
            @change="upload"
            multiple
            :custom-props="customVideoProp"
        />
        <!--预览视频-->
        <VideoPreview :show.sync="videoShow" :src="videoSrc" />
        <!-- 重要说明 -->
        <el-dialog
            :visible.sync="showImportant"
            :close-on-click-modal="false"
            width="769px"
        >
            <div slot="title">
                <pl-svg style="vertical-align: -8px;" class="mr-10" name="icon-jinggao" width="32" fill="#fd5a63" />
                <span class="fz-18 font-weight-bold">重要说明</span>
            </div>
            <div class="mb-20 gray-2">
                <p class="font-weight-bold">
                    视频格式：
                </p>
                <p class="fz-12">
                    视频库仅支持mp4格式视频文件上传；请上传格式为MP4的视频到视频库；
                </p>
            </div>
            <div class="mb-20 gray-2">
                <p class="font-weight-bold">
                    视频码率：
                </p>
                <p class="fz-12">
                    为保证用户上传视频播放的流畅度，建议用户视频的分辨率在720p至1080p之间，视频码率3000kbps以内； 如果视频的分辨率和视频码率过高，会极大影响到用户观看视频的流畅度，造成卡顿；
                </p>
            </div>
            <div class="mb-20 gray-2">
                <p class="font-weight-bold">
                    视频码率查看方式：
                </p>
                <p class="fz-12">
                    1、右击视频文件，属性-详细信息-查看码率，如下图：
                </p>
                <p class="mt-10 mb-10">
                    <img width="370" src="https://mallcdn.youpenglai.com/static/admall/2.5.0/A88E8BFD-9785-41f5-848B-4676EDE2FAD2.png" alt="">
                </p>
                <p class="fz-12">
                    2、如果码率过高，您可使用“格式工厂”工具（可自行进行网络下载该工具），进行视频的转码处理；
                </p>
                <p class="fz-12">
                    3、将转码成功后的视频文件在上传到视频库中使用。
                </p>
                <p style="text-align: center;" class="mt-30">
                    <el-button type="primary" size="middle" @click="showImportant = false">
                        我知道了
                    </el-button>
                </p>
            </div>
        </el-dialog>

        <el-dialog
            :visible.sync="strategy"
            :close-on-click-modal="false"
            width="769px"
        >
            <div slot="title">
                <pl-svg style="vertical-align: -8px;" class="mr-10" name="icon-jinggao" width="32" fill="#fd5a63" />
                <span class="fz-18 font-weight-bold">省流量攻略</span>
            </div>
            <div style="height: 70vh; overflow-y: auto; overflow-x: hidden;">
                <div>
                    <p class="red">
                        视频录制设备（手机或摄像机）录制的原始视频，往往体积较大，作为在线课程，将造成过多的流量消耗；
                    </p>
                    <p class="red">
                        因此，建议对原始视频先进行转码，然后再上传使用；
                    </p>
                    <p class="red">
                        转码后的视频有体积小，传输快，省流量等优点；
                        <el-link type="primary" @click="downloadTranscoder">
                            下载转码工具
                        </el-link>
                    </p>
                    <p class="font-weight-bold red mb-20">
                        转码方法如下（以windows操作系统安装为例）：
                    </p>
                </div>
                <div class="mb-20 gray-2">
                    <p class="font-weight-bold mb-10">
                        安装转码工具：
                    </p>
                    <p class="fz-12 mb-10">
                        <img src="https://mallcdn.youpenglai.com/static/admall/2.5.0/1583720734%281%29.png" alt="">
                    </p>
                    <p class="fz-12">
                        <img src="https://mallcdn.youpenglai.com/static/admall/2.5.0/1583720958%281%29.png" alt="">
                    </p>
                    <p class="fz-12">
                        <img src="https://mallcdn.youpenglai.com/static/admall/2.5.0/1583721073%281%29.png" alt="">
                    </p>
                    <p class="fz-12">
                        <img src="https://mallcdn.youpenglai.com/static/admall/2.5.0/1583721180%281%29.png" alt="">
                    </p>
                    <p class="fz-12">
                        <img src="https://mallcdn.youpenglai.com/static/admall/2.5.0/1583721254%281%29.png" alt="">
                    </p>
                </div>
                <div class="mb-20 gray-2">
                    <p class="font-weight-bold">
                        如何转码：
                    </p>
                    <div class="mb-20">
                        <p class="mb-10">
                            1. 启动软件后，首先会打开如下界面，请按照提示选择单个视频文件或包含视频的文件夹
                        </p>
                        <img width="600" src="https://mallcdn.youpenglai.com/static/admall/2.5.0/1583721682%281%29.png" alt="">
                    </div>
                    <div class="mb-20">
                        <p class="mb-10">
                            2. 视频选择完毕后，到达如下界面，请按照提示继续操作，转码的速度取决与当前电脑的配置
                        </p>
                        <img width="600" src="https://mallcdn.youpenglai.com/static/admall/2.5.0/1583722879.png" alt="">
                    </div>
                    <p class="mb-10">
                        3. 转码完成后，在上一步第4步中设置的路径中可以找到转码后的文件
                    </p>
                    <p class="mb-10">
                        4. 上传转码后的文件至视频库
                    </p>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import VideoPreview from './../../../../../../components/common/Preview-Video'
import VideoManager from './../../../../../../components/common/file/Video-Manager.vue'
import { deleteImage, downloadFile } from '../../../../../../assets/ts/upload'
import { getLibraryList, deleteLibraryFile, uploadLibraryFile, getRemainingSpaceSize } from './../../../../../../apis/product-center/online-teaching/library-video'
import { getVideoLibInfo } from './../../../../../../apis/product-center/online-teaching/knowledge-course'
export default {
    name: 'VideoLibraryList',
    components: {
        VideoPreview,
        VideoManager
    },
    data () {
        return {
            videos: [],
            tableData: [],
            teachingInfo: {},
            total: 0,
            videoShow: false,
            showImportant: false,
            strategy: false,
            videoSrc: '',
            params: {
                current: 1,
                size: 10
            },
            customVideoProp: [{
                fieldName: '视频名称',
                field: 'name',
                type: 'text',
                required: true,
                validate: val => {
                    if (val.length > 12) {
                        return '名称长度不能超过12个字符'
                    }
                    return ''
                }
            }],
            // 视频库剩余空间大小
            remainingSpaceSize: Infinity
        }
    },
    async created () {
        try {
            await this.getList()
            await this.getVideoLibInfo()
            await this.getRemainingSpaceSize()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async getRemainingSpaceSize () {
            try {
                const { result } = await getRemainingSpaceSize()
                this.remainingSpaceSize = Number(result) || 0
            } catch (e) {
                throw e
            }
        },
        // 格式化到期时间
        formatter ({ validity }) {
            try {
                const time = new Date(validity).getTime()
                const now = Date.now()
                // 已经过期
                if (time < now) {
                    return '已过期'
                } else if (time - now <= (1000 * 60 * 60 * 24 * 30)) {
                    // 30天内过期
                    let [remainDay, remainHours] = [(time - now) / (1000 * 60 * 60)]
                    remainHours = parseInt(remainDay % 24)
                    remainDay = parseInt(remainDay / 24)
                    return remainDay === 0 ? '即将过期' : (remainHours === 0 ? `(剩余${ remainDay }天)` : `(剩余${ remainDay }天${ remainHours }小时)`)
                }
                return ''
            } catch (e) { throw e }
        },
        async getList () {
            try {
                const { result } = await getLibraryList(this.params)
                this.total = result.total
                this.tableData = result.records || []
            } catch (e) { throw e }
        },
        async getVideoLibInfo () {
            try {
                const { result } = await getVideoLibInfo()
                this.teachingInfo = result
            } catch (e) {
                throw e
            }
        },
        sizeChange (val) {
            try {
                this.params.current = 1
                this.params.size = val
                this.getList()
            } catch (e) { throw e }
        },
        async deleteFile ({ id }) {
            await this.$alert({
                title: '删除',
                message: `<p>确定删除该视频？</p>
          <p>您可以到回收站彻底删除或者恢复视频</p>`,
                dangerouslyUseHTMLString: true,
                showCancelButton: true
            })
            try {
                await deleteLibraryFile(id, 2)
                await this.$success('删除成功')
                if (this.tableData.length === 1 && this.params.current !== 1) this.params.current--
                await this.getList()
                await this.getVideoLibInfo()
            } catch (e) { throw e }
        },

        /**
     * 确定上传
     * @param urls {Array} 所有视频的url
     * @param newList {Array} 当前上传的视频，包含元信息
     * @param fields {Array} 当前字段值
     * @return {Promise<void>}
     */
        async upload (urls, newList, fields) {
            const REQ = []
            for (const [i, { url, duration, size }] of newList.entries()) {
                const fieldsValue = {}
                for (const fieldItem of fields[i] || []) {
                    fieldsValue[fieldItem.field] = fieldItem.value
                }
                const data = {
                    ...fieldsValue,
                    fileSize: size,
                    resourceTime: duration, // 视频时长
                    urlPrefix: url.slice(0, url.lastIndexOf('.')), // 视频地址前缀
                    urlSuffix: url.slice(url.lastIndexOf('.')) // 视频地址后缀
                }
                REQ.push(uploadLibraryFile(data))
            }
            if (REQ.length) {
                try {
                    await Promise.all(REQ)
                    await this.getList()
                    await this.getVideoLibInfo()
                    await this.getRemainingSpaceSize()
                } catch (e) {
                    deleteImage(urls, 'video')
                    throw e
                }
            }
        },
        async inputFileName () {
            // 调用上传文件弹窗
            this.$refs.VideoManager.showSelectBox()
        },
        previewFile ({ urlPrefix, urlSuffix, resourceType, supportWatchUrl }) {
            this.videoSrc = resourceType === 1 ? (urlPrefix + urlSuffix) : supportWatchUrl
            this.videoShow = true
        },
        async downloadFile ({ urlPrefix, urlSuffix }) {
            try {
                await downloadFile(urlPrefix + urlSuffix)
            } catch (e) { throw e }
        },
        // 下载转码工具
        async downloadTranscoder () {
            const WINDOWS = 'https://mallcdn.youpenglai.com/static/download/HandBrake-1.3.3-x86_64-Win_GUI.exe'
            const MAC = 'https://mallcdn.youpenglai.com/static/download/HandBrake-1.3.3.dmg'
            const isMac = /macintosh|mac os x/i.test(navigator.userAgent)
            const isWindows = /windows|win32/i.test(navigator.userAgent)
            try {
                if (isMac) {
                    await downloadFile(MAC)
                }
                if (isWindows) {
                    await downloadFile(WINDOWS)
                }
            } catch (e) { throw e }
        },
        // 是否续费
        async renewals ({ resourceId: id }) {
            this.$router.push({ name: 'VideoRepositoryBuyNow', params: { id } })
        },
        // 打开折行
        expandRow (row) {
            this.$refs.table.toggleRowExpansion(row, row.expand = !row.expand)
        }
    }
}
</script>

<style module lang='scss'>

.head-title {
    display: flex;
    align-items: baseline;
    .title{
        font-size: 24px;
        font-weight: bold;
        margin-right: 10px;
    }
}
    .strategy{
        height: 88px;
        width: 100%;
        margin: 20px 0 40px;
        font-weight: bold;
        font-size: 24px;
        border-radius: 20px;
        background: #F5F6FA;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        .strategy-left{
            display: flex;
            flex-grow: 1;
            align-items: center;
            .strategy-text{
                padding: 0 28px 0 28px;
                color: #333;
                .high{
                    color: #2DCA72;
                }
            }
            .view-img{
                margin-top: 20px;
            }
        }
    }
    .headBottom{
        display: flex;
        justify-content: space-between;
        .capacity{
            display: flex;
            align-items: center;
            .process{
                margin-right: 16px;
                width: 100px;
                height: 4px;
                border-radius: 10px;
                background: #F5F6FA;
                .high{
                    height: 4px;
                    border-radius: 10px;
                    background: #2DCA72;
                }
            }
        }
    }

</style>

<style lang="scss" scoped>

.video-table {
    ::v-deep .el-table__row {
        .expand-button {
            display: inline-flex;
            align-items: center;
            > svg {
                margin-left: 10px;
                cursor: pointer;
                transition: transform .2s ease;
                &.icon {
                    transform: rotate(180deg);
                }
            }
        }
        .el-table__expand-column {
            > .cell {
                display: none;
            }
        }
    }
    ::v-deep tr {
        > .el-table__expanded-cell {
            padding: 0;
            border-bottom: none;
        }
        .el-table__expand-icon,
        .el-table__indent {
            display: none;
        }
    }
}

</style>
