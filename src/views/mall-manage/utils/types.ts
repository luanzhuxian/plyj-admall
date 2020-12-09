// 将属性全部变为可选
type Partial<T> = { [P in keyof T]?: T[P] }

// 将交叉类型合并
type Compute<A extends any> = A extends Function ? A : { [K in keyof A]: A[K] }

// 将两个对象的属性合并
type Merge<O1 extends object, O2 extends object> = Compute<O1 & Omit<O2, keyof O1>>

export type TemplateHomeMix = Partial<Merge<Merge<TemplateB, TemplateC>, TemplateD>>

export type TemplateCrosses = TemplateB | TemplateC | TemplateD | TemplateFanChang | TemplateFengQiang | TemplateBaoFa | TemplateSpring2020 | TemplateDragonGate | TemplateDouble122020 | TemplateSpring2021

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
    Classify: TemplateModule | undefined;
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

export interface TemplateSpring2020 {
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

export interface TemplateDouble122020 {
    Coupon: TemplateModule | undefined;
    Miaosha: TemplateModule | undefined;
    Pintuan: TemplateModule | undefined;
    Yugou: TemplateModule | undefined;
    Package: TemplateModule | undefined;
    Popular: TemplateModule | undefined;
}

export interface TemplateSpring2021 {
    Live: TemplateModule | undefined;
    RedPackage: TemplateModule | undefined;
    Coupon: TemplateModule | undefined;
    Miaosha: TemplateModule | undefined;
    Pintuan: TemplateModule | undefined;
    Yugou: TemplateModule | undefined;
    Package: TemplateModule | undefined;
    Popular: TemplateModule | undefined;
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
