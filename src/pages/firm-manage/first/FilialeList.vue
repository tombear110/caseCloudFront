<template>
    <div class="case-list">
        <el-table :data="tableData"  v-loading="loading" header-row-class-name="case_table"
                  element-loading-text="拼命加载中" fit style="width: 100%">
            <el-table-column prop="name" label="分所名称" >
            </el-table-column>
            <el-table-column prop="area" label="所在地区" sortable>
            </el-table-column>
            <el-table-column prop="charge_man" label="负责人">
            </el-table-column>
            <el-table-column prop="contact_man" label="联系人">
            </el-table-column>
            <el-table-column prop="contact_phone" label="联系电话"></el-table-column>
            <el-table-column prop="birthday" label="加入时间"></el-table-column>
            <!--在办操作，结案操作，归档操作-->
            <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                    <el-button class="text-info" type="text" size="mini" @click="jumpDetail(scope.row)">
                        查看详情
                    </el-button>
                    <span class="bar"></span>
                    <el-button class="text-danger" @click="del(scope.row)" type="text"
                               size="mini"> 从总所删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <!--<page :page-data="pageData" v-on:pageEvent="pageChange"></page>-->

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
                panelData: {
                    title: '分所列表'
                },
                loadingShare: false,
                url: server_base_url,
                token: store.state.user_info.token,
                tabActive: 0,
                case_title: '',
                show_search: false,
                degrees: ['紧急', '一般', '次要'],
                tabData: [
                    { text: '全部案件' },
                    { text: '主办案件' },
                    { text: '协办案件' }
                ],
                no_share: '',
                zbShow: '',
                jaShow: '',
                gdShow: '',
                clickLi: 0,
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                gstatus: 1,
                is_show: '',

                tableData: [],
                currentPage4: 4,
                params: {
                    //                    hstatus: null
                },
                privyc: '',
                case_status_arr: [],
                search_options: [],
                loading: false,
                dialogFormVisible: false,
                formLabelWidth: '120px',
                ifshare: [],
                iftype: [],
                share_lawyer: [],
                share_data: [],
                case_id: '',
                mydegree: '',
                degree_id: '',
                create_share_id: '',
                collapse_count: 1
            }
        },


        created () {

          this.getList()

        },
        methods: {
            jumpDetail(data){
                this.$router.push({name:'filiale_detail',query:{firm_id:data.id,name:data.name}})
            },
            //获取表格
            getList () {
                this.loading = true
                this.$fetch.api_firm.firmList(
                    {}
                )
                    .then(({ data }) => {
                        this.loading = false
                        this.tableData = data
                        console.log('this.tableData---', this.tableData)
                    })
                    .catch(msg => {
                        this.loading = false
                    })
            },

            del () {
                this.loading = true
                this.$fetch.api_firm.firmList(
                    {}
                )
                    .then(({ data }) => {
                        this.loading = false
                        this.tableData = data
                        console.log('this.tableData---', this.tableData)
                    })
                    .catch(msg => {
                        this.loading = false
                    })
            },

        },
        components: {
            page,
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>
