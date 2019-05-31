/*
 * @Author: tombear
 * @LastEditors: chrisechen
 * @Descriptption:
 * @Date: 2019-04-16 11:31:07
 * @LastEditTime: 2019-04-16 11:31:11
 */

import fetch from 'common/fetch'
//发送验证码
export function sendVerify(params) {
    return fetch({
        url: 'verification',
        method: 'post',
        params
    })
}

//验证码的验证
export function checkVerify(params, id) {
    return fetch({
        url: `verification/${id}`,
        method: 'get',
        params
    })
}