export default [
    {
        path: '/mall-manage',
        name: 'MallManage',
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
            },
            {
                path: 'themes',
                name: 'MallThemes',
                component: () => import('../../../views/mall-manage/pages/Themes.vue'),
                meta: {
                    title: '模板中心',
                    index: '6-2'
                }
            },
            {
                path: 'org-index',
                name: 'OrgIndex',
                component: () => import('../../../views/mall-manage/pages/Org-Index.vue'),
                meta: {
                    index: '6-3',
                    title: '品宣主页'
                }
            },
            {
                path: 'decoration',
                name: 'MallDecoration',
                component: () => import('../../../views/mall-manage/pages/Decoration.vue'),
                meta: {
                    index: '6-4',
                    title: '编辑模板'
                }
            }
        ]
    }
]
