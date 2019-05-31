<template>
    <el-dialog title="导入批量案件" :visible.sync="visible" @close="closeDialog('form')">
        <div class="batch-import">
            <div class="batch-title">
                <p class="text-danger">--注意--</p>
                <p>导入案件之前，请先下载批量案件导入模板，并将数据写入文件中再上传。</p>
                <p>导入批量案件支持文件格式为 Excel下载&nbsp;&nbsp;<em class="text-danger">姓名、性别、身份证号和卡号为必填</em></p>
                <div class="text-download">
                    <span>下载</span>
                    <a :href="url+'downBatchCaseExcel?token='+mytoken" class="co-blue2">《批量案件导入模板.xls》</a>
                </div>
            </div>
            <ul class="batch-qa">
                <li class="qa-title"><h4>常见问题：</h4></li>
                <li v-for="(item,index) in qaList" :key="index" class="text-qa">
                    <div class="co-666">Q：{{item.q}}</div>
                    <div class="co-999">A：{{item.a}}</div>
                </li>
            </ul>
            <div class="batch-form">
                <el-form :model="form" :rules="rules"  label-width="100px" label-position="right"
                         ref="form">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="选择客户" prop="client_id">
                                <el-select v-model="form.client_id" @change="clientChange" style="width: 100%"
                                           filterable>
                                    <el-option
                                        v-for="item in client_arr"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="选择项目" prop="project_id">
                                <el-select v-model="form.project_id" filterable>
                                    <el-option
                                        v-for="item in project_arr"
                                        :key="item.id"
                                        :label="item.pr_name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="案件批次号" prop="batch">
                                <el-input v-model="form.batch" placeholder="例如：pinan201701,支持数字+字母"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="上传文件" prop="file_id">
                                <el-upload
                                    class="upload-demo"
                                    v-loading="load_data"
                                    element-loading-text="正在上传中..."
                                    ref="upload"
                                    :action=uploadUrl()
                                    :headers=header()
                                    :before-upload="beforeAvatarUpload"
                                    :on-success="successBack"
                                    :on-error="upFailed"
                                    :on-progress="upIn"
                                    :on-remove="handleRemove"
                                    name='cfile'
                                    :show-file-list="true"
                                >
                                    <el-button slot="trigger"  type="primary" plain>选取文件</el-button>
                                    <span slot="tip" class="el-upload__tip mg-left-10">仅支持尾缀为.xls和.xlsx的文件</span>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div class="text-right">
                        <el-button type="primary"  class="mg-top-20" @click="onSubmit('form')">提交
                        </el-button>
                        <el-button  class="mg-top-20" @click="resetForm('form')">重置</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </el-dialog>


</template>

<script>
    import { server_base_url } from 'common/config'
    import store from 'store'

    export default {
        props: ['batchData'],
        data () {
            let validateBatch = (rule, value, callback) => {
                let pass = /^[0-9a-zA_Z]+$/.test(value)
                if (value === '') {
                    return callback(new Error('必填项'))
                } else {
                    if (!pass) {
                        callback(new Error('请输入英文字母或者数字'))
                    }
                    callback()
                }
            }
            return {
                visible: false,
                url: server_base_url,
                mytoken: store.state.user_info.token,
                client_arr: [],
                project_arr: [],
                batch_arr: [],
                temp_project_arr: [],
                //请求时的loading效果
                load_data: false,
                form: {
                    client_id: '',
                    project_id: '',
                    batch: '',
                    file_id: ''
                },
                rules: {
                    client_id: [
                        { required: true, message: '必选项' }
                    ],
                    project_id: [
                        { required: true, message: '必选项' }
                    ],
                    batch: [
                        { required: true, message: '必选项', trigger: 'blur' },
                        { validator: validateBatch, trigger: 'blur' }
                    ],
                    file_id: [
                        { required: true, message: '必选项' }
                    ]
                },
                qaList: [
                    {
                        q: '为何我的“客户管理”明明有客户，但是选择列表却是空？',
                        a: '导入案件之前，请先在该客户名下新建一个非诉项目，并且该项目的”项目类型“选择为”批量案件“；'
                    },
                    {
                        q: '可以同一个批次，分多次导入案件吗？',
                        a: '可以。请记得再次导入的时候选择的客户、项目、批次和第一次保持一致即可；'
                    },
                    {
                        q: '上传了文件，但是提交不成功怎么办？',
                        a: '不要直接将下载的模板导入测试，不要删减下载表格的列，请检查必填项是否为空，如还有问题，请联系我们的客服人员；'
                    }
                ]

            }
        },
        created () {
            this.get_base_data()
        },
        watch: {
            batchData (val) {
//                console.log('val--',val)
                this.visible = true
            }
        },
        methods: {
            //创建表单基本数据
            get_base_data () {
                this.$fetch.api_batch.caseCreate()
                    .then(({
                               data
                           }) => {
                        console.log('data', data)
                        this.temp_project_arr = data.project_arr
                        this.client_arr = data.client_arr
                        this.batch_arr = data.batch_arr

                    })
                    .catch(({
                                msg
                            }) => {
                        this.$message.warning(msg)
                    })
            },
            //根据客户选择对应的项目
            clientChange (val) {
                //每次必先清空项目数组,上次选中的项目id
                this.form.project_id = ''
                this.project_arr = []
                for (let i in this.temp_project_arr) {
                    if (val === this.temp_project_arr[i].client_id) {
                        this.project_arr.push(this.temp_project_arr[i])
                    }
                }

            },

            //上传文书
            beforeAvatarUpload (file) {
                if (this.form.file_id) {
                    this.$message.warning('单次上传文件个数为1')
                    return false
                }
                console.log('file.type', file.type)
                let isExcel = false
                if (file.type === 'application/vnd.ms-excel') {
                    isExcel = true
                } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                    isExcel = true
                } else {
                    isExcel = false
                }
                if (!isExcel) {
                    this.$message.error('只允许上传尾缀为.xls和.xlsx的文件!')
                }
                return isExcel
            },
            uploadUrl: function () {
                return this.url + 'cfile'
            },
            header: function () {
                return { authorization: 'Bearer' + store.state.user_info.token }
            },
            //上传中
            upIn () {
                this.load_data = true
            },
            //上传失败
            upFailed (err) {
                this.load_data = false
                this.$message.error(err.msg)
            },
            //上传成功
            successBack (file) {
                if (file.code == 0) {
                    this.load_data = false
                    this.$message.success(file.msg)
                    this.form.file_id = file.data.file_id
                } else {
                    this.$message.warning(file.msg)
                    this.load_data = false
                }
            },
            //删除文件
            deleteFile (id, params) {
                this.$confirm('此操作将删除改文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$fetch.api_file.cfileDelete(id, params)
                        .then(
                            ({
                                 msg
                             }) => {
                                this.$message.success(msg)
                                this.form.file_id = ''
                            }
                        )
                        .catch((msg) => {
                            this.$message.error(msg)
                            return false
                        })

                }).catch(() => {

                })
            },
            //删除文件
            handleRemove (file) {
                if (file.response) {
                    this.deleteFile(file.response.data.file_id, { is_tem_file: 1 })
                }

            },
            handleSubmit (form) {
                this.$fetch.api_batch.caseImport(form)
                    .then(({
                               data,
                               msg
                           }) => {
                        this.$message.success(msg)
                        this.visible = false
                        this.$router.push({
                            name: 'batchMy', query: {
                                client_id: form.client_id,
                                project_id: form.project_id, batch: form.batch, batch_id: data.batch_id
                            }
                        })
                    })
                    .catch(({
                                msg
                            }) => {
                    })
            },
            //提交表单
            onSubmit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return false
                    //若同一个项目下存在相同的批次号，则提示用户
                    let batch_exist = false
                    for (let i in this.batch_arr) {
                        if (this.form.project_id === this.batch_arr[i].project_id && this.form.batch === this.batch_arr[i].batch) {
                            batch_exist = true
                        }
                    }
                    if (batch_exist) {
                        this.$confirm('该项目下已存在该批次号, 是否导入同一个批次?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.handleSubmit(this.form)
                        }).catch(() => {
                            return false
                        })
                    }
                    else {
                        this.handleSubmit(this.form)
                    }

                })
            },
            closeDialog (formName) {
                this.resetForm(formName)
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
