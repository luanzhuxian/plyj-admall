// 将属性全部变为可选
type Partial<T> = { [P in keyof T]?: T[P] }

// 将交叉类型合并
type Compute<A extends any> = A extends Function ? A : { [K in keyof A]: A[K] }

// 将两个对象的属性合并
type Merge<O1 extends object, O2 extends object> = Compute<O1 & Omit<O2, keyof O1>>

export type TemplateHomeMix = Partial<Merge<Merge<TemplateB, TemplateC>, TemplateD>>

export type Template = TemplateB | TemplateC | TemplateD | TemplateFanChang | TemplateFengQiang | TemplateBaoFa | TemplateXinChun | TemplateDragonGate

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

export interface TemplateModuleItem {
    // goodsInfo: string | DynamicObject | any[];
    goodsInfo: string | DynamicObject;
    id: string;
    image: string;
    name: string;
    serverTime: string;
    shoppingStatus: string;
    shoppingTime: string;
    type: number | string;
    value: string;
    valueName: string;
    mallBrandingRequestModels?: any[];
    range?: string[];
}

export interface TemplateB {
    Banner: TemplateModule | undefined;
    Adv?: TemplateModule | undefined;
    Live: TemplateModule | undefined;
    Course: TemplateModule | undefined;
    Series: TemplateModule | undefined;
    ImageText: TemplateModule | undefined;
    Popular: TemplateModule | undefined;
    Class: TemplateModule | undefined;
    Appointment: TemplateModule | undefined;
    Propagate: TemplateModule | undefined;
    Recommend: TemplateModule | undefined;
}

export interface TemplateC {
    Live: TemplateModule | undefined;
    Course: TemplateModule | undefined;
    Series: TemplateModule | undefined;
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
    Course: TemplateModule | undefined;
    Series: TemplateModule | undefined;
    ImageText: TemplateModule | undefined;
    Popular: TemplateModule | undefined;
    Class: TemplateModule | undefined;
    Appointment: TemplateModule | undefined;
    Propagate: TemplateModule | undefined;
    MiaoSha: TemplateModule | undefined;
    PinTuan: TemplateModule | undefined;
    YuGou: TemplateModule | undefined;
    Package: TemplateModule | undefined;
    Recommend: TemplateModule | undefined;
}

export interface TemplateFanChang {
    MiaoSha: TemplateModule | undefined;
    PinTuan: TemplateModule | undefined;
    MaiSong: TemplateModule | undefined;
    FengQiang: TemplateModule | undefined;
    Recommend: TemplateModule | undefined;
}

export interface TemplateFengQiang extends TemplateFanChang {
    Coupon: TemplateModule | undefined;
    YuGou: TemplateModule | undefined;
}

export interface TemplateBaoFa {
    MiaoSha: TemplateModule | undefined;
    PinTuan: TemplateModule | undefined;
    MaiSong: TemplateModule | undefined;
    Coupon: TemplateModule | undefined;
    FengQiang: TemplateModule | undefined;
}

export interface TemplateXinChun {
    Propagate: TemplateModule | undefined;
    Coupon: TemplateModule | undefined;
    ChunYun: TemplateModule | undefined;
    PinTuan: TemplateModule | undefined;
    YuGou: TemplateModule | undefined;
    FengQiang: TemplateModule | undefined;
}

export interface TemplateDragonGate {
    Coupon: TemplateModule | undefined;
    Charity: TemplateModule | undefined;
    Activity: TemplateModule | undefined;
    MiaoSha: TemplateModule | undefined;
    Distribution: TemplateModule | undefined;
    PinTuan: TemplateModule | undefined;
    YuGou: TemplateModule | undefined;
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
