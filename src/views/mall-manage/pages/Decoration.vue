<template>
    <div :class="$style.mallDecoration">
        <div :class="$style.template" v-if="show">
            <div :class="$style.previewSection">
                <components
                    :is="currentTemplate"
                    :data="moduleModels"
                    :tmpl-type="tmplType"
                    :skin-id="skinId"
                    :current="currentModule"
                    @select="onModuleClick"
                />
            </div>
            <div :class="$style.operateSection">
                <EditorBanner
                    :class="$style.editor"
                    :style="{ '--top': `${editorPosition.Banner}px` }"
                    :show="isEditorBannerShow"
                    :data="isEditorBannerShow ? moduleModels[currentModule] : {}"
                    :current-module="currentModule"
                    @close="currentModule = ''"
                />
                <EditorActivity
                    :class="$style.editor"
                    :style="{ '--top': `${editorPosition.Activity}px` }"
                    :show="isEditorActivityShow"
                    :data="isEditorActivityShow ? moduleModels[currentModule] : {}"
                    @close="currentModule = ''"
                />
                <EditorModule
                    ref="editor-module"
                    :class="$style.editor"
                    :style="{ '--top': `${editorPosition.Module}px` }"
                    :show="isEditorModuleShow"
                    :data="isEditorModuleShow ? moduleModels[currentModule] : {}"
                    :hide-input="isEditorModuleInputHide"
                    :hide-radio="isEditorModuleRadioHide"
                    @close="currentModule = ''"
                />
                <EditorVideo
                    ref="editor-video"
                    :class="$style.editor"
                    :style="{ '--top': `${editorPosition.Video}px` }"
                    :show="isEditorVideoShow"
                    :data="isEditorVideoShow ? moduleModels[currentModule] : {}"
                    @close="currentModule = ''"
                />
                <EditorSort
                    ref="editor-sort"
                    :class="$style.editor"
                    :style="{ '--top': `${editorPosition.Sort}px` }"
                    :show="isEditorSortShow"
                    :data="isEditorSortShow ? moduleModels[currentModule] : {}"
                    :disabled="isActivity"
                    @close="currentModule = ''"
                />
                <EditorAppointment
                    :class="$style.editor"
                    :style="{ '--top': `${editorPosition.Appointment}px` }"
                    :show="isEditorAppointmentShow"
                    :data="isEditorAppointmentShow ? moduleModels[currentModule] : {}"
                    @close="currentModule = ''"
                />
                <EditorPropagate
                    :class="$style.editor"
                    :style="{ '--top': `${editorPosition.Propagate}px` }"
                    :show="isEditorPropagateShow"
                    :data="isEditorPropagateShow ? moduleModels[currentModule] : {}"
                    :is-image-manager-show="tmplType === -1"
                    @close="currentModule = ''"
                />
                <EditorForm
                    :class="$style.editor"
                    :style="{ '--top': `${editorPosition.Form}px` }"
                    :show="isEditorFormShow"
                    :data="isEditorFormShow ? moduleModels[currentModule] : {}"
                    :options="editorFormOptions"
                    @close="currentModule = ''"
                />
                <EditorCoupon
                    :class="$style.editor"
                    :style="{ '--top': `${editorPosition.Coupon}px` }"
                    :show="isEditorCouponShow"
                    :data="isEditorCouponShow ? moduleModels[currentModule] : {}"
                    :max="editorCouponMaxValue"
                    @close="currentModule = ''"
                />
                <EditorMiaosha
                    :class="$style.editor"
                    :style="{ '--top': `${editorPosition.Miaosha}px` }"
                    :show="isEditorMiaoshaShow"
                    :data="isEditorMiaoshaShow ? moduleModels[currentModule] : {}"
                    @close="currentModule = ''"
                />
                <EditorClassify
                    :class="$style.editor"
                    :style="{ '--top': `${editorPosition.Classify}px` }"
                    :show="currentModule === 'Classify'"
                    :data="currentModule === 'Classify' ? moduleModels.Classify : {}"
                    @close="currentModule = ''"
                />
            </div>
        </div>
        <footer v-show="!showPreview">
            <el-button
                type="primary"
                round
                :disabled="!loaded"
                @click="stack"
            >
                上架
            </el-button>
            <el-button
                v-if="~['THEME', 'DRAFT'].indexOf(this.from)"
                type="primary"
                round
                :disabled="!loaded"
                style="width: auto"
                @click="stackByTime"
            >
                定时上架
            </el-button>
            <el-button
                type="primary"
                plain
                round
                :disabled="!loaded"
                @click="showPreview = true"
            >
                预览
            </el-button>
            <el-button
                plain
                round
                :disabled="!loaded"
                @click="saveDraft"
            >
                保存
            </el-button>
            <el-button
                plain
                round
                :disabled="!loaded"
                @click="discard"
            >
                取消
            </el-button>
        </footer>
        <ModalProdCategory
            :show.sync="modalOption.show"
            :title.sync="modalOption.title"
            :type.sync="modalOption.type"
            :radio.sync="modalOption.radio"
            @update="updateModules"
        />
        <ModalProd
            :show.sync="ActivityModalOption.show"
            :title.sync="ActivityModalOption.title"
            :type.sync="ActivityModalOption.type"
            :range.sync="ActivityModalOption.range"
            :default-checkbox="defaultSelection"
            :reserve-selection="reserveSelection"
            @update="updateModules"
        />
        <TemplatePreview :show.sync="showPreview">
            <Render
                :tmpl-type="tmplType"
                :skin-id="skinId"
                :data="moduleModels"
                is-preview
                :is-clickable="false"
                :is-empty-show="false"
                :render="(h, props) => h(currentTemplate, { props })"
            />
        </TemplatePreview>
        <ModalTimeSetting ref="modal" />
    </div>
</template>

<script lang="ts">
/* eslint-disable func-style */
/* eslint-disable require-await */

import { Vue, Component, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import TemplateB from '../components/templates/Template-B.vue'
import TemplateC from '../components/templates/Template-C.vue'
import TemplateD from '../components/templates/Template-D.vue'
import TemplateFengqiang from '../components/templates/template-double-12-2019/Template-Fengqiang.vue'
import TemplateBaofa from '../components/templates/template-double-12-2019/Template-Baofa.vue'
import TemplateFanchang from '../components/templates/template-double-12-2019/Template-Fanchang.vue'
import TemplateSpring2020 from '../components/templates/Template-Spring-2020.vue'
import TemplateDragonGate from '../components/templates/Template-Dragon-Gate.vue'
import TemplateDouble122020 from '../components/templates/Template-Double-12-2020.vue'
import TemplateSpring2021 from '../components/templates/Template-Spring-2021-Green.vue'
import TemplatePreview from '../components/Template-Preview.vue'
import EditorBanner from '../components/Editor-Banner.vue'
import EditorActivity from '../components/Editor-Activity.vue'
import EditorModule from '../components/Editor-Module.vue'
import EditorVideo from '../components/Editor-Video.vue'
import EditorSort from '../components/Editor-Sort.vue'
import EditorAppointment from '../components/Editor-Appointment.vue'
import EditorPropagate from '../components/Editor-Propagate.vue'
import EditorForm from '../components/Editor-Form.vue'
import EditorCoupon from '../components/Editor-Coupon.vue'
import EditorMiaosha from '../components/Editor-Miaosha.vue'
import EditorClassify from '../components/Editor-Classify.vue'
import ModalProdCategory from '../components/Modal-Prod-Category.vue'
import ModalProd from '../components/Modal-Prod.vue'
import ModalTimeSetting from '../components/Modal-Time-Setting.vue'
import Render from '../components/Render'
import { teacherEditorOptions, maisongEditorOptions } from '../utils/config'
import { rebuild, rebuildBeforeSubmit } from '../utils/rebuild'
import { isString, isPlainObject } from '../utils/helper'
import { validatorProducer } from '../utils/validate/index'
import { initModuleUpdater } from '../utils/update/index'
import {
    TemplateCrosses,
    Template,
    TemplateModuleItem,
    UpdateData
} from '../utils/types'
import {
    TemplateTypes,
    ModuleTypes,
    ModalType,
    tagMap,
    editorMap,
    moduleIdMap
} from '../utils/map'
import {
    getDefaultTemplateList,
    updateCurrentTemplate,
    getTemplateById,
    checkIsFull
} from '../../../apis/mall'

const mall = namespace('mall')

@Component({
    components: {
        TemplateB,
        TemplateC,
        TemplateD,
        TemplateFengqiang,
        TemplateBaofa,
        TemplateFanchang,
        TemplateSpring2020,
        TemplateDragonGate,
        TemplateDouble122020,
        TemplateSpring2021,
        TemplatePreview,
        EditorBanner,
        EditorActivity,
        EditorModule,
        EditorVideo,
        EditorSort,
        EditorAppointment,
        EditorPropagate,
        EditorForm,
        EditorCoupon,
        EditorMiaosha,
        EditorClassify,
        ModalProdCategory,
        ModalProd,
        ModalTimeSetting,
        Render
    }
})
export default class MallDecoration extends Vue {
    /* data */
    loaded = false
    show = false
    showPreview = false
    // 进入编辑页的入口 DRAFT：草稿箱列表 THEME：主题页 CURRENT：当前首页\主会场编辑
    from = ''
    // 模板类型
    tmplType = 0
    // 皮肤id
    skinId = 0
    // 当前模板
    templateModel: Template | {} = {}
    // 当前模板的 module 列表
    moduleModels: TemplateCrosses | {} = {}
    // 当前处于点击状态的 module
    currentModule = ''
    modulesUpdater!: DynamicObject
    unWatch!: Function

    // 模块装饰器的位置
    editorPosition: DynamicObject = {
        Banner: 0,
        Activity: 0,
        Module: 0,
        Video: 0,
        Sort: 0,
        Appointment: 0,
        Propagate: 0,
        Form: 0,
        Coupon: 0,
        Maisong: 0,
        Miaosha: 0,
        Classify: 0,
        getPosition (name: string) {
            return this[name]
        }
    }

    // 弹窗信息
    modalOption = {
        show: false,
        type: 0,
        title: '',
        radio: ''
    }

    // 弹窗信息
    ActivityModalOption = {
        show: false,
        type: 0,
        title: '',
        radio: '',
        range: []
    }

    /* computed */
    @mall.Getter('currentHome') currentHome!: Template
    @mall.Getter('currentActivity') currentActivity!: Template

    get currentTemplate () {
        return tagMap.findTemplateTagById(this.tmplType)
    }

    // 主会场模板
    get isActivity () {
        return [
            TemplateTypes.TemplateFengQiang,
            TemplateTypes.TemplateBaoFa,
            TemplateTypes.TemplateFanChang,
            TemplateTypes.TemplateSpring2020,
            TemplateTypes.TemplateDragonGate,
            TemplateTypes.TemplateDouble122020,
            TemplateTypes.TemplateSpring2021
        ].includes(this.tmplType)
    }

    get isEditorBannerShow () {
        return this.currentModule === 'Banner' || this.currentModule === 'Adv'
    }

    get isEditorActivityShow () {
        return this.currentModule === 'Activity'
    }

    get isEditorModuleShow () {
        return ['Popular', 'Class', 'Pintuan', 'Yugou', 'Fengqiang', 'Package', 'Distribution'].includes(this.currentModule) ||
        (this.currentModule === 'Miaosha' && this.tmplType !== TemplateTypes.TemplateBaoFa)
    }

    get isEditorVideoShow () {
        return ['Live', 'SingleCourse', 'SeriesCourse', 'ImageText'].includes(this.currentModule)
    }

    get isEditorSortShow () {
        return this.currentModule === 'Recommend'
    }

    get isEditorAppointmentShow () {
        return this.currentModule === 'Appointment'
    }

    get isEditorPropagateShow () {
        return this.currentModule === 'Propagate'
    }

    get isEditorFormShow () {
        return ['Teachers', 'Maisong'].includes(this.currentModule)
    }

    get isEditorCouponShow () {
        return this.currentModule === 'Coupon' || this.currentModule === 'RedPackage'
    }

    get isEditorMiaoshaShow () {
        return ['Miaosha'].includes(this.currentModule) && this.tmplType === TemplateTypes.TemplateBaoFa
    }

    // 是否隐藏 EditorModule 的输入框
    get isEditorModuleInputHide () {
        return ['Pintuan', 'Yugou', 'Miaosha', 'Fengqiang', 'Package', 'Distribution'].includes(this.currentModule)
    }

    // 是否隐藏 EditorModule 的单选框
    get isEditorModuleRadioHide () {
        return ['Pintuan', 'Yugou', 'Miaosha', 'Package', 'Distribution'].includes(this.currentModule)
    }

    get editorCouponMaxValue () {
        if (this.currentModule === 'RedPackage') {
            return 10
        }
        return this.tmplType === TemplateTypes.TemplateDragonGate ? 2 : 3
    }

    get editorFormOptions () {
        const { moduleModels } = this
        if (Reflect.has(moduleModels, 'Teachers')) {
            return teacherEditorOptions
        }
        if (Reflect.has(moduleModels, 'Maisong')) {
            return maisongEditorOptions
        }
        return {}
    }

    // 商品弹窗已选商品是否默认选中
    get defaultSelection () {
        if (this.currentModule === 'Coupon') {
            if ('Coupon' in this.moduleModels) {
                return this.moduleModels.Coupon?.values
            }
        }
        if (this.currentModule === 'Package') {
            if ('Package' in this.moduleModels) {
                return this.moduleModels.Package?.values
            }
        }
        return []
    }

    get reserveSelection () {
        return this.currentModule === 'Package' || this.currentModule === 'Coupon'
    }

    /* watch */
    // 其他模块数据更新后，如果推荐模块选择了去重，则重新获取推荐模块数据
    @Watch('moduleModels.Popular.values', { deep: true })
    onPopularChange (val: TemplateModuleItem[], prev: TemplateModuleItem[]) {
        if (!prev) return

        this.removeDuplicateHandler()
    }

    @Watch('moduleModels.Class.values', { deep: true })
    onClassChange (val: TemplateModuleItem[], prev: TemplateModuleItem[]) {
        if (!prev) return

        this.removeDuplicateHandler()
    }

    @Watch('moduleModels.Fengqiang.values', { deep: true })
    onFengqiangChange (val: TemplateModuleItem[], prev: TemplateModuleItem[]) {
        if (!prev) return

        this.removeDuplicateHandler()
    }

    async created () {
        try {
            this.loaded = false
            const { from, type } = this.$route.query
            if (isString(from)) {
                this.from = from
            }
            if (from === 'CURRENT') {
                this.setWatcher(Number(type))
            }
            await this.getData()
            this.modulesUpdater = initModuleUpdater(this.moduleModels)
        } catch (error) {
            throw error
        } finally {
            this.loaded = true
        }
    }

    beforeDestroy () {
        if (this.unWatch) {
            this.unWatch()
        }
    }

    /* methods */
    @mall.Action('getCurrentTemplate') getCurrentTemplate!: (type: number) => Promise<void>

    /**
     * 监听 vuex 中的首页、主会场数据，当数据变化时触发 updateTemplate 更新本地数据
     * @param {Number} type 1: 首页模板 2：主会场模板
     */
    setWatcher (type: number) {
        const currentTemplate = type === 2 ? 'currentActivity' : 'currentHome'
        this.unWatch = this.$watch(currentTemplate, (template: Template) => {
            if (template && template.type) {
                this.updateTemplate(type)
                this.modulesUpdater = initModuleUpdater(this.moduleModels)
                this.loaded = true
            }
        })
    }

    // 商品去重
    async removeDuplicateHandler () {
        if ('Recommend' in this.moduleModels) {
            if (!this.moduleModels.Recommend || !this.moduleModels.Recommend.remDuplicate) return
            // @ts-ignore
            const editor: { getData: Function; rmDuplicate: Function } = this.$refs['editor-sort']
            let values = await editor.getData(this.moduleModels.Recommend)
            if (values.length) {
                values = editor.rmDuplicate(values)
            }
            this.moduleModels.Recommend.values = values
        }
    }

    async getData () {
        try {
            const { type, id } = this.$route.query
            // 获取当前使用模板数据
            if (this.from === 'CURRENT') {
                await this.updateTemplate(Number(type))
            }
            // 装修新模板时的初始数据
            if (this.from === 'THEME') {
                this.tmplType = Number(id)
                await this.getTemplateList()
            }
            // 获取草稿箱模板数据
            if (this.from === 'DRAFT' && isString(id)) {
                await this.getTemplateById(id)
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * 获取当前使用模板数据
     * @param {Number} type  1: 首页模板 2：主会场模板
     * @returns {Promise<Number>}
     */
    async updateTemplate (type = 1) {
        const template = type === 2 ? this.currentActivity : this.currentHome
        if (template && template.type) {
            this.tmplType = template.type
            this.skinId = template.skinStatus
            this.moduleModels = rebuild(template.type, JSON.parse(JSON.stringify(template.moduleModels)))
            this.templateModel = template
            this.show = true
        } else {
            this.show = false
        }
        return template.type
    }

    async getTemplateList () {
        try {
            const { result } = await getDefaultTemplateList()
            const template = result.find((template: Template) => template.type === this.tmplType)
            this.moduleModels = rebuild(this.tmplType, template.moduleModels)
            this.templateModel = template
            this.show = true
        } catch (e) {
            throw e
        }
    }

    async getTemplateById (id: string) {
        try {
            const { result } = await getTemplateById(id)
            this.tmplType = result.type
            this.skinId = result.skinStatus
            this.moduleModels = rebuild(this.tmplType, result.moduleModels)
            this.templateModel = result
            this.show = true
        } catch (e) {
            throw e
        }
    }

    // 获取装修组件的位置
    getEditorPosition (target: Element) {
        const OFFSET = 110
        const container = document.querySelector('#main')
        if (container && ('scrollTop' in container)) {
            // 当前点击模块相对窗口顶部的距离 + 容器滚动条滚动距离 - OFFSET
            return target.getBoundingClientRect().top + container.scrollTop - OFFSET
        }
    }

    // 点击模块时触发，找到对应的editor，并根据当前模块的位置设置editor的位置
    async onModuleClick (moduleName: string, domElem: Element) {
        const { tmplType } = this
        // @ts-ignore
        const target = domElem || event.currentTarget
        const editorName = editorMap.getEditorByModule({ tmplType, moduleName })
        this.editorPosition[editorName] = this.getEditorPosition(target)
        await this.$nextTick()
        this.currentModule = this.currentModule === moduleName ? '' : moduleName
        if (this.currentModule) {
            // 因为双十二普通模板 Banner 和 Adv 的 moduleType 都是 1，所以用 moduleName 区分
            if (this.currentModule === 'Banner' || this.currentModule === 'Adv') {
                this.modulesUpdater.switch(this.currentModule)
                return
            }
            // @ts-ignore
            this.modulesUpdater.switch(ModuleTypes[this.currentModule])
        }
    }

    // 进行装修操作后更新模块数据
    updateModules ({ type, selectedList = [], index }: UpdateData) {
        const { current } = this.modulesUpdater

        current.update({ type, selectedList, index }, this.tmplType)
        // TODO:
        if (~[ModuleTypes.Popular, ModuleTypes.Class].indexOf(current.moduleType)) {
            if (type === ModalType.CategoryModal) {
                // @ts-ignore
                this.$refs['editor-module'].getProductsByCategory(current.data)
            }
        }
    }

    async submit (model: Template) {
        try {
            if (isPlainObject<TemplateCrosses>(this.moduleModels)) {
                model.moduleModels = rebuildBeforeSubmit(this.moduleModels, this.tmplType)
                await updateCurrentTemplate(model)
                this.currentModule = ''
                return true
            }
        } catch (e) {
            throw e
        }
    }

    async saveDraft () {
        try {
            const { result } = await checkIsFull()
            if (!result) {
                await this.$confirm('草稿箱已满50条，保存该草稿将会刪除草稿箱保存时间最早的一条草稿，是否进行该操作？')
            }
            if (isPlainObject<Template>(this.templateModel)) {
                // eslint-disable-next-line
                const { moduleModels, status, ...rest } = this.templateModel
                const model = {
                    ...rest,
                    status: 2
                }
                await this.submit(model)
                this.$success('保存草稿箱成功')
            }
        } catch (e) {
            throw e
        }
    }

    // 上架
    async stack (e: any, msg = '上架成功') {
        try {
            if (isPlainObject<Template>(this.templateModel)) {
                // eslint-disable-next-line
                const { moduleModels, status, ...rest } = this.templateModel
                const model = {
                    ...rest,
                    status: 1
                }
                // 上架前校验
                const result = await validatorProducer(this.tmplType, this.moduleModels).validate()

                if (result.pass === true) {
                    await this.submit(model)
                    this.$success(msg)
                    setTimeout(() => {
                        this.$router.push({ name: 'MallMain' })
                    }, 1000)
                    await this.getCurrentTemplate(this.isActivity ? 2 : 1)
                }
                if (result.pass === false) {
                    const OFFSET = 50
                    const { errMsg, errModule } = result
                    this.$warning(errMsg)

                    if (this.currentModule !== errModule) {
                        this.onModuleClick(errModule, document.querySelector(moduleIdMap[errModule]))
                    }

                    // 滚动到报错的模块
                    await this.$nextTick()
                    const editorName = editorMap.getEditorByModule({ tmplType: this.tmplType, moduleName: errModule })
                    const container = document.querySelector('#main')
                    if (container && ('scrollTop' in container)) {
                        container.scrollTop = this.editorPosition.getPosition(editorName) + OFFSET
                    }
                }
                return result.pass
            }
        } catch (e) {
            throw e
        }
    }

    // 定时上架
    async stackByTime () {
        try {
            // @ts-ignore
            const result = await this.$refs.modal.onShow()
            if (result && ('upShelf' in this.templateModel)) {
                this.templateModel.upShelf = result
                await this.stack(null, '设置成功')
            }
        } catch (error) {
            throw error
        }
    }

    async discard () {
        await this.$confirm({
            title: '确认放弃修改？',
            message: '确认后不可恢复'
        })
        this.$router.go(-1)
    }

    async back () {
        await this.$confirm({
            title: '确认返回？',
            message: '确认后未保存的修改不可恢复'
        })
        this.$router.go(-1)
    }
}
</script>

<style lang="scss" module>
.mall-decoration {
    box-sizing: border-box;
    position: relative;
    min-height: calc(100vh - 110px);
    background-color: #fff;
}
.template {
    position: relative;
    display: flex;
    padding: 10px 0 150px 185px;
}
footer {
    position: fixed;
    left: 140px;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px;
    min-width: 800px;
    background-color: #fff;
    border-top: 1px solid #e7e7e7;
    z-index: 99;
    > button {
        margin-left: 20px !important;
        padding-left: 0;
        padding-right: 0;
        width: 80px;
        text-align: center;
    }
}

.preview-section {
    display: flex;
    flex-direction: column;
    width: 375px;
    background-color: #f4f5f9;
    box-shadow: 0 0 6px #d4d4d4;
}

.operate-section {
    box-sizing: border-box;
    margin-left: 100px;
    position: relative;
    flex: 1;
    .editor {
        position: absolute;
        top: var(--top);
        left: 0;
    }
}

</style>
