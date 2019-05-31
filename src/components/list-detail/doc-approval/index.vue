<template>
    <!--文书报审弹窗-->
    <el-dialog :title="dialogTitle" :visible.sync="visible" width="400px" @close="closeDialogForm('dialogForm')">
        <el-form :model="dialogForm" ref="dialogForm"  label-position="right" :rules="dialogRules"
                 v-loading="loadingDialog"
                 label-width="80px">
            <el-form-item label="文件类型" prop="type">
                <el-select v-model="dialogForm.type" placeholder="请选择" style="width: 100%">
                    <el-option
                        v-for="item in typeArrOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="待审文件">
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    :action=uploadUrl()
                    :headers=header()
                    :before-upload="beforeFileUpload"
                    :on-remove="handleRemove"
                    :on-success="successBack"
                    name="tempFile"
                    :limit="1"
                    :on-exceed="outOFlimit"
                    :file-list="fileList"
                    show-file-list
                >
                    <el-button slot="trigger"  type="primary" plain>选取文件</el-button>
                    <span slot="tip" class="el-upload__tip mal-10">上传的文件不能超过10M</span>
                </el-upload>
            </el-form-item>
            <el-form-item label="报审人" prop="applicant">
                <el-autocomplete
                    style="width: 100%"
                    v-model="dialogForm.applicant"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入内容"
                    @select="handleSelect"
                ></el-autocomplete>
            </el-form-item>
            <el-form-item label="选择案件" prop="linkid">
                <el-select v-model="dialogForm.linkid" placeholder="请选择" style="width: 100%">
                    <el-option
                        v-for="item in dialogOptions.firmcase_arr"
                        :key="item.id"
                        :label="item.case_name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="盖章分数" prop="stamp_num">
                <el-input type="text" v-model="dialogForm.stamp_num"></el-input>
            </el-form-item>
            <el-form-item label="盖章类型" prop="stamp_type">
                <el-select v-model="dialogForm.stamp_type" style="width: 100%">
                    <el-option label="公章" :value="1"></el-option>
                    <el-option label="合同章" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="mark">
                <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入内容"
                    v-model="dialogForm.mark">
                </el-input>
            </el-form-item>
            <el-form-item label="" class="mab-0">
                <el-button type="primary"  @click="postDialogForm('dialogForm')">确认</el-button>
                <el-button type=""  @click="dialogReset('dialogForm')" plain>取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>

    import store from 'store'

    export default {
        props: ['docAdd', 'docEdit'],
        data () {
            return {
                fileList: [],
                visible: false,
                loadingDialog: false,
                dialogForm: {},
                typeArrOptions: [],
                tableData: {},
                loading: false,
                dialogTitle: '',
                dialogOptions: {},
                dialogRules: {
                    type: [
                        { required: true, message: '必选项', trigger: 'change' }
                    ],
                    applicant: [
                        { required: true, message: '必选项', trigger: 'change' }
                    ],
                    stamp_num: [
                        { required: true, message: '必选项', trigger: 'blur' }
                    ],
                    stamp_type: [
                        { required: true, message: '必选项', trigger: 'change' }
                    ]
                },
                rowId: ''
            }
        },
        computed: {
            loadAll () {
                let tempArr = [], lawyerList = this.dialogOptions.team_lawyers
                for (let i = 0; i < lawyerList.length; i++) {
                    tempArr.push(
                        { value: lawyerList[i].real_name }
                    )
                }
                return tempArr
            }
        },
        watch: {
            docAdd (val) {
                console.log('val---', val)
                this.visible = true
                this.openDialog()
            },
            docEdit (val) {
                console.log('val***',val)
                this.visible = val.visible
                this.editDialog(val.id)
//                this.rowId = val.id
//                this.getTableData(val.id)
            }

        },
        methods: {
            querySearch (queryString, cb) {
                let restaurants = this.loadAll
                let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
                // 调用 callback 返回建议列表的数据
                cb(results)
            },
            createFilter (queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
                }
            },

            handleSelect (item) {
                console.log(item)
            },

            beforeFileUpload (file) {
                const isLt10M = file.size / 1024 / 1024 < 10
                if (!isLt10M) {
                    this.$message.error('上传文件大小不能超过 10MB!')
                }

                return isLt10M
            },
            uploadUrl: function () {
                return this.url + 'uploadTempFile'
            },
            header: function () {
                return { authorization: 'Bearer' + store.state.user_info.token }
            },
            successBack (response, file, fileList) {
                this.fileList = fileList
            },
            outOFlimit (files, fileList) {
                if (files.length) {
                    this.$message.error('一次仅能上传一份文件')
                }
            },
            //删除文件
            deleteFile (id) {
                this.$fetch.api_lawdoc.del(id)
                    .then(
                        ({
                             msg
                         }) => {
                            this.$message.success('删除成功')
                        }
                    )
                    .catch((msg) => {

                    })
            },
            handleRemove (file, fileList) {
                if (file.id) {
                    this.deleteFile(file.id)
                }
                this.fileList = fileList
            },
            //打开弹窗，获取基础数据
            openDialog () {
                this.dialogTitle = '新增报审'
                this.dialogFormVisible = true
                this.loadingDialog = true
                this.$fetch.api_lawdoc.create()
                    .then(
                        ({
                             data
                         }) => {
                            this.dialogOptions = data
                            this.typeArrOptions = []
                            for (let i in data.type_arr) {
                                this.typeArrOptions.push(
                                    { value: parseInt(i), label: data.type_arr[i] }
                                )
                            }
                            this.loadingDialog = false
                        }
                    )
                    .catch((msg) => {
                        this.loadingDialog = false
                    })
            },
            editDialog (id) {
                this.dialogTitle = '编辑报审'
                this.dialogFormVisible = true
                this.loadingDialog = true
                this.updateId = id
                this.$fetch.api_lawdoc.edit(id)
                    .then(
                        ({
                             data
                         }) => {
                            //设置options
//                            console.log('data-edit', data)
                            this.dialogOptions = data
                            this.typeArrOptions = []
                            for (let i in data.type_arr) {
                                this.typeArrOptions.push(
                                    { value: parseInt(i), label: data.type_arr[i] }
                                )
                            }
                            //设置内容
                            const firmData = data.firmfile_data
                            this.fileList = [
                                { name: firmData.name, response: { data: { path: firmData.path } } }
                            ]
                            console.log(' this.fileList ', this.fileList)
                            this.dialogForm = {
                                type: firmData.type,
                                applicant: firmData.applicant,
                                linkid: firmData.linkid,
                                stamp_num: firmData.stamp_num,
                                stamp_type: firmData.stamp_type,
                                mark: firmData.mark
                            }
                            this.loadingDialog = false

                        }
                    )
                    .catch((msg) => {
                        this.loadingDialog = false
                    })
            },

            //提交表单
            postDialogForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return false
                    this.loadingDialog = true
                    if (!this.fileList.length) {
                        this.$message.error('未上传文件')
                        this.loadingDialog = false
                        return false
                    }
                    this.dialogForm.path = this.fileList[0].response.data.path
                    this.dialogForm.name = this.fileList[0].name
                    if (this.dialogTitle === '新增报审') {
                        this.$fetch.api_lawdoc.save(this.dialogForm)
                            .then(({
                                       msg
                                   }) => {
                                this.$message.success(msg)
                                this.loadingDialog = false
                                this.closeDialogForm(formName)
                            })
                            .catch(({
                                        msg
                                    }) => {
                                this.$message.warning(msg)
                                this.loadingDialog = false
                            })
                    } else {
                        this.$fetch.api_lawdoc.update(this.updateId, this.dialogForm)
                            .then(({
                                       msg
                                   }) => {
                                this.$message.success(msg)
                                this.loadingDialog = false
                                this.closeDialogForm(formName)
                            })
                            .catch(({
                                        msg
                                    }) => {
                                this.$message.warning(msg)
                                this.loadingDialog = false
                            })
                    }

                })

            },
            //关闭清除部分数据
            closeDialogForm (formName) {
                this.$refs[formName].resetFields()
                this.visible = false
                this.dialogForm = {}
                this.fileList = []
            },

            //去编辑页-dialog
            openEditDialog () {
                //点击编辑按钮，关闭当前页，打开编辑的dialog，
                this.visible = false
                this.$emit('onEdit', this.rowId)
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
    .table-expand {
        .expand-label {
            display: inline-block;
            width: 110px;
            text-align: right;
        }
    }

</style>


