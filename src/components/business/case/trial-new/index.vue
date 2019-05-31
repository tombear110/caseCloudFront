<template>
    <el-dialog :title="!trialId?'添加庭审记录':'编辑庭审记录'" width="800px" :visible.sync="visible" top="5vh"
               @close="closeTrialDialog">
        <el-form :model="trialForm" :rules="trialRules" ref="trialForm"  label-width="80px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item prop="start_time" label="开庭日期">
                        <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                        v-model="trialForm.start_time"
                                        style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="开庭类型" prop="type">
                        <el-select v-model="trialForm.type" placeholder="请选择" style="width: 100%" filterable>
                            <el-option
                                v-for="(item,index) in typeOptions"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="出庭律师"   prop="lawyers">
                        <el-select v-model="trialForm.lawyers" placeholder="请选择" style="width: 100%" multiple collapse-tags filterable>
                            <el-option
                                v-for="(item,index) in lawyersOptions"
                                :key="index"
                                :label="item.real_name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="开庭地址" prop="address">
                        <el-input  v-model="trialForm.address"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="争议焦点" prop="arguments">
                        <el-input type="textarea"  :autosize="{ minRows: 2, maxRows: 5}" v-model="trialForm.arguments"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="我方意见" prop="mine_view">
                        <el-input type="textarea"  :autosize="{ minRows: 3, maxRows: 5}" v-model="trialForm.mine_view"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="对方意见" prop="other_view">
                        <el-input type="textarea"  :autosize="{ minRows: 3, maxRows: 5}" v-model="trialForm.other_view"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="法官态度" prop="judge_view">
                        <el-input type="textarea"  :autosize="{ minRows: 3, maxRows: 5}" v-model="trialForm.judge_view"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="庭审总结" prop="summary">
                        <el-input type="textarea"  :autosize="{ minRows: 3, maxRows: 5}" v-model="trialForm.summary"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="text-center">
                <el-button type="primary"  @click="submitForm('trialForm')">立即提交</el-button>
                <el-button  @click="visible = false">取消</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>

    export default {
        props: ['trialAdd','trialEdit'],
        components: {

        },
        data () {
            return {
                lawyersOptions: [],
                typeOptions:[
                    {value:1,label:'证据交换'},
                    {value:2,label:'庭前调解'},
                    {value:3,label:'正式审理'},
                    {value:0,label:'其他'},
                ],
                trialForm: {
                    start_time: '',
                    type: '',
                    lawyers:[],
                    address: '',
                    arguments: '',
                    mine_view: '',
                    other_view: '',
                    judge_view: '',
                    summary: '',
                },
                trialRules: {
                    start_time: [
                        { required: true, message: '必选项', trigger: 'change' }
                    ],
                    lawyers: [
                        { required: true, message: '必选项', trigger: 'change' }
                    ],
                },
                visible: false,
                trialId:'',
            }
        },

        watch: {

            //编辑出发
            trialEdit (val) {
                this.visible = val.visible
                this.trialId = val.id
                this.editData(val.id)
            },
            //只会在新增的时候触发
            trialAdd (val) {
                this.visible = val.visible
                this.trialForm.cid = val.caseId
                this.createData()
            }
        },
        methods: {

            //打开弹窗，获取创建表单所需数据
            createData () {
                this.$fetch.api_trial.create()
                    .then(
                        ({
                             data
                         }) => {
                            this.lawyersOptions = data.team_lawyers
                        }
                    )
            },

            closeTrialDialog () {
                Object.assign(this.$data, this.$options.data())
            },


            //编辑页基本数据
            editData (val) {
                this.$fetch.api_trial.edit(val)
                    .then(
                        ({
                             data
                         }) => {
                            this.lawyersOptions = data.team_lawyers
                            this.trialForm = {
                                start_time: data.data.start_time,
                                type: data.data.type,
                                lawyers: data.data.lawyers.split(',').map(item=>parseInt(item)),
                                address: data.data.address,
                                arguments: data.data.arguments,
                                mine_view: data.data.mine_view,
                                other_view: data.data.other_view,
                                judge_view: data.data.judge_view,
                                summary: data.data.summary,
                            }
                        }
                    )
            },

            //提交表单
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {return false}
                    this.$fetch.api_trial.save(this.trialForm,this.trialId)
                        .then(
                            ({
                                 data, msg
                             }) => {
                                this.visible = false
                                this.$emit('trialRefresh',true)
                            }
                        )
                })
            },
        }
    }
</script>
