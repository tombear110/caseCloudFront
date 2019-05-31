<template>
    <div class="tool-courthouse">
        <div class="tab-component">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===index}"
                    v-for="(item,index) in infoTab"
                    @click="tabChange(index)"
                    :key="item.text">
                    {{item.text}}
                </li>
            </ul>
            <div class="co-9FA5B9 mg-right-15 cursor " @click="dialogFormVisible = true">
                <i class="iconfont  icon-bianji5 ft-14 mg-right-5"></i>
                <span>贡献数据</span>
            </div>
        </div>
        <div class="tc-form">
            <el-form :model="search_form" label-width="80px" :rules="search_rules"  ref="search_form">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-form-item label="选择地区" prop="area">
                            <el-cascader
                                :options="area_options"
                                v-model="search_form.area"
                                filterable
                                clearable
                                change-on-select
                                style="width: 100%"
                                @change="areaChange">
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="法院名称" prop="court_id">
                            <el-select v-model="search_form.court_id" @change="courtChange" filterable clearable
                                       style="width: 100%">
                                <el-option
                                    v-for="item in court_arr"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                            <el-form-item label="法官" prop="name">
                                <el-input v-model="search_form.name" auto-complete="off"></el-input>
                            </el-form-item>
                    </el-col>
                    <el-col :span="2" :offset="1">
                        <el-button type="primary"  style="width:100%;" @click="search('search_form')">查找
                        </el-button>
                    </el-col>
                    <el-col :span="2" style="margin-left: 20px">
                        <el-button type=""  style="width:100%" @click="reset('search_form')">重置
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="tc-table">
            <div class="table">
                <el-table
                    :data="baseData"
                    size="mini"
                    :fit="true"
                    style="width: 100%">
                    <el-table-column
                        prop="court_id_text"
                        min-width="130"
                        :show-overflow-tooltip="true"
                        label="法院名称">
                    </el-table-column>
                    <el-table-column
                        prop="class_text"
                        width="80"
                        label="科室">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        width="70"
                        label="法官">
                    </el-table-column>
                    <el-table-column
                        prop="weekday_text"
                        :show-overflow-tooltip="true"
                        label="值班日">
                        <template slot-scope="scope">
                            <span>{{scope.row.weekday_text}}</span>
                            <span v-if="scope.row.ampm===1">（上午）</span>
                            <span v-else>（下午）</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="contact"
                        min-width="130"
                        :show-overflow-tooltip="true"
                        label="联系方式">
                    </el-table-column>
                    <el-table-column
                        prop="add_user"
                        :show-overflow-tooltip="true"
                        label="提供者">
                    </el-table-column>
                    <el-table-column
                        prop="like"
                        align="right"
                        label="是否准确">
                        <template slot-scope="scope">
                            <div class="cursor mg-right-10" style="display: inline-block;">
                                <i class="iconfont icon-zan1"
                                   @click="likeOpearte(scope.row.id,scope.row.weekday)"></i>
                                <span>{{scope.row.like}}</span>
                            </div>
                            <div class="cursor" style="display: inline-block">
                                <i class="iconfont icon-daocai"
                                   @click="hateOpearte(scope.row.id,scope.row.weekday)"></i>
                                <span>{{scope.row.hate}}</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="text-right">
                    <page :page-data="pageData" @pageEvent="pageChange"></page>
                </div>
            </div>
            <div class="text-right pd-bottom-20">
                <span class="text-bold ">信息不准？</span>
                <span class="text-info cursor" @click="opendFeedbackDialog">我要反馈</span>
            </div>
            <div class="remind">
                <p class="text-danger">提示：</p>
                <p>1.信息均来自使用产品的各团队，为构建一个和谐、信息互利共享的大环境，请大家一起努力维护，积极奉献；</p>
                <p>2.被来自三个不同团队反赞的数据将被系统自动删除。</p>
            </div>
        </div>

        <!--新增法官数据---即我要贡献数据-->
        <el-dialog title="新增法官数据" :visible.sync="dialogFormVisible" width="670px" class="" @close="closeDialogForm">
            <el-form :model="dialog_form" ref="dialog_form"  label-position="right" :rules="dialog_rules"
                     label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="地区" prop="dialog_area">
                            <el-cascader
                                style="width: 100%"
                                :options="area_options"
                                v-model="dialog_form.dialog_area"
                                filterable
                                clearable
                                change-on-select
                                @change="dialogAreaChange">
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="法院" prop="court_id">
                            <el-select v-model="dialog_form.court_id" filterable clearable style="width: 100%">
                                <el-option
                                    v-for="item in dialog_court_arr"
                                    :key="item.id"
                                    filterable
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="科室" prop="class">
                            <el-select v-model="dialog_form.class" filterable clearable style="width: 100%">
                                <el-option
                                    v-for="item in classOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="法官" prop="name">
                            <el-input v-model="dialog_form.name" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="dialog_form.phone" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="办公电话" prop="telphone">
                            <el-input v-model="dialog_form.telphone" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="贡献者" prop="add_user">
                            <el-input v-model="dialog_form.add_user" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="值班日" prop="weekday">
                                    <el-select v-model="dialog_form.weekday" placeholder="请选择">
                                        <el-option
                                            v-for="item in weekday_arr"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="" labelWidth="20px" prop="ampm">
                                    <el-radio-group v-model="dialog_form.ampm">
                                        <el-radio :label="1">上午</el-radio>
                                        <el-radio :label="2">下午</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <div class="text-right">
                    <el-button type="primary"  @click="dialogSubmit('dialog_form')">立即提交</el-button>
                    <el-button type=""  @click="dialogReset('dialog_form')" plain>重置</el-button>
                </div>

            </el-form>
        </el-dialog>
        <!--我要反馈-->
        <feedback :addData="addData"></feedback>

    </div>
</template>

<script>
    import { feedback, page } from 'components'
    import store from 'store'

    export default {
        components: {
            feedback,
            page
        },
        data () {

            return {
                dialog_rules: {
                    name: [
                        { required: true, message: '必选项' }
                    ],
                    court_id: [
                        { required: true, message: '必选项' }
                    ],
                    dialog_area: [
                        { required: true, message: '必选项' }
                    ]
                },
                teamId:store.state.user_info.user.team_id,
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                params: {
                    pageSize: 10,
                    page: 1
                },
                classOptions: [
                    { label: '审判庭', value: 1 },
                    { label: '执行庭', value: 2 },
                    { label: '立案庭', value: 3 },
                    { label: '其他', value: 0 }
                ],
                infoTab: [
                    {
                        text: '法院法官'
                    }
                ],
                addData: {},
                tabActive: 0,
                court_data: {
                    telephone: '',
                    work_time: []
                },
                area_options: [],
                court_arr: [],
                dialog_court_arr: [],
                search_form: {
                    area: [],
                    court_id:'',
                },
                weekday_arr: [
                    {
                        label: '星期一',
                        value: 1
                    }, {
                        label: '星期二',
                        value: 2
                    }, {
                        label: '星期三',
                        value: 3
                    }, {
                        label: '星期四',
                        value: 4
                    }, {
                        label: '星期五',
                        value: 5
                    }
                ],
                ampm_arr: [
                    {
                        label: '全部',
                        value: 0
                    }, {
                        label: '上午',
                        value: 1
                    }, {
                        label: '下午',
                        value: 2
                    }
                ],
                calander_form: {},
                dialog_form: {
                    dialog_area: [],
                    court_id: '',
                    name: '',
                    telphone: '',
                    weekday: 1,
                    ampm: 1
                },
                calanderFoemVisible: false,
                dialogFormVisible: false,
                tableData: [],
                search_rules: {

                },

                calander_rules: {
                    case_id: [
                        { required: true, message: '必选项' }
                    ]
                },
                case_arr: [],
                calander_submit_data: {},
                baseData: []
            }
        },
        created () {
            this.getAllList()
            setTimeout(
                this.getCourtList(), 1000
            )
        },
        methods: {


            //
            opendFeedbackDialog () {
                this.addData = {
                    visible: true
                }
            },

            //获取法官日程基础数据--法院，案件
            getCreate () {
                this.$fetch.api_court.judgedayCreate()
                    .then(({
                               data
                           }) => {
                        this.case_arr = data.link_cases
                    })
                    .catch(({
                                msg
                            }) => {
//                        this.$message.warning(msg)
                    })
            },
            //提交dialog新增的法官日程
            calanderSubmit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    let form = {
                        cjudge_id: this.calander_submit_data.id,
                        court_id: this.calander_submit_data.court_id,
                        weekday: this.calander_submit_data.weekday,
                        ampm: this.calander_submit_data.ampm,
                        case_id: this.calander_form.case_id
                    }
                    this.$fetch.api_court.judgedaySave(form)
                        .then(({
                                   data,
                                   msg
                               }) => {
                            this.$message.success(msg)
                            this.calanderFoemVisible = false
                        })
                        .catch(({
                                    msg
                                }) => {
                            this.$message.warning(msg)
                        })
                })
            },

            //获取法院列表
            getCourtList (arr) {
                this.$fetch.api_court.courtList({ area: arr })
                    .then(({
                               data
                           }) => {
                        if (arr) {
                            this.court_arr = data.court_arr
                        } else {
                            //将获取的地区对象转成所需的数据
                            for (let i in data.area_arr) {
                                this.area_options.push(data.area_arr[i])
                            }
                        }

                    })
                    .catch(({
                                msg
                            }) => {
                        this.$message.warning(msg)
                    })
            },

            //左侧搜索-地区改变
            areaChange (value) {
                //选择地区发生变化，法院名称跟着变化
                console.log('value', value)
                if (value) {
                    this.search_form.court_id = ''
                }
                this.getCourtList(value)
                this.calander_area = value
            },
            //左侧搜索-法院改变
            courtChange (value) {
                let temp = {}
                for (let i in  this.court_arr) {
                    if (value === this.court_arr[i].id) {
                        temp = this.court_arr[i]
                    }
                }
                temp.work_time = (temp.work_time) ? temp.work_time.split(',') : ['暂无信息', '']
                temp.telphone = (temp.telphone) ? temp.telphone : '暂无信息'
                this.court_data = temp
            },

            //贡献数据--获取法院列表
            //获取法院列表
            getDialogCourtList (arr) {
                this.$fetch.api_court.courtList({ area: arr })
                    .then(({
                               data
                           }) => {
                        this.dialog_court_arr = data.court_arr
                    })
                    .catch(({
                                msg
                            }) => {
                        this.$message.warning(msg)
                    })
            },
            //贡献数据-地区change
            dialogAreaChange (value) {
                if (value) {
                    this.dialog_form.court_id = ''
                }
                this.getDialogCourtList(value)
            },
            //贡献数据
            dialogReset (formName) {
                this.$refs[formName].resetFields()
            },
            //数据分组
            data_group (arr) {
                console.log('arr', arr)
                let map = {},
                    dest = []
                for (let i = 0; i < arr.length; i++) {
                    let ai = arr[i]
                    if (!map[ai.weekday]) {
                        dest.push({
                            weekday: ai.weekday,
                            weekday_text: ai.weekday_text,
                            data: [ai]
                        })
                        map[ai.weekday] = ai
                    } else {
                        for (let j = 0; j < dest.length; j++) {
                            let dj = dest[j]
                            if (dj.weekday === ai.weekday) {
                                dj.data.push(ai)
                                break
                            }
                        }
                    }
                }
                return dest
            },

            /*默认获取全部的法院法官数据
            * 可翻页 params*/
            getAllList () {
                this.$fetch.api_court.lawyerList(
                    this.params
                )
                    .then(({
                               data
                           }) => {
                        this.baseData = data.cjudge_arr.data
                        //分页
                        this.pageData.pageSize = parseInt(data.cjudge_arr.per_page)
                        this.pageData.total = data.cjudge_arr.total
                    })
            },

            //分页操作
            pageChange (data) {
                this.params.pageSize = data.pageSize
                this.params.page = data.currentPage
                this.search_form.area_id = this.search_form.area.join(',')
                this.params.area_id =  this.search_form.area_id
                this.params.court_id =  this.search_form.court_id
                this.params.name =  this.search_form.name
                this.getAllList()
            },

            //点击查找
            search (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {return false}
                    this.search_form.area_id = this.search_form.area.join(',')
                    let submitForm = JSON.parse(JSON.stringify( this.search_form))
                    delete submitForm.area
                    this.$fetch.api_court.lawyerList(
                        submitForm
                    )
                        .then(({
                                   data
                               }) => {
                            //不分组
                            this.baseData = data.cjudge_arr.data
                            this.pageData.pageSize = parseInt(data.cjudge_arr.per_page)
                            this.pageData.total = data.cjudge_arr.total
                        })
                })

            },

            reset(formName){
                this.$refs[formName].resetFields();
                this.getAllList()
            },

            //我要贡献数据--提交dialog新增的数据
            dialogSubmit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {return false}
                    let form = JSON.parse(JSON.stringify(this.dialog_form))
                    delete form.dialog_area
                    this.$fetch.api_court.save(form)
                        .then(({
                                   data
                               }) => {
                            //更新表格数据
                            this.dialogFormVisible = false
                        })
                })
            },
            //我要贡献数据-清除dialog表单数据
            dialogReset (formName) {
                this.$refs[formName].resetFields()
            },
            //我要贡献数据--关闭清除部分数据
            closeDialogForm () {
                this.dialog_form.telphone = ''
                this.dialog_form.name = ''
            },
            //赞
            likeOpearte (id, weekday) {
                this.$fetch.api_court.like(id)
                    .then(({
                               data
                           }) => {
                        //不分组数据更新
                        for (let i = 0; i < this.baseData.length; i++) {
                            if (this.baseData[i].id === id) {
                                this.baseData[i].like = data.like
                                this.baseData[i].hate = data.hate
                            }
                        }
                    })

            },
            //踩
            hateOpearte (id, weekday) {
                this.$fetch.api_court.hate(id)
                    .then(({
                               data
                           }) => {
                        this.$message.success('操作成功')
                        //不分组数据更新
                        for (let i = 0; i < this.baseData.length; i++) {
                            if (this.baseData[i].id === id) {
                                this.baseData[i].like = data.like
                                this.baseData[i].hate = data.hate
                            }
                        }
                    })

            }
        }
    }
</script>
