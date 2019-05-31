<template>
    <div class="login-form" @keyup.enter="postFormData('form')">
        <div class="user-input">
            <img
                src="/static/images/login-logo.png"
                class="logo"
                alt="logo"
            >
            <!-- <h3 class="logo-text">法律人首选的案件管理云平台</h3> -->
            <!-- <img src="/static/images/login_txt.png"> -->
            <div class="wechat-box" v-show="wechatLogin === true">
                <img
                    src="/static/images/wx.png"
                    alt="logo"
                >
                <p class="suffix-text">请使用微信扫描二维码登陆案件云</p>
                <div class="pd-bottom-20">
                    <span>还没有账号？</span>
                    <router-link to="/register">
                        <span class="text-link">立即注册</span>
                    </router-link>
                </div>
                <div class="divide-text">
                    <span
                        class="cursor"
                        @click="wechatLogin = false"
                    >使用密码登陆</span>
                </div>
            </div>
            <el-form
                ref="form"
                :model="form"
                size="large"
                :rules="rules"
                v-show="wechatLogin === false">
                <el-form-item prop="email" style="margin-bottom: 52px;margin-top: 50px;">
                    <el-input
                        type="text"
                        v-model="form.email"
                        auto-complete="new-password"
                        placeholder="邮箱"
                        :autofocus="true">
                        <i
                            slot="prefix"
                            class="iconfont icon-mail "
                        ></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password" style="margin-bottom: 0">
                    <el-input :type="passwordType" v-model="form.password" auto-complete="new-password" placeholder="密码">
                        <i
                            slot="prefix"
                            class="iconfont  icon-icon-mima "
                        ></i>
                        <i
                            slot="suffix"
                            class="iconfont   text-link cursor"
                            :class="(count%2 === 0) ? 'icon-eyes-close': 'icon-eyes-open'"
                            @click="togglePasswordType"
                        ></i>
                    </el-input>
                </el-form-item>
                <el-form-item class="text-right" style="margin-bottom: 5px">
                    <router-link to="/forget">
                        <span
                            class="form-suffix"
                            style="color: #424370;"
                        >忘记密码?</span>
                    </router-link>
                    <span
                        class=" mg-left-5 mg-right-5"
                        style="font-size: 16px;color: #C2BAAF;"
                    >|</span>
                    <router-link to="/register">
                        <span class="form-suffix ">立即注册</span>
                    </router-link>
                </el-form-item>
                <el-form-item class="text-center" style="padding-top: 110px;" v-loading="loading">
                    <el-button type="primary" size="large" style="width: 100%;" @click="postFormData('form')">
                        登 录
                    </el-button>
                </el-form-item>
            </el-form>
            <ul class="other-login" v-if="false">
                <!--v-show="wechatLogin === false"-->
                <li class="line"></li>
                <li class="text" @click="wechatLogin = true">
                    <i class="iconfont icon-wechat"></i>
                    <span>微信扫码登陆</span>
                </li>
                <li class="line"></li>
            </ul>
        </div>
    </div>
</template>

<script>
import {
    mapActions,
    mapMutations
} from 'vuex'
import {
    SET_USER_INFO,
    SET_NOTIFY_INFO,
    SET_V_INFO
} from 'store/actions/type'
import {
    SET_WXGZ
} from 'store/mutations/type'
import store from 'store'
export default {
    data() {
        return {
            wechatLogin: false,
            passwordType: 'password',
            count: 0,
            form: {
                email: null,
                password: null
            },
            rules: {
                email: [{
                        required: true,
                        message: '请输入账户名！',
                        trigger: 'blur'
                    },
                    {
                        type: 'email',
                        message: '请输入正确的邮箱！',
                        trigger: ['blur', 'change']
                    }
                ],
                password: [{
                    required: true,
                    message: '请输入账户密码！',
                    trigger: 'blur'
                }]
            },
            loading: false
        }
    },
    created() {},
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
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                this.$fetch.api_user.login(this.form)
                    .then(({
                        data,
                        msg
                    }) => {
                        loading.close()
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
                            setTimeout(this.$router.push({
                                path: '/'
                            }), 500)
                        }
                    })
                    .catch(({
                        code,
                        msg
                    }) => {
                        loading.close()
                    })
            })
        }
    }
}
</script>
