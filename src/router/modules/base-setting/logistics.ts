export default [
    {
        path: 'logistics',
        name: 'Logistics',
        redirect: '/base-setting/logistics/postage',
        component: () => import('../../../views/base-setting/logistics-manage/Index.vue'),
        meta: {
            title: '物流管理',
            index: '6-4'
        },
        children: [
            {
                path: 'postage',
                name: 'Postage',
                component: () => import('../../../views/base-setting/logistics-manage/pages/Postage.vue'),
                meta: {
                    title: '运费模板'
                }
            },
            {
                path: 'address-manager',
                name: 'AddressManager',
                component: () => import('../../../views/base-setting/logistics-manage/pages/Address-Manager.vue'),
                meta: {
                    title: '地址管理'
                },
                children: [
                    {
                        path: 'delivery-address',
                        name: 'DeliveryAddress',
                        meta: {
                            title: '发货地址'
                        }
                    },
                    {
                        path: 'shipping-address',
                        name: 'ShippingAddress',
                        meta: {
                            title: '退货地址'
                        }
                    }
                ]
            }
        ]
    }
]
