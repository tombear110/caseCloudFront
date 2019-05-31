<template>
    <div class="userInfo">
        <div class="top-menu" style="background: #323232;">
            <img :src="logoImg" class="top-logo-img cursor" @click="jumpWebsite" alt="logo"/>
        </div>
        <div class="userInfo-content">
            <div class="userInfo-back cursor" @click="backLast"><i class="iconfont icon-fanhui1"></i>返回桌面</div>
            <div class="info-wrap">
                <div class="info-left">
                    <div class="ua-avatar">
                        <el-upload
                            class="upload-box"
                            :action=uploadUrl()
                            :headers=header()
                            name='avatar'
                            accept="image/png"
                            :show-file-list="false"
                            :before-upload="beforeAvatarUpload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="successBack"
                            list-type="picture">
                            <div class="avatar-box">
                                <img :src="avatarUrl" @mouseover="showShadow = true" class="avatar" alt="头像"/>
                                <div class="avatar-shadow" v-if="showShadow" @mouseout="showShadow = false">修改头像</div>
                            </div>
                        </el-upload>
                    </div>
                    <div class="left-txt" :class="tabIndex === 0 ? 'left-active' : ''" @click="tabChange(0)">个人信息</div>
                    <div class="left-txt" :class="tabIndex === 1 ? 'left-active' : ''" @click="tabChange(1)">账号安全</div>
                    <div class="left-txt" :class="tabIndex === 2 ? 'left-active' : ''" @click="tabChange(2)">通知设置</div>
                </div>
                <div class="info-right" v-if="tabIndex === 0" v-loading="loadingInfo">
                    <el-form ref="form" label-width="100px" :label-position="labelPosition" size="small"
                             :model="form"
                             :rules="rules"
                             :hide-required-asterisk="true">
                        <el-row :gutter="24">
                            <el-col :span="17">
                                <el-form-item label="姓名" prop="real_name">
                                    <el-input v-model="form.real_name"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="24">
                            <el-col :span="17">
                                <el-form-item label="性别" prop="sex">
                                    <el-radio-group v-model="form.sex">
                                        <el-radio :label="0">男</el-radio>
                                        <el-radio :label="1">女</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="24">
                            <el-col :span="17">
                                <el-form-item label="手机" prop="mobile">
                                    <el-input v-model="form.mobile" type="tell"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="24">
                            <el-col :span="17">
                                <el-form-item label="出生日期">
                                    <el-date-picker
                                        v-model="form.birthday"
                                        type="date"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        :editable="false"
                                        placeholder="选择生日"
                                        style="width: 100%;"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="24">
                            <el-col :span="17">
                                <el-form-item label="执业律所" prop="lawfirm">

                                    <!--<el-button type="primary" size="small" class="mg-left-20" @click="openLawfirmDialog"-->
                                    <!--v-if="!form.firm_id && form.team_id===0">加入律所-->
                                    <!--</el-button>-->
                                    <!--:disabled="!form.firm_id && form.team_id===0"-->
                                    <el-input v-model="form.lawfirm"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="24">
                            <el-col :span="17">
                                <el-form-item label="执业证号" prop="card_num">
                                    <el-input v-model="form.card_num"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="24">
                            <el-col :span="17">
                                <el-form-item label="首次执业时间">
                                    <el-date-picker
                                        v-model="form.card_years"
                                        type="date"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        :editable="false"
                                        placeholder="选择年份"
                                        style="width: 100%;"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="个人说明" prop="per_des">
                                    <el-input type="textarea" :rows="5" v-model="form.per_des"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div class="btn_wrap">
                            <el-button type="primary" size="small" @click="onSubmit('form')">确认修改</el-button>
                            <el-button size="small" plain @click="backLast">返回</el-button>
                        </div>
                    </el-form>
                </div>
                <div class="info-right" v-else-if="tabIndex === 1">
                    <div class="info-change-item" style="margin-top: 160px;">
                        <span class="change-txt">密码</span>
                        <!-- <input class="change-val" type="password" value='12345678' readonly="readonly"/> -->
                        <span class="change-val">●●●●●●</span>
                        <span class="change-switch" @click="openPasswordDialog">修改</span>
                    </div>
                    <div class="info-change-item">
                        <span class="change-txt">邮箱</span>
                        <span class="change-val" :class="{'email-unactive':!emailActive}">{{email}}</span>
                        <span class="change-switch" @click="modifyEmail">编辑</span>
                        <span class="text-info cursor mg-left-20" v-if="!emailActive" @click="sendActiveEmail()">重新发送激活邮件</span>
                    </div>
                    <div class="info-change-item">
                        <span class="change-txt">微信</span>
                        <span class="change-val">{{isBindWx ? '已' : '未'}}绑定</span>
                        <span class="change-switch co-EC5050" @click="wxUntied" v-if="isBindWx">解绑</span>
                        <span class="change-switch" @click="getQrUrl('bindWx')" v-else>绑定</span>
                    </div>
                </div>
                <div class="info-right" v-else style="margin-top: 120px;">
                    <div class="set-wrap" v-for="(item, index) in tipItems" :key="index">
                        <div class="set-title">
                            <i class="iconfont" :class="item.fontClass"></i>
                            <span class="title-txt">{{item.txt}}</span>
                            <el-switch
                                v-model="item.switchOpen"
                                active-color="#13ce66"
                                @change="switchChange(index, item.switchOpen)"
                            >
                            </el-switch>
                        </div>
                        <div class="set-content">{{item.content}}</div>
                    </div>
                </div>
            </div>
        </div>
        <password-change :password-data="passwordData"></password-change>
        <bind-wx :qr-info="qrInfo" :qr-code-url="qrCodeUrl"></bind-wx>
        <unbind-wx
            :un-wx-info="unWxInfo"
            :qr-code-url="qrCodeUrl"
            :ver-data="verData"
            @updateInfo="getUserInfo">
        </unbind-wx>
        <safe-check
            :safe-info="safeInfo"
            :qr-code-url="qrCodeUrl"
            :ver-data="verData"
            @updateInfo="getUserInfo"
            @wxVerify="getQrUrl('checkUser')">
        </safe-check>
    </div>
</template>
<script type="text/javascript">
    import {mapActions, mapMutations} from 'vuex'
    import {SET_USER_INFO, SET_NOTIFY_INFO, SET_V_INFO} from 'store/actions/type'
    import { SET_WXGZ } from 'store/mutations/type'
    import store from 'store'
    import {server_base_url, img_url} from 'common/config'
    import logoImg from 'assets/images/light-logo.png'
    import defaultAvatar from 'assets/images/user.png'
    import {filterFormData} from 'common/lib/common'
    import bindWx from '../../components/business/safe/bind-wx/index'
    import unbindWx from '../../components/business/safe/unbind-wx/index'
    import safeCheck from '../../components/business/safe/safe-check/index'

    export default {
        data() {
            let regexpMobile = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('必填项'))
                } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(value))) {
                    callback(new Error('请输入正确的手机号'))
                } else {
                    callback()
                }
            }
            return {
                labelPosition: 'left',
                logoImg: logoImg,
                defaultAvatar: defaultAvatar,
                newImg: '',
                imageUrl: '',
                rules: {
                    real_name: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '必填项！', trigger: 'blur'},
                        {validator: regexpMobile, message: '请输入正确的手机号！', trigger: 'blur'}
                    ]
                },
                email: '',
                emailActive: true,
                form: {
                    real_name: '',
                    mobile: '',
                    sex: 0,
                    birthday: '',
                    lawfirm: '',
                    card_years: '',
                    card_num: '',
                    per_des: '',
                },
                tabIndex: 0,
                passwordData: {},
                url: server_base_url,
                user_info: store.state.user_info.user,
                img_url: img_url,
                showShadow: false,
                loadingInfo: false,
                isBindWx: false,
                qrInfo: {},
                clientId: '',
                qrCodeUrl: '',
                safeInfo: {},
                unWxInfo: {},
                verData: {},
                tipItems: [
                    {
                        fontClass: 'icon-zhuomianguanli',
                        txt: '桌面通知',
                        content: '系统会弹出气泡提醒您有新消息（仅对 Chrome 、Firefox 、Safari 浏览器和 PC 客户端有效）',
                        switchOpen: false
                    },
                    {
                        fontClass: 'icon-youjian',
                        txt: '邮件通知',
                        content: '系统会发送邮件至 提醒您有新消息',
                        switchOpen: false
                    },
                    {
                        fontClass: 'icon-weixin2',
                        txt: '微信公众号通知',
                        content: '系统将通过微信公众号弹窗的方式通知到您',
                        switchOpen: false
                    }
                ]
            }
        },
        components: {
            bindWx,
            safeCheck,
            unbindWx
        },
        computed: {
            avatarUrl() {
                let result = ''
                if (this.user_info.img_path) {
                    result = this.user_info.img_path.substr(0, 4) === 'http' ? this.user_info.img_path : `${this.img_url}${this.user_info.img_path}`
                } else {
                    result = this.defaultAvatar
                }
                return result

            },
        },
        sockets: {
            //这里是监听connect事件
            connect: function () {
                this.clientId = this.$socket.id
            }
        },

        created(){
            this.inActive()
        },

        mounted() {
            this.$socket.emit('connect')
            this.$options.sockets['WxMsg_' + this.clientId] = (data) => {
                if (data.code === 0) {
                    this.isBindWx = true
                    this.qrInfo = {
                        visible: false
                    }
                    if (data.data) {
                        this.verData = {
                            ver_code: data.data.ver_code,
                            ver_id: data.data.ver_id
                        }
                    }
                    if (data.msg === '账号成功绑定微信！') {
                        this.set_wxgz(true)
                        const baseUserInfo = store.state.user_info
                        baseUserInfo.user.bind_wxgz = true
                        this.set_user_info({
                            login: baseUserInfo.login,
                            token: baseUserInfo.token,
                            user: baseUserInfo.user
                        })
                    }
                    this.$message.success(data.msg)
                } else {
                    this.$message.warning(data.msg)
                }
            }
            if (store.state.user_info.user.img_path) {
                this.newImg = this.img_url + store.state.user_info.user.img_path
            }
            this.getUserInfo()
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

            inActive() {
                const user = store.state.user_info.user
                const token = this.$route.query.token
                if (user.active===1 || !token){return}
                this.tabIndex = 1
                this.$fetch.api_user.checkActive({token: token})
                    .then(({
                               msg,
                               data
                           }) => {
                        //存储激活状态
                        let userInfo = store.state.user_info
                        userInfo.user.active = 1
                        this.emailActive = 1
                        this.set_user_info(userInfo)
                    })
            },

            sendActiveEmail () {
                this.$fetch.api_user.emailActive()
                    .then(
                        ({
                             msg
                         }) => {

                        }
                    )
            },

            jumpWebsite() {
                window.open('http://www.law086.com/')
            },
            getUserInfo() {
                this.loadingInfo = true
                this.$fetch.api_user.getUser().then(({data}) => {
                    if (data.desknotify == 1) {
                        this.tipItems[0].switchOpen = true
                    } else {
                        this.tipItems[0].switchOpen = false
                    }
                    if (data.emailnotify == 1) {
                        this.tipItems[1].switchOpen = true
                    } else {
                        this.tipItems[1].switchOpen = false
                    }
                    if (data.wxnotify == 1 && data.wxgz_openid) {
                        this.tipItems[2].switchOpen = true
                    } else {
                        this.tipItems[2].switchOpen = false
                    }
                    this.loadingInfo = false
                    if (data.wxgz_openid) {
                        this.isBindWx = true
                    } else {
                        this.isBindWx = false
                    }
                    this.email = data.email
                    this.tipItems[1].content = `系统会发送邮件至 ${data.email} 提醒您有新消息`
                    this.emailActive = data.active === 1
                    this.form = filterFormData(data, this.form)

                }).catch(({msg}) => {
                    this.loadingInfo = false
                })
            },
            //修改用户信息
            onSubmit(formName) {
                let uid = store.state.user_info.user.id
                this.$refs[formName].validate((valid) => {
                    if (!valid) return false
                    this.$fetch.api_user.changeUser(this.form, uid).then(({msg,data}) => {
                        //存储用户更改后的数据
                        let arr1 = this.form
                        let arr2 = store.state.user_info.user
                        let newUserInfo = this.$changeStore(arr1, arr2)
                        const baseUserInfo = store.state.user_info
                        this.set_user_info({
                            login: baseUserInfo.login,
                            token: baseUserInfo.token,
                            user: newUserInfo
                        })
                    })
                })
            },
            tabChange(val) {
                this.tabIndex = val
            },
            openPasswordDialog() {
                this.passwordData = {
                    visible: true
                }
            },
            beforeAvatarUpload(file) {
                const isPNG = file.type === 'image/png'
                const isLt1M = file.size / 1024 / 1024 < 1
                if (!isPNG) {
                    this.$message.error('上传头像图片只能是 PNG 格式!')
                }
                if (!isLt1M) {
                    this.$message.error('上传头像图片大小不能超过 1MB!')
                }
                return isLt1M && isPNG
            },
            handlePreview(file) {
                console.log('shangchuan ', file)
            },
            handleRemove(file, fileList) {
                console.log(file, fileList)
            },
            uploadUrl() {
                const user = store.state.user_info.user
                let id = user ? user.id : ''
                return this.url + 'user/uploadAvatar/' + id
            },
            header() {
                return {authorization: 'Bearer ' + store.state.user_info.token}
            },
            successBack: function (res, file) {
                this.imageUrl = URL.createObjectURL(file.raw)
                let img_path = res.data.user_info.img_path
                let base = store.state.user_info
                this.$set(base.user, 'img_path', img_path)
                //存储用户头像
                this.set_user_info(base)
            },
            backLast() {
                this.$router.push({name: 'calendar'})
            },
            wxUntied() {
                this.unWxInfo = {
                    visible: true,
                    email: this.email
                }
                this.getQrUrl('checkUser')
            },
            getQrUrl(val) {
                let params = {
                    pushClientId: this.clientId,
                    type: val
                }
                if (val === 'bindWx') {
                    this.qrInfo = {
                        visible: true
                    }
                }
                this.$fetch.api_user.loginQr(params).then(({msg, data}) => {
                    this.qrCodeUrl = this.img_url + data.qrCodeUrl
                }).catch(({msg}) => {
                    this.$message.error(data.msg)
                })
            },
            modifyEmail() {
                this.safeInfo = {
                    visible: true,
                    oldEmail: this.email
                }
            },
            changeSwitchFlag(val) {
                if (val) {
                    return 1
                } else {
                    return 0
                }
            },
            switchChange(val, flag) {
                let uid = store.state.user_info.user.id
                let params
                let newFlag = this.changeSwitchFlag(flag)
                if (val == 0) {
                    params = {
                        desknotify: newFlag
                    }
                }
                if (val == 1) {
                    params = {
                        emailnotify: newFlag
                    }
                }
                if (val == 2) {
                    if (!this.isBindWx && this.tipItems[2].switchOpen) {
                        this.getQrUrl('bindWx')
                        this.tipItems[2].switchOpen = false
                        return false
                    } else {
                        params = {
                            wxnotify: newFlag
                        }
                    }
                }
                this.$fetch.api_user.changeUser(params, uid).then(({msg, code}) => {
                    if (code === '0' || code === 0) {
                        let arr1 = params
                        let arr2 = store.state.user_info.user
                        let newUserInfo = this.$changeStore(arr1, arr2)
                        const baseUserInfo = store.state.user_info
                        this.set_user_info({
                            login: baseUserInfo.login,
                            token: baseUserInfo.token,
                            user: newUserInfo
                        })
                    }
                })
            }
        }
    }

</script>
<style lang="scss">
    .userInfo {
        .top-logo-img {
            width: 100px;
            height: 26px;
            margin-left: 50px;
        }

        .userInfo-content {
            width: 1000px;
            margin: 0 auto;

            .userInfo-back {
                font-size: 14px;
                color: #999;
                margin-top: 88px;

                i {
                    color: #666;
                    padding-right: 10px;
                }
            }

            .info-wrap {
                width: 1000px;
                height: 530px;
                background: #fff;
                border-radius: 10px;
                margin-top: 25px;
                padding: 70px 0;
                display: flex;

                .info-left {
                    width: 270px;
                    text-align: center;
                    border-right: 1px solid #E1E4EE;

                    img {
                        width: 80px;
                        height: 80px;
                        margin-top: 100px;
                        margin-bottom: 20px;
                        border-radius: 50%;
                        box-shadow: 0 1px 13px 0 rgba(194, 204, 235, .29);
                        border: 1px solid #e1e4ee;
                    }

                    .avatar-box {
                        position: relative;
                    }

                    .avatar-shadow {
                        width: 80px;
                        height: 80px;
                        line-height: 80px;
                        border-radius: 50%;
                        position: absolute;
                        bottom: 20px;
                        left: 0;
                        background: rgba(0, 0, 0, .5);
                        color: #fff;
                        font-weight: 400;
                        font-size: 16px;
                        text-align: center;
                    }

                    .left-txt {
                        font-size: 16px;
                        font-weight: 400;
                        color: #999;
                        margin-top: 30px;
                        cursor: pointer;
                    }

                    .left-active {
                        color: #333;
                        position: relative;

                        &::after {
                            content: '';
                            width: 2px;
                            height: 20px;
                            position: absolute;
                            right: -1px;
                            top: 2px;
                            background: #ECB86C;
                        }
                    }
                }

                .info-right {
                    flex: 1;
                    padding-left: 70px;
                    padding-right: 80px;

                    .btn_wrap {
                        margin-left: 105px;
                    }

                    .info-change-item {
                        font-size: 14px;
                        font-weight: 400;
                        margin-bottom: 45px;

                        .change-txt {
                            padding-right: 90px;
                        }

                        .change-val {
                            display: inline-block;
                            width: 280px;

                        }

                        .email-unactive {
                            position: relative;

                            &:after {
                                content: '未激活';
                                color: #999;
                                margin-left: 20px;
                            }
                        }

                        .change-switch {
                            color: #9FA5B9;
                            cursor: pointer;
                        }
                    }

                    .el-form-item--small.el-form-item {
                        margin-bottom: 20px;
                    }

                    .el-radio {
                        margin-right: 55px;
                    }

                    .set-wrap{
                        margin-bottom: 20px;
                    }
                    .set-title{
                        display: flex;
                        align-items: center;
                        i{
                            font-size: 17px;
                            color: #9FA5B9;
                        }
                        .title-txt{
                            flex: 1;
                            padding-left: 10px;
                        }
                    }
                    .set-content{
                        font-size: 12px;
                        line-height: 20px;
                        color: #999;
                        font-weight:400;
                        padding: 14px 0 13px 25px;
                    }
                }
            }
        }
    }
</style>
