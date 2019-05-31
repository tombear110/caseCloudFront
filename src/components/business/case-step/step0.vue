<template>
    <div class="info-box">
        <div class="tab-component tab-component__mini ">
            <ul class="tab-list ">
                <li class="tab-item tab-active">基本信息</li>
            </ul>
            <div class="co-9FA5B9 cursor" @click="openInfoDialog(stepData)">
                <i class="iconfont  icon-bianji5 ft-14"></i>
                <span>编辑</span>
            </div>
        </div>
        <ul class="list-group">
            <li class="item">
                <div class="item-label">委托日期：</div>
                <div class="item-text">{{stepData.pr_time}}</div>
            </li>
            <li class="item">
                <span class="item-label">案件类型：</span>
                <span class="item-text">{{stepData.c_type_text}}</span>
            </li>
            <li class="item" >
                <span class="item-label">案由：</span>
                <span class="item-text">{{stepData.anyou}}</span>
            </li>
            <li class="item">
                <span class="item-label">立案时间：</span>
                <span class="item-text">{{stepData.la_time}}</span>
            </li>
            <li class="item">
                <span class="item-label">案件程序：</span>
                <span class="item-text">{{stepData.process_text}}</span>
            </li>
            <li class="item">
                <span class="item-label">案号：</span>
                <span class="item-text">{{stepData.anhao}}</span>
            </li>
            <li class="item">
                <span class="item-label">裁决日期：</span>
                <span class="item-text">{{stepData.cj_time}}</span>
            </li>
            <li class="item">
                <span class="item-label">审理结果：</span>
                <span class="item-text">{{stepData.trail_text}}</span>
            </li>
            <li class="item">
                <span class="item-label">所属项目：</span>
                <span class="item-text text-info cursor" @click="jumpLinkProject(linkPrObj)">{{linkPrObj.pr_name}}</span>
            </li>

            <div class="item-line"></div>
            <li class="item">
                <span class="item-label">案件标的：</span>
                <span class="item-text">{{stepData.c_amount}}元</span>
            </li>
            <li class="item">
                <span class="item-label">胜诉金额：</span>
                <span class="item-text">{{stepData.suc_amount}}元</span>
            </li>
            <li class="item">
                <span class="item-label">实际回款：</span>
                <span class="item-text">{{stepData.actual_receipt}}元</span>
            </li>

            <div class="item-line"></div>
            <li class="item">
                <span class="item-label">结案日期：</span>
                <span class="item-text">{{stepData.j_time}}</span>
            </li>
            <li class="item">
                <span class="item-label">结案状态：</span>
                <span class="item-text">{{stepData.ja_status_text}}</span>
            </li>

            <div class="item-line"></div>
            <li class="item">
                <span class="item-label">归档日期：</span>
                <span class="item-text">{{stepData.g_time}}</span>
            </li>
            <li class="item">
                <span class="item-label">归档人：</span>
                <span class="item-text">{{stepData.g_user_text}}</span>
            </li>
            <li class="item">
                <span class="item-label">档案保管地：</span>
                <span class="item-text">{{stepData.g_address}}</span>
            </li>
            
            <div class="item-line"></div>
            <li class="item" style="width: 100%">
                <span class="item-label">其他备注：</span>
                <span class="item-text">{{stepData.case_mark}}</span>
            </li>
        </ul>
        <div class="tab-component tab-component__mini ">
            <ul class="tab-list ">
                <li class="tab-item tab-active">关联案件</li>
            </ul>
            <div class="co-9FA5B9 cursor" style="display: flex;align-items: center;" @click="openCaseDialog(stepData)">
                <i class="iconfont icon-add1" style="padding-right: 10px;"></i>
                <div>新增关联</div>
            </div>
        </div>
        <div class="case-associate" style="margin-bottom: 24px;">
            <div class="case-title" style="border-bottom: 1px solid #e1e4ee">
                <div class="title-item" v-for="(item, index) in caseTitles" :key="index">{{item}}</div>
            </div>
            <div class="case-content" v-for="(item,index) in stepData.link_case_arr" :key="item.id">
                <div class="content-item" @click="jumpLinkCase(item)">{{item.linkid_text}}</div>
                <div class="content-item">{{item.process_text}}</div>
                <div class="content-item">{{item.trail_text}}</div>
                <div class="content-item">
                    <span class="item-main-name">{{item.host_text.real_name}}</span>
                    <span class="close-associate" @click="releaseLinkCase(index, stepData.link_case_arr)">解除关联</span>
                </div>
            </div>
        </div>
        <div class="tab-component tab-component__mini ">
            <ul class="tab-list ">
                <li class="tab-item tab-active">办案人员</li>
            </ul>
            <!--<div style="width: 100px;margin-right: 20px">-->
                <!--<el-select v-model="stageType" size="mini" class="select-ghost-1" placeholder="请选择"-->
                           <!--@change="stageChange">-->
                    <!--<el-option-->
                        <!--v-for="(item,index) in stageOptions"-->
                        <!--:key="index"-->
                        <!--:label="item.name"-->
                        <!--:value="item.id">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            <!--</div>-->
            <div class="co-9FA5B9 mg-right-15 cursor" @click="openAssitDialog(stepData)">
                <i class="iconfont  icon-add1 ft-14 mg-right-5"></i>
                <span>管理协办</span>
            </div>
            <div class="co-9FA5B9 cursor" @click="openShareDialog(stepData)">
                <i class="iconfont  icon-add1 ft-14"></i>
                <span>管理共享</span>
            </div>
        </div>
        <el-table :data="lawyerData" style="width: 100%;margin-bottom: 50px;position: relative;display: none;" size="mini"
                  cell-class-name="border-dashed"
                  class="detail-my-table"
                  element-loading-text="正在上传中...">
            <el-table-column prop="real_name" label="姓名" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="角色">
                <template slot-scope="scope">
                    <span v-if="scope.row.type==='host'">主办</span>
                    <span v-else-if="scope.row.type==='assit'">协办</span>
                    <span v-else>共享</span>
                </template>
            </el-table-column>
            <el-table-column prop="mobile" label="联系方式"></el-table-column>
            <el-table-column label="权限" >
                <template slot-scope="scope">
                    <span class="co-9FA5B9" v-if="scope.row.type==='share_0'">
                        不可编辑<i class="iconfont icon-jiantou-copy-copy rotate-down" style="display: inline-block;transition: 0.3s ease;margin-left: 10px;"></i>
                    </span>
                    <span class="co-9FA5B9" v-else-if="scope.row.type==='share_1'">
                        可编辑<i class="iconfont icon-jiantou-copy-copy rotate-down" style="display: inline-block;transition: 0.3s ease;margin-left: 10px;"></i>
                    </span>
                    <span v-else>全部</span>
                    <!-- <el-select v-model="value" placeholder="请选择" v-if="scope.row.type==='share_0' || scope.row.type==='share_1'">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select> -->
                    <!-- <span v-else>全部</span> -->
                    <el-popover
                        v-model="showPermission"
                        placement="top-start"
                        width="100"
                        trigger="click">
                    </el-popover>
                </template>

            </el-table-column>

            <el-table-column prop="mobile" label="办案记录"></el-table-column>
            <el-table-column prop="mobile" label="工时"></el-table-column>
            <el-table-column prop="mobile" label="费用"></el-table-column>
            
        </el-table>
        <div class="case-people">
            <div class="people-title">
                <div class="title-item" v-for="(item, index) in peopleTitles" :key="index">{{item}}</div>
            </div>
            <div class="people-content" v-for="(item, index) in lawyerData" :key="index">
                <div class="content-item">{{item.real_name}}</div>
                <div class="content-item">{{item.type | typeChinese}}</div>
                <div class="content-item">{{item.mobile}}</div>
                <div class="content-item">
                    <el-select v-model="valueItems[index]" placeholder="请选择" v-if="item.type==='share_0' || item.type==='share_1'" @change="typeChange($event, index, item)">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                          >
                        </el-option>
                    </el-select>
                    <span v-else>全部</span>
                </div>
                <div class="content-item">记录</div>
                <div class="content-item">工作时间</div>
                <div class="content-item">花费</div>
            </div>
            <div class="people-blank"></div>
        </div>
        <case-info :caseInfo="caseInfo"></case-info>
        <link-case :linkCase="linkCase"></link-case>
        <link-project :linkProject="linkProject"></link-project>
        <host-assit :hostAssit="hostAssit"></host-assit>
        <case-share :caseShareData="caseShareData"></case-share>
    </div>
</template>
<script>
    import caseInfo from '../case-simple/case-info/index'
    import linkCase from '../case-simple/link-case/index'
    import linkProject from '../case-simple/link-project/index'
    import hostAssit from '../case-simple/host-assit/index'
    import caseShare from '../case/case-share/index'
    import { mapActions } from 'vuex'
    import { SET_CASE_DATA, } from 'store/actions/type'
    export default {
        components: {
            caseInfo,
            linkCase,
            linkProject,
            hostAssit,
            caseShare,
        },

        data () {
            return {
                nowIndex: -1,
                peopleTitles: ['姓名', '角色', '联系方式', '权限', '办案记录', '工时', '费用'],
                caseTitles: ['案件名称', '案件程序', '审理结果', '主办/操作'],
                options: [{
                  value: '可编辑',
                  label: '可编辑'
                }, {
                  value: '不可编辑',
                  label: '不可编辑'
                }],
                valueItems: [],
                showPermission: false,
                caseInfo:{},
                caseShareData: {},
                linkCase:{},
                hostAssit:{},
                linkProject:{},
                btnActive: 0,
                caseEdit: {},
                linkCaseOptions:[],
                stageType:0,
                stageOptions: [
                    { id: 0, name: '管理协办' },
                    { id: 1, name: '管理共享' },
                ],
            }
        },
        props: ['stepData'],
        computed: {
            linkPrObj () {
                return this.stepData.link_pr ? this.stepData.link_pr_arr : {}
            },
            linkProjectOptions () {
                return this.stepData.link_pr_arr ? this.stepData.link_pr_arr : []
            },
            lawyerData(){
                return this.stepData.lawyers_arr ? this.stepData.lawyers_arr : []
            },
            lawyerItems() {
                let items = []
                for (let i=0;i < this.lawyerData.length;i++) {
                    if (this.lawyerData[i].type === 'share_0') {
                        items.push('不可编辑')
                    } else if (this.lawyerData[i].type === 'share_1') {
                        items.push('可编辑')
                    } else {
                        items.push('全部')
                    }
                }
                this.valueItems = items
                return items
            }
        },
        watch: {
            lawyerItems(val) {
                this.valueItems = val
            }
        },
        mounted(){
        },
        methods: {
            ...mapActions({
                set_case_data: SET_CASE_DATA,
            }),

            stageChange (val) {
                if(val===0){
                    this.openAssitDialog(this.stepData)
                }else {
                    this.openShareDialog(this.stepData)
                }
            },

            /**
             * 跳转到关联案件详情
             * @params: mod
             * @return: 返回值/返回值说明
             */
            jumpLinkCase (item) {
                this.$router.push({ name: 'caseDetail', params: { code: item.code } })
            },

            jumpLinkProject (item) {
                this.$router.push({ name: 'projectCode', params: { code: item.pr_code } })
            },

            /**
             * 解除案件关联
             * 将当前案件从案件组中删掉，使用案件修改的接口
             * @params: mod
             * @return: 返回值/返回值说明
             */
            releaseLinkCase (index, options){
                //从关联数组中删掉当前id
                options.splice(index,1)
                let linkCases =  options.map(item =>{return item.id})
                this.$fetch.api_case.save({link_cases:linkCases},this.stepData.id)
                    .then(({
                               data,
                               msg
                           }) => {
                        let temp = !this.$store.state.case_data.isChange
                        this.set_case_data({isChange: temp})

                    })
                    .catch(({
                                code
                            }) => {
                    })

            },


            /**
             * 打开案件信息编辑弹窗
             * @params: mod
             * @return: 返回值/返回值说明
             */
            openInfoDialog (stepData) {
                this.caseInfo = {
                    visible: true,
                    code:stepData.case_code
                }
            },

            /**
             * 打开新增关联案件弹窗
             * @params: mod
             * @return: 返回值/返回值说明
             */
            openCaseDialog(stepData){
                this.linkCase = {
                    visible: true,
                    code:stepData.case_code
                }
            },

            /**
             * 打开新增关联项目弹窗
             * @params: mod
             * @return: 返回值/返回值说明
             */
            openProjectDialog(stepData){
                this.linkProject = {
                    visible: true,
                    code:stepData.case_code
                }
            },

            /**
             * 打开办案人员弹窗
             * @params: mod
             * @return: 返回值/返回值说明
             */
            openAssitDialog(stepData){
                this.hostAssit = {
                    visible: true,
                    code:stepData.case_code
                }
            },

            /**
             * 打开案件共享弹窗
             * @params: mod
             * @return: 返回值/返回值说明
             */
            openShareDialog(stepData){
                this.caseShareData = {
                    visible: true,
                    id: stepData.id,
                    type: 1,
                    host: stepData.host,
                    assit: stepData.assit
                }
            },
            permissionIndex(val) {
                this.nowIndex = val
            },
            typeChange(val, index, item) {
                let items = [],share_auth
                for (let i=0;i < this.valueItems.length;i ++) {
                    items.push(this.valueItems[i])
                }
                if (val === '可编辑') {
                    share_auth = 1
                } else {
                    share_auth = 0
                }
                items[index] = val
                this.valueItems = items
                this.$fetch.api_case.sharePut(item.share_id, { auth: share_auth }).then(({ msg }) => {
                    this.$message.success(msg)
                }).catch(({msg}) => {
                    this.$message.warning(msg)
                })
            }

        }

    }
</script>
