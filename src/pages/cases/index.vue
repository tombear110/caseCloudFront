<template>
    <div class="">
        <div class="table-nav" v-if="routeName !== 'caseDetail'" @keyup.enter="quickSearch(case_name)">
            <ul class="suffix-item">
                <li @click="exportList" v-if="this.$route.name !== 'caseShare'">
                    <button type="button" class="btn-round--yellow">导出列表</button>
                </li>
                <li>
                    <el-popover placement="bottom" width="340" @show="searchShow" trigger="click">
                        <div class="search-more">
                            <el-form ref="searchForm"  :model="searchForm" :rules="rules"
                                     label-width="70px">
                                <el-form-item label="当事人" prop="privyc">
                                    <el-input v-model="searchForm.privyc"></el-input>
                                </el-form-item>
                                <el-form-item label="主办律师" prop="host" v-if="this.$route.name === 'caseTeam'">
                                    <el-select v-model="searchForm.host" style="width: 100%" filterable clearable>
                                        <el-option v-for="item in team_lawyers" :key="item.id" :label="item.real_name"
                                                   :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="协办律师" prop="assit" v-if="this.$route.name === 'caseTeam'">
                                    <el-select v-model="searchForm.assit" style="width: 100%" filterable clearable>
                                        <el-option v-for="item in team_lawyers" :key="item.id" :label="item.real_name"
                                                   :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="受理机关" prop="court_name">
                                    <el-input v-model="searchForm.court_name"></el-input>
                                </el-form-item>
<!--                                change-on-select-->
                                <el-form-item label="案件类型" prop="c_type_arr">
                                    <el-cascader :options="cTypeOptions" style="width: 100%"
                                                 filterable
                                                 @change="change_c_type" clearable
                                                 v-model="searchForm.c_type_arr"></el-cascader>
                                </el-form-item>
                                <el-form-item label="案件程序" prop="process">
                                    <el-select v-model="searchForm.process" clearable style="width: 100%">
                                        <el-option v-for="item in processOptions" :key="item.value" :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="委案日期" prop="dateRange1">
                                    <el-date-picker style="width: 100%" v-model="searchForm.dateRange1"
                                                    :editable="false" unlink-panels  type="daterange"
                                                    align="right" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                                    placeholder="选择日期范围" :picker-options="pickerOptions">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="结案时间" prop="dateRange2">
                                    <el-date-picker style="width: 100%" v-model="searchForm.dateRange2"
                                                    :editable="false" unlink-panels  type="daterange"
                                                    align="right" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                                    placeholder="选择日期范围" :picker-options="pickerOptions">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item style="margin-bottom: 0">
                                    <el-button type="primary" @click="onSearch(searchForm)">开始检索
                                    </el-button>
                                    <el-button @click="resetForm('searchForm')" plain>重置信息</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                        <button type="button" slot="reference" class="btn-round--ghost">高级搜索</button>
                    </el-popover>
                </li>
                <li style="width: 270px">
                    <el-input
                        placeholder="请输入当事人名称进行搜索"
                        size="medium"
                        clearable
                        class="nav-search"
                        v-model="case_name">
                        <i slot="prefix" class="el-input__icon el-icon-search "
                           @click="quickSearch(case_name)"></i>
                    </el-input>
                </li>

                <!--<li style="width: 300px">-->
                <!--<autocomplete-search :search-options="searchOptions" @searchData="searchData"></autocomplete-search>-->
                <!--</li>-->
            </ul>
            <div class="nav-item">
                <div style="width: 120px;margin-right: 20px" v-if="routeName === 'caseShare'">
                    <el-select v-model="shareType"  class="select-ghost" placeholder="请选择"
                               @change="changeShareType">
                        <el-option
                            v-for="item in shareTypeGroup"
                            :key="item.value"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>

                <div style="width: 120px;margin-right: 20px" v-if="routeName === 'caseMy' || routeName === 'caseTeam'">
                    <el-select v-model="gstatus"  class="select-ghost" placeholder="请选择"
                               @change="changeGstatus">
                        <el-option
                            v-for="item in gstatusGroup"
                            :key="item.value"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>

                <div class="nav-item__select" v-if="routeName === 'caseMy'">
                    <el-select v-model="host"  class="select-ghost" placeholder="请选择"
                               @change="changeHost">
                        <el-option
                            v-for="item in hostGroup"
                            :key="item.value"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div style="margin-right: 50px" @click="showBatchDialog">
                    <el-tooltip class="item" effect="dark" content="为同一个委托人添加多个案件" placement="bottom-start">
                        <button type="button" class="btn-round--yellow">批量创建</button>
                    </el-tooltip>
                </div>
                <div @click="showNewDialog">
                    <button type="button" class="btn-round">
                        <i class="el-icon-plus"></i>
                        <span>新建案件</span>
                    </button>
                </div>
            </div>
        </div>
        <router-view :key="key"></router-view>
        <case-new :newAdd="newAdd"></case-new>
        <batch-new :newAdd="batchNew" @batchNewRefresh="batchNewRefresh"></batch-new>
    </div>
</template>

<script>
    import {
        caseNew,
        batchNew,
        autocompleteSearch
    } from 'components'
    import {
        mapActions
    } from 'vuex'
    import {
        SET_SEARCH_DATA
    } from 'store/actions/type'
    import store from 'store'
    import {
        server_base_url
    } from 'common/config'
    import { dealObjectValue } from 'common/lib/common'

    export default {
        components: {
            caseNew,
            batchNew,
            autocompleteSearch
        },
        data () {
            return {
                searchOptions: [],
                isActive: 0,
                hostGroup: [
                    {
                        text: '全部',
                        value: 0
                    },
                    {
                        text: '主办',
                        value: 1
                    },
                    {
                        text: '协办',
                        value: 2
                    }

                ],
                shareTypeGroup: [
                    {
                        text: '他人共享',
                        value: 1
                    },
                    {
                        text: '共享他人',
                        value: 2
                    }

                ],
                gstatusGroup: [
                    {
                        text: '全部案件',
                        value: 0
                    },
                    {
                        text: '在办案件',
                        value: 1
                    },
                    {
                        text: '结案案件',
                        value: 2
                    },
                    {
                        text: '归档案件',
                        value: 3
                    }
                ],
                url: server_base_url,
                token: store.state.user_info.token,
                privyc: '',
                newAdd: {},
                batchNew: {},
                user_type: store.state.user_info.user.type,
                isSearchInput: false,
                cTypeOptions: [],
                case_status_arr: [],
                pickerOptions: {
                    shortcuts: [{
                        text: '今日',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24)
                            picker.$emit('pick', [start, end])
                        }
                    },
                        {
                            text: '三日',
                            onClick (picker) {
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
                                picker.$emit('pick', [start, end])
                            }
                        },
                        {
                            text: '本月',
                            onClick (picker) {
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                                picker.$emit('pick', [start, end])
                            }
                        }
                    ]
                },
                show_search: false,
                searchForm: {
                    privyc:'',
                    host:'',
                    assit:'',
                    court_name:'',
                    c_type_arr:[],
                    dateRange1: [],
                    dateRange2: [],
                    process: '',
                },
                rules: {},
                searchParams: '',
                collapse_count: 1,
                countSearchMore: 1,
                team_lawyers: [],
                searchValue: '',
                processOptions: [],
                searchCount: 0,
                case_name: '',

                gstatus: 1,
                host: 1,
                shareType: 1
            }
        },
        created () {
            // this.setBase()
        },

        computed: {

            key () {
                return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
            },
            routeName () {
                return this.$route.name
            }

        },
        watch: {
            '$route' (to, from) {
                console.log('111111to',to)
                /**
                 * 获取高级搜索默认数据
                 * 当页面在团队与非团队之前切换时，重置searchCount，保证能发送请求；
                 * @params: isTeam=0/1
                 * @return: 返回值/返回值说明
                 */
                if (from.name === 'caseTeam' || to.name === 'caseTeam') {
                    this.searchCount = 0
                }
                this.setBase()
            }
        },

        methods: {
            ...mapActions({
                set_search_data: SET_SEARCH_DATA
            }),

            setBase () {
                //设置默认的显示
                const queryCode = this.$route.query.code
                if (queryCode) {
                    let parseCode = JSON.parse(decodeURIComponent(queryCode))
                    this.shareType = parseCode.share_type ? parseCode.share_type : 1
                    if (parseCode.ishost===1 && parseCode.isassit === 1){
                        this.host = 0
                    }else if (parseCode.ishost===1 && parseCode.isassit === 0){
                        this.host = 1
                    }else {
                        this.host = 2
                    }
                    this.gstatus = parseCode.gstatus ? parseCode.gstatus : 0
                }else {
                    this.gstatus = 1
                    this.host = 1
                    this.shareType = 1
                }
            },

            changeGstatus (value) {
                this.gstatus = value
                const searchData = this.encodeData(Object.assign({}, {
                    gstatus: this.gstatus
                }, this.getHost(this.host)))

                this.$router.push({ name: this.routeName, query: { code: searchData } })
            },
            changeShareType (value) {
                this.shareType = value
                const searchData = this.encodeData({
                    share_type: this.shareType
                })
                this.$router.push({ name: this.routeName, query: { code: searchData } })
            },
            changeHost (value) {
                this.host = value
                const searchData = this.encodeData(Object.assign({}, {
                    gstatus: this.gstatus
                }, this.getHost(this.host)))
                this.$router.push({ name: this.routeName, query: { code: searchData } })
            },

            getHost (val) {
                let result = {}
                switch (val) {
                    case 0:
                        result = { ishost: 1, isassit: 1 }
                        break
                    case 2:
                        result = { ishost: 0, isassit: 1 }
                        break
                    default:
                        result = { ishost: 1, isassit: 0 }
                        break
                }
                return result
            },

            //将对象进行uri编码
            encodeData (obj) {
                return encodeURIComponent(JSON.stringify(obj))
            },

            //快速搜索当事人
            quickSearch (val) {
                const mergeObj = Object.assign({ gstatus: this.gstatus, privyc: val }, this.getHost(this.host))
                const searchData = this.encodeData(mergeObj)
                this.$router.push({ name: this.routeName, query: { code: searchData } })
            },

            //点击搜索表单,将搜索条件放到url上
            onSearch (searchForm) {
                let filterData = {
                    privyc: searchForm.privyc,
                    process: searchForm.process,
                    court_name: searchForm.court_name,
                    host: searchForm.host,
                    assit: searchForm.assit,
                    // c_type: searchForm.c_type_arr[1] ||  searchForm.c_type_arr[0],   //TODO:实现任意级搜索，需要后端支持
                    c_type: searchForm.c_type_arr[1] ,
                    h_status: searchForm.h_status,
                    pr_time_s: searchForm.dateRange1[0],
                    pr_time_e: searchForm.dateRange1[1],
                    j_time_s: searchForm.dateRange2[0],
                    j_time_e: searchForm.dateRange2[1]
                }
                const mergeObj = Object.assign(dealObjectValue(filterData), { gstatus: this.gstatus }, { share_type: this.shareType }, this.getHost(this.host))
                const searchData = this.encodeData(mergeObj)
                this.$router.push({ name: this.routeName, query: { code: searchData } })

            },

            //当刑事案件，委托方变,对方隐藏
            change_c_type (val) {
                let temp = val[0]
                //清空案件程序值及options
                this.searchForm.process = ''
                this.getProcess(temp)
            },
            //获取案件程序
            getProcess (code) {
                this.processOptions = []
                this.$fetch.api_case.caseProcess({
                    code: code
                })
                    .then(({
                               data
                           }) => {
                        for (let i in data) {
                            this.processOptions.push({
                                value: parseInt(i),
                                label: data[i]
                            })
                        }
                    })
                    .catch(({
                                code
                            }) => {

                    })
            },

            batchNewRefresh (val) {
                this.$router.push({
                    name: val.name,
                    query: {
                        value: val.value
                    }
                })
            },
            searchData (val) {
                this.searchValue = val
            },

            //导出列表
            exportList () {
                let routeName = this.$route.name
                let isassit, ishost, g_status, isTeam
                isTeam = routeName === 'caseTeam' ? 1:0
                if (routeName === 'caseMy') {
                    if (this.host) {
                        isassit = 1
                        ishost = 0
                    } else {
                        isassit = 0
                        ishost = 1
                    }
                }
                window.open(this.url + 'exportCases?token=' + this.token +
                    '&g_status=' + this.gstatus +
                    '&isTeam=' + isTeam +
                    '&ishost=' + ishost +
                    '&isassit=' + isassit
                )
            },


            //搜索表单重置
            resetForm (formName) {
                this.$refs[formName].resetFields()
                this.privyc = ''
            },

            //点击高级搜索，获取搜索默认数据
            searchShow () {
                this.searchCount++
                //多次点击，不重复发送请求
                if (this.searchCount > 1) {
                    return false
                }
                this.getSearchData()
            },
            //获取搜索框默认数据
            getSearchData () {
                let isTeam = this.routeName === 'caseTeam' ? 1 : 0
                this.$fetch.api_case
                    .caseSearch({
                        isTeam: isTeam
                    })
                    .then(({
                               data: {
                                   case_status,
                                   case_type,
                                   team_lawyers,
                                   mycases
                               }
                           }) => {
                        this.team_lawyers = team_lawyers
                        this.searchOptions = mycases
                        //将后台数据转换成标准格式
                        let father_data = case_type.fathers
                        let children_data = case_type.childrens
                        let data = []
                        for (let i = 0; i < father_data.length; i++) {
                            let c_data = []
                            for (let j = 0; j < children_data[father_data[i]["id"]].length; j++) {
                                c_data[j] = {
                                    value: children_data[father_data[i]['id']][j].id,
                                    label: children_data[father_data[i]['id']][j].name
                                }
                            }
                            data[i] = {
                                value: father_data[i].id,
                                label: father_data[i].name,
                                children: c_data
                            }
                        }
                        this.cTypeOptions = data
                    })
                    .catch(({
                                msg
                            }) => {})
            },
            showNewDialog () {
                this.newAdd = {
                    visible: true
                }
            },
            showBatchDialog () {
                this.batchNew = {
                    visible: true
                }
            }
            //点击高级搜索，展开搜索框

        }
    }
</script>

