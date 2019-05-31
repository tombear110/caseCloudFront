/**
 * 用户请求数据配置.
 * @Author: tm
 * @Date:   2017-07-28 16:51:05
 * @Email:  tianming2015@foxmail.com
 * @Last modified by:   tm
 * @Last modified time: 2017-08-01 13:49:37
 */



import fetch from 'common/fetch'

//列表
export function projectList(params) {
    return fetch({
        url:`project`,
        method:'get',
        params
    })
}
//创建项目表单
export function projectCreate() {
    return fetch({
        url:`project/create`,
        method:'get',
    })
}

//存储项目表单
export function projectStore(data) {
    return fetch({
        url:`project`,
        method:'post',
        data
    })
}
//查看项目表单
export function projectLook(code) {
    return fetch({
        url:`project/${code}`,
        method:'get',
    })
}
//编辑表单
export function projectEdit(pr_code) {
    return fetch({
        url:'project/'+pr_code+'/edit',
        method:'get',
    })
}
//修改项目表单
export function projectPut(data,id) {
    return fetch({
        url:`project/${id}`,
        method:'put',
        data
    })
}
//删除项目表单
export function projectDel(id,params) {
    return fetch({
        url:`project/${id}`,
        method:'delete',
        params
    })
}
//获取我的客户
//TODO:GETmYcLIENT
export function projectClient() {
    return fetch({
        url:`getMyClient`,
        method:'get',
    })
}

//客户列表搜索框默认数据
export function projectSearchData() {
    return fetch({
        url:`project/search`,
        method:'get',
    })
}
