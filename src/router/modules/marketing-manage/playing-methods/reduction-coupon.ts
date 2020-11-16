export default [
    {
        path: 'reduction-coupon',
        name: 'ReductionCoupon',
        redirect: 'reduction-coupon/reduction-coupon-list',
        component: () => import('../../../../views/marketing-manage/playing-methods/reduction-coupon/Index.vue'),
        meta: {
            title: '满减券',
            index: '8-7'
        },
        children: [
            {
                path: 'reduction-coupon-list',
                name: 'ReductionCouponList',
                component: () => import('../../../../views/marketing-manage/playing-methods/reduction-coupon/Coupon-List.vue'),
                meta: {
                    title: '满减券列表',
                    index: '8-7-1'
                }
            },
            {
                path: 'add-reduction-coupon',
                name: 'AddReductionCoupon',
                component: () => import('../../../../views/marketing-manage/playing-methods/reduction-coupon/Add-Coupon.vue'),
                meta: {
                    title: '新增满减券',
                    index: '8-7-2'
                }
            },
            {
                path: 'add-reduction-coupon/:id',
                name: 'EditReductionCoupon',
                component: () => import('../../../../views/marketing-manage/playing-methods/reduction-coupon/Add-Coupon.vue'),
                meta: {
                    title: '编辑满减券',
                    index: '8-7-3'
                }
            },
            {
                path: 'copy-reduction-coupon/:id',
                name: 'CopyReductionCoupon',
                component: () => import('../../../../views/marketing-manage/playing-methods/reduction-coupon/Add-Coupon.vue'),
                meta: {
                    title: '复制满减券',
                    index: '8-7-4'
                }
            },
            {
                path: 'view-reduction-coupon-list/:id',
                name: 'ViewReductionCouponListActive',
                component: () => import('../../../../views/marketing-manage/playing-methods/reduction-coupon/ViewCouponList.vue'),
                meta: {
                    title: '查看详情',
                    index: '8-7-5'
                }
            }
        ]
    }
]
