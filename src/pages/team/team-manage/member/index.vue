<template>
    <div class="user-team">
        <div class="tab-component  mg-bottom-5">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===index}"
                    v-for="(item,index) in infoTab"
                    @click="changeTab(index)"
                    :key="item.text">
                    {{item.text}}
                </li>
            </ul>
            <div class="btn-round " @click="openInviteDialog">
                <i class="iconfont  icon-xinjian  "></i>
                <span>邀请新成员</span>
            </div>
        </div>
        <el-table :data="userList" class="user-table"
                  :show-header="true"
                  header-row-class-name="my-header"
                  stripe
                  row-class-name="member-row"
                  v-if="teamId">
            <el-table-column prop="type_text" label="姓名" width="100">
                <template slot-scope="scope">
                    <img class="avatar" :src="scope.row.img_path"/>
                </template>
            </el-table-column>
            <el-table-column prop="real_name" width="120" label="" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="mobile" label="电话" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="caseCount" width="100" label="案件数量">
                <template slot-scope="scope">
                   <span>{{scope.row.caseCount}}件</span>
                </template>
            </el-table-column>
            <el-table-column prop="type_text" label="权限" width="150">
                <template slot-scope="scope">
                    <el-popover
                        placement="bottom"
                        trigger="click"
                        popper-class="member-popover"
                        v-if="scope.row.status === 1 && isAddUser && !scope.row.isAddUser"
                        >
                        <ul class="list-group">
                            <li class="item " v-for="(item,index) in rightsOptions" :key="index"
                                @click="rightsSet(scope.row.id,item.value)">
                                <span class="el-radio__input" :class="scope.row.type===2   ? 'is-checked' :''"
                                      v-if="item.value===2">
                                      <i class=" el-radio__inner"></i>
                                </span>
                                <span class="el-radio__input" :class="scope.row.type===1  ? 'is-checked' :''"
                                      v-else>
                                            <i class=" el-radio__inner"></i>
                                </span>
                                <span class="ft-14" v-if="item.value === 2"
                                      :class="scope.row.type===2  ? 'text-link' :''">{{item.label}}</span>
                                <span class="ft-14 " v-else
                                      :class="scope.row.type===1  ? 'text-link' :''">{{item.label}}</span>
                            </li>
                        </ul>
                        <div slot="reference">
                            <span class=" text-link" v-if="scope.row.isAddUser" style="color: #ECB86C;">管理员</span>
                            <div class="btn-rights" v-else>
                                <span class=" text-link " v-if="scope.row.type===2" style="color: #ECB86C;">高级权限</span>
                                <span class="" v-else>普通权限</span>
                                <i class="iconfont icon-jiantou-copy-copy ft-12"></i>
                            </div>
                        </div>
                    </el-popover>
                    <div v-else>
                        <span class=" text-link" v-if="scope.row.isAddUser" style="color: #ECB86C;">管理员</span>
                        <div v-else>
                            <span class=" text-link " v-if="scope.row.type===2" style="color: #ECB86C;">高级权限</span>
                            <span class="" v-else>普通权限</span>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="" label="使用情况" width="100">
                <template slot-scope="scope">
                    <div class="btn-text" v-if="scope.row.status === 1">正常使用</div>
                    <div class="btn-text" v-if="scope.row.status === 0">暂停使用</div>
                    <span class="btn-plain btn-danger"
                          v-if="scope.row.status === 1 && isAddUser && !scope.row.isAddUser"
                          @click="accountFreeze(scope.row,0)">
                        停用
                    </span>
                    <span class="btn-plain-text " v-if="scope.row.status === 1 && !isAddUser || scope.row.isAddUser">
                       正常使用
                    </span>
                    <span class="btn-plain btn-info" v-if="scope.row.status === 0 && isAddUser"
                          @click="accountFreeze(scope.row,1)">
                        恢复
                    </span>
                    <span class="btn-plain-text " v-if="scope.row.status === 0 && !isAddUser">
                       暂停使用
                    </span>

                </template>
            </el-table-column>
        </el-table>
        <div class="user-icon" v-else>
            <i class="iconfont icon-jrtd"></i>
            <div>
                创建或加入团队后，可邀请其他成员加入
            </div>
        </div>
        <user-invite :invite-data="inviteData"></user-invite>
    </div>
</template>

<script>
    import store from 'store'
    import {img_url} from 'common/config'
    import {userInvite} from 'components'
    import userImg from 'assets/images/user.png'

    export default {
        components: {
            userInvite
        },
        data() {
            return {
                userImg: userImg,
                rightsOptions: [
                    {
                        label: '普通权限',
                        text: '仅管理自身案件',
                        value: 1
                    },
                    {
                        label: '高级权限',
                        text: '可查看、管理所有案件',
                        value: 2
                    }
                ],
                inviteData: {},
                infoTab: [
                    {text: '成员列表', value: 1},
                    {text: '历史成员', value: 0}
                ],
                tabActive: 0,
                add_uid: store.state.user_info.user.add_uid,
                user_id: store.state.user_info.user.id,
                rights_type: '',
                img_url: img_url,
                allMemberList: []

            }
        },
        created() {

            setTimeout(this.getMemberList(), 500)
        },
        computed: {
            teamId() {
                const user_info = store.state.user_info
                return user_info.user ? user_info.user.team_id : ''
            },
            userId() {
                const user_info = store.state.user_info
                return user_info.user ? user_info.user.id : ''
            },
            userType() {
                const user_info = store.state.user_info
                return user_info.user ? user_info.user.type : ''
            },
            isAddUser() {
                const userId = store.state.user_info.user.id
                let id = -1
                this.allMemberList.forEach(item => {
                    if (item.isAddUser) {
                        id = item.id
                    }
                })
                return id === userId
            },
            userList() {
                let temp = []
                if (this.tabActive === 0) {
                    //成员列表
                    for (let i = 0; i < this.allMemberList.length; i++) {
                        if (this.allMemberList[i].status === 1) {
                            temp.push(this.allMemberList[i])
                        }
                    }
                } else {
                    //历史列表
                    for (let i = 0; i < this.allMemberList.length; i++) {
                        if (this.allMemberList[i].status === 0) {
                            temp.push(this.allMemberList[i])
                        }
                    }
                }
                return temp
            }
        },
        watch: {
            teamId(val) {
                if (val) {
                    this.getMemberList()
                }
            }
        },
        methods: {
            changeTab(index) {
                this.tabActive = index
            },
            openInviteDialog() {
                this.inviteData = {
                    visible: true
                }
            },
            //权限设置
            rightsSet(id, type) {
                this.$fetch.api_team.setRights(
                    {id: id, type: type}
                )
                    .then(
                        ({
                             msg
                         }) => {
                            for (let i = 0; i < this.allMemberList.length; i++) {
                                if (id === this.allMemberList[i].id) {
                                    this.allMemberList[i].type = type
                                }
                            }
                        }
                    )
            },
            //冻结，解冻模板；
            handleFreeze(id, status) {
                this.$fetch.api_team.AccountFreeze(
                    {id: id, status: status}
                    )
                    .then(
                        ({
                             data,
                             msg
                         }) => {
                            //更新列表显示：
                            //1.改变当成员的status
                            for (let i = 0; i < this.allMemberList.length; i++) {
                                if (this.allMemberList[i].id === id) {
                                    this.allMemberList[i].status = status
                                }
                            }

                        }
                    )
            },
            //冻结账号
            accountFreeze(item, status) {
                if (status === 0) {
                    this.$confirm('停用后该账号将被立即冻结并不可登录系统进行操作，解冻账号使用请在历史成员列表恢复, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        cancelButtonClass: 'is-plain'
                    })
                        .then(() => {
                            this.handleFreeze(item.id, status)
                        })
                        .catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                            })
                        })
                } else {
                    this.handleFreeze(item.id, status)
                }

            },

            //获取成员列表
            getMemberList() {
                if (!store.state.user_info.user.team_id) {return false}
                this.$fetch.api_team.memberList()
                    .then(
                        ({
                             data
                         }) => {
                            this.allMemberList = data.map(item=>{
                                if (item.img_path){
                                    item.img_path = item.img_path.substr(0, 4) === 'http' ? item.img_path: `${this.img_url}${item.img_path}`
                                }else{
                                      item.img_path = this.userImg
                                }
                                return item

                            })

                        }
                    )
            }
        }
    }
</script>
<style lang="scss" scoped>
    .avatar {
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 1px solid #e1e4ee;
    }

</style>
