export default [
    {
        path: 'courses-manage',
        redirect: '/product-center/courses-manage/my-courses',
        name: 'CoursesManage',
        component: () => import('../../../views/product-center/course-manage/Index.vue'),
        meta: {
            title: '我的课程'
        },
        children: [
            {
                path: 'my-courses/edit/:id',
                name: 'EditCourses',
                props: true,
                component: () => import('../../../views/product-center/course-manage/pages/Add-Courses.vue'),
                meta: {
                    title: '编辑课程'
                }
            },
            {
                path: 'my-courses/add',
                name: 'AddCourses',
                props: true,
                component: () => import('../../../views/product-center/course-manage/pages/Add-Courses.vue'),
                meta: {
                    title: '新增课程'
                }
            },
            {
                path: 'my-courses',
                name: 'MyCourses',
                component: () => import('../../../views/product-center/course-manage/pages/My-Courses.vue')
            }
        ]
    }
]
