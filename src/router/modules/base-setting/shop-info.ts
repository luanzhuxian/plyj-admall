export default [
    {
        path: 'shop-info',
        name: 'ShopInfo',
        redirect: '/base-setting/shop-info/set',
        component: () => import('../../../views/base-setting/shop-info/Index.vue'),
        children: [
            {
                path: 'set',
                name: 'ShopInfoSet',
                component: () => import('../../../views/base-setting/shop-info/pages/Shop-Base-Info.vue'),
                meta: {
                    title: '店铺信息'
                }
            }
        ]
    }
]
