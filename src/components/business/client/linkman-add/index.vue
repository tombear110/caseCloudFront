<template>
    <el-dialog :title="isCreated===1 ? '新增联系人' :'编辑联系人'" :visible.sync="visible"  @close='closeDialog' width="650px" class="contract">
        <el-form ref="form" :model="form" :rules="rules"
                 v-loading="loading"
                 element-loading-text="拼命加载中"
                  label-width="80px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系电话" prop="mobile">
                        <el-input v-model="form.mobile"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="其他备注" prop="remark">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" v-model="form.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="" class="text-right">
                <el-button type="primary"  @click="onSubmit('form')">立即提交</el-button>
                <el-button type=""  v-if="title === '新增联系人' " @click="resetForm('form')" plain>重置
                </el-button>
                <el-button type=""  v-else @click="visible = false" plain>取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import { server_base_url } from 'common/config'

    export default {
        props: ['linkmanAdd', 'linkmanEdit'],
        data () {
            return {
                isCreated: '',
                loading: false,
                title: '',
                url: server_base_url,
                form: {
                    name: '',
                    mobile: '',
                    address: '',
                    email: '',
                    remark: ''
                },
                rules: {
                    name: [
                        { required: true, message: '必填项', trigger: 'blur' }
                    ],
                },
                addData: [],
                f_data: '',
                visible: false
//                edit_id:'',
            }
        },
        created () {
        },
        watch: {
            linkmanAdd (val) {
                this.isCreated = 1 //标记当前为新增状态
                this.visible = val.visible
                //在项目下面新建联系人，带上pr_id
                //在客户下面新建联系人，带上cl_id
                this.form.pr_id = val.pr_id
                this.form.cl_id = val.cl_id
            },

            linkmanEdit (val) {
                this.isCreated = 0//标记当前为编辑状态
                this.getEdit(val.code)
                this.visible = val.visible
            }
        },
        methods: {
            //关闭弹框的事件
            closeDialog () {
//                必须要清除dialog数据
                this.resetForm('form')
            },
            //huoqu 编辑详情
            getEdit (id) {
                this.loading = true
                this.$fetch.api_linkman.linkmanEdit(id)
                    .then(({
                               data
                           }) => {
                        this.loading = false
                        this.form = data
                    })
                    .catch(() => {
                        this.load_data = false
                    })
            },
            //提交表单
            onSubmit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return false
                    if (this.isCreated === 1) {
                        let submitForm = JSON.parse(JSON.stringify(this.form))
                        this.$fetch.api_linkman.linkmanStore(submitForm)
                            .then(({
                                       msg,
                                       data
                                   }) => {
                                this.form = {}
                                submitForm.id = data.id
                                this.$emit('refreshLinkmanAdd', submitForm)
                                this.visible = false
                            })
                    }else {
                        let submitForm = JSON.parse(JSON.stringify(this.form))
                        this.$fetch.api_linkman.linkmanPut(submitForm, submitForm.id)
                            .then(({
                                       msg
                                   }) => {
                                this.form = {}
                                this.$emit('refreshLinkmanEdit', submitForm)
                                this.visible = false
                            })
                    }

                })
            },
            //重置表单
            resetForm (formName) {
                this.$refs[formName].resetFields()
            }
        }

    }
</script>
