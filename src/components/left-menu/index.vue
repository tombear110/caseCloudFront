<template>
    <div :class="[{'active-collapse':isCollapse},'left-menu']">
        <div class="menu-top">
            <div v-if="isTopCollapse" class="close-menu-top">
                <img :src="avatarUrl" alt="头像"/>
            </div>
            <div v-else>
                <img :src="avatarUrl"  class="user-img" alt="头像"/>
                <div class="info-wrap">
                    <span>{{userInfo.user.real_name}}</span>
                    <img :src="levelImg">
                </div>
                <div class="item-wrap">
                    <el-tooltip :content="caseTipTxt" placement="top">
                        <div class="item cursor" @click="toCase">
                            <i class="iconfont  icon-anjianjiean"></i>
                            <span>{{countList.case_count ? countList.case_count : 0}}件</span>
                        </div>
                    </el-tooltip>
                    <el-tooltip :content="projectTipTxt" placement="top">
                        <div class="item cursor" @click="toProject">
                            <i class="iconfont  icon-xiangxiangmu"></i>
                            <span>{{countList.project_count ? countList.project_count : 0}}件</span>
                        </div>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <!--行政账号登录-->
        <!--        <el-menu :default-active="defaultIndex" class="el-menu-tm" unique-opened @open="handleOpen" @close="handleClose"-->
        <!--                 @select="handleSelect" :collapse="isCollapse" ref="menutm" v-if="accountType===2">-->
        <!--            <el-menu-item index="1" style="margin-top: 130px;">-->
        <!--                <i class="iconfont icon-richeng2 mg-right-15 "></i>-->
        <!--                <span slot="title" class="ft-15">日程管理</span>-->
        <!--            </el-menu-item>-->
        <!--            <el-menu-item index="2">-->
        <!--                <i class="iconfont icon-gerenxinxi1 mg-right-15  "></i>-->
        <!--                <span slot="title">个人中心</span>-->
        <!--            </el-menu-item>-->
        <!--            &lt;!&ndash; <div class="divider"></div> &ndash;&gt;-->
        <!--            <el-submenu index="3">-->
        <!--                <template slot="title">-->
        <!--                    <i class="iconfont icon-sifaju mg-right-15  "></i>-->
        <!--                    <span slot="title">律所管理</span>-->
        <!--                </template>-->
        <!--                <el-menu-item-group>-->
        <!--                    <el-menu-item index="3-1">-->
        <!--                        <span style="margin-left: 18px">律所信息</span>-->
        <!--                    </el-menu-item>-->
        <!--                    <el-menu-item index="3-2">-->
        <!--                        <span style="margin-left: 18px">分所列表</span>-->
        <!--                    </el-menu-item>-->
        <!--                </el-menu-item-group>-->
        <!--            </el-submenu>-->
        <!--            <el-submenu index="4">-->
        <!--                <template slot="title">-->
        <!--                    <i class="iconfont icon-sifaju mg-right-15  "></i>-->
        <!--                    <span slot="title">行政审批</span>-->
        <!--                </template>-->
        <!--                <el-menu-item-group>-->
        <!--                    <el-menu-item index="4-1">-->
        <!--                        <span style="margin-left: 18px">待审案件</span>-->
        <!--                    </el-menu-item>-->
        <!--                    <el-menu-item index="4-2">-->
        <!--                        <span style="margin-left: 18px">待审文书</span>-->
        <!--                    </el-menu-item>-->
        <!--                </el-menu-item-group>-->
        <!--            </el-submenu>-->
        <!--            <el-menu-item index="5">-->
        <!--                <i class="iconfont icon-gerenxinxi1 mg-right-15  "></i>-->
        <!--                <span slot="title">律所案件</span>-->
        <!--            </el-menu-item>-->
        <!--        </el-menu>-->
        <!--律师账号登录-->
        <el-menu :default-active="defaultIndex" class="el-menu-tm" unique-opened @open="handleOpen" @close="handleClose"
                 @select="handleSelect" :collapse="isCollapse" ref="menutm">
            <el-submenu index="1">
                <template slot="title">
                    <i class="iconfont icon-richeng2 mg-right-15  "></i>
                    <span slot="title" class="ft-15">日程管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="1-1">
                        <span style="margin-left: 18px">我的日程</span>
                    </el-menu-item>
                    <el-menu-item index="1-2" >
                        <span style="margin-left: 18px">团队日程</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>

            <el-submenu index="4">
                <template slot="title">
                    <i class="iconfont icon-anjian mg-right-15  "></i>
                    <span slot="title" class="ft-15">案件管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="4-1">
                        <span style="margin-left: 18px">我的案件</span>
                    </el-menu-item>
                    <el-menu-item index="4-2">
                        <span style="margin-left: 18px">共享案件</span>
                    </el-menu-item>
                    <el-menu-item index="4-3" >
                        <span style="margin-left: 18px">团队案件</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="5">
                <template slot="title">
                    <i class="iconfont icon-xiangmu3 mg-right-15  "></i>
                    <span slot="title" class="ft-15">项目管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="5-1">
                        <span style="margin-left: 18px">诉讼项目</span>
                    </el-menu-item>
                    <el-menu-item index="5-2">
                        <span style="margin-left: 18px">非诉项目</span>
                    </el-menu-item>
                    <el-menu-item index="5-3" >
                        <span style="margin-left: 18px">团队项目</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="6">
                <template slot="title">
                    <i class="iconfont icon-kehu2 mg-right-15  "></i>
                    <span slot="title" class="ft-15">客户管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="6-1">
                        <span style="margin-left: 18px">我的客户</span>
                    </el-menu-item>
                    <el-menu-item index="6-2">
                        <span style="margin-left: 18px">共享客户</span>
                    </el-menu-item>
                    <el-menu-item index="6-3" >
                        <span style="margin-left: 18px">团队客户</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <!--<el-submenu index="3">-->
            <!--<template slot="title">-->
            <!--<i class="iconfont icon-xiaoximoban_lvsuojieshao mg-right-15 ft-15 "></i>-->
            <!--<span slot="title" class="ft-15">律师事务</span>-->
            <!--</template>-->
            <!--<el-menu-item-group>-->
            <!--<el-menu-item index="3-1">-->
            <!--<span style="margin-left: 18px">案件报审</span>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="3-2">-->
            <!--<span style="margin-left: 18px">文书报审</span>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="3-3">-->
            <!--<span style="margin-left: 18px">我的任务</span>-->
            <!--</el-menu-item>-->
            <!--</el-menu-item-group>-->
            <!--</el-submenu>-->
            <!-- <div class="divider"></div> -->
            <!--<el-submenu index="7">-->
            <!--<template slot="title">-->
            <!--<i class="iconfont icon-icon-import mg-right-15 ft-15 "></i>-->
            <!--<span slot="title" class="ft-15">批量案件</span>-->
            <!--</template>-->
            <!--<el-menu-item-group>-->
            <!--<el-menu-item index="7-1">-->
            <!--<span style="margin-left: 18px">我的案件</span>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="7-2">-->
            <!--<span style="margin-left: 18px">批次列表</span>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="7-3">-->
            <!--<span style="margin-left: 18px">设置字段</span>-->
            <!--</el-menu-item>-->
            <!--</el-menu-item-group>-->
            <!--</el-submenu>-->
            <el-submenu index="2">
                <template slot="title">
                    <i class="iconfont icon-shujutongji3 mg-right-15  "></i>
                    <span slot="title" class="ft-15">数据统计</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="2-1">
                        <span style="margin-left: 18px">我的战绩</span>
                    </el-menu-item>
                    <el-menu-item index="2-2">
                        <span style="margin-left: 18px">工时统计</span>
                    </el-menu-item>
                    <el-menu-item index="2-3">
                        <span style="margin-left: 18px">成本统计</span>
                    </el-menu-item>
<!--                    <el-menu-item index="2-4">-->
<!--                        <span style="margin-left: 18px">收益统计</span>-->
<!--                    </el-menu-item>-->
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="8"
                          style="background-color: #FFFFFF;height: 56px;line-height: 56px;margin-bottom: 50px;">
                <i class="iconfont icon-gongju2 mg-right-15  ft-20"></i>
                <span slot="title" class="ft-15">工具</span>
            </el-menu-item>
            <el-menu-item index="999" style="display: none">
                <i class="iconfont icon-gongju2 mg-right-15  ft-20"></i>
                <span slot="title" class="ft-15">取消acitve</span>
            </el-menu-item>
        </el-menu>
        <el-tooltip effect="dark" :content="isCollapse?'点击可展开':'点击可收缩'" placement="right">
            <div class="collapse-button" @click="closeAside">
                <i v-show="!isCollapse" class="iconfont icon-shuangjiantou"></i>
                <i class="iconfont icon-jiantouyou" v-show="isCollapse"></i>
                <span v-show="!isCollapse">收缩侧边栏</span>
            </div>
        </el-tooltip>
    </div>
</template>

<script>
    import store from 'store'
    import {mapActions} from 'vuex'
    import {SET_CASE_INFO, SET_V_INFO, SET_CURRENT_NAV} from 'store/actions/type'
    import {img_url} from 'common/config'
    import defaultAvatar from 'assets/images/user.png'
    import highLevel from 'assets/images/high-level.png'
    import baseLevel from 'assets/images/base-level.png'

    export default {
        components: {},
        components: {},
        data() {
            return {
                vipData: {},
                url: img_url,
                defaultAvatar: defaultAvatar,
                levelImg: baseLevel,
                isCollapse: false,
                isTopCollapse: false,
                mkey: '',
                openKey: '',
                routeList: [
                    {
                        value: '1',
                        routeName: 'calendar'
                    },
                    {
                        value: '1-1',
                        routeName: 'calendarMyMonth'
                    },
                    {
                        value: '1-2',
                        routeName: 'calendarTeamWeek'
                    },
                    {
                        value: '2',
                        routeName: 'analysis'
                    },
                    {
                        value: '2-1',
                        routeName: 'analysisData'
                    },
                    {
                        value: '2-2',
                        routeName: 'analysisTime'
                    },
                    {
                        value: '2-3',
                        routeName: 'analysisFee'
                    },
                    {
                        value: '2-4',
                        routeName: 'analysisIncome'
                    },
                    {
                        value: '3-1',
                        routeName: 'case_report'
                    },
                    {
                        value: '3-2',
                        routeName: 'doc_report'
                    },
                    {
                        value: '3-3',
                        routeName: 'task_report'
                    },
                    {
                        value: '4-1',
                        routeName: 'caseMy'
                    },
                    {
                        value: '4-2',
                        routeName: 'caseShare'
                    },
                    {
                        value: '4-3',
                        routeName: 'caseTeam'
                    },
                    {
                        value: '5-1',
                        routeName: 'projectLawsuit'
                    },
                    {
                        value: '5-2',
                        routeName: 'projectNonLawsuit'
                    },
                    {
                        value: '5-3',
                        routeName: 'projectTeam'
                    },
                    {
                        value: '6-1',
                        routeName: 'clientMy'
                    },
                    {
                        value: '6-2',
                        routeName: 'clientShare'
                    },
                    {
                        value: '6-3',
                        routeName: 'clientTeam'
                    },
                    {
                        value: '7-1',
                        routeName: 'batchMy'
                    },
                    {
                        value: '7-2',
                        routeName: 'batchList'
                    },
                    {
                        value: '7-3',
                        routeName: 'batchSet'
                    },
                    {
                        value: '8',
                        routeName: 'tool_search'
                    }
                ],
                staffList: [
                    {
                        value: '1',
                        routeName: 'calendar'
                    },
                    {
                        value: '2',
                        routeName: 'user_info'
                    },
                    {
                        value: '3-1',
                        routeName: 'firm_info'
                    },
                    {
                        value: '3-2',
                        routeName: 'filiale_list'
                    },
                    {
                        value: '4-1',
                        routeName: 'staff_case'
                    },
                    {
                        value: '4-2',
                        routeName: 'staff_doc'
                    },
                    {
                        value: '5',
                        routeName: 'tool_search'
                    }
                ],
                userInfo: store.state.user_info,
                vInfo: store.state.v_info,
                countList: {}
            }
        },
        computed: {

            accountType() {
                const userInfo = store.state.user_info
                return userInfo.user ? parseInt(userInfo.user.account_type) : ''
            },
            avatarUrl() {
                let result = ''
                if (this.userImgUrl) {
                    result = this.userImgUrl.substr(0, 4) === 'http' ? this.userImgUrl : `${this.url}${this.userImgUrl}`
                } else {
                    result = this.defaultAvatar
                }
                return result
            },


            defaultIndex() {
                const fromRouteName = store.state.current_nav.fromRouteName
                const routeName = this.$route.name
                const routeList = this.routeList
                let resultObj = {}
                //根据当前路由筛选出对应页面的{value：‘4-1’}
                //若不存在，resultObj默认为{}
                resultObj = JSON.parse(JSON.stringify(routeList)).filter(item => item.routeName === routeName)[0] || {}
                let result = ''
                if (Object.keys(resultObj).length) {
                    //如果result存在，高亮index
                    result = resultObj.value
                } else {
                    //不存在，高亮上一个页面的index，用在 案件/客户/项目详情页高亮左侧当行来
                    //若不存在，resultObj默认为{}
                    resultObj = JSON.parse(JSON.stringify(routeList)).filter(item => item.routeName === fromRouteName)[0] || {}
                    result = resultObj.value
                }
                //如果在团队管理页面，清除高亮
                return routeName === 'teamManage' ? '999' : result
            },
            infoType() {
                return store.state.v_info.type
            },
            userImgUrl() {
                return (Object.keys(this.userInfo).length === 0) ? '' : this.userInfo.user.img_path
            },
            caseTipTxt() {
                return (this.countList.case_count) ? `在办案件${this.countList.case_count}件` : '在办案件0件'
            },
            projectTipTxt() {
                return (this.countList.project_count) ? `在办项目${this.countList.project_count}件` : '在办项目0件'
            }
        },
        watch: {
            $route(to, from) {
                //路由切换时，记录下上一个页面的路由,用在 案件/客户/项目详情页高亮左侧当行来
                this.set_current_nav({fromRouteName: from.name})
            },
            infoType(val) {
                if (val == 0) {
                    this.levelImg = baseLevel
                } else {
                    this.levelImg = highLevel
                }
            }
        },
        created() {
            if (this.vInfo.type == 0) {
                this.levelImg = baseLevel
            } else {
                this.levelImg = highLevel
            }
            this.isClosed()
            this.getPersonalAnalysis()
        },
        methods: {
            ...mapActions({
                set_case_info: SET_CASE_INFO,
                set_v_info: SET_V_INFO,
                set_current_nav: SET_CURRENT_NAV,
            }),

            getTemporaryVip() {
                this.$fetch.api_order.save()
                    .then(({
                               data, code
                           }) => {
                        if (code === 0) {
                            this.set_v_info(data.v_info)
                            this.vipData = {visible: false}
                        }
                    })
            },
            //根据屏幕和路由判断左侧栏是否折叠
            isClosed() {
                const screenWidth = document.body.clientWidth
                let rootPath = this.$route.path.split('/')[1]
                this.isCollapse = ('team' !== rootPath && 'user_center' !== rootPath && screenWidth < 1500)
                this.isTopCollapse = ('team' !== rootPath && 'user_center' !== rootPath && screenWidth < 1500)
                this.set_case_info({
                    isCollapse: this.isCollapse
                })
            },

            //手动折叠
            closeAside() {
                this.isCollapse = !this.isCollapse
                setTimeout(() => {
                    this.isTopCollapse = !this.isTopCollapse
                }, 200)
                this.set_case_info({
                    isCollapse: this.isCollapse
                })
            },

            handleOpen(key, keyPath) {
                this.openKey = keyPath
                let index = keyPath + '-1'
                const routeList = this.routeList
                for (let i = 0; i < routeList.length; i++) {
                    if (index === routeList[i].value) {
                        this.$router.push({
                            name: routeList[i].routeName
                        })
                    }
                }
            },
            handleClose(key, keyPath) {
                this.openKey = ''
            },
            handleSelect(key, keyPath) {
                const userInfo = store.state.user_info
                const notifyArr = ['4-3', '5-3', '6-3']
                //未加入或者创建团队提示
                if (notifyArr.indexOf(key) !== -1 && !userInfo.user.team_id) {
                    this.$message({
                        message: '请先创建团队或者加入团队',
                        type: 'warning'
                    })
                    return false
                }

                //当用户已加入团队，并且权限为type=1（普通权限）
                const userType = store.state.user_info.user.type
                if (userType===1 && notifyArr.indexOf(key) !== -1){
                    this.$confirm('该功能需要团队管理员开通高级权限后，方可进入。', '权限不够', {
                        confirmButtonText: '确定',
                        showCancelButton:false,
                        type: 'warning'
                    }).then(() => {
                        // this.$message({
                        //     type: 'success',
                        //     message: '确定!'
                        // });
                    }).catch(() => {
                        // this.$message({
                        //     type: 'info',
                        //     message: '取消'
                        // });
                    });
                    return false
                }

                //打开对应侧边栏
                const routeList = this.routeList
                if (this.openKey && this.openKey[0] !== key[0]) {
                    this.$refs.menutm.close(this.openKey[0])
                }
                //跳转到对应页面
                routeList.forEach(item => {
                    if (key === item.value) {
                        this.$router.push({
                            name: item.routeName
                        })
                    }
                })
            },
            getPersonalAnalysis() {
                this.$fetch.api_home.analysisPersonal()
                    .then(({data}) => {
                        this.countList = data
                    })
            },
            toCase() {
                this.$router.push({
                    name: 'caseMy'
                })
            },
            toProject() {
                this.$router.push({
                    name: 'projectLawsuit'
                })
            }
        }
    }
</script>
