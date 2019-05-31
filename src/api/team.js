

import fetch from 'common/fetch'

//创建团队
export function create() {
    return fetch({
        url: `team/create`,
        method:'get',
    })
}

//存储团队信息
// export function teamSave(data) {
//     return fetch({
//         url: `team`,
//         method:'post',
//         data
//
//     })
// }
//查看团队页面
export function teamId(id) {
    return fetch({
        url: `team/${id}`,
        method:'get',
    })
}
// 编辑团队页面
export function teamEdit(id) {
    return fetch({
        url: `team/${id}/edit`,
        method:'get',

    })
}


//修改 新增
export function save(data,id) {
    if (id){
        return fetch({
            url: `team/${id}`,
            method:'put',
            data

        })
    }else {
        return fetch({
            url: `team`,
            method:'post',
            data

        })
    }

}


//更新团队信息
// export function teamUpdate(data,id) {
//     return fetch({
//         url: `team/${id}`,
//         method:'put',
//         data
//
//     })
// }

// 同意加入团队
export function teamAgree(params) {
    return fetch({
        url: `user/team`,
        method:'post',
        params
    })
}
// 团队成员列表
export function memberList() {
    return fetch({
        url: `myteam/users`,
        method:'get',
        })
}

//设置权限
export function setRights(data) {
    return fetch({
        url: `user/type`,
        method:'post',
        data
    })
}
//冻结账号
export function AccountFreeze(data) {
    return fetch({
        url:`setUserStatus` ,
        method:'put',
        data
    })
}
