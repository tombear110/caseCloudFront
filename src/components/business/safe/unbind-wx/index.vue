<template>
    <el-dialog title="" :visible.sync="visible" width="420px" :append-to-body="true" class="unbind-wx">
        <div class="unbind-wx-content">
            <p class="unbind-title">安全验证</p>
            <div class="tab-part">
                <div class="tab-item cursor" :class="wxIndex == 0 ? 'tab-active' : ''" @click="wxIndexChange(0)">扫码验证</div>
                <div class="tab-item cursor" :class="wxIndex == 1 ? 'tab-active' : ''" @click="wxIndexChange(1)">邮箱验证</div>
            </div>
            <div class="unbind-content" v-if="wxIndex === 0">
                <div class="qr-wrap">
                    <img :src="qrCodeUrl" alt="">
                </div>
                <p class="content-txt">请使用您账号绑定的微信扫描图中二维码</p>
            </div>
            <div class="unbind-content" v-if="wxIndex === 1">
                <p class="title mat-60">变更重要信息需要先进行安全验证哦！</p>
                <div class="gray-back mat-30">
                    <input type="text" class="email-input" placeholder="请输入邮箱" v-model="oldEmail" readonly />
                </div>
                <div class="gray-back mat-10">
                    <input type="text" class="verify-code" placeholder="请输入验证码" v-model="code"/>
                    <div class="verify-btn cursor" @click="sendEmailCode" v-if="!verifyFLag">发送邮箱验证码</div>
                    <el-button class="verify-btn" style="line-height: 1;background: #f6dcb6;border: none;" v-else disabled>{{time}}秒</el-button>
                </div>
                <div class="btn_wrap">
                    <el-button type="primary" size="small" style="margin-right: 10px;width: 95px" @click="checkVerify" :disabled="code.length <= 0 || oldEmail.length <= 0">确认验证</el-button>
                    <el-button size="small" plain style="width: 95px;" @click="close">取消</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<script>
    import store from 'store'
    import {server_base_url, img_url} from 'common/config'
    import {SET_USER_INFO} from 'store/actions/type'
    import { mapMutations, mapActions} from 'vuex'
    import { SET_WXGZ } from 'store/mutations/type'
    let timer
    export default {
        props:['unWxInfo', 'qrCodeUrl', 'verData'],
        data() {
            return {
                visible: false,
                qrUrl: '',
                wxIndex: 0,
                verifyFLag: false,
                oldEmail: '',
                time: 60,
                code: '',
                tempId: '',
                form: {
                    ver_id: '',
                    ver_code: ''
                }
            }
        },
        watch:{
            unWxInfo(val) {
                this.visible = val.visible
                this.oldEmail = val.email
            },
            verData(val) {
                if (this.visible) {
                    this.form.ver_id = val.ver_id
                    this.form.ver_code = val.ver_code
                    this.tipUnbind()
                }
            }
        },
        created() {
        },
        methods: {
            ...mapActions({
                set_user_info: SET_USER_INFO
            }),
            ...mapMutations({
                set_wxgz: SET_WXGZ
            }),
            close() {
                this.visible = false
                this.code = ''
            },
            wxIndexChange(val) {
                this.wxIndex = val
            },
            sendEmailCode() {
                this.verifyFLag = true
                let params = {
                    type: 1
                }
                this.$fetch.api_safe.sendVerify(params).then(({msg, data, code}) => {
                    if (code === 0) {
                        this.tempId = data.id
                        this.$message.success(msg)
                    } else {
                        this.$message.warning(msg)
                    }
                }).catch(({msg}) => {
                    this.$message.error(msg)
                })
                timer = setInterval(() => {
                    this.time--
                    if (this.time <= 0) {
                        this.verifyFLag = false
                        clearInterval(timer)
                    }
                }, 1000)
            },
            checkVerify() {
                if (!this.tempId) {
                    this.$message.warning('请先发送验证码')
                    return false
                }
                let params = {
                    code: this.code
                }
                this.$fetch.api_safe.checkVerify(params, this.tempId).then(({msg, data, code}) => {
                    if (code === 0) {
                        this.form.ver_code = data.ver_code
                        this.form.ver_id = data.ver_id
                        this.tipUnbind()
                    } else {
                        this.$message.warning(msg)
                    }
                }).catch(({msg}) => {
                    this.$message.error(msg)
                })
            },
            tipUnbind() {
                this.$confirm('确定要解绑您的微信，解绑后，将不能再使用该微信登录当前账号，确认解绑？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'is-plain'
                }).then(() => {
                    let uid = store.state.user_info.user.id
                    this.form.wx_unionid = ''
                    this.form.wxgz_openid = ''
                    this.visible = false
                    this.$fetch.api_user.changeUser(this.form, uid).then(({msg, data}) => {
                        this.set_wxgz(false)
                        const baseUserInfo = store.state.user_info
                        baseUserInfo.user.bind_wxgz = false
                        this.set_user_info({
                            login: baseUserInfo.login,
                            token: baseUserInfo.token,
                            user: baseUserInfo.user
                        })
                        this.$emit('updateInfo')
                        this.$message.success(msg)
                    }).catch(({msg}) => {
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            }
        }
    }
</script>
<style lang="scss">
.unbind-wx{
    line-height: 1;
    text-align: center;
    .el-dialog__header{
        border: none;
    }
    .el-dialog__body{
        padding: 0;
    }
    .el-dialog{
        border-radius: 4px;
        margin-top: 25vh !important;
    }
    .unbind-title{
        font-size:16px;
        color: #333;
        font-weight:bold;
    }
    .tab-part{
        display: flex;
        justify-content: center;
        border-bottom: 1px solid rgba(244,244,244,1);
        margin-top: 10px;
        .tab-item{
            color: #999;
            font-size: 16px;
            font-weight: 400;
            text-align: center;
            padding: 15px 55px;
            position: relative;
        }
        .tab-active{
            color: #333;
            font-weight: bold;
            &::after{
                content:"";
                width: 46px;
                height: 3px;
                background: #ECB86C;
                position: absolute;
                bottom: 0;
                left: 63px;
            }
        }
    }
    .unbind-content{
        width: 285px;
        margin: 0 auto;
        .qr-wrap{
            width: 180px;
            height: 180px;
            box-shadow:0px 1px 16px 0px rgba(156,158,174,0.33);
            margin: 50px auto 40px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .content-txt{
            font-size:14px;
            color: #999;
            font-weight:400;
            padding-bottom: 55px;
        }
        .title{
            color: #999;
            font-size: 14px;
            text-align: left;
        }
        .gray-back{
            width: 285px;
            height: 50px;
            background: #F5F5F5;
            color: #666;
            font-size: 14px;
            display: flex;
            align-items: center;
            padding-left: 10px;
            border-radius:4px;
            overflow: hidden;
            .email-input{
                border: none;
                outline: none;
                background: none;
            }
            .verify-code{
                width: 165px;
                height: 100%;
                border: none;
                outline: none;
                background: none;
            }
            .verify-btn{
                flex: 1;
                height: 50px;
                text-align: center;
                line-height: 50px;
                background: #ECB86C;
                font-size:14px;
                color: #fff;
                font-weight:400;
                &:active{
                    opacity: 0.5;
                }
            }
        }
        .btn_wrap{
            margin: 60px auto 0;
            padding-bottom: 40px;
        }
    }
}
</style>
