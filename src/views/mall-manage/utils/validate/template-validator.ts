// TODO:
// @ts-nocheck
/* eslint-disable no-useless-constructor */
/* eslint-disable require-await */

// 模板校验

import {
    ErrorMsg,
    ListValidator,
    BannerValidator,
    AdvValidator,
    BannerListValidator,
    ProductListValidator,
    CategoryListValidator,
    TeacherListValidator,
    RecommendValidator,
    MaisongListValidator,
    MiaoshaListValidator,
    ActivityListValidator,
    ClassifyListValidator
} from './module-validator'

import {
    TemplateB,
    TemplateC,
    TemplateD,
    TemplateFanChang,
    TemplateFengQiang,
    TemplateBaoFa,
    TemplateSpring2020,
    TemplateDragonGate,
    TemplateDouble122020
} from '../types'

class BaseValidator {
    // 商品、课程模块
    async checkProduct (moduleName: string, { minLength, maxLength } = {}) {
        const { errList, moduleModels } = this
        const module = moduleModels[moduleName]

        try {
            if (module.showStatue !== 1) return

            if (module.goodsSource === 1) {
                // 分类
                const max = module.moduleType === 3 ? 12 : 9
                await new CategoryListValidator(module.moduleName, max, { minLength, maxLength }).validate(module)
            } else if (module.goodsSource === 2) {
                // 商品
                await new ProductListValidator(module.moduleName, 9, { minLength, maxLength }).validate(module)
            } else if (module.goodsSource === 3) {
                // 课程
                await new ProductListValidator(module.moduleName, 12, { minLength, maxLength }).validate(module)
            }
        } catch (error) {
            errList.push(new ErrorMsg(error.message || error, moduleName))
        }
    }

    // 精品推荐模块
    async checkRecommend () {
        const { errList, moduleModels } = this

        try {
            await new RecommendValidator(moduleModels.Recommend.moduleName).validate(moduleModels.Recommend)
        } catch (error) {
            errList.push(new ErrorMsg(error.message || error, 'Recommend'))
        }
    }
}

// 首页
class HomeValidator <T extends TemplateB | TemplateC | TemplateD> extends BaseValidator {
    errList: ErrorMsg[]
    tmplType: number
    moduleModels: T

    constructor (tmplType: number, moduleModels: T) {
        super()
        this.errList = []
        this.tmplType = tmplType
        this.moduleModels = moduleModels
    }

    // Banner
    async checkBanner () {
        const { errList, moduleModels } = this
        // const moduleModels = this.moduleModels

        try {
            if ('Banner' in moduleModels) {
                moduleModels.Banner.values = await new BannerListValidator('Banner', BannerValidator).validate(moduleModels.Banner.values)
            }
        } catch (error) {
            errList.push(new ErrorMsg(error.message || error, 'Banner'))
        }
    }

    // 活动模块
    async checkAdv () {
        const { errList, moduleModels } = this

        try {
            if (moduleModels.Adv.showStatue !== 1) return

            moduleModels.Adv.values = await new BannerListValidator('活动模块', AdvValidator).validate(moduleModels.Adv.values)
        } catch (error) {
            errList.push(new ErrorMsg(error.message || error, 'Adv'))
        }
    }

    // 品宣模块
    checkPropagate () {
        const { errList, moduleModels } = this

        if (!moduleModels.Propagate.otherValue) {
            errList.push(new ErrorMsg('请添加品宣图片', 'Propagate'))
        }
    }

    // 名师专栏
    async checkTeachers () {
        const { errList, moduleModels } = this

        try {
            if (moduleModels.Teachers.showStatue !== 1) return

            const { value } = await new TeacherListValidator(moduleModels.Teachers.moduleName).validate(moduleModels.Teachers)
            if (value) {
                moduleModels.Teachers.values = value
            }
        } catch (error) {
            errList.push(new ErrorMsg(error.message || error, 'Teachers'))
        }
    }

    // 年年翻活动模块
    async checkActivity () {
        const { errList, moduleModels } = this

        try {
            const { value } = await new ActivityListValidator().validate(moduleModels.Activity)
            moduleModels.Activity.values = value
        } catch (error) {
            errList.push(new ErrorMsg(error.message || error, 'Activity'))
        }
    }

    async checkList (moduleName: string, { min, max }: { min: number; max: number }) {
        const { errList, moduleModels } = this

        try {
            if (moduleModels[moduleName].showStatue !== 1) return

            await new ListValidator(moduleModels[moduleName].moduleName, { min, max }).validate(moduleModels[moduleName])
        } catch (error) {
            errList.push(new ErrorMsg(error.message || error, moduleName))
        }
    }

    async checkClassify () {
        const { errList, moduleModels } = this

        try {
            if (!moduleModels.Classify || moduleModels.Classify.showStatue !== 1) return

            await new ClassifyListValidator().validate(moduleModels.Classify)
        } catch (error) {
            errList.push(new ErrorMsg(error.message || error, 'Classify'))
        }
    }
}

// 主会场
class ActivityValidator <T extends TemplateFanChang | TemplateFengQiang | TemplateBaoFa | TemplateSpring2020 | TemplateDragonGate | TemplateDouble122020> extends BaseValidator {
    errList: ErrorMsg[]
    tmplType: number
    moduleModels: T

    constructor (tmplType: number, moduleModels: T) {
        super()
        this.errList = []
        this.tmplType = tmplType
        this.moduleModels = moduleModels
    }

    // 买送模块
    async checkMaisong () {
        const { errList, moduleModels } = this

        try {
            const { value } = await new MaisongListValidator().validate(moduleModels.Maisong)
            moduleModels.Maisong.values = value
        } catch (error) {
            errList.push(new ErrorMsg(error.message || error, 'Maisong'))
        }
    }

    // 疯抢模块
    async checkFengqiang () {
        const { errList, moduleModels } = this

        try {
            // 分类
            if (moduleModels.Fengqiang.goodsSource === 1) {
                const max = 12
                await new CategoryListValidator(moduleModels.Fengqiang.moduleName, max).validate(moduleModels.Fengqiang)
            }
        } catch (error) {
            errList.push(new ErrorMsg(error.message || error, 'Fengqiang'))
        }
    }

    // 秒杀模块
    async checkMiaosha () {
        const { errList, moduleModels } = this

        try {
            moduleModels.Miaosha.values = await new MiaoshaListValidator().validate(moduleModels.Miaosha.values)
        } catch (error) {
            errList.push(new ErrorMsg(error.message || error, 'Miaosha'))
        }
    }

    async checkList (moduleName: string, { min, max }: { min: number; max: number }) {
        const { errList, moduleModels } = this

        try {
            if (moduleModels[moduleName].showStatue !== 1) return

            await new ListValidator(moduleModels[moduleName].moduleName, { min, max }).validate(moduleModels[moduleName])
        } catch (error) {
            errList.push(new ErrorMsg(error.message || error, moduleName))
        }
    }
}

// 基础首页模板
class TemplateBValidator extends HomeValidator<TemplateB> {
    constructor (tmplType: number, moduleModels: TemplateB) {
        super(tmplType, moduleModels)
    }

    async validate () {
        await this.checkBanner()
        if (this.tmplType === 4) {
            await this.checkAdv()
        }
        await this.checkProduct('Popular', { minLength: 1, maxLength: 4 })
        await this.checkProduct('Class', { minLength: 1, maxLength: 4 })
        await this.checkRecommend()

        if (this.errList.length) {
            return this.errList[0]
        }
        return {
            pass: true
        }
    }
}

// 新春首页模板
class TemplateCValidator extends HomeValidator<TemplateC> {
    constructor (tmplType: number, moduleModels: TemplateC) {
        super(tmplType, moduleModels)
    }

    async validate () {
        await this.checkPropagate()
        await this.checkProduct('Popular', { minLength: 1, maxLength: 4 })
        await this.checkTeachers()
        await this.checkProduct('Class', { minLength: 1, maxLength: 4 })
        await this.checkRecommend()

        if (this.errList.length) {
            return this.errList[0]
        }
        return {
            pass: true
        }
    }
}

// 活动首页模板
class TemplateDValidator extends HomeValidator<TemplateD> {
    constructor (tmplType: number, moduleModels: TemplateD) {
        super(tmplType, moduleModels)
    }

    async validate () {
        await this.checkBanner()
        await this.checkClassify()
        await this.checkActivity()
        await this.checkList('Miaosha', { min: 1, max: 6 })
        await this.checkList('Package', { min: 1, max: 8 })
        await this.checkList('Pintuan', { min: 1, max: 6 })
        await this.checkList('Yugou', { min: 1, max: 6 })
        await this.checkProduct('Popular', { minLength: 1, maxLength: 4 })
        await this.checkProduct('Class', { minLength: 1, maxLength: 4 })
        await this.checkRecommend()

        if (this.errList.length) {
            return this.errList[0]
        }
        return {
            pass: true
        }
    }
}

// 双十二主会场疯抢、返场模板
class TemplateFengqiangValidator extends ActivityValidator<TemplateFengQiang> {
    constructor (tmplType: number, moduleModels: TemplateFengQiang) {
        super(tmplType, moduleModels)
    }

    async validate () {
        await this.checkMaisong()
        await this.checkFengqiang()
        await this.checkRecommend()

        if (this.errList.length) {
            return this.errList[0]
        }
        return {
            pass: true
        }
    }
}

// 双十二主会场爆发模板
class TemplateBaofaValidator extends ActivityValidator<TemplateBaoFa> {
    constructor (tmplType: number, moduleModels: TemplateBaoFa) {
        super(tmplType, moduleModels)
    }

    async validate () {
        await this.checkMaisong()
        await this.checkMiaosha()
        await this.checkFengqiang()

        if (this.errList.length) {
            return this.errList[0]
        }
        return {
            pass: true
        }
    }
}

// 新春主会场模板
class TemplateSpring2020Validator extends ActivityValidator<TemplateSpring2020> {
    constructor (tmplType: number, moduleModels: TemplateSpring2020) {
        super(tmplType, moduleModels)
    }

    async validate () {
        await this.checkFengqiang()

        if (this.errList.length) {
            return this.errList[0]
        }
        return {
            pass: true
        }
    }
}

// 龙门节主会场模板
class TemplateDragonGateValidator extends ActivityValidator<TemplateDragonGate> {
    constructor (tmplType: number, moduleModels: TemplateDragonGate) {
        super(tmplType, moduleModels)
    }

    async validate () {
        await this.checkList('Miaosha', { min: 1, max: 6 })
        await this.checkList('Distribution', { min: 1, max: 6 })
        await this.checkList('Pintuan', { min: 1, max: 6 })
        await this.checkList('Yugou', { min: 1, max: 6 })
        await this.checkList('Package', { min: 1, max: 6 })
        await this.checkRecommend()

        if (this.errList.length) {
            return this.errList[0]
        }
        return {
            pass: true
        }
    }
}

// 双12
class TemplateDouble122020Validator extends ActivityValidator<TemplateDouble122020> {
    constructor (tmplType: number, moduleModels: TemplateDouble122020) {
        super(tmplType, moduleModels)
    }

    async validate () {
        await this.checkList('Miaosha', { min: 1, max: 6 })
        await this.checkList('Pintuan', { min: 1, max: 6 })
        await this.checkList('Yugou', { min: 1, max: 6 })
        await this.checkList('Package', { min: 1, max: 6 })
        await this.checkProduct('Popular')

        if (this.errList.length) {
            return this.errList[0]
        }
        return {
            pass: true
        }
    }
}

export {
    TemplateBValidator,
    TemplateCValidator,
    TemplateDValidator,
    TemplateFengqiangValidator,
    TemplateBaofaValidator,
    TemplateSpring2020Validator,
    TemplateDragonGateValidator,
    TemplateDouble122020Validator
}
