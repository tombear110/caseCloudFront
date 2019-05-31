<template>
    <el-dialog
        title="导入客户"
        :visible.sync="visible"
        width="500px">
        <div class="mg-bottom-20">
            下载
            <a class="text-info" :href="url+'exportClientDemo?token='+mytoken" target="_blank">
                《批量导入客户模板.xls》
            </a>
            ，填入客户信息后上传
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  label-width="80px">
            <el-form-item label="上传文件" prop="fileList">
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    :action=uploadUrl()
                    :headers=header()
                    :before-upload="beforeAvatarUpload"
                    :on-remove="handleRemove"
                    :limit="1"
                    :on-success="successBack"
                    name='tempFile'
                    :file-list="ruleForm.fileList"
                    :multiple="false">
                    <el-button slot="trigger"  plain>选取文件</el-button>
                    <span slot="tip" class="el-upload__tip mal-10">仅支持尾缀为.xls和.xlsx的文件</span>
                </el-upload>
            </el-form-item>
            <el-form-item style="margin-left: -80px;text-align: center;padding-top: 20px">
                <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                <el-button @click="visible = false">取消</el-button>
            </el-form-item>
        </el-form>
        <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button  type="primary" @click="onEdit(tableData.id)">编辑</el-button>-->
        <!--<el-button  @click="onDelete(tableData.id)">删除</el-button>-->
        <!--</span>-->
    </el-dialog>
</template>
<script>

    import store from 'store'
    import { server_base_url } from 'common/config'

    export default {
        props: ['clientImport'],
        data () {
            return {
                ruleForm: {
                    fileList:[],
                },
                visible: false,
                url: server_base_url,
                mytoken: store.state.user_info.token,
                rules: {
                    fileList: [
                        { required: true, message: '必填项', trigger: 'blur' }
                    ]
                },
            }
        },

        watch: {
            clientImport (val) {
                this.visible = val.visible
            }
        },
        methods: {
            uploadUrl: function () {
                return this.url + 'file'
            },
            header: function () {
                return { authorization: 'Bearer' + store.state.user_info.token }
            },
            beforeAvatarUpload (file) {
                // const isType = file.type
                // console.log(file)
                // if (isType !== 'application/vnd.ms-excel' && isType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                //     this.$message.error('仅支持尾缀为.xls和.xlsx的文件')
                //     return false
                // }
                const isType = file.name.substring(file.name.length-4)
                if (isType === '.xls' || isType === 'xlsx') {
                    return isType
                } else {
                    this.$message.error('仅支持尾缀为.xls和.xlsx的文件')
                    return false
                }
            },
            successBack (response, file, fileList) {
                this.ruleForm.fileList = fileList
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid){return false}
                    this.$fetch.api_client.clientImport({file_id:this.ruleForm.fileList[0].response.data.file_id})
                        .then(({
                                   msg
                               }) => {
                            this.ruleForm.fileList = []
                            this.visible = false
                            this.$emit('refreshClientImport', true)
                        })
                })
            },

            //删除文件--将文件从列表中删掉
            handleRemove (file, fileList) {
                this.ruleForm.fileList = []
            },
        }
    }
</script>


