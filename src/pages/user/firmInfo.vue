<template>
    <div class="login-form">
        <div class="user-input">
            <img src="/static/images/new-logo.png" class="logo logo-suffix" alt="logo">
            <h3 class="logo-suffix-text text-link">完善律所信息</h3>
            <el-form ref="form" :model="form" :rules="rules" label-position="top" class="form-box">
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item prop="name" label="律所名称">
                            <el-input type="text" v-model="form.name"
                                      :autofocus="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="card_num" label="执业证号">
                            <el-input type="text" v-model="form.card_num" >
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item prop="justice_bureau" label="主管司法局">
                            <el-input type="text" v-model="form.justice_bureau"
                                      :autofocus="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="charge_man" label="负责人">
                            <el-input type="text" v-model="form.charge_man">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item prop="birthday" label="成立日期">
                            <el-date-picker type="date"  v-model="form.birthday"
                                            format="yyyy-MM-dd"
                                            prefix-icon="''"
                                            value-format="yyyy-MM-dd"
                                            style="width: 100%;">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="org_type" label="组织形式">
                            <el-select v-model="form.org_type"  clearable>
                                <el-option label="普通合伙人" :value="1"></el-option>
                                <el-option label="特殊的普通合伙" :value="2"></el-option>
                                <el-option label="个人" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item prop="contact_man" label="联系人">
                            <el-input type="text" v-model="form.contact_man"
                                      :autofocus="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="contact_phone" label="联系电话">
                            <el-input type="text" v-model="form.contact_phone" >
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item class="text-center" style="padding-top: 40px" v-loading="loading">
                    <el-button type="primary" size="large" style="width: 100%;"
                               @click="postFormData('form')">完成
                    </el-button>
                </el-form-item>
            </el-form>
            <ul class="other-login">
                <li class="line"></li>
                <li class="text">
                    <router-link to="/login">
                        <span class="co-666">账号登陆</span>
                    </router-link>
                    <span class="text-link pd-left-5 pd-right-5">or</span>
                    <i class="iconfont icon-wechat"></i>
                    <router-link to="/login">
                        <span class="co-666">微信扫码登陆</span>
                    </router-link>
                </li>
                <li class="line"></li>
            </ul>
        </div>
    </div>
</template>

<script type="text/javascript">

    // mapActions 工具函数会将 store 中的 dispatch 方法映射到组件的 methods 中
    import { mapActions } from 'vuex'
    import { SET_USER_INFO, SET_NOTIFY_INFO } from 'store/actions/type'
    import store from 'store'
    export default {
        data () {
            return {
                loading: false,
                form: {
                    name: '',
                    card_num: '',
                    justice_bureau: '',
                    charge_man: '',
                    birthday: '',
                    org_type: '',
                    contact_man: '',
                    contact_phone: ''
                },
                rules: {
                    name: [{
                        required: true,
                        message: '请输入律所名称',
                        trigger: 'blur'
                    }],
                    contact_man: [{
                        required: true,
                        message: '请输入联系人！',
                        trigger: 'blur'
                    }],
                    contact_phone: [{
                        required: true,
                        message: '请输入联系电话！',
                        trigger: 'blur'
                    }]
                }

            }
        },

        created () {
        },
        methods: {
            ...mapActions({
                set_user_info: SET_USER_INFO,
                set_notify_info: SET_NOTIFY_INFO
            }),
            postFormData (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        let submitForm = this.form
                        console.log('submitForm', submitForm)
                        this.$fetch.api_firm.save(submitForm)
                            .then(({
                                       msg,
                                       data
                                   }) => {
                                this.$message.success(msg)
                                console.log('data', data)
                                // TODO:此处应返回完整的用户信息
                                const [user, token] = [store.state.user_info.user, store.state.user_info.token]
                                //修改本地存的的过期信息
                                Object.assign(user, { firm_id: data.firm_id }, { firm_user: 1 })
//                                //存储返回来的用户信息
                                this.set_user_info({
                                    user: user,
                                    login: true,
                                    token: token
                                })

                                //激活自己的邮箱
                                this.set_notify_info({
                                    notify: []
                                })
                                // 跳转到指定路由下面
                                setTimeout(this.$router.push({
                                    name: 'user_info'
                                }), 500)

                            })
                            .catch(({
                                        code,
                                        msg
                                    }) => {
                                this.loading = false
                            })
                    }

                })
            }
        }
    }
</script>

<style scope type="text/scss" rel="stylesheet/scss">


</style>
