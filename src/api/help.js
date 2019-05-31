

import fetch from 'common/fetch'
//1,帮助文档；2,更新日志；；4,法律视野 列表
export function helpList(params) {
    return fetch({
        url:`article`,
        method: 'get',
        params
    })
}
//常见问题
export function faqList() {
    return fetch({
        url:`faq`,
        method: 'get',
    })
}
//查看
export function helpLook(id) {
    return fetch({
        url:`article/${id}`,
        method: 'get',
    })
}


//反馈
//反馈 列表
export function feedbackList(params) {
    return fetch({
        url:`feedback`,
        method: 'get',
        params
    })
}
//反馈 存储
export function feedbackStore(params) {
    return fetch({
        url:`feedback`,
        method: 'post',
        params
    })
}
//反馈 查看
export function feedbackLook(code) {
    return fetch({
        url:`feedback/${code}`,
        method: 'get',
    })
}
//反馈 修改
export function feedbackChange(id,params) {
    return fetch({
        url:`feedback/${id}`,
        method: 'post',
        params
    })
}
//反馈 回复
export function feedbackReply(params,data) {
    return fetch({
        url:`reply`,
        method: 'post',
        params,
        data
    })
}
//反馈 删除
export function feedbackDelete(id) {
    return fetch({
        url:`feedback/${id}`,
        method: 'delete',
    })
}
