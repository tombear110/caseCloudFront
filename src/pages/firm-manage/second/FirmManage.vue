<template>
    <div class="firm-info" >
        <div class="tab-component mg-left-15 mg-right-15">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===index}"
                    v-for="(item,index) in infoTab"
                    :key="item.text">
                    {{item.text}}
                </li>
            </ul>
            <div class="suffix-item">
                <div class="cursor text-light-4" @click="openManagerDialog">
                    <i class="iconfont  icon-tianjia ft-14 mg-right-5"></i>
                    <span>添加审核人员</span>
                </div>
            </div>
        </div>
        <!--表格-->
        <el-table :data="tableData"  v-loading="loading" header-row-class-name="case_table" height="400"
                  element-loading-text="拼命加载中" fit style="width: 100%;padding: 0 15px">
            <el-table-column prop="real_name" label="姓名">
            </el-table-column>
            <el-table-column prop="email" label="邮箱账号">
            </el-table-column>
            <el-table-column prop="host_text" label="联系电话"></el-table-column>
            <el-table-column prop="updated_at" label="添加时间"></el-table-column>
            <!--在办操作，结案操作，归档操作-->
            <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-button class="text-link" @click="del(scope.$index,scope.row)" type="text"
                               size="mini"> 删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <page :page-data="pageData" v-on:pageEvent="pageChange"></page>
        <!--修改审核管理弹窗-->
        <el-dialog title="添加审核人员" :visible.sync="formDialog" class="manager-dialog">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" >
                <el-form-item label="选择审核人" prop="uid">
                    <el-select v-model="form.uid" placeholder="请选择" filterable clearable>
                        <el-option-group
                            v-for="group in lawyerOptions"
                            :key="group.label"
                            :label="group.label">
                            <el-option
                                v-for="item in group.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item v-loading="loading">
                    <el-button type="primary"  @click="onSubmit('form')">确认</el-button>
                    <el-button type=""  plain @click="formDialog = false">取消</el-button>
                </el-form-item>
            </el-form>
            <!--<div slot="footer" class="text-center" >-->
            <!---->
            <!--</div>-->
        </el-dialog>
    </div>
</template>

<script>

    import { page } from 'components'
    import store from 'store'
    import {
        server_base_url
    } from 'common/config'

    export default {
        data () {
            return {
                infoTab: [
                    {
                        text: '律所信息'
                    }
                ],
                tabActive:0,
                formDialog:false,
                form:{
                    uid: '',
                },
                rules: {
                    uid: [
                        { required: true, message: '必填项', trigger: 'change' }
                    ],
                },
                loading:false,
                panelData:{
                    title:'审核组管理'
                },

                lawyerOptions:[],
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },

                tableData: [],
                currentPage4: 4,
                dialogFormVisible: false,

            }
        },


        created () {
            this.getList()
        },
        methods: {
            openManagerDialog(){
                this.formDialog = true
                this.getLawyerList()
            },
            //获取律所律师列表
            getLawyerList () {
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
                        //数据去重，找出团队id
                        let temp = []
                        for (let i=0;i<data.length;i++){
                            temp.push(data[i].team_id,)
                        }
                        let tempSet = [...new Set(temp)]
                        //找出团队名称
                        let tempArr = []
                        for (let j=0;j<tempSet.length;j++){
                            for (let i=0;i<data.length;i++){
                                if (data[i].team_id === tempSet[j]){
                                    tempArr.push(
                                        {
                                            team_id:tempSet[j],
                                            t_name:data[i].t_name,
                                        }
                                    )
                                    break;
                                }
                            }
                        }
                        //根据团队id，将所属同一团队的律师放入同一个团队下面
                        let userArr = []
                        for (let i=0;i<tempArr.length;i++){
                            let tempObj = {}
                            tempObj.label = tempArr[i].t_name
                            tempObj.options = []
                            for (let j=0;j<data.length;j++){
                                if (data[j].team_id === tempArr[i].team_id){
                                    tempObj.options.push(
                                        {
                                            label:data[j].real_name,
                                            value:data[j].id,
                                        }
                                    )
                                }

                            }
                            userArr.push(tempObj)
                        }
                        this.lawyerOptions = userArr

                    })
                    .catch(msg => {
                        this.loading = false
                    })
            },
            //分页操作
            pageChange (data) {
                let params = {
                    pageSize:data.pageSize,
                    page:data.currentPage,
                }
                this.getList(params)
            },
            //获取表格数据
            getList (params) {
                //这个列表后台暂未做分页
                this.$fetch.api_auditor
                    .list( params)
                    .then(({ data }) => {
                        this.loading = false
                        this.tableData = data
                        console.log('this.tableData---', this.tableData)

                    })
                    .catch(msg => {
                        this.Message.error(msg)
                        this.loading = false
                    })
            },

            onSubmit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return false
                    this.loading = true
                    //提交
                    this.$fetch.api_auditor.save(this.form)
                        .then(({
                                   msg,
                                   data
                               }) => {
                            this.$message.success(msg)
                            this.loading = false
                            this.form.uid = ''
                            this.getList()
                        })
                        .catch(({
                                    code,
                                    msg
                                }) => {
                            this.loading = false
                        })
                })
            },

            //表格中删除某一条数据
            del (index, row) {
                this.$confirm('此操作将撤销审核权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass:'is-plain',
                })
                    .then(() => {
                        this.handelDel(index, row.id)
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
            },
            handelDel (index, id) {
                this.$fetch.api_auditor
                    .del(id)
                    .then(({ msg }) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.tableData.splice(index, 1)
                    })
                    .catch(() => {
                    })
            },


        },
        components: {
            page,
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" >
    .manager-dialog{
        .el-dialog{
            width: 400px;
        }
    }

</style>
