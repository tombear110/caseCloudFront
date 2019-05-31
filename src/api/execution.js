/**
 * @User: tombear
 * @Email: tangte1@foxmail.com
 * @Date: 2018-11-16 13:53:51
 * @Description: 执行情况
 */


import fetch from 'common/fetch'
//列表
export function list(params) {
    return fetch({
        url:`execution`,
        method: 'get',
        params
    })
}
//创建表单
export function create() {
    return fetch({
        url:`execution/create`,
        method:'get',
    })
}

//存储
export function store(data) {
    return fetch({
        url:`execution`,
        method:'post',
        data
    })
}

//查看
export function detail(id) {
    return fetch({
        url:`execution/${id}`,
        method:'get',

    })
}

//编辑表单
export function edit(id) {
    return fetch({
        url:`execution/${id}/edit`,
        method:'get',
    })
}

//修改表单
export function change(data,id) {
    return fetch({
        url:`execution/${id}`,
        method:'put',
        data
    })
}


//删除案件表单
export function deleted(id) {
    return fetch({
        url:`execution/${id}`,
        method:'delete',
    })
}
