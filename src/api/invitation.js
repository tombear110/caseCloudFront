/**
 * @Author: tombear
 * @Date:   2018-05-24 19:04:26
 */


import fetch from 'common/fetch'

//存储
export function save(data) {
    return fetch({
        url: `invitation`,
        method: 'post',
        data
    })
}
//查看--被邀请人注册时，获取基本数据
export function look(params) {
    return fetch({
        url:`invitation`,
        method:'get',
        params
    })
}
//删除---撤销邀请
export function del(id) {
    return fetch({
        url:`invitation/${id}`,
        method:'delete',
    })
}
//更新-重新发送邀请邮件
export function update(id) {
    return fetch({
        url:`invitation/${id}`,
        method:'put',
    })
}
//列表
export function list(params) {
    return fetch({
        url:`invitations`,
        method:'get',
        params
    })
}


