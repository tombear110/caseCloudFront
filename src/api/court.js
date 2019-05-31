




import fetch from 'common/fetch'
//列表-法院
export function courtList(params) {
    return fetch({
        url:`court`,
        method: 'get',
        params
    })
}
//列表-法官
export function lawyerList(params) {
    return fetch({
        url:`cjudge`,
        method: 'get',
        params
    })
}
//存储
export function save(data) {
    return fetch({
        url:`cjudge`,
        method:'post',
        data
    })
}

//赞
export function like(id) {
    return fetch({
        url:`cjudge/${id}/like`,
        method:'post',
    })
}
//反赞
export function hate(id) {
    return fetch({
        url:`cjudge/${id}/hate`,
        method:'post',
    })
}

//法官接待日
//列表
export function judgedayList() {
    return fetch({
        url:`judgeday`,
        method: 'get',
    })
}
//创建
export function judgedayCreate() {
    return fetch({
        url:`judgeday/create`,
        method: 'get',
    })
}
//存储
export function judgedaySave(data) {
    return fetch({
        url:`judgeday`,
        method: 'post',
        data
    })
}
//删除
export function judgedayDel(id) {
    return fetch({
        url:`judgeday/${id}`,
        method: 'delete',
    })
}





