export default [
    {
        path: 'knowledge-course',
        name: 'KnowledgeCourse',
        redirect: '/product-center/online-teaching/knowledge-course/video-course',
        component: () => import('./../../../../views/product-center/online-teaching/pages/knowledge-course/Index.vue'),
        meta: {
            title: '知识课程管理'
        },
        children: [
            {
                path: 'video-course',
                name: 'VideoCourse',
                component: () => import('./../../../../views/product-center/online-teaching/pages/knowledge-course/pages/List.vue'),
                meta: {
                    title: '视频课程'
                }
            },
            {
                path: 'video-course-add',
                name: 'VideoCourseAdd',
                component: () => import('./../../../../views/product-center/online-teaching/pages/knowledge-course/pages/Add.vue'),
                meta: {
                    title: '新建视频课程'
                }
            },
            {
                path: '/product-center/online-teaching/knowledge-course/video-course/edit/:id',
                name: 'VideoCourseEdit',
                component: () => import('./../../../../views/product-center/online-teaching/pages/knowledge-course/pages/Add.vue'),
                meta: {
                    title: '编辑视频课程'
                }
            },
            {
                path: '/product-center/online-teaching/knowledge-course/video-course/play-detail/:liveId',
                name: 'VideoCoursePlayDetail',
                component: () => import('./../../../../views/product-center/online-teaching/pages/knowledge-course/pages/Play-Detail.vue'),
                meta: {
                    title: '数据详情'
                }
            }
        ]
    }
]
