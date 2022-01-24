// type Omit<T, K extends string | number | symbol> = { [P in Exclude<keyof T, K>]: T[P]; }
// 通过使用 Pick 和 Exclude 来组合
// type Omit<T, K> = Pick<T, Exclude<keyof T, K>> = { [P in Exclude<keyof T, K>]: T[P]; }
// Construct a type with the properties of T except for those in type K.
// 从 T 中移除属性 K

// type Exclude<T, U> = T extends U ? never : T
// Exclude from T those types that are assignable to U
// 从 T 中移除集合 U 中的元素
// type test = Exclude<1 | 2 | 3 | 4 | 5, 3 | 4>
// type test = 1 | 2 | 5
// type test = Exclude<keyof { a: 1; b: 2 }, 'a'>
// type test = "b"

// type Pick<T, K extends keyof T> = { [P in K]: T[P]; }
// From T, pick a set of properties whose keys are in the union K
// 从 T 中选出集合 K 中的属性
// type test = Pick<{ a: 1; b: 2; c: 3 }, 'a' | 'b'>
// test = Pick<{ a: 1; b: 2 }

// type Partial<T> = { [P in keyof T]?: T[P] | undefined; }
// Make all properties in T optional
// 将属性全部变为可选
// keyof 产生联合类型，in 则可以遍历枚举类型

// type Required<T> = { [P in keyof T]-?: T[P]; }
// Make all properties in T required
// 将属性全部变为必选，去掉可选（?）

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
    SingleCourse: TemplateModule | undefined;
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
    SingleCourse: TemplateModule | undefined;
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
    SingleCourse: TemplateModule | undefined;
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

export type UpdateData = {
    type: number;
    selectedList: any[];
    index?: number;
    tmplType?: number;
}

export type UpdateFn = (module: TemplateModule, updateData: UpdateData, tmplType?: number) => TemplateModule | Promise<TemplateModule | undefined> | undefined

/** 映射类型 **/

// 映射类型可以生成新的索引类型，在生成过程中可以加上或去掉 readonly、? 的修饰符。内置的 Record、ReadOnly、Required、Partial 等类型都是映射类型。

// type Record<
//   K extends string | number | symbol,
//   T
// > = { [P in K]: T; }
// Record 类型构造了一个 key 为 stirng 或 number 或 symbol，而 value 为类型 T 的索引类型。它是 TS 内置的高级类型。

// type Readonly<T> = {
//     readonly [Key in keyof T]: T[Key];
// }

// type NotReadOnly<T> = {
//     -readonly [Key in keyof T]: T[Key]
// }

// type Partial<T> = {
//     [Key in keyof T]?: T[Key]
// }

// type Required<T> = {
//     [Key in keyof T]-?: T[Key]
// }

/** 重映射 **/

// 重映射就是在索引后加一个 as 语句，表明索引转换成什么，它可以用来对索引类型做过滤和转换，可以对索引类型做更灵活的编程。

// 比如过滤出类型为 string 的索引：
// type FilterString<T> = {
//   [Key in keyof T as T[Key] extends string ? Key: never]: T[Key];
// }

// 还可以对索引做转换，比如修改索引名，加上 get：
// type Getters<T extends Record<any, any>> = {
//   [Key in keyof T as `get${Capitalize<Key & string>}`]: T[Key];
// }
// T extends xxx 是给类型参数的约束，表示只能传入这种类型。这里的 Record 类型是生成索引类型的，我们上面介绍过，所以 T extends Record<any, any> 就是约束了这里只能传入索引类型。
// as 后面是把索引转换成什么，我们是在原来的基础上做了修改，加上了 get，并且后面内容首字母大写，这个 Capitalize 也是 TS 内置的类型。

// 实现 key 和 value 的互换：
// type Flip<T extends Record<any, any>> = {
//   [Key in keyof T as `${T[Key]}`]: Key
// }
