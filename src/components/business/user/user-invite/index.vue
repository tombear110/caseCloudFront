<template>
    <el-dialog title="邀请成员" :visible.sync="visible" width="580px">
        <div style="margin-bottom: 40px">
            <div>
                <div class="mg-bottom-20">通过邮件邀请，下面输入被邀请人的电子邮件<span class="co-999">（剩余可邀请人数 <span
                    style="color: #ec5050;">{{leftNum}}</span> 人）</span></div>
                <el-input placeholder="发送邮件给小伙伴们" v-model="email">
                    <el-button slot="append" @click="sendEmail" icon="el-icon-message" :disabled="leftNum <= 0">发送邮件
                    </el-button>
                </el-input>
            </div>
            <el-table :data="inviteList" style="width: 100%;padding: 10px 0;font-size: 14px;" size="mini">
                <el-table-column prop="created_at" label="邀请时间" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{scope.row.created_at}}</span>
                        <span v-if="!scope.row.token_status">（{{scope.row.token_status_text}}）</span>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱">
                </el-table-column>
                <el-table-column prop="" label="操作" width="140">
                    <template slot-scope="scope">
                        <el-button type="text " @click="resendInvite(scope.row)" style="color: #9FA5B9">重新发送</el-button>
                        <span class="bar"></span>
                        <el-button type="text" class="text-danger" @click="recallInvite(scope.row)">撤回</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>
</template>

<script>
    import store from 'store'

    export default {
        props: ['inviteData'],
        data() {
            return {
                visible: false,
                inviteList: [],
                email: '',
                type: '',    //type=1表示律师邀请，type=2，表示行政邀请
                loading: false,
                leftNum: 0
            }
        },
        created() {

        },
        watch: {
            inviteData(val) {
                //根据type=1律师;type=2行政
                this.type = store.state.user_info.user.account_type === 2 ? 2 : 1
                if (val.type === 2) {
                    this.getInviteList()
                } else {
                    if (store.state.user_info.user.team_id) {
                        this.getInviteList()
                    } else {
                        this.$message.warning('请先创建或者加入某个团队')
                        return false
                    }
                }
                this.visible = val.visible

            }
        },
        methods: {
            sendEmail() {
                //简单的验证
                let emailValid = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
                if (!this.email) {
                    this.$message({
                        message: '请填写邮箱',
                        type: 'warning'
                    })
                    return false
                }
                if (this.email) {
                    if (!emailValid.test(this.email)) {
                        this.$message({
                            message: '邮箱格式不正确',
                            type: 'warning'
                        })
                        return false
                    }
                }
                this.$fetch.api_invitation.save(
                    {
                        email: this.email,
                        u_type: 1,
                        type: this.type
                    }
                )
                    .then(({
                               msg
                           }) => {
                        this.$message.success(msg)
                        //发送成功，清除输入框数据
                        this.email = ''
                        //刷新邀请数据
                        this.getInviteList()

                    })
                    .catch(({

                                msg
                            }) => {
                        this.$message.warning(msg)
                    })
            },
            recallInvite(item) {
                this.$fetch.api_invitation.del(item.id)
                    .then(
                        ({
                             msg
                         }) => {
                            this.$message.success(msg)
                            //刷新邀请数据
                            this.getInviteList()
                        }
                    )
                    .catch(({
                                msg
                            }) => {
                        this.$message.error(msg)
                    })

            },
            resendInvite(item) {
                this.$fetch.api_invitation.update(item.id)
                    .then(
                        ({
                             msg
                         }) => {
                            this.$message.success(msg)
                        }
                    )
                    .catch(({
                                msg
                            }) => {
                        this.$message.error(msg)
                    })
            },
            //邀请中的成员列表
            getInviteList() {
                this.loading = true
                this.$fetch.api_invitation.list(
                    {type: this.type}
                )
                    .then(
                        ({
                             data
                         }) => {
                            this.inviteList = data.data
                            this.leftNum = data.invite_limit
                            this.loading = false
                        }
                    )
                    .catch(({
                                code,
                                msg
                            }) => {
                        this.loading = false
                        this.$message.warning(msg)
                    })
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>
