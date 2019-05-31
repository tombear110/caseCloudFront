/*
 * @Author: tombear
 * @LastEditors: tombear
 * @Descriptption:
 * @Date: 2018-01-31 11:55:58
 * @LastEditTime: 2019-02-21 13:45:48
 */


import fetch from 'common/fetch'
//列表
export function list(params) {
    return fetch({
        url: 'record',
        method: 'get',
        params
    })
}
//搜索(这是获取搜索框默认数据)
export function search(type) {
    return fetch({
        url: 'record/' + type + '/search',
        method: 'get',
    })
}


//创建表单
export function create() {
    return fetch({
        url: `record/create`,
        method: 'get',
    })
}

//提交新增-修改
export function save(data, code) {
    if (code) {
        return fetch({
            url: `record/${code}`,
            method: 'put',
            data
        })
    } else {
        return fetch({
            url: `record`,
            method: 'post',
            data
        })
    }

}
//获取编辑数据
export function edit(rcode) {
    return fetch({
        url: 'record/' + rcode + '/edit',
        method: 'get',
    })
}


//查看案件表单
export function detail(id) {
    return fetch({
        url: `record/${id}`,
        method: 'get',
    })
}
//删除案件表单
export function deleted(rcode, params) {
    return fetch({
        url: `record/${rcode}`,
        method: 'delete',
        params
    })
}

//摘要options
export function recordAbstract(params) {
    return fetch({
        url: 'recordAbstract',
        method: 'get',
        params
    })
}

//支付记录
export function recordPay() {
    return fetch({
        url: 'order',
        method: 'get'
    })
}