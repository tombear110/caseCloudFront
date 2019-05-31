<template>
    <div class="case-info apprval-case" style="background-color: #fff;padding: 20px">
        <div class="content-main "   v-loading="loading"   element-loading-text="拼命加载中">
            <div class="table-item max-width-1220 pd-bottom-20">
                <h3>文书详情</h3>
                <table class="table-info">
                    <tbody>
                    <tr>
                        <th>报审人</th>
                        <td>{{tableData.applicant}}</td>
                        <th>文书类型</th>
                        <td>{{tableData.type_text}}</td>
                        <th>报审时间</th>
                        <td>{{tableData.created_at_text}}</td>
                    </tr>
                    <tr>
                        <th>盖章份数</th>
                        <td>{{tableData.stamp_num}}</td>
                        <th>盖章类型</th>
                        <td>{{tableData.stamp_type_text}}</td>
                        <th>备注</th>
                        <td>{{tableData.mark}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="table-item max-width-920 pd-bottom-20">
                <h3>审查文件</h3>
                <div class="item-form">
                    <el-form ref="form" :model="form" :inline="true" label-width="90px" size="mini"
                             label-position="left">
                        <el-row>
                            <el-form-item label="待审核文件">
                                <a :href="`${url}downloadFirmfile/${id}?token=${mytoken}`"
                                   class="text-link mg-left-10">
                                    <i class="iconfont  icon-xiazai "></i>
                                    <span>{{tableData.name}}</span>
                                </a>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="状态">
                                <el-radio-group v-model="tableData.status" disabled >
                                    <el-radio :label="0">正在处理</el-radio>
                                    <el-radio :label="1">通过</el-radio>
                                    <el-radio :label="2">不通过</el-radio>
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
                            label="审核律师">
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
                <el-button type="primary"  @click="putAcceptForm()">通过审批</el-button>
                <el-button plain  @click="putRefusedForm()" plain>退回文书</el-button>
            </div>
        </div>
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
                id:this.$route.query.id,
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
            this.getTableData()
            this.getApprvalLawyerList()

        },
        methods: {
            //通过审批
            putAcceptForm(){
                this.$fetch.api_lawdoc.update(
                    this.$route.query.id,
                    {
                        status:1
                    }
                )
                    .then(({ msg }) => {
                        this.$message.success(msg)
                        this.tableData.status = 1

                    })
                    .catch(({ msg }) => {
                        this.$message.error(msg)
                    })
            },
            //退回文书
            putRefusedForm(){
                this.$fetch.api_lawdoc.update(
                    this.$route.query.id,
                    {
                        status:2
                    }
                )
                    .then(({ msg }) => {
                        this.$message.success(msg)
                        this.tableData.status = 2

                    })
                    .catch(({ msg }) => {
                        this.$message.error(msg)
                    })
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
            //当前页基本数据
            getTableData () {
                //这个列表后台暂未做分页
                this.loading = true
                this.$fetch.api_lawdoc
                    .look(
                        this.$route.query.id
                    )
                    .then(({ data }) => {
                        this.tableData = data
                        this.apprvalData = []
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




            postApprvalForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid){return false}
                    this.$fetch.api_apprval.save(
                        {
                            linkid:this.$route.query.id,
                            linkid_type:2,
                            type:3,
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
                                if (this.apprvalForm.uid === lawyer[i].id){
                                    tempArr.uid_text = lawyer[i].real_name
                                }
                            }
                            this.apprvalData.push(tempArr)
                            console.log(' this.apprvalData', this.apprvalData)
                        })
                        .catch(({ msg }) => {
                            this.$message.error(msg);
                        })
                });
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
