<template>
    <el-dialog title="修改密码" :visible.sync="visible" width="500px" :append-to-body="true" class="modify-pwd-dialog">
        <div class="">
            <el-form :model="setpwdForm" label-width="95px" size="medium" label-position="left" :rules="rules2" ref="setpwdForm">
                <el-form-item label="旧密码" prop="old_password">
                    <el-input type="password" v-model="setpwdForm.old_password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="password">
                    <el-input type="password" v-model="setpwdForm.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="checkPass">
                    <el-input type="password" v-model="setpwdForm.checkPass" auto-complete="off"></el-input>
                </el-form-item>
               <div class="text-right">
                   <el-button type="primary" size="medium" class="mg-top-10" @click="submitForm('setpwdForm')">确认修改</el-button>
               </div>
            </el-form>
        </div>
    </el-dialog>

</template>
<script>
    import {mapActions} from 'vuex'
    import {SET_USER_INFO} from 'store/actions/type'
    import store from 'store'
    import {server_base_url, img_url} from 'common/config'

    export default {
        props:['passwordData'],
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else {
                    if (this.setpwdForm.checkPass !== '') {
                        this.$refs.setpwdForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新密码'));
                } else if (value !== this.setpwdForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                visible:false,
                clickLi: 0,
                titles: ['个人中心', '密码修改'],
                toggle: true,
                img_url: img_url,
                url: server_base_url,
                user_info: store.state.user_info.user,
                imageUrl: '',

                setpwdForm: {
                    password: '',
                    old_password: '',
                },
                rules2: {
                    password: [
                        {required: true, message: '必填项', },
                        {validator: validatePass, trigger: 'blur'},
                        {min: 6, max: 16, message: '长度在6到16个', trigger: 'blur'},
                    ],
                    checkPass: [
                        {required: true, message: '必填项', },
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                    old_password: [
                        {required: true, message: '必填项', },
                        {min: 6, max: 16, message: '长度在6到16个', trigger: 'blur'},
                    ],
                }
            }
        },
        created() {

        },
        watch:{
            passwordData(val){
                this.visible = val.visible
            },
        },
        methods: {
            ...mapActions({
                set_user_info: SET_USER_INFO,
            }),
            beforeAvatarUpload(file) {
                const isPNG = file.type === 'image/png';
                const isLt1M = file.size / 1024 / 1024 < 1;
                if (!isPNG) {
                    this.$message.error('上传头像图片只能是 PNG 格式!');
                }
                if (!isLt1M) {
                    this.$message.error('上传头像图片大小不能超过 1MB!');
                }
                return isLt1M && isPNG;
            },
            uploadUrl: function () {
                let id = store.state.user_info.user.id
                return this.url + 'user/uploadAvatar/' + id
            },
            header: function () {
                return {authorization: 'Bearer ' + store.state.user_info.token}
            },
            successBack: function (res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                let img_path = res.data.user_info.img_path
                let base = store.state.user_info
                this.$set(base.user, 'img_path', img_path)
                //存储用户头像
                this.set_user_info(base);
            },

            //确认修改
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return false;
                    let submit = {
                        old_password:this.setpwdForm.old_password,
                        password:this.setpwdForm.password,
                    }
                    this.$fetch.api_user.setpwd(submit)
                        .then(({
                                   data,
                                   msg
                               }) => {
                            this.$message.success(msg);
                            this.$refs[formName].resetFields();
                            this.visible = false
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
<style lang="scss">
.modify-pwd-dialog{
    .el-dialog__title{
        font-size: 16px;
        position: relative;
        &::after{
            content: '';
            position: absolute;
            bottom: -15px;
            left: 0;
            width: 64px;
            height: 1px;
            background: #ECB86C;
        }
    }
}
</style>
