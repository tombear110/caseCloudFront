
//客户管理

import fetch from 'common/fetch'

// 列表
export function caseList(params) {
    return fetch({
        url:`batchcase`,
        method:'get',
        params
    })
}


// 创建
export function caseCreate() {
    return fetch({
        url:`batch/create`,
        method:'get',
    })
}

//导入案件
export function caseImport(data) {
    return fetch({
        url:`batch`,
        method:'post',
        data
    })
}
//案件修改
//
// 字段修改
export function case_put(ids,data) {
    return fetch({
        url:`batchcase/${ids}`,
        method:'put',
        data
    })
}
//搜索基础数据
export function baseSearchData() {
    return fetch({
        url:`batchSearch`,
        method:'get',
    })
}

//搜索-获取整个列表
// bfield_search
export function search(params) {
    return fetch({
        url:`bfield`,
        method:'get',
        params
    })
}
// 存储
export function bfield_store(data) {
    return fetch({
        url:`bfield`,
        method:'post',
        data
    })
}
// 字段修改
export function bfield_put(id,data) {
    return fetch({
        url:`bfield/${id}`,
        method:'put',
        data
    })
}

//获取客户名下所有批次信息（列表）
export function batchList() {
    return fetch({
        url:`batch`,
        method:'get',
    })
}
