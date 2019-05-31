<template>

        <div class="case-list">
            <!--表格-->
            <el-table :data="tableData" size="small-short" fit v-loading="loading"
                      element-loading-text="拼命加载中" style="width: 100%">
                <el-table-column prop="status" label="状态" sortable width="70">
                    <template slot-scope="scope">
                        <span class="text-danger" v-if="scope.row.status===2">被退回</span>
                        <span class="text-info" v-else-if="scope.row.status===0">待审核</span>
                        <span v-else>已立案</span>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at_text" label="报审时间" sortable width="110">
                </el-table-column>
                <el-table-column prop="wtr" label="委托人" min-width="100" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="case_name" label="案件名称" min-width="100" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="ja_time_text" label="结案日期">
                </el-table-column>
                <el-table-column prop="wa_time_text" label="委案日期">
                </el-table-column>
                <el-table-column prop="type_text" label="案件类别" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="contract" label="聘用合同" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="status_text" label="状态" :show-overflow-tooltip="true">
                </el-table-column>
                <!--在办操作，结案操作，归档操作-->
                <el-table-column label="操作" width="105">
                    <template slot-scope="scope">
                        <el-button class="text-info" type="text" size="mini" @click="openRowDetail(scope.row)">详情
                        </el-button>
                        <span class="bar"></span>
                        <el-button class="text-danger" type="text" size="mini" @click="delRow(scope.$index,scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <page :page-data="pageData" v-on:pageEvent="pageChange"></page>
            <!--弹出的详情页-->
            <case-report :rowData="rowData" @onEdit="onEdit" :delDetail="delDetail"></case-report>
            <case-approval :editData="editData" @refreshEdit="refreshEdit"></case-approval>
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
                        text: '正在处理',
                        num: 3
                    },
                    {
                        text: '通过',
                        num: 3
                    },
                    {
                        text: '不通过',
                        num: 2
                    }
                ],
                clickLi: 0,
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                params:{},
                loading: false,
                allData: [],
                zeroData: [],
                oneData: [],
                twoData: [],
            }
        },

        created () {
            this.getTableData()
        },
        computed:{
            tableData(){
                const query = this.$route.query
                let result = []
                switch (parseInt(query.value)){
                    case 1:
                        result = this.zeroData;break;
                    case 2:
                        result = this.oneData;break;
                    case 3:
                        result = this.twoData;break;
                    default:
                        result = this.allData;break;
                }
                return result
            },
        },
        methods: {
            //子页面修改数据成功，刷新列表数据
            refreshEdit (val) {
                this.getTableData()
            },
            openRowDetail (row) {
                this.rowData = {
                    id: row.id
                }
            },
            //分页操作
            pageChange (data) {
                this.params = {
                    pageSize: data.pageSize,
                    page: data.currentPage
                }
                this.getTableData()
            },
            //获取表格数据
            //TODO:因为存在分页，计算案件总数，各个类别数量，需要后台提供数据支持；
            getTableData () {
                this.loading = true
                this.$fetch.api_lawcase.list(this.params)
                    .then(
                        ({
                             data
                         }) => {
                            this.loading = false
                            this.allData = data.data
                            for (let i=0;i<data.data.length;i++){
                                if (data.data[i].status===0){
                                    this.zeroData.push(data.data[i])
                                }else if(data.data[i].status===1){
                                    this.oneData.push(data.data[i])
                                }else {
                                    this.oneData.push(data.data[i])
                                }
                            }
                            //分页
                            this.pageData.pageSize = parseInt(data.per_page)
                            this.pageData.total = data.total
                        }
                    )
                    .catch((msg) => {
                        this.loading = false
                    })
            },
            //传递详情页的数据给dialog
            onEdit (id) {
                console.log('11111111')
                this.editData = {
                    id: id,
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
