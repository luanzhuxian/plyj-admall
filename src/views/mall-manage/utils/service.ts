// import moment from 'moment'
// import { isCreditNumber } from '../../../assets/ts/validate'
import {
    Template,
    TemplateB,
    TemplateC,
    TemplateD,
    TemplateFanChang,
    TemplateFengQiang,
    TemplateBaoFa,
    TemplateXinChun,
    TemplateDragonGate,
    TemplateModule
} from '../utils/types'

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
 * @return {object} 模板对象
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
    if (~['Popular', 'FengQiang'].indexOf(name)) {
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
    if (~['Live', 'Course', 'Series', 'ImageText'].indexOf(name)) {
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
    if (~['Coupon', 'PinTuan', 'YuGou', 'MiaoSha', 'Package', 'Distribution'].indexOf(name)) {
        modules.goodsSource = 2
    }
    if (name === 'MaiSong') {
        modules.otherValue = (modules.otherValue && modules.otherValue !== '') ? modules.otherValue : '12.12当日下单 享多重好礼'
    }
    if (name === 'MiaoSha') {
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
 * @param {number} tmplId 模块id
 * @return {object} 模板对象，包含多个模块
 */
export const rebuild = (tmplId: number, modules: TemplateModule[]): Template | object => {
    const findModuleById = findModule(modules)
    let templateModel

    // 首页
    if (tmplId === 3) {
        templateModel = {} as TemplateB
        templateModel.Banner = reset(findModuleById(1), 'Banner')
        templateModel.Live = reset(findModuleById(20), 'Live')
        templateModel.Course = reset(findModuleById(21), 'Course')
        templateModel.Series = reset(findModuleById(22), 'Series')
        templateModel.ImageText = reset(findModuleById(23), 'ImageText')
        templateModel.Popular = reset(findModuleById(2), 'Popular')
        templateModel.Appointment = reset(findModuleById(5), 'Appointment')
        templateModel.Propagate = reset(findModuleById(6), 'Propagate')
        templateModel.Class = reset(findModuleById(3), 'Class')
        templateModel.Recommend = reset(findModuleById(4), 'Recommend')
    }
    if (tmplId === 4) {
        templateModel = {} as TemplateB
        templateModel.Banner = reset(modules[0], 'Banner')
        templateModel.Adv = reset(modules[1], 'Adv')
        templateModel.Live = reset(findModuleById(20), 'Live')
        templateModel.Course = reset(findModuleById(21), 'Course')
        templateModel.Series = reset(findModuleById(22), 'Series')
        templateModel.ImageText = reset(findModuleById(23), 'ImageText')
        templateModel.Popular = reset(findModuleById(2), 'Popular')
        templateModel.Appointment = reset(findModuleById(5), 'Appointment')
        templateModel.Propagate = reset(findModuleById(6), 'Propagate')
        templateModel.Class = reset(findModuleById(3), 'Class')
        templateModel.Recommend = reset(findModuleById(4), 'Recommend')
    }
    if (tmplId === -1) {
        templateModel = {} as TemplateC
        templateModel.Propagate = reset(findModuleById(6), 'Propagate')
        templateModel.Live = reset(findModuleById(20), 'Live')
        templateModel.Course = reset(findModuleById(21), 'Course')
        templateModel.Series = reset(findModuleById(22), 'Series')
        templateModel.ImageText = reset(findModuleById(23), 'ImageText')
        templateModel.Appointment = reset(findModuleById(5), 'Appointment')
        templateModel.Popular = reset(findModuleById(2), 'Popular')
        templateModel.Teachers = reset(findModuleById(12), 'Teachers')
        templateModel.Class = reset(findModuleById(3), 'Class')
        templateModel.Recommend = reset(findModuleById(4), 'Recommend')
    }
    if (tmplId === 9) {
        templateModel = {} as TemplateD
        templateModel.Banner = reset(findModuleById(1), 'Banner')
        templateModel.Coupon = reset(findModuleById(9), 'Coupon')
        templateModel.Activity = reset(findModuleById(15), 'Activity')
        templateModel.Live = reset(findModuleById(20), 'Live')
        templateModel.Course = reset(findModuleById(21), 'Course')
        templateModel.Series = reset(findModuleById(22), 'Series')
        templateModel.ImageText = reset(findModuleById(23), 'ImageText')
        templateModel.Appointment = reset(findModuleById(5), 'Appointment')
        templateModel.MiaoSha = reset(findModuleById(10), 'MiaoSha')
        templateModel.Package = reset(findModuleById(16), 'Package')
        templateModel.PinTuan = reset(findModuleById(8), 'PinTuan')
        templateModel.YuGou = reset(findModuleById(11), 'YuGou')
        templateModel.Propagate = reset(findModuleById(6), 'Propagate')
        templateModel.Popular = reset(findModuleById(2), 'Popular')
        templateModel.Class = reset(findModuleById(3), 'Class')
        templateModel.Recommend = reset(findModuleById(4), 'Recommend')
    }

    // 主会场
    if (tmplId === 5) {
        templateModel = {} as TemplateFengQiang
        templateModel.MiaoSha = reset(modules[0], 'MiaoSha')
        templateModel.PinTuan = reset(modules[1], 'PinTuan')
        templateModel.MaiSong = reset(modules[2], 'MaiSong')
        templateModel.Coupon = reset(modules[3], 'Coupon')
        templateModel.YuGou = reset(modules[4], 'YuGou')
        templateModel.FengQiang = reset(modules[5], 'FengQiang')
        templateModel.Recommend = reset(modules[6], 'Recommend')
    }
    if (tmplId === 6) {
        templateModel = {} as TemplateBaoFa
        templateModel.Coupon = reset(modules[0], 'Coupon')
        templateModel.MaiSong = reset(modules[1], 'MaiSong')
        templateModel.MiaoSha = reset(modules[2], 'MiaoSha')
        templateModel.PinTuan = reset(modules[3], 'PinTuan')
        templateModel.FengQiang = reset(modules[4], 'FengQiang')
    }
    if (tmplId === 7) {
        templateModel = {} as TemplateFanChang
        templateModel.MaiSong = reset(modules[0], 'MaiSong')
        templateModel.MiaoSha = reset(modules[1], 'MiaoSha')
        templateModel.PinTuan = reset(modules[2], 'PinTuan')
        templateModel.FengQiang = reset(modules[3], 'FengQiang')
        templateModel.Recommend = reset(modules[4], 'Recommend')
    }
    if (tmplId === 8) {
        templateModel = {} as TemplateXinChun
        templateModel.Propagate = reset(modules[0], 'Propagate')
        templateModel.Coupon = reset(modules[1], 'Coupon')
        templateModel.ChunYun = reset(modules[2], 'ChunYun')
        templateModel.PinTuan = reset(modules[3], 'PinTuan')
        templateModel.YuGou = reset(modules[4], 'YuGou')
        templateModel.FengQiang = reset(modules[5], 'FengQiang')
    }
    if (tmplId === 10) {
        templateModel = {} as TemplateDragonGate
        templateModel.Coupon = reset(findModuleById(9), 'Coupon')
        templateModel.Charity = reset(findModuleById(17), 'Charity')
        templateModel.Activity = reset(findModuleById(19), 'Activity')
        templateModel.MiaoSha = reset(findModuleById(10), 'MiaoSha')
        templateModel.Distribution = reset(findModuleById(18), 'Distribution')
        templateModel.PinTuan = reset(findModuleById(8), 'PinTuan')
        templateModel.YuGou = reset(findModuleById(11), 'YuGou')
        templateModel.Package = reset(findModuleById(16), 'Package')
        templateModel.Recommend = reset(findModuleById(4), 'Recommend')
    }
    return templateModel || {}
}
