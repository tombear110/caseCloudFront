<template>
    <el-dialog :title="isCreated===1?'新增承办人员':'编辑承办人员'" width="800px" :visible.sync="visible" top="15vh"
               @close="closeDialog">
        <el-form ref="form" :model="form" :rules="rules" label-width="85px"
                 v-loading="loading"
                 element-loading-text="拼命加载中"
                 >
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="姓名"  prop="name">
                        <el-input v-model="form.name">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系方式"  prop="phone">
                        <el-input v-model="form.phone">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="科室"prop="class">
                        <el-input v-model="form.class">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="职务"prop="job">
                        <el-input v-model="form.job">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="联系地址" prop="address">
                        <el-input v-model="form.address">
                        </el-input>
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
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item class="text-center">
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
        props: ['judgeEdit','judgeAdd'],
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
                    name: [
                        { required: true, message: '必填项', }
                    ],
                },
                visible: false,
                isCreated: 0,
                judgeId:'',
            }
        },
        created () {

        },

        watch: {

            //编辑出发
            judgeEdit (val) {
                this.isCreated = 0
                this.visible = val.visible
                this.judgeId = val.id
                this.editData(val)
            },
            //只会在新增的时候触发
            judgeAdd (val) {
                this.isCreated = 1
                this.form.cid = val.caseId
                this.visible = val.visible
            }
        },
        methods: {

            closeDialog () {
                Object.assign(this.$data, this.$options.data())
            },

            //编辑页基本数据
            editData (val) {
                this.loading = true
                this.$fetch.api_judge.edit(val.id)
                    .then(({
                               data
                           }) => {
                        this.form = {
                            name:data.name,
                            phone:data.phone,
                            class:data.class,
                            job:data.job,
                            address:data.address,
                            remark:data.remark,
                        }
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
                if (this.isCreated === 1) {
                    this.$refs[formName].validate((valid) => {
                        if (!valid) return false
                        this.loading = true
                        this.$fetch.api_judge.store(this.form)
                            .then(({
                                       msg
                                   }) => {
                                this.$message.success(msg)
                                this.loading = false
                                this.$emit('judgeRefresh', true)
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
                        this.$fetch.api_judge.change(this.form, this.judgeId)
                            .then(({
                                       data,
                                       msg
                                   }) => {
                                this.$message.success(msg)
                                this.loading = false
                                this.$emit('judgeRefresh', true)
                                this.visible = false
                            })
                            .catch(({
                                        msg
                                    }) => {
                            })
                    })
                }

            },
        }

    }
</script>
