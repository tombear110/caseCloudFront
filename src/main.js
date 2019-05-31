//导入Vue框架
import Vue from 'vue'

import dayjs from 'dayjs'

Object.defineProperty(Vue.prototype, '$dayjs', {
    value: dayjs
})

Vue.prototype.$changeStore = function (arr1, arr2){
    //arr2是本地存储的
    for(let key1 in arr1) {
        for(let key2 in arr2) {
            if (key1 === key2) {
                arr2[key2] = arr1[key1]
            } else {
                arr2[key1] = arr1[key1]
            }
        }
    }
    return arr2
}

//
// //导入element组件
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Element, { size: 'medium',  });
import './assets/scss/element-variables.scss'

import IEcharts from './common/lib/echarts-full'

Vue.component('IEcharts', IEcharts)

import {
    myTab,
    leftMenu,
    topMenu,
    page,

    linkmanAdd,
    linkmanDetail,
    contractAdd,
    invoiceAdd,
    invoiceDetail,
    clientImport,

    caseReport,
    docReportDetail,
    taskConflict,
    taskContract,
    joinLawfirm,
    caseApproval,
    caseNew,
    batchNew,
    recordList,
    recordDoc,
    recordDetail,
    recordEdit,
    caseDetail,
    caseShare,
    caseCopy,
    stageNew,
    projectNew,
    projectDetail,
    feedback,
    clientNew,
    passwordChange,

    teamChange,
    userInvite,
    batchDetail,
    batchImport,
    contractDetail,
    docApproval,
    autocompleteSearch,
    caseStep0,
    caseStep1,
    caseStep2,
    caseStep3,
    caseStep4,
    caseStep5,
    caseStep6,
    caseStep7,
    caseStep8,
    barRing,
    barRose,
    chartsLine,
    vipRemind

} from './components'

Vue.component('vipRemind', vipRemind)
Vue.component('myTab', myTab)
Vue.component('leftMenu', leftMenu)
Vue.component('topMenu', topMenu)
Vue.component('page', page)
Vue.component('linkmanAdd', linkmanAdd)
Vue.component('linkmanDetail', linkmanDetail)
Vue.component('contractAdd', contractAdd)
Vue.component('invoiceAdd', invoiceAdd)
Vue.component('invoiceDetail', invoiceDetail)
Vue.component('clientImport', clientImport)
Vue.component('caseReport', caseReport)
Vue.component('docReportDetail', docReportDetail)
Vue.component('taskConflict', taskConflict)
Vue.component('taskContract', taskContract)
Vue.component('joinLawfirm', joinLawfirm)
Vue.component('caseApproval', caseApproval)
Vue.component('caseNew', caseNew)
Vue.component('batchNew', batchNew)
Vue.component('recordList', recordList)
Vue.component('recordDoc', recordDoc)
Vue.component('recordDetail', recordDetail)
Vue.component('recordEdit', recordEdit)
Vue.component('caseDetail', caseDetail)
Vue.component('caseShare', caseShare)
Vue.component('caseCopy', caseCopy)
Vue.component('stageNew', stageNew)
Vue.component('projectNew', projectNew)
Vue.component('projectDetail', projectDetail)
Vue.component('feedback', feedback)
Vue.component('clientNew', clientNew)
Vue.component('passwordChange', passwordChange)
Vue.component('teamChange', teamChange)
Vue.component('userInvite', userInvite)
Vue.component('batchDetail', batchDetail)
Vue.component('batchImport', batchImport)
Vue.component('contractDetail', contractDetail)
Vue.component('docApproval', docApproval)
Vue.component('autocompleteSearch', autocompleteSearch)
Vue.component('caseStep0', caseStep0)
Vue.component('caseStep1', caseStep1)
Vue.component('caseStep2', caseStep2)
Vue.component('caseStep3', caseStep3)
Vue.component('caseStep4', caseStep4)
Vue.component('caseStep5', caseStep5)
Vue.component('caseStep6', caseStep6)
Vue.component('caseStep7', caseStep7)
Vue.component('caseStep8', caseStep8)
Vue.component('barRing', barRing)
Vue.component('barRose', barRose)
Vue.component('chartsLine', chartsLine)

//注册VipRemind插件
import VipRemind from 'components/vip-remind/index.js'
Vue.use(VipRemind)

//全局注册icon-svg
import IconSvg from 'components/icon-svg'
Vue.component('icon-svg', IconSvg)

//导入路由
import router from './router'

//导入状态管理器
import store from 'store'
//导入请求框架
import api from './api'
//导入自定义插件
import Plugins from 'plugins'
//导入主视图文件
import App from './App'

//使用socket
import {
    socket_port
} from 'common/config'
import VueSocketio from 'vue-socket.io'

Vue.use(VueSocketio, socket_port)

//使用自定义插件d
Vue.use(Plugins)

//使用api
Vue.use(api)

//发布后是否显示提示
Vue.config.productionTip = false

//是否开启工具调试
Vue.config.devtools = process.env.NODE_ENV === 'development'

//过滤器
Vue.filter('typeChinese', function (val) {
    if (val === 'host') {
        return '主办';
    } else if (val === 'assit') {
        return '协办';
    } else {
        return '共享';
    }
});

Vue.filter('changePermission', function (val) {
    if (val === 'share_0') {
        return '不可编辑';
    } else if (val === 'share_1') {
        return '可编辑';
    } else {
        return '全部';
    }
});

Vue.filter('numberChinese', function (num) {
    num = Number(num);
    var upperCaseNumber = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '亿'];
    var length = String(num).length;
    if (length == 1) {
        return upperCaseNumber[num];
    } else if (length == 2) {
        if (num == 10) {
            return upperCaseNumber[num];
        } else if (num > 10 && num < 20) {
            return '十' + upperCaseNumber[String(num).charAt(1)];
        } else {
            return upperCaseNumber[String(num).charAt(0)] + '十' + upperCaseNumber[String(num).charAt(1)].replace('零', '');
        }
    }
});


new Vue({
    router,
    store,
    ...App
}).$mount('mainbody')
