/*
 * @Author: tombear
 * @LastEditors: tombear
 * @Descriptption: 统计分析
 * @Date: 2019-02-26 11:50:09
 * @LastEditTime: 2019-02-26 11:52:29
 */

import fetch from 'common/fetch'

export function time(params) {
    return fetch({
        url: `analytics/timecost`,
        method:'get',
        params: params,
    })
}

export function fee(params) {
    return fetch({
        url: `analytics/feecost`,
        method: 'get',
        params: params,
    })
}


export function data(params) {
    return fetch({
        url: `analytics`,
        method: 'get',
        params: params,
    })
}


// export function fee(params) {
//     return fetch({
//         url: `analytics/feecost`,
//         method: 'get',
//         params: params,
//     })
// }




