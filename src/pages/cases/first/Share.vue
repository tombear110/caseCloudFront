<template>
    <div class="case-list">
        <!--表格-->
        <el-table :data="tableData"  v-loading="loading" @row-click="clickRow" stripe element-loading-text="拼命加载中" fit style="width: 100%;">
            <el-table-column prop="c_type_text" label="案件类型" width="180" >
            </el-table-column>
            <el-table-column prop="case_name" label="案件名称" min-width="100" :show-overflow-tooltip="true" >
            </el-table-column>
            <el-table-column prop="stage_active_text" label="案件阶段" width="100" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="shouli_text" label="受理机关" min-width="80" :show-overflow-tooltip="true" >
                <template slot-scope="scope">
                    <div class="text-ellipsis">
                        {{scope.row.shouli_text}}
                        <el-tooltip v-if="scope.row.anhao" :content="scope.row.anhao"
                                    placement="right" effect="dark">
                            <span class="co-333">【案号】</span>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="c_amount" width="100" label="案件标的"  >
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
            <el-table-column prop="share_count" label="共享人数" width="100" align="center">
            </el-table-column>
        </el-table>
        <!--分页-->
        <page :page-data="pageData" v-on:pageEvent="pageChange"></page>
    </div>
</template>

<script>
    import { page, myTab } from 'components'
    import store from 'store'

    export default {
        data () {
            return {
                share_type: 1,
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                tableData: [],
                loading: false,
                params: {
                    page:1,
                    pageSize:50
                },
                gstatus:0,
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

            clickRow (row, event, column) {
                this.$router.push({
                    name: 'caseDetail',
                    params: {
                        code: row.case_code,
                    }
                })
            },
            //去详情页
            saveCase (code, id, name, type_text) {
                this.$router.push({
                    name: 'caseDetail',
                    query: { code: code, id: id, name: name, type_text: type_text },
                })
            },



            //将各种搜索条件格式化
            formatSearchData(code,routeName){
                let query = {}
                if (code === 'undefined'){
                    query.share_type = 1
                }else {
                    query = Object.assign({},query,JSON.parse(code))
                    //直接快速搜索，在共享案件需带上默认的share_type=1（共享他人）
                    query.share_type = 1
                    delete query.gstatus
                    delete query.ishost
                    delete query.isassit
                }
                return query
            },

            //根据路由判断
            getDefaultList () {
                //填充基础数据
                let searchData = this.formatSearchData(decodeURIComponent(this.$route.query.code),this.$route.name)
                const data = JSON.parse(JSON.stringify(searchData))
                delete  data.share_type
                this.params = {
                    sdata: JSON.stringify(data),
                    share_type:searchData.share_type
                }
                // console.log('this.params',this.params)
                this.getShareList()
            },


            //分页操作
            pageChange (data) {
                this.params.page = data.currentPage
                this.params.pageSize = data.pageSize
                this.getShareList()
            },

            //获取共享列表
            getShareList () {
                this.loading = true
                this.$fetch.api_case.shareList(this.params)
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
                        this.loading = false
                    })
            },


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
