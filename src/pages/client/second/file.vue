<template>
    <div class="section section--table" style="margin-bottom: 0;">
        <div class="tab-component__mini">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===item.value}"
                    v-for="item in infoTab"
                    @click="tabChange(item)"
                    :key="item.value">
                    {{item.label}}
                </li>
            </ul>
            <div v-show="tabActive===0" class="co-9FA5B9  cursor" @click="onContractAdd">
                <i class="iconfont mg-right-5   icon-add1 "></i>
                <span>添加</span>
            </div>
            <div v-show="tabActive===1" class="co-9FA5B9  cursor" @click="onInvoiceAdd">
                <i class="iconfont mg-right-5  icon-add1 "></i>
                <span>添加</span>
            </div>
            <div v-show="tabActive===2" class="co-9FA5B9 cursor" @click="onLinkmanAdd">
                <i class="iconfont mg-right-5  icon-add1 "></i>
                <span>添加</span>
            </div>
            <div v-show="tabActive===4" class="co-9FA5B9 cursor" @click="openReceivableAdd">
                <i class="iconfont mg-right-5  icon-add1 "></i>
                <span>添加</span>
            </div>
            <div v-show="tabActive===2" class="co-9FA5B9  cursor" style="margin-left: 30px" @click="exportLinkman">
                <i class="iconfont mg-right-5  icon-daochu "></i>
                <span>导出</span>
            </div>
            <div v-show="tabActive===3">
                <el-upload
                    ref="upload"
                    :action=uploadUrl()
                    :headers=header()
                    :before-upload="beforeAvatarUpload"
                    :on-success="successBack"
                    :on-error="upFailed"
                    :on-progress="upIn"
                    name='cfile'
                    :show-file-list="false">
                    <div slot="trigger" class="co-9FA5B9 cursor">
                        <i class="iconfont icon-shangchuan1 mg-right-5"></i>
                        <span>上传文书</span>
                    </div>
                </el-upload>
            </div>
        </div>
        <!--合同管理-->
        <el-table :data="contractData"
                  cell-class-name="border-dashed"
                  v-show="tabActive===0"
                  @row-click="showContractDetail"
                  element-loading-text="正在上传中...">
            <el-table-column prop="title" label="合同名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="sign_at" label="签约日期">
                <template slot-scope="scope">
                    <span>{{scope.row.sign_at_text}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="end_time" label="到期日">
                <template slot-scope="scope">
                    <span>{{scope.row.end_time_text}}</span>
                </template>
            </el-table-column>
            <el-table-column label="期限自动延长" width="190">
                <template slot-scope="scope">
                    <span class="text-info" v-if="scope.row.period">{{scope.row.period}}年</span>
                    <span class="text-info" v-else>0年</span>
                    <span class="bar"></span>
                    <span class="text-danger">{{scope.row.status_text}}</span>
                    <span class="bar"></span>
                    <span class="text-info" v-if="scope.row.extend_at > 0">自动延长</span>
                    <span class="text-info" v-else>不延长</span>
                </template>
            </el-table-column>
        </el-table>
        <!--发票管理-->
        <el-table :data="invoiceData"
                  cell-class-name="border-dashed"
                  v-show="tabActive===1"
                  @row-click="showInvoiceDetail"
                  element-loading-text="正在上传中...">
            <el-table-column prop="date_text" label="发票日期" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="type_text" label="发票类型">
            </el-table-column>
            <el-table-column prop="title" label="发票抬头" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="money" label="发票金额/元">
                <template slot-scope="scope">
                    <span>{{scope.row.money}}元</span>
                </template>
            </el-table-column>
            <el-table-column prop="apply_uid_text" label="发票申请人">
            </el-table-column>
        </el-table>
        <!--        应收款-->
        <el-table :data="receivableData" v-show="tabActive===4"
                  cell-class-name="border-dashed" element-loading-text="正在加载中...">
            <el-table-column prop="type_text" label="款项类别" width="90"></el-table-column>
            <el-table-column prop="r_amount" label="应收金额" width="80"></el-table-column>
            <el-table-column prop="amount_r" label="已收金额" width="80"></el-table-column>
            <el-table-column prop="r_date" label="约定收款日期" width="110"></el-table-column>
            <el-table-column prop="date_r" label="实际收款日期" width="110"></el-table-column>
            <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button class="co-9FA5B9" type="text" @click.stop="openReceivableEdit(scope.row)">
                        编辑
                    </el-button>
                    <span class="bar"></span>
                    <el-button class="text-danger" @click.stop="deleteRowData(scope.row,scope.$index)"
                               type="text">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--联系人管理-->
        <el-table :data="linkmanData"
                  v-show="tabActive===2"
                  cell-class-name="border-dashed"
                  @row-click="showLinkmanDetail"
                  element-loading-text="正在上传中...">
            <el-table-column prop="name" label="姓名">
            </el-table-column>
            <el-table-column prop="mobile" label="联系电话">
            </el-table-column>
            <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true">
            </el-table-column>
        </el-table>
        <!--文书/附件管理-->
        <el-table :data="tableData"
                  max-height="310"
                  v-show="tabActive===3"
                  v-loading="load_data"
                  cell-class-name="border-none">
            <el-table-column prop="file_name" label="文件名" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="d_uid_text" label="上传人" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="created_at" label="上传时间" :show-overflow-tooltip="true"
                             sortable></el-table-column>
            <el-table-column label="下载/删除" width="180px">
                <template slot-scope="scope">
                    <a :href="url+'cfile/'+scope.row.id+'/download?token='+token"
                       class="text-info">
                        下载
                    </a>
                    <span class="bar"></span>
                    <el-button class="text-danger" type="text"
                               @click="deleteFile(scope.row.id)">
                        删除
                    </el-button>
                    <span class="bar"></span>
                    <el-button class="text-info" type="text"
                               @click="renameFile(scope.row)">
                        修改
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--        <page :page-data="pageData" v-on:pageEvent="pageChange"></page>-->
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
        <contract-detail :contract-detail="contractDetail"
                         @refreshContractDelete="refreshContractDelete"
                         @onContractEdit="onContractEdit"></contract-detail>
        <contract-add :contract-add="contractAdd" :contract-edit="contractEdit"
                      @refreshContractSave="refreshContractSave"></contract-add>

        <invoice-detail :invoice-detail="invoiceDetail" @onInvoiceEdit="onInvoiceEdit"
                        @refreshInvoiceDelete="refreshInvoiceDelete"></invoice-detail>
        <invoice-add :invoice-add="invoiceAdd" :invoice-edit="invoiceEdit" @refreshInvoiceAdd="refreshInvoiceAdd"
                     @refreshInvoiceEdit="refreshInvoiceEdit"></invoice-add>

        <linkman-detail :linkman-detail="linkmanDetail" @onLinkmanEdit="onLinkmanEdit"
                        @refreshLinkmanDelete="refreshLinkmanDelete"></linkman-detail>
        <linkman-add :linkman-add="linkmanAdd" :linkman-edit="linkmanEdit" @refreshLinkmanAdd="refreshLinkmanAdd"
                     @refreshLinkmanEdit="refreshLinkmanEdit"></linkman-add>
        <receivable-new :receivableEdit="receivableEdit" :receivableAdd="receivableAdd"
                        @receivableRefresh="receivableRefresh"></receivable-new>

    </div>
</template>
<script>
    import store from 'store'
    import {
        page,
        linkmanDetail,
        invoiceDetail,
        contractDetail,
        invoiceAdd,
        linkmanAdd,
        contractAdd
    } from 'components'
    import receivableNew from 'components/business/case/receivable-new'
    import {server_base_url} from 'common/config'

    export default {
        props: ['detailData'],
        components: {
            page,
            linkmanAdd,
            invoiceAdd,
            contractAdd,
            contractDetail,
            linkmanDetail,
            invoiceDetail,
            receivableNew
        },
        data() {
            return {
                name: '',
                receivableEdit: {},
                receivableData: [],
                receivableAdd: {},
                fileData: {},
                contractAdd: {},
                contractEdit: {},
                invoiceEdit: {},
                linkmanEdit: {},
                invoiceAdd: {},
                linkmanAdd: {},
                contractDetail: {},
                invoiceDetail: {},
                linkmanDetail: {},
                contractData: [],
                invoiceData: [],
                linkmanData: [],
                cl_id: '',
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                params: {},
                auth: 1,
                tableData: [],
                baseData: {},
                fileList: [],
                token: store.state.user_info.token,
                url: server_base_url,
                dialogFormVisible: false,
                form: {
                    file_name: ''
                },
                file_id: '',
                //请求时的loading效果
                load_data: false,
                tabActive: 0,
                routeName: this.$route.name

            }
        },
        created() {

        },
        watch: {
            detailData(val) {
                this.baseData = val
                setTimeout(
                    this.tabChange(this.infoTab[0]),
                    500
                )
            }
        },
        computed: {
            infoTab() {
                return this.routeName === 'projectCode' ? [
                    {label: '合同管理', value: 0},
                    {label: '发票管理', value: 1},
                    {label: '应收款管理', value: 4},
                    {label: '其他附件', value: 3}
                ] : [
                    {label: '联系人管理', value: 2},
                    {label: '合同管理', value: 0},
                    {label: '发票管理', value: 1}
                ]
            }
        },
        methods: {

            /**
             * 删除前二次确认
             * @params: mod
             * @return: 返回值/返回值说明
             */
            deleteRowData(row, index) {
                this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'is-plain'
                })
                    .then(() => {
                        this.handelDel(row, index)
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
            },

            /**
             * 发送请求，删除
             * @params: mod
             * @return: 返回值/返回值说明
             */
            handelDel(row, index) {
                this.$fetch.api_receivables.deleted(row.id)
                    .then(
                        ({
                             msg
                         }) => {
                            this.receivableData.splice(index, 1)
                        }
                    )

            },
            /**
             * 获取table数据
             * @params: mod
             * @return: []
             */
            getReceivableList() {
                this.$fetch.api_receivables.list({linkid: this.baseData.id, linktype: 2})
                    .then(
                        ({
                             data
                         }) => {
                            this.receivableData = data.data
                        }
                    )
            },

            receivableRefresh(val) {
                this.getReceivableList()
            },

            openReceivableAdd() {
                this.receivableAdd = {
                    visible: true,
                    linkid: this.baseData.id,
                    linktype: 2,
                }
            },

            openReceivableEdit(row) {
                console.log('row', row)
                this.receivableEdit = {
                    visible: true,
                    id: row.id,
                }
            },

            //上传文书
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
                let cid = this.baseData.id
                let type = 2
                return this.url + 'cfile' + '?linkid=' + cid + '&type=' + type
            },
            header: function () {
                return {authorization: 'Bearer ' + store.state.user_info.token}
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
            successBack(response, file, fileList) {
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
            deleteFile(id) {
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

            exportLinkman() {
                window.open(`${this.url}clcontactExport?token=${this.token}&cl_id=${this.baseData.id}`)
            },
            onContractEdit(code) {
                this.contractEdit = {
                    visible: true,
                    code: code
                }

            },
            onInvoiceEdit(code) {
                this.invoiceEdit = {
                    visible: true,
                    code: code
                }
            },

            onContractAdd() {
                if (this.routeName === 'clientDetail') {
                    //客户详情下面新增
                    this.contractAdd = {
                        visible: true,
                        id: this.baseData.id
                    }
                } else {
                    //项目详情下面新增
                    this.contractAdd = {
                        visible: true,
                        id: 0,
                        options: {value: this.baseData.id, label: this.baseData.pr_name}
                    }
                }
            },
            onInvoiceAdd() {
                if (this.routeName === 'clientDetail') {
                    this.invoiceAdd = {
                        visible: true,
                        id: this.baseData.id
                    }
                } else {
                    this.invoiceAdd = {
                        visible: true,
                        id: 0,
                        options: {value: this.baseData.id, label: this.baseData.pr_name}
                    }
                }

            },

            onLinkmanAdd() {
                this.linkmanAdd = {
                    visible: true,
                    cl_id: this.baseData.id,
                    pr_id: 0
                }
            },

            onLinkmanEdit(code) {
                this.linkmanEdit = {
                    visible: true,
                    code: code
                }
            },

            refreshContractDelete(val) {
                this.getContractList()
            },
            refreshInvoiceDelete(val) {
                this.getInvoiceList()
            },
            refreshLinkmanDelete(val) {
                this.getLinkmanList()
            },
            refreshLinkmanAdd(val) {
                this.getLinkmanList()
            },
            refreshInvoiceAdd(val) {
                this.getInvoiceList()
            },

            refreshContractSave(val) {
                this.getContractList()
            },


            refreshInvoiceEdit(val) {
                this.getInvoiceList()
            },
            refreshLinkmanEdit(val) {
                this.getLinkmanList()
            },

            showLinkmanDetail(row, event, column) {

                this.linkmanDetail = {
                    visible: true,
                    code: row.id,
                    pr_id: 0,
                    cl_id: this.baseData.id
                }
            },
            showContractDetail(row, event, column) {
                this.contractDetail = {
                    visible: true,
                    code: row.code
                }
            },
            showInvoiceDetail(row, event, column) {
                this.invoiceDetail = {
                    visible: true,
                    code: row.code
                }
            },
            tabChange(item) {
                this.tabActive = item.value
                switch (item.value) {
                    case 0:
                        this.getContractList()
                        break
                    case 1:
                        this.getInvoiceList()
                        break
                    case 2:
                        this.getLinkmanList()
                        break
                    case 3:
                        this.getFileList()
                        break
                    case 4:
                        this.getReceivableList()
                        break
                }

            },
            //获取案件文书列表
            getFileList() {
                let params = {}
                params.cid = this.baseData.id
                params.type = 2
                this.$fetch.api_file.cfileList(params)
                    .then(
                        ({
                             data,
                             msg
                         }) => {
                            this.auth = data.auth
                            this.tableData = data.data
                            this.pageData.pageSize = parseInt(data.per_page)
                            this.pageData.total = data.total
                        }
                    )
                    .catch((msg) => {

                    })
            },
            getContractList() {
                let params = {}
                if (this.routeName === 'projectCode') {
                    params.pr_id = this.baseData.id
                } else {
                    params.cl_id = this.baseData.id
                }
                this.$fetch.api_contract.contractList(params)
                    .then(({
                               data
                           }) => {
                        this.contractData = data.data
                        this.pageData.pageSize = parseInt(data.per_page)
                        this.pageData.total = data.total
                    })

            },
            getInvoiceList() {
                let params = {}
                if (this.routeName === 'projectCode') {
                    params.pr_id = this.baseData.id
                } else {
                    params.cl_id = this.baseData.id
                }
                this.$fetch.api_invoice.invoiceList(params)
                    .then(({
                               data
                           }) => {
                        this.invoiceData = data.data
                        this.pageData.pageSize = parseInt(data.per_page)
                        this.pageData.total = data.total

                    })
                    .catch(({
                                msg
                            }) => {
                        this.$message.error(msg)
                    })
            },
            getLinkmanList(params = {}) {
                params.sdata = JSON.stringify({cl_id: this.baseData.id})
                this.loading = true
                this.$fetch.api_linkman.linkmanList(params)
                    .then(({
                               data
                           }) => {
                        //权限
                        this.loading = false
                        this.linkmanData = data.data
                        this.pageData.pageSize = parseInt(data.per_page)
                        this.pageData.total = data.total

                    })
                    .catch(({
                                msg
                            }) => {
                        this.$message.error(msg)
                    })
            },

            //分页操作
            // pageChange(data) {
            //     let params = {
            //         pageSize: data.pageSize,
            //         page: data.currentPage
            //     }
            //     switch (this.tabActive) {
            //         case 0:
            //             this.getLinkmanList(params)
            //
            //             break
            //         case 1:
            //             this.getContractList(params)
            //
            //             break
            //         case 2:
            //             this.getInvoiceList(params)
            //             break
            //     }
            //
            // }
        }

    }
</script>

