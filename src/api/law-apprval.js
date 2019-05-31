//律所案件

import fetch from 'common/fetch'


//列表
export function list(params) {
    return fetch({
        url:`firmapprval`,
        method:'get',
        params
    })
}
// 创建
// export function create() {
//     return fetch({
//         url:port_apprval.create,
//         method:'get',
//     })
// }

//存储
export function save(data) {
    return fetch({
        url:`firmapprval`,
        method:'post',
        data
    })
}
// 查看
export function look(id) {
    return fetch({
        url:`firmapprval/${id}`,
        method:'get',
    })
}


//更新
// export function update(id) {
//     return fetch({
//         url:port_apprval.update+id,
//         method:'put',
//     })
// }
//删除
export function del(id) {
    return fetch({
        url:`firmapprval/${id}`,
        method:'delete',
    })
}

//修改
export function put(id,data) {
    return fetch({
        url:`firmapprval/${id}`,
        method:'put',
        data
    })
}
