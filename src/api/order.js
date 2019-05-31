/**
 * @User: tombear
 * @Email: tangte1@foxmail.com
 * @Date: 2019-04-02 09:59:19
 * @Description: order.js
 */

import fetch from 'common/fetch'
// 存储
export function save() {
    return fetch({
        url:`order`,
        method:'post',
    })
}
