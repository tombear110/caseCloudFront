<template>
    <div class="case-info apprval-case" style="background-color: #fff;padding: 20px">
        <div class="content-main "   v-loading="loading"   element-loading-text="拼命加载中">
            <div class="table-item max-width-1220 pd-bottom-20">
                <h3>案件详情</h3>
                <table class="table-info">
                    <tbody>
                    <tr>
                        <th>案件名称</th>
                        <td>{{tableData.case_name}}</td>
                        <th>案件类别</th>
                        <td>{{tableData.type_text}}</td>
                        <th>案由</th>
                        <td>{{tableData.anyou}}</td>
                    </tr>
                    <tr>
                        <th>聘用合同</th>
                        <td>
                            <span class="text-link cursor "
                                  @click="go_link_case(tableData)">{{tableData.contract}}</span>
                        </td>
                        <th>主办律师</th>
                        <td>{{tableData.host}}</td>
                        <th>协办律师</th>
                        <td>{{tableData.assit}}</td>
                    </tr>
                    <tr>
                        <th>委案时间</th>
                        <td>{{tableData.wa_time}}</td>
                        <th>结案时间</th>
                        <td>{{tableData.ja_time}}</td>
                        <th>收费方式</th>
                        <td v-if="tableData.charge_type === 1">正常收费</td>
                        <td v-else-if="tableData.charge_type === 2">风险收费</td>
                        <td v-else>小时收费</td>
                    </tr>
                    <tr>
                        <th>收费金额</th>
                        <td>{{tableData.fixed_amount}}</td>
                        <th>案情简介</th>
                        <td>{{tableData.case_summary}}</td>
                        <th></th>
                        <td></td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="table-item max-width-920 pd-bottom-20">
                <h3>案件当事人</h3>
                <el-table
                    :data="tableData.firmprivyc_list"
                    
                    style="width: 100%">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="right"  class="table-expand">
                                <el-form-item label="民族" v-if="props.row.dsr_type === 1">
                                    <span>{{ props.row.nation }}</span>
                                </el-form-item>
                                <el-form-item label="性别" v-if="props.row.dsr_type === 1">
                                    <span v-if=" props.row.sex ===0 ">男</span>
                                    <span v-else>女</span>
                                </el-form-item>
                                <el-form-item label="地址" v-if="props.row.dsr_type === 1">
                                    <span>{{ props.row.address }}</span>
                                </el-form-item>
                                <el-form-item label="证件号" v-if="props.row.dsr_type === 1">
                                    <span>{{ props.row.card_num }}</span>
                                </el-form-item>
                                <el-form-item label="备注" v-if="props.row.dsr_type === 1">
                                    <span>{{ props.row.mark }}</span>
                                </el-form-item>
                                <el-form-item label="法定代表人" v-if="props.row.dsr_type === 2">
                                    <span>{{ props.row.legal_man }}</span>
                                </el-form-item>
                                <el-form-item label="住所地" v-if="props.row.dsr_type === 2">
                                    <span>{{ props.row.address }}</span>
                                </el-form-item>
                                <el-form-item label="统一社会信用代码" v-if="props.row.dsr_type === 2">
                                    <span>{{ props.row.card_num }}</span>
                                </el-form-item>
                                <el-form-item label="备注" v-if="props.row.dsr_type === 2">
                                    <span>{{ props.row.mark }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="名称"
                        prop="name">
                    </el-table-column>
                    <el-table-column
                        label="类别">
                        <template slot-scope="scope">
                            <span v-if=" scope.row.dsr_type === 1">个人</span>
                            <span v-else>企业</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="委托人">
                        <template slot-scope="scope">
                            <span v-if=" scope.row.type === 1">是</span>
                            <span v-else>否</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="联系方式"
                        prop="phone">
                    </el-table-column>
                    <el-table-column
                        label="属性">
                        <template slot-scope="scope">
                            <span v-if=" scope.row.c_type === 1">原告</span>
                            <span v-else-if=" scope.row.c_type === 2">被告</span>
                            <span v-else-if=" scope.row.c_type === 3">第三人</span>
                            <span v-else>案件对接人</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="table-item max-width-920 pd-bottom-20">
                <h3>冲突检索</h3>
                <div class="item-form">
                    <el-form ref="searchForm" :model="searchForm" :rules="searchRules" :inline="true" label-width="90px" size="mini"
                             label-position="left">
                        <el-row>
                            <el-form-item label="状态">
                                <el-radio-group v-model="tableData.conflict_status" @change="changeConflickStatus">
                                    <el-radio :label="0">待检索</el-radio>
                                    <el-radio :label="1">处理中</el-radio>
                                    <el-radio :label="2">通过</el-radio>
                                    <el-radio :label="3">不通过</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="当事人" prop="name">
                                <el-input v-model="searchForm.name" placeholder=""></el-input>
                            </el-form-item>
                            <!--<el-form-item label="委托人">-->
                                <!--<el-checkbox v-model="form.checked"></el-checkbox>-->
                            <!--</el-form-item>-->
                            <el-form-item class="mg-left-20">
                                <el-button type="primary" plain @click="openSearchDialog('searchForm')">查询</el-button>
                            </el-form-item>
                        </el-row>
                    </el-form>
                </div>
                <div class="item-heading">
                    <div class="item-title">冲突方审核结果</div>
                    <div class="item-control">
                        <el-form :inline="true" :model="conflictForm" :rules="conflictRules" ref="conflictForm" size="mini">
                            <el-form-item  prop="uid">
                                <el-select v-model="conflictForm.uid" size="mini" placeholder="请选择" filterable clearable >
                                    <el-option
                                        v-for="item in conflictLawyerOptions"
                                        :key="item.id"
                                        :label="item.real_name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item >
                                <el-button type="primary" @click="postConflictForm('conflictForm')" plain>添加冲突律师
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="item-table">
                    <el-table
                        :data="conflictData"
                        
                        style="width: 100%">
                        <el-table-column
                            prop="created_at"
                            label="添加时间">
                        </el-table-column>
                        <el-table-column
                            prop="uid_text"
                            label="冲突律师">
                        </el-table-column>
                        <el-table-column
                            prop="res_status_text"
                            label="审核状态">
                        </el-table-column>
                        <el-table-column
                            prop="comments"
                            label="审核意见">
                        </el-table-column>
                        <el-table-column
                            prop="updated_at"
                            label="更新时间">
                        </el-table-column>
                        <el-table-column
                            label="操作">
                            <template slot-scope="scope">
                                <el-button size="micro" type="primary" plain @click="delApprvalRow(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="table-item max-width-920 pd-bottom-20">
                <h3>审查合同</h3>
                <div class="item-form">
                    <el-form ref="form" :model="form" :inline="true" label-width="90px" size="mini"
                             label-position="left">
                        <el-row>
                            <el-form-item label="合同文件">
                                    <a :href="`${url}downloadFirmfile/${item.id}?token=${mytoken}`"
                                       v-for="item in tableData.firmfile_list"
                                       :key="item.id"
                                       class="text-link mg-left-10">
                                        <i class="iconfont  icon-xiazai "></i>
                                        <span>{{item.name}}</span>
                                    </a>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="状态">
                                <el-radio-group v-model="tableData.contract_status" @change="changeContractStatus">
                                    <el-radio :label="0">待检索</el-radio>
                                    <el-radio :label="1">处理中</el-radio>
                                    <el-radio :label="2">通过</el-radio>
                                    <el-radio :label="3">不通过</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-row>
                    </el-form>
                </div>
                <div class="item-heading">
                    <div class="item-title">审核组结果</div>
                    <div class="item-control">
                        <el-form :inline="true"  :model="apprvalForm" :rules="apprvalRules" ref="apprvalForm" size="mini">
                            <el-form-item prop="uid">
                                <el-select v-model="apprvalForm.uid" size="mini" placeholder="请选择" filterable clearable >
                                    <el-option
                                        v-for="item in apprvalLawyerOptions"
                                        :key="item.uid"
                                        :label="item.real_name"
                                        :value="item.uid">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="postApprvalForm('apprvalForm')" plain>添加审核律师
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="item-table">
                    <el-table
                        :data="apprvalData"
                        
                        style="width: 100%">
                        <el-table-column
                            prop="created_at"
                            label="添加时间">
                        </el-table-column>
                        <el-table-column
                            prop="uid_text"
                            label="冲突律师">
                        </el-table-column>
                        <el-table-column
                            prop="res_status_text"
                            label="审核状态">
                        </el-table-column>
                        <el-table-column
                            prop="comments"
                            label="审核意见">
                        </el-table-column>
                        <el-table-column
                            prop="updated_at"
                            label="更新时间">
                        </el-table-column>
                        <el-table-column
                            label="操作">
                            <template slot-scope="scope">
                                <el-button size="micro" type="primary" plain @click="delApprvalRow(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class=" mg-top-15 pd-bottom-40">
                <el-button type="primary"  @click="submitForm()">通过立案</el-button>
                <el-button plain  @click="goBack" plain>退回案件</el-button>
            </div>
        </div>
        <!--点击查询，卡时间锁-->
        <el-dialog title="检索结果" :visible.sync="dialogFormVisible" class="" @close="closeDialogForm">
            <el-table
                :data="privycData"
                
                style="width: 100%">
                <el-table-column
                    prop="name"
                    label="当事人名称">
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="委托人">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type === 1">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="c_type"
                    label="属性">
                    <template slot-scope="scope">
                        <span v-if="scope.row.c_type === 1">原告</span>
                        <span v-else-if="scope.row.c_type === 2">被告</span>
                        <span v-else-if="scope.row.c_type === 3">第三人</span>
                        <span v-else>案件对接人</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="case_name"
                    label="案件名称">
                </el-table-column>
                <el-table-column
                    prop="type_text"
                    label="案件类别">
                </el-table-column>
                <el-table-column
                    prop="host"
                    label="主办律师">
                </el-table-column>
                <el-table-column
                    prop="wa_time_text"
                    label="委案日期">
                </el-table-column>
                <el-table-column
                    prop="ja_time_text"
                    label="结案日期">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态">
                    <template slot-scope="scope">
                       <span v-if="scope.row.status === 0">正在处理</span>
                       <span v-else-if="scope.row.status === 1">通过</span>
                       <span v-else>不通过</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-form :model="dialogForm" ref="dialogForm"  label-position="top"
                     label-width="80px" class="mg-top-20">
                <el-form-item label="根据检索结果，可能需要通知如下冲突人进行审核"
                              :rules="[
                                     { required: true, message: '必填项'},
                                 ]"
                              :inline-message="false"
                              :status-icon="true"
                              prop="uid">
                    <el-col :span="18">
                        <el-select v-model="dialogForm.uid" size="mini" placeholder="请选择" filterable clearable >
                            <el-option
                                v-for="item in conflictLawyerOptions"
                                :key="item.id"
                                :label="item.real_name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6" class="text-right">
                        <el-button type="primary" size="mini" plain @click="dialogSubmit('dialogForm')">发送审核邀请
                        </el-button>
                    </el-col>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>

    import store from 'store'
    import {
        server_base_url
    } from 'common/config'
    export default {
        data () {
            return {
                url:server_base_url,
                mytoken: store.state.user_info.token,
                status:1,
                searchRules:{
                    name: [
                        { required: true, message: '必填项', trigger: 'blur' },
                    ],
                },
                conflictRules:{
                    uid: [
                        { required: true, message: '必填项', trigger: 'change' }
                    ],

                },
                apprvalRules: {
                    uid: [
                        { required: true, message: '必填项', trigger: 'change' }
                    ],
                },
                loading:false,
                apprvalForm: {
                    uid:'',
                },
                conflictForm: {
                    uid:'',
                },
                apprvalData:[],
                conflictData:[],


                conflictLawyerOptions: [],
                apprvalLawyerOptions: [],

                dialogForm: {},
                tableData:[],
                contractData:[],
                privycData:[],
                firmfileList:[],
                dialogOptions:[],
                dialogFormVisible: false,
                auth: 1,
                link_case_arr: '',
                mydata: store.state.case_info,
                form:{},
                searchForm: {
                   name:'',
                }
            }
        },
        // 实例已经创建完成之后被调用
        created () {
            this.getApprvalCaseData()
            this.getConflictLawyerList()
            this.getApprvalLawyerList()

        },
        methods: {
            goBack(){
                this.$router.back(-1)
            },
            //冲突检索-状态-单选框组
            changeConflickStatus(val){
                //智能提示
                console.log(' this.tableData.conflict_status', this.tableData.conflict_status)
                console.log('val',val)
                let cData = this.conflictData
                if (val===2){
                    if (cData.length){
                        for (let i=0;i<cData.length;i++){
                            if (cData[i].res_status !== 1){
                                this.$message.error('存在冲突律师未审核或者审核不通过')
                                return false
                            }
                        }
                    }
                }
                this.$fetch.api_lawcase.update(
                    this.$route.query.linkid,
                    {
                        conflict_status:val
                    }
                )
                    .then(({ msg }) => {
                        this.$message.success(msg)

                    })
                    .catch(({ msg }) => {
                        this.$message.error(msg)
                    })
            },
            //合同检索-状态-单选框组
            changeContractStatus(val){
                //智能提示
                let cData = this.apprvalData
                if (val===2){
                    if (cData.length){
                        for (let i=0;i<cData.length;i++){
                            if (cData[i].res_status !== 1){
                                this.$message.error('存在审核律师未审核或者审核不通过')
                                return false
                            }
                        }
                    }
                }
                this.$fetch.api_lawcase.update(
                    this.$route.query.linkid,
                    {
                        contract_status:val
                    }
                )
                    .then(({ msg }) => {
                        this.$message.success(msg)

                    })
                    .catch(({ msg }) => {
                        this.$message.error(msg)
                    })
            },
            submitForm(){
                if (this.tableData.conflict_status ===2 && this.tableData.contract_status ===2){
                    this.$fetch.api_apprval.put(
                        this.$route.query.linkid,{status:1}
                    )
                        .then(({ msg }) => {
                            this.$message.success(msg)
                            this.$router.back(-1)
                        })
                        .catch(({ msg }) => {
                            this.$message.error(msg)
//                            this.loading = false
                        })
                }else {
                    this.$message.error('冲突检索状态，审查合同状态需同时为‘通过，无冲突’，才可通过立案')
                }
            },
            //删除冲突方审核结果列表
            delApprvalRow(row){
                    this.$fetch.api_apprval.del(
                       row.id
                    )
                        .then(({ msg }) => {
                            this.$message.success(msg)
                            //删除表格中这条数据
                            let arr = (row.type === 1) ? this.conflictData : this.apprvalData
                            for (let i=0;i<arr.length;i++){
                                if (row.id === arr[i].id){
                                    arr.splice(i,1)
                                }
                            }
                        })
                        .catch(({ msg }) => {
                            this.$message.error(msg)
                            this.loading = false
                        })
            },
            //提交弹窗所添加的审核律师
            dialogSubmit(formName){
                this.$refs[formName].validate((valid) => {
                    if (!valid){return false}
                    this.$fetch.api_apprval.save(
                        {
                            linkid:this.$route.query.linkid,
                            linkid_type:1,
                            type:1,
                            uid:this.dialogForm.uid
                        }
                    )
                        .then(({ data,msg }) => {
                            this.$message.success(msg);
                            //更新数据
                            let tempArr = {
                                id:data.id,
                                comments:'',
                                updated_at:this.$dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss'),
                                created_at:this.$dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss'),
                                res_status_text:'等待审批',
                                type:1
                            }
                            let lawyer = this.conflictLawyerOptions
                            for (let i=0;i<lawyer.length;i++){
                                if (this.dialogForm.uid === lawyer[i].id){
                                    tempArr.uid_text = lawyer[i].real_name
                                }
                            }
                            this.tableData.apprval_list.push(tempArr)
                            this.dialogFormVisible = false
                        })
                        .catch(({ msg }) => {
                            this.$message.error(msg);
                        })
                });
            },
            //当前页基本数据
            getApprvalCaseData () {
                //这个列表后台暂未做分页
                this.loading = true
                this.$fetch.api_lawcase
                    .look(
                        this.$route.query.linkid
                    )
                    .then(({ data }) => {
                        this.tableData = data
                        this.apprvalData = []
                        this.conflictData = []
                        for (let i=0;i<data.apprval_list.length;i++){
                            if (data.apprval_list[i].type === 1){
                                this.conflictData.push(data.apprval_list[i])
                            }else {
                                this.apprvalData.push(data.apprval_list[i])
                            }
                        }
                        this.loading = false
                    })
                    .catch(msg => {
                        this.$message.error(msg)
                        this.loading = false
                    })
            },
            openSearchDialog(formName){
                this.$refs[formName].validate((valid) => {
                    if (!valid){return false}
                    this.dialogFormVisible = true
                    this.loading = true
                    this.$fetch.api_lawprivyc.list(
                        {
                           name:this.searchForm.name
                        }
                    )
                        .then(({ data }) => {
                            this.loading = false
                            this.privycData = data.data
                        })
                        .catch(({ msg }) => {
                            this.loading = false
                        })
                });
            },
            //关闭弹窗
            closeDialogForm () {

            },
            postConflictForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid){return false}
                    this.$fetch.api_apprval.save(
                        {
                            linkid:this.$route.query.linkid,
                            linkid_type:1,
                            type:1,
                            uid:this.conflictForm.uid
                        }
                    )
                        .then(({ data,msg }) => {
                            this.$message.success(msg);
                            //更新数据
                            let tempArr = {
                                id:data.id,
                                comments:'',
                                updated_at:this.$dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss'),
                                created_at:this.$dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss'),
                                res_status_text:'等待审批',
                                type:1
                            }
                            let lawyer = this.conflictLawyerOptions
                            for (let i=0;i<lawyer.length;i++){
                                if (this.conflictForm.uid === lawyer[i].id){
                                    tempArr.uid_text = lawyer[i].real_name
                                }
                            }
                            this.conflictData.push(tempArr)
                        })
                        .catch(({ msg }) => {
                            this.$message.error(msg);
                        })
                });
            },

            postApprvalForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid){return false}
                    this.$fetch.api_apprval.save(
                        {
                            linkid:this.$route.query.linkid,
                            linkid_type:1,
                            type:2,
                            uid:this.apprvalForm.uid
                        }
                    )
                        .then(({ data,msg }) => {
                            this.$message.success(msg);
                            //更新数据
                            let tempArr = {
                                id:data.id,
                                comments:'',
                                updated_at:this.$dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss'),
                                created_at:this.$dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss'),
                                res_status_text:'等待审批',
                                type:2
                            }
                            let lawyer = this.apprvalLawyerOptions

                            for (let i=0;i<lawyer.length;i++){
                                //要注意，和上面的id不一样，这里要用uid
                                if (this.apprvalForm.uid === lawyer[i].uid){
                                    tempArr.uid_text = lawyer[i].real_name
                                }
                            }
                            this.apprvalData.push(tempArr)
                        })
                        .catch(({ msg }) => {
                            this.$message.error(msg);
                        })
                });
            },
            //获取冲突律师列表
            getConflictLawyerList () {
                this.loading = true
                let firmId = store.state.user_info.user.firm_id
                this.$fetch.api_firm.accountList(
                    {
                        firm_id: firmId,
                        account_type: 1
                    }
                )
                    .then(({ data }) => {
                        this.loading = false
                        this.conflictLawyerOptions = data
                    })
                    .catch(msg => {
                        this.loading = false
                    })
            },
            //获取审核律师基础数据
            getApprvalLawyerList () {
                this.$fetch.api_auditor
                    .list( )
                    .then(({ data }) => {
                        this.apprvalLawyerOptions = data

                    })
                    .catch(({ msg }) => {
                        this.$message.error(msg)
                    })
            },

        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
    .apprval-case {
        .el-table td, .el-table th.is-leaf {
            border: none;
        }
    }

</style>
