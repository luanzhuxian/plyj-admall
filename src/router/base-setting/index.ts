import account from './account'
export default [
    {
        path: '/base-setting',
        name: 'BaseSetting',
        component: () => import('../../views/base-setting/Index.vue'),
        meta: {
            title: '基础设置'
        },
        children: [
            ...account
        ]
    }
]
