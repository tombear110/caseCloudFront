/**
 * @Author: tombear
 * @Date:   2018-06-01 09:38:00
 */

//律师律所管理-文书报审

import fetch from 'common/fetch'



//列表
export function create() {
    return fetch({
        url:`firmfile/create`,
        method:'get',
    })
}
//列表
export function list(params) {
    return fetch({
        url:`firmfile`,
        method:'get',
        params
    })
}
//临时上传
export function temp(data) {
    return fetch({
        url:`uploadTempFile`,
        method:'post',
        data
    })
}

//存储
export function save(data) {
    return fetch({
        url:`firmfile`,
        method:'post',
        data
    })
}
//查看
export function look(id) {
    return fetch({
        url:`firmfile/${id}`,
        method:'get',
    })
}

//编辑
export function edit(id) {
    return fetch({
        url:`firmfile/${id}/edit`,
        method:'get',
    })
}

//更新
export function update(id,data) {
    return fetch({
        url:`firmfile/${id}`,
        method:'put',
        data
    })
}
//删除
export function del(id) {
    return fetch({
        url:`firmfile/${id}`,
        method:'delete',
    })
}
