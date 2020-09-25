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
                <el-button type="text" @click="deleteTemplates">
                    批量删除
                </el-button>
            </div>
            <el-table
                ref="table"
                class="batch"
                :data="table"
                @filter-change="onFilterChange"
                @selection-change="onSelectionChange"
            >
                <span slot="empty" class="empty">
                    <PlSvg name="icon-empty" width="16" style="margin-right: 4px;" />
                    {{ emptyText }}
                </span>
                <el-table-column
                    type="selection"
                    width="60"
                />
                <el-table-column
                    label="标题"
                    width="250"
                >
                    <template slot-scope="{ row }">
                        <template v-if="!row.isEdit">
                            <span v-text="row.templateName" />
                            <PlSvg name="icon-bianji1" width="18" height="16" fill="#598bf8" @click="row.isEdit = true" />
                        </template>
                        <template v-if="row.isEdit">
                            <el-input v-model="row.editName" />
                            <el-button type="text" size="mini" @click="rename(row)">保存</el-button>
                            <el-button type="text" size="mini" @click="cancelRename(row)">取消</el-button>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                    label="页面类型"
                    align="center"
                    column-key="type"
                    :filters="typeFilters"
                >
                    <template slot-scope="{ row }">
                        {{ getTemplateType(row.type) }}
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
                    column-key="status"
                    :filters="statusFilters"
                />
                <el-table-column
                    label="操作"
                    align="center"
                    width="300"
                >
                    <template slot-scope="{ row }">
                        <el-button
                            v-if="row.status !== 1"
                            type="text"
                            @click="$router.push({
                                name: 'Decoration',
                                query: { from: 'draft', id: row.id }
                            })"
                        >
                            编辑
                        </el-button>
                        <el-button
                            type="text"
                            @click="previewTemplate(row.id)"
                        >
                            预览
                        </el-button>
                        <el-button
                            v-if="row.status === 0 || row.status === 2"
                            type="text"
                            @click="putOnShelf(row)"
                        >
                            上架
                        </el-button>
                        <Operating v-if="row.status !== 1" :class="$style.more">
                            <template slot="button-box">
                                <button @click="setOnShelfTime(row)">
                                    设置
                                </button>
                                <button @click="copyTemplate(row.id)">
                                    复制
                                </button>
                                <button @click="deleteTemplate(row.id)">
                                    删除
                                </button>
                            </template>
                        </Operating>
                    </template>
                </el-table-column>
            </el-table>
        </section>
        <Pagination
            v-model="searchForm.current"
            :size="searchForm.size"
            :total="total"
            sizes
            @sizeChange="onSizeChange"
            @change="getDraft"
        />
        <TemplatePreview :show.sync="templatePreviewShow">
            <Render
                :tmpl-id="tmplId"
                :skin-id="skinId"
                :data="templateModels"
                is-preview
                :is-empty-show="false"
                :is-clickable="false"
                :render="(h, props) => h(tag, { props })"
            />
        </TemplatePreview>
        <ModalTimeSetting ref="modal" />
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
} from '../../../apis/mall'
import TemplateB from '../components/templates/Template-B.vue'
import TemplateC from '../components/templates/Template-C.vue'
import TemplateD from '../components/templates/Template-D.vue'
import TemplateFengqiang from '../components/templates/Template-Fengqiang.vue'
import TemplateBaofa from '../components/templates/Template-Baofa.vue'
import TemplateFanchang from '../components/templates/Template-Fanchang.vue'
import TemplateXinchun from '../components/templates/Template-Xinchun.vue'
import TemplateDragonGate from '../components/templates/Template-Dragon-Gate.vue'
import TemplatePreview from '../components/Template-Preview.vue'
import ModalTimeSetting from '../components/Modal-Time-Setting.vue'
import Render from '../components/Render'
import { rebuild } from '../utils/service'
import { validatorProducer } from '../utils/validate'
import { tagMap } from '../utils/map'
import { TemplateCrosses, DraftTableRow, TemplateStatus, TemplateIds } from '../utils/types'

@Component({
    components: {
        TemplateB,
        TemplateC,
        TemplateD,
        TemplateFengqiang,
        TemplateBaofa,
        TemplateFanchang,
        TemplateXinchun,
        TemplateDragonGate,
        TemplatePreview,
        ModalTimeSetting,
        Render
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
        size: 10
    }

    table = []
    total = 0
    multipleSelection: string[] = []
    templatePreviewShow = false
    tmplId = 0
    skinId = 0
    templateModels: TemplateCrosses | object = {}
    typeFilters = [{
        text: '首页',
        value: 1
    }, {
        text: '主会场',
        value: 2
    }]

    statusFilters = [{
        text: '已下架',
        value: 0
    }, {
        text: '草稿',
        value: 2
    }]

    /* computed */
    get tag (): string {
        return tagMap.findTemplateTagById(this.tmplId)
    }

    async created () {
        try {
            await this.getDraft()
        } catch (error) {
            throw error
        }
    }

    /* methods */

    // 获取模板列表
    async getDraft (params?: object) {
        try {
            if (params) {
                this.searchForm = Object.assign({}, this.searchForm, params)
            }
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

    getTemplateType (id: number) {
        if ([
            TemplateIds.TemplateC,
            TemplateIds.TemplateB,
            TemplateIds.TemplateB2,
            TemplateIds.TemplateD
        ].includes(id)) {
            return '首页'
        }
        if ([
            TemplateIds.TemplateFengQiang,
            TemplateIds.TemplateBaoFa,
            TemplateIds.TemplateFanChang,
            TemplateIds.TemplateXinChun,
            TemplateIds.TemplateDragonGate
        ].includes(id)) {
            return '主会场'
        }
        return ''
    }

    async onSizeChange (val: number) {
        this.searchForm.current = 1
        this.searchForm.size = val
        try {
            await this.getDraft()
        } catch (e) {
            throw e
        }
    }

    // 按条件查询
    async onFilterChange (filters: { [key: string]: string[] }) {
        try {
            const find = (arr: any[]) => (val: any) => arr.includes(val)

            const columnKey = Reflect.ownKeys(filters)[0]
            if (typeof columnKey === 'string') {
                const values = filters[columnKey]

                // 模板类型筛选
                if (columnKey === 'type') {
                    const filterByType = find(values)
                    if (filterByType(1) && filterByType(2)) {
                        this.getDraft({ type: '', current: 1 })
                    } else if (filterByType(1)) {
                        this.getDraft({ type: 1, current: 1 })
                    } else if (filterByType(2)) {
                        this.getDraft({ type: 2, current: 1 })
                    } else {
                        this.getDraft({ type: '', current: 1 })
                    }
                }
                // 模板状态筛选
                if (columnKey === 'status') {
                    const filterByStatus = find(values)
                    if (filterByStatus(TemplateStatus.OffShelf) && filterByStatus(TemplateStatus.Draft)) {
                        this.getDraft({ status: '', current: 1 })
                    } else if (filterByStatus(TemplateStatus.OffShelf)) {
                        this.getDraft({ status: TemplateStatus.OffShelf, current: 1 })
                    } else if (filterByStatus(TemplateStatus.Draft)) {
                        this.getDraft({ status: TemplateStatus.Draft, current: 1 })
                    } else {
                        this.getDraft({ status: '', current: 1 })
                    }
                }
            }
        } catch (error) {
            throw error
        }
    }

    // 多选过滤出id来批量操作
    onSelectionChange (val: DraftTableRow[]) {
        const array = []
        if (val && val.length) {
            for (const item of val) {
                array.push(item.id)
            }
        }
        this.multipleSelection = array
    }

    // 模板改名
    async rename (row: DraftTableRow) {
        try {
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
        } catch (error) {
            throw error
        }
    }

    // 取消模板改名
    cancelRename (row: DraftTableRow) {
        row.editName = row.templateName
        row.isEdit = false
    }

    // 复制模板
    async copyTemplate (id: string) {
        try {
            const { result = {} } = await checkIsFull()
            if (!result) {
                await this.$confirm('草稿箱已满50条，保存该草稿将会刪除草稿箱保存时间最早的一条草稿，是否进行该操作？')
            }
            await this.$confirm('确定复制该页面及上传内容？')
            await copyTemplateItem(id)
            this.$success('复制成功')
            this.getDraft()
        } catch (error) {
            throw error
        }
    }

    // 预览模板
    async previewTemplate (id: string) {
        try {
            const { result = {} } = await previewTemplateItem(id)
            if (result && Object.keys(result).length) {
                this.tmplId = result.type
                this.skinId = result.skinStatus || 0
                this.templateModels = rebuild(this.tmplId, result.moduleModels)
                this.templatePreviewShow = true
            }
        } catch (error) {
            throw error
        }
    }

    // 上架模板
    async putOnShelf ({ id, type }: {id: string; type: number}) {
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
    async deleteTemplate (id: string) {
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

    // 批量删除
    async deleteTemplates () {
        try {
            await this.$confirm('确定批量删除模板？')
            await delTemplateBatch(this.multipleSelection)
            this.$success('批量删除成功')
            this.getDraft()
        } catch (e) {
            this.$error('批量删除失败')
        }
    }

    // 设置上架时间
    async setOnShelfTime ({ id, type }: {id: string; type: number}) {
        try {
            const { result = {} } = await previewTemplateItem(id)
            const moduleModels = rebuild(result.type, result.moduleModels)
            const { pass, errMsg } = await validatorProducer(result.type, moduleModels).validate()

            if (pass === true) {
                const modal = this.$refs.modal as ModalTimeSetting
                const result = await modal.onShow()
                if (typeof result === 'string') {
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
        font-size: 14px;
    }

    &-num {
        font-weight: 400;
        line-height: 32px;
        margin-right: 10px;
    }
}
.more {
    margin-left: 10px;
}

</style>
