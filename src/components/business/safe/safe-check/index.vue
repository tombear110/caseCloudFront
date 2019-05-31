<template>
    <el-dialog title="更改邮箱" :visible.sync="visible" width="900px" :append-to-body="true" class="safe-check">
        <div class="safe-check-content">
            <div class="safe-step">
                <el-steps :active="active" finish-status="success" align-center>
                    <el-step title="验证邮箱"></el-step>
                    <el-step title="更改邮箱"></el-step>
                    <el-step title="完成"></el-step>
                </el-steps>
            </div>
            <div class="safe-content" v-if="emailCheck && active < 3">
                <p class="title mat-80"><span v-if="active === 0">变更重要信息需要先进行安全验证哦！</span><span v-if="active >= 1">请在下方输入新邮箱的地址进行更改</span></p>
                <div class="gray-back mat-30">
                    <input type="text" class="email-input" placeholder="请输入邮箱"  v-model="oldEmail" :readonly="active === 0"/>
                </div>
                <div class="gray-back mat-10">
                    <input type="text" class="verify-code" placeholder="请输入验证码" v-model="code"/>
                    <div class="verify-btn cursor" @click="sendEmailCode" v-if="!verifyFLag">发送邮箱验证码</div>
                    <el-button class="verify-btn" style="line-height: 1;background: #f6dcb6;border: none;" v-else disabled>{{time}}秒</el-button>
                </div>
                <div class="btn_wrap">
                    <el-button type="primary"  style="margin-right: 10px;" @click="nextStep" :disabled="code.length <= 0 || oldEmail.length <= 0">{{active === 0 ? '确认验证' : '确认更改'}}</el-button>
                    <el-button  plain @click="close">取消</el-button>
                </div>
            </div>
            <div class="safe-content" v-if="!emailCheck && active < 3">
                <p class="title mat-70" style="text-align: center;">请使用您账号绑定的微信扫描图中二维码</p>
                <div class="qr-wrap">
                    <img :src="qrCodeUrl">
                </div>
            </div>
            <div class="safe-success" v-if="active >= 3">
                <i class="iconfont icon-chenggong1"></i>
                <p class="success-title">操作成功</p>
                <p class="success-txt">更改邮箱完成</p>
                <el-button type="primary"  class="success-btn" @click="close">知道了</el-button>
            </div>
            <div class="safe-footer" v-if="active === 0">
                <div class="line"></div>
                <div class="txt cursor" @click="changeCheck">{{emailCheck ? '微信扫码' : '邮箱'}}验证</div>
                <div class="line"></div>
            </div>
        </div>
    </el-dialog>
</template>
<script>
    import store from 'store'
    import {server_base_url, img_url} from 'common/config'
    let timer
    export default {
        props:['safeInfo', 'qrCodeUrl', 'verData'],
        data() {
            return {
                visible: false,
                active: 0,
                emailCheck: true,
                oldEmail: '',
                verifyFLag: false,
                time: 60,
                code: '',
                tempId: '',
                ver_id: '',
                ver_code: ''
            }
        },
        watch:{
            safeInfo(val) {
                this.visible = val.visible
                this.oldEmail = val.oldEmail
            },
            verData(val) {
                this.emailCheck = true
                this.active = 1
                this.oldEmail = ''
                this.ver_id = val.ver_id
                this.ver_code = val.ver_code
            }
        },
        created() {
        },
        methods: {
            close() {
                this.visible = false
                this.active = 0
                this.initData()
            },
            checkEmailFormat() {
                let regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if (!regEmail.test(this.oldEmail)) {
                    this.$message.warning('邮箱格式不正确')
                    return false
                } else {
                    return true
                }
            },
            changeCheck() {
                const userData = store.state.user_info.user
                //验证账号是否绑定微信
                if (!userData.bind_wxgz){
                    this.$message.warning('账号未绑定微信，请先绑定后再验证')
                }else {
                    this.emailCheck = !this.emailCheck
                    this.active = 0
                    if (!this.emailCheck) {
                        this.$emit('wxVerify')
                    }
                }

            },
            initData() {
                this.oldEmail = ''
                this.code = ''
                this.time = 60
                this.verifyFLag = false
                clearInterval(timer)
            },
            nextStep() {
                if (!this.checkEmailFormat()) {
                    return false
                }
                console.log(111)
                let params
                if (this.active === 1) {
                    params = {
                        code: this.code,
                        email: this.oldEmail
                    }
                } else {
                    params = {
                        code: this.code
                    }
                }
                if (!this.tempId) {
                    this.$message.warning('请先发送验证码')
                    return false
                }
                this.$fetch.api_safe.checkVerify(params, this.tempId).then(({msg, data, code}) => {
                    if (code === 0) {
                        this.active ++
                        this.tempId = ''
                        if (this.active === 2) {
                            this.active = 3
                            this.$emit('updateInfo')
                        } else {
                            this.ver_id = data.ver_id
                            this.ver_code = data.ver_code
                        }
                        this.initData()
                        this.$message.success(msg)
                    } else {
                        this.$message.warning(msg)
                    }
                }).catch(({msg}) => {
                    this.$message.error(msg)
                })
                
            },
            sendEmailCode() {
                if (!this.checkEmailFormat()) {
                    return false
                }
                this.verifyFLag = true
                let params
                if (this.active > 0) {
                    params = {
                        type: 1,
                        email: this.oldEmail,
                        ver_id: this.ver_id,
                        ver_code: this.ver_code
                    }
                } else {
                    params = {
                        type: 1
                    }
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
            }
        }
    }
</script>
<style lang="scss">
.safe-check{
    line-height: 1;
    .el-button--small{
        font-size: 15px;
    }
    .el-dialog{
        border-radius: 4px;
        height: 640px;
        margin-top: 15vh !important;
    }
    .safe-step{
        padding: 0 110px;
        margin-top: 20px;
    }
    .el-step__title{
        font-size: 14px;
    }
    .is-success{
        color: #ECB86C;
        border-color: #ECB86C;
    }
    .el-step__title.is-wait{
        color: #999;
        font-size: 14px;
    }
    .el-step__title.is-process {
        font-weight: 400;
        color: #666;
        font-size: 14px;
    }
    .el-step__icon.is-text {
        border: 1px solid #E1E4EE;
    }
    .el-step__icon{
        width: 30px;
        height: 30px;
        color: #999999;
        font-size: 16px;
    }
    .is-process{
        .el-step__icon{
            color: #fff;
            background: #ECB86C;
            border: none;
        }
    }
    .is-success{
        .el-step__icon.is-text{
            border: 1px solid #ECB86C;
            color: #ECB86C;
        }
    }
    .el-step__line{
        height: 1px !important;
        background-color: #E1E4EE !important;
    }

    .safe-content{
        width: 285px;
        margin: 0 auto;
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
                border-radius:0px 4px 4px 0px;
                &:active{
                    opacity: 0.5;
                }
            }
        }
        .btn_wrap{
            margin: 60px 0 0 35px;
        }
        .qr-wrap{
            width: 215px;
            height: 215px;
            box-shadow:1px 3px 13px 0px rgba(198,203,222,0.61);
            margin: 30px auto 0;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
    .safe-footer{
        width: 610px;
        position: absolute;
        left: 50%;
        margin-left: -305px;
        bottom: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        .line{
            flex: 1;
            height: 1px;
            background: #E1E4EE;
        }
        .txt{
            padding: 0 10px;
            color: #9FA5B9;
            font-size: 14px;
            font-weight:400;
            text-align: center;
        }
    }
    .safe-success{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        i{
            color: #3ec483;
            font-size: 73px;
            margin-top: 60px;
        }
        .success-title{
            font-size:18px;;
            font-weight:400;
            color: #333;
            padding-top: 30px;
        }
        .success-txt{
            font-size:14px;;
            font-weight:400;
            color: #999;
            padding-top: 10px;
        }
        .success-btn{
            font-size: 15px;
            line-height: 1;
            padding: 11px 72px;
            margin-top: 60px;
        }
    }
}
</style>
