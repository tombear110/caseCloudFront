/*
 * @Author: tombear
 * @LastEditors: tombear
 * @Descriptption:
 * @Date: 2018-01-31 11:55:58
 * @LastEditTime: 2019-02-21 13:46:46
 */

import fetch from 'common/fetch'

// //图片上传
// export function image_upload(data) {
//   return fetch({
//     url: port_file.image,
//     method: 'post',
//     data
//   })
// }


//案件文书
//列表
export function cfileList(params) {
    return fetch({
        url:'cfile',
        method: 'get',
        params
    })
}
//下载
// export function cfileDown() {
//     return fetch({
//         url:'cfile/72/download',
//         method: 'get',
//     })
// }
//修改
export function cfileChange(id,data) {
    return fetch({
        url:`cfile/${id}`,
        method: 'put',
        data
    })
}
export function cfileDelete(id,params) {
    return fetch({
        url:`cfile/${id}`,
        method: 'delete',
        params
    })
}