<template>
    <div class="watch-detail wrap">
        <div class="head">
            <search-box>
                <el-form-item label="搜索内容：">
                    <el-input v-model="form.searchContent" @change="search" clearable placeholder="用户名称/电话/来源" />
                </el-form-item>
                <el-form-item label="观看课程：">
                    <el-select v-model="form.isWatch" @change="search" clearable>
                        <el-option v-for="(item,index) in watchCourse" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="赠送课程：">
                    <el-select v-model="form.isGive" @change="search" clearable>
                        <el-option v-for="(item,index) in giveCourse" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="liveMode === '1' && liveInfo.isNeedSignUp" label="报名用户：">
                    <el-select v-model="form.isApply" @change="search" clearable>
                        <el-option v-for="(item,index) in signInCourse" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" round @click="search">
                        &nbsp;&nbsp;查 询&nbsp;&nbsp;
                    </el-button>
                    <el-button
                        class="button"
                        type="primary"
                        plain
                        round
                        v-if="liveMode === '2' && ( isliving || (!isliving && hasPlayback) ) "
                        @click="showSelectStudents = true"
                    >
                        添加学员
                    </el-button>

                    <el-button
                        class="button"
                        type="primary"
                        plain
                        round
                        v-if="liveInfo.isPay === 1 && ( isliving || (!isliving && hasPlayback) )"
                        @click="showSendLive = true"
                    >
                        送课
                    </el-button>

                    <el-button
                        v-if="table.length"
                        class="button"
                        type="primary"
                        plain
                        round
                        @click="changeExport"
                    >
                        导出数据
                    </el-button>
                </el-form-item>
            </search-box>
        </div>

        <!-- 公开课 -->
        <el-table :data="table" class="table">
            <el-table-column prop="nickName" label="用户昵称">
                <template #default="{row}">
                    {{ row.nickName }}
                    <span style="display: inline-block; padding: 0 5px; border: 1px solid #f60203; color: #f60203;" v-if="!row.watchTime">未观看</span>
                </template>
            </el-table-column>
            <el-table-column prop="userName" label="用户名称" />
            <el-table-column prop="userMobile" label="用户电话" />
            <el-table-column prop="userTags" label="用户分组">
                <template #default="{row}">
                    <template v-if="row.userTags && row.userTags.length">
                        <div class="tag">
                            <el-popover
                                placement="bottom-end"
                                trigger="hover"
                            >
                                <ul class="tag-user-list">
                                    <li v-for="(item, index) of row.userTags" :key="index" v-text="item" />
                                </ul>
                                <div slot="reference">
                                    <span v-for="(item, index) in row.userTags.slice(0, 3)" :key="index">{{ item }} </span>
                                </div>
                            </el-popover>
                        </div>
                    </template>
                    <div v-else>
                        无
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-if="liveInfo.isNeedSignUp" prop="mobile" label="报名">
                <template #default="{row}">
                    <span v-if="!row.isApply">无</span>
                    <el-popover
                        v-else
                        placement="top"
                        trigger="hover"
                        popper-class="sigin-in-info"
                    >
                        <ul class="detail">
                            <li v-if="row.userSignUp.signName">
                                <span>姓名：</span>
                                <span>{ { row.userSignUp.signName } }</span>
                            </li>
                            <li v-if="row.userSignUp.signTelphone">
                                <span>电话：</span>
                                <span>{{ row.userSignUp.signTelphone }}</span>
                            </li>
                            <li v-if="row.userSignUp.signGrade">
                                <span>年级：</span>
                                <span>{{ row.userSignUp.signGrade }}</span>
                            </li>
                            <li v-if="row.userSignUp.signRegion">
                                <span>所在区域：</span>
                                <span>{{ row.userSignUp.signRegion }}</span>
                            </li>
                            <li v-if="row.userSignUp.signTitle">
                                <span>{{ row.userSignUp.isHaveCustomer && row.userSignUp.isHaveCustomer + '：' }}</span>
                                <span>{{ row.userSignUp.signTitle }}</span>
                            </li>
                        </ul>
                        <span slot="reference" style="border-bottom: 1px solid #598BF8; color: #598BF8; cursor: pointer">查看</span>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="payAmount" label="实际支付金额(元)" />
            <el-table-column prop="payDiscounts" label="支付优惠" />
            <el-table-column prop="shareUserName" label="分享人" />
            <el-table-column v-if="liveInfo.isNeedSignUp" prop="applyTime" label="报名时间" />
            <el-table-column prop="watchTime" label="首次观看时间" />
            <el-table-column prop="mobile" width="250" label="操作" align="right" header-align="right">
                <template #default="{ row }">
                    <div class="operations">
                        <el-button v-if="row.isGive === 1 && row.isWatch === 0" @click="cancelGive(row)" type="text">
                            取消赠送
                        </el-button>
                        <template v-if="liveMode === '2'">
                            <!-- (不需要支付且未观看) 或者 （需要支付且未支付且未观看） -->
                            <template
                                v-if="(liveInfo.isPay === 0 && row.isWatch === 0) || (liveInfo.isPay === 1 && row.payAmount === 0 && row.isWatch === 0) "
                            >
                                <el-button @click="deleteStu(row)" type="text">
                                    删除学员
                                </el-button>
                            </template>
                        </template>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <Pagination
            :size="form.size"
            v-model="form.current"
            :total="total"
            @change="getList"
        />

        <!-- 导出 -->
        <ExportDialog :show.sync="showExport" title="导出数据" @confirm="exportDetail" @close="exportClose">
            <el-form ref="exportForm" :model="exportData" label-width="100px" label-position="left">
                <el-form-item label="搜索内容" prop="searchContent">
                    <el-input
                        v-model.trim="exportData.searchContent"
                        placeholder="用户名称/电话/来源"
                        style="width: 369px;"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="观看课程">
                    <el-select v-model="exportData.isWatch" clearable>
                        <el-option v-for="(item,index) in watchCourse" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="赠送课程">
                    <el-select v-model="exportData.isGive" clearable>
                        <el-option v-for="(item,index) in giveCourse" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="liveMode === '1' && liveInfo.isNeedSignUp" label="报名用户">
                    <el-select v-model="exportData.isApply" clearable>
                        <el-option v-for="(item,index) in signInCourse" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-form>
        </ExportDialog>

        <!-- 送课 -->
        <SendLive :live-id="id" :show.sync="showSendLive" @confirm="sendSuccess" />
        <!-- 选择学员 -->
        <SelectStudents :live-id="id" :show.sync="showSelectStudents" @confirm="selectSuccess" />
    </div>
</template>

<script>
import {
    getWatchDetailList,
    exportWatchDetail,
    getActiveCompleteInfo,
    cancelGive
} from '../../../../../../apis/product-center/online-teaching/live'
import { createObjectUrl } from '../../../../../../assets/ts/upload'
import SendLive from '../components/Send-Live.vue'
import SelectStudents from '../components/Select-Students.vue'
import ExportDialog from '../../../../../../components/common/Export-Dialog.vue'
export default {
    name: 'WatchDetail',
    components: {
        SendLive,
        SelectStudents,
        ExportDialog
    },
    props: {
        id: {
            type: String,
            default: ''
        },
        // 1公开课 2 私享课
        liveMode: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            showExport: false,
            exportData: {
                type: 1, // 1公开课 2 私享课
                isApply: '',
                isWatch: '',
                isGive: '',
                searchContent: ''
            },
            total: 0,
            table: [],
            liveInfo: {}, // 直播数据
            showSendLive: false, // 选择学员弹窗
            showSelectStudents: false, // 送客弹窗
            form: {
                type: 1, // 1公开课 2 私享课
                isApply: '',
                isWatch: '',
                isGive: '',
                searchContent: '',
                current: 1,
                size: 10
            },
            watchCourse: [{ label: '全部用户', value: '' }, { label: '观看内容用户', value: 1 }, { label: '未观看内容用户', value: 0 }],
            giveCourse: [{ label: '全部用户', value: '' }, { label: '已赠送用户', value: 1 }, { label: '未赠送用户', value: 0 }],
            signInCourse: [{ label: '全部用户', value: '' }, { label: '报名用户', value: 1 }, { label: '无需报名用户', value: 0 }]
        }
    },
    async created () {
        try {
            this.form.type = this.liveMode
            await this.getActiveCompleteInfo()
            await this.getList()
        } catch (e) { throw e }
    },
    methods: {
    // 取消送课
        async cancelGive ({ id, activityId }) {
            try {
                await this.$confirm('确定要取消赠送吗')
                await cancelGive({ id, activityId, type: 0 })
                await this.getList()
            } catch (e) { throw e }
        },
        // 删除学员
        async deleteStu ({ id, activityId }) {
            try {
                await this.$confirm('确定要删除学员吗')
                await cancelGive({ id, activityId, type: 1 })
                await this.getList()
            } catch (e) { throw e }
        },
        // 送课成功
        async sendSuccess () {
            try {
                this.$success('送课成功')
                await this.getList()
            } catch (e) { throw e }
        },
        // 选择学员成功
        async selectSuccess () {
            try {
                this.$success('添加学员成功')
                await this.getList()
            } catch (e) { throw e }
        },
        isShow (key, value) {
            return this.form[key] === value
        },
        async getActiveCompleteInfo () {
            try {
                const { result } = await getActiveCompleteInfo(this.id)
                this.liveInfo = result
            } catch (e) { throw e }
        },
        changeExport () {
            this.exportData = {
                ...this.form
            }
            this.showExport = true
        },
        exportClose () {
            this.exportData = {
                type: 1, // 1公开课 2 私享课
                isApply: '',
                isWatch: '',
                isGive: '',
                searchContent: ''
            }
            this.showExport = false
        },
        async exportDetail () {
            const { params: { id } } = this.$route
            const blob = await exportWatchDetail(id, this.exportData)
            const url = createObjectUrl(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = '观看详情.xls'
            a.click()
            a.remove()
            this.exportClose()
        },
        async getList () {
            try {
                const { result } = await getWatchDetailList(this.id, this.form)
                this.total = result.total
                this.table = result.records
            } catch (e) { throw e }
        },
        async search () {
            try {
                this.form.current = 1
                await this.getList()
            } catch (e) { throw e }
        }
    },
    computed: {
    // 正在直播
        isliving () {
            return this.liveInfo.statue !== 0
        },
        // 有回放
        hasPlayback () {
            return this.liveInfo.videoLibId && this.liveInfo.videoLibId !== '0'
        }
    }
}
</script>

<style scoped lang="scss">
.sigin-in-info {
    > .detail {
        box-sizing: border-box;
        width: 366px;
        padding: 18px;
        font-size: 12px;
        > li {
            padding: 14px 0;
            border-bottom: 1px solid #e7e7e7;
            &:nth-last-of-type(1) {
                border-bottom: 0;
            }
            > span:nth-of-type(1) {
                display: inline-block;
                width: 90px;
            }
        }
    }
}
.operations {
    color: #598bf8;
    > button {
        cursor: pointer;
        padding: 6px 0; /*视觉上，垂直方向的padding不起作用，但是可以增加点击区域*/
        &:first-child:before {
            padding: 0;
        }
        &:before {
            content: '';
            font-size: 0;
            padding: 10px 3px 1px;
            margin-left: 6px;
            border-left: 1px solid #598bf8;
        }
    }
}
.head {
    margin-bottom: 20px;
}
.table {
    background-color: #fff;
}

</style>
