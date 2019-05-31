<template>
    <div class="">
        <div class="table-nav" v-if="routeName !== 'clientDetail'" @keyup.enter="quickSearch(name)">
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
                                     label-width="85px">
                                <el-form-item label="客户名称" prop="name">
                                    <el-input v-model="searchForm.name"></el-input>
                                </el-form-item>
                                <el-form-item label="所属行业" prop="industry">
                                    <el-select v-model="searchForm.industry" filterable clearable style="width: 100%">
                                        <el-option v-for="item in industry_arr" :key="item.id"
                                                   :label="item.title"
                                                   :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="客户类型" prop="type">
                                    <el-select v-model="searchForm.type" clearable placeholder="请选择类型"
                                               style="width: 100%">
                                        <el-option label="签约客户" :value="1"></el-option>
                                        <el-option label="潜在客户" :value="2"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="项目类型" prop="pr_type">
                                    <el-select v-model="searchForm.pr_type" clearable style="width: 100%">
                                        <el-option v-for="item in pr_type_arr" :key="item.id"
                                                   :label="item.title"
                                                   :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-if="routeName === 'clientTeam'" label="客户跟进人"
                                              prop="follower">
                                    <el-select v-model="searchForm.follower" filterable style="width: 100%">
                                        <el-option v-for="item in follower_arr" :key="item.id"
                                                   :label="item.real_name"
                                                   :value="item.id">
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
                        <span slot="reference" class="btn-round--ghost">高级搜索</span>
                    </el-popover>
                </li>
                <li style="width: 270px">
                    <el-input
                        placeholder="请输入客户名称,按Enter键搜索"
                        size="medium"
                        class="nav-search"
                        clearable
                        v-model="name">
                        <i slot="prefix" class="el-input__icon el-icon-search ft-16 "
                           @click="quickSearch(name)"></i>
                    </el-input>
                </li>
            </ul>
            <div class="nav-item">

                <ul class="tab-group" style="margin-left: 30px" v-if="routeName === 'clientShare'" key="search-tabs">
                    <li v-for="item in shareTypeGroup" :class="{'active':shareType===item.value }"
                        @click="changeShareType(item)">{{item.text}}
                    </li>
                </ul>
                <ul class="tab-group" style="margin-left: 30px" v-else key="search-tabs">
                    <li v-for="item in markGroup" :class="{'active':mark===item.value }"
                        @click="changeMark(item)">{{item.text}}
                    </li>
                </ul>
                <div @click="showImportDialog" style="margin-right: 30px">
                    <button type="button" class="btn-round--yellow">导入客户</button>
                </div>
                <div @click="showNewDialog">
                    <button type="button" class="btn-round">
                        <i class="el-icon-plus"></i>
                        <span>新建客户</span>
                    </button>
                </div>
            </div>
        </div>
        <router-view :key="key"></router-view>
        <client-import :client-import="clientImport" @refreshClientImport="refreshClientImport"></client-import>
        <client-new :client-new="clientNew"></client-new>
    </div>
</template>

<script type="text/javascript">
    import {clientNew, clientImport} from 'components'
    import {dealObjectValue,} from 'common/lib/common'

    export default {
        components: {
            clientNew,
            clientImport
        },
        data() {
            return {
                shareType: 1,
                mark: 0,
                searchData: {},
                shareTypeGroup: [
                    {text: '他人共享', value: 1},
                    {text: '共享他人', value: 2}
                ],
                markGroup: [
                    {text: '全部', value: 0},
                    {text: '企业', value: 1},
                    {text: '个人', value: 2}
                ],
                clientNew: {},
                clientImport: {},
                name: '',
                searchForm: {
                    cl_id: '',
                    industry: '',
                    pr_type: '',
                    pr_status: '',
                    uid: ''
                },
                pr_type_arr: [],
                industry_arr: [],
                follower_arr: [],
                rules: {},
                noSearchData: true

            }
        },
        created() {

        },
        watch: {
            $route(to, from) {
                this.shareType = 1
                this.mark = 0
                const queryCode = this.$route.query.code
                if (queryCode) {
                    let parseCode = JSON.parse(decodeURIComponent(queryCode))
                    this.shareType = parseCode.share_type ? parseCode.share_type : 1
                    this.mark = parseCode.mark ? parseCode.mark : 0
                }
            }
        },
        computed: {
            routeName() {
                return this.$route.name
            },
            key() {
                return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date()
            }
        },
        methods: {
            changeMark(item) {
                this.mark = item.value
                const searchData = this.encodeData({
                    mark: this.mark
                })
                this.$router.push({name: this.routeName, query: {code: searchData}})
            },
            changeShareType(item) {
                this.shareType = item.value
                const searchData = this.encodeData({
                    share_type: this.shareType
                })
                this.$router.push({name: this.routeName, query: {code: searchData}})
            },
            refreshClientImport(val) {
                if (val) {
                    this.$router.push({
                        name: this.routeName
                    })
                }
            },

            //点击高级搜索popover，发送数据请求
            //获取搜索框默认数据
            showPopover() {
                //如果请求成功过，下次点击不发请求
                if (this.noSearchData) {
                    this.$fetch.api_client
                        .clientSearchData()
                        .then(({
                                   data
                               }) => {
                            this.pr_type_arr = data.pr_type
                            this.industry_arr = data.c_industry
                            this.follower_arr = data.team_lawyers
                        })
                        .catch(({
                                    msg
                                }) => {
                        })
                }
            },

            //新建
            showNewDialog() {
                this.clientNew = {
                    visible: true
                }
            },
            showImportDialog() {
                this.clientImport = {
                    visible: true
                }
            },

            //将对象进行uri编码
            encodeData(obj) {
                return encodeURIComponent(JSON.stringify(obj))
            },

            //快速搜索
            quickSearch(val) {
                const searchData = this.encodeData({
                    name: val,
                    mark: this.mark,
                    share_type: this.shareType
                })
                this.$router.push({name: this.routeName, query: {code: searchData}})
            },
            //点击搜索表单,将搜索条件放到url上
            onSearch(searchForm) {
                // console.log('searchForm',searchForm)
                let data = Object.assign({}, searchForm, {mark: this.mark, share_type: this.shareType})
                const searchData = this.encodeData(dealObjectValue(data))
                this.$router.push({name: this.routeName, query: {code: searchData}})
            },

            //搜索表单重置
            resetForm(formName) {
                this.$refs[formName].resetFields()
                this.name = ''
            },
        }
    }
</script>
