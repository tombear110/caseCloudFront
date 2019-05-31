<template>
    <el-dialog :title="propertyId?'编辑财产保全':'新增财产保全'" width="800px" :visible.sync="visible" top="15vh"
               @close="closeDialog">
        <el-form ref="form" :model="form" :rules="rules" label-width="85px"
                 v-loading="loading"
                 element-loading-text="拼命加载中"
                 >
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="关联案件"  prop="cid">
                        <el-select v-model="form.cid" placeholder="请选择" style="width: 100%" disabled
                                   filterable >
                            <el-option
                                v-for="(item,index) in caseOptions"
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
                    <el-form-item label="申请人"  prop="applicant">
                        <el-input v-model="form.applicant">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="被申请人"  prop="respondent">
                        <el-input v-model="form.respondent">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item prop="cf_date" label="查封日期">
                        <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                        v-model="form.cf_date"
                                        style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="cf_d_date" label="查封到期日">
                        <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                        v-model="form.cf_d_date"
                                        style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item prop="xf_date" label="续封日期">
                        <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                        v-model="form.xf_date"
                                        style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="xf_d_date" label="续封到期日">
                        <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                        v-model="form.xf_d_date"
                                        style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="受理单位"prop="unit">
                        <el-input v-model="form.unit">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="承办人员"prop="judge">
                        <el-input v-model="form.judge">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="财产类型"  prop="p_type">
                        <el-select v-model="form.p_type" placeholder="请选择" style="width: 100%" filterable >
                            <el-option
                                v-for="(item,index) in typeOptions"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="裁定书编号" prop="cds_num">
                        <el-input placeholder="请输入内容"
                                  v-model="form.cds_num">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="保全金额" prop="bq_amount">
                        <el-input placeholder="请输入内容"
                                  v-model="form.bq_amount">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="执行状态"  prop="status">
                        <el-select v-model="form.status" placeholder="请选择" style="width: 100%" filterable >
                            <el-option
                                v-for="(item,index) in statusOptions"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容"
                                  v-model="form.remark">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="text-center">
                <el-button type="primary"  @click="onSubmit('form')">
                    立即提交
                </el-button>
                <el-button type=""  plain
                           @click=" visible = false">取消
                </el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
    import {filterFormData} from 'common/lib/common'
    export default {
        props: ['propertyEdit','propertyAdd'],
        components: {

        },
        data () {
            return {
                caseOptions:[],
                typeOptions:[],
                statusOptions:[],
                loading: false,
                form: {
                    applicant:'',
                    respondent:'',
                    cf_date:'',
                    cf_d_date:'',
                    xf_date:'',
                    xf_d_date:'',
                    unit:'',
                    judge:'',
                    p_type:'',
                    cds_num:'',
                    bq_amount:'',
                    status:0,
                    remark:'',
                },
                propertyId:'',
                rules: {
                    applicant: [
                        { required: true, message: '必填项', trigger: 'blur' }
                    ],
                    respondent: [
                        { required: true, message: '必填项', trigger: 'blur' }
                    ],
                    p_type: [
                        { required: true, message: '必填项', trigger: 'change' }
                    ],
                },
                visible: false,
                isCreated: 0
            }
        },
        created () {

        },

        watch: {

            //编辑出发
            propertyEdit (val) {
                //选中当前案件
                this.caseOptions = val.caseOptions
                this.visible = val.visible
                this.propertyId = val.id
                this.editData(val)
            },
            //只会在新增的时候触发
            propertyAdd (val) {
                //选中当前案件
                this.caseOptions = val.caseOptions
                this.form.cid = val.caseId
                this.visible = val.visible
                this.createData(val.caseId)
            }
        },
        methods: {
            //提交表单后清除数据
            clearForm () {
                //必须要清除dialog数据
                this.propertyId = ''
                this.resetForm('form')
            },
            closeDialog () {
                this.clearForm()
            },


            //创建
            createData (cid) {
                this.loading = true
                this.typeOptions = []
                this.statusOptions = []
                this.$fetch.api_property.create({cid:cid})
                    .then(({
                               data
                           }) => {
                        this.form.applicant = data.applicant
                        this.form.respondent = data.respondent
                        for (let i in data.p_type_arr) {
                            this.typeOptions.push(
                                { value: parseInt(i), label: data.p_type_arr[i] }
                            )
                        }
                        this.statusOptions = data.status_arr.map((item,index) =>{
                            return {value:index,label:item}
                        })
                        this.loading = false
                    })
                    .catch(({
                                msg
                            }) => {
                        this.loading = false
                    })
            },
            //编辑页基本数据
            editData (val) {
                this.loading = true
                this.$fetch.api_property.edit(val.id)
                    .then(({
                               data
                           }) => {
                        for (let i in data.p_type_arr) {
                            this.typeOptions.push(
                                { value: parseInt(i), label: data.p_type_arr[i] }
                            )
                        }
                        this.statusOptions = data.status_arr.map((item,index) =>{
                            return {value:index,label:item}
                        })
                        this.form = filterFormData(data.data,this.form)
                        this.form.cid = val.caseId
                        this.loading = false
                    })
                    .catch(({
                                msg
                            }) => {
                        this.loading = false
                    })
            },

            //提交表单
            onSubmit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return false
                    this.loading = true
                    this.$fetch.api_property.save(this.form,this.propertyId)
                        .then(({
                                   msg
                               }) => {
                            this.$message.success(msg)
                            this.loading = false
                            this.$emit('propertyRefresh', true)
                            this.visible = false
                        })
                        .catch(({
                                    msg
                                }) => {
                        })
                })
            },

            //重置表单
            resetForm (formName) {
                this.$refs[formName].resetFields()
                // this.$refs.upload.clearFiles()
            }
        }

    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>
