// 将属性全部变为可选
type Partial<T> = { [P in keyof T]?: T[P] }

// 将交叉类型合并
type Compute<A extends any> = A extends Function ? A : { [K in keyof A]: A[K] }

// 将两个对象的属性合并
type Merge<O1 extends object, O2 extends object> = Compute<O1 & Omit<O2, keyof O1>>

export type TemplateHomeMix = Partial<Merge<Merge<TemplateB, TemplateC>, TemplateD>>

export type TemplateCrosses = TemplateB | TemplateC | TemplateD | TemplateFanChang | TemplateFengQiang | TemplateBaoFa | TemplateXinChun | TemplateDragonGate

export type TemplateSkinModel = Merge<Template, SkinModel>
// 模板
export interface Template {
    activityType: number;
    createTime: string;
    current: boolean;
    currentTime: string;
    id: string;
    skinStatus: number;
    status: number;
    templateName: string;
    type: number;
    upShelf: string;
    moduleModels?: TemplateModule[];
}

// 模块
export interface TemplateModule {
    goodsSource: string | number;
    id: string;
    moduleName: string;
    moduleType: number;
    number: string | number;
    otherInfo: string;
    otherValue: string;
    participate: string;
    remDuplicate: string | number;
    show: number;
    showStatue: number;
    sort: number;
    sortType: string | number;
    styleType: string | number;
    values: TemplateModuleItem[];
    productValues?: TemplateModuleItem[];
    categoryValues?: TemplateModuleItem[];
    defaultValues?: TemplateModuleItem[];
    backupValues?: TemplateModuleItem[];
}

// 模块values列表
export interface TemplateModuleItem {
    goodsInfo: string | DynamicObject | DynamicObject[];
    // goodsInfo: string | DynamicObject;
    id: string;
    image: string;
    name: string;
    type: number | string;
    value: string;
    valueName: string;
    serverTime?: string;
    shoppingStatus?: string;
    shoppingTime?: string;
    mallBrandingRequestModels?: any[];
    range?: string[];
}

export interface TemplateB {
    Banner: TemplateModule | undefined;
    Adv?: TemplateModule | undefined;
    Live: TemplateModule | undefined;
    OnlineCourse: TemplateModule | undefined;
    SeriesCourse: TemplateModule | undefined;
    ImageText: TemplateModule | undefined;
    Popular: TemplateModule | undefined;
    Class: TemplateModule | undefined;
    Appointment: TemplateModule | undefined;
    Propagate: TemplateModule | undefined;
    Recommend: TemplateModule | undefined;
}

export interface TemplateC {
    Live: TemplateModule | undefined;
    OnlineCourse: TemplateModule | undefined;
    SeriesCourse: TemplateModule | undefined;
    ImageText: TemplateModule | undefined;
    Popular: TemplateModule | undefined;
    Class: TemplateModule | undefined;
    Teachers: TemplateModule | undefined;
    Appointment: TemplateModule | undefined;
    Propagate: TemplateModule | undefined;
    Recommend: TemplateModule | undefined;
}

export interface TemplateD {
    Banner: TemplateModule | undefined;
    Coupon: TemplateModule | undefined;
    Activity: TemplateModule | undefined;
    Live: TemplateModule | undefined;
    OnlineCourse: TemplateModule | undefined;
    SeriesCourse: TemplateModule | undefined;
    ImageText: TemplateModule | undefined;
    Popular: TemplateModule | undefined;
    Class: TemplateModule | undefined;
    Appointment: TemplateModule | undefined;
    Propagate: TemplateModule | undefined;
    Miaosha: TemplateModule | undefined;
    Pintuan: TemplateModule | undefined;
    Yugou: TemplateModule | undefined;
    Package: TemplateModule | undefined;
    Recommend: TemplateModule | undefined;
}

export interface TemplateFanChang {
    Miaosha: TemplateModule | undefined;
    Pintuan: TemplateModule | undefined;
    Maisong: TemplateModule | undefined;
    Fengqiang: TemplateModule | undefined;
    Recommend: TemplateModule | undefined;
}

export interface TemplateFengQiang extends TemplateFanChang {
    Coupon: TemplateModule | undefined;
    Yugou: TemplateModule | undefined;
}

export interface TemplateBaoFa {
    Miaosha: TemplateModule | undefined;
    Pintuan: TemplateModule | undefined;
    Maisong: TemplateModule | undefined;
    Coupon: TemplateModule | undefined;
    Fengqiang: TemplateModule | undefined;
}

export interface TemplateXinChun {
    Propagate: TemplateModule | undefined;
    Coupon: TemplateModule | undefined;
    Chunyun: TemplateModule | undefined;
    Pintuan: TemplateModule | undefined;
    Yugou: TemplateModule | undefined;
    Fengqiang: TemplateModule | undefined;
}

export interface TemplateDragonGate {
    Coupon: TemplateModule | undefined;
    Charity: TemplateModule | undefined;
    Activity: TemplateModule | undefined;
    Miaosha: TemplateModule | undefined;
    Distribution: TemplateModule | undefined;
    Pintuan: TemplateModule | undefined;
    Yugou: TemplateModule | undefined;
    Package: TemplateModule | undefined;
    Recommend: TemplateModule | undefined;
}

export interface DraftTableRow {
    createTime: string;
    id: string;
    status: number;
    statusName: string;
    templateName: string;
    type: number;
    upShelf: string;
    isEdit: boolean;
    editName: string;
}

export interface TemplateModel {
    category: string;
    type: number;
    img: string;
    isHover: boolean;
    isFree: boolean;
    charge: string;
    expire: string;
    current?: boolean;
}

export interface SkinModel {
    category: string;
    skinId: number;
    img: string;
    isHover: false;
    templateName: string;
    charge: string;
    chargeTextColor: string;
    expire: string;
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

// 模板状态
export enum TemplateStatus {
    // 下架
    OffShelf,
    // 上架
    OnShelf,
    // 草稿箱
    Draft
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
    TemplateDragonGate = 10
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
