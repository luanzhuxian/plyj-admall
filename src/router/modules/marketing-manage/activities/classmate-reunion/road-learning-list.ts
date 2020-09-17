export default [
    {
        path: 'road-learning-list',
        redirect: 'road-learning-list/list',
        name: 'RoadLearningList',
        component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/road-learning/Road-Learning-List.vue'),
        meta: {
            title: '见学之旅'
        },
        children: [
            {
                path: 'list',
                name: 'RoadLearning',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/road-learning/Road-Learning.vue'),
                meta: {
                    title: ''
                }
            },
            {
                path: 'setting',
                name: 'RoadLearningSetting',
                component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/road-learning/Road-Learning-Setting.vue'),
                meta: {
                    title: '活动设置'
                }
            }
        ]
    },
    {
        path: 'roadlearning/add',
        name: 'RoadLearningAdd',
        component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/road-learning/Road-Learning-Edit.vue'),
        meta: {
            title: '创建活动'
        }
    },
    {
        path: 'roadlearning/:id/edit',
        name: 'RoadLearningEdit',
        component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/road-learning/Road-Learning-Edit.vue'),
        meta: {
            title: '编辑活动'
        }
    },
    {
        path: 'roadlearning/:id',
        name: 'RoadLearningDetail',
        component: () => import('../../../../../views/marketing-manage/activities/classmate-reunion/road-learning/Road-Learning-Detail.vue'),
        meta: {
            title: '查看数据'
        }
    }
]
