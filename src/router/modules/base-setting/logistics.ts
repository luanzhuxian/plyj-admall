export default [
    {
        path: 'logistics',
        name: 'Logistics',
        component: () => import('../../../views/base-setting/logistics-manage/Index.vue'),
        meta: {
            title: '物流管理',
            index: '7-4'
        },
        children: [
            {
                path: 'postage',
                name: 'Postage',
                component: () => import('../../../views/base-setting/logistics-manage/pages/Postage.vue'),
                meta: {
                    title: '运费模板',
                    index: '7-4-1'
                }
            },
            {
                path: 'address-manager',
                name: 'AddressManager',
                component: () => import('../../../views/base-setting/logistics-manage/pages/Address-Manager.vue'),
                meta: {
                    title: '地址管理',
                    index: '7-4-2'
                }
            }
        ]
    }
]
