<template>
    <div class="notify-faq">
        <div class="tab-component">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===index}"
                    v-for="(item,index) in infoTab"
                    @click="tabChange(index)"
                    :key="item.text">
                    {{item.text}}
                </li>
            </ul>
            <div class="text-info mg-right-15 cursor ">
                <i class="iconfont  icon-bianji5 ft-14 mg-right-5"></i>
                <span>我要反馈</span>
            </div>
        </div>
        <div class="faq-page">
            <div class="section"  v-for="(item,index) in listData" :key="index">
                <div class="collpase-title">
                    <span class="type ">{{item.type_text}}</span>
                    <span class="name">{{item.add_uid_text}}</span>
                    <span class="time">{{item.created_at_text}}</span>
                </div>
                <div class="panel-body">
                    <el-collapse accordion v-model="activeCollapse" @change="changeCollapseItem">
                        <el-collapse-item  :name="index" >
                            <template slot="title">
                                <span class="coll-title">{{item.description}}</span>
                                <span class="text-success" v-if="item.isok">已解决</span>
                                <span class="text-danger" v-else>正在处理...</span>
                            </template>
                            <div class="home-feedback-detail">
                                <ul class="list-group" v-loading="formLoading">
                                    <li class="list-item"  v-for="(part,index1) in detailData.reply_list" :key="part.id">
                                        <div class="it-top">
                                            <span class="user text-danger" v-if="part.uid_type===1">{{detailData.add_uid_text}}</span>
                                            <span class="user " v-else>系统管理员</span>
                                            <span class="time">{{part.updated_at}}</span>
                                        </div>
                                        <p >{{part.content}}</p>
                                    </li>
                                </ul>
                                <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top">
                                    <el-form-item prop="content">
                                        <el-input
                                            type="textarea"
                                            :rows="3"
                                            placeholder="请输入内容"
                                            v-model="form.content">
                                        </el-input>
                                    </el-form-item>
                                </el-form>
                                <el-button type="primary"  @click="submitForm('form')">提交回复</el-button>

                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </div>
        </div>
        <page :page-data="pageData" v-on:pageEvent="pageChange"></page>
    </div>
</template>
<script>
    import { img_url } from 'common/config'
    import store from 'store'
    import { page } from 'components'

    export default {
        data () {
            return {
                activeCollapse:[],
                userName: store.state.user_info.user.real_name,
                url: img_url,
                detailData: '',
                form: {
                    content: ''
                },
                rules: {
                    content: [
                        { required: true, message: '必填项' }
                    ]
                },

                tabActive: 0,
                infoTab: [
                    {
                        text: '问题反馈'
                    }
                ],
                loading: false,
                formLoading: false,
                active_1: [0],
                active_2: [0],
                active_3: [0],
                title: '',
                listData: '',
                user_input: '',
                noMessage: false,
                recordData: '',
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                params: {},
                list_1: [],
                list_2: [],
                list_3: [],
                qa_show: 0,
                cur_id: ''

            }
        },
        created () {
            this.getList()
        },
        methods: {
            changeCollapseItem(val){
                let code = this.listData[val].fcode
                if (code){
                    this.getDetailData(code)
                }
            },
            //分页操作
            pageChange(data) {
                //TODO:翻页数据不对
                let params = {pageSize: data.pageSize,page: data.currentPage}
                this.getList(params)

            },
            //获取列表
            getList (params) {
                this.loading = true
                console.log('params',params)
                this.$fetch.api_help.feedbackList(params)
                    .then(({
                               data
                           }) => {
                        this.listData = data.data
                        this.loading = false
                        //分页
                        this.pageData.pageSize = parseInt(data.per_page)
                        this.pageData.total = data.total
                    })
                    .catch(({
                                msg
                            }) => {
                        this.$message.error(msg)
                        this.loading = false
                    })
            },
            //获取数据
            getDetailData (code) {
//                let fcode = this.$route.query.id
                this.$fetch.api_help.feedbackLook(code)
                    .then(({
                               data
                           }) => {
                        this.detailData = data
                        console.log('data', data)
                    })
                    .catch(({
                                msg
                            }) => {
                        return false
//                        this.$message.error(msg)
                    })
            },
            //提交表单
            submitForm (formName) {
//                console.log('formname',formName)
                console.log('validata',this.$refs[formName][this.activeCollapse])
//                return false
                this.$refs[formName][this.activeCollapse].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    this.formLoading = true
                    this.$fetch.api_help.feedbackReply({ reply_id: this.detailData.id}, this.form)

                        .then(({
                                   msg
                               }) => {
                            this.formLoading = false
                            this.$message.success(msg)
                            this.getDetailData(this.listData[this.activeCollapse].fcode)
                            this.form.content = ''
                        })
                        .catch(({
                                    msg
                                }) => {
                            this.formLoading = false
//                            this.$message.warning(msg)
                        })
                })
            },

            tabChange (index) {
                this.tabActive = index
            },
            //我要反馈
            submitQuestion () {
                this.$router.push({
                    name: 'home_feedback_form'
                })
            },
            //qa-折叠
            qaCollapse (index, item) {
                console.log('index-qa', item)
                this.qa_show = index
                this.cur_id = item.id
            },
            //若页面切换，no message提示变为false,避免无数据一直存在
            routeToggle () {
                this.noMessage = false
            },
            onSearch () {
                this.params.search = this.user_input
                this.get_list()
            },
            tagSearch (val) {
                this.params.tag = val
                this.get_list()
            }
        },
        components: {
            page
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>
