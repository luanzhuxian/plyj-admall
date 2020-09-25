export default [
    {
        path: 'series-of-courses',
        name: 'SeriesOfCourses',
        redirect: '/product-center/online-teaching/series-of-courses/list',
        component: () => import('./../../../../views/product-center/online-teaching/pages/series-of-courses/Index.vue'),
        meta: {
            title: '系列课'
        },
        children: [
            {
                path: 'list',
                name: 'SeriesOfCoursesList',
                component: () => import('./../../../../views/product-center/online-teaching/pages/series-of-courses/pages/List.vue'),
                meta: {
                    title: '列表'
                }
            },
            {
                path: 'add',
                name: 'AddSeriesOfCourses',
                component: () => import('./../../../../views/product-center/online-teaching/pages/series-of-courses/pages/Add.vue'),
                meta: {
                    title: '新增系列课'
                }
            },
            {
                path: '/product-center/online-teaching/series-of-courses/edit/:id',
                name: 'EditSeriesOfCourses',
                props: true,
                component: () => import('./../../../../views/product-center/online-teaching/pages/series-of-courses/pages/Add.vue'),
                meta: {
                    title: '编辑系列课'
                }
            },
            {
                path: '/product-center/online-teaching/series-of-courses/data/courses/:id',
                name: 'CoursesSeriesOfCoursesData',
                component: () => import('./../../../../views/product-center/online-teaching/pages/series-of-courses/pages/Data-Of-Courses.vue'),
                meta: {
                    title: '课程数据'
                }
            },
            {
                path: '/product-center/online-teaching/series-of-courses/data/users/:id',
                name: 'UsersSeriesOfCoursesData',
                component: () => import('./../../../../views/product-center/online-teaching/pages/series-of-courses/pages/Data-Of-Users.vue'),
                meta: {
                    title: '用户数据'
                }
            }
        ]
    }
]
