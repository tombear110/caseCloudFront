
import fetch from 'common/fetch'
//获取首页所有数据
export function homeData() {
    return fetch({
        url:`dashboard`,
        method: 'get',
    })
}
//获取日程管理数据
export function calendarData(params) {
    return fetch({
        url:`calendar`,
        method: 'get',
        params
    })
}

//首页---del某一条通知
export function msgDel(id) {
    return fetch({
        url:`message/${id}`,
        method: 'delete',
    })
}

//首页---get通知列表
export function msgList(params) {
    return fetch({
        url:`message`,
        method: 'get',
        params
    })
}
//消息--标记全部已读
export function msgRead() {
    return fetch({
        url:`message/cleanAllUnread`,
        method: 'post',
    })
}
//消息--单条消息状态更新
export function msgPut(id,params) {
    return fetch({
        url:`message/${id}`,
        method: 'put',
        params
    })
}
//获取统计分析-个人统计
export function analysisPersonal() {
    return fetch({
        url:`analytics/personal`,
        method: 'get',
    })
}
//获取统计分析-案件数据
export function analysisCase() {
    return fetch({
        url:`analytics/lawcase`,
        method: 'get',
    })
}
//获取统计分析-项目数据
export function analysisProject() {
    return fetch({
        url:`analytics/project`,
        method: 'get',
    })
}
//获取统计分析-客户数据
export function analysisCustomer() {
    return fetch({
        url:`analytics/client`,
        method: 'get',
    })
}
//获取回收站-案件
export function recycleBinCase(params) {
    return fetch({
        url:`recycle/lawcase`,
        method: 'get',
        params
    })
}
//获取回收站-案件
export function recycleBinProject(params) {
    return fetch({
        url:`recycle/project`,
        method: 'get',
        params
    })
}
//获取回收站-案件
export function recycleBinCustomer(params) {
    return fetch({
        url:`recycle/client`,
        method: 'get',
        params
    })
}
//获取回收站-案件
export function recycleBinRecord(params) {
    return fetch({
        url:`recycle/record`,
        method: 'get',
        params
    })
}
//获取回收站-案件
export function recycleBinDoc(params) {
    return fetch({
        url:`recycle/doc`,
        method: 'get',
        params
    })
}
