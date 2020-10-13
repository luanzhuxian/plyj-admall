import moment from 'moment'
import {
    TemplateCrosses,
    TemplateB,
    TemplateC,
    TemplateD,
    TemplateFanChang,
    TemplateFengQiang,
    TemplateBaoFa,
    TemplateXinChun,
    TemplateDragonGate,
    TemplateModule,
    TemplateModuleItem
} from './types'
import { TemplateTypes } from './map'

// 找到指定模块
const findModule = function (modules: TemplateModule[]) {
    return function (id: number) {
        return modules.find((module: TemplateModule) => module.moduleType === id)
    }
}

/**
 * rebuild过程中对各个模块做处理
 * @param {object} modules 模板对象，包含多个模块
 * @param {string} name 模块名称
 * @return {object} 模块列表
 */
export const reset = (modules: TemplateModule | undefined, name: string) => {
    if (!modules) return

    if (~['Banner', 'Adv'].indexOf(name)) {
        for (const item of modules.values) {
            if (item.valueName === '') {
                item.valueName = item.value
            }
        }
    }
    if (~['Popular', 'Fengqiang'].indexOf(name)) {
        modules.goodsSource = (modules.goodsSource && modules.goodsSource !== '') ? modules.goodsSource : 2
        modules.productValues = modules.goodsSource === 2 ? modules.values : []
        modules.categoryValues = modules.goodsSource === 1 ? modules.values : []
        modules.otherInfo = modules.goodsSource === 1 ? modules.otherInfo : ''
        modules.otherValue = modules.goodsSource === 1 ? modules.otherValue : ''
        modules.number = modules.goodsSource === 1 ? modules.number : 1
    }
    if (name === 'Class') {
        modules.goodsSource = (modules.goodsSource && modules.goodsSource !== '') ? modules.goodsSource : 3
        modules.productValues = modules.goodsSource === 3 ? modules.values : []
        modules.categoryValues = modules.goodsSource === 1 ? modules.values : []
        modules.otherInfo = modules.goodsSource === 1 ? modules.otherInfo : ''
        modules.otherValue = modules.goodsSource === 1 ? modules.otherValue : ''
        modules.number = modules.goodsSource === 1 ? modules.number : 1
    }
    if (name === 'Recommend') {
        modules.sortType = (modules.sortType && modules.sortType !== '') ? modules.sortType : 1
        modules.remDuplicate = (modules.remDuplicate && modules.remDuplicate !== '') ? modules.remDuplicate : 0
        modules.number = (modules.number && modules.number !== '') ? modules.number : 1
        modules.styleType = (modules.styleType && modules.styleType !== '') ? modules.styleType : 2
    }
    if (name === 'Appointment') {
        const model = {
            goodsInfo: '',
            id: '',
            image: '',
            name: '',
            serverTime: '',
            shoppingStatus: '',
            shoppingTime: '',
            type: '',
            value: '',
            valueName: ''
        }
        if (modules.values.length === 0) {
            modules.values = [{ value: '免费试听，专业顾问指导' }, { value: '' }]
                .map((item: { value: string }) => Object.assign({}, model, item))
        }
        if (modules.values.length === 1) {
            modules.values.push(Object.assign({}, model, { value: '' }))
        }
    }
    if (name === 'Propagate') {
        if (modules.values.length && modules.values[0].mallBrandingRequestModels && modules.values[0].mallBrandingRequestModels.length === 0) {
            modules.show = 0
        }
    }
    if (~['Live', 'OnlineCourse', 'SeriesCourse', 'ImageText'].indexOf(name)) {
        // modules.styleType: 1 默认显示1个 2 显示多个
        modules.values = modules.styleType === 1 ? modules.values.slice(0, 1) : modules.values
        modules.defaultValues = modules.styleType === 1 ? modules.values : []
        modules.backupValues = modules.styleType === 2 ? modules.values : []
        modules.number = modules.styleType === 2 ? modules.number : 1
    }
    if (name === 'Live') {
        const [nowCount = 0, futrueCount = 0, pastCount = 0] = modules.otherValue.split(',')
        Object.assign(modules, {
            nowCount,
            futrueCount,
            pastCount
        })
    }

    // 主会场
    if (~['Coupon', 'Pintuan', 'Yugou', 'Miaosha', 'Package', 'Distribution'].indexOf(name)) {
        modules.goodsSource = 2
    }
    if (name === 'Maisong') {
        modules.otherValue = (modules.otherValue && modules.otherValue !== '') ? modules.otherValue : '12.12当日下单 享多重好礼'
    }
    if (name === 'Miaosha') {
        for (const item of modules.values) {
            if (!item.goodsInfo) item.goodsInfo = []
            item.range = item.valueName.split(',')
        }
    }
    return modules
}

/**
 * 将模板数据，从数组重组为对象
 * @param {array} modules 模板数组，包含多个模块
 * @param {number} tmplType 模板类型
 * @return {object} 模块列表
 */
export const rebuild = (tmplType: number, modules: TemplateModule[]): TemplateCrosses | object => {
    const findModuleById = findModule(modules)
    let templateModel

    // 首页
    if (tmplType === TemplateTypes.TemplateB) {
        templateModel = {} as TemplateB
        templateModel.Banner = reset(findModuleById(1), 'Banner')
        templateModel.Live = reset(findModuleById(20), 'Live')
        templateModel.OnlineCourse = reset(findModuleById(21), 'OnlineCourse')
        templateModel.SeriesCourse = reset(findModuleById(22), 'SeriesCourse')
        templateModel.ImageText = reset(findModuleById(23), 'ImageText')
        templateModel.Popular = reset(findModuleById(2), 'Popular')
        templateModel.Appointment = reset(findModuleById(5), 'Appointment')
        templateModel.Propagate = reset(findModuleById(6), 'Propagate')
        templateModel.Class = reset(findModuleById(3), 'Class')
        templateModel.Recommend = reset(findModuleById(4), 'Recommend')
    }
    if (tmplType === TemplateTypes.TemplateB2) {
        templateModel = {} as TemplateB
        templateModel.Banner = reset(modules[0], 'Banner')
        templateModel.Adv = reset(modules[1], 'Adv')
        templateModel.Live = reset(findModuleById(20), 'Live')
        templateModel.OnlineCourse = reset(findModuleById(21), 'OnlineCourse')
        templateModel.SeriesCourse = reset(findModuleById(22), 'SeriesCourse')
        templateModel.ImageText = reset(findModuleById(23), 'ImageText')
        templateModel.Popular = reset(findModuleById(2), 'Popular')
        templateModel.Appointment = reset(findModuleById(5), 'Appointment')
        templateModel.Propagate = reset(findModuleById(6), 'Propagate')
        templateModel.Class = reset(findModuleById(3), 'Class')
        templateModel.Recommend = reset(findModuleById(4), 'Recommend')
    }
    if (tmplType === TemplateTypes.TemplateC) {
        templateModel = {} as TemplateC
        templateModel.Propagate = reset(findModuleById(6), 'Propagate')
        templateModel.Live = reset(findModuleById(20), 'Live')
        templateModel.OnlineCourse = reset(findModuleById(21), 'OnlineCourse')
        templateModel.SeriesCourse = reset(findModuleById(22), 'SeriesCourse')
        templateModel.ImageText = reset(findModuleById(23), 'ImageText')
        templateModel.Appointment = reset(findModuleById(5), 'Appointment')
        templateModel.Popular = reset(findModuleById(2), 'Popular')
        templateModel.Teachers = reset(findModuleById(12), 'Teachers')
        templateModel.Class = reset(findModuleById(3), 'Class')
        templateModel.Recommend = reset(findModuleById(4), 'Recommend')
    }
    if (tmplType === TemplateTypes.TemplateD) {
        templateModel = {} as TemplateD
        templateModel.Banner = reset(findModuleById(1), 'Banner')
        templateModel.Coupon = reset(findModuleById(9), 'Coupon')
        templateModel.Activity = reset(findModuleById(15), 'Activity')
        templateModel.Live = reset(findModuleById(20), 'Live')
        templateModel.OnlineCourse = reset(findModuleById(21), 'OnlineCourse')
        templateModel.SeriesCourse = reset(findModuleById(22), 'SeriesCourse')
        templateModel.ImageText = reset(findModuleById(23), 'ImageText')
        templateModel.Appointment = reset(findModuleById(5), 'Appointment')
        templateModel.Miaosha = reset(findModuleById(10), 'Miaosha')
        templateModel.Package = reset(findModuleById(16), 'Package')
        templateModel.Pintuan = reset(findModuleById(8), 'Pintuan')
        templateModel.Yugou = reset(findModuleById(11), 'Yugou')
        templateModel.Propagate = reset(findModuleById(6), 'Propagate')
        templateModel.Popular = reset(findModuleById(2), 'Popular')
        templateModel.Class = reset(findModuleById(3), 'Class')
        templateModel.Recommend = reset(findModuleById(4), 'Recommend')
    }

    // 主会场
    if (tmplType === TemplateTypes.TemplateFengQiang) {
        templateModel = {} as TemplateFengQiang
        templateModel.Miaosha = reset(modules[0], 'Miaosha')
        templateModel.Pintuan = reset(modules[1], 'Pintuan')
        templateModel.Maisong = reset(modules[2], 'Maisong')
        templateModel.Coupon = reset(modules[3], 'Coupon')
        templateModel.Yugou = reset(modules[4], 'Yugou')
        templateModel.Fengqiang = reset(modules[5], 'Fengqiang')
        templateModel.Recommend = reset(modules[6], 'Recommend')
    }
    if (tmplType === TemplateTypes.TemplateBaoFa) {
        templateModel = {} as TemplateBaoFa
        templateModel.Coupon = reset(modules[0], 'Coupon')
        templateModel.Maisong = reset(modules[1], 'Maisong')
        templateModel.Miaosha = reset(modules[2], 'Miaosha')
        templateModel.Pintuan = reset(modules[3], 'Pintuan')
        templateModel.Fengqiang = reset(modules[4], 'Fengqiang')
    }
    if (tmplType === TemplateTypes.TemplateFanChang) {
        templateModel = {} as TemplateFanChang
        templateModel.Maisong = reset(modules[0], 'Maisong')
        templateModel.Miaosha = reset(modules[1], 'Miaosha')
        templateModel.Pintuan = reset(modules[2], 'Pintuan')
        templateModel.Fengqiang = reset(modules[3], 'Fengqiang')
        templateModel.Recommend = reset(modules[4], 'Recommend')
    }
    if (tmplType === TemplateTypes.TemplateXinChun) {
        templateModel = {} as TemplateXinChun
        templateModel.Propagate = reset(modules[0], 'Propagate')
        templateModel.Coupon = reset(modules[1], 'Coupon')
        templateModel.Chunyun = reset(modules[2], 'Chunyun')
        templateModel.Pintuan = reset(modules[3], 'Pintuan')
        templateModel.Yugou = reset(modules[4], 'Yugou')
        templateModel.Fengqiang = reset(modules[5], 'Fengqiang')
    }
    if (tmplType === TemplateTypes.TemplateDragonGate) {
        templateModel = {} as TemplateDragonGate
        templateModel.Coupon = reset(findModuleById(9), 'Coupon')
        templateModel.Charity = reset(findModuleById(17), 'Charity')
        templateModel.Activity = reset(findModuleById(19), 'Activity')
        templateModel.Miaosha = reset(findModuleById(10), 'Miaosha')
        templateModel.Distribution = reset(findModuleById(18), 'Distribution')
        templateModel.Pintuan = reset(findModuleById(8), 'Pintuan')
        templateModel.Yugou = reset(findModuleById(11), 'Yugou')
        templateModel.Package = reset(findModuleById(16), 'Package')
        templateModel.Recommend = reset(findModuleById(4), 'Recommend')
    }
    return templateModel || {}
}

/**
 * 整理数据为最初拿到的格式
 * @param {array} modules 模板数组，包含多个模块
 * @param {number} tmplType 模板类型
 * @return {object} 模块列表
 */
export const rebuildBeforeSubmit = (modules: TemplateCrosses, tmplType: number): TemplateModule[] => {
    const moduleModels = JSON.parse(JSON.stringify(modules))

    for (const name of ['Popular', 'Class', 'Fengqiang']) {
        if (name in moduleModels) {
            // goodsSource: 1 分类来源, 2 商品来源
            moduleModels[name].otherValue = moduleModels[name].goodsSource === 1 ? moduleModels[name].otherValue : ''
            moduleModels[name].otherInfo = moduleModels[name].goodsSource === 1 ? moduleModels[name].otherInfo : ''
            moduleModels[name].number = moduleModels[name].goodsSource === 1 ? moduleModels[name].number : ''
            moduleModels[name].values = moduleModels[name].goodsSource === 1 ? [] : moduleModels[name].productValues
            Reflect.deleteProperty(moduleModels[name], 'productValues')
            Reflect.deleteProperty(moduleModels[name], 'categoryValues')
        }
    }
    if ('Appointment' in moduleModels) {
        moduleModels.Appointment.values = moduleModels.Appointment.values.filter((item: TemplateModuleItem) => item.value)
    }
    if (moduleModels.Propagate) {
        moduleModels.Propagate.values = []
    }
    for (const name of ['Live', 'OnlineCourse', 'SeriesCourse', 'ImageText']) {
        if (moduleModels[name]) {
            moduleModels[name].number = moduleModels[name].styleType === 1 ? '' : moduleModels[name].number
            moduleModels[name].values = moduleModels[name].styleType === 1 ? moduleModels[name].defaultValues : moduleModels[name].backupValues
            Reflect.deleteProperty(moduleModels[name], 'defaultValues')
            Reflect.deleteProperty(moduleModels[name], 'backupValues')
        }
    }
    if (moduleModels.Live) {
        moduleModels.Live.values = []
        Reflect.deleteProperty(moduleModels.Live, 'nowCount')
        Reflect.deleteProperty(moduleModels.Live, 'futrueCount')
        Reflect.deleteProperty(moduleModels.Live, 'pastCount')
    }

    if (moduleModels.Miaosha) {
        for (const item of moduleModels.Miaosha.values) {
            if (item.goodsInfo.length) {
                const arr = item.goodsInfo.map((prod: DynamicObject) => prod.activityInfo.id)
                item.value = arr.join(',')
            }
            if (item.range && item.range.length) {
                item.range[0] = moment(item.range[0]).format('YYYY-MM-DD HH:mm:ss')
                item.range[1] = moment(item.range[1]).format('YYYY-MM-DD HH:mm:ss')
                item.valueName = item.range.join(',')
            }
            Reflect.deleteProperty(item, 'range')
        }
    }
    if (moduleModels.Chunyun) {
        moduleModels.Chunyun.values = []
    }
    if (moduleModels.Package && moduleModels.Package.values.length) {
        moduleModels.Package.values = moduleModels.Package.values.map(({ id }: { id: string }) => ({ value: id }))
    }

    // 龙门节主会场
    if (tmplType === TemplateTypes.TemplateDragonGate) {
        moduleModels.Charity.values = []
        moduleModels.Activity.values = []
    }
    return Object.values(moduleModels) || []
}
