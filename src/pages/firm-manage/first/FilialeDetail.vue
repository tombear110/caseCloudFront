<template>
    <div class="filiale-detail" style="padding: 0;overflow: visible">
        <h3>{{name}}分所</h3>
        <el-row :gutter="20">
            <el-col :span="12">
                <router-view></router-view>
                <router-view name="team"></router-view>
            </el-col>
            <el-col :span="12">
                <router-view name="member"></router-view>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import store from 'store'

    export default {
        data () {
            return {
                teamId: store.state.user_info.user.team_id,
                keyword: '',
                tabActive: '',
                name: this.$route.query.name,
                linkList: [
                    {
                        text: '分所信息',
                        routeName: 'filiale_info'
                    }, {
                        text: '行政人员列表',
                        routeName: 'filiale_staff'
                    }, {
                        text: '律师列表',
                        routeName: 'filiale_lawyer'
                    }
                ]
            }
        },
        watch: {},
        created () {
            this.tabClassActive()
        },
        methods: {
            //根据路由显示相应的active-class
            tabClassActive () {
                const routeName = this.$route.name
                switch (routeName) {
                    case 'filiale_info':
                        this.tabActive = 0
                        break
                    case 'filiale_staff':
                        this.tabActive = 1
                        break
                    case 'filiale_lawyer':
                        this.tabActive = 2
                        break
                }
            },
            //点击去相应的页面
            goLink (item, index) {
                this.tabActive = index
                this.$router.push({ name: item.routeName, query: { firm_id: this.$route.query.firm_id } })
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>
