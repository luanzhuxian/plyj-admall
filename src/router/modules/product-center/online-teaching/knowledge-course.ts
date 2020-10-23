export default [
    {
        path: 'knowledge-course',
        name: 'KnowledgeCourse',
        redirect: '/product-center/online-teaching/knowledge-course/list',
        component: () => import('./../../../../views/product-center/online-teaching/pages/knowledge-course/Index.vue'),
        meta: {
            title: '知识课程管理',
            index: '2-1-4'
        },
        children: [
            {
                path: 'list',
                name: 'KnowledgeCourseList',
                component: () => import('./../../../../views/product-center/online-teaching/pages/knowledge-course/pages/List.vue'),
                meta: {
                    title: '列表',
                    index: '2-1-4-1'
                }
            },
            {
                path: 'add',
                name: 'AddKnowledgeCourse',
                component: () => import('./../../../../views/product-center/online-teaching/pages/knowledge-course/pages/Add.vue'),
                meta: {
                    title: '新建视频课程',
                    index: '2-1-4-2'
                }
            },
            {
                path: 'edit/:id',
                name: 'EditKnowledgeCourse',
                component: () => import('./../../../../views/product-center/online-teaching/pages/knowledge-course/pages/Add.vue'),
                meta: {
                    title: '编辑视频课程',
                    index: '2-1-4-3'
                }
            },
            {
                path: 'detail/:liveId',
                name: 'KnowledgeCourseDetail',
                component: () => import('./../../../../views/product-center/online-teaching/pages/knowledge-course/pages/Play-Detail.vue'),
                meta: {
                    title: '数据详情',
                    index: '2-1-4-4'
                }
            }
        ]
    }
]
