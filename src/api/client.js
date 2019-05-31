//客户管理

import fetch from 'common/fetch'

//列表
export function clientList(params) {
    return fetch({
        url:`client`,
        method:'get',
        params
    })
}
//共享客户列表
export function clientShareList(params) {
    return fetch({
        url:'shareClient',
        method:'get',
        params
    })
}
// 创建
export function clientCreate() {
    return fetch({
        url:`client/create`,
        method:'get',
    })
}

//存储
export function clientStore(data) {
    return fetch({
        url:`client`,
        method:'post',
        data
    })
}
//查看
export function clientLook(code) {
    return fetch({
        url:`client/${code}`,
        method:'get',
    })
}
//编辑
export function clientEdit(code) {
    return fetch({
        url:`client/${code}/edit`,
        method:'get',
    })
}
//修改
export function clientPut(data,id) {
    return fetch({
        url:`client/${id}`,
        method:'put',
        data
    })
}
//删除
export function clientDel(id,params) {
    return fetch({
        url:`client/${id}`,
        method:'delete',
        params
    })
}
//获取客户名下的所有记录
export function clientRecord(id,params) {
    return fetch({
        url:`getRecordsByClient/${id}`,
        method:'get',
        params
    })
}
//客户列表搜索框默认数据
export function clientSearchData() {
    return fetch({
        url:`clientSearch`,
        method:'get',
    })
}

//客户导入--提交
export function clientImport(data) {
    return fetch({
        url:`importClient`,
        method:'post',
        data
    })
}
