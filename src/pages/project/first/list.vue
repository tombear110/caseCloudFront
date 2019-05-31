<template>
    <div class="">
        <div class="search-box">
            <div class="table-nav" @keyup.enter="quickSearch(pr_name)">
                <ul class="suffix-item">
                    <li>
                        <el-popover
                            placement="bottom"
                            width="340"
                            @show="showPopover"
                            trigger="click">
                            <div class="search-more">
                                <el-form ref="searchForm" 
                                         :model="searchForm"
                                         :rules="rules"
                                         label-width="70px">
                                    <el-form-item label="项目名称" prop="pr_name">
                                        <el-input v-model="searchForm.pr_name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="客户名称" prop="cl_id">
                                        <el-select v-model="searchForm.cl_id" style="width: 100%" clearable
                                                   filterable>
                                            <el-option
                                                v-for="item in client_arr"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="客户行业" prop="industry">
                                        <el-select v-model="searchForm.industry" clearable style="width: 100%">
                                            <el-option
                                                v-for="item in c_industry_arr"
                                                :key="item.id"
                                                :label="item.title"
                                                :value="item.id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="项目类型" prop="pr_type">
                                        <el-select v-model="searchForm.pr_type" clearable style="width: 100%">
                                            <el-option
                                                v-for="item in pr_type_arr"
                                                :key="item.id"
                                                :label="item.title"
                                                :value="item.id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="项目状态" prop="pr_status">
                                        <el-select v-model="searchForm.pr_status" clearable style="width: 100%">
                                            <el-option
                                                v-for="item in pr_status_arr"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item :label="hostAssitText" prop="uid">
                                        <el-select v-model="searchForm.uid" filterable
                                                   style="width: 100%">
                                            <el-option
                                                v-for="item in assit_arr"
                                                :key="item.id"
                                                :label="item.real_name"
                                                :value="item.id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item style="margin-bottom: 0">
                                        <el-button type="primary" @click="onSearch(searchForm)">开始检索
                                        </el-button>
                                        <el-button @click="resetForm('searchForm')" plain>重置信息</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <button slot="reference" type="button" class="btn-round--ghost">高级搜索</button>
                        </el-popover>
                    </li>
                    <li style="width: 270px">
                        <el-input
                            placeholder="请输入项目名称,按Enter键搜索"
                            size="medium"
                            clearable
                            class="nav-search"
                            v-model="pr_name">
                            <i slot="prefix" class="el-input__icon el-icon-search ft-16 "
                               @click="quickSearch(pr_name)"></i>
                        </el-input>
                    </li>
                </ul>
                <div class="nav-item">
                    <div style="width: 110px;margin-left: 20px" v-if="routeName !== 'projectTeam'">
                        <el-select v-model="host"  class="select-ghost" placeholder="请选择"
                                   @change="hostChange">
                            <el-option
                                v-for="item in optionsA"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div style="width: 110px;margin-left: 20px" v-if="routeName === 'projectTeam'">
                        <el-select v-model="type"  class="select-ghost" placeholder="请选择"
                                   @change="prTypeChange">
                            <el-option
                                v-for="item in optionsC"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div style="margin-left: 5px;color: #ccc;position: relative;top: -2px;">|</div>
                    <div style="width: 110px;margin-right: 20px">
                        <el-select v-model="pr_status"  class="select-ghost" placeholder="请选择"
                                   @change="prStatusChange">
                            <el-option
                                v-for="item in optionsB"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div @click="showNewDialog">
                        <button type="button" class="btn-round">
                            <i class="el-icon-plus"></i>
                            <span>新建项目</span>
                        </button>
                    </div>
                </div>
            </div>
            <project-new :project-new="projectNew"></project-new>
        </div>
        <div class="case-list">
            <el-table :data="tableData" v-loading="loading" @row-click="clickRow" element-loading-text="拼命加载中" stripe
                      fit style="width: 100%;">
                <el-table-column prop="degree" label="等级" width="60"
                                 align="center" header-align="center">
                    <template slot-scope="scope">
                        <el-popover
                            placement="right"
                            width="100"
                            popper-class="de-popover"
                            trigger="hover">
                            <div v-for="item in degrees"
                                 :key="item.value"
                                 class="degree-box"
                                 @click.stop="changeDegree(item.value,scope.row.id)">
                            <span class="cursor"
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
                <el-table-column prop="pr_type_text" label="项目类型"  width="100">
                    <template slot-scope="scope">
                        <span :class="{'text-danger':scope.row.degree === 2}">{{scope.row.pr_type_text}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="p_num" label="项目编号"  width="110">
                </el-table-column>
                <el-table-column prop="pr_name" label="项目名称" min-width="100" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="start_time_text" label="开始时间"  width="125" >
                    <template slot-scope="scope">
                        <span>{{scope.row.start_time_text}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="end_time_text" label="结束时间" width="125" >
                    <template slot-scope="scope">
                        <span class="text-danger" v-show="scope.row.endRemind">终</span>
                        <span>{{scope.row.end_time_text}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="lawcase_count" v-if="routeName === 'projectLawsuit'" label="案件数" width="70">
                    <template slot-scope="scope">
                        <span>{{scope.row.lawcase_count}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="cl_name" label="所属客户" min-width="100" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <router-link class="co-9FA5B9" v-if="scope.row.cl_id_code"
                                     :to="{ name: 'clientDetail', params: { code: scope.row.cl_id_code }}">
                            {{scope.row.cl_name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="host_text" label="主办律师" width="100"  :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="assit_text" label="协办律师" width="100" :show-overflow-tooltip="true" >
                </el-table-column>
                <el-table-column label="操作" width="85">
                    <template slot-scope="scope">
                        <span class="text-danger" @click.stop="deleteProject(scope.$index,scope.row)">删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <page :page-data="pageData" v-on:pageEvent="pageChange"></page>
        </div>
    </div>
</template>
<script>
    import { page, projectNew } from 'components'
    import { dealObjectValue, judgeObject } from 'common/lib/common'
    import store from 'store'

    export default {
        data () {
            return {
                selectData: {
                    host: '',
                    pr_status: '',
                    type: ''
                },
                pr_name: '',
                host: 0,
                pr_status: 0,
                type: 0,
                optionsA: [
                    { value: 0, label: '我的全部' },
                    { value: 1, label: '我的主办' },
                    { value: 2, label: '我的协办' }
                ],
                optionsB: [
                    { value: 0, label: '全部状态' },
                    { value: 1, label: '进行中' },
                    { value: 2, label: '已结束' }
                ],
                optionsC: [
                    { value: 0, label: '全部项目' },
                    { value: 1, label: '诉讼项目' },
                    { value: 2, label: '非诉项目' }
                ],
                projectNew: {},

                searchForm: {
                    pr_name: '',
                    cl_id: '',
                    industry: '',
                    pr_type: '',
                    pr_status: '',
                    uid: '',
                },
                pr_status_arr: [
                    {
                        value: 1,
                        label: '进行中'
                    },
                    {
                        value: 2,
                        label: '已结束'
                    }
                ],
                pr_type_arr: [],
                assit_arr: [],
                c_industry_arr: [],
                client_arr: [],
                rules: {},
                countSearchMore: 1,
                isSearchInput: false,
                noSearchData: true,

                tabActive: 0,
                clientVisible: false,
                show_search: false,
                degrees: [
                    { value: 2, label: '重要' },
                    { value: 1, label: '一般' },
                    { value: 0, label: '次要' }
                ],
                titles: ['我的项目', '团队项目'],
                clickLi: 0,
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                tableData: [],
                params: {
                    sdata: {}
                },
                my_list_arr: [
                    {
                        text: '全部项目'
                    }, {
                        text: '主办项目'
                    }, {
                        text: '协办项目'
                    }
                ],
                team_list_arr: [
                    {
                        text: '全部项目'
                    }, {
                        text: '进行中'
                    }, {
                        text: '已结束'
                    }
                ],

                loading: false
            }
        },

        created () {
            this.getDefaultList(this.routeName)
        },
        computed: {

            isSelected () {
                const query = this.$route.query
                let result = 0
                if (query.value) {
                    result = parseInt(query.value)
                }
                return result
            },

            //搜索栏-律师-主办协办显示
            hostAssitText () {
                return (this.routeName === 'projectTeam') ? '参与律师' : '主办律师'
            },
            routeName () {
                return this.$route.name
            }
        },
        watch: {
            selectData (val) {
                let query = {
                    pr_status: val.pr_status,     //全部-0，进行中-1，协办-2
                    type: val.type   //全部-0，诉讼-1，非诉-2
                }
                let uid = this.routeName === 'projectTeam' ? '' : store.state.user_info.user.id
                query.uid = uid
                //区分 主办，协办，全部
                switch (val.host) {
                    case 1:
                        //主办
                        query.ishost = 1
                        query.isassit = 0
                        break
                    case 2:
                        //协办
                        query.ishost = 0
                        query.isassit = 1
                        break
                    default:
                        //全部
                        query.ishost = 1
                        query.isassit = 1
                        break
                }
                this.params.sdata = this.filterSearchForm(query)
                this.getList()
            },

            routeName (val) {
                this.getDefaultList(val)
            }
        },
        methods: {
            //点击搜索
            onSearch (searchForm) {
                this.params.sdata = this.filterSearchForm(searchForm)
                this.getList()
            },

            //快速搜索项目名
            //搜索时要带上 主办律师（默认自己），状态（进行中、已结束）
            quickSearch (val) {
                let query = {}
                //在团队案件中，uid设为空，搜索全部律师的；在诉讼和非诉项目中，搜索当前登录用户
                let uid = this.routeName === 'projectTeam' ? '' : store.state.user_info.user.id
                query.uid = uid
                query.pr_name = val
                switch (this.host) {
                    case 1:
                        //主办
                        query.ishost = 1
                        query.isassit = 0
                        break
                    case 2:
                        //协办
                        query.ishost = 0
                        query.isassit = 1
                        break
                    default:
                        //全部
                        query.ishost = 1
                        query.isassit = 1
                        break
                }
                query.pr_status = this.pr_status
                this.params.sdata = this.filterSearchForm(query)
                this.getList()
            },

            //过滤搜索数据，输出json
            filterSearchForm (form) {
                //清除空数据
                const data = dealObjectValue(form)
                //判断当前是诉讼，非诉，团队项目
                switch (this.routeName) {
                    case 'projectTeam':
                        data.isTeam = 1
                        data.team_uids = form.uid
                        break
                    case 'projectLawsuit':
                        data.type = 1
                        data.isTeam = 0
                        data.uid = form.uid
                        break
                    case 'projectNonLawsuit':
                        data.type = 2
                        data.isTeam = 0
                        data.uid = form.uid
                        break
                }

                return JSON.stringify(data)
            },

            //全部-0，主办-1，协办-2
            hostChange (val) {
                this.host = val
                this.selectData = Object.assign({}, this.selectData, { 'host': val })

            },
            //全部-0，进行中-1，协办-2
            prStatusChange (val) {
                this.pr_status = val
                this.selectData = Object.assign({}, this.selectData, { 'pr_status': val })
            },
            //全部-0，诉讼-1，非诉-2
            prTypeChange (val) {
                this.type = val
                this.selectData = Object.assign({}, this.selectData, { 'type': val })
            },

            //点击高级搜索popover，发送数据请求
            //获取搜索框默认数据
            showPopover () {
                //如果请求成功过，下次点击不发请求
                if (this.noSearchData) {
                    this.$fetch.api_project.projectSearchData()
                        .then(({
                                   data
                               }) => {
                            this.noSearchData = false
                            this.pr_type_arr = data.project_type
                            this.c_industry_arr = data.c_industry
                            this.assit_arr = data.team_lawyers
                            this.client_arr = data.client_arr
                        })
                        .catch(({
                                    msg
                                }) => {
                        })
                }

            },
            //新建项目
            showNewDialog () {
                this.projectNew = {
                    visible: true
                }
            },



            //搜索表单重置
            resetForm (formName) {
                this.$refs[formName].resetFields()
                this.pr_name = ''
            },

            clickRow (row, event, column) {
                this.$router.push({
                    name: 'projectCode',
                    params: {
                        code: row.pr_code
                    }
                })
            },

            //切换等级
            changeDegree (degree_num, id) {
                this.$fetch.api_project.projectPut({ degree: degree_num }, id)
                    .then(({
                               msg
                           }) => {
                        this.$message.success(msg)
                        for (let i in this.tableData) {
                            if (id === this.tableData[i].id) {
                                this.tableData[i].degree = degree_num
                            }
                        }
                    })
                    .catch(({
                                msg
                            }) => {
                        this.$message.warning(msg)
                    })
            },
            //根据路由，获取不同默认数据
            getDefaultList (routeName) {
                //预设参数
                if (routeName === 'projectTeam') {
                    this.selectData = {
                        host: 0,
                        pr_status: 0,
                        type: 0
                    }
                } else {
                    this.pr_status = 1
                    this.host = 1
                    this.selectData = Object.assign({}, this.selectData, { 'host': 1 })
                    this.selectData = Object.assign({}, this.selectData, { 'pr_status': 1 })
                }
            },
            //分页操作
            pageChange (data) {
                this.params.pageSize = data.pageSize
                this.params.page = data.currentPage
                this.getList()
            },

            //获取表格数据
            getList () {
                this.tableData = []
                this.loading = true
                this.$fetch.api_project.projectList(this.params)
                    .then(
                        ({
                             data
                         }) => {
                            this.loading = false
                            //加一个结束提醒
                            const today = this.$dayjs(new Date()).format('YYYY-MM-DD')
                            let day1 = new Date(today)
                            for (let i = 0; i < data.data.length; i++) {
                                let day2 = new Date(data.data[i].end_time_text)
                                if (day2 > day1) {
                                    data.data[i].endRemind = (day2 - day1) < 1000 * 60 * 60 * 24 * 7
                                }
                            }
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
            deleteProject (index, row) {
                this.$confirm('此操作将删除该项目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'is-plain'
                }).then(() => {
                    this.handelDel(index, row.id)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除!'
                    })
                })
            },
            handelDel (index, id) {
                this.$fetch.api_project.projectDel(id)
                    .then(({
                               msg
                           }) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.tableData.splice(index, 1)
                    }).catch(() => {
//                    this.$message.error(msg)

                })
            }

        },
        components: {
            page,
            projectNew

        }
    }
</script>


