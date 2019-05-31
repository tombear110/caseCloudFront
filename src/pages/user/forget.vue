<template>
    <div class="login-form">
        <div class="user-input" @keyup.enter="postFormData('form')">
            <img src="/static/images/login-logo.png" class="logo logo-suffix" alt="logo" style="margin-bottom: 110px;">
            <!-- <h3 class="logo-text">法律人首选的案件管理云平台</h3> -->
            <h4 class="logo-suffix-text co-white">输入您的电子邮件地址恢复您的密码</h4>
            <el-form ref="form" :model="form" :rules="rules" class="form-box">
                <el-form-item prop="email">
                    <el-input type="email" v-model="form.email" placeholder="邮箱" :autofocus="true">
                        <i slot="prefix" class="iconfont ft-18 icon-mail text-link"></i>
                    </el-input>
                </el-form-item>
                <el-form-item class="text-center" style="padding-top: 40px">
                    <el-button type="primary" size="large" style="width: 100%;" @click="postFormData('form')" >提交
                    </el-button>
                </el-form-item>
            </el-form>
            <ul class="other-login" >
                <li class="line"></li>
                <li class="text">
                    <router-link to="/login">
                        <span>返回登录</span>
                    </router-link>
                </li>
                <li class="line"></li>
            </ul>
        </div>
    </div>
</template>

<script type="text/javascript">

    export default {
        data() {
            return {
                form: {
                    email: '',

                },
                rules: {
                    email: [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
                    ],
                },
                urlImg: './static/images/logo.png'
            }
        },
        methods: {
            postFormData() {
                this.$refs.form.validate((valid) => {
                    if (!valid) return false;
                    //密码重置提交
                    this.$fetch.api_user.forget(this.form)
                        .then(({
                                   msg,
                               }) => {
                            this.$message.success(msg);
                            this.form = {}
                        })
                        .catch(({
                                    code,
                                    msg
                                }) => {

                        })
                })
            },
        }
    }
</script>
<style scope type="text/scss" rel="stylesheet/scss" scoped>


</style>

