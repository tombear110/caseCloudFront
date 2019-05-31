<template>
    <div class="info-box">
        <div class="tab-component tab-component__mini">
            <ul class="tab-list">
                <li class="tab-item  tab-active">案件文书</li>
            </ul>
            <div class="co-9FA5B9 mg-right-15 cursor">
                <el-upload
                    class=""
                    ref="upload"
                    :action=uploadUrl()
                    :headers=header()
                    :before-upload="beforeAvatarUpload"
                    :on-success="successBack"
                    :on-error="upFailed"
                    :on-progress="upIn"
                    name='cfile'
                    :show-file-list="false">
                    <div slot="trigger" class="co-9FA5B9">
                        <i class="iconfont icon-shangchuan1 mg-right-5"></i>
                        <span>上传文书</span>
                    </div>
                    <!--<span slot="tip" class="el-upload__tip mal-10">上传的文件不能超过10M</span>-->
                </el-upload>
            </div>
        </div>
        <el-table :data="tableData" v-loading="load_data">
            <el-table-column prop="file_name" label="文件名" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="d_uid_text" label="上传人"></el-table-column>
            <el-table-column prop="created_at" label="上传时间"></el-table-column>
            <el-table-column label="下载/删除" width="200px">
                <template slot-scope="scope">
                    <el-button class="co-9FA5B9" type="text"
                               @click="renameFile(scope.row)">
                        修改文件名
                    </el-button>
                    <span class="bar"></span>
                    <a :href="url+'cfile/'+scope.row.id+'/download?token='+mytoken"
                       class="text-info">
                        下载
                    </a>
                    <span class="bar"></span>
                    <el-button class="text-danger" type="text"
                               @click="deleteFile(scope.row.id,scope.$index)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="修改文件名" :visible.sync="dialogFormVisible" width="400px">
            <el-form :model="form">
                <el-form-item label="名称" labelWidth="50px">
                    <el-input v-model="form.file_name" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div class="text-center">
                <el-button type="primary" @click="sureRename">确认修改</el-button>
            </div>
        </el-dialog>
        <page :page-data="pageData" v-on:pageEvent="pageChange"></page>
    </div>
</template>
<script>
    import store from 'store'
    import page from '../../pagination/index'

    import {server_base_url} from 'common/config'

    export default {
        components: {
            page
        },
        props: ['stepData'],
        data() {
            return {
                contractData: [],
                btnActive: 0,
                tabTitle: '案件',
                caseEdit: {},
                tabActive: 0,
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                params: {
                    cid: this.stepData.id,
                    type: 1,
                },
                auth: 1,
                tableData: [],
                fileList: [],
                mytoken: store.state.user_info.token,
                url: server_base_url,
                dialogFormVisible: false,
                form: {
                    file_name: ''
                },
                file_id: '',
                //请求时的loading效果
                load_data: false,
                routeName: this.$route.name,
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            //上传文书
            beforeAvatarUpload(file) {
                //限制类型
                const fileType = file.name.split('.').reverse()[0]
                const limitTypes = ['jpg','jpeg','bmp','png','rar','zip','7z','doc','docx','rtf','txt','xls','xlsx','pdf','mp3','m4a']
                const isType = limitTypes.some(item=>item ===fileType )
                if(!isType){
                    this.$message.error(`上传文件类型不能为${fileType}!`)
                }
                //基础版10M内，收费版100M内
                //对应登录返回数据中，版本v_info中的type字段，type=0基础版，type>0高阶版
                const vType = store.state.v_info.type
                const limitValue = vType>0 ? 100 :10
                const isLimit =file.size / 1024 / 1024 < limitValue
                if (!isLimit) {
                    this.$message.error(`上传文件大小不能超过${limitValue}MB!`)
                }
                return isLimit && isType
            },
            uploadUrl: function () {
                let cid = this.params.cid
                let type = this.params.type
                return this.url + 'cfile' + '?linkid=' + cid + '&type=' + type
            },
            header: function () {
                return {authorization: 'Bearer' + store.state.user_info.token}
            },
            //上传中
            upIn() {
                this.load_data = true
            },
            //上传失败
            upFailed(err) {
                this.load_data = false
                this.$message.error(err.msg)
            },
            //gmt转换
            successBack(response,file , fileList) {
                if (parseInt(response.code) === 0) {
                    this.$message.success(response.msg)
                    this.getFileList()
                    this.load_data = false
                } else {
                    this.$message.warning(response.msg)
                    this.load_data = false
                }
            },
            //打开修改文件名窗口
            renameFile(val) {
                this.dialogFormVisible = true
                this.file_id = val.id
                this.form.file_name = val.file_name
            },
            //确认修改
            sureRename() {
                this.$fetch.api_file.cfileChange(this.file_id, this.form)
                    .then(
                        ({
                             msg
                         }) => {
                            this.$message.success(msg)
                            //更新数据
                            this.tableData = this.tableData.map(item => {
                                if (this.file_id === item.id) {
                                    this.$set(item, 'file_name', this.form.file_name)
                                }
                                return item
                            })
                            this.dialogFormVisible = false
                        }
                    )
                    .catch((msg) => {
                        this.$message.error(msg)
                    })
            },
            //删除文件
            deleteFile(id, index) {
                this.$confirm('此操作将删除改文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$fetch.api_file.cfileDelete(id)
                        .then(
                            ({
                                 msg
                             }) => {
                                //更新数据
                                this.tableData.splice(index, 1)
                            }
                        )
                        .catch((msg) => {
                            this.$message.error(msg)
                        })

                }).catch(() => {

                })
            },
            //分页操作
            pageChange(data) {
                this.params.pageSize = data.pageSize
                this.params.page = data.currentPage
                this.getList()
            },
            //获取案件文书列表
            getList() {
                this.$fetch.api_file.cfileList(this.params)
                    .then(
                        ({
                             data,
                             msg
                         }) => {
                            this.auth = data.auth
                            this.tableData = data.data.map(item => {
                                item.created_at = item.created_at.split(' ')[0]
                                return item
                            })
                            this.pageData.pageSize = parseInt(data.per_page)
                            this.pageData.total = data.total
                        }
                    )
                    .catch((msg) => {

                    })
            }
        }

    }
</script>
