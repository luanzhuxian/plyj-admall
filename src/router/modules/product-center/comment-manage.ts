export default [
    {
        path: 'comment',
        name: 'Comment',
        component: () => import('../../../views/product-center/comment-manage/Comment.vue'),
        meta: {
            title: '商品评价',
            index: '2-5'
        }
    }
]
