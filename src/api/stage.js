/*
 * @Author: tombear
 * @LastEditors: tombear
 * @Descriptption:
 * @Date: 2019-02-21 11:31:07
 * @LastEditTime: 2019-02-21 11:31:11
 */

import fetch from 'common/fetch'
//案件阶段-列表
export function list(params) {
    return fetch({
        url: 'stage',
        method: 'get',
        params
    })
}


//存储,修改
export function save(params, id) {
    if (id) {
        return fetch({
            url: `stage/${id}`,
            method: 'put',
            params
        })
    } else {
        return fetch({
            url: 'stage',
            method: 'post',
            params
        })
    }

}


//案件阶段-删除
export function deleted(id) {
    return fetch({
        url: `stage/${id}`,
        method: 'delete',
    })
}
