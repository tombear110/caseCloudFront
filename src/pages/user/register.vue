<template>
    <div
        class="login-form"
        @keyup.enter="postFormData('form')"
    >
        <div class="user-input">
            <img src="/static/images/login-logo.png" class="logo" alt="logo" style="margin-top: -40px;">
            <!-- <h3 class="logo-text">法律人首选的案件管理云平台</h3> -->
            <h4 style="margin-top: 15px;margin-bottom: 0;color: #8A8AA7;" v-if="firm_name">律所名称 ：{{firm_name}}</h4>
            <h4 style="margin-top: 15px;color: #8A8AA7;margin-bottom: 0;" v-if="team_name">团队名称 ：{{team_name}}</h4>
            <!-- <ul class="register-type">
                <el-radio-group
                    v-model="form.account_type"
                    size="medium"
                >
                    <el-radio
                        :label="1"
                        border
                        :disabled="isFirmInvited"
                    >个人账号</el-radio>
                    <el-radio
                        :label="2"
                        border
                        :disabled="true"
                        v-if="false"
                    >律所账号</el-radio>
                </el-radio-group>
            </ul> -->
            <el-form
                ref="form"
                :model="form"
                :rules="rules"
                class="form-box"
            >
                <!--<el-form-item prop="mobile">-->
                <!--<el-input type="text" v-model="form.mobile" placeholder="手机号">-->
                <!--<i slot="prefix" class="iconfont ft-18 icon-xingming "></i>-->
                <!--<el-button size="mini" type="primary" slot="suffix" @click="sendCaptcha()" :disabled="captchaDisabled">{{captchaText}}</el-button>-->
                <!--</el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item prop="code">-->
                <!--<el-input type="text" v-model="form.code" placeholder="验证码">-->
                <!--<i slot="prefix" class="iconfont ft-18 icon-xingming "></i>-->
                <!--</el-input>-->
                <!--</el-form-item>-->
                <el-form-item prop="email">
                    <el-input
                        type="text"
                        v-model="form.email"
                        placeholder="邮箱"
                        :autofocus="true"
                        style="margin-top: 50px;"
                    >
                        <i
                            slot="prefix"
                            class="iconfont ft-18 icon-mail "
                        ></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="name">
                    <el-input
                        type="text"
                        v-model="form.name"
                        placeholder="姓名"
                    >
                        <i
                            slot="prefix"
                            class="iconfont ft-18 icon-xingming "
                        ></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="mobile">
                    <el-input
                        type="email"
                        v-model="form.mobile"
                        placeholder="手机号"
                        :autofocus="true"
                    >
                        <i
                            slot="prefix"
                            class="iconfont ft-18 icon-shouji1"
                        ></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        :type="passwordType1"
                        v-model="form.password"
                        autocomplete="new-password"
                        placeholder="密码"
                        :autofocus="true"
                    >
                        <i
                            slot="prefix"
                            class="iconfont ft-18 icon-icon-mima "
                        ></i>
                        <i
                            slot="suffix"
                            class="iconfont ft-18   cursor"
                            :class="(count1%2 === 0) ? 'icon-eyes-close': 'icon-eyes-open'"
                            @click="togglePasswordType1"
                        ></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="checkPass">
                    <el-input
                        :type="passwordType2"
                        v-model="form.checkPass"
                        autocomplete="new-password"
                        placeholder="确认密码"
                    >
                        <i
                            slot="prefix"
                            class="iconfont ft-18 icon-zaicishurumima_fuzhi "
                        ></i>
                        <i
                            slot="suffix"
                            class="iconfont ft-18   cursor"
                            :class="(count2%2 === 0) ? 'icon-eyes-close': 'icon-eyes-open'"
                            @click="togglePasswordType2"
                        ></i>
                    </el-input>
                </el-form-item>
                <p class="register-protocol">
                    <el-checkbox v-model="checkFlag" style="margin-right: 10px;" @change="checkChange"></el-checkbox>我已阅读我已阅读并遵守<span class="cursor" @click="showProtocol">《用户协议》</span>
                    <span class="protoco-tip" v-if="showProtocolTip">请勾选用户协议</span>
                </p>
                <el-form-item
                    class="text-center"
                    style="padding-top: 40px"
                >
                    <el-button
                        type="primary"
                        size="large"
                        style="width: 100%;"
                        @click="postFormData('form')"
                    >免 费 注 册
                    </el-button>
                </el-form-item>
            </el-form>
            <ul class="other-login">
                <li class="line"></li>
                <li class="text">
                    <router-link to="/login">
                        <span>账号登陆</span>
                    </router-link>
                </li>
                <li class="line"></li>
            </ul>
        </div>
        <el-dialog  :visible.sync="protocolShow" class="register-dialog" append-to-body width="680px" :close-on-click-modal="false">
            <div class="title">
                <img src="/static/images/protocol_top.png" />
                <div class="txt">案件云服务协议</div>
            </div>
            <div class="content-shadow"></div>
            <div class="content-wrap">
            <div class="content">
                <div class="content-title">1、特别提醒</div>
                <div class="content-txt">欢迎您签署本《案件云服务协议》并使用案件云平台服务！为维护您自身权益，请您仔细阅读各条款，<span class="register-bold-txt">特别是免除或限制责任的条款、法律适用和争议解决条款。免除或者限制责任的条款将以粗体下划线标识，您应重点阅读。</span>如您对协议有任何疑问，可向案件云平台客服咨询。</div>
                <div class="content-txt"><span class="register-bold-txt">当您按照注册页面填写信息、阅读并同意本协议且完成全部注册程序后，即表示您已充分阅读、理解并接受本协议的全部内容。</span>阅读本协议的过程中，如果您不同意本协议或其中任何条款约定，您可随时停止注册程序。</div>
                <div class="content-txt">案件云平台由网页版和微信小程序两部分组成，本协议同时适用于网页版和微信小程序。案件云平台归上海律杏信息科技有限公司(以下简称律杏科技)所有并由律杏科技负责运营。</div>
                <div class="content-txt">律杏科技保留自行决定在任何时候修改、增加或删除本协议部分内容的权利，相应变更自通过互联网发布之时立即生效。如有争议，以最新条款为准。用户有责任定期查看本协议的变更。用户在协议变更后继续使用案件云平台，即表示用户同意且接受该变更。</div>
                <div class="content-title">2、知识产权</div>
                <div class="content-txt">2.1  案件云平台使用的所有商标，未经律杏科技或相关权利人书面授权，任何组织、单位或个人不得出于盈利目的或者以恶意方式使用。<br/>2.2  案件云平台上所有内容的著作权归律杏科技或相关权利人所有，受包括但不限于中华人民共和国著作权法的相关法律法规以及国际条约的保护。<br/>2.3 <span class="register-bold-txt">未经律杏科技事先书面许可，互联网任何主体不得使用机器人、蜘蛛、爬虫等其他自动设备或程序，或者手动程序复制、传播案件云平台包含的内容。一经发现，案件云平台有权立即对该用户终止服务，并保留追究相应法律责任的权利。</span></div>
                <div class="content-title">3、用户注册</div>
                <div class="content-txt">3.1  用户申请账号或者使用案件云平台服务时，不得冒用他人身份资料。一经发现，案件云平台有权立即对该用户终止服务。<br/>3.2  <span class="register-bold-txt">用户不可通过计算机程序等自动方式创建账户，也不可对账户使用自动系统执行操作，否则案件云平台有权终止对该用户账号的服务。</span></div>
                <div class="content-title">4、隐私政策</div>
                <div class="content-txt">4.1 <span class="register-bold-txt">案件云平台对用户账户提供密码保护功能，以确保用户隐私和信息安全。除另行特别明示外，用户向案件云平台提交的任何材料均会作为保密材料对待。</span><br/>4.2 <span class="register-bold-txt">用户确认其知晓，账户和信息的实际安全同时受到部分或全部下列因素影响：</span><br/>4.2.1用户是否妥善保管其电脑、手机等设备，是否在安全的网络环境下登录案件云平台，以及登录时所使用的电脑、手机等设备是否处于信息安全状态；<br/>4.2.2用户是否采取高等级的账户保护方式；<br/>4.2.3用户是否妥善保管其账号及密码。<br/>4.3 用户若发现任何安全漏洞或其账号被非法使用的情况，<span class="register-bold-txt">应当立即通知案件云平台。</span><br/>4.4 <span class="register-bold-txt">除下列情形外，案件云平台不会公开或披露用户的个人信息和数据：</span><br/>4.4.1<span class="register-bold-txt">用户明确同意案件云平台共享信息；</span><br/>4.4.2<span class="register-bold-txt">依照法律、法规的强制性要求必须向有权主体提供信息时。</span></div>
                <div class="content-title">5、收费条款</div>
                <div class="content-txt">案件云平台提供的服务包括收费服务和免费服务。其中，收费服务包括但不限于高阶及以上版本服务。对于收费服务，律杏科技会在用户使用之前给予明确的提示，只有用户根据提示确认相关内容、支付费用后，才可以使用相关收费服务。如用户拒绝确认相关内容或支付费用，则律杏科技有权不向用户提供该等收费服务。</div>
                <div class="content-title">6、内容限制</div>
                <div class="content-txt">6.1 用户声明并保证享有其在案件云平台录入或者上传内容的合法权利或取得合法授权；用户保证在案件云平台上公开发布的内容应是合法、真实、准确、非误导性的；用户保证其在案件云平台上公开发布的内容不侵犯任何个人或实体的任何权利或造成对任何个人或实体的伤害。<br/>6.2 用户使用案件云平台需遵循国家相关法律法规，不得以任何方式上传、发布、散播下列内容：<br/>6.2.1反对宪法所确定的基本原则的；<br/>6.2.2危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；<br/>6.2.3损害国家荣誉和利益的；<br/>6.2.4煽动民族仇恨、民族歧视，破坏民族团结的；<br/>6.2.5破坏国家宗教政策，宣扬邪教和封建迷信的；<br/>6.2.6散布谣言，扰乱社会秩序，破坏社会稳定的；<br/>6.2.7散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的、欺诈性的讯息、数据、信息、文本、音乐、声音、照片、图形、代码或其它材料；<br/>6.2.8侮辱或者诽谤他人，侵害他人合法权益的；<br/>6.2.9违反宪法和法律、行政法规或规章制度的；<br/>6.2.10可能侵犯他人的专利、商标、商业秘密、版权或其它知识产权或专有权利的内容；<br/>6.2.11假冒任何主体或以其它方式歪曲用户与该主体之关联性的内容；<br/>6.2.12未经请求而擅自提供的促销信息、政治活动、广告或意见征集；<br/>6.2.13未经当事人许可上传并公开任何第三方私人信息；<br/>6.2.14病毒、不可靠数据或其它有害的、破坏性的或危害性的文件；<br/>6.2.15与内容所在的互动区域的话题不相关的内容；<br/>6.2.16限制、妨碍他人使用案件云平台的内容，或者可能使案件云平台或其关联方或用户遭致任何类型损害或责任的内容。<br/>6.3 用户不得从事下列危害计算机信息网络安全的活动：<br/>6.3.1 对计算机信息网络功能进行删除、修改或者增加；<br/>6.3.2 对进入计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加；<br/>6.3.3故意制作、传播计算机病毒等破坏性程序；<br/>6.3.4其他危害计算机信息网络安全的行为。<br/></div>
                <div class="content-title">7、免责声明</div>
                <div class="content-txt">7.1  案件云平台中提供的各种形式的资料仅供用户参考使用，用户使用时应自行甄别、比对、审核，律杏科技不对以上资料所引起的纠纷承担法律责任。<br/>7.2 案件云平台需要定期或不定期地对提供网络服务的平台或相关的设备进行检修或者维护，该检修或维护将造成平台网络服务（包括收费服务）的暂时中断，用户同意案件云平台有权随时变更、中断部分或全部的网络服务。<br/><span class="register-bold-txt">如案件云平台终止全部服务（包括收费服务），律杏科技将根据具体情形在服务终止前的合理期限内通知用户，提醒用户转移个人信息和数据。一旦服务终止，用户使用本平台的权利立即终止，由于用户个人原因未在通知转移期限内转移个人信息和数据，其在平台中储存的个人信息和数据可能无法恢复，案件云平台不对此承担责任。</span><br/>7.3 在案件云平台提供服务过程中，基于运维管理等需要，有可能对用户录入、上传、发布的内容进行迁移、备份等操作。在案件云平台遵守保密义务并采取适当保护措施的前提下，用户明确同意并授权案件云平台基于为用户提供服务的目的，迁移、备份前述内容及其涉及的数据。用户知晓并认可对前述内容及其涉及的任何数据进行迁移、备份的行为是案件云平台为用户提供服务所必须的，不构成对用户隐私资料、保密信息的任何侵犯。<br/><span class="register-bold-txt">7.4 因用户原因（包括但不限于本协议4.2条中列明的三种情形）未尽到对电脑、手机等设备或账号、密码的妥善保管等义务，导致用户资料被泄漏、篡改、损坏或丢失的，案件云平台不承担任何责任。</span><br/></div>
                <div class="content-title">8、赔偿责任</div>
                <div class="content-txt">8.1  用户使用案件云平台从事任何违法或侵权行为，若给律杏科技或给任何第三方造成损失的，用户应负责全额赔偿。<br/>8.2 <span class="register-bold-txt">用户因使用案件云平台而产生直接损失的，如法院认定律杏科技应对用户损失承担赔偿责任，用户同意律杏科技在此情况下向用户支付的赔偿金额不超过用户因使用案件云平台向律杏科技支付的费用。</span></div>
                <div class="content-title">9、其他</div>
                <div class="content-txt mg-bottom-50">9.1  案件云平台可能通过网站页面展示、电子邮件、手机短信、手机应用消息、开发商平台消息等方式向用户发送消息通知。<br/>9.2 <span class="register-bold-txt">本协议之效力、解释、执行均适用中华人民共和国法律。如就本协议或其执行发生任何争议，应先友好协商解决；协商不成的，应向上海市崇明区人民法院提起诉讼。</span><br/>9.3  若本协议中部分条款因任何原因而被认定无效，该无效条款并不影响其他条款的有效性，且该无效条款应视为自始不存在。<br/>9.4  本协议自用户完成注册时开始生效。案件云平台终止用户资格时或案件云平台终止运营时，用户使用权利终止。<br/>9.5 律杏科技可随时转让本协议项下的权利、业务，如律杏科技转让前述权利、义务的，将告知用户。<br/>9.6  本协议最终解释权归律杏科技所有。</div>
            </div>
            </div>
            <div class="content-shadow" style="margin: 3px 0 10px;"></div>
            <div class="btn-wrap">
                 <el-button class="register-btn register-btn-white" type="info" @click="disagree">不同意</el-button>
                 <el-button type="warning" class="register-btn register-btn-yellow" @click="agree">同意</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/javascript">

import { mapActions } from 'vuex'
import { SET_USER_INFO, SET_NOTIFY_INFO, SET_V_INFO } from 'store/actions/type'
import store from 'store'

export default {
    data () {
        let validatePass1 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (this.form.checkPass !== '') {
                    this.$refs.form.validateField('checkPass')
                }
                callback()
            }
        }
        let validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
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
            captchaText: '获取验证码',
            captchaDisabled: false,
            isTeamInvited: false,
            isFirmInvited: false,
            count1: 0,
            count2: 0,
            typeActive: 0,
            passwordType1: 'password',
            passwordType2: 'password',
            typeList: [
                { value: 1, label: '个人账号' },
                { value: 2, label: '律师账号' }
            ],
            firm_name: '',
            team_name: '',
            form: {
                account_type: 1,
                email: this.$route.query.email,   //从官网免费使用带邮箱跳转过来
                name: '',
                password: '',
                checkPass: '',
                mobile: ''
                // code:'',
            },
            rules: {
                email: [
                    { required: true, message: '必填项！', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱！', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入您的姓名！', trigger: 'blur' }
                ],
                password: [
                    { validator: validatePass1, trigger: 'blur' },
                    { min: 6, max: 16, message: '长度在6~16位', trigger: 'blur' }
                ],
                checkPass: [
                    { required: true, message: '必填项！', trigger: 'blur' },
                    { validator: validatePass2, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '必填项！', trigger: 'blur' },
                    { validator: regexpMobile, message: '请输入正确的手机号！', trigger: 'blur' }
                ]
                // code: [
                //     { required: true, message: '必填项！', trigger: 'blur' }
                // ],
            },
            protocolShow: false,
            checkFlag: false,
            showProtocolTip: false
        }
    },

    created () {
        this.getTeamInfo()
    },
    methods: {
        ...mapActions({
            set_user_info: SET_USER_INFO,
            set_notify_info: SET_NOTIFY_INFO,
            set_v_info: SET_V_INFO
        }),
        sendCaptcha () {
            let num = 10
            let that = this
            let timer = setInterval(function () {
                num--
                that.captchaDisabled = true
                that.captchaText = num + '秒后重新获取'
                if (num === 0) {
                    that.captchaDisabled = false
                    that.captchaText = '获取验证码'
                    clearInterval(timer)
                }
            }, 1000)
        },

        toggleRegisterType (index) {
            this.typeActive = index
        },
        togglePasswordType1 () {
            this.count1++
            this.passwordType1 = (this.count1 % 2 === 0) ? 'password' : 'text'
        },
        togglePasswordType2 () {
            this.count2++
            this.passwordType2 = (this.count2 % 2 === 0) ? 'password' : 'text'
        },
        getTeamInfo () {
            //若存在firm_id，表示律所邀请注册
            if (this.$route.query.firm_id) {
                this.isFirmInvited = true
                this.firm_name = this.$route.query.firm_name
                this.form.account_type = 2
                this.form.email = this.$route.query.email
                this.form.token = this.$route.query.token
            }
            if (this.$route.query.team_id) {
                this.isTeamInvited = true
                this.team_name = this.$route.query.team_name
                this.form.account_type = 1
                this.form.email = this.$route.query.email
                this.form.token = this.$route.query.token
            }
        },
        postFormData (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (!this.checkFlag) {
                        this.showProtocolTip = true;
                        return false;
                    } else {
                        this.showProtocolTip = false;
                    }
                    if (store.state.wxInfo.wxgz_openid) {
                        this.form.wx_unionid = store.state.wxInfo.wx_unionid
                        this.form.wxgz_openid = store.state.wxInfo.wxgz_openid
                    }
                    let submitForm = JSON.parse(JSON.stringify(this.form))
                    const delArr = ['checkPass']
                    for (let i = 0; i < delArr.length; i++) {
                        delete submitForm[delArr[i]]
                    }
                    //注册提交
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    })
                    this.$fetch.api_user.register(submitForm)
                        .then(({
                            msg,
                            data
                        }) => {
                            loading.close();
                            this.$message.success(msg)
                            //存储返回来的用户信息
                            //TODO:此处返回的account_type可能为字符串，待确认
                            this.set_user_info({
                                user: data.user_info,
                                login: true,
                                token: data.token
                            })
                            this.set_v_info(data.v_info)
                            //若不是，直接在当前页面
                            //模拟存储消息通知
                            this.set_notify_info({
                                notify: []
                            })
                            //主动注册，律师账号，视为行政注册一个律所
                            if (parseInt(data.user_info.account_type) === 2 && data.user_info.firm_id === 0) {
                                this.$router.push({name: 'calendarMyMonth'})
                            } else {
                                // 跳转到指定路由下面
                                //团队邀请，邮箱自动激活，无需再次激活
                                //用户主动注册，邮箱未激活，跳转后展示激活页面
                                setTimeout(this.$router.push({
                                    name: 'calendarMyMonth',
                                    query: { emailActive: data.user_info.active }
                                }), 500)
                            }
                        })
                        .catch(({
                            code,
                            msg
                        }) => {
                            loading.close();
                        })
                } else {
                    if (!this.checkFlag) {
                        this.showProtocolTip = true;
                    } else {
                        this.showProtocolTip = false;
                    }
                    return false
                }

            })
        },
        resetForm (formName) {
            this.$refs[formName].resetFields()
        },
        showProtocol() {
            this.protocolShow = true;
        },
        disagree() {
            this.protocolShow = false;
            this.checkFlag = false;
        },
        agree(){
            this.protocolShow = false;
            this.checkFlag = true;
            this.showProtocolTip = false;
        },
        checkChange() {
            if (this.checkFlag) {
                this.showProtocolTip = false;
            }
        }
    }
}
</script>

<style lang="scss">
/*.login-register{
    position: relative;
    display: flex;
    align-items: center;
    height: 100vh;
    background-image: url("/static/images/new-register-back.png");
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
}*/
</style>
