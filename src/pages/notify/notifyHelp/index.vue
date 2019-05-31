<template>
<div class="notify-help" @keyup.enter="onSearch">
    <div class="notify-list">
        <!--搜索框-->
        <div class="list-search">
            <el-input class="" placeholder="输入标签、名称，进行搜索"  icon="search" v-model="user_input">
                <i slot="suffix" class="el-input__icon el-icon-search cursor" @click="onSearch"></i>
            </el-input>
        </div>
        <ul class="list-group" v-loading="loading" element-loading-text="拼命加载中">
            <li class="list-item" v-for="(list,index) in listData" :key="index" @click="openDetailDialog(list.a_num )">
                <div class="item-title">
                    <div class="it-left">
                        <span class="ft-12 co-999">{{list.updated_at_text}}</span>
                        <span class="circle"></span>
                    </div>
                    <div class="it-right">
                        <span class="title"> {{list.title}}</span>
                        <ul class="tag-list" v-if="list.keywords_arr.length>0">
                            <li><i class="iconfont ft-16 icon-icon--"></i></li>
                            <li class="tag-item" v-for="(item,index) in list.keywords_arr" :key="index" @click.stop="tagSearch(item)">
                                {{item}}
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="item-des"> {{list.description}}</div>
                <div class="item-line"></div>
            </li>
            <li>
                <!--分页-->
                <page :page-data="pageData" v-on:pageEvent="pageChange"></page>
            </li>
        </ul>
        <!--无数据-->
        <div class="nodata" v-if="listData==''">
            <i class="iconfont icon-yunshuju"></i>
            <p>暂无数据</p>
        </div>
    </div>

    <el-dialog :title="articleData.title" :visible.sync="visible" custom-class="article-dialog" class="article-111" width="900px" top="5vh">
        <div class="notify-article" v-loading="loadingArticle" element-loading-text="拼命加载中">
            <ul class="tags-group">
                <li v-for="(item,index) in articleData.keywords" :key='index'>{{item}}</li>
            </ul>
            <div class=" markdown  ft-16 pab-150" v-html="articleData.content_html"></div>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {
    page
} from 'components'

export default {
    props: ['type'],
    components: {
        page,
    },
    data() {
        return {
            visible: false,
            loadingArticle: false,
            loading: false,
            title: '',
            articleData: '',
            user_input: '',
            noMessage: false,
            recordData: '',
            pageData: {
                currentPage: 1,
                total: 0,
                pageSize: 10,
            },
            params: {
                type: 0
            },
            routeName: this.$route.query.name,
            listData: '',
        }
    },
    mounted() {
        this.params.type = this.type
        this.getList()

    },
    watch: {
        type(val) {
            this.params.type = val
            this.getList()
        },
    },
    methods: {
        openDetailDialog(id) {
            this.visible = true
            this.getArticle(id)
        },
        //获取帮助文档详情
        getArticle(id) {
            this.loadingArticle = true
            this.$fetch.api_help.helpLook(id)
                .then(({
                    data
                }) => {
                    this.articleData = data
                    this.loadingArticle = false
                })
                .catch(({
                    msg
                }) => {
                    this.loadingArticle = false
                })
        },
        //分页操作
        pageChange(data) {
            this.params.pageSize = data.pageSize
            this.params.page = data.currentPage
            this.getList()

        },
        //获取帮助文档列表
        getList() {
            this.loading = true
            this.$fetch.api_help.helpList(this.params)
                .then(({
                    data
                }) => {
                    this.listData = data.data
                    this.recordData = data
                    //分页
                    this.pageData.pageSize = parseInt(data.per_page)
                    this.pageData.total = data.total
                    //若无数据，则显示
                    if (data.data.length === 0) {
                        this.noMessage = true
                    }
                    this.loading = false
                })
                .catch(({
                    msg
                }) => {
                    this.loading = false
                })
        },
        //若页面切换，no message提示变为false,避免无数据一直存在
        onSearch() {
            this.params.search = this.user_input
            this.getList()
        },
        tagSearch(val) {
            this.params.tag = val
            this.getList()
        }
    },

}
</script>
