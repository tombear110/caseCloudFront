<template>
    <div class="firm-info" >
        <div class="tab-component mg-left-15 mg-right-15">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===index}"
                    v-for="(item,index) in infoTab"
                    @click="changeTab(index)"
                    :key="item.text">
                    {{item.text}}
                </li>
            </ul>
        </div>
        <!--行政人员列表-->
        <el-table :data="tableData"  style="width: 100%;" v-loading="loading"
                  element-loading-text="拼命加载中" height="380" v-if="tabActive===0">
            <el-table-column prop="real_name" label="姓名"></el-table-column>
            <el-table-column prop="email" label="邮箱账号"></el-table-column>
            <el-table-column prop="mobile" label="联系电话"></el-table-column>
            <el-table-column prop="created_at" label="加入时间"></el-table-column>
        </el-table>
        <!--分所独立律师-->
        <el-table :data="tableData"  v-loading="loading" header-row-class-name="case_table"
                  element-loading-text="拼命加载中"  height="380" fit style="width: 100%" v-else>
            <el-table-column prop="lawfirm" label="所属律所" sortable>
            </el-table-column>
            <el-table-column prop="real_name" label="姓名" sortable>
            </el-table-column>
            <el-table-column prop="email" label="邮箱">
            </el-table-column>
            <el-table-column prop="mobile" label="联系电话"></el-table-column>
        </el-table>

        <!--分页-->
        <!--<page :page-data="pageData" v-on:pageEvent="pageChange"></page>-->
    </div>
</template>

<script>

    import { page, myTab } from 'components'
    import store from 'store'
    import {
        server_base_url
    } from 'common/config'

    export default {
        data () {
            return {
                infoTab: [
                    {
                        text: '行政人员列表'
                    },
                    {
                        text: '分所独立律师列表'
                    }
                ],
                loadingShare: false,
                url: server_base_url,
                token: store.state.user_info.token,
                tabActive: 0,
                case_title: '',
                show_search: false,
                degrees: ['紧急', '一般', '次要'],
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },

                params: {
                    //                    hstatus: null
                },
                loading: false,
                dialogFormVisible: false,
                formLabelWidth: '120px'
            }
        },

        created () {
            this.getList()
        },
        methods: {
            changeTab (index) {
                this.tabActive = index
                this.getList()
            },
            //分页操作
//            pageChange (data) {
//                this.params.pageSize = data.pageSize
//                this.params.page = data.currentPage
//                this.getList()
//            },
            //获取表格数据
            getList () {
                this.tableData = []
                this.loading = true
                let firmId = this.$route.query.firm_id
                //account_type=1 律师列表，2为行政人员列表
                let account_type = this.tabActive === 0 ? 2 : 1
                this.$fetch.api_firm.accountList(
                    {
                        firm_id: firmId,
                        account_type: account_type
                    }
                )
                    .then(({ data }) => {
                        this.loading = false
                        this.tableData = data
                    })
                    .catch(msg => {
                        this.loading = false
                    })
            }
        },
        components: {
            page,
            myTab
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>
