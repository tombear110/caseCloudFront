<template>
    <div class="case-list">
        <!--size="small-short"-->
        <el-table :data="tableData" v-loading="loading" @row-click="clickRow" stripe
                  element-loading-text="拼命加载中" fit style="width: 100%;">
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
                            <span
                                :class="{'degree1':item.value === 0,'degree2':item.value === 1,'degree3':item.value === 2}"></span>
                            {{item.label}}
                        </div>
                        <div slot="reference">
                            <span class="cursor"
                                  :class="{'degree1':scope.row.degree === 0,'degree2':scope.row.degree === 1,'degree3':scope.row.degree === 2,}"></span>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="process_text" width="100" label="案件程序">
            </el-table-column>
            <el-table-column prop="c_type_text" label="案件类型" width="180">
            </el-table-column>
            <el-table-column prop="case_name" label="案件名称" min-width="100" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span class="mg-right-10">{{scope.row.case_name}}</span>
                    <el-tooltip v-if="scope.row.link_pr" :content="scope.row.link_pr_arr.pr_name"
                                placement="right" effect="dark">
                        <i class="iconfont icon-xiangmu1 text-info ft-14"
                           @click.stop="jumpProject(scope.row.link_pr_arr)"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="stage_active_text" label="案件阶段" width="100" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="shouli_text" label="受理机关" min-width="80" :show-overflow-tooltip="true">
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
            <el-table-column prop="c_amount" width="100" label="案件标的">
            </el-table-column>
            <el-table-column prop="host_text" width="120" label="主办" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="assit_text" width="120" label="协办" :show-overflow-tooltip="true">
            </el-table-column>
            <!--在办操作，结案操作，归档操作-->
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="以所选案件为模板，创建新的案件，每次最多复制10条" placement="top-start">
                        <span class="co-9FA5B9" @click.stop="openCopyDialog(scope.row)">复制</span>
                    </el-tooltip>
                    <span class="bar"></span>
                    <span class="text-info" @click.stop="openShareDialog(scope.row)">共享</span>
                    <!--<el-button class="text-info" type="text" -->
                    <!--@click.stop="openApprovalDialog(scope.row)">-->
                    <!--报审-->
                    <!--</el-button>-->
                    <span class="bar"></span>
                    <span class="text-danger" @click.stop="deleteRowData(scope.$index,scope.row)">删除</span>
                </template>
            </el-table-column>
        </el-table>

        <!--分页-->
        <page :page-data="pageData" v-on:pageEvent="pageChange"></page>
        <case-share :caseShareData="caseShareData"></case-share>
        <case-copy :caseCopyData="caseCopyData" @caseCopyRefresh="caseCopyRefresh"></case-copy>
        <!--报审弹窗-->
        <case-approval :approvalNew="approvalNew"></case-approval>
    </div>
</template>

<script>
    // import { page, myTab, caseApproval, caseShare, caseCopy } from 'components'
    // import vipRemind from 'components/vip-remind'
    import store from 'store'

    export default {
        components: {
            // vipRemind
            // page,
            // myTab,
            // caseApproval,
            // caseShare,
            // caseCopy
        },
        data() {
            return {
                vipData: {},
                caseShareData: {},
                caseCopyData: {},
                isSearchInput: false,
                privyc: '',
                approvalNew: {},
                newAdd: {},
                loadingShare: false,
                tabActive: 0,
                case_title: '',
                show_search: false,
                degrees: [
                    {value: 2, label: '重要'},
                    {value: 1, label: '一般'},
                    {value: 0, label: '次要'}
                ],
                tabData: [
                    {text: '主办案件'},
                    {text: '协办案件'}
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
                is_show: '',
                tableData: [],
                currentPage4: 4,
                params: {
                    page: 1,
                    pageSize: 50
                },
                searchForm: {
                    dateRange1: '',
                    dateRange2: '',
                    privyc: '',
                    c_type: '',
                    h_status: '',
                    court_name: '',
                    pr_time_s: '',
                    pr_time_e: '',
                    j_time_s: '',
                    j_time_e: '',
                    c_type_arr: []
                },
                rules: {},
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '今日',
                            onClick(picker) {
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 24)
                                picker.$emit('pick', [start, end])
                            }
                        },
                        {
                            text: '三日',
                            onClick(picker) {
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
                                picker.$emit('pick', [start, end])
                            }
                        },
                        {
                            text: '本月',
                            onClick(picker) {
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                                picker.$emit('pick', [start, end])
                            }
                        }
                    ]
                },
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
                collapse_count: 1,
                gstatus: 0
            }
        },

        created() {
            this.getDefaultList()
        },

        methods: {
            jumpProject(row) {
                this.$router.push({
                    name: 'projectCode',
                    params: {
                        code: row.pr_code
                    }
                })
            },

            clickRow(row, event, column) {
                this.$router.push({
                    name: 'caseDetail',
                    params: {
                        code: row.case_code
                    }
                })
            },
            //打开报审弹窗
            openApprovalDialog(row) {
                this.approvalNew = {
                    case_code: row.case_code,
                    visible: true
                }
            },

            //切换等级
            degree_change(value, cid) {
                this.degree_id = cid
                this.mydegree = value
                this.put_table()
            },
            //修改等级
            put_table() {
                this.$fetch.api_case
                    .save({degree: this.mydegree}, this.degree_id)
                    .then(({}) => {
                        this.tableData = this.tableData.map(item => {
                            item.degree = this.degree_id === item.id ? this.mydegree : item.degree
                            return item
                        })
                    })
            },

            //将各种搜索条件格式化
            formatSearchData(code, routeName) {
                let query = {}
                if (code === 'undefined') {
                    query.gstatus = 1
                    query.ishost = 1
                    query.isassit = 0
                } else {
                    query = Object.assign({}, query, JSON.parse(code))
                    delete query.share_type
                }
                return query
            },

            //根据路由判断当前是我的客户or团队客户
            getDefaultList() {
                //填充基础数据
                let searchData = this.formatSearchData(decodeURIComponent(this.$route.query.code), this.$route.name)
                const data = JSON.parse(JSON.stringify(searchData))
                delete data.gstatus
                this.gstatus = searchData.gstatus
                this.params = {
                    sdata: JSON.stringify(data)
                }
                this.getList()
            },

            //分页操作
            pageChange(data) {
                this.params.pageSize = data.pageSize
                this.params.page = data.currentPage
                this.getList()
            },
            //获取表格数据
            getList() {
                this.tableData = []
                this.loading = true
                this.$fetch.api_case
                    .caseList(this.gstatus, this.params)
                    .then(({data}) => {
                        this.loading = false
                        this.tableData = data.data
                        //分页
                        this.pageData.pageSize = parseInt(data.per_page)
                        this.pageData.total = data.total
                    })
                    .catch(msg => {
                        this.loading = false
                    })
            },

            //表格中删除某一条数据
            deleteRowData(index, row) {
                this.$confirm('此操作将删除该案件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'is-plain'
                })
                    .then(() => {
                        this.handelDel(index, row.id)
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
            },
            handelDel(index, id) {
                this.$fetch.api_case
                    .caseDelete(id)
                    .then(({msg}) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.tableData.splice(index, 1)
                    })
                    .catch(() => {
                    })
            },


            //打开共享案件窗口
            openShareDialog(row) {
                const vInfo = store.state.v_info
                if (vInfo.type) {
                    this.caseShareData = {
                        visible: true,
                        id: row.id,
                        type: 1,
                        host: row.host,
                        assit: row.assit
                    }
                } else {
                    this.$vipRemind(
                        {
                            textA: '只有高阶版以上的用户才能使用共享功能哦',
                            textB: '共享对象包括但不限于团队成员，还可以对他们设置差异化权限',
                            bgWx: true
                        }
                    )
                }
            },

            //打开复制案件弹窗
            openCopyDialog(row) {

                this.caseCopyData = {
                    visible: true,
                    case_code: row.case_code
                }
            },

            caseCopyRefresh(val) {
                this.getDefaultList()
            },
            //单个共享与解除共享
            oneShare(val) {
                if (val.is_share === true) {
                    //开启共享
                    this.$fetch.api_case
                        .shareStore({
                            cid: this.case_id,
                            uid: val.id,
                            type: 1,
                            auth: 0
                        })
                        .then(({msg, data}) => {
                            this.$message.success(msg)
                            //创建共享成功返回这条共享的share_id,将对应row里面的share_id从0更新到返回值
                            for (let i in this.share_lawyer) {
                                if (this.share_lawyer[i].id === val.id)
                                    this.$set(this.share_lawyer[i], 'share_id', data.share_id)
                            }
                        })
                        .catch(({msg}) => {
                            this.$message.warning(msg)
                        })
                } else {
                    this.$fetch.api_case
                        .shareDel(val.share_id)
                        .then(({msg}) => {
                            this.$message.success(msg)
                            //删除单个共享成功后，将对应row的share_id重置为0
                            for (let i in this.share_lawyer) {
                                if (this.share_lawyer[i].id === val.id)
                                    this.$set(this.share_lawyer[i], 'share_id', 0)
                            }
                        })
                        .catch(({msg}) => {
                            this.$message.warning(msg)
                        })
                }
            },
            //修改共享的可编辑
            oneEdit(val) {
                this.$fetch.api_case
                    .sharePut(val.share_id, {auth: val.share_auth})
                    .then(({msg}) => {
                        this.$message.success(msg)
                        //修改共享状态成功,将编辑权限更新
                        for (let i in this.share_lawyer) {
                            if (this.share_lawyer[i].id == val.id)
                                this.$set(this.share_lawyer[i], 'share_auth', val.share_auth)
                        }
                    })
                    .catch(({msg}) => {
                        this.$message.warning(msg)
                    })
            },
            //解除所有共享
            removeShare() {
                let cid = this.case_id
                this.$fetch.api_case
                    .shareDelAll(cid, {type: 1})
                    .then(({msg}) => {
                        this.$message.success(msg)
                        this.dialogFormVisible = false
                    })
                    .catch(({msg}) => {
                        this.$message.warning(msg)
                    })
            }

        }

    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>
