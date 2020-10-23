export default [
    {
        path: 'road-learning',
        redirect: 'road-learning/list',
        name: 'RoadLearning',
        component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/road-learning/Index.vue'),
        meta: {
            title: '见学之旅',
            index: '8-15'
        },
        children: [
            {
                path: 'list',
                name: 'RoadLearningList',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/road-learning/List.vue'),
                meta: {
                    title: '列表',
                    index: '8-15-1'
                }
            },
            {
                path: 'add',
                name: 'RoadLearningAdd',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/road-learning/Road-Learning-Edit.vue'),
                meta: {
                    title: '创建活动',
                    index: '8-15-2'
                }
            },
            {
                path: 'edit/:id',
                name: 'RoadLearningEdit',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/road-learning/Road-Learning-Edit.vue'),
                meta: {
                    title: '编辑活动',
                    index: '8-15-3'
                }
            },
            {
                path: 'setting',
                name: 'RoadLearningSetting',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/road-learning/Road-Learning-Setting.vue'),
                meta: {
                    title: '活动设置',
                    index: '8-15-4'
                }
            },
            {
                path: 'roadlearning/:id',
                name: 'RoadLearningDetail',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/road-learning/Road-Learning-Detail.vue'),
                meta: {
                    title: '活动详情',
                    index: '8-15-5'
                }
            }
        ]
    }
]
