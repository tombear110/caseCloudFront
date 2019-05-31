<template>
    <div class="case-list">
        <!--<my-tab :tab-data="tabData">-->
            <!--<template slot="export">-->
                <!--<div class=" cursor mar-20" @click="openDialog()">-->
                    <!--<i class="iconfont ft-14 co-BFCBD9 icon-tianjia mar-5"></i>-->
                    <!--<span class="ft-14">新增</span>-->
                <!--</div>-->
            <!--</template>-->
        <!--</my-tab>-->
            <!--表格-->
            <el-table :data="tableData"  fit v-loading="loading"
                      element-loading-text="拼命加载中" style="width: 100%">
                <el-table-column prop="status" label="状态" sortable width="70">
                    <template slot-scope="scope">
                        <span class="text-danger" v-if="scope.row.status===2">被退回</span>
                        <span class="text-info" v-else-if="scope.row.status===0">待审核</span>
                        <span v-else>已立案</span>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at_text" label="报审时间" sortable >
                </el-table-column>
                <el-table-column label="文件" min-width="100" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                            <span class="text-info cursor"
                                  @click.stop.prevent="showDetail('l6aa21t2ign4')">
                                {{scope.row.name}}
                            </span>
                    </template>
                </el-table-column>
                <el-table-column prop="type_text" label="文书类型" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="stamp_num" label="盖章分数" >
                </el-table-column>
                <el-table-column prop="stamp_type_text" label="盖章类型">
                </el-table-column>
                <el-table-column prop="mark" label="备注" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="status_text" label="状态" >
                </el-table-column>
                <!--在办操作，结案操作，归档操作-->
                <el-table-column label="操作" width="105">
                    <template slot-scope="scope">
                        <el-button class="text-info" type="text" size="mini" @click=" showDetail(scope.row)">
                            详情
                        </el-button>
                        <span class="bar"></span>
                        <el-button class="text-info" type="text" size="mini" @click="onDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <page :page-data="pageData" v-on:pageEvent="pageChange"></page>

        <!--案件报审弹窗-->
        <doc-approval :doc-edit="docEdit"></doc-approval>
        <!--弹出的详情页-->
        <doc-report-detail :fData="fData"  @onEdit="onEdit"></doc-report-detail>


    </div>
</template>

<script>
    import { page, myTab, docReportDetail,docApproval } from 'components'
    import store from 'store'
    import { server_base_url } from 'common/config'

    export default {
        data () {
            return {
                docEdit:{},
                dialogTitle:'',
                url: server_base_url,

                area_options: [],
                dialog_court_arr: [],
                addData: {},

                tabActive: 0,
                show_search: false,
                share_type: 1,
                tabData: [
                    { text: '全部' }
                ],


                fData: '',
                clickLi: 0,
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                params: {
//                    hstatus: null
                },
                loading: false,
                loadingDialog: false,



                updateId:'',
                allData: [],
                zeroData: [],
                oneData: [],
                twoData: [],
            }
        },
        created () {
            this.getTableData()
        },
        computed: {
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


            //详情页-点击编辑-打开当前页dialog，进行编辑
            onEdit (val) {
                console.log('val---',val)
                this.docEdit = {
                    id:val.id,
                    visible:true
                }

            },
            //打开详情页
            showDetail (row) {
                console.log('row',row)
                this.fData = {
                    id:row.id,
                    sideout:1
                }
            },

            onDelete(row){
                this.$fetch.api_lawdoc.del(row.id)
                    .then(({
                               msg
                           }) => {
                        this.$message.success(msg)
                        for (let i=0;i<this.tableData.length;i++){
                            if (row.id === this.tableData[i].id){
                                this.tableData.splice(i,1)
                            }
                        }
                    })
                    .catch(({
                                msg
                            }) => {
                        this.$message.warning(msg)
                    })
            },

            //分页操作
            pageChange (data) {
                this.params.pageSize = data.pageSize
                this.params.page = data.currentPage
                console.log(' this.params----', this.params)
                this.getList(this.share_type, this.params)
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
                            this.allData = data.data
                            for (let i=0;i<data.data.length;i++){
                                if (data.data[i].status===0){
                                    this.zeroData.push(data.data[i])
                                }else if(data.data[i].status===1){
                                    this.oneData.push(data.data[i])
                                }else {
                                    this.twoData.push(data.data[i])
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
        },

        components: {
            page,
            myTab,
            docReportDetail,
            docApproval

        }
    }
</script>
