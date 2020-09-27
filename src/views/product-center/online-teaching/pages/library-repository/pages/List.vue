<template>
    <div :class="$style.lineTeachingVideoLibrary" class="pb-20 bg-white">
        <div :class="$style.content">
            <search-box>
                <el-form-item label="搜索内容：">
                    <el-input v-model="params.keyword" placeholder="请输入课程资源名称" />
                </el-form-item>
                <el-form-item label="标签：">
                    <el-select
                        clearable
                        v-model="params.tagName"
                        @change="search"
                    >
                        <el-option
                            v-for="(item,index) in tags"
                            :key="index"
                            :label="item.dictDataValue"
                            :value="item.dictDataValue"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="来源：">
                    <el-select
                        :clearable="true"
                        v-model="params.resouceSources"
                        @change="search"
                    >
                        <el-option
                            v-for="(item,index) in source"
                            :key="index"
                            :label="item.dictDataValue"
                            :value="item.dictDataValue"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="类型：">
                    <el-select
                        :clearable="true"
                        v-model="params.resouceType"
                        @change="search"
                    >
                        <el-option
                            v-for="(item,index) in resouceType"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                        round
                        type="primary"
                        @click="getList"
                    >
                        查询
                    </el-button>
                    <el-button round @click="$router.push({name: 'LineTeachingOrderOfRepository'})">
                        订单记录
                    </el-button>
                </el-form-item>
            </search-box>
            <el-table
                :data="tableData"
            >
                <el-table-column prop="name" label="图片" width="140">
                    <template #default="{row}">
                        <div style="position: relative">
                            <div
                                v-if="row.giveRecordId !== '0'"
                                style="position: absolute; left: 0; top: 0; padding: 0 4px; background-color: #efe0c3; color: red"
                            >
                                赠课
                            </div>
                            <img v-imgError style="width:90px;height:60px;" :src="row.courseImg || 'https://mallcdn.youpenglai.com/static/plmall/videoDefaul.jpg'" alt="">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="courseName" label="课程资源名称" width="240" />
                <el-table-column align="left" prop="createTime" label="标签">
                    <template #default="{ row }">
                        <div :class="$style.tag" v-for="(item,index) in row.tags" :key="index">
                            {{ item }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="videoCount" label="资源数量" width="120" />
                <el-table-column prop="resouceSources" label="类型" width="120">
                    <template #default="{ row }">
                        {{ row.courseType === 1 ? '单课程' : '系列课程' }}
                    </template>
                </el-table-column>
                <el-table-column prop="sellingPrice" label="价格" width="120">
                    <template #default="{ row }">
                        {{ (row.priceType === 0 || row.giveRecordId !== '0') ? '免费' : (row.sellingPrice || 0) }}
                    </template>
                </el-table-column>
                <el-table-column prop="validity" label="使用有效期（天）" width="120" />
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
                                    v-if="row.isAuthorize === 0 && row.giveRecordId !== '0'"
                                    @click="$router.push({ name: 'VideoRepositoryBuyNow', params: { id: row.id }, query: { isFirstBuy: 1, giveRecordId: row.giveRecordId } })"
                                >
                                    立即授权
                                </a>
                                <a
                                    v-else-if="!(!row.isFirstBuy && !row.priceType) && row.giveRecordId === '0'"
                                    @click="$router.push({ name: 'VideoRepositoryBuyNow', params: { id: row.id }, query: { isFirstBuy: Number(row.isFirstBuy) } })"
                                >
                                    {{ row.isFirstBuy ? '立即购买' : '&nbsp;&nbsp;&nbsp;&nbsp;续费&nbsp;&nbsp;&nbsp;&nbsp;' }}
                                </a>
                                <!-- <a @click="previewFile(row)">
                  预览
                </a> -->
                                <a @click="$router.push({ name:'VideoRepositoryDetail', params:{ id: row.id }, query: { giveRecordId: row.giveRecordId } })">
                                    查看详情
                                </a>
                            </template>
                        </Operating>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :total="total" v-model="params.current" @sizeChange="sizeChange" @change="getList" :sizes="true" />
        </div>
        <!--预览视频-->
        <VideoPreview :show.sync="videoShow" :src="videoSrc" />
    </div>
</template>

<script>
import { getDataDictionary } from './../../../../../../apis/common'
import { getRepositoryList } from './../../../../../../apis/product-center/line-teaching/repository'
import VideoPreview from './../../../../../../components/common/Preview-Video'

export default {
    name: 'VideoRepository',
    components: {
        VideoPreview
    },
    data () {
        return {
            tags: [], // 标签
            source: [], // 来源
            tableData: [],
            total: 0,
            videoShow: false,
            videoSrc: '',
            resouceType: [{ name: '单课', value: 1 }, { name: '系列课', value: 2 }],
            params: {
                resouceType: '',
                current: 1,
                size: 10,
                keyword: '',
                tagName: '',
                resouceSources: ''
            }
        }
    },
    async activated () {
        try {
            await this.getDataDictionary()
            await this.search()
        } catch (e) { throw e }
    },
    deactivated () {
        this.params = {
            resouceType: '',
            current: 1,
            size: 10,
            keyword: '',
            tagName: '',
            resouceSources: ''
        }
    },
    methods: {
        async search () {
            try {
                this.params.current = 1
                await this.getList()
            } catch (e) { throw e }
        },
        async getDataDictionary () {
            try {
                const [tags, source] = await Promise.all([getDataDictionary('RESOURCE_SOURCE_TAG'), getDataDictionary('RESOURCE_SOURCE')])
                this.tags = tags.result || []
                this.source = source.result || []
            } catch (e) { throw e }
        },
        async getList () {
            try {
                const { result } = await getRepositoryList(this.params)
                this.total = result.total || 0
                this.tableData = result.records || []
            } catch (e) { throw e }
        },
        async sizeChange (val) {
            try {
                this.params.current = 1
                this.params.size = val
                await this.getList()
            } catch (e) { throw e }
        },
        previewFile ({ resourceUrlPrefix, resourceUrlSuffix, supportWatchUrl, resourceType }) {
            this.videoSrc = resourceType === 1 ? (resourceUrlPrefix + resourceUrlSuffix) : supportWatchUrl
            this.videoShow = true
        }
    }
}
</script>

<style module lang='scss'>

.line-teaching-video-library {
    > .content {
        > .search {
            display: flex;
            justify-content: space-between;
            padding: 20px;
        }

        .tag {
            display: inline-block;
            min-width: 78px;
            margin: 0 4px 4px 0;
            padding: 0 4px;
            border: 1px solid #ec742e;
            line-height: 20px;
            font-size: 12px;
            white-space: nowrap;
            text-align: center;
            color: #ec742e;
        }
    }
}

</style>
