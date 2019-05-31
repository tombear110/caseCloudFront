/**
 * @Date:   2017-07-28 18:53:48
 * @Email:  tianming2015@foxmail.com
 * @Last modified time: 2017-07-31 14:54:19
 */



import myTab from 'components/my-tab'
import leftMenu from 'components/left-menu'
import topMenu from 'components/top-menu'

import autocompleteSearch from 'components/business/autocomplete-search'


//诉讼案件
import caseNew from 'components/business/case/case-new' //案件新增
import batchNew from 'components/business/case/batch-new' //批量案件新增
import caseDetail from 'components/business/case/case-detail' //案件详情
import caseShare from 'components/business/case/case-share' //案件共享弹窗
import caseCopy from 'components/business/case/case-copy' //案件复制弹窗
import stageNew from 'components/business/stage/stage-new' //案件阶段新增

import caseStep0 from 'components/business/case-step/step0' //案件详情-步骤0
import caseStep1 from 'components/business/case-step/step1' //案件详情-步骤1
import caseStep2 from 'components/business/case-step/step2' //案件详情-步骤2
import caseStep3 from 'components/business/case-step/step3' //案件详情-步骤3
import caseStep4 from 'components/business/case-step/step4' //案件详情-步骤4
import caseStep5 from 'components/business/case-step/step5' //案件详情-步骤5
import caseStep6 from 'components/business/case-step/step6' //案件详情-步骤6
import caseStep7 from 'components/business/case-step/step7' //案件详情-步骤7
import caseStep8 from 'components/business/case-step/step8' //案件详情-步骤8

//非诉项目
import projectNew from 'components/business/project/project-new'
import projectDetail from 'components/business/project/project-detail'

//记录
import recordList from 'components/business/record/record-list' //记录列表
import recordDoc from 'components/business/record/record-doc' //记录列表
import recordDetail from 'components/business/record/record-detail' //记录详情弹窗
import recordEdit from 'components/business/record/record-edit' //记录编辑和新增


//个人中心
import passwordChange from 'components/business/user/password-change'

import userInvite from 'components/business/user/user-invite'

//团队
import teamChange from 'components/business/team/team-change'

//客户
import clientNew from 'components/business/client/client-new'

import contractDetail from 'components/business/client/contract-detail'
import contractAdd from 'components/business/client/contract-add'
import invoiceDetail from 'components/business/client/invoice-detail'
import invoiceAdd from 'components/business/client/invoice-add'
import linkmanDetail from 'components/business/client/linkman-detail'
import linkmanAdd from 'components/business/client/linkman-add'
import clientImport from 'components/business/client/client-import'




//帮助文档
import feedback from 'components/business/qa/feedback'

//批量案件
import batchDetail from 'components/business/batch/batch-detail'
import batchImport from 'components/business/batch/batch-import'



import page from 'components/pagination'  //分页组件
import miniPage from 'components/mini-pagination'  //小型分页组件

import joinLawfirm from 'components/dialog/JoinLawfirm'   //加入律所
import caseApproval from 'components/dialog/CaseApproval'   //案件报审

import caseReport from 'components/list-detail/case-report'  //律所事务-案件报审-详情
import docReportDetail from 'components/list-detail/doc-report-detail'  //律所事务-文书报审-详情
import docApproval from 'components/list-detail/doc-approval'  //律所事务-文书报审-新增/编辑

import taskConflict from 'components/list-detail/task-conflict'  //律所事务-我的任务-冲突处理-详情
import taskContract from 'components/list-detail/task-contract'  //律所事务-我的任务-合同审批-详情
import taskFile from 'components/list-detail/task-file'  //律所事务-我的任务-文件审批-详情

import barRing from 'components/business/analysis/bar-ring'
import barRose from 'components/business/analysis/bar-rose'
import chartsLine from 'components/business/analysis/charts-line'

export {
    myTab,
    leftMenu,
    topMenu,
    page,
    miniPage,

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
    taskFile,
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


}
