<template>
    <div class="login qr-login">
        <div class="qr-login-wrap" v-loading="loadingLogin">
            <div class="login-form" @keyup.enter="postFormData('form')" v-if="!isQrLogin" style="padding: 0;margin: 0 auto;">
                <div class="user-input">
                    <img src="/static/images/anjianyun.png" class="logo" alt="logo" style="width: 195px;height: 53px;margin-top: 40px;">
                    <img src="/static/images/law-txt.png" class="logo" style="margin-top: 20px;">
                    <el-form ref="form" :model="form" size="large" :rules="rules">
                        <el-form-item prop="email" style="margin-bottom: 52px;margin-top: 90px;">
                            <el-input type="text" v-model="form.email" placeholder="邮箱" :autofocus="true">
                                <i slot="prefix" class="iconfont icon-mail"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password" style="margin-bottom: 0">
                            <el-input :type="passwordType" v-model="form.password" placeholder="密码">
                                <i slot="prefix" class="iconfont  icon-icon-mima"></i>
                                <i slot="suffix" class="iconfont   text-link cursor" :class="(count%2 === 0) ? 'icon-eyes-close': 'icon-eyes-open'" @click="togglePasswordType"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item class="text-right" style="margin-bottom: 5px">
                            <router-link to="/forget">
                                <span class="form-suffix" style="color: #9FA5B9;">忘记密码?</span>
                            </router-link>
                            <span class=" mg-left-5 mg-right-5" style="font-size: 16px;color: #9FA5B9;">|</span>
                            <router-link to="/register">
                                <span class="form-suffix ">立即注册</span>
                            </router-link>
                        </el-form-item>
                        <el-form-item class="text-center" style="padding-top: 110px;" v-loading="loading">
                            <el-button type="primary" size="large" style="width: 100%;box-shadow:6px 11px 13px 0px rgba(124,125,137,0.14);" @click="postFormData('form')">
                                登 录
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="login-form" style="padding: 0;margin: 0 auto;" v-else>
                <div class="user-input">
                    <img src="/static/images/anjianyun.png" class="logo" alt="logo" style="width: 195px;height: 53px;margin-top: 40px;">
                    <img src="/static/images/law-txt.png" class="logo" style="margin-top: 20px;">
                    <div class="logo qr-login-img">
                        <img :src="qrCodeUrl">
                    </div>
                    <p class="qr-txt">请使用微信扫描二维码登陆案件云</p>
                </div>
            </div>
            <div class="triangle-bottomright" @click="changeLogin">
                <i class="iconfont" :class="isQrLogin ? 'icon-diannao' : 'icon-saoma'"></i>
            </div>
        </div>
        <div class="copyright">
            <a href="http://www.law086.com" target="_blank">官方网站</a>
            <span class="mg-left-5 mg-right-5" style="color: #fff;opacity: 0.5">|</span>
            <span>Copyright © 2019 All rights reserved 律杏科技 版权所有 沪ICP备10018377号-3</span>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="loginVisible"
            width="30%">
            <span>{{qrMsg}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="loginVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <qrlogin-info :qr-info="qrInfo"></qrlogin-info>
    </div>
</template>
<script type="text/javascript">
import { mapActions, mapMutations } from 'vuex'
import { SET_USER_INFO, SET_NOTIFY_INFO, SET_V_INFO } from 'store/actions/type'
import { SET_WXGZ } from 'store/mutations/type'
import store from 'store'
import { img_url } from 'common/config'
import qrloginInfo from '../../components/business/user/qrlogin-info/index'

export default {
    data() {
        return {
            isQrLogin:  false,
            loadingLogin: false,
            loginVisible: false,
            qrMsg: '',
            passwordType: 'password',
            count: 0,
            form: {
                email: null,
                password: null
            },
            rules: {
                email: [
                    { required: true, message: '请输入账户名！', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱！', trigger: ['blur', 'change'] }
                ],
                password: [{
                    required: true,
                    message: '请输入账户密码！',
                    trigger: 'blur'
                }]
            },
            loading: false,
            clientId: '',
            qrCodeUrl: '',
            qrInfo: {}
        }
    },
    components:{
        qrloginInfo
    },
    sockets: {
        //这里是监听connect事件
        connect: function (res) {
            this.clientId = this.$socket.id
        }
    },
    created() {},
    mounted() {
        this.$socket.emit('connect')
        this.$options.sockets['WxMsg_' + this.clientId] = (data) => {
            if (data.code === 0) {
                this.successJump(data.data)
            } else {
                this.isQrLogin = false
                store.state.wxInfo.wx_unionid = data.data.wx_unionid
                store.state.wxInfo.wxgz_openid = data.data.wxgz_openid
                this.form.wx_unionid = data.data.wx_unionid
                this.form.wxgz_openid = data.data.wxgz_openid
                //this.qrMsg = data.msg
                //this.loginVisible = true
                this.qrInfo = {
                    visible: true
                }
            }
        }
    },
    methods: {
        ...mapActions({
            set_user_info: SET_USER_INFO,
            set_notify_info: SET_NOTIFY_INFO,
            set_v_info: SET_V_INFO
        }),
        ...mapMutations({
            set_wxgz: SET_WXGZ
        }),
        togglePasswordType() {
            this.count++
            this.passwordType = (this.count % 2 === 0) ? 'password' : 'text'
        },
        postFormData(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return false
                //登录提交
                // const loading = this.$loading({
                //     lock: true,
                //     text: 'Loading',
                //     spinner: 'el-icon-loading',
                //     background: 'rgba(0, 0, 0, 0.7)'
                // })
                this.loadingLogin = true
                this.$fetch.api_user.login(this.form)
                    .then(({
                        data,
                        msg

                    }) => {
                        // loading.close()
                        this.loadingLogin = false
                        this.successJump(data)
                    })
                    .catch(({
                        code,
                        msg
                    }) => {
                        this.loadingLogin = false
                        // loading.close()
                    })
            })
        },
        successJump(data) {
            //存储用户信息,默认存储用户信息一个月
            this.set_user_info({
                user: data.user_info,
                login: true,
                token: data.token,
                expires: 30
            })
            this.set_v_info(data.v_info)
            this.set_wxgz(data.user_info.bind_wxgz)

            //登陆成功后跳转判断
            if (this.$route.query.callback) {
                this.$router.push({
                    path: this.$route.query.callback
                })
            } else {
                //TODO:现在无邮箱激活字段，此处逻辑需要调整；
                let active = store.state.user_info.user.active
                // 跳转到指定路由下面
                if (active === 1) {
                    this.$router.push({path: '/'})
                } else {
                    this.$router.push({name: 'calendarMyMonth',query: { emailActive: 0 }})
                }
            }
        },
        changeLogin() {
            let params = {
                pushClientId: this.clientId,
                type: 'loginByWx'
            }
            if (this.isQrLogin) {
                this.isQrLogin = false
            } else {
                this.isQrLogin = true
                this.$fetch.api_user.loginQr(params).then(({msg, data}) => {
                    this.qrCodeUrl = img_url + data.qrCodeUrl
                }).catch(({msg}) => {
                    this.$message.error(data.msg)
                })
            }
        }
    }
}

</script>
