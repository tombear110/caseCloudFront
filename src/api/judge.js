/**
 * 承办人员
 * @params: mod
 * @return: 返回值/返回值说明
 */



import fetch from 'common/fetch'
//列表
export function list(params) {
    return fetch({
        url:`judge`,
        method: 'get',
        params
    })
}
//创建表单
// export function create() {
//     return fetch({
//         url:`judge/create`,
//         method:'get',
//     })
// }

//存储
export function store(data) {
    return fetch({
        url:`judge`,
        method:'post',
        data
    })
}

//查看
export function detail(id) {
    return fetch({
        url:`judge/${id}`,
        method:'get',

    })
}

//编辑表单
export function edit(id) {
    return fetch({
        url:`judge/${id}/edit`,
        method:'get',
    })
}

//修改表单
export function change(data,id) {
    return fetch({
        url:`judge/${id}`,
        method:'put',
        data
    })
}


//删除案件表单
export function deleted(id) {
    return fetch({
        url:`judge/${id}`,
        method:'delete',
    })
}





