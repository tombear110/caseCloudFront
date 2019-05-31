<template>
    <div class="page-main">
        <div class="sub-nav">
            <div class="nav-item">
                <div @click="openBatchImport">
                    <el-button type="primary" >
                        <span class="ft-16">导入案件</span>
                    </el-button>
                </div>
                <ul class="tab-group" style="margin-left: 30px" v-if="tabList.length">
                    <li v-for="(item,index) in tabList" :class="{'active':isSelected==item.value }"
                        @click="navSelect(item,index)">{{item.text}}
                    </li>
                </ul>
            </div>
        </div>
        <batch-import :batch-data="batchData"></batch-import>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive" :key="key"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" :key="key"></router-view>
    </div>
</template>

<script type="text/javascript">
    import {
       batchImport
    } from 'components'
    import store from 'store'

    export default {
        components: {
            batchImport
        },
        data() {
            return {
                tabListA: [
                    {
                        text: '全部',
                        value: 0
                    },
                    {
                        text: '系统字段',
                        value: 1
                    },
                    {
                        text: '自定义字段',
                        value: 2
                    }
                ],
                batchData:{},
                routerOptions: [{
                    title: '我的案件',
                    route_name: 'batchMy',
                    selectOptions: [],
                }, {
                    title: '批次列表',
                    route_name: 'batchList',
                    selectOptions: [],
                }, {
                    title: '设置字段',
                    route_name: 'batchSet',
                    selectOptions: [
                        { value: 1, text: '系统字段' },
                        { value: 2, text: '自定义字段' }
                    ],
                },],
                user_type: store.state.user_info.user.type,
                router_list: [{
                    title: "我的案件",
                    route_name: "batchMy",
                    auth:false,
                },{
                    title: "批次列表",
                    route_name: "batchList",
                    auth:false,
                }, {
                    title: "设置字段",
                    route_name: "batchSet",
                    auth:false,
                }]
            }
        },
        computed: {
            isSelected(){
                const query = this.$route.query
                let result = 0
                if (query.index){
                    result = parseInt(query.index)
                }
                console.log('result',result)
                return result
            },
            tabList () {
                let result = []
                const routeName = this.$route.name
                if (routeName === 'batchSet' ) {
                    result = this.tabListA
                }else {
                    result = []
                }
                return result
            },
            routerActived () {
                const routes = ['batchMy', 'batchList', 'batchSet', ]
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
            navData(){
                return {
                    router_list: this.router_list,
                    user_type: this.user_type,
                    nav_btn_path_name: 'batchImport',
                    nav_btn_name: '导入案件',
//                    placeholder:'请输入案件名称',
                }
            }
        },
        methods: {
            navSelect ( item, index) {
                this.$router.push({name:item.route_name,query:{index:item.value}})

            },
            openBatchImport(){
                this.batchData = {
                    visible:true
                }
            },

        },


    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>

</style>
