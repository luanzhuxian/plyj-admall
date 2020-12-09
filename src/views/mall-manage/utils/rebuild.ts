import moment from 'moment'
import {
    TemplateCrosses,
    TemplateB,
    TemplateC,
    TemplateD,
    TemplateFanChang,
    TemplateFengQiang,
    TemplateBaoFa,
    TemplateSpring2019,
    TemplateDragonGate,
    TemplateDouble122020,
    TemplateSpring2020,
    TemplateModule,
    TemplateModuleItem
} from './types'
import { TemplateTypes, ModuleIds } from './map'

// 找到指定模块
const findModule = function (modules: TemplateModule[]) {
    return function (id: number) {
        return modules.find((module: TemplateModule) => module.moduleType === id)
    }
}

/**
 * rebuild过程中对各个模块做处理
 * @param {object} module 单个模块
 * @param {string} name 模块名称
 * @return {object} 模块
 */
export const reset = (module: TemplateModule | undefined, name: string) => {
    if (!module) return

    if (~['Banner', 'Adv'].indexOf(name)) {
        for (const item of module.values) {
            if (item.valueName === '') {
                item.valueName = item.value
            }
        }
    }
    if (~['Popular', 'Fengqiang'].indexOf(name)) {
        module.goodsSource = (module.goodsSource && module.goodsSource !== '') ? module.goodsSource : 2
        module.productValues = module.goodsSource === 2 ? module.values : []
        module.categoryValues = module.goodsSource === 1 ? module.values : []
        module.otherInfo = module.goodsSource === 1 ? module.otherInfo : ''
        module.otherValue = module.goodsSource === 1 ? module.otherValue : ''
        module.number = module.goodsSource === 1 ? module.number : 1
    }
    if (name === 'Class') {
        module.goodsSource = (module.goodsSource && module.goodsSource !== '') ? module.goodsSource : 3
        module.productValues = module.goodsSource === 3 ? module.values : []
        module.categoryValues = module.goodsSource === 1 ? module.values : []
        module.otherInfo = module.goodsSource === 1 ? module.otherInfo : ''
        module.otherValue = module.goodsSource === 1 ? module.otherValue : ''
        module.number = module.goodsSource === 1 ? module.number : 1
    }
    if (name === 'Recommend') {
        module.sortType = (module.sortType && module.sortType !== '') ? module.sortType : 1
        module.remDuplicate = (module.remDuplicate && module.remDuplicate !== '') ? module.remDuplicate : 0
        module.number = (module.number && module.number !== '') ? module.number : 1
        module.styleType = (module.styleType && module.styleType !== '') ? module.styleType : 2
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
        if (module.values.length === 0) {
            module.values = [{ value: '免费试听，专业顾问指导' }, { value: '' }]
                .map((item: { value: string }) => Object.assign({}, model, item))
        }
        if (module.values.length === 1) {
            module.values.push(Object.assign({}, model, { value: '' }))
        }
    }
    if (name === 'Propagate') {
        if (module.values.length && module.values[0].mallBrandingRequestModels && module.values[0].mallBrandingRequestModels.length === 0) {
            module.show = 0
        }
    }
    if (~['Live', 'OnlineCourse', 'SeriesCourse', 'ImageText'].indexOf(name)) {
        // module.styleType: 1 默认显示1个 2 显示多个
        module.values = module.styleType === 1 ? module.values.slice(0, 1) : module.values
        module.defaultValues = module.styleType === 1 ? module.values : []
        module.backupValues = module.styleType === 2 ? module.values : []
        module.number = module.styleType === 2 ? module.number : 1
    }
    if (name === 'Live') {
        const [nowCount = 0, futrueCount = 0, pastCount = 0] = module.otherValue.split(',')
        Object.assign(module, {
            nowCount,
            futrueCount,
            pastCount
        })
    }
    if (name === 'Classify') {
        if (module.values.length) {
            // 增加 selected 字段为了级联选择器回显，最后上架前要删除
            module.values = module.values.map(item => ({
                ...item,
                selected: item.value.split(',')
            }))
        }
    }

    // 主会场
    if (~['Coupon', 'RedPackage', 'Pintuan', 'Yugou', 'Miaosha', 'Package', 'Distribution'].indexOf(name)) {
        module.goodsSource = 2
    }
    if (name === 'Maisong') {
        module.otherValue = (module.otherValue && module.otherValue !== '') ? module.otherValue : '12.12当日下单 享多重好礼'
    }
    if (name === 'Miaosha') {
        for (const item of module.values) {
            if (!item.goodsInfo) item.goodsInfo = []
            item.range = item.valueName.split(',')
        }
    }
    return module
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
        templateModel.Banner = reset(findModuleById(ModuleIds.Banner), 'Banner')
        templateModel.Live = reset(findModuleById(ModuleIds.Live), 'Live')
        templateModel.OnlineCourse = reset(findModuleById(ModuleIds.OnlineCourse), 'OnlineCourse')
        templateModel.SeriesCourse = reset(findModuleById(ModuleIds.SeriesCourse), 'SeriesCourse')
        templateModel.ImageText = reset(findModuleById(ModuleIds.ImageText), 'ImageText')
        templateModel.Popular = reset(findModuleById(ModuleIds.Popular), 'Popular')
        templateModel.Appointment = reset(findModuleById(ModuleIds.Appointment), 'Appointment')
        templateModel.Propagate = reset(findModuleById(ModuleIds.Propagate), 'Propagate')
        templateModel.Class = reset(findModuleById(ModuleIds.Class), 'Class')
        templateModel.Recommend = reset(findModuleById(ModuleIds.Recommend), 'Recommend')
    }
    if (tmplType === TemplateTypes.TemplateB2) {
        templateModel = {} as TemplateB
        templateModel.Banner = reset(modules[0], 'Banner')
        templateModel.Adv = reset(modules[1], 'Adv')
        templateModel.Live = reset(findModuleById(ModuleIds.Live), 'Live')
        templateModel.OnlineCourse = reset(findModuleById(ModuleIds.OnlineCourse), 'OnlineCourse')
        templateModel.SeriesCourse = reset(findModuleById(ModuleIds.SeriesCourse), 'SeriesCourse')
        templateModel.ImageText = reset(findModuleById(ModuleIds.ImageText), 'ImageText')
        templateModel.Popular = reset(findModuleById(ModuleIds.Popular), 'Popular')
        templateModel.Appointment = reset(findModuleById(ModuleIds.Appointment), 'Appointment')
        templateModel.Propagate = reset(findModuleById(ModuleIds.Propagate), 'Propagate')
        templateModel.Class = reset(findModuleById(ModuleIds.Class), 'Class')
        templateModel.Recommend = reset(findModuleById(ModuleIds.Recommend), 'Recommend')
    }
    if (tmplType === TemplateTypes.TemplateC) {
        templateModel = {} as TemplateC
        templateModel.Propagate = reset(findModuleById(ModuleIds.Propagate), 'Propagate')
        templateModel.Live = reset(findModuleById(ModuleIds.Live), 'Live')
        templateModel.OnlineCourse = reset(findModuleById(ModuleIds.OnlineCourse), 'OnlineCourse')
        templateModel.SeriesCourse = reset(findModuleById(ModuleIds.SeriesCourse), 'SeriesCourse')
        templateModel.ImageText = reset(findModuleById(ModuleIds.ImageText), 'ImageText')
        templateModel.Appointment = reset(findModuleById(ModuleIds.Appointment), 'Appointment')
        templateModel.Popular = reset(findModuleById(ModuleIds.Popular), 'Popular')
        templateModel.Teachers = reset(findModuleById(ModuleIds.Teachers), 'Teachers')
        templateModel.Class = reset(findModuleById(ModuleIds.Class), 'Class')
        templateModel.Recommend = reset(findModuleById(ModuleIds.Recommend), 'Recommend')
    }
    if (tmplType === TemplateTypes.TemplateD) {
        templateModel = {} as TemplateD
        templateModel.Banner = reset(findModuleById(ModuleIds.Banner), 'Banner')
        templateModel.Classify = reset(findModuleById(ModuleIds.Classify), 'Classify')
        templateModel.Coupon = reset(findModuleById(ModuleIds.Coupon), 'Coupon')
        templateModel.Activity = reset(findModuleById(ModuleIds.Activity), 'Activity')
        templateModel.Live = reset(findModuleById(ModuleIds.Live), 'Live')
        templateModel.OnlineCourse = reset(findModuleById(ModuleIds.OnlineCourse), 'OnlineCourse')
        templateModel.SeriesCourse = reset(findModuleById(ModuleIds.SeriesCourse), 'SeriesCourse')
        templateModel.ImageText = reset(findModuleById(ModuleIds.ImageText), 'ImageText')
        templateModel.Appointment = reset(findModuleById(ModuleIds.Appointment), 'Appointment')
        templateModel.Miaosha = reset(findModuleById(ModuleIds.Miaosha), 'Miaosha')
        templateModel.Package = reset(findModuleById(ModuleIds.Package), 'Package')
        templateModel.Pintuan = reset(findModuleById(ModuleIds.Pintuan), 'Pintuan')
        templateModel.Yugou = reset(findModuleById(ModuleIds.Yugou), 'Yugou')
        templateModel.Propagate = reset(findModuleById(ModuleIds.Propagate), 'Propagate')
        templateModel.Popular = reset(findModuleById(ModuleIds.Popular), 'Popular')
        templateModel.Class = reset(findModuleById(ModuleIds.Class), 'Class')
        templateModel.Recommend = reset(findModuleById(ModuleIds.Recommend), 'Recommend')
    }

    // 主会场
    if (tmplType === TemplateTypes.TemplateFengQiang) {
        templateModel = {} as TemplateFengQiang
        templateModel.Miaosha = reset(findModuleById(ModuleIds.Miaosha), 'Miaosha')
        templateModel.Pintuan = reset(findModuleById(ModuleIds.Pintuan), 'Pintuan')
        templateModel.Maisong = reset(findModuleById(ModuleIds.Maisong), 'Maisong')
        templateModel.Coupon = reset(findModuleById(ModuleIds.Coupon), 'Coupon')
        templateModel.Yugou = reset(findModuleById(ModuleIds.Yugou), 'Yugou')
        templateModel.Fengqiang = reset(findModuleById(ModuleIds.Class), 'Fengqiang')
        templateModel.Recommend = reset(findModuleById(ModuleIds.Recommend), 'Recommend')
    }
    if (tmplType === TemplateTypes.TemplateBaoFa) {
        templateModel = {} as TemplateBaoFa
        templateModel.Coupon = reset(findModuleById(ModuleIds.Coupon), 'Coupon')
        templateModel.Maisong = reset(findModuleById(ModuleIds.Maisong), 'Maisong')
        templateModel.Miaosha = reset(findModuleById(ModuleIds.Miaosha), 'Miaosha')
        templateModel.Pintuan = reset(findModuleById(ModuleIds.Pintuan), 'Pintuan')
        templateModel.Fengqiang = reset(findModuleById(ModuleIds.Class), 'Fengqiang')
    }
    if (tmplType === TemplateTypes.TemplateFanChang) {
        templateModel = {} as TemplateFanChang
        templateModel.Maisong = reset(findModuleById(ModuleIds.Maisong), 'Maisong')
        templateModel.Miaosha = reset(findModuleById(ModuleIds.Miaosha), 'Miaosha')
        templateModel.Pintuan = reset(findModuleById(ModuleIds.Pintuan), 'Pintuan')
        templateModel.Fengqiang = reset(findModuleById(ModuleIds.Class), 'Fengqiang')
        templateModel.Recommend = reset(findModuleById(ModuleIds.Recommend), 'Recommend')
    }
    if (tmplType === TemplateTypes.TemplateSpring2019) {
        templateModel = {} as TemplateSpring2019
        templateModel.Propagate = reset(findModuleById(ModuleIds.Propagate), 'Propagate')
        templateModel.Coupon = reset(findModuleById(ModuleIds.Coupon), 'Coupon')
        templateModel.Chunyun = reset(findModuleById(ModuleIds.Chunyun), 'Chunyun')
        templateModel.Pintuan = reset(findModuleById(ModuleIds.Pintuan), 'Pintuan')
        templateModel.Yugou = reset(findModuleById(ModuleIds.Yugou), 'Yugou')
        templateModel.Fengqiang = reset(findModuleById(ModuleIds.Popular), 'Fengqiang')
    }
    if (tmplType === TemplateTypes.TemplateDragonGate) {
        templateModel = {} as TemplateDragonGate
        templateModel.Coupon = reset(findModuleById(ModuleIds.Coupon), 'Coupon')
        templateModel.Charity = reset(findModuleById(ModuleIds.Charity), 'Charity')
        templateModel.Activity = reset(findModuleById(ModuleIds.DragonGateActivity), 'Activity')
        templateModel.Miaosha = reset(findModuleById(ModuleIds.Miaosha), 'Miaosha')
        templateModel.Distribution = reset(findModuleById(ModuleIds.Distribution), 'Distribution')
        templateModel.Pintuan = reset(findModuleById(ModuleIds.Pintuan), 'Pintuan')
        templateModel.Yugou = reset(findModuleById(ModuleIds.Yugou), 'Yugou')
        templateModel.Package = reset(findModuleById(ModuleIds.Package), 'Package')
        templateModel.Recommend = reset(findModuleById(ModuleIds.Recommend), 'Recommend')
    }
    if (tmplType === TemplateTypes.TemplateDouble122020) {
        templateModel = {} as TemplateDouble122020
        templateModel.Coupon = reset(findModuleById(ModuleIds.Coupon), 'Coupon')
        templateModel.Miaosha = reset(findModuleById(ModuleIds.Miaosha), 'Miaosha')
        templateModel.Pintuan = reset(findModuleById(ModuleIds.Pintuan), 'Pintuan')
        templateModel.Yugou = reset(findModuleById(ModuleIds.Yugou), 'Yugou')
        templateModel.Package = reset(findModuleById(ModuleIds.Package), 'Package')
        templateModel.Popular = reset(findModuleById(ModuleIds.Popular), 'Popular')
    }
    if (tmplType === TemplateTypes.TemplateSpring2020) {
        templateModel = {} as TemplateSpring2020
        templateModel.Live = findModuleById(ModuleIds.Live)
        templateModel.RedPackage = reset(findModuleById(ModuleIds.RedPackage), 'RedPackage')
        templateModel.Coupon = reset(findModuleById(ModuleIds.Coupon), 'Coupon')
        templateModel.Miaosha = reset(findModuleById(ModuleIds.Miaosha), 'Miaosha')
        templateModel.Pintuan = reset(findModuleById(ModuleIds.Pintuan), 'Pintuan')
        templateModel.Yugou = reset(findModuleById(ModuleIds.Yugou), 'Yugou')
        templateModel.Package = reset(findModuleById(ModuleIds.Package), 'Package')
        templateModel.Popular = reset(findModuleById(ModuleIds.Popular), 'Popular')
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

    // 预约
    if ('Appointment' in moduleModels) {
        moduleModels.Appointment.values = moduleModels.Appointment.values.filter((item: TemplateModuleItem) => item.value)
    }

    // 品宣
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

    // 直播
    if (moduleModels.Live) {
        moduleModels.Live.values = []
        Reflect.deleteProperty(moduleModels.Live, 'nowCount')
        Reflect.deleteProperty(moduleModels.Live, 'futrueCount')
        Reflect.deleteProperty(moduleModels.Live, 'pastCount')
    }

    // 秒杀
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

    // 春耘模块
    if (moduleModels.Chunyun) {
        moduleModels.Chunyun.values = []
    }

    // 组合课模块
    if (moduleModels.Package && moduleModels.Package.values.length) {
        moduleModels.Package.values = moduleModels.Package.values.map(({ id }: { id: string }) => ({ value: id }))
    }

    // 分类
    if (moduleModels.Classify) {
        if (moduleModels.Classify.values.length) {
            for (const item of moduleModels.Classify.values) {
                Reflect.deleteProperty(item, 'selected')
            }
        }
    }

    // 龙门节主会场
    if (tmplType === TemplateTypes.TemplateDragonGate) {
        moduleModels.Charity.values = []
        moduleModels.Activity.values = []
    }
    return Object.values(moduleModels) || []
}
