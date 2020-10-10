export default [
    {
        path: '/mall-manage',
        name: 'MallManage',
        redirect: '/mall-manage/main',
        component: () => import('../../../views/mall-manage/Index.vue'),
        meta: {
            title: '店铺管理',
            index: '6'
        },
        children: [
            {
                path: 'main',
                name: 'MallMain',
                component: () => import('../../../views/mall-manage/pages/Main.vue'),
                meta: {
                    title: '我的店铺',
                    index: '6-1'
                }
            }, {
                path: 'themes',
                name: 'MallThemes',
                component: () => import('../../../views/mall-manage/pages/Themes.vue'),
                meta: {
                    title: '店铺主题',
                    index: '6-2'
                }
            }, {
                path: 'decoration',
                name: 'MallDecoration',
                component: () => import('../../../views/mall-manage/pages/Decoration.vue'),
                meta: {
                    title: '编辑模板'
                }
            }
        ]
    }
]
