/**
 * @User: tombear
 * @Email: tangte1@foxmail.com
 * @Date: 2018-11-16 13:51:26
 * @Description: 庭审记录
 */


import fetch from 'common/fetch'
//列表
export function list(params) {
    return fetch({
        url:`trial`,
        method: 'get',
        params
    })
}
//创建表单
export function create() {
    return fetch({
        url:`trial/create`,
        method:'get',
    })
}

//存储，修改
export function save(data,id) {
    if (id){
        return fetch({
            url:`trial/${id}`,
            method:'put',
            data
        })
    }else {
        return fetch({
            url:`trial`,
            method:'post',
            data
        })
    }

}

//查看
export function detail(id) {
    return fetch({
        url:`trial/${id}`,
        method:'get',

    })
}

//编辑表单
export function edit(id) {
    return fetch({
        url:`trial/${id}/edit`,
        method:'get',
    })
}



//删除案件表单
export function deleted(id) {
    return fetch({
        url:`trial/${id}`,
        method:'delete',
    })
}
