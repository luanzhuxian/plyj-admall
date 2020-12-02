<template>
    <div class="mall-main">
        <section :class="$style.template" v-if="showCurrentHome || showCurrentActivity">
            <div :class="$style.templateItem" v-if="showCurrentHome">
                <img :class="$style.templateIcon" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/home-blue.png" alt="店铺首页">
                <div :class="$style.templateInfo">
                    <div :class="$style.templateInfoTop">
                        <b :class="$style.templateName">{{ currentHome.templateName }}</b>
                        <span :class="[$style.label, $style.blue]">店铺首页</span>
                    </div>
                    <div :class="$style.templateDate">
                        {{ `创建时间 ${currentHome.createTime}` }}
                    </div>
                </div>
                <div :class="$style.templateButtons">
                    <el-button type="text" @click="previewCurrent(currentHome)">
                        预览
                    </el-button>
                    <el-button type="text" @click="$router.push({
                        name: 'MallDecoration',
                        query: { from: 'CURRENT', type: 1 }
                    })">
                        编辑
                    </el-button>
                    <el-button type="text" @click="$router.push({
                        name: 'MallThemes',
                        query: { currentTab: 'SKIN' }
                    })">
                        换肤
                    </el-button>
                </div>
            </div>
            <div :class="$style.templateItem" v-if="showCurrentActivity">
                <img :class="$style.templateIcon" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/main-red.png" alt="主会场">
                <div :class="$style.templateInfo">
                    <div :class="$style.templateInfoTop">
                        <b :class="$style.templateName">{{ currentActivity.templateName }}</b>
                        <span :class="[$style.label, $style.red]">主会场</span>
                    </div>
                    <div :class="$style.templateDate">
                        {{ `创建时间 ${currentActivity.createTime}` }}
                    </div>
                </div>
                <div :class="$style.templateButtons">
                    <el-button type="text" @click="previewCurrent(currentActivity)">
                        预览
                    </el-button>
                    <el-button type="text" @click="$router.push({
                        name: 'MallDecoration',
                        query: { from: 'CURRENT', type: 2 }
                    })">
                        编辑
                    </el-button>
                    <el-button type="text" @click="takeOffCurrentActivityTemplate">
                        下架
                    </el-button>
                </div>
            </div>
        </section>
        <section class="draft-table">
            <div :class="$style.operation">
                <span :class="$style.operationText">
                    已选择{{ multipleSelection.length }}个
                </span>
                <el-button round :disabled="!multipleSelection.length" @click="deleteTemplates">
                    批量删除
                </el-button>
            </div>
            <el-table
                ref="table"
                :data="table"
                @filter-change="onFilterChange"
                @selection-change="onSelectionChange"
            >
                <span slot="empty">
                    <PlSvg name="icon-empty" width="16" style="margin-right: 4px;" fill="#4F63FF" />
                    {{ emptyText }}
                </span>
                <el-table-column
                    type="selection"
                    width="55"
                    align="right"
                />
                <el-table-column
                    label="标题"
                    width="300"
                >
                    <template slot-scope="{ row }">
                        <template v-if="!row.isEdit">
                            <span v-text="row.templateName" />
                            <span :class="[$style.label, $style.blue]" v-if="row.id === currentHomeId">当前首页</span>
                            <span :class="[$style.label, $style.red]" v-if="row.id === currentActivityId">当前主会场</span>
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
                    :filter-multiple="false"
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
                    :filter-multiple="false"
                />
                <el-table-column
                    label="操作"
                    width="250"
                >
                    <template slot-scope="{ row }">
                        <el-button
                            v-if="row.status === 0 || row.status === 2"
                            type="text"
                            @click="$router.push({
                                name: 'MallDecoration',
                                query: { from: 'DRAFT', id: row.id }
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
                        <el-button
                            v-if="row.status === 3"
                            type="text"
                            @click="deleteTemplate(row.id)"
                        >
                            删除
                        </el-button>
                        <Operating v-else-if="row.status === 0 || row.status === 2" :class="$style.more">
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
            @change="getDraft"
        />
        <TemplatePreview :show.sync="showPreview">
            <Render
                :tmpl-type="previewTmplType"
                :skin-id="previewSkinId"
                :data="previewData"
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
import { namespace } from 'vuex-class'
import {
    getTemplateList,
    updateTemplateName,
    copyTemplateItem,
    previewTemplateItem,
    delTemplateItem,
    delTemplateBatch,
    checkIsFull,
    updateTemplateStatus,
    takeOffCurrentTemplate
} from '../../../apis/mall'
import TemplateB from '../components/templates/Template-B.vue'
import TemplateC from '../components/templates/Template-C.vue'
import TemplateD from '../components/templates/Template-D.vue'
import TemplateFengqiang from '../components/templates/template-double-12-2019/Template-Fengqiang.vue'
import TemplateBaofa from '../components/templates/template-double-12-2019/Template-Baofa.vue'
import TemplateFanchang from '../components/templates/template-double-12-2019/Template-Fanchang.vue'
import TemplateSpring2019 from '../components/templates/Template-Spring-2019.vue'
import TemplateDragonGate from '../components/templates/Template-Dragon-Gate.vue'
import TemplateDouble122020 from '../components/templates/Template-Double-12-2020.vue'
import TemplateSpring2020 from '../components/templates/Template-Spring-2020.vue'
import TemplatePreview from '../components/Template-Preview.vue'
import ModalTimeSetting from '../components/Modal-Time-Setting.vue'
import Render from '../components/Render'
import { rebuild } from '../utils/rebuild'
import { validatorProducer } from '../utils/validate'
import { tagMap, TemplateStatus, TemplateTypes } from '../utils/map'
import { Template, DraftTableRow } from '../utils/types'

const mall = namespace('mall')

@Component({
    components: {
        TemplateB,
        TemplateC,
        TemplateD,
        TemplateFengqiang,
        TemplateBaofa,
        TemplateFanchang,
        TemplateSpring2019,
        TemplateDragonGate,
        TemplateDouble122020,
        TemplateSpring2020,
        TemplatePreview,
        ModalTimeSetting,
        Render
    }
})
export default class MallMain extends Vue {
    /* data */
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
    emptyText = '暂无模板'

    // 预览
    showPreview = false
    previewData = {}
    previewTmplType = 0 // 预览模板id
    previewSkinId = 0 // 预览皮肤id

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
        text: '已上架',
        value: 1
    }, {
        text: '草稿',
        value: 2
    }, {
        text: '已过期',
        value: 3
    }]

    /* computed */
    @mall.Getter('currentHome') currentHome!: Template
    @mall.Getter('currentActivity') currentActivity!: Template

    get currentHomeId () {
        return this.currentHome ? this.currentHome.id : ''
    }

    get currentActivityId () {
        return this.currentActivity ? this.currentActivity.id : ''
    }

    get showCurrentHome () {
        return !!this.currentHomeId
    }

    get showCurrentActivity () {
        return !!this.currentActivityId
    }

    get tag () {
        return tagMap.findTemplateTagById(this.previewTmplType)
    }

    async created () {
        try {
            await this.getDraft()
        } catch (error) {
            throw error
        }
    }

    /* methods */
    @mall.Action('getCurrentTemplate') getCurrentTemplate!: (type: number) => Promise<void>

    // 获取模板列表
    async getDraft (params?: object) {
        try {
            if (params) {
                this.searchForm = Object.assign({}, this.searchForm, params)
            }
            const { result = {} } = await getTemplateList(this.searchForm)
            if (result?.records?.length) {
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

    // 刷新当前使用模板
    async refreshCurrentTemplate (id: string) {
        try {
            if (id === this.currentHomeId) {
                await this.getCurrentTemplate(1)
                return
            }
            if (id === this.currentActivityId) {
                await this.getCurrentTemplate(2)
                return
            }
            this.getCurrentTemplate(1)
            this.getCurrentTemplate(2)
        } catch (error) {
            throw error
        }
    }

    getTemplateType (id: number) {
        if ([
            TemplateTypes.TemplateC,
            TemplateTypes.TemplateB,
            TemplateTypes.TemplateB2,
            TemplateTypes.TemplateD
        ].includes(id)) {
            return '首页'
        }
        if ([
            TemplateTypes.TemplateFengQiang,
            TemplateTypes.TemplateBaoFa,
            TemplateTypes.TemplateFanChang,
            TemplateTypes.TemplateSpring2019,
            TemplateTypes.TemplateDragonGate,
            TemplateTypes.TemplateDouble122020
        ].includes(id)) {
            return '主会场'
        }
        return ''
    }

    // 按条件查询
    async onFilterChange (filters: { [key: string]: string[] }) {
        try {
            const find = (arr: any[]) => (val: any) => arr.includes(val)

            const columnKey = Reflect.ownKeys(filters)[0]
            if (typeof columnKey === 'string') {
                // 模板类型筛选
                if (columnKey === 'type') {
                    const filterByType = find(filters.type)
                    if (filterByType(1)) {
                        await this.getDraft({ type: 1, current: 1 })
                    } else if (filterByType(2)) {
                        await this.getDraft({ type: 2, current: 1 })
                    } else {
                        await this.getDraft({ type: '', current: 1 })
                    }
                }
                // 模板状态筛选
                if (columnKey === 'status') {
                    const filterByStatus = find(filters.status)
                    if (filterByStatus(TemplateStatus.OffShelf)) {
                        await this.getDraft({ status: TemplateStatus.OffShelf, current: 1 })
                    } else if (filterByStatus(TemplateStatus.OnShelf)) {
                        await this.getDraft({ status: TemplateStatus.OnShelf, current: 1 })
                    } else if (filterByStatus(TemplateStatus.Draft)) {
                        await this.getDraft({ status: TemplateStatus.Draft, current: 1 })
                    } else if (filterByStatus(TemplateStatus.Expire)) {
                        await this.getDraft({ status: TemplateStatus.Expire, current: 1 })
                    } else {
                        await this.getDraft({ status: '', current: 1 })
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
            row.isEdit = false
            await this.getDraft()
            await this.$nextTick()
            await this.refreshCurrentTemplate(row.id)
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
            await this.getDraft()
        } catch (error) {
            throw error
        }
    }

    // 预览当前首页/主会场
    async previewCurrent (template: Template) {
        const result = JSON.parse(JSON.stringify(template))
        this.preview(result)
    }

    // 预览模板
    async previewTemplate (id: string) {
        try {
            const { result = {} } = await previewTemplateItem(id)
            this.preview(result)
        } catch (error) {
            throw error
        }
    }

    preview (data: Template) {
        if (data?.type && data?.moduleModels) {
            this.previewTmplType = data.type
            this.previewSkinId = data.skinStatus || 0
            this.previewData = rebuild(data.type, data.moduleModels)
            this.showPreview = true
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
                await this.getDraft()
                await this.$nextTick()
                await this.refreshCurrentTemplate(id)
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
            await this.getDraft()
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
            await this.getDraft()
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
                    await this.getDraft()
                }
            } else {
                this.$warning(errMsg)
            }
        } catch (error) {
            throw error
        }
    }

    // 下架当前模板
    async takeOffCurrentActivityTemplate () {
        try {
            await this.$confirm({
                title: '确定下架当前主会场吗？',
                message: '下架后商城将不在显示主会场及相关的活动内容'
            })
            const { result, message } = await takeOffCurrentTemplate({ id: this.currentActivityId, type: 2 })
            if (result) {
                this.$success('下架成功')
                await this.$nextTick()
                await this.getCurrentTemplate(2)
                await this.getDraft()
            } else {
                this.$warning(message)
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

        // > .el-table > .el-table__header-wrapper > .el-table__header > thead {
        //     tr {
        //         th {
        //             border-bottom: none;
        //         }
        //     }
        // }
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

    .el-table__column-filter-trigger i {
        color: #333333;
        font-weight: bold;
        font-size: 16px;
    }
}

</style>

<style lang="scss" module>
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

.label {
    display: inline-block;
    box-sizing: border-box;
    margin-left: 10px;
    padding: 0 5px;
    min-width: 58px;
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

.operation {
    display: flex;
    align-items: center;
    margin-top: 24px;
    &-text {
        margin-right: 10px;
    }
}
.more {
    margin-left: 10px;
}

</style>
