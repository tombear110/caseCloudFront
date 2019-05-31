<template>
    <div class="case-list">
            <!--表格type=1-->
            <el-table :data="tableData"  fit v-loading="loading" v-if="listType === 1"
                      element-loading-text="拼命加载中" style="width: 100%">
                <el-table-column prop="created_at" label="报审时间" sortable :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="wtr" label="委托人" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="linkid_info.case_name" label="案件名称">
                </el-table-column>
                <el-table-column prop="linkid_info.wa_time_text" label="委案日期" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="linkid_info.type_text" label="案件类别" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="linkid_info.host" label="主办律师" width="90">
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag size="mini" v-if="scope.row.res_status === 0">{{scope.row.res_status_text}}</el-tag>
                        <el-tag size="mini" type="success" v-else-if="scope.row.res_status === 1">
                            {{scope.row.res_status_text}}
                        </el-tag>
                        <el-tag size="mini" type="danger" v-else>{{scope.row.res_status_text}}</el-tag>
                    </template>
                </el-table-column>
                <!--在办操作，结案操作，归档操作-->
                <el-table-column label="操作" width="105">
                    <template slot-scope="scope">
                        <el-button class="text-link" type="text" size="mini"
                                   @click.stop.prevent="openDetail(scope.row.id)">
                            审批
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--表格type=2-->
            <el-table :data="tableData"  fit v-loading="loading" v-if="listType === 2"
                      element-loading-text="拼命加载中" style="width: 100%">
                <el-table-column prop="created_at" label="报审时间" sortable :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="linkid_info.case_name" label="所述案件" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="linkid_info.type_text" label="案件类别" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="wtr" label="案件委托人" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="linkid_info.host" label="主办律师" width="90">
                </el-table-column>
                <el-table-column prop="linkid_info.host" label="待审文件" width="90">
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag size="mini" v-if="scope.row.res_status === 0">{{scope.row.res_status_text}}</el-tag>
                        <el-tag size="mini" type="success" v-else-if="scope.row.res_status === 1">
                            {{scope.row.res_status_text}}
                        </el-tag>
                        <el-tag size="mini" type="danger" v-else>{{scope.row.res_status_text}}</el-tag>
                    </template>
                </el-table-column>
                <!--在办操作，结案操作，归档操作-->
                <el-table-column label="操作" width="105">
                    <template slot-scope="scope">
                        <el-button class="text-info" type="text" size="mini"
                                   @click.stop.prevent="openDetail(scope.row.id)">
                            审批
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--表格type=3-->
            <el-table :data="tableData"  fit v-loading="loading" v-if="listType === 3"
                      element-loading-text="拼命加载中" style="width: 100%">
                <el-table-column prop="created_at" label="报审时间" sortable :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="linkid_info.applicant" label="报审人" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="linkid_info.type_text" label="文书类型">
                </el-table-column>
                <el-table-column prop="linkid_info.stamp_num" label="盖章份数">
                </el-table-column>
                <el-table-column prop="linkid_info.stamp_type" label="盖章类型">
                </el-table-column>
                <el-table-column prop="linkid_info.mark" label="备注" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag size="mini" v-if="scope.row.res_status === 0">{{scope.row.res_status_text}}</el-tag>
                        <el-tag size="mini" type="success" v-else-if="scope.row.res_status === 1">{{scope.row.res_status_text}}</el-tag>
                        <el-tag size="mini" type="danger" v-else>{{scope.row.res_status_text}}</el-tag>
                    </template>
                </el-table-column>
                <!--在办操作，结案操作，归档操作-->
                <el-table-column label="操作" width="105">
                    <template slot-scope="scope">
                        <el-button class="text-info" type="text" size="mini"
                                   @click.stop.prevent="openDetail(scope.row.id)">
                            审批
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页-->
            <page :page-data="pageData" v-on:pageEvent="pageChange"></page>
        <!--弹出的详情页-->
        <task-conflict :taskDetail="taskDetail" @refreshStatus="refreshStatus"></task-conflict>
    </div>
</template>

<script>
    import { page, myTab, taskConflict } from 'components'
    import store from 'store'

    export default {
        data () {
            return {
                taskDetail: {},
                tabActive: 0,
                show_search: false,
                type: 1,
                tabData: [
                    { text: '立案冲突审批' },
                    { text: '立案合同审批' },
                    { text: '文件审批' }
                ],
                dialogFormVisible: false,
                clickLi: 0,
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 20
                },
                tableData: [],
                allData: [],
                doingData: [],
                doneData: [],
                loading: false,

            }
        },
        created () {
            this.getApprvalCaseList()

        },
        computed: {
            listType(){
                const query = this.$route.query
                let result = ''
                if (query.value){
                    result = parseInt(query.value)+1
                }else {
                    result = 1
                }
                return result
            },
        },
        methods: {


            //获取表格数据
            getApprvalCaseList () {
                //这个列表后台暂未做分页
                this.loading = true
                this.$fetch.api_apprval
                    .list(
                        {
                            type: this.type
                        }
                    )
                    .then(({ data }) => {
                        //设置表格默认数据
                        this.tableData = data.data
                        this.loading = false
                    })
                    .catch(msg => {
                        this.loading = false
                    })
            },

            openDetail (id) {
                this.taskDetail = {
                    id: id,
                    type: this.listType,
                    visible:true,
                }
            },
            //修改表格状态栏
            refreshStatus (val) {
                if (val.isRefresh) {
                    this.getApprvalCaseList(this.listType)
                }
            },

            //分页操作
            pageChange (data) {
                this.params.pageSize = data.pageSize
                this.params.page = data.currentPage
                console.log(' this.params----', this.params)
                this.getApprvalCaseList(this.type, this.params)
            }

        },
        components: {
            page,
            myTab,
            taskConflict
        }
    }
</script>
