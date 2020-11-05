export default [
    {
        path: 'series-of-courses',
        name: 'SeriesOfCourses',
        redirect: '/product-center/online-teaching/series-of-courses/list',
        component: () => import('./../../../../views/product-center/online-teaching/pages/series-of-courses/Index.vue'),
        meta: {
            title: '系列课',
            index: '2-1-5'
        },
        children: [
            {
                path: 'list',
                name: 'SeriesOfCoursesList',
                component: () => import('./../../../../views/product-center/online-teaching/pages/series-of-courses/pages/List.vue'),
                meta: {
                    title: '列表',
                    index: '2-1-5-1'
                }
            },
            {
                path: 'add',
                name: 'AddSeriesOfCourses',
                component: () => import('./../../../../views/product-center/online-teaching/pages/series-of-courses/pages/Add.vue'),
                meta: {
                    title: '新增系列课',
                    index: '2-1-5-2'
                }
            },
            {
                path: 'edit/:id',
                name: 'EditSeriesOfCourses',
                props: true,
                component: () => import('./../../../../views/product-center/online-teaching/pages/series-of-courses/pages/Add.vue'),
                meta: {
                    title: '编辑系列课',
                    index: '2-1-5-3'
                }
            },
            {
                path: 'data/courses/:id',
                name: 'CoursesSeriesDataDetail',
                component: () => import('../../../../views/product-center/online-teaching/pages/series-of-courses/pages/data-detail/Index.vue'),
                meta: {
                    index: '2-1-5-4',
                    ignore: true
                },
                children: [
                    {
                        path: 'data/courses/:id',
                        name: 'CoursesSeriesOfCoursesData',
                        component: () => import('../../../../views/product-center/online-teaching/pages/series-of-courses/pages/data-detail/Data-Of-Courses.vue'),
                        meta: {
                            title: '课程数据',
                            index: '2-1-5-4-1',
                            ignore: true
                        }
                    },
                    {
                        path: 'data/users/:id',
                        name: 'UsersSeriesOfCoursesData',
                        component: () => import('../../../../views/product-center/online-teaching/pages/series-of-courses/pages/data-detail/Data-Of-Users.vue'),
                        meta: {
                            title: '用户数据',
                            index: '2-1-5-4-2',
                            ignore: true
                        }
                    }
                ]
            }
        ]
    }
]
