// 组合课
export default [
    {
        path: 'course-package',
        name: 'CoursePackage',
        redirect: 'course-package/list',
        component: () => import('../../../../views/marketing-manage/playing-methods/course-package/Index.vue'),
        meta: {
            title: '组合聚惠学',
            index: '8-4'
        },
        children: [
            {
                path: 'list',
                name: 'CoursePackageList',
                component: () => import('../../../../views/marketing-manage/playing-methods/course-package/List.vue'),
                meta: {
                    title: '列表',
                    index: '8-4-1'
                }
            },
            {
                path: 'add',
                name: 'AddCoursePackage',
                component: () => import('../../../../views/marketing-manage/playing-methods/course-package/Add.vue'),
                meta: {
                    title: '创建活动',
                    index: '8-4-2'
                }
            },
            {
                path: 'edit/:id',
                name: 'EditCoursePackage',
                props: true,
                component: () => import('../../../../views/marketing-manage/playing-methods/course-package/Add.vue'),
                meta: {
                    title: '编辑活动',
                    index: '8-4-3'
                }
            },
            {
                path: 'detail/:id',
                name: 'CoursePackageDetail',
                redirect: 'detail/:id/info',
                props: true,
                component: () => import('../../../../views/marketing-manage/playing-methods/course-package/Detail.vue'),
                meta: {
                    title: '活动详情',
                    index: '8-4-4'
                },
                children: [
                    // 活动详情
                    {
                        path: 'info',
                        props: true,
                        name: 'CoursePackageDetailInfo',
                        component: () => import('../../../../views/marketing-manage/playing-methods/course-package/Detail-Info.vue'),
                        meta: {
                            ignore: true
                        }
                    },
                    // 活动数据
                    {
                        path: 'data',
                        props: true,
                        name: 'CoursePackageDetailData',
                        component: () => import('../../../../views/marketing-manage/playing-methods/course-package/Detail-Data.vue'),
                        meta: {
                            ignore: true
                        }
                    }
                ]
            }
        ]
    }
]
