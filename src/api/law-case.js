//律所案件

import fetch from 'common/fetch'

//列表
export function list(params) {
    return fetch({
        url:`firmcase`,
        method:'get',
        params
    })
}
// 创建
export function create(params) {
    return fetch({
        url:`firmcase/create`,
        method:'get',
        params
    })
}

//存储
export function save(data) {
    return fetch({
        url:`firmcase`,
        method:'post',
        data
    })
}
//查看
export function look(id) {
    return fetch({
        url:`firmcase/${id}`,
        method:'get',
    })
}

//编辑
export function edit(id) {
    return fetch({
        url:`firmcase/${id}/edit`,
        method:'get',
    })
}

//更新
export function update(id,data) {
    return fetch({
        url:`firmcase/${id}`,
        method:'put',
        data
    })
}
//删除
export function del(id) {
    return fetch({
        url:`firmcase/${id}`,
        method:'delete',
    })
}
