//客户管理

import fetch from 'common/fetch'

//列表
export function contractList(params) {
    return fetch({
        url:`contract`,
        method:'get',
        params
    })
}
// 创建
export function contractCreate(params) {
    return fetch({
        url:`contract/create`,
        method:'get',
        params
    })
}

//存储
// export function contractStore(data) {
//     return fetch({
//         url:`contract`,
//         method:'post',
//         data
//     })
// }



//存储,修改
export function save(data,id) {
    if (id){
        return fetch({
            url:`contract/${id}`,
            method:'put',
            data
        })
    }else {
        return fetch({
            url:`contract`,
            method:'post',
            data
        })
    }

}

//查看
export function contractLook(code) {
    return fetch({
        url:`contract/${code}`,
        method:'get',
    })
}
//编辑
export function contractEdit(code) {
    return fetch({
        url:`contract/${code}/edit`,
        method:'get',
    })
}
//修改
// export function contractPut(data,id) {
//     return fetch({
//         url:`contract/${id}`,
//         method:'put',
//         data
//     })
// }
//删除
export function contractDel(id) {
    return fetch({
        url:`contract/${id}`,
        method:'delete',
    })
}
