<template>
    <el-dialog :title="isCreated===1?'新增执行情况':'编辑执行情况'" width="800px" :visible.sync="visible" top="15vh"
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
                    <el-form-item prop="zx_date" label="申请执行日">
                        <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                        v-model="form.zx_date"
                                        style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="受理单位"  prop="unit">
                        <el-input v-model="form.unit">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="执行案号"prop="anhao">
                        <el-input v-model="form.anhao">
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
                    <el-form-item label="执行措施"  prop="type">
                        <el-select v-model="form.type" placeholder="请选择" style="width: 100%" filterable >
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
                <el-col :span="24">
                    <el-form-item label="执行请求" prop="require">
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容"
                                  v-model="form.require">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="履行情况" prop="remark">
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容"
                                  v-model="form.remark">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item class="text-right">
                        <el-button type="primary"  @click="onSubmit('form')">
                            立即提交
                        </el-button>
                        <el-button type=""  plain
                                   @click=" visible = false">取消
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>

    export default {
        props: ['executionEdit','executionAdd'],
        components: {

        },
        data () {
            return {
                caseOptions:[],
                typeOptions:[],
                statusOptions:[],
                loading: false,
                form: {},
                rules: {
                    type: [
                        { required: true, message: '必填项', trigger: 'change' }
                    ],
                    status: [
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
            executionEdit (val) {
                //选中当前案件
                this.caseOptions = val.caseOptions
                this.isCreated = 0
                this.visible = val.visible
                this.executionId = val.id
                this.editData(val)
            },
            //只会在新增的时候触发
            executionAdd (val) {
                this.isCreated = 1
                //选中当前案件
                this.caseOptions = val.caseOptions
                this.form.cid = val.caseId
                this.visible = val.visible
                this.createData()
            }
        },
        methods: {




            //提交表单后清除数据
            clearForm () {
                //必须要清除dialog数据
                this.resetForm('form')
            },
            closeDialog () {
                this.clearForm()
            },


            //创建
            createData () {
                this.loading = true
                this.$fetch.api_execution.create()
                    .then(({
                               data
                           }) => {
                        this.typeOptions = data.type_arr.map((item,index) =>{
                            return {value:index,label:item}
                        })
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
                this.$fetch.api_execution.edit(val.id)
                    .then(({
                               data
                           }) => {
                        this.typeOptions = data.type_arr.map((item,index) =>{
                            return {value:index,label:item}
                        })
                        this.statusOptions = data.status_arr.map((item,index) =>{
                            return {value:index,label:item}
                        })
                        this.form = {
                            zx_date:data.data.zx_date,
                            unit:data.data.unit,
                            anhao:data.data.anhao,
                            status:data.data.status,
                            type:data.data.type,
                            require:data.data.require,
                            remark:data.data.remark,
                        }
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
                console.log('this.form',this.form)
                if (this.isCreated === 1) {
                    this.$refs[formName].validate((valid) => {
                        if (!valid) return false
                        this.loading = true
                        this.$fetch.api_execution.store(this.form)
                            .then(({
                                       msg
                                   }) => {
                                this.$message.success(msg)
                                this.loading = false
                                this.$emit('executionRefresh', true)
                                this.visible = false
                            })
                            .catch(({
                                        msg
                                    }) => {
                            })
                    })
                } else {
                    this.$refs[formName].validate((valid) => {
                        if (!valid) return false
                        this.loading = true
                        this.$fetch.api_execution.change(this.form, this.executionId)
                            .then(({
                                       data,
                                       msg
                                   }) => {
                                this.$message.success(msg)
                                this.loading = false
                                this.$emit('executionRefresh', true)
                                this.visible = false
                            })
                            .catch(({
                                        msg
                                    }) => {
                            })
                    })
                }

            },

            //重置表单
            resetForm (formName) {
                this.$refs[formName].resetFields()
            }
        }

    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>
