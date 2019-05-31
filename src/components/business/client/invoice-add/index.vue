<template>
    <el-dialog :title="isCreated===1?'新建发票':'编辑发票'" :visible.sync="visible" @close='closeDialog' width="650px"
               class="contract">
        <el-form ref="form" :model="form" :rules="rules"
                 v-loading="loading"
                 element-loading-text="拼命加载中"
                 label-width="90px" class="mxw-600">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="发票抬头" prop="title">
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="发票类型" prop="type">
                        <el-select v-model="form.type" placeholder="请选择">
                            <el-option label="增值税专用" :value="1"></el-option>
                            <el-option label="增值税普通" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="发票日期" prop="date">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.date"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        @change="on_date"
                                        :editable="false"
                                        :clearable="false"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="发票金额" prop="money">
                        <el-input v-model="form.money">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="发票申请人" prop="apply_uid">
                        <el-select v-model="form.apply_uid" placeholder="请选择" filterable clearable>
                            <el-option
                                v-for="item in apply_uid_arr"
                                :key="item.id"
                                :label="item.real_name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所属项目" prop="pr_id">
                        <el-select v-model="form.pr_id" placeholder="请选择" filterable clearable
                                   :disabled="routeName==='projectCode'">
                            <el-option
                                v-for="item in project_arr"
                                :key="item.id"
                                :label="item.pr_name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="上传附件" prop="file_tem_ids">
                        <el-upload
                            class="upload-demo"
                            ref="upload"
                            :action=uploadUrl()
                            :headers=header()
                            :before-upload="beforeAvatarUpload"
                            :on-remove="handleRemove"
                            :on-success="successBack"
                            name='cfile'
                            :file-list="isUpList"
                        >
                            <el-button slot="trigger" type="primary">选取文件</el-button>
                            <span slot="tip" class="el-upload__tip mal-10">上传的文件不能超过10M</span>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="备注" prop="mark">
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容"
                                  v-model="form.mark" class="max-width-500">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="text-right">
                <el-button type="primary" @click="onSubmit('form')">立即提交</el-button>
                <el-button type="" v-if="title === '新建发票' " @click="resetForm('form')" plain>重置</el-button>
                <el-button type="" v-else @click="visible = false" plain>取消</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
    import store from 'store'
    import {mapGetters, mapActions} from 'vuex'
    import {server_base_url} from 'common/config'

    export default {
        props: ['invoiceAdd', 'invoiceEdit'],
        data() {
            return {
                routeName: this.$route.name,
                isCreated: 0,
                loading: false,
                title: '',
                url: server_base_url,
                project_arr: [],
                visible: false,
                apply_uid_arr: [],
                addData: [],
                isUpList: [],
                cl_name: '',
                cl_id: '',
                form: {
                    title: '',
                    type: 1,
                    date: '',
                    money: '',
                    apply_uid: '',
                    pr_id: '',
                    mark: '',
                    file_tem_ids: []
                },
                current_status: 0,

                rules: {

                    title: [
                        {required: true, message: '必填项'}
                    ],
                    date: [
                        {required: true, message: '必填项'}
                    ],
                    money: [
                        {required: true, message: '必填项'}
                    ]
//                    fee_cost: [
//                        {type: 'number', message: '请输入数字', trigger: 'change'}
//                    ],
                },
                open: store.state.edit_data.open
            }
        },
        created() {

        },

        computed: {
            ...mapGetters([
                'get_edit_data'
            ])
        },
        watch: {
            invoiceAdd(val) {
                this.isCreated = 1 //标记当前为新增状态
                this.visible = val.visible
                this.cl_id = val.id
                //需判断客户，项目下面新增
                //项目新增，传cl_id=0，将所属项目带过来
                if (this.routeName === 'projectCode') {
                    this.getBaseData(0)
                    this.project_arr = [
                        {
                            id: val.options.value,
                            pr_name: val.options.label,
                        }
                    ]
                    this.form.pr_id = val.options.value
                } else {
                    this.getBaseData(val.id)
                }
            },

            invoiceEdit(val) {
                this.isCreated = 0//标记当前为编辑状态
                this.getEdit(val.code)
                this.visible = val.visible

            },

        },

        methods: {
            //关闭弹框的事件
            closeDialog() {
//                必须要清除dialog数据
                this.resetForm('form')
                this.$refs.upload.clearFiles()
            },
            beforeAvatarUpload(file) {
                //限制类型
                const fileType = file.name.split('.').reverse()[0]
                const limitTypes = ['jpg', 'jpeg', 'bmp', 'png', 'rar', 'zip', '7z', 'doc', 'docx', 'rtf', 'txt', 'xls', 'xlsx', 'pdf', 'mp3', 'm4a']
                const isType = limitTypes.some(item => item === fileType)
                if (!isType) {
                    this.$message.error(`上传文件类型不能为${fileType}!`)
                }
                //基础版10M内，收费版100M内
                //对应登录返回数据中，版本v_info中的type字段，type=0基础版，type>0高阶版
                const vType = store.state.v_info.type
                const limitValue = vType > 0 ? 100 : 10
                const isLimit = file.size / 1024 / 1024 < limitValue
                if (!isLimit) {
                    this.$message.error(`上传文件大小不能超过${limitValue}MB!`)
                }
                return isLimit && isType
            },
            uploadUrl: function () {
                return this.url + 'cfile'
            },
            header: function () {
                return {authorization: 'Bearer ' + store.state.user_info.token}
            },
            handleRemove(file, response, fileList) {
                if (!file.response) {
                    return
                }     //beforeAvatarUpload也会触发handleRemove，避免报错
                if (file.is_record) {
                    this.deleteFile(file.id, {is_tem_file: 0})

                } else {
                    this.deleteFile(file.response.data.file_id, {is_tem_file: 1})
                }
                for (let i in fileList) {
                    if (!fileList[i].is_record) {
                        this.form.file_tem_ids.push(fileList[i].response.data.file_id)
                    }
                }
            },
            successBack(response, file, fileList) {
                if (parseInt(response.code) === 1) {
                    this.$message.error(response.msg)
                } else {
                    this.$message.success(response.msg)
                    let arr = []
                    for (let i in fileList) {
                        if (!fileList[i].is_record) {
                            arr.push(fileList[i].response.data.file_id)
                        }
                    }
                    this.form.file_tem_ids = arr
                }

            },

            on_date(val) {
                this.form.date = val
            },
            //删除文件
            deleteFile(id, params) {
                this.$confirm('此操作将删除改文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'is-plain'
                }).then(() => {
                    this.$fetch.api_file.cfileDelete(id, params)
                        .then(
                            ({
                                 msg
                             }) => {
                                this.$message.success('删除成功')
                                this.del_status = true
                            }
                        )


                }).catch(() => {

                })
            },
            //创建
            getBaseData(id) {
                this.$fetch.api_invoice.invoiceCreate(
                    {cl_id: id}
                )
                    .then(({
                               data
                           }) => {
                        this.apply_uid_arr = data.team_lawyers
                        this.project_arr = data.project_arr
                    })
            },
            //获取编辑详情
            getEdit(code) {
                this.$fetch.api_invoice.invoiceEdit(
                    code
                )
                    .then(({
                               data
                           }) => {

                        this.form = data.invoice_arr
                        for (let i in data.invoice_arr.file_arr) {
                            data.invoice_arr.file_arr[i].name = data.invoice_arr.file_arr[i].file_name
                        }
                        for (let i in data.invoice_arr.file_arr) {
                            data.invoice_arr.file_arr[i].is_record = true
                        }
                        this.isUpList = data.invoice_arr.file_arr
                        if (this.routeName === 'projectCode') {
                            this.project_arr = [
                                {
                                    id: data.invoice_arr.pr_id,
                                    pr_name: data.invoice_arr.pr_data.pr_name,
                                }
                            ]
                            this.form.pr_id = data.invoice_arr.pr_id
                        } else {
                            this.project_arr = data.project_arr
                        }

                        this.apply_uid_arr = data.team_lawyers

                    })
            },

            //提交表单
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return false
                    if (this.isCreated === 1) {
                        this.form.cl_id = this.cl_id
                        let sub_form = JSON.parse(JSON.stringify(this.form))
                        this.$fetch.api_invoice.invoiceStore(sub_form)
                            .then(({
                                       msg,
                                       data
                                   }) => {
                                sub_form.code = data.code
                                this.$emit('refreshInvoiceAdd', sub_form)
                                this.visible = false
                            })
                    }
                    if (this.isCreated === 0) {
                        let id = this.form.id
                        let del_arr = ['apply_uid_text', 'pr_data', 'date_text', 'type_text', 'file_arr', 'pr_name', 'pr_code', 'type_text']
                        for (let i in del_arr) {
                            delete this.form[del_arr[i]]
                        }
                        let sub_form = JSON.parse(JSON.stringify(this.form))
                        this.$fetch.api_invoice.invoicePut(sub_form, id)
                            .then(({
                                       msg,
                                       data
                                   }) => {
                                this.form = {}   //必须删掉编辑时添加到form中的id,因为在新增页面是不存在这个id的
                                this.$emit('refreshInvoiceEdit', sub_form)
                                this.visible = false
                            })
                    }

                })
            },
            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields()
            }
        }

    }
</script>
