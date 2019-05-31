/**
 * @Date:   2017-07-28 18:10:59
 * @Email:  tianming2015@foxmail.com
 * @Last modified time: 2017-08-02 13:34:36
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
    Message
} from 'element-ui'

Vue.use(VueRouter)

//使用AMD方式加载
// component: resolve => require(['pages/home'], resolve),

// const _import = require('./_import_' + process.env.NODE_ENV)

const routes = [{
        path: '/404',
        name: 'notPage',
        component: resolve => require(['pages/error/404'], resolve),
        meta: {
            title: 'notFond',
            directAccess: true //为true，无需登录即可访问
        }

    },
    {
        path: '/invalid',
        name: 'invalidPage',
        // component: invalidPageCp
        component: resolve => require(['pages/error/invalid'], resolve),
        meta: {
            title: 'invalidPage',
            directAccess: true //为true，无需登录即可访问
        }
    },

    {
        path: '*',
        redirect: '/404',
        meta: {
            title: '404',
            directAccess: true //为true，无需登录即可访问
        }
    },

    {
        path: '/login',
        name: 'login',
        component: resolve => require(['pages/user/qrLogin'], resolve),
        meta: {
            title: '登录',
            directAccess: true //为true，无需登录
        }
    },
    {
        path: '/user-info',
        name: 'userInfo',
        component: resolve => require(['pages/user/user-info'], resolve),
        meta: {
            title: '个人信息'
        }
    },
    {
        path: '/user',
        redirect: '/login',
        component: resolve => require(['pages/user/index'], resolve),
        children: [{
                path: '/old_login',
                name: 'old_login',
                component: resolve => require(['pages/user/login'], resolve),
                meta: {
                    title: '登录',
                    directAccess: true //为true，无需登录即可访问
                }
            },
            {
                path: '/register',
                name: 'register',
                component: resolve => require(['pages/user/register'], resolve),
                meta: {
                    title: '注册',
                    directAccess: true
                }
            },
            {
                path: '/forget',
                name: 'forget',
                component: resolve => require(['pages/user/forget'], resolve),
                meta: {
                    title: '找回密码',
                    directAccess: true
                }
            },
            {
                path: '/firm_info',
                name: 'registerFirmInfo',
                component: resolve => require(['pages/user/firmInfo'], resolve),
                meta: {
                    title: '完善律所信息'
                }
            },
            {
                path: '/user/reset-password',
                name: 'resetPassword',
                component: resolve => require(['pages/user/reset-password'], resolve),
                meta: {
                    title: '重置密码',
                    directAccess: true
                }
            }
        ]
    },

    {
        path: '/team/invite-judge', //根据团队邀请信息判断,邀请团队最先到这个页面
        name: 'inviteJudge',
        component: resolve => require(['pages/team/invite-judge/index'], resolve),
        meta: {
            title: '团队邀请-判断',
            directAccess: true
        }
    },
    {
        path: '/',
        // name:'calendar',
        redirect: '/calendar',
        component: resolve => require(['pages/App'], resolve),
        children: [
            // -------------------------------------案件-------------------------------
            {
                path: '/calendar',
                redirect: '/calendar/my-month',
                name: 'calendar',
                component: resolve => require(['pages/calendar/index'], resolve),
                children: [
                    // -------------------------------------日程管理-------------------------------
                    {
                        path: '/calendar/my-month',
                        name: 'calendarMyMonth',
                        component: resolve => require(['pages/calendar/my/my-month'], resolve),
                        meta: {
                            title: '月日程',
                            mark: 30,
                        }
                    },
                    {
                        path: '/calendar/my-week',
                        name: 'calendarMyWeek',
                        component: resolve => require(['pages/calendar/my/my-week'], resolve),
                        meta: {
                            title: '周日程',
                            mark: 7,
                        }
                    },
                    {
                        path: '/calendar/my-year',
                        name: 'calendarMyYear',
                        component: resolve => require(['pages/calendar/my/my-year'], resolve),
                        meta: {
                            title: '年日程',
                            mark: 365,
                        }
                    },
                    {
                        path: '/calendar/team-week',
                        name: 'calendarTeamWeek',
                        component: resolve => require(['pages/calendar/team/team-week'], resolve),
                        meta: {
                            title: '团队日程',
                            mark: 7,
                        }
                    },
                    {
                        path: '/calendar/team-day',
                        name: 'calendarTeamDay',
                        component: resolve => require(['pages/calendar/team/team-day'], resolve),
                        meta: {
                            title: '团队日',
                            mark: 1,
                        }
                    },
                    // -------------------------------------日程管理-------------------------------
                ]
            },

            // -------------------------------------案件-------------------------------


            // -------------------------------------辅助刷新页-------------------------------
            {
                path: '/reload',
                name: 'reload',
                component: resolve => require(['pages/reload/index'], resolve),
                meta: {
                    title: '刷新页' //用于某些情况下要刷新当前页，但是window.reload体验太差
                }
            },
            // -------------------------------------辅助刷新页-------------------------------
            // -------------------------------------无权限-------------------------------
            {
                path: '/permission',
                name: 'noPermission ',
                component: resolve => require(['pages/error/permission'], resolve),
                meta: {
                    title: '无权限'
                }
            },
            // -------------------------------------无权限-------------------------------
            // -------------------------------------案件-------------------------------
            {
                path: '/case',
                redirect: '/case/my',
                name: 'case',
                component: resolve => require(['pages/cases/index'], resolve),
                children: [{
                        path: 'my',
                        name: 'caseMy',
                        component: resolve => require(['pages/cases/first/In'], resolve),
                        meta: {
                            title: '我的在办案件',
                            keepAlive: true,
                            isBack: false, //用于判断上一个页面是哪个
                            lastRoute: '' //判断上一个路由名字
                        }
                    },
                    {
                        path: 'share',
                        name: 'caseShare',
                        component: resolve => require(['pages/cases/first/Share'], resolve),
                        meta: {
                            title: '共享案件'

                        }
                    },

                    {
                        path: 'team',
                        name: 'caseTeam',
                        component: resolve => require(['pages/cases/first/Team'], resolve),
                        meta: {
                            title: '团队案件'
                        }
                    }, {
                        path: '',
                        component: resolve => require(['pages/cases/first/Detail'], resolve),
                        children: [{
                            path: '/case/:code',
                            name: 'caseDetail',
                            components: {
                                default: function (res) {
                                    require(['pages/cases/second/record'], res)
                                },
                                info: function (res) {
                                    require(['pages/cases/second/info'], res)
                                },
                                doc: function (res) {
                                    require(['pages/cases/second/doc'], res)
                                }
                            },
                            meta: {
                                title: '案件详情'
                            }
                        }]
                    }
                ]
            },

            // -------------------------------------案件-------------------------------

            // -------------------------------------拓展-S-------------------------------
            {
                path: '/expand/export-pdf',
                name: 'expand_export',
                component: resolve => require(['pages/expand/export-pdf'], resolve),
                meta: {
                    title: '拓展'
                }
            },
            // -------------------------------------拓展-E-------------------------------

            // -------------------------------------团队管理-------------------------------
            {
                path: 'team',
                component: resolve => require(['pages/team/team-manage/index'], resolve),
                children: [{
                    path: '/team-manage',
                    name: 'teamManage',
                    components: {
                        default: function (res) {
                            require(['pages/team/team-manage/team/index'], res)

                        },
                        memberList: function (res) {
                            require(['pages/team/team-manage/member/index'], res)
                        }
                    },
                    meta: {
                        title: '团队管理'
                    }
                }]
            },
            // -------------------------------------个人中心-------------------------------

            // -------------------------------------律所管理-------------------------------
            {
                path: '/firm_manage',
                name: 'firm_manage',
                redirect: '/firm_manage/firm_detail',
                component: resolve => require(['pages/firm-manage/index'], resolve),
                children: [{
                        path: '/firm_manage/firm_detail',
                        name: 'firm_detail',
                        redirect: '/firm_manage/firm_info',
                        component: resolve => require(['pages/firm-manage/first/FirmDetail'], resolve),
                        children: [{
                            path: '/firm_manage/firm_info',
                            name: 'firm_info',
                            components: {
                                default: function (res) {
                                    require(['pages/firm-manage/second/FirmInfo'], res)
                                },
                                manageList: function (res) {
                                    require(['pages/firm-manage/second/FirmManage'], res)
                                },
                                staffList: function (res) {
                                    require(['pages/firm-manage/second/FirmStaff'], res)
                                }
                            },
                            meta: {
                                title: '律所信息'
                            }
                        }]
                    }, {
                        path: '/firm_manage/filiale_list',
                        name: 'filiale_list',
                        component: resolve => require(['pages/firm-manage/first/FilialeList'], resolve),
                        meta: {
                            title: '分所列表'
                        }
                    },
                    {
                        path: '/firm_manage/filiale_detail',
                        name: 'filiale_detail',
                        redirect: '/firm_manage/filiale_info',
                        component: resolve => require(['pages/firm-manage/first/FilialeDetail'], resolve),
                        children: [{
                            path: '/firm_manage/filiale_info',
                            name: 'filiale_info',
                            components: {
                                default: function (res) {
                                    require(['pages/firm-manage/second/FilialeInfo'], res)
                                },
                                team: function (res) {
                                    require(['pages/firm-manage/second/FilialeTeam'], res)
                                },
                                member: function (res) {
                                    require(['pages/firm-manage/second/FilialeMember'], res)
                                }
                            },
                            meta: {
                                title: '分所详情'
                            }
                        }]
                    }

                ]
            },
            // -------------------------------------律所管理-------------------------------

            // -------------------------------------律所事务-------------------------------
            {
                path: '/firm_runtime',
                name: 'firm_runtime',
                redirect: '/firm_runtime/case_report',
                component: resolve => require(['pages/firm-runtime/index'], resolve),
                children: [{
                    path: '/firm_runtime/case_report',
                    name: 'case_report',
                    component: resolve => require(['pages/firm-runtime/first/CaseReport'], resolve),
                    meta: {
                        title: '案件报审'
                    }
                }, {
                    path: '/firm_runtime/doc_report',
                    name: 'doc_report',
                    component: resolve => require(['pages/firm-runtime/first/DocReport'], resolve),
                    meta: {
                        title: '文书报审'
                    }
                }, {
                    path: '/firm_runtime/task',
                    name: 'task_report',
                    component: resolve => require(['pages/firm-runtime/first/MyTask'], resolve),
                    meta: {
                        title: '我的任务'
                    }
                }]

            },
            // -------------------------------------律所事务-------------------------------

            // -------------------------------------数据统计-------------------------------
            {
                path: '/analysis',
                name: 'analysis',
                redirect: '/analysis/time',
                component: resolve => require(['pages/analysis'], resolve),
                children: [{
                        path: '/analysis/time',
                        name: 'analysisTime',
                        component: resolve => require(['pages/analysis/time'], resolve),
                        meta: {
                            title: '工时统计'
                        }
                    },
                    {
                        path: '/analysis/fee',
                        name: 'analysisFee',
                        component: resolve => require(['pages/analysis/fee'], resolve),
                        meta: {
                            title: '成本统计'
                        }
                    },
                    {
                        path: '/analysis/income',
                        name: 'analysisIncome',
                        component: resolve => require(['pages/analysis/income'], resolve),
                        meta: {
                            title: '收益统计'
                        }
                    },
                    {
                        path: '/analysis/data',
                        name: 'analysisData',
                        component: resolve => require(['pages/analysis/data'], resolve),
                        meta: {
                            title: '我的战绩'
                        }
                    },

                ]
            },
            // -------------------------------------数据统计-------------------------------

            // -------------------------------------行政审批-------------------------------
            {
                path: '/audit_staff',
                name: 'audit_staff',
                redirect: '/audit_staff/case',
                component: resolve => require(['pages/audit-staff/index'], resolve),
                children: [{
                    path: '/audit_staff/case',
                    name: 'staff_case',
                    component: resolve => require(['pages/audit-staff/first/Case'], resolve),
                    meta: {
                        title: '待审案件'
                    }
                }, {
                    path: '/audit_staff/doc',
                    name: 'staff_doc',
                    component: resolve => require(['pages/audit-staff/first/Doc'], resolve),
                    meta: {
                        title: '待审文书'
                    }
                }, {
                    path: '/audit_staff/case_new',
                    name: 'staff_case_new',
                    component: resolve => require(['pages/audit-staff/first/CaseNew'], resolve),
                    meta: {
                        title: '案件审批新增'
                    }
                }, {
                    path: '/audit_staff/doc_new',
                    name: 'staff_doc_new',
                    component: resolve => require(['pages/audit-staff/first/DocNew'], resolve),
                    meta: {
                        title: '文书审批新增'
                    }
                }]

            },
            // -------------------------------------行政审批-------------------------------

            // -------------------------------------消息通知-------------------------------
            {
                path: '/notify',
                name: 'notify',
                redirect: '/notify/help',
                component: resolve => require(['pages/notify//index'], resolve),
                children: [{
                    path: '/notify/help',
                    name: 'notify_help',
                    components: {
                        default: function (res) {
                            require(['pages/notify/notifyHelp/index'], res)
                        },
                        notifyLog: function (res) {
                            require(['pages/notify/notifyHelp/index'], res)
                        },
                        notifyFaq: function (res) {
                            require(['pages/notify/notifyFaq/index'], res)
                        }
                    },
                    meta: {
                        title: '帮助文档'
                    }
                }]

            },
            // -------------------------------------消息通知-------------------------------

            // -------------------------------------工具-------------------------------
            {
                path: '/tool',
                name: 'tool',
                redirect: '/tool/search',
                component: resolve => require(['pages/tool'], resolve),
                children: [{
                    path: '/tool/search',
                    name: 'tool_search',
                    // component: resolve => require(['pages/tool/search'], resolve),
                    components: {
                        default: function (res) {
                            require(['pages/tool/search'], res)
                        },
                        toolCaculate: function (res) {
                            require(['pages/tool/caculate'], res)
                        },
                        toolCourthouse: function (res) {
                            require(['pages/tool/courthouse'], res)
                        }
                    },
                    meta: {
                        title: '工具'
                    }
                }]
            },
            // -------------------------------------工具-------------------------------

            // -------------------------------------客户管理-------------------------------
            {
                path: '/client',
                name: 'client',
                redirect: '/client/my',
                component: resolve => require(['pages/client/index'], resolve),
                children: [{
                    path: '/client/my',
                    name: 'clientMy',
                    component: resolve => require(['pages/client/first/my-team'], resolve),
                    meta: {
                        title: '我的客户'
                    }
                }, {
                    path: '/client/share',
                    name: 'clientShare',
                    component: resolve => require(['pages/client/first/share'], resolve),
                    meta: {
                        title: '共享客户'
                    }
                }, {
                    path: '/client/team',
                    name: 'clientTeam',
                    component: resolve => require(['pages/client/first/my-team'], resolve),
                    meta: {
                        title: '团队客户'
                    }
                }, {
                    path: 'client/code',
                    component: resolve => require(['pages/client/first/detail'], resolve),
                    children: [{
                        path: '/client/:code',
                        name: 'clientDetail',
                        components: {
                            default: function (res) {
                                require(['pages/client/second/info'], res)
                            },
                            file: function (res) {
                                require(['pages/client/second/file'], res)
                            },
                            project: function (res) {
                                require(['pages/client/second/link-project'], res)
                            },
                            linkRecord: function (res) {
                                require(['pages/client/second/record'], res)
                            },
                            projectRecord: function (res) {
                                require(['pages/client/second/record'], res)
                            },

                        },
                        meta: {
                            title: '客户详情'
                        }
                    }]
                }]
            },
            // -------------------------------------客户管理-------------------------------

            {
                path: '/project/lawsuit',
                name: 'projectLawsuit',
                component: resolve => require(['pages/project/first/list'], resolve),
                meta: {
                    title: '诉讼项目'
                }
            },
            {
                path: '/project/non-lawsuit',
                name: 'projectNonLawsuit',
                component: resolve => require(['pages/project/first/list'], resolve),
                meta: {
                    title: '非诉项目'
                }
            },
            {
                path: '/project/team',
                name: 'projectTeam',
                component: resolve => require(['pages/project/first/list'], resolve),
                meta: {
                    title: '团队项目'
                }
            },
            {
                path: '/project/code',
                component: resolve => require(['pages/project/first/detail'], resolve),
                children: [{
                    path: '/project/:code',
                    name: 'projectCode',
                    components: {
                        default: function (res) {
                            require(['pages/project/second/record'], res)
                        },
                        info: function (res) {
                            require(['pages/project/second/info'], res)
                        },
                        case: function (res) {
                            require(['pages/project/second/link-case'], res)
                        },
                        file: function (res) {
                            require(['pages/client/second/file'], res)
                        }
                    },
                    meta: {
                        title: '项目详情'
                    }

                }]
            },
            // -------------------------------------项目管理-------------------------------

            // -------------------------------------批量案件-------------------------------
            {
                path: '/batch',
                name: 'batch',
                component: resolve => require(['pages/batch'], resolve),
                redirect: '/batch/my',
                meta: {
                    title: 'batch'
                },
                children: [{
                    path: '/batch/my',
                    name: 'batchMy',
                    component: resolve => require(['pages/batch/my'], resolve),
                    meta: {
                        title: '我的案件'
                    }
                }, {
                    path: '/batch/import',
                    name: 'batchImport',
                    component: resolve => require(['pages/batch/import'], resolve),
                    meta: {
                        title: '导入案件'
                    }
                }, {
                    path: '/batch/set',
                    name: 'batchSet',
                    component: resolve => require(['pages/batch/set'], resolve),
                    meta: {
                        title: '设置字段'
                    }
                }, {
                    path: '/batch/list',
                    name: 'batchList',
                    component: resolve => require(['pages/batch/list'], resolve),
                    meta: {
                        title: '批次列表'
                    }
                }]
            },
            // -------------------------------------批量案件-------------------------------

            // -------------------------------------创建团队-------------------------------

            // -------------------------------------创建团队-------------------------------
            {
                path: '/create-team',
                name: 'createTeam',
                component: resolve => require(['pages/create-team'], resolve),
                meta: {
                    title: '创建团队'
                }
            }
        ]
    }
]

const router = new VueRouter({
    routes,
    mode: 'history', //default: hash ,history
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {
                x: 0,
                y: 0
            }
        }
    }
})

// 全局路由配置
// 路由开始之前的操作
router.beforeEach((to, from, next) => {
    NProgress.done().start()
    //不需登录的页面
    const isLogin = store.state.user_info.login || false
    //1.登录状态 2. 页面是否无需登录即可进入
    if (!isLogin && !to.meta.directAccess) {
        next({
            name: 'login',
            query: {
                callback: to.fullPath
            }
        })
    } else {
        if (isLogin && to.name === 'login') {
            next({
                path: '/'
            })
        } else {
            next()
        }
    }
})

//动态设置heade中的title
router.afterEach((to, from, next) => {
    document.title = '案件云 - ' + to.meta.title
})

//路由完成之后的操作
router.afterEach(route => {
    NProgress.done()
})

export default router
