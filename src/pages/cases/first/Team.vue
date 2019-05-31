<template>
    <div class="case-list">
        <el-table :data="tableData" v-loading="loading" @row-click="clickRow" stripe element-loading-text="拼命加载中" fit style="width: 100%;">
            <el-table-column prop="degree" label="等级" width="60" align="center">
                <template slot-scope="scope">
                    <el-popover
                        placement="right"
                        width="100"
                        trigger="hover"
                        popper-class="de-popover">
                        <div v-for="item in degrees"
                             class="degree-box"
                             :key='item.value'
                             @click="degree_change(item.value,scope.row.id)">
                            <span :class="{'degree1':item.value === 0,'degree2':item.value === 1,'degree3':item.value === 2}"></span>
                            {{item.label}}
                        </div>
                        <div slot="reference">
                            <span class="cursor"
                                  :class="{'degree1':scope.row.degree === 0,'degree2':scope.row.degree === 1,'degree3':scope.row.degree === 2,}"></span>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="process_text" width="100" label="案件程序" >
            </el-table-column>
            <el-table-column prop="c_type_text" label="案件类型" width="180" >
            </el-table-column>
            <el-table-column prop="case_name" label="案件名称" min-width="100" :show-overflow-tooltip="true" >
            </el-table-column>
            <el-table-column prop="stage_active_text" label="案件阶段" width="100" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="shouli_text" label="受理机关" min-width="100" :show-overflow-tooltip="true" >
                <template slot-scope="scope">
                    <div>
                        {{scope.row.shouli_text}}
                        <el-tooltip v-if="scope.row.anhao" :content="scope.row.anhao"
                                    placement="right" effect="dark">
                            <span class="co-333">【案号】</span>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="c_amount" width="100" label="案件标的" >
            </el-table-column>
            <el-table-column prop="shouli_text" label="所属项目" min-width="100" :show-overflow-tooltip="true" >
                <template slot-scope="scope">
                    <div v-if="scope.row.link_pr" class="text-info text-ellipsis" @click.stop="jumpProject(scope.row.link_pr_arr)">
                        {{scope.row.link_pr_arr.pr_name}}
                    </div>
                    <div v-else>无</div>
                </template>
            </el-table-column>
            <el-table-column prop="host_text" width="120" label="主办" :show-overflow-tooltip="true" >
            </el-table-column>
            <el-table-column prop="assit_text" width="120" label="协办" :show-overflow-tooltip="true" >
            </el-table-column>
            <el-table-column label="操作" :formatter="formatter" width="90">
                <template slot-scope="scope">
                    <!--<el-button type="text" class="text-link" @click.stop="openShare(scope.row.id)"-->
                    <!--v-if="scope.row.host_status==0">分配-->
                    <!--</el-button>-->
                    <span class="text-danger" @click.stop="del(scope.$index,scope.row)">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <page :page-data="pageData" v-on:pageEvent="pageChange"></page>
        <!--分配弹窗-->
        <el-dialog title="分配案件" :visible.sync="dialogFormVisible" width="300px">
            <el-form :model="form" labelPosition="top" >
                <el-form-item prop="id">
                    <el-select v-model="form.id" placeholder="请选择主办律师" style="width: 100%">
                        <el-option
                            v-for="item in team_zai"
                            :key="item.value"
                            :label="item.real_name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="text-center">
                <el-button type="primary"  @click="share()">确认分配</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { page, myTab } from 'components'
    import store from 'store'

    export default {
        data () {
            return {
                loading: false,
                degrees:[
                    {value:2,label:'重要'},
                    {value:1,label:'一般'},
                    {value:0,label:'次要'},
                ],
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                tableData: [],
                mydegree: '',
                dialogFormVisible: false,
                share_case_id: '',
                form: {
                    id: ''
                },
                team_zai: [],
                gstatus: 0,
                params: {
                    page:1,
                    pageSize:50
                },

            }
        },
        created () {
            this.getDefaultList()
        },
        methods: {
            jumpProject(row){
                this.$router.push({
                    name: 'projectCode',
                    params: {
                        code: row.pr_code
                    }
                })
            },


            //将各种搜索条件格式化
            formatSearchData(code,routeName){
                let query = {}
                if (code === 'undefined'){
                    query.gstatus = 0
                    query.isTeam = 1
                }else {
                    query = Object.assign({},query,JSON.parse(code))
                    query.isTeam = 1
                    delete query.share_type
                    delete query.ishost
                    delete query.isassit
                }
                return query
            },

            //根据路由判断当前是我的客户or团队客户
            getDefaultList () {
                //填充基础数据
                let searchData = this.formatSearchData(decodeURIComponent(this.$route.query.code),this.$route.name)
                const data = JSON.parse(JSON.stringify(searchData))
                delete  data.gstatus
                this.gstatus =searchData.gstatus
                this.params = {
                    sdata: JSON.stringify(data),
                }
                // console.log('this.gstatus',this.gstatus)
                // console.log('this.params',this.params)
                this.getList()
            },


            //分页操作
            pageChange (data) {
                this.params.page = data.currentPage
                this.params.pageSize = data.pageSize
                this.getList()
            },

            openShare (val) {
                this.dialogFormVisible = true
                this.share_case_id = val
            },
            //分配
            share () {
                this.$fetch.api_case.caseChange({ host: this.form.id }, this.share_case_id)
                    .then(({
                               data,
                               msg
                           }) => {
                        this.$message.success(msg)
                        //取出主办人
                        let host_text
                        for (let i in this.team_zai) {
                            if (this.form.id == this.team_zai[i].value) {
                                host_text = this.team_zai[i].label
                            }
                        }
                        //分配完毕，改变更新列表数据
                        for (let i in this.tableData) {
                            if (this.share_case_id == this.tableData[i].id) {
                                this.tableData[i].host_text = host_text
                                this.tableData[i].host_status = 1
                            }
                        }
                        this.dialogFormVisible = false

                    })
                    .catch(({
                                msg
                            }) => {
                        //this.$message.warning(msg)
                    })
            },

            //切换等级
            degree_change (value, cid) {
                this.degree_id = cid
                this.mydegree = value
                this.put_table()
            },
            //修改等级
            put_table () {
                this.$fetch.api_case.caseChange({ degree: this.mydegree }, this.degree_id)
                    .then(({
                               msg
                           }) => {
                        this.$message.success(msg)
                        for (let i=0;i<this.tableData.length;i++) {
                            if (this.degree_id === this.tableData[i].id) {
                                this.tableData[i].degree = this.mydegree
                            }
                        }
                    })
                    .catch(({
                                msg
                            }) => {
//                            this.$message.warning(msg)
                    })
            },
            clickRow (row, event, column) {
                this.$router.push({
                    name: 'caseDetail',
                    params: {
                        code: row.case_code
                    }
                })
            },

            //获取表格数据
            getList () {
                this.tableData = []
                this.loading = true
                this.$fetch.api_case.caseList(this.gstatus, this.params)
                    .then(
                        ({
                             data
                         }) => {
                            this.loading = false
                            this.tableData = data.data
                            //分页
                            this.pageData.pageSize = parseInt(data.per_page)
                            this.pageData.total = data.total
                        }
                    )
                    .catch((msg) => {
                        this.Message.error(msg)
                        this.loading = false
                    })
            },
//

            //表格中删除某一条数据
            del (index, row) {
                this.$confirm('此操作将删除该案件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'is-plain'
                }).then(() => {
                    this.tableData.splice(index, 1)
                    this.handelDel(row.id)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            handelDel (id) {
                this.$fetch.api_case.caseDelete(id)
                    .then(({
                               msg
                           }) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                    }).catch((msg) => {
                    this.$message({
                        type: 'success',
                        message: msg
                    })
                })
            },
            //表格排序
            formatter (row, column) {
                return row.address
            }

        },
        components: {
            page,
            myTab
        }
    }
</script>

