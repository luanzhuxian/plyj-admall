export default [
    {
        path: 'mp-weixin',
        redirect: '/marketing-manage/mp-weixin/list',
        name: 'MpWeixin',
        component: () => import('../../../../views/marketing-manage/playing-methods/mp-weixin/Index.vue'),
        meta: {
            title: '公众号增粉'
        },
        children: [
            {
                path: 'list',
                name: 'MpWeixinList',
                component: () => import('../../../../views/marketing-manage/playing-methods/mp-weixin/List.vue'),
                meta: {
                    title: '活动列表'
                }
            },
            {
                path: 'add',
                name: 'MpWeixinAdd',
                component: () => import('../../../../views/marketing-manage/playing-methods/mp-weixin/Add.vue'),
                meta: {
                    title: '新建活动'
                }
            },
            {
                path: 'edit/:id',
                props: true,
                name: 'MpWeixinEdit',
                component: () => import('../../../../views/marketing-manage/playing-methods/mp-weixin/Add.vue'),
                meta: {
                    title: '编辑活动'
                }
            }
        ]
    }
]
