/**
 * 当事人
 * @params: mod
 * @return: 返回值/返回值说明
 */



import fetch from 'common/fetch'
//列表
export function list(params) {
    return fetch({
        url:`privyc`,
        method: 'get',
        params
    })
}
//创建表单
// export function create() {
//     return fetch({
//         url:`privyc/create`,
//         method:'get',
//     })
// }


//存储
export function save(data,id) {
    if (id){
        return fetch({
            url:`privyc/${id}`,
            method:'put',
            data
        })
    }else {
        return fetch({
            url:`privyc`,
            method:'post',
            data
        })
    }

}

//查看
export function detail(id) {
    return fetch({
        url:`privyc/${id}`,
        method:'get',

    })
}

//编辑表单
export function edit(id) {
    return fetch({
        url:`privyc/${id}/edit`,
        method:'get',
    })
}



//删除案件表单
export function deleted(id) {
    return fetch({
        url:`privyc/${id}`,
        method:'delete',
    })
}





