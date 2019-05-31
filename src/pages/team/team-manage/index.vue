<template>
    <div class="">
        <div class="wrap">
            <div class="left-box">
                <router-view></router-view>
            </div>
            <div class="right-box" style="flex: 1.5">
                <router-view name="memberList" v-if="teamId"></router-view>
            </div>
        </div>
        <el-dialog
            title="团队邀请"
            :visible.sync="teamVisible"
            width="600px">
            <ul class="text-center">
                <li class="mg-bottom-20">
                    <span class="ft-20 text-info">{{teamName}}</span>
                    <span class="co-666 ft-14">邀请您加入团队</span>
                </li>
                <li>
                    <el-button type="primary" size="small" @click="joinTeam">加入团队</el-button>
                    <el-button size="small" @click="refuseTeam">忽略</el-button>
                </li>
            </ul>
        </el-dialog>
    </div>

</template>

<script>
    import store from 'store'
    import {mapActions} from 'vuex'
    import {SET_USER_INFO} from 'store/actions/type'

    export default {
        data() {
            return {
                visible: false,
                teamVisible: false,
                teamName: this.$route.query.teamName,
                user_info: store.state.user_info.user
            }
        },
        created() {
            this.showInviteDialog()
        },
        computed: {
            teamId() {
                const user_info = store.state.user_info
                return user_info.user ? user_info.user.team_id : ''
            },
        },

        watch: {},
        methods: {
            ...mapActions({
                set_user_info: SET_USER_INFO,
            }),
            //团队邀请
            showInviteDialog() {
                let teamToken = this.$route.query.teamToken
                if (teamToken) {
                    this.teamVisible = true
                }
            },
            refuseTeam(){
                this.$router.push({name: 'calendar'})
            },
            //加入团队
            joinTeam() {
                let teamToken = this.$route.query.teamToken
                this.$fetch.api_team.teamAgree(
                    {token: teamToken,}
                )
                    .then(
                        ({
                             msg,
                             data
                         }) => {
                            //存储团队状态
                            let base = store.state.user_info
                            this.$set(base.user, 'team_id', data.user_info.team_id)
                            this.$set(base.user, 'team_id_code', data.user_info.team_id_code)
                            this.set_user_info(base);
                            this.teamVisible = false
                        }
                    )
            },



        }
    }
</script>

