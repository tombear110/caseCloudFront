import fetch from 'common/fetch'

//获取策略列表
export function list(params) {
    return fetch({
        url: 'strategy',
        method: 'get',
        params
    })
}

//存储策略
export function save(params) {
    return fetch({
        url: 'strategy',
        method: 'post',
        params
    })
}

//查看策略
export function look(id) {
    return fetch({
        url: `strategy/${id}`,
        method: 'get'
    })
}

//编辑策略
export function edit(id) {
    return fetch({
        url: `strategy/${id}/edit`,
        method: 'get'
    })
}

//修改策略
export function modify(params, id) {
    return fetch({
        url: `strategy/${id}`,
        method: 'put',
        params
    })
}

//删除策略
export function deleted(params, id) {
    return fetch({
        url: `strategy/${id}`,
        method: 'delete',
        params
    })
}