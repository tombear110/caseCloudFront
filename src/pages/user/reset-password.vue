<template>
    <div class="login-form">
        <div class="user-input" @keyup.enter="postFormData('checkRepwdForm')">
            <img src="/static/images/login-logo.png" class="logo" style="margin-bottom: 30px" alt="logo">
            <h4 class="logo-suffix-text">亲爱的 <span class="text-info">{{userName}}</span> 律师，请您重置您的密码</h4>
            <el-form ref="checkRepwdForm" :model="checkRepwdForm" :rules="rules2" class="form-box">
                <el-form-item  prop="password">
                    <el-input :type="passwordType" v-model="checkRepwdForm.password" placeholder="新密码" :autofocus="true">
                        <i slot="prefix" class="iconfont  icon-icon-mima "></i>
                        <i slot="suffix" class="iconfont   text-link cursor"
                           :class="(count%2 === 0) ? 'icon-eyes-close': 'icon-eyes-open'" @click="togglePasswordType"></i>
                    </el-input>
                </el-form-item>
                <el-form-item  prop="checkPass">
                    <el-input :type="passwordType" v-model="checkRepwdForm.checkPass" placeholder="确认新密码">
                        <i slot="prefix" class="iconfont  icon-icon-mima "></i>
                        <i slot="suffix" class="iconfont   text-link cursor"
                           :class="(count%2 === 0) ? 'icon-eyes-close': 'icon-eyes-open'" @click="togglePasswordType"></i>
                    </el-input>
                </el-form-item>
                <el-form-item class="text-center" style="padding-top: 110px;">
                    <el-button type="primary" size="large" style="width: 100%;" @click="postFormData('checkRepwdForm')">
                        提交
                    </el-button>
                </el-form-item>
            </el-form>s
            <div class="text-center">
                <router-link to="/register">
                    <span class="co-999">注册帐号</span>
                </router-link>
                <span class=" mg-left-5 mg-right-5 co-999">|</span>
                <router-link to="/login">
                    <span class="co-999" >返回登录</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<!---->

<!--/user/password_reset?token=$2y$10$/ZhFaZKzWjnUtthjvq.5eO/WbDXoocfDXpxXp2xnUQ7xgVmXigKGS-->
<script>
    export default {
        data() {

            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.checkRepwdForm.checkPass !== '') {
                        this.$refs.checkRepwdForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.checkRepwdForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            return {
                userName:this.$route.query.user_name,
                passwordType: 'password',
                count: 0,
                checkRepwdForm: {
                    password: '',
                    token:this.$route.query.token,
                },
                rules2: {
                    password: [
                        { validator: validatePass, trigger: 'blur' },
                        { min: 6, max: 16, message: '长度在6到16个', trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                },
                urlImg: './static/images/logo.png'
            }
        },
        created() {
        },
        methods: {
            togglePasswordType () {
                this.count++
                this.passwordType = (this.count%2 === 0) ? 'password':'text'
            },
            postFormData(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid){return }
                    this.$fetch.api_user.checkRepwd(this.checkRepwdForm)
                        .then(({
                                   msg,
                                   data
                               }) => {
                            // 跳转到指定路由下面
                            setTimeout(this.$router.push({
                                path:'/'
                            }), 500)
                        })

                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style>
    .forget-form>.el-form-item {
        margin-bottom: 20px;
    }
</style>
