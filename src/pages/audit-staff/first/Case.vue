<template>
    <div class="case-list">
        <!--表格-->
        <el-table :data="tableData" size="small-short" fit v-loading="loading"
                  element-loading-text="拼命加载中" style="width: 100%">

            <el-table-column prop="created_at_text" label="报审时间" sortable width="110">
            </el-table-column>
            <el-table-column prop="case_name" label="案件名称" min-width="100" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="wtr" label="委托人" min-width="100" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="ja_time_text" label="结案日期" width="110">
            </el-table-column>
            <el-table-column prop="wa_time_text" label="委案日期" width="110">
            </el-table-column>
            <el-table-column prop="type_text" label="案件类别" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="host" label="主办律师" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="contract" label="聘用合同" min-width="100">
            </el-table-column>
            <el-table-column prop="status_text" label="状态" min-width="120" :show-overflow-tooltip="true">
                <!--<template slot-scope="scope">-->
                <!--<span v-if="scope.row.status === 0" style="color: #909399">{{scope.row.status_text}}</span>-->
                <!--<span v-if="scope.row.status === 1" style="color: #409eff">{{scope.row.status_text}}</span>-->
                <!--<span v-if="scope.row.status === 2" style="color: #67c23a">{{scope.row.status_text}}</span>-->
                <!--<span v-if="scope.row.status === 3" style="color: #f56c6c">{{scope.row.status_text}}</span>-->
                <!--</template>-->
            </el-table-column>
            <!--在办操作，结案操作，归档操作-->
            <el-table-column label="操作" width="105">
                <template slot-scope="scope">
                    <el-button type="primary" size="micro" plain @click="jumpNew(scope.row)">审批</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <page :page-data="pageData" v-on:pageEvent="pageChange"></page>
        <!--弹出的详情页-->
        <case-report :rowData="rowData" v-on:onEdit="onEdit" v-on:delDetail="delDetail"></case-report>
        <case-approval :editData="editData"></case-approval>
    </div>
</template>

<script>
    import { page, myTab, caseReport, caseApproval } from 'components'
    import store from 'store'

    export default {
        data () {
            return {
                editData: {},
                tabActive: 0,
                show_search: false,
                share_type: 1,
                tabData: [
                    { text: '全部案件' }
                ],
                rowData: {},
                tabList: [
                    {
                        text: '全部',
                        num: ''
                    },
                    {
                        text: '待审核',
                        num: 3
                    },
                    {
                        text: '已立案',
                        num: 3
                    },
                    {
                        text: '被退回',
                        num: 2
                    }
                ],
                clickLi: 0,
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                tableData: [],
                loading: false
            }
        },

        created () {
            this.getTableData()
        },
        methods: {
            jumpNew (row) {
                console.log('row', row)
                this.$router.push({ name: 'staff_case_new', query: { linkid: row.id } })
            },

            openRowDetail (row) {
//                let rand = Math.random(188, 299999)
                this.rowData = {
                    id: row.id
                }
            },
            f_hstatus () {

            },

            //分页操作
            pageChange (data) {
                let params = {
                    pageSize: data.pageSize,
                    page: data.currentPage
                }
                this.getTableData(params)
            },

            //获取表格数据
            getTableData (params) {
                this.loading = true
                this.$fetch.api_lawcase.list(params)
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
            onEdit (data) {
                console.log('data--detail', data)
                this.editData = {
                    data: data
                }
            },
            //从详情页里面删除某一条数据
            delDetail (val) {
                for (let i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].id = val) {
                        this.tableData.splice(i, 1)
                    }
                }

            },

            //表格中删除某一条数据
            delRow (index, row) {
                this.$confirm('此操作将删除该案件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'is-plain'
                }).then(() => {
                    this.handelDel(index, row.id)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            handelDel (index, id) {
                this.$fetch.api_lawcase.del(id)
                    .then(({
                               msg
                           }) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.tableData.splice(index, 1)
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
            myTab,
            caseReport,
            caseApproval
        }
    }
</script>
