/**
 * 用户请求数据配置.
 * @Author: tm
 * @Date:   2017-07-28 16:51:05
 * @Email:  tianming2015@foxmail.com
 * @Last modified by:   tm
 * @Last modified time: 2017-08-01 13:49:37
 */



import fetch from 'common/fetch'

// import {port_case} from 'common/port_uri'
//搜索框默认数据
export function caseSearch(params) {
    return fetch({
        url:`lawcases`,
        method:'get',
        params
    })
}
// 共享案件表格数据
export function shareList(params) {
    return fetch({
        url:"shareCases",
        method:'get',
        params
    })
}
//待分配案件列表
export function assignList(params) {
    return fetch({
        url:`lawcases/history`,
        method:'get',
        params
    })
}
//创建案件列表
export function caseList(gstatus,params) {
    return fetch({
        url:'lawcases/'+gstatus+'/gstatus',
        method:'get',
        params
    })
}
//创建案件表单
export function caseCreate() {
    return fetch({
        url:`lawcases/create`,
        method:'get',
    })
}
//获取案件-地区
export function caseArea() {
    return fetch({
        url:`area`,
        method:'get',
    })
}
//获取案件-案由
export function caseAnyou(params) {
    return fetch({
        url:`anyou`,
        method:'get',
        params
    })
}

//存储/修改 案件
export function save(data,uid) {
    if (uid){
        return fetch({
            url:`lawcases/${uid}`,
            method:'put',
            data
        })
    }else {
        return fetch({
            url:`lawcases`,
            method:'post',
            data
        })
    }

}

//存储案件表单
export function caseSaveInfo(data) {
    return fetch({
        url:`lawcases`,
        method:'post',
        data
    })
}
//查看案件表单
export function caseShow(code) {
    return fetch({
        url:`lawcases/${code}`,
        method:'get',
    })
}
//修改案件表单
export function caseChange(data,uid) {
    return fetch({
        url:`lawcases/${uid}`,
        method:'put',
        data
    })
}
//删除案件
export function caseDelete(code,params) {
    return fetch({
        url:`lawcases/${code}`,
        method:'delete',
        params
    })
}
//查看案件编辑表单
export function caseEdit(code) {
    return fetch({
        url:`lawcases/${code}/edit`,
        method:'get',
    })
}


//庭审实况
//庭审列表
export function trialList(params) {
    return fetch({
        url:`trial`,
        method:'get',
        params
    })
}
//庭审创建
export function trialCreate() {
    return fetch({
        url:`trial/create`,
        method:'get',

    })
}
//庭审存储
export function trialStore(data) {
    return fetch({
        url:`trial`,
        method:'post',
        data

    })
}
//庭审查看
export function trialLook(id) {
    return fetch({
        url:`trial/${id}`,
        method:'get',
    })
}
// /trial/{tr_code}/edit
//庭审编辑（编辑页面信息展示）
export function trialEdit(id) {
    return fetch({
        url:`/trial/${id}/edit`,
        method:'get',
    })
}
//庭审修改
export function trialChange(data,id) {
    return fetch({
        url:`trial/${id}`,
        method:'put',
        data
    })
}
//庭审删除
export function trialDelete(id) {
    return fetch({
        url:`trial/${id}`,
        method:'delete',
    })
}

//任务指派
//任务列表
// type：1为案件任务，2为非诉任务（地址参数必须存在）
export function taskList( params,id) {
    return fetch({
        url:`task/${id}/type`,
        method:'get',
        params
    })
}
//任务创建
export function taskCreate() {
    return fetch({
        url:`task/create`,
        method:'get',
    })
}
//任务存储
export function taskStore(data) {
    return fetch({
        url:`task`,
        method:'post',
        data

    })
}
//任务查看
export function taskLook(id) {
    return fetch({
        url:`task/${id}`,
        method:'get',
    })
}
// /task/{tr_code}/edit
//任务编辑（编辑页面信息展示）
export function taskEdit(pid) {
    return fetch({
        url:'/task/'+pid+'/edit',
        method:'get',
    })
}
//任务修改
export function taskChange(data,id) {
    return fetch({
        url:`task/${id}`,
        method:'put',
        data
    })
}
//任务删除
export function taskDelete(id) {
    return fetch({
        url:`task/${id}`,
        method:'delete',
    })
}


//当事人

// 当事人列表
export function privycList(params) {
    return fetch({
        url:`privyc`,
        method: 'get',
        params
    })
}
//编辑
export function privycEdit(id) {
    return fetch({
        url: `/privyc/${id}/edit`,
        method: 'get',
    })
}
//修改
export function privycChange(data,id) {
    return fetch({
        url:`privyc/${id}`,
        method: 'put',
        data
    })
}
//查看
export function privycLook(id) {
    return fetch({
        url:`privyc/${id}`,
        method: 'put',
    })
}
//删除
export function privycDelete(id) {
    return fetch({
        url:`privyc/${id}`,
        method: 'delete',
    })
}
//承办人员表
//编辑
export function judgeEdit(id) {
    return fetch({
        url: `/judge/${id}/edit`,
        method: 'get',
    })
}
//修改
export function judgeChange(data,id) {
    return fetch({
        url:`judge/${id}`,
        method: 'put',
        data
    })
}
//删除
export function cbDel(id) {
    return fetch({
        url:`judge/${id}`,
        method: 'delete',
    })
}

//共享api

//共享搜索
export function shareSearch(params) {
    return fetch({
        url:'/searchUser',
        method: 'get',
        params
    })
}
//案件共享 编辑
export function shareEdit(id,params) {
    return fetch({
        url:`/share/${id}/edit`,
        method: 'get',
        params
    })
}
// 案件共享 存储
export function shareStore(params) {
    return fetch({
        url:`share`,
        method: 'post',
        params
    })
}
//案件共享 修改
export function sharePut(id,params) {
    return fetch({
        url:`share/${id}`,
        method: 'put',
        params
    })
}
//案件共享 解除单个
export function shareDel(id) {
    return fetch({
        url:`share/${id}`,
        method: 'delete',
    })
}
//案件共享 解除所有
export function shareDelAll(id,params) {
    return fetch({
        url:`/share/${id}/delAll`,
        method: 'delete',
        params
    })
}

//案件复制
export function copy(data) {
    return fetch({
        url:'/copyLawcase',
        method: 'post',
        data
    })
}

//批量创建
export function batchCreate(data) {
    return fetch({
        url:'/storeLawcases',
        method: 'post',
        data
    })
}



//批量创建
export function caseProcess(params) {
    return fetch({
        url:'/processes',
        method: 'get',
        params
    })
}
