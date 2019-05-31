//客户管理

import fetch from 'common/fetch'

//列表
export function invoiceList(params) {
    return fetch({
        url:`invoice`,
        method:'get',
        params
    })
}
// 创建
export function invoiceCreate(params) {
    return fetch({
        url:`invoice/create`,
        method:'get',
        params
    })
}

//存储
export function invoiceStore(data) {
    return fetch({
        url:`invoice`,
        method:'post',
        data
    })
}
//查看
export function invoiceLook(code) {
    return fetch({
        url:`invoice/${code}`,
        method:'get',
    })
}
//编辑
export function invoiceEdit(code) {
    return fetch({
        url:'invoice/'+code+'/edit',
        method:'get',
    })
}
//修改
export function invoicePut(data,id) {
    return fetch({
        url:`invoice/${id}`,
        method:'put',
        data
    })
}
//删除
export function invoiceDel(id) {
    return fetch({
        url:`invoice/${id}`,
        method:'delete',
    })
}
