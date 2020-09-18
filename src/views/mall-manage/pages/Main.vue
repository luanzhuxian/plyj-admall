<template>
    <div class="mall-main">
        <section :class="$style.template">
            <div :class="$style.templateItem">
                <img :class="$style.templateIcon" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/home-blue.png" alt="店铺首页">
                <div :class="$style.templateInfo">
                    <div :class="$style.templateInfoTop">
                        <b :class="$style.templateName">教育机构风格</b>
                        <span :class="[$style.templateLabel, $style.blue]">店铺首页</span>
                    </div>
                    <div :class="$style.templateDate">
                        创建时间 2019.5.21 19:00:23
                    </div>
                </div>
                <div :class="$style.templateButtons">
                    <el-button type="text">
                        编辑
                    </el-button>
                    <el-button type="text">
                        换肤
                    </el-button>
                </div>
            </div>
            <div :class="$style.templateItem">
                <img :class="$style.templateIcon" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/main-red.png" alt="主会场">
                <div :class="$style.templateInfo">
                    <div :class="$style.templateInfoTop">
                        <b :class="$style.templateName">新春主会场</b>
                        <span :class="[$style.templateLabel, $style.red]">主会场</span>
                    </div>
                    <div :class="$style.templateDate">
                        创建时间 2019.5.21 19:00:23
                    </div>
                </div>
                <div :class="$style.templateButtons">
                    <el-button type="text">
                        编辑
                    </el-button>
                    <el-button type="text">
                        下架
                    </el-button>
                </div>
            </div>
        </section>
        <section class="draft-table">
            <div :class="$style.batchText" v-if="multipleSelection.length">
                <div :class="$style.batchNum">
                    已选择{{ multipleSelection.length }}条
                </div>
                <el-button size="mini" @click="batchDelete()">
                    批量删除
                </el-button>
            </div>
            <el-table
                ref="table"
                class="batch"
                :data="table"
                @selection-change="setSelectionChange"
            >
                <span slot="empty" class="empty">
                    <pl-svg name="icon-empty" width="16" style="margin-right: 4px;" />
                    {{ emptyText }}
                </span>
                <el-table-column
                    type="selection"
                    width="60"
                />
                <el-table-column
                    label="标题"
                    width="300"
                >
                    <template slot-scope="{ row }">
                        <template v-if="!row.isEdit">
                            <span v-text="row.templateName" />
                            <pl-svg name="icon-bianji1" width="18" height="16" fill="#598bf8" @click="row.isEdit = true" />
                        </template>
                        <template v-if="row.isEdit">
                            <el-input v-model="row.editName" />
                            <el-button type="text" size="mini" @click="saveTemplateName(row)">保存</el-button>
                            <el-button type="text" size="mini" @click="cancelTemplateName(row)">取消</el-button>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                    label="页面类型"
                    align="center"
                >
                    <template slot-scope="{ row }">
                        {{ ~[-1, 3, 4, 9].indexOf(row.type) ? '首页' : ~[5, 6, 7, 8, 10].indexOf(row.type) ? '主会场' : '' }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="upShelf"
                    label="定时上架时间"
                />
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                />
                <el-table-column
                    prop="statusName"
                    label="状态"
                />
                <el-table-column label="操作" align="center">
                    <template slot-scope="{ row }">
                        <el-button
                            v-if="row.status !== 1"
                            type="text"
                            size="mini"
                            @click="$router.push({
                                name: 'Decoration',
                                query: { from: 'draft', id: row.id }
                            })"
                        >
                            编辑
                        </el-button>
                        <el-button
                            type="text"
                            size="mini"
                            @click="previewTemplate(row.id)"
                        >
                            预览
                        </el-button>
                        <el-button
                            v-if="row.status === 0 || row.status === 2"
                            type="text"
                            size="mini"
                            @click="putOn(row)"
                        >
                            上架
                        </el-button>
                        <el-button
                            v-if="row.status !== 1"
                            type="text"
                            size="mini"
                            @click="setTime(row)"
                        >
                            设置
                        </el-button>
                        <div v-show="false">
                            <el-button
                                v-if="row.status !== 1"
                                size="mini"
                                @click="copyTemplate(row.id)"
                            >
                                复制
                            </el-button>
                            <el-button
                                v-if="row.status !== 1"
                                class="ml-0"
                                type="primary"
                                plain
                                size="mini"
                                @click="delTemplate(row.id)"
                            >
                                删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </section>
        <pagination :total="total" :size="searchForm.size" v-model="searchForm.current" @change="getDraft" />
        <modal-time-setting ref="modal" />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import {
    getTemplateList,
    updateTemplateName,
    copyTemplateItem,
    previewTemplateItem,
    delTemplateItem,
    delTemplateBatch,
    checkIsFull,
    updateTemplateStatus
} from '../../../apis/mall-manage'
import ModalTimeSetting from '../components/Modal-Time-Setting.vue'
import { rebuild } from '../utils/service'
import { validatorProducer } from '../utils/validate'
import { tagMap } from '../utils/map'
import { DraftTableRow } from '../utils/types'

@Component({
    components: {
        ModalTimeSetting
    }
})
export default class MallMain extends Vue {
    /* data */
    emptyText = '暂无模板'
    searchForm = {
        keyword: '',
        status: '',
        type: '',
        current: 1,
        size: 4
    }

    table = []
    total = 0
    multipleSelection: string[] = []
    templatePreviewShow = false
    tmplId = 0
    skinId = 0
    templateModels: DynamicObject = {}

    /* computed */
    get tag (): string {
        return tagMap.findTemplateTagById(this.tmplId)
    }

    created () {
        this.getDraft()
    }

    /* methods */

    // 获取模板列表
    async getDraft () {
        try {
            const { result = {} } = await getTemplateList(this.searchForm)
            if (result && result.records && result.records.length) {
                for (const item of result.records) {
                    item.isEdit = false
                    item.editName = item.templateName
                }
                this.table = result.records
                this.total = result.total
            } else {
                this.table = []
                this.total = 0
            }
        } catch (e) {
            throw e
        }
    }

    // 多选过滤出id来批量操作
    setSelectionChange (val: DraftTableRow[]) {
        const array = []
        if (val && val.length) {
            for (const item of val) {
                array.push(item.id)
            }
        }
        this.multipleSelection = array
    }

    // 批量删除
    async batchDelete () {
        await this.$confirm('确定批量删除模板？')
        try {
            await delTemplateBatch(this.multipleSelection)
            this.$success('批量删除成功')
            this.getDraft()
        } catch (e) {
            this.$error('批量删除失败')
        }
    }

    // 模板改名
    async saveTemplateName (row: DraftTableRow) {
        if (!row.editName.trim()) {
            this.$error('名称不能为空')
            return false
        }
        if (row.editName.length > 20) {
            this.$error('名称不能大于20个字符')
            return false
        }
        await updateTemplateName({
            id: row.id,
            name: row.editName
        })
        this.$success('修改成功')
        await this.getDraft()
        row.isEdit = false
    }

    // 取消模板改名
    cancelTemplateName (row: DraftTableRow) {
        row.editName = row.templateName
        row.isEdit = false
    }

    // 复制模板
    async copyTemplate (id: string) {
        const { result = {} } = await checkIsFull()
        if (!result) {
            await this.$confirm('草稿箱已满50条，保存该草稿将会刪除草稿箱保存时间最早的一条草稿，是否进行该操作？')
        }
        await this.$confirm('确定复制该页面及上传内容？')
        await copyTemplateItem(id)
        this.$success('复制成功')
        this.getDraft()
    }

    // 预览模板
    async previewTemplate (id: string) {
        const { result = {} } = await previewTemplateItem(id)
        if (result && Object.keys(result).length) {
            this.tmplId = result.type
            this.skinId = result.skinStatus || 0
            this.templateModels = rebuild(this.tmplId, result.moduleModels)
            this.templatePreviewShow = true
        }
    }

    // 上架模板
    async putOn ({ id, type }: {id: string; type: number}) {
        try {
            const { result = {} } = await previewTemplateItem(id)
            const moduleModels = rebuild(result.type, result.moduleModels)
            const { pass, errMsg } = await validatorProducer(result.type, moduleModels).validate()

            if (pass === true) {
                await updateTemplateStatus({ id, type, status: 1 })
                this.$success('上架成功')
                this.getDraft()
            } else {
                this.$warning(errMsg)
            }
        } catch (e) {
            throw e
        }
    }

    // 删除模板
    async delTemplate (id: string) {
        try {
            await this.$confirm({
                title: '确定要删除页面？',
                message: '删除后不可恢复'
            })
            await delTemplateItem(id)
            this.$success('删除成功')
            this.getDraft()
        } catch (error) {
            throw error
        }
    }

    // 设置上架时间
    async setTime ({ id, type }: {id: string; type: number}) {
        try {
            const { result = {} } = await previewTemplateItem(id)
            const moduleModels = rebuild(result.type, result.moduleModels)
            const { pass, errMsg } = await validatorProducer(result.type, moduleModels).validate()

            if (pass === true) {
                const result = await this.$refs.modal.onShow()
                if (result) {
                    await updateTemplateStatus({ id, type, status: 1, upShelf: result })
                    this.$success('设置成功')
                    this.getDraft()
                }
            } else {
                this.$warning(errMsg)
            }
        } catch (error) {
            throw error
        }
    }
}
</script>

<style lang="scss">
.mall-main {
    .draft-table {
        position: relative;

        > .el-table > .el-table__header-wrapper > .el-table__header > thead {
            tr {
                th {
                    padding-top: 50px;
                    border-bottom: none;
                }

                // .el-table-column--selection {
                //     padding: 0;
                //     padding-bottom: 30px;
                // }
            }
        }
        .el-table__row {
            svg {
                display: none;
                margin-left: 10px;
                vertical-align: text-bottom;
                cursor: pointer;
            }
            &:hover {
                svg {
                    display: inline-block;
                }
            }
            .el-input {
                width: 180px;
                margin-right: 10px;
            }
            .el-button--text {
                padding: 0;
                min-width: auto;
                font-size: 14px;
            }
        }
    }
}

</style>

<style module lang="scss">
.template {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 80px;
    grid-gap: 20px;
    padding: 15px 6px 0;
    &-item {
        display: flex;
        box-sizing: border-box;
        padding: 12px 16px;
        background: #F5F6FA;
        border-radius: 10px;
    }
    &-icon {
        width: 55px;
        height: 55px;
        object-fit: cover;
    }
    &-info {
        margin-left: 10px;
        flex: 1;
        font-size: 12px;
        font-family: Microsoft YaHei UI;
        line-height: 16px;
        &-top {
            display: flex;
            align-items: center;
        }
    }
    &-name {
        font-size: 16px;
        line-height: 22px;
        color: #333333;
        letter-spacing: 1px;
        @include elps-wrap(1);
    }
    &-label {
        margin-left: 10px;
        width: 58px;
        height: 22px;
        line-height: 20px;
        text-align: center;
        border-radius: 2px;
        &.blue {
            border: 1px solid #4F63FF;
            color: #4F63FF;
        }
        &.red {
            border: 1px solid #FA6E68;
            color: #FA6E68;
        }
    }
    &-date {
        margin-top: 5px;
        @include elps-wrap(1);
    }
    &-buttons {
        align-self: flex-end;
        padding: 0 14px 8px;
        > button {
            padding: 0;
            min-width: auto;
        }
    }
}

.batch {
    &-text {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 11px;
        left: 79px;
        z-index: 11;
        font-size: 12px;
    }

    &-num {
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 17px;
        margin-right: 10px;
    }
}

</style>
