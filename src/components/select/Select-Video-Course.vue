<template>
    <el-dialog
        class="select-video"
        :visible="show"
        title="选择视频"
        width="65%"
        @close="closeHandler"
        :close-on-click-modal="false"
    >
        <el-table
            class="content-table"
            :data="table"
            ref="table"
            @select="handleSelect"
            @select-all="handleSelectAll"
            :row-key="setRowKey"
        >
            <span
                slot="empty"
                class="empty"
            >
                <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" /> 暂无视频，快去添加吧！
            </span>
            <el-table-column
                type="selection"
                width="55"
            />

            <el-table-column
                prop="name"
                label="视频名称 "
                width="250px"
            >
                <template #default="{ row }">
                    <span :class="{'ml-20': row.isChildren }" v-text="row.name" />
                </template>
            </el-table-column>
            <el-table-column
                label="上传时间 "
            >
                <template #default="{ row }">
                    <template v-if="!(row.children && row.children.length)">
                        {{ row.createTime }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column
                prop="resourceTime"
                label="视频时长"
            >
                <template #default="{ row }">
                    <template v-if="!(row.children && row.children.length)">
                        <!--解决旧数据视频时长为空的问题-->
                        <span v-if="row.resourceTime === ''" />
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
            <el-table-column label="文件大小（MB）">
                <template #default="{ row }">
                    <template v-if="!(row.children && row.children.length)">
                        {{ (Number(row.fileSize) / 1024 /1024).toFixed(2) }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="视频来源 ">
                <template #default="{ row }">
                    <template v-if="!(row.children && row.children.length)">
                        {{ row.resourceType === 1 ? '自行上传' : '资源库' }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column
                prop="validityNumber"
                label="有效时间（天）"
                width="200px"
            >
                <template #default="{row}">
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
        <Pagination
            @change="getList"
            v-model="form.current"
            :total="total"
            :size="form.size"
        />

        <div class="mt-20" style="text-align: center;">
            <el-button @click="closeHandler" round>
                取 消
            </el-button>
            <el-button type="primary" @click="confirm" round>
                确 定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getVideoLibraryList } from '../../apis/product-center/online-teaching/knowledge-course'
export default {
    name: 'SelectVideoCourse',
    props: {
        show: Boolean,
        // 默认选中的课程
        default: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        return {
            form: {
                current: 1,
                size: 10
            },
            table: [],
            // 选中的课程
            selected: new Map(),
            total: 0,
            setRowKey: row => row.id
        }
    },
    watch: {
        async show (val) {
            if (val) {
                await this.getList()
            } else {
                this.table = []
                this.selected = new Map()
                this.form = {
                    current: 1,
                    size: 10
                }
                this.$refs.table.clearSelection()
            }
        }
    },
    methods: {
        async getList () {
            try {
                const { result } = await getVideoLibraryList(this.form)
                this.table = this.addAttr(result.records)
                // 包括孩子在内的总数
                let totalItem = 0
                // 所有子视频的合集
                let allChild = []
                // 所有视频的合集
                let allVideo = []
                for (const item of this.table) {
                    totalItem++
                    totalItem += item.children.length
                    allChild = [...allChild, ...item.children]
                    if (item.fileSize) {
                        allVideo.push(item)
                    }
                }
                allVideo = [...allVideo, ...allChild]
                // 把所有的孩子单独保存一份
                // this.allChild = this.table.map(item => item.children || []).flat()
                // this.allVideo = [...this.table.filter(item => item.resourceTime), ...this.allChild]
                this.total = result.total
                this.allVideo = allVideo
                this.allChild = allChild
                this.totalItem = totalItem
                this.setSelection()
            } catch (e) {
                throw e
            }
        },
        setSelection () {
            const table = this.$refs.table
            // 存储选中的视频数据
            for (const id of this.default) {
                const select = this.allVideo.find(item => item.id === id)
                if (select) {
                    this.selected.set(id, select)
                }
            }
            // 设置选中效果
            this.$nextTick(() => {
                for (const id of this.selected.keys()) {
                    const select = this.table.find(item => item.id === id)
                    const childRow = this.allChild.find(item => item.id === id)
                    if (select) {
                        // 父级选中效果
                        table.toggleRowSelection(select, true)
                        continue
                    }
                    if (childRow) {
                        // 没父级，选中子级后，再选中父级
                        const PARENT = this.table.find(item => item.id === childRow.parentId)
                        table.toggleRowSelection(childRow, true)
                        table.toggleRowSelection(PARENT, true)
                        table.toggleRowExpansion(PARENT, true)
                    }
                }
            })
        },

        /**
     * 递归的处理数据
     * @param list {Array} 数据列表
     * @param parent {Object} 父级数据
     */
        addAttr (list, parent = {}) {
            const now = Date.now()
            for (const item of list) {
                item.parentId = parent.id || ''
                if (item.children && item.children.length) {
                    item.children = this.addAttr(item.children, item)
                }
                // 当前视频是否过期
                const time = new Date(item.validity).getTime()
                item.isTimeOut = time < now

                // 当前视频关于时间的描述
                item.timeDesc = ''
                if (time < now) { // 即将过期
                    item.timeDesc = '已过期'
                } else if (time - now <= (1000 * 60 * 60 * 24 * 30)) { // 30天内过期
                    let [remainDay, remainHours] = [(time - now) / (1000 * 60 * 60)]
                    remainHours = parseInt(remainDay % 24)
                    remainDay = parseInt(remainDay / 24)
                    item.timeDesc = remainDay === 0 ? '即将过期' : (remainHours === 0 ? `(剩余${ remainDay }天)` : `(剩余${ remainDay }天${ remainHours }小时)`)
                }
            }
            return list
        },
        confirm () {
            this.$emit('confirm', [...this.selected.values()])
            this.closeHandler()
        },
        closeHandler () {
            this.$emit('update:show', false)
        },

        /**
     * 监听选择事件
     * @param selection {Array} 已选中的
     * @param row {Object} 当前勾选的
     */
        async handleSelect (selection, row) {
            // 判断是否选中
            const isSelected = selection.includes(row)
            // 是视频还是父级容器
            const isVideo = Boolean(row.fileSize)
            const table = this.$refs.table
            // 点选的是视频
            if (isVideo) {
                // 选中
                if (isSelected) {
                    this.selected.set(row.id, row)
                    const PARENT = this.table.find(item => item.id === row.parentId)
                    if (PARENT) {
                        table.toggleRowSelection(PARENT, true)
                    }
                } else {
                    // 删除的时候需要注意，此时的row对象可能已经不是之前添加的row对象了，所以需要查找
                    this.selected.delete(row.id)
                    // 取消父级元素的选中状态
                    const PARENT = this.table.find(item => item.id === row.parentId)
                    if (PARENT) {
                        table.toggleRowSelection(PARENT, false)
                    }
                }
                return
            }
            // 点选的是视频容器
            if (isSelected) {
                table.toggleRowExpansion(row, true)
                await this.$nextTick()
                for (const ch of row.children) {
                    table.toggleRowSelection(ch, true)
                    this.selected.set(ch.id, ch)
                }
            } else {
                for (const ch of row.children) {
                    table.toggleRowSelection(ch, false)
                    this.selected.delete(ch.id)
                }
                await this.$nextTick()
                table.toggleRowExpansion(row, false)
            }
        },

        /**
     * 点击全选按钮时要么全部选中当前页，要么全部删除当前页
     * @param selection
     */
        async handleSelectAll (selection) {
            // 如果有系列课的情况，取消全选，selection里面也会有系列课子课节的信息，过滤掉即可
            selection = selection.filter(item => !item.isChildren)
            // 是否全选，对比的是非子节点的数据
            const isAll = selection.length === (this.totalItem - this.allChild.length)
            const table = this.$refs.table
            // 先清空，然后手动选中
            table.clearSelection()
            for (const row of this.allVideo) {
                const parent = this.table.find(item => item.id === row.parentId)
                if (isAll) {
                    this.selected.set(row.id, row)
                    table.toggleRowSelection(row, true)
                    if (parent) {
                        table.toggleRowSelection(parent, true)
                        table.toggleRowExpansion(parent, true)
                    }
                } else {
                    table.toggleRowSelection(row, false)
                    if (parent) {
                        table.toggleRowSelection(parent, false)
                        table.toggleRowExpansion(parent, false)
                    }
                    this.selected.delete(row.id)
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
.select-video {
    ::v-deep {
        .el-table__row--level-1 {
            .el-table__indent {
                padding-left: 4px !important;
            }
        }
        .el-table__expand-column {
            display: inline-flex;
            margin-left: -1px;
            opacity: 0;
            > .cell {
                width: 0 !important;
                font-size: 0 !important;
                padding: 0 !important;
                margin: 0 !important;
            }
        }
        .el-table__expanded-cell {
            margin-left: 0 !important;
        }
    }
}

</style>
