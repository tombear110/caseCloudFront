<template>
    <div class="firm-info mg-left-20">
        <div class="tab-component mg-left-15 mg-right-15">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===index}"
                    v-for="(item,index) in infoTab"
                    :key="item.text">
                    {{item.text}}
                </li>
            </ul>
            <div class="suffix-item">
                <div class="cursor text-light-4" @click="openInviteDialog">
                    <i class="iconfont  icon-tianjia ft-14 mg-right-5"></i>
                    <span>添加行政人员</span>
                </div>
            </div>
        </div>
        <!--表格-->
        <div class="firm-table-2">
            <el-table :data="tableData"  v-loading="loading"
                      element-loading-text="拼命加载中" header-row-class-name="case_table" style="width: 100%;padding: 0 15px">
                <el-table-column prop="real_name" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱账号" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="mobile" label="联系电话" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="created_at" label="加入时间" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="doc" label="权限">
                    <template slot-scope="scope">
                        <el-tag  v-if="scope.row.type === 1">普通权限</el-tag>
                        <el-tag  v-if="scope.row.type === 2">高级权限</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="freezeAccount(scope.row)">冻结</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--新增行政人员-->
        <user-invite :invite-data="inviteData"></user-invite>
    </div>

</template>
<script>
    import {
        page
    } from 'components'
    import store from 'store'
    import {
        server_base_url
    } from 'common/config'
    import { userInvite } from 'components'
    export default {
        components: {
            page,
            userInvite
        },
        data () {
            return {
                inviteData: {},
                tabActive: 0,
                infoTab: [
                    {
                        text: '行政人员列表'
                    }
                ],
                loading: false,
                auth: 1,
                code: this.$route.query.code,
                tableData: [],
                dataAll: [],
                dataZz: [],
                dataLz: [],
                degrees: ['待办', '已办'],
                record_arr: [],
                mytoken: store.state.user_info.token,
                url: server_base_url,
                mydata: store.state.case_info,
                tabList: [
                    {
                        text: '全部成员'
                    },
                    {
                        text: '在职成员'
                    },
                    {
                        text: '离职成员'
                    }
                ],
                clickLi: 0,
                myCal: '',
                addData: {},
                recordData: '',
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                params: {
                    hstatus: '',
                    linkid: parseInt(this.$route.query.id),
                    type: 1
                },
                from_int: this.$route.query.g_status,
                timeCost: '',
                moneyCost: ''
            }
        },
        created () {
            this.getList()
        },

        methods: {
            openInviteDialog () {
                this.inviteData = {
                    visible: true,
                    type:2,//表示律所行政邀请
                }
            },
            //获取行政人员列表
            getList () {
                this.loading = true
                let firmId = store.state.user_info.user.firm_id
                this.$fetch.api_firm.accountList(
                    {
                        firm_id: firmId,
                        account_type: 2
                    }
                )
                    .then(({ data }) => {
                        this.loading = false
                        this.dataAll = data
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].status === 1) {
                                this.dataZz.push(data[i])
                            } else {
                                this.dataLz.push(data[i])
                            }
                        }
                        this.tableData = this.dataAll
                        console.log('this.tableData---', this.tableData)
                    })
                    .catch(msg => {
                        this.loading = false
                    })
            },
            freezeAccount (row) {
                this.$fetch.api_team.AccountFreeze(
                    {
                        id: row.id,
                        status: 0
                    }
                )
                    .then(
                        ({
                             data,
                             msg
                         }) => {
                            this.$message.success(msg)
                        }
                    )
                    .catch(({
                                code,
                                msg
                            }) => {

                    })
            }
        }

    }

</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>
