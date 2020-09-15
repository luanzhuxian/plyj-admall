export default [
    {
        path: 'category-manage',
        name: 'CategoryManage',
        component: () => import('../../../views/product-center/category-manage/Category.vue'),
        meta: {
            title: '分类管理'
        }
        // children: [
        //     {
        //         path: 'category-manage',
        //         name: 'CategoryManage',
        //         component: () => import('../../../views/product-center/category-manage/pages/Category.vue')
        //     }
        // ]
    }
]
