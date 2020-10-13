<template>
    <div>
        <el-dialog
            :title="title"
            :visible="show"
            width="60%"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @open="getTableList"
            @close="close"
        >
            <div>
                <div v-if="isUpload" style="margin: 24px 0 10px 0">
                    <el-button @click="inputFileName">
                        上传视频
                    </el-button>
                </div>
                <div>
                    <el-table
                        row-key="id"
                        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                        @current-change="selectVideo"
                        highlight-current-row
                        :data="tableData"
                        class="video-table"
                        ref="table"
                    >
                        <el-table-column prop="name" label="视频名称" width="280px">
                            <template #default="{row}">
                                <template v-if="row.children && row.children.length">
                                    <span class="btn" @click.stop="expandRow(row)">
                                        <i :class="{ 'el-icon-plus': !row.expand, 'el-icon-minus': row.expand }" />
                                    </span>
                                </template>
                                <div :class="{ 'video-name': true, 'has-child': row.children && row.children.length, 'no-child': !(row.children && row.children.length)}">
                                    {{ row.name }}
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
                                    <!--解决旧数据视频时长为空的问题-->
                                    <span v-if="row.resourceTime < 60">
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
                        <el-table-column prop="liveStartTime" label="文件大小（MB）">
                            <template #default="{ row }">
                                <template v-if="!(row.children && row.children.length)">
                                    {{ (Number(row.fileSize) / (1024 * 1024) ).toFixed(2) }}
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column label="视频来源">
                            <template #default="{ row }">
                                <template v-if="!(row.children && row.children.length)">
                                    {{ row.resourceType === 1 ? '自行上传' : '资源库' }}
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column prop="liveStartTime" label="有效时间（天）" width="200px">
                            <template #default="{ row }">
                                <template v-if="!(row.children && row.children.length)">
                                    <span v-if="row.resourceType === 1">永久有效</span>
                                    <template v-else>
                                        <div>截止至 {{ row.validity }}</div>
                                        <div style="color:red">
                                            {{ row.timeDesc }}
                                        </div>
                                    </template>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <Pagination :total="total" v-model="params.current" @change="getTableList" />
            <div slot="footer">
                <el-button type="primary" @click="confirm" :disabled="!currentChecked.id">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <!-- 上传视频组件 -->
        <VideoManager
            ref="VideoManager"
            :show-list="false"
            :size="4096"
            :count="1"
            :show-selector="false"
            v-model="videos"
            @change="upload"
            :custom-props="customVideoProp"
        />
    </div>
</template>

<script>
import { getLibraryList } from '../../apis/product-center/online-teaching/live'
import { deleteImage } from '../../assets/ts/upload'
import { uploadLibraryFile } from '../../apis/product-center/online-teaching/library-video'
import VideoManager from '../common/file/Video-Manager'
export default {
    name: 'CheckLiveVideo',
    components: {
        VideoManager
    },
    props: {
        show: Boolean,
        title: {
            type: String,
            default: '添加回放'
        },
        liveMes: {
            type: Object,
            default () {
                return {}
            }
        },
        // 传入视频 id，高亮该行
        defaultVideo: {
            type: String,
            default: ''
        },
        // 是否显示上传视频
        isUpload: Boolean
    },
    data () {
        return {
            total: 0,
            params: {
                current: 1,
                size: 10
            },
            // 当前选中
            currentChecked: {},
            tableData: [],
            videos: [],
            // 默认展开行
            expandKeys: [],
            uploadMes: {
                name: '',
                fileSize: 0,
                resourceTime: '', // 视频时长
                urlPrefix: '', // 视频地址前缀
                urlSuffix: ''// 视频地址后缀
            },
            customVideoProp: [{
                fieldName: '资源名称',
                field: 'name',
                type: 'text',
                required: true,
                validate: val => {
                    if (val.length > 12) {
                        return '名称长度不能超过12个字符'
                    }
                    return ''
                }
            }]
        }
    },
    methods: {
        async getTableList () {
            try {
                const { result: { total, records } } = await getLibraryList(this.params)
                this.total = total
                this.tableData = records
                await this.$nextTick()
                this.highlightRow(records)
            } catch (e) { throw e }
        },
        expandRow (row) {
            this.$set(row, 'expand', !row.expand)
            this.$refs.table.toggleRowExpansion(row, row.expand)
        },
        selectVideo (row) {
            if (!row) return
            if (!this.tableData.includes(row)) {
                const parent = this.tableData.find(item => item.id === row.resourceId)
                row = parent && parent.children && parent.children.find(item => item.id === row.id)
                if (!row) return
            }
            // 点击的是视频的时候，才选中，只要有 resourceTime，肯定时视频
            if (row.resourceTime) {
                this.$refs.table.setCurrentRow(row)
            }
            this.currentChecked = row
        },
        async confirm () {
            try {
                // 选中的视频信息
                this.$emit('confirm', this.currentChecked)
                this.close()
            } catch (e) { throw e }
        },
        close () {
            this.$emit('update:show', false)
            this.params.current = 1
            this.currentChecked = {}
            // 情况已选择项
            this.$refs.table.setCurrentRow()
        },
        // 根据视频id高亮该行
        highlightRow (tableData) {
            for (const item of tableData) {
                item.expand = false
                if (item.id === this.defaultVideo) {
                    item.expand = true
                    this.$refs.table.setCurrentRow(item)
                }
                if (item.children && item.children.length) {
                    this.highlightRow(item.children)
                    item.expand = item.children.some(it => it.expand)
                }
                this.$refs.table.toggleRowExpansion(item, item.expand)
            }
        },
        async inputFileName () {
            // 调用上传文件弹窗
            this.$refs.VideoManager.showSelectBox()
        },
        // 确定上传
        async upload (urls, newList, fields) {
            if (urls.length === 0) return
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
                // await uploadLibraryFile(this.uploadMes)
                try {
                    const { result } = await uploadLibraryFile(data)
                    this.params.current = 1
                    await this.getTableList()
                    await this.$nextTick()
                    this.$success('上传成功')
                    this.selectVideo(result)
                } catch (e) {
                    // 保存失败，从阿里云删除视频
                    deleteImage([url], 'video')
                    throw e
                }
            }
            // let mes
            // const url = urls.splice(-1)[0]
            // const index = url.lastIndexOf('.')
            // this.uploadMes.fileSize = blobs[0].size
            // this.uploadMes.urlPrefix = url.slice(0, index)
            // this.uploadMes.urlSuffix = url.slice(index)
            try {
                // this.uploadMes.resourceTime = await getVideoDuration(blobs[0])
                // mes = await uploadLibraryFile(this.uploadMes)
                // this.$success('上传成功')
            } catch (e) {
                // 保存失败，从阿里云删除视频
                // deleteImage([url], 'video')
                throw e
            }
            try {
                this.params.current = 1
                // this.selectVideo(mes.data.result)
                // await this.getTableList()
            } catch (e) { throw e }
        }
    }
}
</script>

<style lang='scss' scoped>

.video-table {
    ::v-deep .el-table__row {
        &.current-row {
            > td:nth-of-type(1) > div > .video-name {
                &:before {
                    border: none;
                    background-color: #598bf8;
                    content: '✔';
                }
                &.has-child:before {
                    content: '';
                }
            }
        }
        > td:nth-of-type(1) > div {
            > .el-table__expand-icon,
            > .el-table__indent {
                display: none;
            }
            > .btn {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                width: 16px;
                height: 16px;
                margin-right: 16px;
                border-radius: 50%;
                background-color: #598bf8;
                cursor: pointer;
                > i {
                    color: #fff;
                }
            }
            > .video-name {
                display: inline-block;
            }
            > .no-child {
                display: inline-flex;
                align-items: center;
                &:before {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    margin-right: 16px;
                    border: 1px solid #e7e7e7;
                    border-radius: 2px;
                    font-size: 14px;
                    line-height: 20px;
                    text-align: center;
                    color: #fff;
                    content: '';
                    cursor: pointer;
                }
            }
        }
    }
}

</style>
