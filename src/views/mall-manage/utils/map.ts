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
