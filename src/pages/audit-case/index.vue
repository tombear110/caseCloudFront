<template>
    <div class="team-content">
        <div class="content-heading">
            <i class="iconfont icon-tuandui"></i>
            <span>待审案件</span>
        </div>
        <div class="case-list">
            <my-tab :tab-data="tabData" @tabEvent="tabChange">
                <template slot="search">
                    <div class=" cursor" @click="showSearchBox">
                        <i class="iconfont ft-14  icon-huaban mar-5"></i>
                        <span class="ft-14">高级搜索</span>
                    </div>
                </template>
            </my-tab>
            <el-collapse-transition>
                <div class="case-search-form bord-btm" v-show="show_search">
                    <el-form ref="searchForm"  :model="searchForm" :rules="rules" label-width="80px">
                        <el-row>
                            <el-col :span="8" class="">
                                <el-form-item label="受理机关" prop="court_name">
                                    <el-input v-model="searchForm.court_name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="案件类型" prop="c_type_arr">
                                    <el-cascader :options="search_options"
                                                 filterable
                                                 v-model="searchForm.c_type_arr"></el-cascader>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="案件阶段" prop="h_status">
                                    <el-select v-model="searchForm.h_status">
                                        <el-option
                                            v-for="item in case_status_arr"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8" class="">
                                <el-form-item label="委案日期" prop="dateRange1">
                                    <el-date-picker
                                        v-model="searchForm.dateRange1"
                                        @change="on_date_start"
                                        :editable="false"
                                        
                                        type="daterange"
                                        align="right"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期范围"
                                        :picker-options="pickerOptions">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="结案时间" prop="dateRange2">
                                    <el-date-picker
                                        v-model="searchForm.dateRange2"
                                        @change="on_date_end"
                                        :editable="false"
                                        
                                        type="daterange"
                                        align="right"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期范围"
                                        :picker-options="pickerOptions">
                                    </el-date-picker>
                                </el-form-item>

                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item>
                                    <el-button type="primary" @click="onSearch('searchForm')">开始检索</el-button>
                                    <el-button @click="resetForm('searchForm')" plain>重置信息</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-form>
                    <div class="collapse-top" @click="hideSearchBox"><i class="iconfont  icon-shouhui1 ft-14"></i></div>
                </div>
            </el-collapse-transition>
            <div class="table-box">
                <!--表格-->
                <el-table :data="tableData"  fit v-loading="loading"
                          element-loading-text="拼命加载中" style="width: 100%">
                    <el-table-column prop="c_num" label="报审时间" sortable width="110">
                    </el-table-column>
                    <el-table-column prop="c_name" label="委托人" min-width="100" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span class="text-link cursor"
                                  @click="saveCase(scope.row.case_code,scope.row.id,scope.row.case_name,scope.row.c_type_text)">
                                {{scope.row.c_name}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="d_name" label="对方当事人" min-width="100" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="host_text" label="收案日期" width="75">
                    </el-table-column>
                    <el-table-column prop="assit_text" label="案件类别" width="75">
                    </el-table-column>
                    <el-table-column prop="c_amount" label="承办律师" width="90">
                    </el-table-column>
                    <el-table-column prop="shouli_text" label="聘用合同" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="share_count" label="利益冲突" width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="h_status_text" label="操作" width="90">
                        <template slot-scope="scope">
                           <el-button type="text">审批</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <page :page-data="pageData" v-on:pageEvent="pageChange"></page>
            </div>
        </div>
    </div>

</template>

<script>
    import { page, myTab } from 'components'
    import store from 'store'

    export default {
        data () {
            return {
                tabActive: 0,
                show_search: false,
                share_type: 1,
                tabData: [
                    { text: '全部' },
                    { text: '待审' },
                    { text: '已审' },
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
                privyc: '',
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
                    shortcuts: [{
                        text: '今日',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '三日',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '本月',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    }]
                },
                case_status_arr: [],
                search_options: [],
                loading: false,
                collapse_count: 1
            }
        },
        beforeRouteLeave (to, from, next) {
            //手动设置当前页的keepAlive=true
            from.meta.keepAlive = true
            //若果去的是列表页(isBack=false)，销毁缓存
            if (to.meta.isBack === false) {
                this.$destroy()
            }
//            //在下一个页面的meta中设置lastRoute，以便在下一个页面中判断上一个页面的名字
            to.meta.lastRoute = this.$route.name
            next()
        },
        created () {
            this.get_search_data()
            this.useList()
            this.subnavSearch()
        },
        methods: {
            //点击高级搜索，展开搜索框
            showSearchBox () {
                this.collapse_count++
                let remainder = this.collapse_count % 2
                this.show_search = remainder === 0
            },
            //点击，关闭搜索框
            hideSearchBox () {
                this.collapse_count++
                this.show_search = false
            },
            //去详情页
            saveCase (code, id, name, type_text) {
                this.$router.push({
                    name: 'case_detail',
                    query: { code: code, id: id, name: name, type_text: type_text },
                    params: { father: this.$route.name }
                })
            },
            //他人共享，共享他人
            tabChange (index) {
                this.tabActive = index

                if (index === 0) {
                    this.share_type = 1
                } else {
                    this.share_type = 2
                }
                this.getList(this.share_type)
            },
            //分页操作
            pageChange (data) {
                this.params.pageSize = data.pageSize
                this.params.page = data.currentPage
                console.log(' this.params----', this.params)
                this.getList(this.share_type, this.params)
            },
            //刚进来时显示全部案件
            useList () {
                //如果地址栏带了搜索条件，当前请求无需发送
                let route_privyc = this.$route.query.privyc
                if (route_privyc) {return false}
                //不带条件进行搜索
                this.getList(1, {})
            },
            //根据左侧栏搜索框，搜索当事人
            subnavSearch () {
                let route_privyc = this.$route.query.privyc
                if (route_privyc) {
                    this.privyc = route_privyc
                    this.onSearch()
                }
            },
            //获取表格数据
            getList (type, data) {
                this.loading = true
//                let type = this.share_type
//                console.log('this.params',this.params)
                this.$fetch.api_case.shareList(type, data)
                    .then(
                        ({
                             data
                         }) => {
                            this.loading = false
                            this.tableData = data.data
//                            console.log('alldata', this.tableData)
                            //
                            //分页
                            this.pageData.pageSize = parseInt(data.per_page)
                            this.pageData.total = data.total
                        }
                    )
                    .catch((msg) => {
//                        this.Message.success(msg)
                        this.loading = false
                    })
            },
//            获取搜索框默认数据
            get_search_data () {
                this.$fetch.api_case.caseSearch()
                    .then(({
                               data: {
                                   case_status,
                                   case_type
                               }
                           }) => {
                        this.case_status_arr = case_status
                        //将后台数据转换成标准格式
                        let father_data = case_type.fathers
                        let children_data = case_type.childrens
                        let data = []
                        for (let i = 0; i < father_data.length; i++) {
                            let c_data = []
                            for (let j = 0; j < children_data[father_data[i]['id']].length; j++) {
                                c_data[j] = {
                                    value: children_data[father_data[i]['id']][j].id,
                                    label: children_data[father_data[i]['id']][j].name
                                }
                            }
                            data[i] = { value: father_data[i].id, label: father_data[i].name, children: c_data }
                        }
                        this.search_options = data
                    })
                    .catch(({
                                msg
                            }) => {
//                        this.$message.warning(msg)
                    })
            },
            //日期格式化
            on_date_start (val) {
                this.searchForm.pr_time_s = val[0]
                this.searchForm.pr_time_e = val[1]
            },
            on_date_end (val) {
                this.searchForm.j_time_s = val[0]
                this.searchForm.j_time_e = val[1]
            },

            //点击搜索
            onSearch () {
                let sdata = {}
                sdata.privyc = this.privyc
                sdata.c_type = this.searchForm.c_type_arr[1]
                sdata.h_status = this.searchForm.h_status
                sdata.court_name = this.searchForm.court_name
                sdata.pr_time_s = this.searchForm.pr_time_s
                sdata.pr_time_e = this.searchForm.pr_time_e
                sdata.j_time_s = this.searchForm.j_time_s
                sdata.j_time_e = this.searchForm.j_time_e
                //未填写的字段不放到请求中
                let arr = ['privyc', 'c_type', 'h_status', 'court_name', 'pr_time_s', 'pr_time_e', 'j_time_s', 'j_time_e', 'share_type']
                for (let i in arr) {
                    if (!sdata[arr[i]]) {
                        delete sdata[arr[i]]
                    }
                }
//                json格式化传给params
                this.params.sdata = JSON.stringify(sdata)
                this.getList(this.share_type, this.params)
            },
            //搜索表单重置
            resetForm (formName) {
                this.$refs[formName].resetFields()
                this.privyc = ''
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
