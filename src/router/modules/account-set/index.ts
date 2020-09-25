export default [
    {
        path: '/account-set',
        name: 'AccountSet',
        component: () => import('../../../views/account-set/Index.vue'),
        meta: {
            title: '账号设置'
        }
    }
]
