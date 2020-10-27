import { importFiles } from './../../../assets/ts/utils'
const context = require.context('./', true, /\/((?!index).)+\.ts$/)

export default [
    {
        path: '/marketing-manage',
        redirect: '/marketing-manage/marketing-gameplay-list',
        name: 'MarketingManage',
        component: () => import('../../../views/marketing-manage/Index.vue'),
        meta: {
            index: '8',
            title: '营销中心'
        },
        children: [
            {
                path: 'marketing-gameplay-list',
                name: 'MarketingGameplayList',
                component: () => import('../../../views/marketing-manage/gameplay/Gameplay.vue'),
                meta: {
                    index: '8-x',
                    ignore: true
                }
            },
            ...importFiles(context)
        ]
    }
]
