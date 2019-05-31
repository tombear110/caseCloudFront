/**
 * @User: tombear
 * @Email: tangte1@foxmail.com
 * @Date: 2018-11-16 13:54:55
 * @Description: 财产保全
 */



import fetch from 'common/fetch'
//列表
export function list(params) {
    return fetch({
        url:`property`,
        method: 'get',
        params
    })
}
//创建表单
export function create(params) {
    return fetch({
        url:`property/create`,
        method:'get',
        params
    })
}

//存储
// export function store(data) {
//     return fetch({
//         url:`property`,
//         method:'post',
//         data
//     })
// }

//查看
export function detail(id) {
    return fetch({
        url:`property/${id}`,
        method:'get',

    })
}

//编辑表单
export function edit(id) {
    return fetch({
        url:`property/${id}/edit`,
        method:'get',
    })
}

//修改表单
// export function change(data,id) {
//     return fetch({
//         url:`property/${id}`,
//         method:'put',
//         data
//     })
// }

//修改-存储
export function save(data,id) {
    if (id){
        return fetch({
            url:`property/${id}`,
            method:'put',
            data
        })
    }else {
        return fetch({
            url:`property`,
            method:'post',
            data
        })
    }

}


//删除案件表单
export function deleted(id) {
    return fetch({
        url:`property/${id}`,
        method:'delete',
    })
}
