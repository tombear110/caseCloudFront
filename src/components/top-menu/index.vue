<template>
    <div class="top-menu">
        <div class="menu-links">
            <img :src="logoImg" class="top-logo-img cursor" @click="jumpWebsite" alt="logo"/>
            <ul class="link-list">
                <li @click="jumpNotify">
                    <div slot="reference">
                        <el-badge :value="null" class="item top-badge">
                            <i class="iconfont icon-gerenzhongxin_bangzhuhefankui"></i>
                        </el-badge>
                    </div>
                </li>
                <li class="top-icon-wrap">
                    <el-popover
                        placement="bottom"
                        popper-class="message-popper"
                        width="400"
                        @show="msgShow(msgTab)"
                        trigger="click">
                        <div class="message-box">
                            <div class="msg-title">
                                <ul class="tab-group">
                                    <li v-for="item in msgTabs" :class="{'tab-active':msgTab===item.value}"
                                        :key="item.value" @click="msgChange(item.value)">
                                        {{item.text}}<span v-if="item.value===1">（{{unreadCount}}）</span>
                                    </li>
                                </ul>
                                <div class="tab-suffix" @click="setAllMsgRead">标记全部已读</div>
                            </div>
                            <ul class="msg-main" v-loading="msgLoading">
                                <li class="item" v-for="(item,index) in msgList" :key="index"
                                    :class="{'is-read':item.status===1}"
                                    @click="jumpMsgDetail(item)">
                                    <img :src="item.user_avatar " alt="头像"/>
                                    <ul class="item-group">
                                        <li class="ig-top">
                                            <span>{{item.add_uid_text}}</span>
                                            <span>{{item.action}}</span>
                                        </li>
                                        <li class="ig-center" v-if="item.type===1">
                                            {{item.data.c_type_text}}：{{item.data.case_name}}
                                        </li>
                                        <li class="ig-center" v-else-if="item.type===2">{{item.data.pr_name}}</li>
                                        <li class="ig-center" v-else-if="item.type===3">{{item.data.name}}</li>
                                        <li class="ig-center" v-else>{{item.data.c_type_text}}</li>
                                        <li class="ig-bottom">
                                            <span class="ib-time">{{item.created_at}}</span>
                                            <i class="iconfont icon-tick i-checked mg-right-20" v-if="item.status!==1"
                                               @click.stop="putMsgItem(item)"></i>
                                            <i class="iconfont icon-shanchu1 i-checked"
                                               @click.stop="delMsgItem(item)"></i>
                                        </li>
                                    </ul>
                                </li>
                                <li class="no-data" v-if="msgList.length===0">暂无数据</li>
                            </ul>
                        </div>
                        <div slot="reference">
                            <el-badge :value="notifyBadge" class="item top-badge">
                                <i class="iconfont icon-gonggaoguanli"></i>
                            </el-badge>
                        </div>
                    </el-popover>
                </li>
                <li @click="wxVisible = true">
                    <div slot="reference">
                        <i class="iconfont icon-weixin1" style="font-size: 23px"></i>
                    </div>
                </li>

                <li :class="{'text-info':routeName==='teamManage'}" v-for="item in linkList" :key="item.value"
                    @click="goLink(item)" style="border-right: 1px solid #504E4E;">
                    <span v-if="teamId">{{item.text}}</span>
                    <span v-else>创建团队</span>
                </li>
            </ul>
        </div>
        <el-popover
            placement="bottom"
            popper-class="menu-dropdown"
            v-model="showPerson"
            trigger="click">
            <div class="dropdown-box">
                <p class="person-name">{{userInfo.user.real_name}}</p>
                <div class="person-item" v-if="vInfo.type == 0">基础版 | <span class="co-ECB86C cursor"
                                                                            @click="getTemporaryVip">升级到高阶版</span></div>
                <div class="person-item" v-else>高阶版 | <span class="co-ECB86C">有效期至{{vInfo.expire_at}}</span><span
                    style="color: #EB7474;padding-left: 5px;cursor: pointer;" @click="showMeijia">续费</span></div>
                <div class="person-item">{{userInfo.user.email}}</div>
                <div class="person-line"></div>
                <div class="person-item cursor" @click="jumpAccountSet">账号设置</div>
                <div class="person-item cursor" @click="showPayRecordPop">支付记录</div>
                <div class="person-line"></div>
                <div class="person-item cursor" @click="showWxPop(0)">案件云小程序</div>
                <div class="person-item cursor" @click="showWxPop(1)">案件云公众号</div>
                <div class="person-item cursor"><a href="http://www.law086.com" target="_blank">前往官网</a></div>
                <div class="person-line"></div>
                <div class="person-item person-loginout cursor" @click="userOut">退出登录</div>
            </div>
            <div slot="reference" class="dropdown-btn">
                <img :src="avatarUrl" alt="头像"/>
                <span>{{userName}}</span>
                <i class="iconfont icon-jiantou-copy-copy" :class="showPerson ? 'rotate-down' : 'rotate-up'"
                   style="display: inline-block;transition: 0.3s ease;"></i>
            </div>
        </el-popover>
        <el-dialog :visible.sync="wxVisible" append-to-body width="540px" class="ewm-dialog">
            <div>
                <div class="wx-txt">
                    <p>扫码关注案件云微信版</p>
                    <img src="/static/images/txt-aside2.png" alt="">
                </div>
                <div class="qr-wrap"><img src="/static/images/login-ewm.jpg" alt=""></div>
                <div class="ewm-bottom">
                    <div class="ewm-item">
                        <img src="/static/images/ewm1.png" alt="">
                        <p>集成PC版<br/>全部操作功能</p>
                    </div>
                    <div class="ewm-item">
                        <img src="/static/images/ewm2.png" alt="">
                        <p>案件信息<br/>了然于心</p>
                    </div>
                    <div class="ewm-item">
                        <img src="/static/images/ewm3.png" alt="">
                        <p>打开微信<br/>即可办公</p>
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="feeShow" append-to-body width="720px" class="fee-dialog"
                   :close-on-click-modal="false">
            <div class="fee-wrap">
                <el-button round class="fee-btn" @click="getTemporaryVip">马上体验高阶版</el-button>
                <i class="iconfont icon-guanbi co-black fee-close-icon" @click="closeFee"></i>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="compareShow" append-to-body width="600px" class="ewm-dialog compare-dialog"
                   :close-on-click-modal="false">
            <div>
                <p class="title">高阶版与基础版的区别</p>
                <div class="content">
                    <div class="content-item">
                        <div class="content-top">高阶版</div>
                        <ul class="content-main">
                            <li><strong>基础版全部功能</strong></li>
                            <li>多人协作方案</li>
                            <li>案件/客户的跨团队共享</li>
                            <li>团队日程管理</li>
                            <li>团队成员管理</li>
                            <li>工时、成本统计</li>
                            <li>单附件大小上限 <strong>100M</strong></li>
                            <li>收益统计（内测中）</li>
                            <li>开庭日微信提醒（内测中）</li>
                            <li>协作消息微信通知（内测中）</li>
                        </ul>
                    </div>
                    <div class="content-item">
                        <div class="content-top top-gray">基础版</div>
                        <ul class="content-main main-gray">
                            <li>PC版+小程序</li>
                            <li>日程管理</li>
                            <li>案件管理</li>
                            <li>项目管理</li>
                            <li>客户管理</li>
                            <li>费用计算工具</li>
                            <li>单附件大小上限 <strong>10M</strong></li>
                            <li>法律法规数据库（内测中）</li>
                        </ul>
                    </div>
                </div>
                <i class="iconfont icon-guanbi co-black fee-close-icon" @click="compareShow = false"></i>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="renefewShow" append-to-body width="600px" class="renefew-dialog"
                   :close-on-click-modal="false">
            <div>
                <div class="content">
                    <p class="expire">您所体验的案件云高阶版将于<strong>{{vInfo.expire_at}}</strong>日到期，<br/> 如需继续使用，请联系专属顾问购买哦~</p>
                    <p class="content-gray">PS：到期未续费的账号将自动变更为基础版。了解高阶版与基础版的区别（链接）</p>
                    <el-button type="warning" round class="renefew-btn" @click="showMeijia">联系专属顾问</el-button>
                    <i class="iconfont icon-quxiao renefew-icon" @click="closeRenefew"></i>
                </div>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="upgradeShow" append-to-body width="600px" class="renefew-dialog"
                   :close-on-click-modal="false">
            <div>
                <div class="content upgradeContent">
                    <img src="/static/images/upgrade.png" class="upgrade-img">
                    <p class="expire" style="padding-top: 30px;">只有高阶版以上的用户才能使用共享功能哦！<br/> 共享对象包括但不限于团队成员，还可以对他们设置差异化权限。
                    </p>
                    <p class="content-gray">了解更多高阶版功能（链接）</p>
                    <el-button type="warning" round class="renefew-btn" @click="getTemporaryVip">立即升级高阶版</el-button>
                    <i class="iconfont icon-quxiao renefew-icon" @click="upgradeShow = false"></i>
                </div>
            </div>
        </el-dialog>

        <!--邮箱激活-->
        <el-dialog
            title="邮箱激活"
            append-to-body
            :visible.sync="showEmail"
            width="600px">
            <div class="email-active">
                <ul class="invite-success">
                    <li class="invite-info">
                        <div>您的邮箱:</div>
                        <span class="co-666">{{userInfo.user.email}}</span>
                        （<span class="text-danger">未激活</span>）
                    </li>
                    <li class="invite-remind">
                        <div>
                            1. 请检查当前账号使用的邮箱，是否存在激活邮件，若存在，进入邮件点击激活链接进行激活；
                        </div>
                        <div>
                            2. 如果您未收到邮件，或激活链接失效，您可以点此
                            <span class="cursor text-info" @click='sendActiveEmail'>重新发送邮件；</span>
                        </div>
                        <div>3. 如果您始终没有收到系统发送的邮件，请注意查看您邮箱中的垃圾邮件；</div>
                        <div>4. 如果你实在无法激活邮件，您还可以联系：tianming2015@foxmail.com</div>
                    </li>
                </ul>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="showWxQr" append-to-body width="410px" class="wx-qr-dialog">
            <div class="wx-wrap">
                <div class="wx-top">
                    <div class="top-item cursor" :class="wxIndex == 0 ? 'top-active' : ''" @click="wxIndexChange(0)">小程序</div>
                    <div class="top-item cursor" :class="wxIndex == 1 ? 'top-active' : ''" @click="wxIndexChange(1)">公众号</div>
                </div>
                <div class="wx-content">
                    <img src="/static/images/public-small.png" class="wx-public" v-if="wxIndex == 0"/>
                    <img src="/static/images/public-qr.png" class="wx-public" v-else/>
                </div>
                <div class="wx-bottom">
                    <p v-if="wxIndex == 0">扫码使用案件云小程序</p>
                    <p v-else>扫码关注案件云公众号</p>
                    <img src="/static/images/txt-aside.png" alt="">
                </div>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="showPayRecord" title="支付记录" append-to-body width="540px"
                   class="common-dialog pay-record-dialog">
            <div class="record-scroll" v-loading="payLoading">
                <div class="record-wrap">
                    <div class="record-title">
                        <div class="record-item1">订单号</div>
                        <div class="record-item2">订单有效期</div>
                        <div class="record-item3">购买内容</div>
                        <div class="record-item4">支付金额</div>
                    </div>
                    <div class="record-content" v-for="(item, index) in payRecordList" :key="index"
                         v-if="payRecordList.length > 0">
                        <div class="record-item1">{{item.onum}}</div>
                        <div class="record-item2">{{item.expire_start}}至{{item.expire_end}}</div>
                        <div class="record-item3">{{item.type_text}}</div>
                        <div class="record-item4">{{item.amount}}元</div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <record-detail :record-detail="recordDetail"></record-detail>

        <newInfoTip :info-tip="infoTip"></newInfoTip>
    </div>
</template>

<script type="text/javascript">
    import {mapGetters, mapActions} from 'vuex'
    import {GET_USER_INFO, GET_NOTIFY_INFO, GET_V_INFO} from 'store/getters/type'
    import {SET_USER_INFO, SET_NOTIFY_INFO, SET_V_INFO,} from 'store/actions/type'
    import {img_url} from 'common/config'
    import store from 'store'
    import {localStorage, sessionStorage} from 'common/storage'
    import {tools_time, tools_notify} from 'common/tools'

    import recordDetail from '../business/record/record-detail/index.vue'


    import newInfoTip from '../../components/dialog/newInfoTip.vue'
    import logoImg from 'assets/images/light-logo.png'
    import defaultAvatar from 'assets/images/user.png'

    export default {
        name: 'topMenu',
        components: {
            recordDetail,
            newInfoTip
        },
        data() {
            return {
                showPerson: false,
                showEmail: false,
                wxVisible: false,
                feeShow: false,
                compareShow: false,
                renefewShow: false,
                upgradeShow: false,
                showWxQr: false,
                showPayRecord: false,
                wxIndex: 0,
                defaultAvatar: defaultAvatar,
                logoImg: logoImg,
                countData: {},
                recordEdit: {},
                recordAdd: {},
                recordDetail: {},
                unreadCount: 0,
                msgLoading: false,
                payLoading: false,
                msgTab: 0,
                msgTabs: [
                    {text: '全部通知', value: 0},
                    {text: '未读', value: 1}
                ],
                countList: [],
                msgList: [],
                isReadList: [],
                unReadList: [],
                userInfo: store.state.user_info,
                url: img_url,
                linkList: [
                    {
                        text: '团队管理',
                        value: 1
                    }
                ],
                payRecordList: [],
                infoTip: {}
            }
        },
        computed: {
            ...mapGetters({
                get_user_info: GET_USER_INFO,
                get_notify_info: GET_NOTIFY_INFO,
                get_v_info: GET_V_INFO,
            }),

            avatarUrl() {
                let result = ''
                if (this.userImgUrl) {
                    result = this.userImgUrl.substr(0, 4) === 'http' ? this.userImgUrl : `${this.url}${this.userImgUrl}`
                } else {
                    result = this.defaultAvatar
                }
                return result

            },
            notifyBadge() {
                const localNotify = this.get_notify_info.msgNoReadCount
                return localNotify || ''
            },
            userName() {
                return (Object.keys(this.userInfo).length === 0) ? '' : this.userInfo.user.real_name
            },
            userImgUrl() {
                return (Object.keys(this.userInfo).length === 0) ? '' : this.userInfo.user.img_path
            },
            userType() {
                return (Object.keys(this.userInfo).length === 0) ? '' : this.userInfo.user.type
            },
            teamId() {
                const user_info = store.state.user_info
                return user_info.user ? user_info.user.team_id : ''
            },
            vInfo() {
                return store.state.v_info
            },
            routeName() {
                return this.$route.name
            },
        },
        sockets: {
            //这里是监听connect事件
            connect: function () {
                this.getNotifyCount({noRead: 1})
                return false
            }
        },
        mounted() {
            //this.getUserInfo()
            if (localStorage.get('feeDate').length > 0) {
                let nowTime = tools_time.getNowTime()
                let dateTime = tools_time.getDateTime(localStorage.get('feeDate'))
                this.feeShow = false
                if (nowTime - dateTime >= 0) {
                    localStorage.remove('feeDate')
                    if (this.vInfo.type == 0) {
                        this.feeShow = true
                    }
                }
            } else {
                if (this.vInfo.type == 0) {
                    this.feeShow = true
                }
            }

            if (this.vInfo.validity_period <= 10 && this.vInfo.type !== 0) {
                if (localStorage.get('renefew').length > 0) {
                    let nowTime = tools_time.getNowTime()
                    let dateTime = tools_time.getDateTime(localStorage.get('renefew'))
                    this.renefewShow = false
                    if (nowTime - dateTime >= 0) {
                        localStorage.remove('renefew')
                        this.renefewShow = true
                    }
                } else {
                    this.renefewShow = true
                }
            }

            // 必须在这里触发connect事件，否则无法连接
            this.$socket.emit('connect')
            this.$options.sockets['user_' + store.state.user_info.user.id] = (data) => {
                console.log('socket-data****', data)
                if (store.state.user_info.user.desknotify == 1) {
                    tools_notify.webNotify(data)
                }
                //右侧消息提示
                let temp_data = JSON.parse(data.data)
                let name = data.add_uid_text
                let action = data.action
                let title = ''

                switch (data.type) {
                    case 1:
                        title = `${temp_data.c_type_text}:${temp_data.case_name}`
                        break
                    case 2:
                        title = temp_data.pr_name
                        break
                    case 3:
                        title = temp_data.name
                        break
                    case 4:
                        title = temp_data.c_type_text
                        break
                }
                //全局消息提示框
                const h = this.$createElement
                // this.$notify({
                //     title: '提示：',
                //     customClass: 'notify-remind ',
                //     message: h('div', { class: 'notify-title' }, [
                //         h('span', { class: 'name' }, name + '律师'),
                //         h('span', { class: 'action' }, action),
                //         h('div', { class: 'notify-content ' }, [h('p', { class: '' }, title)])
                //     ]),
                //     duration: 5000
                // })
                this.infoTip = {
                    visible: true,
                    data: data
                }
                //存入本地，供首页调用
                let msgNoReadCount = store.state.notify_info.msgNoReadCount
                msgNoReadCount += 1
                store.state.notify_info.msgNoReadCount = msgNoReadCount
                this.set_notify_info(store.state.notify_info)
            }
        },

        methods: {
            ...mapActions({
                set_user_info: SET_USER_INFO,
                set_notify_info: SET_NOTIFY_INFO,
                set_v_info: SET_V_INFO,
            }),


            jumpNotify() {
                this.$router.push({name: 'notify_help'})
            },
            //点击log，跳转到官网
            jumpWebsite() {
                window.open('http://www.law086.com/')
            },
            msgShow(val) {
                //点击即重置通知条数为0
                store.state.notify_info.msgNoReadCount = 0
                let data = store.state.notify_info
                this.set_notify_info(data)
                if (val === 0) {
                    this.getMsgList({noRead: 0})
                } else {
                    this.getMsgList({status: 0})
                }

            },
            //获取通知列表
            getMsgList(params) {
                this.msgLoading = true
                this.msgList = []
                this.$fetch.api_home.msgList(params)
                    .then(({
                               data
                           }) => {
                        //解析json
                        data.msg.data = data.msg.data.map(item => {
                            item.data = JSON.parse(item.data)
                            return item
                        })
                        this.unreadCount = data.unread_count
                        //判断是否从已经获取了wx头像
                        this.msgList = data.msg.data.map(item => {
                            if ( item.user_avatar){
                                item.user_avatar = item.user_avatar.substr(0, 4) === 'http' ? item.user_avatar : `${this.url}${item.user_avatar}`
                            }else {
                                item.user_avatar =  this.defaultAvatar
                            }

                            return item
                        })
                        this.msgLoading = false
                    })
                    .catch(({
                                msg
                            }) => {
                        this.msgLoading = false
                    })
            },
            //设置单条已读
            putMsgItem(item) {
                this.$fetch.api_home.msgPut(item.id, {status: 1})
                    .then(({
                               data,
                               msg
                           }) => {
                        if (this.msgTab === 0) {
                            for (let i = 0; i < this.msgList.length; i++) {
                                if (this.msgList[i].id === item.id) {
                                    this.msgList[i].status = 1
                                }
                            }
                        } else {
                            for (let i = 0; i < this.msgList.length; i++) {
                                if (this.msgList[i].id === item.id) {
                                    this.msgList.splice(i, 1)
                                }
                            }
                        }

                        this.unreadCount = this.unreadCount - 1
                    })
            },
            //删除一条通知
            delMsgItem(item) {
                this.$fetch.api_home.msgDel(item.id)
                    .then(({
                               data,
                               msg
                           }) => {
                        for (let i = 0; i < this.msgList.length; i++) {
                            if (this.msgList[i].id === item.id) {
                                this.msgList.splice(i, 1)
                            }
                        }
                        if (item.status === 0) {
                            this.unreadCount = this.unreadCount - 1
                        }
                    })
            },
            //去详情页
            jumpMsgDetail(item) {
                let action = item.action.substr(0, 2)
                if (action === '删除') {
                    this.$message({
                        message: '该条' + item.typet_text + '已被删除',
                        type: 'warning'
                    })
                    return false
                }
                switch (item.type) {
                    case 1:
                        this.$router.push({
                            name: 'caseDetail',
                            params: {
                                code: item.data.case_code
                            }
                        })
                        break
                    case 2:
                        this.$router.push({
                            name: 'projectCode',
                            params: {
                                code: item.data.pr_code
                            }
                        })
                        break
                    case 3:
                        this.$router.push({
                            name: 'customerDetail',
                            params: {
                                code: item.data.code
                            }
                        })
                        break
                    case 4:
                        this.recordDetail = {
                            visible: true,
                            code: item.data.rcode,
                            isReadOnly: true
                        }
                }

            },
            msgChange(val) {
                this.msgTab = val
                if (val === 0) {
                    this.getMsgList({noRead: 0})
                } else {
                    this.getMsgList({status: 0})
                }
            },

            //0-微信小程序 1-我的团队 2-法律法规库
            goLink(item) {
                switch (item.value) {
                    case 0 :
                        this.wxVisible = true
                        break
                    case 1 :
                        if (this.teamId) {
                            this.$router.push({name: 'teamManage'})
                        } else {
                            this.$router.push({name: 'createTeam'})
                        }
                        break
                    default:
                        // this.$router.push({ name: 'notify' })
                        break
                }
            },
            //获取未读通知的条数,赋值给本地计数器
            getNotifyCount(params) {
                this.$fetch.api_home.msgList(params)
                    .then(({
                               data
                           }) => {
                        store.state.notify_info.msgNoReadCount = parseInt(data.msgNoReadCount)
                        this.set_notify_info(store.state.notify_info)
                    })
            },
            //设置所有消息为已读
            setAllMsgRead() {
                this.$fetch.api_home.msgRead()
                    .then(({
                               data,
                               msg
                           }) => {
                        this.unreadCount = 0
                        this.msgList = this.msgTab === 0 ? this.msgList.map(item => {
                            item.status = 1
                            return item
                        }) : []
                    })
            },

            userOut() {
                const self = this
                this.$confirm('此操作将退出登录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'is-plain'
                }).then(() => {
                    this.$message.success('已安全退出')
                    this.set_user_info(null)
                    this.set_v_info(null)
                    setTimeout(self.$router.push({
                        name: 'login'
                    }), 500)
                }).catch(() => {
                    console.log('失败')
                })
            },

            closeFee() {
                this.feeShow = false
                localStorage.set('feeDate', tools_time.getTomorrow())
            },
            closeRenefew() {
                this.renefewShow = false
                localStorage.set('renefew', tools_time.getTomorrow())
            },
            showMeijia() {
                _MEIQIA('showPanel');
                _MEIQIA('metadata', {
                    name: this.userInfo.user.real_name,
                    tel: this.userInfo.user.mobile,
                    email: this.userInfo.user.email,
                    reason: '购买续费'
                });
            },
            getTemporaryVip() {
                this.$fetch.api_order.save().then(({data, code}) => {
                    if (code === 0) {
                        this.set_v_info(data.v_info)
                        this.closeFee()
                    }
                }).catch(() => {
                })
            },
            openEmailActive() {
                this.showEmail = true
            },
            //发送激活邮件
            sendActiveEmail() {
                let uid = this.userInfo.user.id
                this.$fetch.api_user.sendActiveEmail(
                    {id: uid}
                )
                    .then(({
                               code,
                               msg
                           }) => {
                    })
            },



            wxIndexChange(val) {
                this.wxIndex = val
            },
            showWxPop(val) {
                this.showWxQr = true
                this.wxIndex = val
            },
            showPayRecordPop() {
                this.showPayRecord = true
                this.getPayRecord()
            },
            //获取用户数据，
            getUserInfo() {
                this.loading = true
                this.$fetch.api_user.getUser()
                    .then(
                        ({
                             data
                         }) => {
                            this.form = data
                            if (data.firm_id) {
                                this.form.lawfirm = data.firm_info.name
                            }
                            if (!data.birthday) {
                                this.form.birthday = ''
                            }
                            this.loading = false
                        }
                    ).catch(() => {
                    this.loading = false

                })
            },
            getPayRecord() {
                this.payLoading = true
                this.$fetch.api_record.recordPay().then(({data}) => {
                    this.payRecordList = data.data
                    this.payLoading = false
                }).catch(() => {
                    this.payLoading = false
                })
            },
            jumpAccountSet() {
                this.$router.push({name: 'userInfo'})
            }
        }
    }
</script>
