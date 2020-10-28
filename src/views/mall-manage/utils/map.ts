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
    OnlineCourseModal = 21,
    // 系列课
    SeriesCourseModal = 22,
    // 图文资料
    ImageTextModal = 23
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
    // 新春主会场
    TemplateXinChun = 8,
    // 活动首页模板
    TemplateD = 9,
    // 龙门节主会场
    TemplateDragonGate = 10,
    TemplateDouble12 = 11
}

// 模块id
export enum ModuleIds {
    // 轮播图
    Banner = 1,
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
    // 热门活动
    DragonGateActivity = 19,
    // 互动直播
    Live = 20,
    // 知识课程
    OnlineCourse = 21,
    // 系列课程
    SeriesCourse = 22,
    // 图文资料
    ImageText = 23
}

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

export const productTypeMap1: DynamicObject = {
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
    14: 'skinMidAutumnFestival',
    15: 'skinNationalDay',
    16: 'skinCulture',
    17: 'skinSports',
    18: 'skinArts',
    19: 'skinDouble12',
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
    14: 'https://mallcdn.youpenglai.com/static/admall/skin/mid-autumn-festival/bottom.jpg',
    15: 'https://mallcdn.youpenglai.com/static/admall/skin/national-day/bottom.jpg',
    16: 'https://mallcdn.youpenglai.com/static/admall/skin/culture/bottom.jpg',
    17: 'https://mallcdn.youpenglai.com/static/admall/skin/sports/bottom.jpg',
    18: 'https://mallcdn.youpenglai.com/static/admall/skin/art/bottom.jpg',
    19: 'https://mallcdn.youpenglai.com/static/admall/skin/double-12/bottom.jpg',
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
    OnlineCourse: '#OnlineCourse',
    SeriesCourse: '#SeriesCourse',
    ImageText: '#ImageText'
}
