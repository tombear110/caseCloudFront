<template>
<div class="expand">
    <h3 class="text-center">Excel数据自动生成PDF文件</h3>
    <el-form ref="form" :model="form" label-width="80px"  :rules="rules" v-loading="load_data" element-loading-text="提交数据中...">
        <el-form-item label="选择模板" prop="excel_type">
            <el-select v-model="form.excel_type" placeholder="请选择导出模板">
                <el-option label="平安01" value="pa"></el-option>
                <el-option label="平安02" value="pa02"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="上传文件" prop="excel_path">
            <el-upload class="upload-demo" :action="upload_url" name="tempFile" :on-success="successUpload" :on-error="errorUpload" :on-remove="handleRemove" :before-remove="beforeRemove">
                <el-button  type="primary" plain>点击上传<i class="el-icon-upload el-icon--right"></i></el-button>
                <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过500kb</div>
            </el-upload>
        </el-form-item>
        <el-form-item v-show="!down_show">
            <el-button type="primary" @click="submit_form">立即提交</el-button>
        </el-form-item>
        <el-form-item v-show="down_show">
            <el-button type="primary"  :loading="load_download" @click="download">{{ down_text }}</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script type="text/javascript">
import {
    mapGetters
} from 'vuex'
import {
    GET_USER_INFO
} from 'store/getters/type'
import {
    server_base_url
} from 'common/config'


export default {
    data() {
        return {
            upload_url: '',
            form: {
                excel_type: null,
                excel_path: ''
            },
            rules: {
                excel_type: [{
                    required: true,
                    message: '请选择模板类型！',
                }]
            },
            //请求时的loading效果
            load_data: false,
            down_show: false,
            load_download: true,
            down_text: '正在打包处理中',
            paramas: {
                code: ''
            },
        }
    },
    sockets: {
        connect: function() {
            console.log('socket connected')
        },
    },
    computed: {
        ...mapGetters({
            get_user_info: GET_USER_INFO
        })
    },
    created() {
        this.upload_url = server_base_url + 'uploadTempFile?token='+this.get_user_info.token
    },
    methods: {
        socket_download(channelCode) {
            let customEventName = 'GetExcelToPdfZip'+channelCode;
            this.$options.sockets[customEventName] = (data) => {
                this.paramas.code = data.code
                this.load_download = false
                this.down_text = '打包成功，正在下载..'
                window.open(server_base_url + 'downloadpdf?token='+this.get_user_info.token+'&code=' + this.paramas.code, '_blank')
                this.down_text = '已下载完成，点击重新下载'

            }
        },
        download() {
            window.open(server_base_url + 'downloadpdf?token='+this.get_user_info.token+'&code=' + this.paramas.code, '_blank')
        },
        submit_form() {
            if (this.form.excel_path == '') {
                this.$message.error('未检测到有文件，请先上传！')
                return false
            }
            this.$refs.form.validate((valid) => {
                if (!valid) return false
                this.load_data = true
                this.$fetch.api_expand.createpdf(this.form)
                    .then(({
                        data,
                        msg
                    }) => {
                        this.$message.success(msg)
                        this.load_data = false
                        this.down_show = true
                        this.socket_download(data.channelCode)
                    })
                    .catch(({
                        code
                    }) => {

                    })
            })
        },
        successUpload(response, file, fileList) {
            this.$message({
                message: response.msg,
                type: 'success'
            });
            // console.log(response.data)
            this.form.excel_path = response.data.path
        },
        errorUpload(response, file, fileList) {
            console.log(response)
            this.$message({
                message: response.msg,
                type: 'warning'
            });
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        }
    }
}
</script>

<style scope type="text/scss" rel="stylesheet/scss" scoped>
.expand {
    width: 400px;
    margin: 20vh auto 0;
}
    h3{
        text-align: left;
        font-size: 18px;
        padding-left: 80px;
        margin-bottom: 40px;
    }
</style>
