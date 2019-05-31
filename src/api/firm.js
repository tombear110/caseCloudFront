/**
 * @Author: tombear
 * @Date:   2018-05-24 16:30:16
 */



import fetch from 'common/fetch'

//存储
export function save(data) {
    return fetch({
        url: `lawfirm`,
        method: 'post',
        data
    })
}
//查看
export function look(id) {
    return fetch({
        url:`lawfirm/${id}`,
        method:'get',
    })
}
//编辑律所信息
export function edit(id,data) {
    return fetch({
        url:`lawfirm/${id}/edit`,
        method:'post',
        data
    })
}
//修改律所信息
export function put(id,data) {
    return fetch({
        url:`lawfirm/${id}`,
        method:'put',
        data,
    })
}
//加入律所
export function join(data) {
    return fetch({
        url:`joinFirm`,
        method:'post',
        data
    })
}
//账号列表 type=1 律师 2 行政
export function accountList(params) {
    return fetch({
        url:`firm_user`,
        method:'get',
        params,
    })
}

//分所列表
export function firmList() {
    return fetch({
        url:`lawfirm`,
        method:'get',
    })
}
