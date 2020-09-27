<template>
    <div class="recycle">
        <div class="title-head">
            回收站 <span class="tips">约占用{{ (useRemainderStorageSize / 1024 / 1024).toFixed(2) }}G视频库空间</span>
        </div>
        <el-table :data="tableData">
            <span slot="empty" class="empty">
                <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                暂无回收数据！
            </span>
            <el-table-column label="视频名称" prop="name" />
            <el-table-column label="上传时间" prop="createTime" />
            <el-table-column label="视频时长">
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
            <el-table-column label="文件大小">
                <template #default="{ row }">
                    <template v-if="!(row.children && row.children.length)">
                        {{ (Number(row.fileSize) / (1024 * 1024) ).toFixed(2) }} M
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
            <el-table-column label="有效时间">
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
            <el-table-column label="操作" width="200" header-align="right" align="right">
                <template #default="{row}">
                    <el-button type="text" @click="recoveryFile(row)">
                        恢复到视频库
                    </el-button>
                    <el-button type="text" @click="deleteFile(row)">
                        彻底删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination
            @change="query"
            @sizeChange="sizeChange"
            v-model="pagination.current"
            :total="total"
            :sizes="true"
        />
    </div>
</template>

<script>
import { deleteImage } from '../../../../../../assets/ts/upload'
import { getDeleteInfo, getRecycleBinData, deleteRecycleBin, deleteLibraryFile, getVideoLibInfo } from './../../../../../../apis/product-center/online-teaching/library-video'
export default {
    name: 'RecycleBin',
    data () {
        return {
            tableData: [],
            pagination: {
                current: 1,
                size: 10
            },
            total: 0,
            useRemainderStorageSize: 0
        }
    },
    async activated () {
        try {
            await this.query()
            await this.getVideoLibInfo()
        } catch (e) {
            throw e
        }
    },
    methods: {
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
        async sizeChange (val) {
            this.pagination.current = 1
            this.pagination.size = val
            try {
                await this.query()
            } catch (e) {
                throw e
            }
        },
        async query () {
            try {
                const { result } = await getRecycleBinData(this.pagination)
                this.tableData = result.records
                this.total = result.total
            } catch (e) {
                throw e
            }
        },
        async getVideoLibInfo () {
            try {
                const { result } = await getVideoLibInfo()
                this.useRemainderStorageSize = result
            } catch (e) {
                throw e
            }
        },
        async recoveryFile ({ id }) {
            try {
                await deleteLibraryFile(id, 1)
                this.$success('恢复成功')
                await this.query()
                await this.getVideoLibInfo()
            } catch (e) { throw e }
        },
        async deleteFile ({ id, urlPrefix, urlSuffix, resourceType, validity, isChildren }) {
            const { result } = await getDeleteInfo(id)
            // 有关联课程
            /* eslint-disable indent */
      if (result.length) {
        await this.$alert({
          title: '删除',
          message: `
          <p>确认要删除该视频？</p>
          <p>该视频关联了录播直播和知识课程，删除资源后，将会影响用户的正常使用；</p>
          <p>1.录播直播进行中的直播将自动关闭或删除，且之前使用该视频直播将不支持回放；</p>
          <p>2.相关联的知识课程会全部自动下架，正在学习中的视频将不支持观看；</p>
          <ul class='${ this.$style.relateCourse }'>
            ${ result.map(item => `<li>
                        <img src='${ item.imageUrl }'>
                        <div>
                            <div class='${ this.$style.name }'>${ item.name }</div>
                            <div class='${ this.$style.type }'>${ item.type }</div>
                            <div class='${ this.$style.price }'>${ item.priceType === 0 ? '免费' : `￥${ item.sellingPrice }` }</div>
                        </div>
                    </li>`).join('') }
          </ul>
          `,
          dangerouslyUseHTMLString: true,
          showCancelButton: true
        })
      } else {
        // 无关联
        if (resourceType === 1) {
          // 自行上传
          await this.$confirm({
            title: '删除',
            message: '确定删除该视频，删除后视频将不可恢复'
          })
        } else {
          const message = (resourceType === 3 && !isChildren)
            ? `<p>确认要删除该资源包下所有视频${ validity ? `，视频资源的使用时间截止至 ${ validity } 到期；` : '；' }</p><p>删除后，所有视频将不可恢复，如需使用，需重新进行资源订购；</p>`
            : `<p>确认要删除该视频，视频资源的使用时间截止至 ${ validity } 到期；</p><p>删除后，视频将不可恢复，如需使用，需重新进行资源订购；</p>`
          await this.$alert({
            title: '删除',
            message,
            dangerouslyUseHTMLString: true,
            showCancelButton: true
          })
        }
      }

      // 删除视频
      if (resourceType === 1) {
        const url = urlPrefix + urlSuffix
        deleteImage([url], 'video')
      }
      try {
        await deleteRecycleBin(id)
        await this.$success('删除成功')
        if (this.tableData.length === 1 && this.pagination.current !== 1) this.pagination.current--
        await this.query()
        await this.getVideoLibInfo()
      } catch (e) { throw e }
    }
  }
}
</script>
<style lang="scss" module>
.relateCourse {
    box-sizing: border-box;
    max-height: 320px;
    padding: 16px;
    overflow-y: auto;
    background-color: #f8f8f8;
    > li {
        display: flex;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #ddd;
        > img {
            width: 90px;
            height: 60px;
            margin-right: 12px;
        }
        > div {
            display: flex;
            flex-wrap: wrap;
            align-content: space-between;
            height: 60px;
            font-size: 12px;
            > div {
                width: 100%;
                line-height: 16px;
            }
            > .name {
                font-size: 14px;
                color: #333;
            }
            > .type {
                color: #999;
            }
            > .price {
                color: #ec742e;
            }
        }
    }
    > li:nth-last-of-type(1) {
        margin-bottom: 0;
        padding-bottom: 0;
        border: 0;
    }
}

</style>

<style lang="scss" scoped>
.recycle {
    .title-head {
        padding: 0 0 20px 0;
        border-bottom: 1px solid #ddd;
        font-size: 24px;
        font-weight: bold;
        .tips {
            margin-left: 10px;
            color: #ff4d51;
            font-size: 14px;
            font-weight: normal;
        }
    }
}

</style>
