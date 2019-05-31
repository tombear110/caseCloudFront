//联系人管理

import fetch from 'common/fetch'

//列表
export function linkmanList(params) {
    return fetch({
        url:`clcontact`,
        method:'get',
        params
    })
}
// // 创建
// export function linkmanCreate() {
//     return fetch({
//         url:port_linkman.create,
//         method:'get',
//     })
// }
//
//存储
export function linkmanStore(data) {
    return fetch({
        url:`clcontact`,
        method:'post',
        data
    })
}
//查看
export function linkmanLook(id) {
    return fetch({
        url:`clcontact/${id}`,
        method:'get',
    })
}
//编辑
export function linkmanEdit(id) {
    return fetch({
        url:'clcontact/'+id+'/edit',
        method:'get',
    })
}
//修改
export function linkmanPut(data,id) {
    return fetch({
        url:`clcontact/${id}`,
        method:'put',
        data
    })
}
//删除
export function linkmanDel(id,data) {
    return fetch({
        url:`clcontact/${id}`,
        method:'delete',
        data
    })
}
