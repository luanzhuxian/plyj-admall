
// 模板状态
export enum TemplateStatus {
    // 下架
    OffShelf,
    // 上架
    OnShelf,
    // 草稿箱
    Draft,
    // 过期
    Expire
}

// 直播活动状态
export enum LiveStatus {
    // 已结束
    Finished = 0,
    // 未开始
    NotStarted = 2,
    // 已开始
    Started = 4
}

// 营销活动状态
export enum ActivityStatus {
    // 未开始
    NotStarted,
    // 已开始
    Started,
    // 拼团成功
    Succuss,
    // 已结束
    Finished
}

// 商品课程状态
export enum ProductStatus {
    // 已删除
    Deleted,
    // 下架
    OffSell,
    // 上架
    OnSell,
    // 草稿箱
    Draft
}

// 添加数据类型
export enum ProductType {
    // 分类
    Category = 1,
    // 商品
    Product = 2,
    // 知识课程
    Course = 3
}

// 弹窗的类型
export enum ModalType {
    // 分类
    CategoryModal = 1,
    // 商品
    ProductModal = 2,
    // 课程
    ClassModal = 3,
    // 商品和分类，双tab
    ProductAndCategoryModal = 4,
    // 知识课程
    CourseModal = 5,
    // 拼团
    PintuanModal = 8,
    // 领券
    CouponModal = 9,
    // 秒杀
    MiaoshaModal = 10,
    // 预购
    YugouModal = 11,
    // 组合课
    PackageModal = 16,
    // 分销
    DistributionModal = 18,
    // 单课
    SingleCourseModal = 21,
    // 系列课
    SeriesCourseModal = 22,
    // 图文资料
    ImageTextModal = 23,
    // 福利红包
    RedPackageModal = 24,
}

// 模板类型
export enum TemplateTypes {
    // 新春首页模板
    TemplateC = -1,
    // 普通首页模板
    TemplateB = 3,
    // 双十二首页模板
    TemplateB2 = 4,
    // 双十二疯抢
    TemplateFengQiang = 5,
    // 双十二爆发
    TemplateBaoFa = 6,
    // 双十二返场
    TemplateFanChang = 7,
    // 新春 2019
    TemplateSpring2020 = 8,
    // 活动首页模板
    TemplateD = 9,
    // 龙门节主会场
    TemplateDragonGate = 10,
    // 双十二 2020
    TemplateDouble122020 = 11,
    // 新春 2020
    TemplateSpring2021 = 12
}

// 模块id
export enum ModuleTypes {
    // 轮播图
    Banner = 1,
    Adv = 1,
    // 商品模块
    Popular = 2,
    // 精品课程
    Class = 3,
    // 精品推荐
    Recommend = 4,
    // 在线预约
    Appointment = 5,
    // 品宣
    Propagate = 6,
    // 买送活动
    Maisong = 7,
    // 团购
    Pintuan = 8,
    // 优惠券
    Coupon = 9,
    // 秒杀
    Miaosha = 10,
    // 预购
    Yugou = 11,
    // 名师专栏
    Teachers = 12,
    // 春耘活动
    Chunyun = 13,
    // 活动入口模块
    Activity = 15,
    // 组合聚惠学
    Package = 16,
    // 公益粽
    Charity = 17,
    // 分销
    Distribution = 18,
    // 热门活动
    DragonGateActivity = 19,
    // 互动直播
    Live = 20,
    // 知识课程
    SingleCourse = 21,
    // 系列课程
    SeriesCourse = 22,
    // 图文资料
    ImageText = 23,
    // 福利红包
    RedPackage = 24,
    // 分类
    Classify = 25
}

// 各个模板 id 对应模板名
export const tagMap: DynamicObject = {
    '-1': 'TemplateC',
    3: 'TemplateB',
    4: 'TemplateB',
    5: 'TemplateFengqiang',
    6: 'TemplateBaofa',
    7: 'TemplateFanchang',
    8: 'TemplateSpring2020',
    9: 'TemplateD',
    10: 'TemplateDragonGate',
    11: 'TemplateDouble122020',
    12: 'TemplateSpring2021',
    findTemplateTagById (id: string) {
        return this[id]
    }
}

export const productTypeMap: DynamicObject = {
    VIRTUAL_GOODS: '虚拟商品',
    PHYSICAL_GOODS: '虚拟商品',
    FORMAL_CLASS: '正式课',
    EXPERIENCE_CLASS: '体验课'
}

// export const productTypeMap1: DynamicObject = {
//     PHYSICAL_GOODS: 2,
//     VIRTUAL_GOODS: 2,
//     FORMAL_CLASS: 3,
//     EXPERIENCE_CLASS: 3
// }

export const productTypeMap2: DynamicObject = {
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
    14: 'skinMidAutumnFestival',
    15: 'skinNationalDay',
    16: 'skinCulture',
    17: 'skinSports',
    18: 'skinArts',
    19: 'skinDouble12',
    20: 'skinParty',
    21: 'skinGoodCourse',
    22: 'skinWelcomeNew',
    23: 'skinCampusSupply',
    24: 'skinXmas2020',
    has (id: number | string) {
        return Reflect.has(this, id)
    }
}

// 各个皮肤对应的标题组件名
export const skinTitleMap: DynamicObject = {
    1: 'TitleXmas',
    2: 'TitleYuanDan',
    3: 'TitleNewYear',
    4: 'TitleXiaoNian',
    5: 'TitleYuanXiao',
    6: 'TitleWomenDay',
    7: 'TitleNianNianFan',
    8: 'TitleEarthDay',
    9: 'TitleLabourDay',
    10: 'TitleMothersDay',
    11: 'TitleChildrenDay',
    12: 'TitleFathersDay',
    13: 'TitleDragonBoat',
    14: 'TitleMidAutumnFestival',
    15: 'TitleNationalDay',
    16: 'TitleCulture',
    17: 'TitleSports',
    18: 'TitleArts',
    19: 'TitleDouble12',
    20: 'TitleParty',
    21: 'TitleGoodCourse',
    22: 'TitleWelcomeNew',
    23: 'TitleCampusSupply',
    24: 'TitleXmas2020',
    get (id: number | string) {
        return Reflect.has(this, id) ? this[id] : this[0]
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
    14: 'https://mallcdn.youpenglai.com/static/admall/skin/mid-autumn-festival/bottom.jpg',
    15: 'https://mallcdn.youpenglai.com/static/admall/skin/national-day/bottom.jpg',
    16: 'https://mallcdn.youpenglai.com/static/admall/skin/culture/bottom.jpg',
    17: 'https://mallcdn.youpenglai.com/static/admall/skin/sports/bottom.jpg',
    18: 'https://mallcdn.youpenglai.com/static/admall/skin/art/bottom.jpg',
    19: 'https://mallcdn.youpenglai.com/static/admall/skin/double-12/bottom.jpg',
    20: 'https://mallcdn.youpenglai.com/static/admall/skin/party/bottom.jpg',
    21: 'https://mallcdn.youpenglai.com/static/admall/skin/good-course/bottom.jpg',
    22: 'https://mallcdn.youpenglai.com/static/admall/skin/welcome-new/bottom.jpg',
    23: 'https://mallcdn.youpenglai.com/static/admall/skin/campus-supply/bottom.jpg',
    24: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas-2020/bottom.jpg',
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
    Maisong: 'Form',
    Miaosha: 'Miaosha',
    Pintuan: 'Module',
    Yugou: 'Module',
    Fengqiang: 'Module',
    Activity: 'Adv',
    Package: 'Module',
    Distribution: 'Module',
    Live: 'Video',
    SingleCourse: 'Video',
    SeriesCourse: 'Video',
    ImageText: 'Video',
    RedPackage: 'Coupon',
    Classify: 'Classify',
    getEditorByModule ({ tmplType, moduleName }: { tmplType: number; moduleName: string }) {
        if (moduleName === 'Miaosha') {
            return (tmplType === TemplateTypes.TemplateBaoFa) ? 'Miaosha' : 'Module'
        }
        return this[moduleName]
    }
}

// 各个模块对应的类名，上架前校验，找到报错的模块，窗口滚动到报错的模块
export const moduleIdMap: DynamicObject = {
    Banner: '#Banner',
    Adv: '#Adv',
    Popular: '#Popular',
    Class: '#Class',
    Recommend: '#Recommend',
    Propagate: '#Propagate',
    Teachers: '#Teachers',
    Maisong: '#Maisong',
    Miaosha: '#Miaosha',
    Fengqiang: '#Fengqiang',
    Activity: '#Activity',
    Package: '#Package',
    Pintuan: '#Pintuan',
    Yugou: '#Yugou',
    Distribution: '#Distribution',
    Live: '#Live',
    SingleCourse: '#SingleCourse',
    SeriesCourse: '#SeriesCourse',
    ImageText: '#ImageText',
    RedPackage: '#RedPackage',
    Classify: '#Classify'
}
