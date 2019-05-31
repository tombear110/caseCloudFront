/**
 * 用户请求数据配置.
 * @Author: tm
 * @Date:   2017-07-28 16:51:05
 * @Email:  tianming2015@foxmail.com
 * @Last modified by:   tm
 * @Last modified time: 2017-08-01 13:49:37
 */



import fetch from 'common/fetch'

//登录
export function login(data) {
  return fetch({
    url: `user/login`,
    method: 'post',
    data
  })
}
//注册
export function register(data) {
    return fetch({
        url:`user/register`,
        method:'post',
        data
    })
}
//获取登录二维码
export function loginQr(params) {
    return fetch({
        url: 'getQrcode',
        method:'get',
        params
    })
}
//发送‘忘记密码’邮件
export function forget(data) {
    return fetch({
        url:`user/forget`,
        method:'post',
        data
    })
}
//忘记密码-修改密码
export function checkRepwd(data) {
    return fetch({
        url:`user/checkRepwd`,
        method:'post',
        data,

    })
}
//修改个人信息页面--直接渲染
export function getUser() {
    return fetch({
        url:`user/me`,
        method:'get',
    })
}

// 提交修改个人信息
export function changeUser(data,id) {
    return fetch({
        url:`user/${id}`,
        method:'put',
        data,
    })
}
//上传头像
export function uploadAvatar(id) {
    return fetch({
        url:`user/uploadAvatar/${id}`,
        method:'get',
        data,
    })
}
//发送激活邮件
export function emailActive() {
    return fetch({
        url:`user/sendActiveEmail`,
        method:'post',
    })
}
//个人中心-验证激活邮件链接
export function checkActive(data) {
    return fetch({
        url:`user/checkActive`,
        method:'post',
        data,

    })
}
//个人中心-重置密码
export function setpwd(data) {
    return fetch({
        url:`user/setpwd`,
        method:'post',
        data,
    })
}
