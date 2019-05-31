<template>
    <el-dialog title="团队信息" :visible.sync="visible" width="640px">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  label-position="right"
                 v-loading="loadingForm"
                 element-loading-text="拼命加载中"
                 label-width="90px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="团队名称" prop="t_name">
                        <el-input v-model="ruleForm.t_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
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
                <el-col :span="12">
                    <el-form-item label="联系人" prop="contact_per">
                        <el-input v-model="ruleForm.contact_per"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系电话" prop="contact_phone">
                        <el-input v-model="ruleForm.contact_phone"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系邮箱" prop="contact_email">
                        <el-input v-model="ruleForm.contact_email"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="单位名称" prop="company">
                        <el-input v-model="ruleForm.company"></el-input>
                    </el-form-item>
                </el-col>
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
                <el-col :span="12">
                    <el-form-item label="单位负责人" prop="legal_per">
                        <el-input v-model="ruleForm.legal_per"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="办公地址" prop="office_address">
                        <el-input v-model="ruleForm.office_address"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="单位主页" prop="company_www">
                        <el-input v-model="ruleForm.company_www"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="团队介绍" prop="t_des">
                        <el-input type="textarea" v-model="ruleForm.t_des" :rows="6"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="text-right">
                <el-button type="primary"  class="mg-top-20" @click="submitForm('ruleForm')">{{submitText}}
                </el-button>
                <el-button  class="mg-top-20" @click="visible = false" plain>返回</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
    import store from 'store'
    import {mapActions} from 'vuex'
    import { filterFormData } from 'common/lib/common'
    export default {
        components: {},
        props: ['teamEdit', 'teamNew'],
        data () {
            return {
                visible: false,
                submitText:'',
                loadingForm: false,
                teamIdCode: '',
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

                }
            }
        },
        watch: {
            teamEdit (val) {
                this.getEditInfo(val.code)
                this.teamIdCode = val.code
                this.visible = val.visible
            },

        },
        computed: {
            userData () {
                const user_info = store.state.user_info
                return user_info.user ? user_info.user : {}
            }
        },
        methods: {
            //编辑团队之前，获取团队信息
            getEditInfo (code) {
                this.submitText = '确认修改'
                this.loadingForm = true
                this.$fetch.api_team.teamEdit(code)
                    .then(({
                               data: {
                                   industry,
                                   service,
                                   team_info
                               }
                           }) => {
                        this.serviceOptions = service
                        this.ruleForm = filterFormData(team_info,this.ruleForm )
                        this.loadingForm = false
                    })
                    .catch(({
                                msg
                            }) => {
                        this.loadingForm = false
                    })
            },

//            更新团队信息
            submitForm (formName) {

                this.ruleForm.add_uid = this.userData.id
                let submitForm = JSON.parse(JSON.stringify(this.ruleForm))
                if (!submitForm.industry_id){
                    submitForm.industry_id = 0
                }
                delete submitForm.create_user
                delete submitForm.industry
                delete submitForm.firm_info
                delete submitForm.service
                this.$refs[formName].validate((valid) => {
                    if (!valid) return false
                    this.$fetch.api_team.save(submitForm, this.teamIdCode)
                        .then(({
                                   data,
                                   msg
                               }) => {
                            this.$emit('refreshTeamEdit', true)
                            this.visible = false
                        })

                })
            }
        }
    }
</script>
