export default [
    {
        path: 'reduction-coupon',
        name: 'ReductionCoupon',
        redirect: 'reduction-coupon/reduction-coupon-list',
        component: () => import('../../../../views/marketing-manage/playing-methods/reduction-coupon/Index.vue'),
        meta: {
            title: ''
        },
        children: [
            {
                path: 'reduction-coupon-list',
                name: 'ReductionCouponList',
                component: () => import('../../../../views/marketing-manage/playing-methods/reduction-coupon/Coupon-List.vue'),
                meta: {
                    title: '满减券'
                }
            },
            {
                path: 'add-reduction-coupon',
                name: 'AddReductionCoupon',
                component: () => import('../../../../views/marketing-manage/playing-methods/reduction-coupon/Add-Coupon.vue'),
                meta: {
                    title: '新增满减券'
                }
            },
            {
                path: 'add-reduction-coupon/:id',
                name: 'EditReductionCoupon',
                component: () => import('../../../../views/marketing-manage/playing-methods/reduction-coupon/Add-Coupon.vue'),
                meta: {
                    title: '编辑满减券'
                }
            },
            {
                path: 'copy-reduction-coupon/:id',
                name: 'CopyReductionCoupon',
                component: () => import('../../../../views/marketing-manage/playing-methods/reduction-coupon/Add-Coupon.vue'),
                meta: {
                    title: '复制满减券'
                }
            },
            {
                path: 'view-reduction-coupon-list/:id',
                name: 'ViewReductionCouponListSelf',
                component: () => import('../../../../views/marketing-manage/playing-methods/reduction-coupon/ViewCouponList.vue'),
                meta: {
                    title: '查看数据'
                }
            },
            {
                path: 'view-reduction-coupon-list/:id',
                name: 'ViewReductionCouponListActive',
                component: () => import('../../../../views/marketing-manage/playing-methods/reduction-coupon/ViewCouponList.vue'),
                meta: {
                    title: '查看数据'
                }
            }
        ]
    }
]
