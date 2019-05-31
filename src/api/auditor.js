/**
 * @Author: tombear
 * @Date:   2018-05-29 18:50:11
 */


import fetch from 'common/fetch'

export function save(data) {
    return fetch({
        url:`auditor`,
        method:'post',
        data
    })
}

export function list(params) {
    return fetch({
        url:`auditor`,
        method:'get',
        params
    })
}

export function del(id) {
    return fetch({
        url:`auditor/${id}`,
        method:'delete',
    })
}




