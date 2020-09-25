export default [
    {
        path: '/mall-manage',
        name: 'MallManage',
        redirect: '/mall-manage/main',
        component: () => import('../../../views/mall-manage/Index.vue'),
        meta: {
            title: '店铺管理'
        },
        children: [
            {
                path: 'main',
                name: 'MallMain',
                component: () => import('../../../views/mall-manage/pages/Main.vue'),
                meta: {
                    title: '我的店铺'
                }
            }, {
                path: 'themes',
                name: 'MallThemes',
                redirect: { name: 'TemplateHome' },
                component: () => import('../../../views/mall-manage/pages/Themes-Container.vue'),
                meta: {
                    title: '店铺主题'
                },
                children: [
                    {
                        path: 'template-home',
                        name: 'TemplateHome',
                        component: () => import('../../../views/mall-manage/pages/Themes.vue'),
                        meta: {
                            title: '首页模板'
                        }
                    }, {
                        path: 'template-activity',
                        name: 'TemplateActivity',
                        component: () => import('../../../views/mall-manage/pages/Themes.vue'),
                        meta: {
                            title: '主会场模板'
                        }
                    }, {
                        path: 'skin',
                        name: 'Skin',
                        component: () => import('../../../views/mall-manage/pages/Themes.vue'),
                        meta: {
                            title: '皮肤主题'
                        }
                    }
                ]
            }
        ]
    }
]
