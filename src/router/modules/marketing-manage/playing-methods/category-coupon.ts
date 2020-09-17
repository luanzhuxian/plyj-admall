export default [
    {
        path: 'category-coupon',
        name: 'CategoryCoupon',
        redirect: 'category-coupon/category-coupon-list',
        component: () => import('../../../../views/marketing-manage/playing-methods/category-coupon/Index.vue'),
        meta: {
            title: ''
        },
        children: [
            {
                path: 'category-coupon-list',
                name: 'CategoryCouponList',
                component: () => import('../../../../views/marketing-manage/playing-methods/category-coupon/Coupon-List.vue'),
                meta: {
                    title: '品类券'
                }
            },
            {
                path: 'add-category-coupon',
                name: 'AddCategoryCoupon',
                component: () => import('../../../../views/marketing-manage/playing-methods/category-coupon/Add-Coupon.vue'),
                meta: {
                    title: '新增品类券'
                }
            },
            {
                path: 'add-category-coupon/:id',
                name: 'EditCategoryCoupon',
                component: () => import('../../../../views/marketing-manage/playing-methods/category-coupon/Add-Coupon.vue'),
                meta: {
                    title: '编辑品类券'
                }
            },
            {
                path: 'copy-category-coupon/:id',
                name: 'CopyCategoryCoupon',
                component: () => import('../../../../views/marketing-manage/playing-methods/category-coupon/Add-Coupon.vue'),
                meta: {
                    title: '复制品类券'
                }
            },
            {
                path: 'view-category-coupon/:id',
                name: 'ViewCategoryCouponListSelf',
                component: () => import('../../../../views/marketing-manage/playing-methods/category-coupon/ViewCouponList.vue'),
                meta: {
                    title: '查看数据'
                }
            },
            {
                path: 'view-category-coupon/:id',
                name: 'ViewCategoryCouponListActive',
                component: () => import('../../../../views/marketing-manage/playing-methods/category-coupon/ViewCouponList.vue'),
                meta: {
                    title: '查看数据'
                }
            }
        ]
    }
]
