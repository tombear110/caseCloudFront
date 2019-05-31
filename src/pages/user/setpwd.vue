<template>
    <div class="login-form" v-loading="load_data" element-loading-text="正在登陆中..." @keyup.enter="submit_form">
        <div class="user-input">
            <img src="/static/images/new-logo.png" class="logo" alt="logo">
            <h4>设置密码</h4>
            <el-form ref="form" :model="form" :rules="rules" class="form-box">
                <el-form-item prop="password">
                    <el-input type="password" v-model="form.password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item class="text-center">
                    <el-button type="primary" class="form-submit oa-login-btn" @click="submit_form">设置新密码</el-button>
                </el-form-item>
            </el-form>
            <div class="text-center">
                <router-link to="/register">
                    <span class="co-999">注册帐号</span>
                </router-link>
                <span class=" mg-left-5 mg-right-5 co-999">|</span>
                <router-link to="/login">
                    <span class="co-999">返回登录</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">

    export default {
        data () {
            return {
                form: {
                    password: ''
//                remember: null
                },
                rules: {
                    password: [{
                        required: true,
                        message: '请输入账户密码！',
                        trigger: 'blur'
                    }]
                },
                //请求时的loading效果
                load_data: false
            }
        },
        methods: {
            submit_form () {
                this.$refs.form.validate((valid) => {
                    if (!valid) return false
                    this.load_data = true
                    //提交新密码
                    this.$fetch.api_user.setpwd(this.form)
                        .then(({
                                   data,
                                   msg

                               }) => {
                            this.$message.success(msg)              // el【通知】悬浮出现在页面右上角，显示全局的通知提醒消息。
                            // 跳转到指定路由下面
                            setTimeout(this.$router.push({
                                path: '/'
                            }), 500)

                        })
                        .catch(({
                                    code,
                                    msg
                                }) => {
                            this.load_data = false

                        })
                })
            }
        }
    }
</script>

