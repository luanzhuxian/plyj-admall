export default [
    {
        path: '/mall-manage',
        name: 'MallManage',
        redirect: '/mall-manage/main',
        component: () => import('../../../views/mall-manage/Index.vue'),
        meta: {
            title: '店铺管理',
            index: '5'
        },
        children: [
            {
                path: 'main',
                name: 'MallMain',
                component: () => import('../../../views/mall-manage/pages/Main.vue'),
                meta: {
                    title: '我的店铺',
                    index: '5-1'
                }
            }, {
                path: 'themes',
                name: 'MallThemes',
                component: () => import('../../../views/mall-manage/pages/Themes.vue'),
                meta: {
                    title: '店铺主题',
                    index: '5-2'
                }
            }
        ]
    }
]
