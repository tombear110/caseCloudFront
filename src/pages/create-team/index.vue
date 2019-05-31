<template>
    <div class="create-team">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  label-position="right"  label-width="90px">
            <div class="item-title">
                <div class="title-icon"></div>
                <div class="title-txt">团队信息</div>
            </div>
            <el-row :gutter="14">
                <el-col :span="14">
                    <el-form-item label="团队名称" prop="t_name">
                        <el-input v-model="ruleForm.t_name"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form-item label="法律需求" prop="service_id">
                        <el-select v-model="ruleForm.service_id" placeholder="请选择">
                            <el-option
                                v-for="item in serviceOptions"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="7">
                <el-col :span="7">
                    <el-form-item label="联系人" prop="contact_per">
                        <el-input v-model="ruleForm.contact_per"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="7">
                <el-col :span="7">
                    <el-form-item label="联系电话" prop="contact_phone">
                        <el-input v-model="ruleForm.contact_phone"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="7">
                <el-col :span="7">
                    <el-form-item label="联系邮箱" prop="contact_email">
                        <el-input v-model="ruleForm.contact_email"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="item-title">
                <div class="title-icon"></div>
                <div class="title-txt">单位信息</div>
            </div>
            <el-row :gutter="14">
                <el-col :span="14">
                    <el-form-item label="单位名称" prop="company">
                        <el-input v-model="ruleForm.company"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="所属行业" prop="industry_id">
                        <el-select v-model="ruleForm.industry_id" clearable placeholder="请选择">
                            <el-option
                                v-for="item in industryOptions"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="7">
                <el-col :span="7">
                    <el-form-item label="单位负责人" prop="legal_per">
                        <el-input v-model="ruleForm.legal_per"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="7">
                <el-col :span="7">
                    <el-form-item label="办公地址" prop="office_address">
                        <el-input v-model="ruleForm.office_address"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="7">
                <el-col :span="7">
                    <el-form-item label="单位主页" prop="company_www">
                        <el-input v-model="ruleForm.company_www"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="14">
                <el-col :span="14">
                    <el-form-item label="团队介绍" prop="t_des">
                        <el-input type="textarea" v-model="ruleForm.t_des" :rows="6"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="btn-wrap">
            <el-button type="primary"  round class="mg-top-20" @click="submitForm('ruleForm')" style="width: 105px;height: 36px;margin-left: 130px;">立即创建</el-button>
            <el-button  class="mg-top-20" round plain @click="backLastPage" style="width: 75px;height: 36px;">返回</el-button>
        </div>
        <group-tip :group-show="groupShow"></group-tip>
    </div>
</template>

<script>
    import store from 'store'
    import {mapActions} from 'vuex'
    import {SET_USER_INFO} from 'store/actions/type'
    import { filterFormData } from 'common/lib/common'
    import groupTip from 'components/dialog/groupTip.vue'

    export default {
        components: {
            groupTip
        },
        data () {
            return {
                groupShow: null,
                serviceOptions: [],
                industryOptions: [
                    {
                        id:1,
                        title:'律师事务所'
                    },
                    {
                        id:2,
                        title:'法务'
                    },
                ],
                ruleForm: {
                    t_name: '',
                    service_id: '',
                    contact_per: '',
                    contact_phone: '',
                    contact_email: '',
                    company: '',
                    industry_id: 1,
                    legal_per: '',
                    office_address:'',
                    company_www: '',
                    t_des: '',
                    add_uid: '',
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
                vInfo: null
            }
        },
        created () {
            this.vInfo = this.$store.state.v_info
            this.getCreateInfo()
            if (this.vInfo.type == 0) {
                setTimeout(() => {
                    this.groupShow = new Date().getTime()
                },  100)
            }
        },
        computed: {
            userData () {
                const user_info = store.state.user_info
                return user_info.user ? user_info.user : {}
            },
            teamId () {
                const user_info = store.state.user_info
                return user_info.user ? user_info.user.team_id : ''
            },
            teamIdCode () {
                const user_info = store.state.user_info
                return user_info.user ? user_info.user.team_id_code : ''
            }
        },
        methods: {
            ...mapActions({
                set_user_info: SET_USER_INFO,
            }),

            //获取创建团队所需的信息
            getCreateInfo () {
                this.$fetch.api_team.create()
                    .then(({
                               code,
                               data
                           }) => {
                        this.industryOptions = data.industry
                        this.serviceOptions = data.service
                        this.ruleForm = filterFormData(this.userData,this.ruleForm )
                    })
            },
            //更新团队信息
            submitForm (formName) {
                this.ruleForm.add_uid = this.userData.id
                this.$refs[formName].validate((valid) => {
                    if (!valid) return false
                    this.$fetch.api_team.save(this.ruleForm)
                        .then(({
                                   data,
                               }) => {
                            const user_info = store.state.user_info
                            user_info.user = data.user_info
                            this.set_user_info(user_info)
                            this.$router.push({name: 'teamManage'})
                        })
                })
            },
            backLastPage() {
                this.$router.go(-1)
            }
        }
    }
</script>
<style lang="scss">
.create-team{
    width: 100%;
    min-height: calc(100vh - 100px);
    background: #fff;
    margin-top: 30px;
    border-radius:6px;
    padding: 30px 20px;
    .el-input--small .el-input__inner{
        height: 36px;
        line-height: 36px;
    }
    .el-form-item__error{
        width: 100px;
        position: absolute;
        left: calc(100% + 46px);
        top: 8px;
        &::before{
            content: '';
            background: url('../../assets/images/warn.png') no-repeat;
            background-size: 100% 100%;
            width: 16px;
            height: 16px;
            position: absolute;
            left: -28px;
            top: 0;
        }
    }
    .item-title{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .title-icon{
            width: 5px;
            height: 20px;
            background: #ECB86C;
            border-radius: 3px;
        }
        .title-txt{
            font-size:16px;
            font-weight:400;
            color: #333;
            padding-left: 10px;
        }
    }
}
</style>
