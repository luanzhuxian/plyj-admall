import { TemplateTypes } from './types'

// 各个模板 id 对应模板名
export const tagMap: DynamicObject = {
    '-1': 'template-c',
    3: 'template-b',
    4: 'template-b',
    5: 'template-fengqiang',
    6: 'template-baofa',
    7: 'template-fanchang',
    8: 'template-xinchun',
    9: 'template-d',
    10: 'template-dragon-gate',
    findTemplateTagById (id: string) {
        return this[id]
    }
}

export const productTypeMap = {
    VIRTUAL_GOODS: '虚拟商品',
    PHYSICAL_GOODS: '虚拟商品',
    FORMAL_CLASS: '正式课',
    EXPERIENCE_CLASS: '体验课'
}

export const productTypeMap1 = {
    PHYSICAL_GOODS: 2,
    VIRTUAL_GOODS: 2,
    FORMAL_CLASS: 3,
    EXPERIENCE_CLASS: 3
}

export const productTypeMap2 = {
    PHYSICAL_GOODS: '购买',
    VIRTUAL_GOODS: '购买',
    FORMAL_CLASS: '学习',
    EXPERIENCE_CLASS: '报名'
}

// 弹窗标题
export const modalTitleMap: DynamicObject = {
    1: '商品分类',
    2: '商品/课程',
    3: '商品/课程',
    4: '商品及分类',
    5: '知识课程',
    8: '团购商品',
    9: '优惠券',
    10: '秒杀商品',
    11: '预购商品',
    16: '组合课程',
    18: '全民来分销'
}

// 各个皮肤对应的类名
export const skinClassNameMap = {
    1: 'skinXmas',
    2: 'skinYuanDan',
    3: 'skinNewYear',
    4: 'skinXiaoNian',
    5: 'skinYuanXiao',
    6: 'skinWomenDay',
    7: 'skinNianNianFan',
    8: 'skinEarthDay',
    9: 'skinLabourDay',
    10: 'skinMothersDay',
    11: 'skinChildrenDay',
    12: 'skinFathersDay',
    13: 'skinDragonBoat',
    has (id: number | string) {
        return Reflect.has(this, id)
    }
}

// 各个皮肤对应的底部菜单图片
export const navBarMap: DynamicObject = {
    0: 'https://mallcdn.youpenglai.com/static/admall/mall-management/basic/bottom-new.png',
    1: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/4bacb47a-2cbb-42fd-a763-2c765023477f.png',
    2: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/280bceb3-058b-4d21-9b58-2885a2632983.png',
    3: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/9415d70d-c203-4728-aaaf-80c34464ad93.png',
    4: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/ca90d197-ade7-437d-8e0a-cd3ff4892b60.png',
    5: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/19ed3f84-b136-4317-9089-ffb71bcdf3f3.png',
    6: 'https://mallcdn.youpenglai.com/static/admall/skin/women-day/bottom.png',
    7: 'https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/bottom.jpg',
    8: 'https://mallcdn.youpenglai.com/static/admall/skin/earth-day/bottom.jpg',
    9: 'https://mallcdn.youpenglai.com/static/admall/skin/labour-day/bottom.jpg',
    10: 'https://mallcdn.youpenglai.com/static/admall/skin/mothers-day/bottom.jpg',
    11: 'https://mallcdn.youpenglai.com/static/admall/skin/children-day/bottom.jpg',
    12: 'https://mallcdn.youpenglai.com/static/admall/skin/fathers-day/bottom.jpg',
    13: 'https://mallcdn.youpenglai.com/static/admall/skin/dragon-boat/bottom.jpg',
    99: 'https://mallcdn.youpenglai.com/static/admall/skin/cmapagin/5726fab5-88bb-40c4-9576-40f496545133.png',
    get (id: number) {
        return Reflect.has(this, id) ? this[id] : this[0]
    }
}

// 各个模块装修时对应的 editor
export const editorMap: DynamicObject = {
    Banner: 'Banner',
    Adv: 'Adv',
    Popular: 'Module',
    Class: 'Module',
    Recommend: 'Sort',
    Appointment: 'Appointment',
    Propagate: 'Propagate',
    Teachers: 'Form',
    Coupon: 'Coupon',
    MaiSong: 'Form',
    Miaosha: 'Miaosha',
    Pintuan: 'Module',
    Yugou: 'Module',
    Fengqiang: 'Module',
    Activity: 'Adv',
    Package: 'Module',
    Distribution: 'Module',
    Live: 'Video',
    OnlineCourse: 'Video',
    SeriesCourse: 'Video',
    ImageText: 'Video',
    getEditorByModule ({ tmplType, moduleName }: { tmplType: number; moduleName: string }) {
        if (moduleName === 'Miaosha') {
            return (tmplType === TemplateTypes.TemplateBaoFa) ? 'Miaosha' : 'Module'
        }
        return this[moduleName]
    }
}

// 各个模块对应的类名
export const moduleClassNameMap = {
    Banner: '.module-banner',
    Adv: '.module-adv',
    Popular: '.module-popular',
    Class: '.module-class',
    Recommend: '.module-recommend',
    Propagate: '.module-propagate',
    Teachers: '.module-teachers',
    Maisong: '.module-maisong',
    Miaosha: '.module-miaosha',
    Fengqiang: '.module-fengqiang',
    Activity: '.module-activity',
    Package: '.module-package',
    Pintuan: '.module-pintuan',
    Yugou: '.module-yugou',
    Distribution: '.module-distribution',
    Live: '.module-live',
    OnlineCourse: '.module-course',
    SeriesCourse: '.module-series',
    ImageText: '.module-image-text'
}
