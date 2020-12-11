export default [
    {
        path: 'lucky-draw',
        name: 'LuckyDraw',
        component: () => import('../../../../views/marketing-manage/playing-methods/lucky-draw/Index.vue'),
        meta: {
            title: '抽奖乐翻天',
            index: '8-21',
            ignore: true
        },
        children: []
    }
]
