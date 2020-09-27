export default [
    {
        path: 'recommend',
        name: 'Recommend',
        component: () => import('../../../views/product-center/recommend/Recommend.vue'),
        meta: {
            title: '推荐榜单',
            index: '2-6'
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
