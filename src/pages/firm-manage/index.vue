<template>
    <div class="page-main">
        <router-view :key="key"></router-view>
    </div>
</template>

<script type="text/javascript">

    import store from 'store'

    export default {
        components: {
        },
        data () {
            return {
                routerOptions: [{
                    title: '律所信息',
                    route_name: 'firm_detail',
                    selectOptions: [],
                    auth: false
                }, {
                    title: '分所列表',
                    route_name: 'filiale_list',
                    selectOptions: [],
                    auth: false
                },],
                user_type: store.state.user_info.user.type,
                router_arr: [{
                    title: '律所信息',
                    route_name: 'firm_info',
                    auth: false
                }, {
                    title: '律师列表',
                    route_name: 'lawyer_list',
                    auth: false
                }, {
                    title: '分所列表',
                    route_name: 'filiale_list',
                    auth: false
                }, {
                    title: '行政人员列表',
                    route_name: 'staff_list',
                    auth: false
                }, {
                    title: '审核组管理',
                    route_name: 'auditor_list',
                    auth: false
                }]
            }
        },
        computed: {
            routerActived () {
                const routes = ['firm_info', 'filiale_list',]
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
                return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date()
            },
            navData () {
                //第一次注册就直接进入当前页时，不存在firm_info
                let fid = ''
                if ( store.state.user_info.user.firm_info){
                    fid = store.state.user_info.user.firm_info.fid
                }
                let routerList = []
                console.log('fid',fid)
                if (fid) {
                    this.router_arr[2] = {
                        title: '总所信息',
                        route_name: 'parent_firm',
                        auth: false
                    }
                    routerList = this.router_arr
//                    console.log('routerList',routerList)
                } else {
                    routerList = this.router_arr
                }
                return {
                    router_list: routerList,
                    user_type: this.user_type
                }
            }
        },
        methods: {
            //去我的项目/团队项目
            jumpItem (item, index) {
                this.isSelected = ''
                this.$router.push({ name: item.route_name })
            },
            //细分页面
            navSelect (item, index) {
                this.isSelected = index
                this.$router.push({ name: item.route_name, query: { index: index } })
            },
        },


    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>
