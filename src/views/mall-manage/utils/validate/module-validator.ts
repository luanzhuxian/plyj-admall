/* eslint-disable no-useless-constructor */
/* eslint-disable require-await */

import { Rule, Validator } from './validator'
import { isEmpty, isNumber } from '../helper'
import { TemplateModuleItem, TemplateModule } from '../types'
import { Range } from './types'

class ErrorMsg {
    constructor (errMsg: string, errModule: string) {
        Object.assign(this, {
            errMsg,
            errModule,
            pass: false
        })
    }
}

// 非空数组
class ListValidator extends Validator {
    values: Rule[]
    constructor (moduleName: string, { min, max }: Range) {
        super()
        this.values = [new Rule('isLength', `${ moduleName }模块不能为空，请至少添加一项`, { min, max })]
    }
}

// banner校验
class BannerValidator extends Validator {
    image: Rule[]
    name: Rule[]
    constructor () {
        super()
        this.image = [new Rule('required', '请上传轮播图片')]
        this.name = [
            new Rule('isOptional'),
            new Rule('isLength', '轮播图片的标题最多为10个字', { min: 0, max: 10 })
        ]
    }
}

// 广告校验
class AdvValidator extends Validator {
    image: Rule[]
    value: Rule[]
    constructor () {
        super()
        this.image = [new Rule('required', '请上传活动模块图片')]
        this.value = [new Rule('required', '请选择活动模块的跳转路径')]
    }
}

class BannerListValidator<T extends Validator> extends Validator {
    moduleName: string
    validator: T
    constructor (moduleName: string, ValidatorConstructor: { new(): T }) {
        super()
        this.moduleName = moduleName
        this.validator = new ValidatorConstructor()
    }

    customValidateCheckIsEmpty (list: TemplateModuleItem[]) {
        if (isEmpty(list)) {
            throw new Error(`${ this.moduleName }不能为空，请至少添加一项`)
        }
    }

    // TODO:
    // @ts-ignore
    async validate (data: TemplateModuleItem[]) {
        const list = data.filter(item => (item.image || item.name || item.value))

        try {
            for (const item of list) {
                await this.validator.validate(item)
            }
            this.customValidateCheckIsEmpty(list)
            // super.validate(list)
            return list
        } catch (error) {
            throw error
        }
    }
}

// 模块名称校验
class ModuleNameValidator extends Validator {
    moduleName: Rule[]
    constructor (moduleName: string, option: { minLength: number; maxLength: number }) {
        const minLength = option?.minLength
        const maxLength = option?.maxLength
        super()
        this.moduleName = [
            new Rule('required', `请填写${ moduleName }模块标题`)
        ]
        if (maxLength) {
            this.moduleName.push(new Rule('isLength', `${ moduleName }模块的标题最多为${ maxLength }个字`, { min: minLength, max: maxLength }))
        }
    }
}

// 商品、课程模块校验
class ProductListValidator extends ModuleNameValidator {
    productValues: Rule[]
    constructor (moduleName: string, max: number, { minLength, maxLength }: { minLength: number; maxLength: number }) {
        super(moduleName, { minLength, maxLength })
        this.productValues = [
            new Rule('required', `${ moduleName }至少添加一个${ max === 12 ? '课程' : '商品' }`),
            new Rule('isLength', `${ moduleName }最多添加${ max }个${ max === 12 ? '课程' : '商品' }`, { min: 1, max })
        ]
    }
}

// 商品分类模块校验
class CategoryListValidator extends ModuleNameValidator {
    otherValue: Rule[]
    otherInfo: Rule[]
    number: Rule[]
    constructor (moduleName: string, max: number, { minLength, maxLength }: { minLength: number; maxLength: number }) {
        super(moduleName, { minLength, maxLength })
        this.otherValue = [new Rule('required', `请选择${ moduleName }商品分组`)]
        this.otherInfo = [new Rule('required', `${ moduleName }商品分组没有跳转路径`)]
        this.number = [new Rule('max', `${ moduleName }显示个数最小为1，最大为${ max }`, max)]
    }
}

// 名师专栏模块校验
class TeacherValidator extends Validator {
    image: Rule[]
    name: Rule[]
    value: Rule[]
    valueName: Rule[]
    constructor (moduleName: string) {
        super()
        this.image = [new Rule('required', `请上传${ moduleName }图片`)]
        this.name = [
            new Rule('required', `请填写${ moduleName }姓名`),
            new Rule('isLength', `${ moduleName }姓名最多15个字`, { min: 1, max: 15 })
        ]
        this.value = [
            new Rule('required', `请填写${ moduleName }主讲课程`),
            new Rule('isLength', `${ moduleName }主讲课程最多15个字`, { min: 1, max: 15 })
        ]
        this.valueName = [
            new Rule('required', `请填写${ moduleName }简介`),
            new Rule('isLength', `${ moduleName }简介最多50个字`, { min: 1, max: 50 })
        ]
    }
}

class TeacherListValidator extends ModuleNameValidator {
    validator: TeacherValidator
    constructor (moduleName: string) {
        super(moduleName, { minLength: 1, maxLength: 4 })
        this.validator = new TeacherValidator(moduleName)
        // this.values = [new Rule('isLength', `${moduleName}模块，最少添加3名老师，最多添加15名老师`, { min: 3, max: 15 })]
    }

    async customValidateList (data: TemplateModule) {
        if (!data || !data.values) throw new Error('数据结构错误')
        let list = data.values
        list = list.filter((item: TemplateModuleItem) => (item.image || item.name || item.value || item.valueName))

        try {
            for (const item of list) {
                await this.validator.validate(item)
            }
            if (list.length < 3 || list.length > 10) {
                throw new Error(`${ data.moduleName }模块，最少添加3名老师，最多添加10名老师`)
            }
            return list
        } catch (error) {
            throw error
        }
    }
}

// 精品推荐校验
class RecommendValidator extends ModuleNameValidator {
    sortType: Rule[]
    number: Rule[]
    constructor (moduleName: string) {
        super(moduleName, { minLength: 1, maxLength: 4 })
        this.sortType = [new Rule('required', `请选择${ moduleName }排序方式`)]
        this.number = [new Rule('max', `${ moduleName }展示数量最小为1，最大为30`, 30)]
    }
}

// 买送模块校验
class MaisongValidator extends Validator {
    image: Rule[]
    name: Rule[]

    constructor () {
        super()
        this.image = [new Rule('required', '请上传买送活动图片')]
        this.name = [
            new Rule('required', '请填写买送活动条件'),
            new Rule('isLength', '买送活动条件最多10个字', { min: 1, max: 10 })
        ]
    }
}

class MaisongListValidator extends Validator {
    validator: MaisongValidator
    otherValue: Rule[]
    constructor () {
        super()
        this.validator = new MaisongValidator()
        this.otherValue = [
            new Rule('required', '请填写买送活动模块副标题'),
            new Rule('isLength', '买送活动模块的副标题最多为20个字', { min: 1, max: 20 })
        ]
    }

    async customValidateList (data: TemplateModule) {
        if (!data || !data.values) throw new Error('数据结构错误')
        let list = data.values
        list = list.filter(item => (item.image || item.name))

        try {
            for (const item of list) {
                await this.validator.validate(item)
            }
            return list
        } catch (error) {
            throw error
        }
    }
}

// 秒杀模块校验
class MiaoshaValidator extends Validator {
    range: Rule[]
    goodsInfo: Rule[]
    constructor () {
        super()
        this.range = [new Rule('required', '秒杀模块每个场次的时间和商品必须同时添加')]
        this.goodsInfo = [
            new Rule('required', '秒杀模块每个场次的时间和商品必须同时添加'),
            new Rule('isLength', '秒杀模块每个场次最多添加5个商品', { min: 1, max: 5 })
        ]
    }
}

class MiaoshaListValidator extends Validator {
    validator: MiaoshaValidator
    constructor () {
        super()
        this.validator = new MiaoshaValidator()
    }

    // TODO:
    // @ts-ignore
    async validate (data: TemplateModuleItem[]) {
        const list = data.filter(item => ((item.range && item.range.length) || (item.goodsInfo && item.goodsInfo.length)))

        try {
            for (const item of list) {
                await this.validator.validate(item)
            }
            if (list.length > 3) {
                throw new Error('秒杀模块最多添加3个场次')
            }
            return list
        } catch (error) {
            throw error
        }
    }
}

// 年年翻活动页
class ActivityListValidator extends Validator {
    constructor () {
        super()
    }

    async customValidateList ({ values = [] }: TemplateModule) {
        values = values.filter(item => item.value)
        return values
    }
}

class ClassifyValidator extends Validator {
    image: Rule[]
    name: Rule[]
    value: Rule[]

    constructor () {
        super()
        this.image = [new Rule('required', '请上传分类图片')]
        this.name = [new Rule('required', '请选择分类')]
        this.value = [new Rule('required', '请选择分类')]
    }
}

class ClassifyListValidator extends Validator {
    validator: ClassifyValidator
    constructor () {
        super()
        this.validator = new ClassifyValidator()
    }

    async customValidateList (data: TemplateModule) {
        if (!data || !data.values) throw new Error('数据结构错误')
        if (!data.number || !isNumber(data.number) || !~[3, 4].indexOf(data.number)) {
            throw new Error('请选择分类导航的分类个数')
        }
        if (data.values.length !== data.number) {
            throw new Error(`请添加${ data.number }个分类`)
        }
        try {
            for (const item of data.values) {
                await this.validator.validate(item)
            }
        } catch (error) {
            throw error
        }
    }
}

export {
    ErrorMsg,
    ListValidator,
    BannerValidator,
    AdvValidator,
    BannerListValidator,
    ProductListValidator,
    CategoryListValidator,
    TeacherValidator,
    TeacherListValidator,
    RecommendValidator,
    MaisongListValidator,
    MiaoshaListValidator,
    ActivityListValidator,
    ClassifyListValidator
}
