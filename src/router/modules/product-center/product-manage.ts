export default [
    {
        path: 'goods-manage',
        redirect: '/product-center/goods-manage/my-goods',
        name: 'GoodsManage',
        component: () => import('../../../views/product-center/product-manage/Index.vue'),
        meta: {
            title: '我的商品'
        },
        children: [
            {
                path: 'category',
                name: 'Category',
                component: () => import('../../../views/product-center/product-manage/pages/Category.vue'),
                meta: {
                    title: '商品分类'
                }
            },
            {
                path: 'comment',
                name: 'Comment',
                component: () => import('../../../views/product-center/product-manage/pages/Comment.vue'),
                meta: {
                    title: '商品评价'
                }
            },
            {
                path: 'my-goods/edit/:id',
                name: 'EditProduct',
                props: true,
                component: () => import('../../../views/product-center/product-manage/pages/Add-Product.vue'),
                meta: {
                    title: '编辑商品'
                }
            },
            {
                path: 'my-goods/add',
                name: 'AddProduct',
                props: true,
                component: () => import('../../../views/product-center/product-manage/pages/Add-Product.vue'),
                meta: {
                    title: '新增商品'
                }
            },
            {
                path: 'my-goods',
                name: 'MyGoods',
                component: () => import('../../../views/product-center/product-manage/pages/My-Goods.vue'),
                meta: {
                    title: ''
                }
            },
            {
                path: 'recommend',
                name: 'Recommend',
                component: () => import('../../../views/product-center/product-manage/pages/Recommend.vue'),
                meta: {
                    title: '推荐榜单'
                },
                children: [
                    {
                        path: 'recommend-goods',
                        name: 'RecommendGoods',
                        meta: {
                            title: '商品推荐榜单'
                        }
                    },
                    {
                        path: 'recommend-course',
                        name: 'RecommendCourse',
                        meta: {
                            title: '课程推荐榜单'
                        }
                    }
                ]
            }
        ]
    },
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
