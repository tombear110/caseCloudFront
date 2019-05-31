//导入模块
import axios from 'axios'
import router from 'src/router'
import {
    Message
} from 'element-ui'
import store from 'store'
import {
    SET_USER_INFO
} from 'store/actions/type'
import {
    server_base_url
} from 'common/config'
//设置用户信息action
const setUserInfo = function (user) {
    store.dispatch(SET_USER_INFO, user)
}

export default function fetch(options) {
    return new Promise((resolve, reject) => {
        //创建一个axios实例
        const instance = axios.create({
            //设置默认根地址
            baseURL: server_base_url,
            //设置请求超时设置
            timeout: 2000,
            transformRequest: [function (options) {
                let ret = ''
                for (let it in options) {
                    if (options[it] === null) {
                        options[it] = ''
                    }
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(options[it]) + '&'
                }
                return ret
            }],
            // 设置请求时的header
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        //如果已登录，每次请求更新 token
        if (store.state.user_info.login) {
            axios.defaults.headers.common['authorization'] = 'Bearer ' + store.state.user_info.token
        }

        instance(options)
            .then(({
                       data: {
                           code,
                           msg,
                           data
                       },
                       headers, //axios相应包含的信息
                       config,
                       status,
                       statusText,
                   }) => {
                //token有变化，则更新本地存储的token
                if (headers['authorization']) {
                    let info = store.state.user_info
                    info.token = headers['authorization'].substr(7)
                    setUserInfo(info)
                }

                //根据code，进行相应的处理
                let statusCode = parseInt(code)    //0,1.2
                switch (statusCode) {
                    case 1:
                        Message.warning(msg)
                        resolve({
                            code,
                            msg,
                            data
                        })
                        break
                    case 2:
                        setUserInfo(null)
                        router.push({
                            name: 'login'
                        })
                        break;
                    default:
                        if (msg) {
                            Message.success(msg)
                        }
                        resolve({
                            code,
                            msg,
                            data
                        })
                        break
                }
                reject({
                    code,
                    msg,
                    data
                })
            })
            .catch((error) => {
                //请求失败时,根据业务判断状态
                if (error.response) {
                    let resError = error.response, resCode = resError.status, resMsg = error.message
                    Message.error('操作失败！错误原因: ' + resError.data.msg)
                    reject({
                        code: resCode,
                        msg: resMsg
                    })
                }
            })
    })
}
