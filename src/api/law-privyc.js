/**
 * @Author: tombear
 * @Date:   2018-06-05 13:55:12
 */


import fetch from 'common/fetch'
// 查询
export function list(params) {
    return fetch({
        url:`firmprivyc`,
        method:'get',
        params
    })
}
