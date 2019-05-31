<template>
    <div class="page-main">
        <div class="sub-nav">
            <div @click="showNewDialog" v-if="routeName==='doc_report'" style="margin-right: 30px">
                <el-button type="primary" size="mini">
                    <span class="ft-16">新建报审</span>

                </el-button>
            </div>
            <ul class="tab-group"  >
                <li v-for="(item,index) in tabList" :class="{'active':isSelected==item.value }"
                    @click="navSelect(item,index)">{{item.text}}
                </li>
            </ul>
        </div>
        <!--案件报审弹窗-->
        <doc-approval :doc-add="docAdd"></doc-approval>
        <!--弹出的详情页-->
        <router-view :key="key"></router-view>

    </div>
</template>

<script type="text/javascript">
    import store from 'store'
    import {  docApproval, } from 'components'

    export default {
        components: {
            docApproval
        },
        data() {
            return {
                docAdd:{},
                approvalNew:{},
                user_type: store.state.user_info.user.type,
                router_arr: [{
                    title: "案件报审",
                    route_name: "case_report",
                    auth:false,
                }, {
                    title: "文书报审",
                    route_name: "doc_report",
                    auth:false,
                }, {
                    title: "我的任务",
                    route_name: "task_report",
                    auth:false,
                },],
                showSearchLine: false,
                showFullSearchForm: false,
                projectNew:{},
                newAdd:{},
                pr_name: '',
                searchForm: {
                    cl_id: '',
                    industry: '',
                    pr_type: '',
                    pr_status: '',
                    uid: ''
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
                        value: 2
                    },
                    {
                        text: '被退回',
                        value: 3
                    },
                ],
                tabListB: [
                    {
                        text: '冲突处理',
                        value: 0
                    },
                    {
                        text: '立案合同审批',
                        value: 1
                    },
                    {
                        text: '文件审批',
                        value: 2
                    },

                ],
                routerOptions: [{
                    title: '案件报审',
                    route_name: 'case_report',
                    selectOptions: [
                        {text:'待审核'},
                        {text:'已立案'},
                        {text:'被退回'},
                    ],
                }, {
                    title: '文书报审',
                    route_name: 'doc_report',
                    selectOptions: [
                        {text:'待审核'},
                        {text:'已立案'},
                        {text:'被退回'},
                    ],
                }, {
                    title: '我的任务',
                    route_name: 'task_report',
                    selectOptions: [
                        {text:'冲突处理'},
                        {text:'立案合同审批'},
                        {text:'文件审批'},
                    ],
                },],
            }
        },
        computed: {
            tabList () {
                let result = []
                const routeName = this.$route.name
                if (routeName === 'case_report' || routeName === 'doc_report' ) {
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
            teamId(){
                const user_info = store.state.user_info
                return user_info.user ? user_info.user.team_id : ''
            },
            routerActived () {
                const routes = ['case_report', 'doc_report','task_report']
                let curRoute = this.$route.name
                let num = ''
                for (let i = 0; i < routes.length; i++) {
                    if (routes[i] === curRoute) {
                        num = i
                    }
                }
                return num
            },
            key() {
                return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date()
            },

            navData() {
                return {
                    router_list: this.router_arr,
                    user_type: this.user_type,
                }
            },
            routeName(){
                return this.$route.name
            },
        },
        methods: {
            //关闭清除部分数据
            closeDialogForm (formName) {
                this.$refs[formName].resetFields();
                this.dialogFormVisible = false
                this.dialogForm = {}
                this.fileList = []
            },
            showNewDialog(){
                this.docAdd={
                    visible:true,
                }
            },
            navSelect (item, index) {
                this.$router.push({ name: item.route_name, query: { value: item.value } })
            },
        },


    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>
