




import fetch from 'common/fetch'
//列表-法院
export function createpdf(data) {
    return fetch({
        url:`uploadTempFile`,
        method: 'post',
        data
    })
}
//列表-法官
export function lawyerList(params) {
    return fetch({
        url:`createpdf`,
        method: 'get',
        params
    })
}
//存储
export function save(data) {
    return fetch({
        url:`downloadpdf`,
        method:'post',
        data
    })
}





