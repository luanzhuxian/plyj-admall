export default [
    {
        path: 'courses-manage',
        redirect: '/product-center/courses-manage/my-courses',
        name: 'CoursesManage',
        component: () => import('../../../views/product-center/course-manage/Index.vue'),
        meta: {
            title: '我的课程',
            index: '2-3'
        },
        children: [
            {
                path: 'my-courses',
                name: 'MyCourses',
                component: () => import('../../../views/product-center/course-manage/pages/My-Courses.vue'),
                meta: {
                    index: '2-3-1'
                }
            },
            {
                path: 'my-courses/add',
                name: 'AddCourses',
                props: true,
                component: () => import('../../../views/product-center/course-manage/pages/Add-Courses.vue'),
                meta: {
                    title: '新增课程',
                    index: '2-3-2'
                }
            },
            {
                path: 'my-courses/edit/:id',
                name: 'EditCourses',
                props: true,
                component: () => import('../../../views/product-center/course-manage/pages/Add-Courses.vue'),
                meta: {
                    title: '编辑课程',
                    index: '2-3-3'
                }
            }
        ]
    }
]
