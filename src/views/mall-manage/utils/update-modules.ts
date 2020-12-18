import { getSpringPloughingDetail } from '../../../apis/marketing-manage/new-year/spring-ploughing'
import { TemplateModule } from './types'
import {
    TemplateTypes,
    ModuleTypes,
    ModalType,
    ProductType
} from './map'

/**
 * 向 banner轮播 / 广告 模块添加数据
 * @param {object} module 单个模块
 * @param {array} selectedList 添加的数据
 * @param {number} type 添加的数据类型 1 分类 2 商品 3 课程
 * @param {number} index 添加到 values 列表的第几位
 * @return {object} module
 */
export const updateBanner = (module: TemplateModule, selectedList: any[], type: number, index: number) => {
    const selected = selectedList[0]
    if (!selected || !selected.id) return

    module.values[index].type = type
    module.values[index].valueName = type === ProductType.Course
        ? selected.courseName : type === ProductType.Category
            ? selected.categoryName : selected.productName
    module.values[index].value = selected.id
    return module
}

/**
 * 向商品模块添加某个分类下的商品
 * @param {object} module 单个模块
 * @param {array} selectedList 添加的数据
 * @return {object} module
 */
export const updateCatagoryProduct = (module: TemplateModule, selectedList: any[]) => {
    const selected = selectedList[0]
    if (!selected || !selected.id) return

    module.otherValue = selected.categoryName
    module.otherInfo = selected.id
    return module
}

/**
 * 向商品模块添加商品
 * @param {object} module 单个模块
 * @param {array} selectedList 添加的数据
 * @param {number} type 添加的数据类型 1 分类 2 商品 3 课程
 * @return {object} module
 */
export const updateProduct = (module: TemplateModule, selectedList: any[], type: number) => {
    if (!selectedList.length) return
    if (!module.productValues) return

    for (const prod of selectedList) {
        const obj = {
            id: '',
            type,
            image: prod.productMainImage,
            name: prod.productName,
            value: prod.id,
            valueName: '',
            goodsInfo: prod
        }
        obj.goodsInfo.productSkuModels = prod.skuEntityList
        obj.goodsInfo.labelModels = prod.labelList.map((label: string) => ({ labelName: label }))
        module.productValues.push(obj)
    }

    const max = type === ModalType.ProductModal ? 9 : 12
    if (module.productValues.length > max) {
        module.productValues.length = max
        module.values = module.productValues
    }
    return module
}

/**
 * 向组合课模块添加数据
 * @param {object} module 单个模块
 * @param {array} selectedList 添加的数据
 * @return {object} module
 */
export const updatePackage = async (module: TemplateModule, selectedList: any[]) => {
    if (!selectedList.length) return

    const result = await Promise.all(selectedList
        .map(item => getSpringPloughingDetail(item.id))
        .map((p: Promise<any>) => p.catch(e => {
            console.error(e)
            return { result: null }
        })))

    module.values = result
        // .filter(({ data }) => data)
        .map(({ result }) => result)
        .slice(0, 8)
    return module
}

/**
 * 向分销模块添加数据
 * @param {object} module 单个模块
 * @param {array} selectedList 添加的数据
 * @return {object} module
 */
export const updateDistribution = (module: TemplateModule, selectedList: any[]) => {
    if (!selectedList.length) return

    for (const prod of selectedList) {
        module.values.push({
            id: '',
            type: '',
            image: prod.productImage || '',
            name: prod.productName || '',
            value: prod.productId,
            valueName: '',
            goodsInfo: {
                ...prod,
                productMainImage: prod.productImg || ''
            }
        })
    }
    if (module.values.length > 6) {
        module.values.length = 6
    }
    return module
}

/**
 * 向线上课程模块添加数据
 * @param {object} module 单个模块
 * @param {array} selectedList 添加的数据
 * @return {object} module
 */
export const updateOnlineCourse = (module: TemplateModule, selectedList: any[]) => {
    if (!selectedList.length) return

    for (const item of selectedList) {
        module.values.push({
            id: '',
            type: '',
            image: module.moduleType === ModuleTypes.ImageText ? item.graphicMainImg : item.courseImg,
            name: module.moduleType === ModuleTypes.ImageText ? item.graphicName : item.courseName,
            value: item.id,
            valueName: '',
            goodsInfo: item
        })
    }
    if (module.values.length > 12) {
        module.values.length = 12
    }
    return module
}

/**
 * 向优惠券模块添加数据
 * @param {object} module 单个模块
 * @param {array} selectedList 添加的数据
 * @param {number} tmplType 模板id
 * @return {object} module
 */
export const updateCoupon = (module: TemplateModule, selectedList: any[], tmplType: number) => {
    if (!selectedList.length) return

    selectedList = selectedList.map(prod => ({
        id: '',
        type: '',
        image: prod.productMainImage || '',
        name: prod.productName || prod.name || '',
        value: prod.id,
        valueName: '',
        goodsInfo: prod
    }))

    const max = module.moduleType === ModuleTypes.RedPackage
        ? 10
        : tmplType === TemplateTypes.TemplateDragonGate
            ? 2
            : 3
    module.values = selectedList
    if (module.values.length > max) {
        module.values.length = max
    }
    return module
}

/**
 * 向拼团预购模块添加数据
 * @param {object} module 单个模块
 * @param {array} selectedList 添加的数据
 * @return {object} module
 */
export const updatePintuanYugou = (module: TemplateModule, selectedList: any[]) => {
    if (!selectedList.length) return

    for (const prod of selectedList) {
        module.values.push({
            id: '',
            type: '',
            image: prod.productMainImage || '',
            name: prod.productName || '',
            value: prod.id,
            valueName: '',
            goodsInfo: {
                productMainImage: prod.productMainImage,
                productName: prod.productName,
                activityInfo: {
                    ...prod,
                    ...(module.moduleType === ModuleTypes.Pintuan ? { activityPrice: prod.price } : null),
                    activityStock: prod.stock
                },
                ...(module.moduleType === ModuleTypes.Pintuan ? { pageviews: prod.pageviews } : null)
            }
        })
    }

    const max = 6
    if (module.values.length > max) {
        module.values.length = max
    }
    return module
}

/**
 * 向秒杀模块添加数据
 * @param {object} module 单个模块
 * @param {array} selectedList 添加的数据
 * @param {number} tmplType 模板id
 * @param {number} index 添加到 values 列表的第几位
 * @return {object} module
 */
export const updateMiaosha = (module: TemplateModule, selectedList: any[], tmplType: number, index: number) => {
    if (!selectedList.length) return

    if (tmplType === TemplateTypes.TemplateBaoFa) {
        if (!module.values[index] || !module.values[index].goodsInfo) return

        for (const prod of selectedList) {
            for (const sku of prod.skus) {
                sku.originalPrice = sku.originPrice
            }
            if (module.values[index].goodsInfo instanceof Array) {
                (module.values[index].goodsInfo as any[]).push({
                    productMainImage: prod.productMainImage,
                    productName: prod.productName,
                    productSkuModels: prod.skus,
                    pageviews: prod.pageviews,
                    activityInfo: {
                        ...prod,
                        activityPrice: prod.price,
                        activityStock: prod.stock
                    }
                })
            }
        }
    } else {
        for (const prod of selectedList) {
            for (const sku of prod.skus) {
                sku.originalPrice = sku.originPrice
            }
            module.values.push({
                id: '',
                type: '',
                image: prod.productMainImage || '',
                name: prod.productName || '',
                value: prod.id,
                valueName: '',
                goodsInfo: {
                    productMainImage: prod.productMainImage,
                    productName: prod.productName,
                    productSkuModels: prod.skus,
                    pageviews: prod.pageviews,
                    activityInfo: {
                        ...prod,
                        activityPrice: prod.price,
                        activityStock: prod.stock
                    }
                }
            })
        }
        if (module.values.length > 6) {
            module.values.length = 6
        }
    }
    return module
}
