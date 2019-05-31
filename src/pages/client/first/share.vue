<template>
    <div class="case-list">
        <div class="table-box">
            <el-table :data="tableData" v-loading="loading" element-loading-text="拼命加载中" fit
                      style="width: 100%" stripe @row-click="clickRow">
                <el-table-column prop="degree" label="重要性" width="75" align="center"
                                 header-align="center">
                    <template slot-scope="scope">
                        <el-popover
                            placement="right"
                            width="100"
                            trigger="hover"
                            popper-class="de-popover">
                            <div v-for="item in degrees"
                                 class="degree-box text-center"
                                 :class="item.value===4?'text-link':''"
                                 :key='item.value'
                                 @click="changeDegree(item.value,scope.row.id)">
                                {{item.label}}
                            </div>
                            <div slot="reference">
                                <span v-if="scope.row.degree===4" class="text-link">核心</span>
                                <span v-if="scope.row.degree===3">重要</span>
                                <span v-if="scope.row.degree===2">常规</span>
                                <span v-if="scope.row.degree===1">次要</span>
                            </div>
                        </el-popover>
                    </template>

                </el-table-column>
                <el-table-column prop="type_text" label="客户类型" width="95">
                </el-table-column>
                <el-table-column prop="c_num" label="客户编号" width="140">
                </el-table-column>
                <el-table-column prop="name" label="客户名称/标识" width="" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span v-if="scope.row.mark===2">(个人)</span>
                        <span v-else>(企业)</span>
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="关联项目" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="scope.row.pr_list.length">{{scope.row.pr_list[0][2]}}</span>
                            <span v-if="scope.row.pr_list.length===0">无</span>
                            <span v-if="scope.row.pr_list.length>1">等{{scope.row.pr_list.length}}个关联</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="industry_text" label="所属行业" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="follower_text" label="跟进人" width="110">
                </el-table-column>
                <el-table-column prop="created_at_text" label="创建时间" width="100" >
                </el-table-column>
                <el-table-column prop="follower_text" label="跟进人" width="135">
                </el-table-column>
            </el-table>
            <!--分页-->
            <page :page-data="pageData" v-on:pageEvent="pageChange"></page>

        </div>
    </div>
</template>

<script>
    import { page, myTab } from 'components'
    import store from 'store'


    export default {
        components: {
            page,
            myTab,

        },
        data () {
            return {

                degrees: [
                    { value: 4, label: '核心' },
                    { value: 3, label: '重要' },
                    { value: 2, label: '常规' },
                    { value: 1, label: '次要' }
                ],
                share_type: 1,
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                tableData: [],
                params: {},
                loading: false
            }
        },
        created () {
            this.getDefaultList()
        },
        methods: {
            getTemporaryVip () {
                this.$fetch.api_order.save()
                    .then(({
                               data, code
                           }) => {
                        if (code === 0) {
                            this.set_v_info(data.v_info)
                            this.vipData = { visible: false }
                        }
                    })
            },

            clickRow (row, event, column) {
                this.$router.push({
                    name: 'clientDetail',
                    params: {
                        code: row.code
                    }
                })
            },

            //修改等级
            changeDegree (value, id) {
                this.$fetch.api_client
                    .clientPut({
                        degree: value
                    }, id)
                    .then(({
                               msg
                           }) => {
                        this.$message.success(msg)
                        for (let i in this.tableData) {
                            if (id === this.tableData[i].id) {
                                this.tableData[i].degree = value
                            }
                        }
                    })
                    .catch(({
                                msg
                            }) => {
                    })
            },


            //将各种搜索条件格式化
            formatSearchData (code, routeName) {
                let query = {}
                if (code === 'undefined') {
                    //在他人共享/共享他人中（），默认显示1
                    query.share_type = 1
                } else {
                    query = Object.assign({}, query, JSON.parse(code))
                    delete  query.mark
                }

                return query
            },

            //根据路由判断当前是我的客户or团队客户
            getDefaultList () {
                //填充基础数据
                let searchData = this.formatSearchData(decodeURIComponent(this.$route.query.code), this.$route.name)
                const data = JSON.parse(JSON.stringify(searchData))
                delete  data.share_type
                this.params = {
                    sdata: JSON.stringify(data),
                    share_type: searchData.share_type
                }
                this.getList()
            },

            //分页操作
            pageChange (data) {
                this.params.pageSize = data.pageSize
                this.params.page = data.currentPage
                this.getList()
            },
            //获取表格数据
            getList () {
                this.loading = true
                this.$fetch.api_client.clientShareList(this.params)
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
                this.$confirm('此操作将删除该客户, 是否继续?', '提示', {
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
            }
        },

    }
</script>
