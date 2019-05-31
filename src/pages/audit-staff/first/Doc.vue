<template>
    <div class="case-list">
        <!--表格-->
        <el-table :data="tableData" size="small-short" fit v-loading="loading"
                  element-loading-text="拼命加载中" style="width: 100%">
            <el-table-column prop="created_at_text" label="报审时间" sortable>
            </el-table-column>
            <el-table-column prop="applicant" label="报审人" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="type_text" label="文件类型">
            </el-table-column>
            <el-table-column prop="stamp_num" label="盖章分数">
            </el-table-column>
            <el-table-column prop="stamp_type_text" label="盖章类型">
            </el-table-column>
            <el-table-column prop="mark" label="备注" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="status_text" label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status === 0" size="mini">{{scope.row.status_text}}</el-tag>
                    <el-tag v-if="scope.row.status === 1" size="mini" type="success">{{scope.row.status_text}}</el-tag>
                    <el-tag v-if="scope.row.status === 2" size="mini" type="danger">{{scope.row.status_text}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="jumpDetail(scope.row.id)">处理</el-button>
                </template>
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
                tabData: [
                    { text: '全部待审' }
                ],

                tabList: [
                    {
                        text: '等待审批',
                        num: 3
                    },
                    {
                        text: '冲突待解决',
                        num: 3
                    },
                    {
                        text: '合同待审批',
                        num: 2
                    },
                    {
                        text: '未通过',
                        num: 1
                    }
                ],
                clickLi: 0,
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                tableData: [],
                params: {
//                    hstatus: null
                },
                loading: false
            }
        },
        created () {
            this.getTableData()
        },
        methods: {

            //去详情页
            saveCase (code, id, name, type_text) {
                this.$router.push({
                    name: 'case_detail',
                    query: { code: code, id: id, name: name, type_text: type_text },
                    params: { father: this.$route.name }
                })
            },

            //分页操作
            pageChange (data) {
                this.params.pageSize = data.pageSize
                this.params.page = data.currentPage
                this.getList(1, this.params)
            },
            //获取表格数据
            getTableData () {
                this.loading = true
                this.$fetch.api_lawdoc.list()
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
            jumpDetail (id) {
                this.$router.push({ name: 'staff_doc_new', query: { id: id } })
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
