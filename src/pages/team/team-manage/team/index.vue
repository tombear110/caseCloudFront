<template>
    <div class="user-info">
        <div class="tab-component">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===index}"
                    v-for="(item,index) in infoTab"
                    :key="item.text">
                    {{item.text}}
                </li>
            </ul>
        </div>
        <div class="user-table" >
            <ul class="list-group" v-show="!editToggle" v-loading="loading"
                element-loading-text="拼命加载中">
                <!--<li class="list-item">-->
                <!--<span class="item-label">所在律所：</span>-->
                <!--<div class="item-body">-->
                <!--<span style="display: inline-block;width: 300px" v-if="team_info.firm_id">{{team_info.firm_info.name}}</span>-->
                <!--&lt;!&ndash;<span class="text-danger cursor" v-else @click="openLawfirmDialog">加入律所</span>&ndash;&gt;-->
                <!--</div>-->
                <!--</li>-->
                <li class="list-item">
                    <span class="item-label">团队名称</span>
                    <div class="item-body">{{team_info.t_name}}</div>
                </li>
                <li class="list-item">
                    <span class="item-label">法律需求</span>
                    <div class="item-body">{{team_info.service_id_text}}</div>
                </li>
                <li class="list-item">
                    <span class="item-label">联系人</span>
                    <div class="item-body">{{team_info.contact_per}}</div>
                </li>
                <li class="list-item">
                    <span class="item-label">联系电话</span>
                    <div class="item-body">{{team_info.contact_phone}}</div>
                </li>
                <li class="list-item">
                    <span class="item-label">联系邮箱</span>
                    <div class="item-body">{{team_info.contact_email}}</div>
                </li>
                <li class="list-item">
                    <span class="item-label">单位名称</span>
                    <div class="item-body">{{team_info.company}}</div>
                </li>
                <li class="list-item">
                    <span class="item-label">所属行业</span>
                    <div class="item-body">{{team_info.industry}}</div>
                </li>
                <li class="list-item">
                    <span class="item-label">单位负责人</span>
                    <div class="item-body">{{team_info.legal_per}}</div>
                </li>
                <li class="list-item">
                    <span class="item-label">办公地址</span>
                    <div class="item-body">{{team_info.office_address}}</div>
                </li>
                <li class="list-item">
                    <span class="item-label">单位主页</span>
                    <div class="item-body">{{team_info.company_www}}</div>
                </li>
                <li class="list-item" style="min-width: 100%;">
                    <span class="item-label">团队介绍</span>
                    <div class="item-body">{{team_info.t_des}}</div>
                </li>
                <li style="min-width:100%;box-sizing:border-box;text-align: right;padding: 0 35px" v-if="editBtnShow">
                    <div class=" btn-round--yellow" @click="openTeamEdit(teamIdCode)">
                        修改信息
                    </div>
                </li>
            </ul>
        </div>
        <join-lawfirm :data="joinDialogData" @refreshData="refreshData"></join-lawfirm>
        <team-change :team-new="teamNew" :team-edit="teamEdit" @refreshTeamEdit="refreshTeamEdit"
                     @refreshTeamNew="refreshTeamNew"></team-change>
        <group-tip :group-show="groupShow"></group-tip>
    </div>
</template>

<script>
    import store from 'store'
    import {  mapActions, } from 'vuex'
    import { SET_USER_INFO } from 'store/actions/type'
    import { joinLawfirm, teamChange } from 'components'
    import groupTip from 'components/dialog/groupTip.vue'

    export default {
        components: {
            joinLawfirm, teamChange, groupTip
        },
        data () {
            return {
                teamNew: {},
                teamEdit: {},
                infoTab: [
                    {
                        text: '团队信息'
                    }
                ],
                tabActive: 0,
                joinDialogData: {},
                loadingForm: false,
                loading: false,
                editToggle: false,
                editBtnShow: false,
                team_info: {},
                service: [],
                industry: [],
                ruleForm: {
                    company: '',
                    add_uid: '',
                    industry_id: '',
                    legal_per: '',
                    company_www: '',
                    contact_per: '',
                    t_des: '',
                    t_name: '',
                    contact_email: '',
                    service_id: '',
                    reg_address: '',
                    office_address: '',
                    contact_phone: ''

                },
                rules: {
                    t_name: [
                        { required: true, message: '请输入团队名称', trigger: 'blur' }
                    ],
                    contact_per: [
                        { required: true, message: '请输入联系人', trigger: 'blur' }
                    ],
                    contact_phone: [
                        { required: true, message: '请输入联系电话', trigger: 'blur' }
                    ],
                    service_id: [
                        { required: true, message: '请选择其中一项' }
                    ]

                },
                groupShow: null
            }
        },
        created () {
            setTimeout(this.getTeamInfo(), 1000)

        },
        computed: {

            teamIdCode () {
                const user_info = store.state.user_info
                return user_info.user ? user_info.user.team_id_code : ''
            }
        },

        methods: {
            ...mapActions({
                set_user_info: SET_USER_INFO,

            }),
            openTeamEdit (code) {
                this.teamEdit = {
                    visible: true,
                    code: code
                }
            },
            openLawfirmDialog () {
                this.joinDialogData = { join_type: 2 }
            },

            refreshData (data) {
                if (data.isRefresh) {
                    this.getTeamInfo()
                }
            },
            refreshTeamEdit (val) {
                if (val) {
                    this.getTeamInfo()
                }
            },
            refreshTeamNew (val) {
//                if(val){
//                    this.getTeamInfo()
//                }
            },
            //查看团队页面
            getTeamInfo () {
                if (!this.teamIdCode) {return false}
                this.loading = true
                this.$fetch.api_team.teamId(this.teamIdCode)
                    .then(({
                               data
                           }) => {
                            this.team_info = data
                            this.loading = false
                            //根据团队创建人add_uid，判断是否显示修改信息
                            let userId = store.state.user_info.user.id
                            this.editBtnShow = userId === data.add_uid
                        }
                    )
                    .catch(({
                                msg
                            }) => {
                            this.loading = false
                        }
                    )
            },

//
        }
    }
</script>
