<template>
    <div class="detail-doc">
        <div class="tab-component">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===index}"
                    v-for="(item,index) in tabData"
                    :key="item.text">
                    {{item.text}}
                </li>
            </ul>
            <div>
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
                    :show-file-list="false"
                >
                    <div slot="trigger" class="text-info">
                        <i class="iconfont icon-shangchuan1 mg-right-5"></i>
                        <span>上传文书</span>
                    </div>
                    <!--<span slot="tip" class="el-upload__tip mal-10">上传的文件不能超过10M</span>-->
                </el-upload>
            </div>
        </div>
        <div class="content-main">
            <el-table :data="tableData" style="padding: 10px 0" size="mini"
                      :show-header="false"
                      max-height="310"
                      v-loading="load_data"
                      cell-class-name="border-none">
                <el-table-column prop="file_name" label="文件名" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="d_uid_text" label="上传人" width="120px"></el-table-column>
                <el-table-column prop="created_at" label="上传时间" width="240px"
                                 sortable></el-table-column>
                <el-table-column label="下载/删除" width="200px">
                    <template slot-scope="scope">
                        <a :href="url+'cfile/'+scope.row.id+'/download?token='+mytoken"
                           class="text-info">
                            下载
                        </a>
                        <span class="bar"></span>
                        <el-button class="text-danger" type="text" size="mini"
                                   @click="deleteFile(scope.row.id)">
                            删除
                        </el-button>
                        <span class="bar"></span>
                        <el-button class="text-info" type="text" size="mini"
                                   @click="renameFile(scope.row)">
                            修改文件名
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="修改文件名" :visible.sync="dialogFormVisible" width="400px">
            <el-form :model="form" >
                <el-form-item label="名称" labelWidth="50px">
                    <el-input v-model="form.file_name" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div class="text-center">
                <el-button type="primary"  @click="sureRename">确认修改</el-button>
            </div>
        </el-dialog>
        <page :page-data="pageData" v-on:pageEvent="pageChange"></page>
    </div>
</template>
<script>
    import store from 'store'
    import {
        page,
    } from 'components'

    import { server_base_url } from 'common/config'

    export default {
        props: ['caseData'],
        components: {
            page
        },
        data () {
            return {
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                params: {
                    cid: ''
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
                tabActive: 0,
                routeName:this.$route.name,
            }
        },
        created () {

        },

        watch:{
            caseData(val){
                if (this.routeName === 'project_detail') {
                    //项目文书
                    this.params.type = 2
                }else {
                    //案件文书
                    this.params.type =  1
                }
                this.params.cid = val.id
                this.getList()
            }
        },
        computed: {
            tabData () {
                let tempOnj = []
                if (this.routeName === 'project_detail') {
                    tempOnj = [{ text: '项目文书' }]
                }else {
                    tempOnj = [{ text: '案件文书' }]
                }
                return tempOnj
            },
        },
        methods: {
            //上传文书
            beforeAvatarUpload (file) {
                this.load_data = true
                const isLt10M = file.size / 1024 / 1024 < 10
                if (!isLt10M) {
                    this.$message.error('上传文件大小不能超过 10MB!')
                }
                return isLt10M
            },
            uploadUrl: function () {
                let cid =  this.params.cid
                let type = this.params.type
                return this.url + 'cfile' + '?linkid=' + cid + '&type=' + type
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
            //gmt转换
            successBack (file, fileList, response) {
                if (file.msg === '文件上传成功！') {
                    this.$message.success(file.msg)
                    this.getList()
                    this.load_data = false
                } else {
                    this.$message.warning(file.msg)
                    this.load_data = false
                }
            },
            //打开修改文件名窗口
            renameFile (val) {
                this.dialogFormVisible = true
                this.file_id = val.id
                this.form.file_name = val.file_name
            },
            //确认修改
            sureRename () {
                this.$fetch.api_file.cfileChange(this.file_id, this.form)
                    .then(
                        ({
                             msg
                         }) => {
                            this.$message.success(msg)
                            //更新数据
                            for (let i in this.tableData) {
                                if (this.file_id == this.tableData[i].id) {
                                    this.$set(this.tableData[i], 'file_name', this.form.file_name)
                                }
                            }
                            this.dialogFormVisible = false
                        }
                    )
                    .catch((msg) => {
                        this.$message.error(msg)
                    })
            },
            //删除文件
            deleteFile (id) {
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
                                this.$message.success('删除成功')
                                //更新数据
                                for (let i in this.tableData) {
                                    if (id === this.tableData[i].id) {
                                        this.tableData.splice(i, 1)
                                    }
                                }
                            }
                        )
                        .catch((msg) => {
                            this.$message.error(msg)
                        })

                }).catch(() => {

                })
            },
            //分页操作
            pageChange (data) {
                this.params.pageSize = data.pageSize
                this.params.page = data.currentPage
                this.getList()
            },
            //获取案件文书列表
            getList () {
                this.$fetch.api_file.cfileList(this.params)
                    .then(
                        ({
                             data,
                             msg
                         }) => {
                            this.auth = data.auth
//                            console.log('auth',data.auth)
                            this.tableData = data.data
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

