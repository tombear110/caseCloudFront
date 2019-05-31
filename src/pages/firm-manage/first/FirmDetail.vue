<template>
    <el-row>
        <el-col :span="12">
            <router-view></router-view>
            <router-view name="manageList"></router-view>
        </el-col>
        <el-col :span="12">
            <router-view name="staffList"></router-view>
        </el-col>
    </el-row>
</template>


<script>
    import store from 'store'
    import { mapActions } from 'vuex'
    import { SET_USER_INFO } from 'store/actions/type'

    export default {
        data () {
            return {
                visible: false,
                successVisible: false,
                teamVisible: false,
                team_name: this.$route.query.team_name,
                user_info: store.state.user_info.user
            }
        },
        created () {
            this.inActive()
            this.showInviteDialog()
        },
        computed: {
            teamId () {
                const user_info = store.state.user_info
                return user_info.user ? user_info.user.team_id : ''
            }
        },

        watch: {},
        methods: {
            ...mapActions({
                set_user_info: SET_USER_INFO
            }),
            showInviteDialog () {
                let teamToken = this.$route.query.teamToken
                if (teamToken) {
                    this.teamVisible = true
                }
            },
            //加入团队
            joinTeam () {
                let teamToken = this.$route.query.teamToken
                this.$fetch.api_team.teamAgree(
                    { token: teamToken }
                )
                    .then(
                        ({
                             msg,
                             data
                         }) => {
//                            console.log('data---')
                            this.$message.success(msg)
                            //存储团队状态
                            let base = store.state.user_info
                            this.$set(base.user, 'team_id', data.user_info.team_id)
                            this.$set(base.user, 'team_id_code', data.user_info.team_id_code)
                            this.set_user_info(base)
                            this.teamVisible = false
                        }
                    )
                    .catch(({
                                msg
                            }) => {
//                        this.$message.success(msg)
                    })
            },

            inActive () {
                let token = this.$route.query.token
                if (!token) {return false}
                this.$fetch.api_user.checkActive({ token: token })
                    .then(({
                               msg,
                               data
                           }) => {
                        this.$message.success('youxiang验证成功')
                        this.successVisible = true
                        //存储激活状态
                        let base = store.state.user_info
                        this.$set(base.user, 'active', 1)
                        this.set_user_info(base)
                        this.$router.push({ name: 'user_info' })
                    })
                    .catch(({
                                code,
                                msg
                            }) => {
                        this.$message.warning(msg)
                        setTimeout(this.$router.push({
                            name: 'user_info',
                            query: { emailActive: 1 }
                        }), 500)
                    })

            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>
