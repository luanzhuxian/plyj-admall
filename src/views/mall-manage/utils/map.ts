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
