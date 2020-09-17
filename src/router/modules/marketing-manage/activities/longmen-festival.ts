export default [
    {
        path: 'longmen-festival',
        name: 'LongmenFestival',
        component: () => import('../../../../views/marketing-manage/activities/longmen-festival/Index.vue'),
        meta: {
            title: ''
        },
        children: [
            {
                path: 'general-course-package',
                name: 'GeneralCoursePackage',
                redirect: 'general-course-package/list',
                component: () => import('../../../../views/marketing-manage/activities/longmen-festival/sign-In/Index.vue'),
                meta: {
                    title: '粽粽有礼'
                },
                children: [
                    {
                        path: 'list',
                        name: 'GeneralList',
                        component: () => import('../../../../views/marketing-manage/activities/longmen-festival/sign-In/List.vue'),
                        meta: {
                            title: ''
                        }
                    },
                    {
                        path: 'setting',
                        name: 'GeneralSetting',
                        component: () => import('../../../../views/marketing-manage/activities/longmen-festival/sign-In/Setting.vue'),
                        meta: {
                            title: '活动设置'
                        }
                    },
                    {
                        path: 'add',
                        name: 'GeneralAdd',
                        component: () => import('../../../../views/marketing-manage/activities/longmen-festival/sign-In/Add.vue'),
                        meta: {
                            title: '新建活动'
                        }
                    },
                    {
                        path: 'edit/:id',
                        name: 'GeneralEdit',
                        props: true,
                        component: () => import('../../../../views/marketing-manage/activities/longmen-festival/sign-In/Add.vue'),
                        meta: {
                            title: '编辑活动'
                        }
                    },
                    {
                        path: 'edit/:id',
                        name: 'GeneralCopy',
                        props: true,
                        component: () => import('../../../../views/marketing-manage/activities/longmen-festival/sign-In/Add.vue'),
                        meta: {
                            title: '复制活动'
                        }
                    },
                    {
                        path: 'detail/:id',
                        name: 'GeneralDetail',
                        redirect: 'detail/:id/info',
                        props: true,
                        component: () => import('../../../../views/marketing-manage/activities/longmen-festival/sign-In/Detail.vue'),
                        meta: {
                            title: ''
                        },
                        children: [
                            // 活动详情
                            {
                                path: 'info',
                                name: 'GeneralInfo',
                                component: () => import('../../../../views/marketing-manage/activities/longmen-festival/sign-In/Info.vue'),
                                meta: {
                                    title: '活动详情'
                                }
                            },
                            // 活动数据
                            {
                                path: 'data',
                                name: 'GeneralData',
                                component: () => import('../../../../views/marketing-manage/activities/longmen-festival/sign-In/Data.vue'),
                                meta: {
                                    title: '活动数据'
                                }
                            },
                            // 活动数据
                            {
                                path: 'gift-data',
                                name: 'GeneralGiftData',
                                component: () => import('../../../../views/marketing-manage/activities/longmen-festival/sign-In/Gift-Data.vue'),
                                meta: {
                                    title: '礼品发放数据'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                path: 'lottery',
                name: 'LongmenLottery',
                redirect: 'lottery/list',
                component: () => import('../../../../views/marketing-manage/activities/longmen-festival/lottery/Index.vue'),
                meta: {
                    title: '龙门抽大奖'
                },
                children: [
                    {
                        path: 'list',
                        name: 'LongmenLotteryList',
                        component: () => import('../../../../views/marketing-manage/activities/longmen-festival/lottery/List.vue'),
                        meta: {
                            title: ''
                        }
                    },
                    // 之所以添加也有id，是因为存在复制这么一种情况
                    {
                        path: 'add/:id?',
                        props: true,
                        name: 'AddLongmenLottery',
                        component: () => import('../../../../views/marketing-manage/activities/longmen-festival/lottery/Add.vue'),
                        meta: {
                            title: '添加活动'
                        }
                    },
                    {
                        path: 'edit/:id',
                        name: 'EditLongmenLottery',
                        props: true,
                        component: () => import('../../../../views/marketing-manage/activities/longmen-festival/lottery/Add.vue'),
                        meta: {
                            title: '编辑活动'
                        }
                    },
                    {
                        path: 'detail/:id',
                        name: 'LongmenLotteryDetail',
                        redirect: 'detail/:id/info',
                        component: () => import('../../../../views/marketing-manage/activities/longmen-festival/lottery/Detail.vue'),
                        props: true,
                        meta: {
                            title: ''
                        },
                        children: [
                            {
                                path: 'info',
                                name: 'LongmenLotteryInfo',
                                component: () => import('../../../../views/marketing-manage/activities/longmen-festival/lottery/Detail-Info.vue'),
                                props: true,
                                meta: {
                                    title: '活动详情'
                                }
                            },
                            {
                                path: 'data',
                                name: 'LongmenLotteryData',
                                component: () => import('../../../../views/marketing-manage/activities/longmen-festival/lottery/Detail-Data.vue'),
                                props: true,
                                meta: {
                                    title: '活动数据'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                path: 'public-benefit',
                name: 'LongmenPublicBenefit',
                redirect: 'public-benefit/list',
                component: () => import('../../../../views/marketing-manage/activities/longmen-festival/public-benefit/Index.vue'),
                meta: {
                    title: '公益助力'
                },
                children: [
                    {
                        path: 'list',
                        name: 'LongmenPublicBenefitList',
                        component: () => import('../../../../views/marketing-manage/activities/longmen-festival/public-benefit/List.vue'),
                        meta: {
                            title: ''
                        }
                    },
                    {
                        path: 'add',
                        name: 'AddLongmenPublicBenefit',
                        component: () => import('../../../../views/marketing-manage/activities/longmen-festival/public-benefit/Add.vue'),
                        meta: {
                            title: '添加活动'
                        }
                    },
                    {
                        path: 'edit/:id',
                        name: 'EditLongmenPublicBenefit',
                        component: () => import('../../../../views/marketing-manage/activities/longmen-festival/public-benefit/Add.vue'),
                        props: true,
                        meta: {
                            title: '编辑活动'
                        }
                    },
                    {
                        path: 'edit/:id/:copy',
                        name: 'CopyLongmenPublicBenefit',
                        component: () => import('../../../../views/marketing-manage/activities/longmen-festival/public-benefit/Add.vue'),
                        props: true,
                        meta: {
                            title: '复制活动'
                        }
                    },
                    {
                        path: 'detail/:id',
                        name: 'LongmenPublicBenefitDetail',
                        redirect: 'detail/:id/info',
                        component: () => import('../../../../views/marketing-manage/activities/longmen-festival/public-benefit/Detail.vue'),
                        props: true,
                        meta: {
                            title: ''
                        },
                        children: [
                            {
                                path: 'info',
                                name: 'LongmenPublicBenefitInfo',
                                component: () => import('../../../../views/marketing-manage/activities/longmen-festival/public-benefit/Detail-Info.vue'),
                                props: true,
                                meta: {
                                    title: '活动详情'
                                }
                            },
                            {
                                path: 'data',
                                name: 'LongmenPublicBenefitData',
                                component: () => import('../../../../views/marketing-manage/activities/longmen-festival/public-benefit/Detail-Data.vue'),
                                props: true,
                                meta: {
                                    title: '活动数据'
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
