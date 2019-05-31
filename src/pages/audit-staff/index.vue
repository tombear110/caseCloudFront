<template>
    <div class="">
        <div class="sub-nav" v-if="routeName !== 'case_detail_record'" @keyup.enter="quickSearch(privyc)">
            <div class="nav-item">
                <div @click="showNewDialog">
                    <el-button type="primary" size="mini">
                        <span class="ft-16">新建案件</span>
                    </el-button>
                </div>
                <ul class="tab-group" style="margin-left: 30px" >
                    <li v-for="(item,index) in tabList" :class="{'active':isSelected==item.value }"
                        @click="navSelect(item,index)">{{item.text}}
                    </li>
                </ul>
            </div>
        </div>
        <router-view :key="key"></router-view>
        <case-new :newAdd="newAdd"></case-new>
    </div>
</template>

<script type="text/javascript">
    import { caseNew } from 'components'
    import { mapActions } from 'vuex'
    import { SET_SEARCH_DATA } from 'store/actions/type'
    import store from 'store'
    import { server_base_url } from 'common/config'

    export default {
        components: {
            caseNew
        },
        data () {
            return {
                isActive: 0,
                tabListA: [
                    {
                        text: '全部',
                        value: 0
                    },
                    {
                        text: '待审核',
                        value: 1
                    },
                    {
                        text: '已立案',
                        value: -1
                    },
                    {
                        text: '被退回',
                        value: -1
                    },
                ],
                tabListB: [
                    {
                        text: '全部',
                        value: 0
                    },
                    {
                        text: '等待审批',
                        value: 1
                    },
                    {
                        text: '冲突待解决',
                        value: 1
                    },
                    {
                        text: '合同待审批',
                        value: 1
                    },
                    {
                        text: '未通过',
                        value: 1
                    },

                ],
                searchData: '',

                url: server_base_url,
                token: store.state.user_info.token,
                privyc: '',
                show_search: false,
                newAdd: {},
                user_type: store.state.user_info.user.type,
                isSearchInput: false,
                cTypeOptions: [],
                case_status_arr: [],
                pickerOptions: {
                    shortcuts: [
                        {
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
                    dateRange1: [],
                    dateRange2: [],
                    c_type_arr: []
//                    privyc: '',
//                    c_type: '',
//                    h_status: '',
//                    court_name: '',
//                    pr_time_s: '',
//                    pr_time_e: '',
//                    j_time_s: '',
//                    j_time_e: '',

                },
                rules: {},
                searchParams: '',
                collapse_count: 1,
                countSearchMore: 1,
                team_lawyers:[],
            }
        },
        created () {
            this.getSearchData()
        },
        computed: {
            tabList () {
                let result = []
                const routeName = this.$route.name
                if (routeName === 'staff_case') {
                    result = this.tabListA
                }else {
                    result = this.tabListB
                }
                return result
            },
            isSelected(){
                const query = this.$route.query
                let result = 0
                if (query.value){
                    result = parseInt(query.value)
                }
//                console.log('result',result)
                return result
            },


            routerActived () {
                const routes = ['case_inworking', 'case_share', 'case_finished', 'case_filed', 'case_team']
                let curRoute = this.$route.name
                let num = ''
                for (let i = 0; i < routes.length; i++) {
                    if (routes[i] === curRoute) {
                        num = i
                    }
                }
                return num
            },

            key () {
                return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
            },
            routeName () {
                return this.$route.name
            }

        },
        watch: {},

        methods: {
            ...mapActions({
                set_search_data: SET_SEARCH_DATA
            }),

            //导出列表
            exportList () {
                let routeName = this.$route.name
                let isassit, ishost, g_status, isTeam
                if (routeName === 'case_team'){
                    isTeam = 1
                }else {
                    isTeam = 0
                }
                if (routeName === 'case_inworking' || routeName === 'case_finish'|| routeName === 'case_filed'){
                    if (this.isSelected){
                        isassit = 1
                        ishost = 0
                    }else {
                        isassit = 0
                        ishost = 1
                    }
                }
                //根据路由确定案件状态
                if (routeName === 'case_inworking') {
                    g_status = 1
                } else if (routeName === 'case_finish') {
                    g_status = 2
                } else if (routeName === 'case_filed') {
                    g_status = 3
                }else {
                    g_status = 0
                }
                window.open(this.url + 'exportCases?token=' + this.token
                    + '&g_status=' + g_status
                    + '&isTeam=' + isTeam
                    + '&ishost=' + ishost
                    + '&isassit=' + isassit
                )
            },

            //去对应页面
            navSelect (item, index) {
//                this.isSelected = index
                this.$router.push({ name: this.$route.name, query: { value: item.value}})
            },

            //快速搜索当事人
            quickSearch (val) {
                this.$router.push({ name: this.routeName, query: { privyc: val, value: this.isSelected } })
            },

            //点击搜索表单,将搜索条件放到url上
            onSearch (val) {
                let form = {
                    privyc: this.searchForm.privyc,
                    court_name: this.searchForm.court_name,
                    host: this.searchForm.host,
                    assit: this.searchForm.assit,
                    c_type: this.searchForm.c_type_arr[1],
                    h_status: this.searchForm.h_status,
                    pr_time_s: this.searchForm.dateRange1[0],
                    pr_time_e: this.searchForm.dateRange1[1],
                    j_time_s: this.searchForm.dateRange2[0],
                    j_time_e: this.searchForm.dateRange2[1],
                }
//                console.log('this.isSelected', this.isSelected)
                //url带参数到当前页
                this.$router.push({
                    name: this.routeName, query: {
                        privyc: form.privyc,
                        court_name: form.court_name,
                        host: form.host,
                        assit: form.assit,
                        c_type: form.c_type,
                        h_status: form.h_status,
                        pr_time_s: form.pr_time_s,
                        pr_time_e: form.pr_time_e,
                        j_time_s: form.j_time_s,
                        j_time_e: form.j_time_e,
                        index: this.isSelected
                    }
                })
            },
            //搜索表单重置
            resetForm (formName) {
                this.$refs[formName].resetFields()
                this.privyc = ''
            },

            //获取搜索框默认数据
            getSearchData () {
                this.$fetch.api_case
                    .caseSearch()
                    .then(({ data: { case_status, case_type,team_lawyers } }) => {
                        this.team_lawyers = team_lawyers
                        this.case_status_arr = case_status
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
                    .catch(({ msg }) => {
                        this.$message.warning(msg)
                    })
            },
            showNewDialog () {
                this.newAdd = {
                    visible: true
                }
            }
            //点击高级搜索，展开搜索框

        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">


</style>
