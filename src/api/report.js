//律所案件

import fetch from 'common/fetch'

//列表
export function create(params) {
    return fetch({
        url:`report`,
        method:'post',
        params
    })
}
