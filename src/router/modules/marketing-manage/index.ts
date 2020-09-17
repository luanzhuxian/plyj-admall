import { importFiles } from './../../../assets/ts/utils'
const context = require.context('./', true, /\/((?!index).)+\.ts$/)

export default [
    {
        path: '/marketing-manage',
        redirect: '/marketing-manage/marketing-gameplay-list',
        name: 'MarketingManage',
        component: () => import('../../../views/marketing-manage/Index.vue'),
        children: [
            {
                path: 'marketing-gameplay-list',
                name: 'MarketingGameplayList',
                component: () => import('../../../views/marketing-manage/gameplay/Gameplay.vue'),
                meta: {
                    title: '营销中心'
                }
            },
            ...importFiles(context)
        ]
    }
]
