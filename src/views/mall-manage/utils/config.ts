export const teacherEditorOptions: DynamicObject = {
    title: '名师专栏',
    min: 3,
    max: 10,
    moduleName: {
        show: true,
        tag: 'input',
        label: '主标题',
        prop: 'moduleName',
        placeholder: '最多输入4个字',
        required: true,
        maxlength: 4
    },
    otherValue: {
        show: false
    },
    suggestion: {
        show: true
    },
    image: {
        show: true,
        width: 500,
        height: 500,
        tag: 'img',
        required: true
    },
    name: {
        show: true,
        tag: 'input',
        label: '老师姓名',
        prop: 'name',
        placeholder: '最多输入8个字',
        required: true,
        maxlength: 8
    },
    value: {
        show: true,
        tag: 'input',
        label: '主讲课程',
        prop: 'value',
        placeholder: '最多输入8个字',
        required: true,
        maxlength: 8
    },
    valueName: {
        show: true,
        tag: 'textarea',
        label: '简介',
        prop: 'valueName',
        placeholder: '最多输入50个字',
        required: true,
        maxlength: 50
    }
}

export const maisongEditorOptions: DynamicObject = {
    title: '买送活动',
    min: 0,
    max: 3,
    moduleName: {
        show: false
    },
    otherValue: {
        show: true,
        tag: 'input',
        label: '副标题',
        prop: 'otherValue',
        placeholder: '最多输入20个字',
        required: true,
        maxlength: 20
    },
    suggestion: {
        show: true
    },
    image: {
        show: true,
        width: 750,
        height: 500,
        tag: 'img',
        required: true
    },
    name: {
        show: true,
        tag: 'input',
        label: '',
        prop: 'name',
        placeholder: '最多输入10个字',
        required: true,
        maxlength: 15
    }
}

export const productTableOptions = [{
    label: '',
    prop: '',
    width: 200,
    render: ({ productMainImage }: { productMainImage: string }) => `<img v-img-error width="48" height="48" src="${ productMainImage }?x-oss-process=style/thum-small">`
}, {
    label: '标题',
    prop: 'productName'
}, {
    label: '创建时间',
    prop: 'createTime'
}]

export const courseTableOptions = [{
    label: '',
    prop: '',
    width: 100,
    render: ({ courseImg }: { courseImg: string }) => `<img v-img-error width="48" height="48" src="${ courseImg }?x-oss-process=style/thum-small">`
}, {
    label: '课程名称',
    prop: 'courseName'
}, {
    label: '类型',
    prop: '',
    render: ({ courseType }: { courseType: number }) => courseType === 2 ? '系列课' : '单课'
}, {
    label: '价格（元）',
    prop: 'sellingPrice'
}, {
    label: '状态',
    prop: '',
    render: ({ status }: { status: string }) => status === '1' ? '上架中' : '已下架'
}, {
    label: '创建时间',
    prop: 'createTime',
    width: 200
}]

export const imageTextTableOptions = [{
    label: '',
    prop: '',
    width: 100,
    render: ({ graphicMainImg }: { graphicMainImg: string }) => `<img v-img-error width="48" height="48" src="${ graphicMainImg }?x-oss-process=style/thum-small">`
}, {
    label: '课程名称',
    prop: 'graphicName'
}, {
    label: '类型',
    prop: '',
    render: () => '图文资料'
}, {
    label: '价格（元）',
    prop: 'sellingPrice'
}, {
    label: '状态',
    prop: '',
    render: () => '上架中'
}, {
    label: '创建时间',
    prop: 'createTime',
    width: 200
}]

export const categoryTableOptionsProducer = (type: number) => [{
    label: '分类名称',
    prop: 'categoryName'
}, {
    label: '商品数量',
    prop: '',
    render ({ productCountAll, productCount }: { productCountAll: number | string; productCount: number | string }) {
        return type === 4
            ? `<span>${ productCountAll }</span>`
            : `<span>${ productCountAll }（${ productCount }件商品参与排序）</span>`
    }
}, {
    label: '显示商品数量',
    prop: 'hiddenCount'
}, {
    label: '创建时间',
    prop: 'createTime'
}]

export const activityTableOptionsProducer = ({ priceLabel = '', statusMap }: { priceLabel: string
    ; statusMap: { [key: string]: string }; }) => [{
    label: '',
    prop: '',
    width: 100,
    render: ({ productMainImage }: { productMainImage: string }) => `<img v-img-error width="48" height="48" src="${ productMainImage }?x-oss-process=style/thum-small">`
}, {
    label: '商品名称',
    prop: 'productName'
}, {
    label: '活动状态',
    prop: '',
    render: ({ status }: { status: number }) => statusMap[status]
}, {
    label: priceLabel,
    prop: '',
    render: ({ price }: { price: number }) => `${ price }元`
}, {
    label: '剩余库存',
    prop: 'stock'
}, {
    label: '活动时间',
    prop: '',
    width: 150,
    render: ({ activityStartTime, activityEndTime }: { activityStartTime: string; activityEndTime: string }) => `
        <div>${ activityStartTime }</div>
        <div>至</div>
        <div>${ activityEndTime }</div>
        `
}]

export const couponTableOptions = [{
    label: '优惠券名称',
    prop: 'couponName'
}, {
    label: '面值（元）',
    prop: 'amount'
}, {
    label: '优惠券类型',
    prop: '',
    render: ({ couponType }: { couponType: number }) => {
        if (couponType === 1) return '满减券'
        if (couponType === 2) return '品类券'
    }
}, {
    label: '使用条件',
    prop: 'brief'
}, {
    label: '用券时间',
    prop: '',
    width: 150,
    render: ({ useStartTime, useEndTime }: { useStartTime: string; useEndTime: string }) => `
      <div>${ useStartTime }</div>
      <div>至</div>
      <div>${ useEndTime }</div>
      `
}, {
    label: '使用量',
    prop: 'usedAmount'
}, {
    label: '状态',
    prop: 'statusText'
}]

export const packageTableOptions = [{
    label: '活动名称',
    prop: 'activityName'
}, {
    label: '活动商品数',
    prop: 'productCount'
}, {
    label: '剩余总库存',
    prop: 'stockCount'
}, {
    label: '参与人数',
    prop: 'number'
}, {
    label: '活动时间',
    prop: '',
    width: 150,
    render: ({ activityStartTime, activityEndTime }: { activityStartTime: string; activityEndTime: string }) => `
      <div>${ activityStartTime }</div>
      <div>至</div>
      <div>${ activityEndTime }</div>
      `
}, {
    label: '活动状态',
    prop: 'statusText'
}]

export const distributionTableOptions = [{
    label: '',
    prop: '',
    width: 100,
    render: ({ productImg }: { productImg: string }) => `<img v-img-error width="48" height="48" src="${ productImg }?x-oss-process=style/thum-small">`
}, {
    label: '名称',
    prop: 'productName'
}, {
    label: '类型',
    prop: 'definiteType'
}, {
    label: '状态',
    prop: 'stockCount',
    render: () => '上架中'
}, {
    label: '价格（元）',
    prop: 'price'
}, {
    label: '润笔（元）',
    prop: 'rebate'
}]
