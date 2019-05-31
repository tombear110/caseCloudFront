<template>

    <el-dialog :title="title" :visible.sync="visible" width="900px" custom-class="approval-dialog" top="5vh">
        <ul class="step-group" v-loading="loading">
            <!--冲突处理，合同审批-->
            <li class="item" v-if="type !== 3">
                <span class="step-circle"></span>
                <span class="step-line"></span>
                <div class="step-main">
                    <span class="sm-label">{{tableTitle}}：</span>
                    <ul class="sm-group">
                        <li class="item-text">
                            <span class="it-label">案件名称</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{linkidData.case_name}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">案件类别</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{linkidData.type_text}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">案由</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{linkidData.anyou}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">主办律师</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{linkidData.host}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">协办律师</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{linkidData.assit}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">委案日期</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{linkidData.wa_time}}</span>
                        </li>
                    </ul>
                </div>
            </li>
            <li class="item" v-if="type !== 3">
                <span class="step-circle"></span>
                <span class="step-line"></span>
                <div class="step-main">
                    <span class="sm-label">简介：</span>
                    <p>{{linkidData.case_summary}}</p>
                </div>
            </li>
            <li class="item" v-if="type !== 3">
                <span class="step-circle"></span>
                <span class="step-line"></span>
                <div class="step-main">
                    <span class="sm-label">当事人：</span>
                    <div class="sm-conflict">
                        <el-table
                            :data="baseData.firmprivyc_list"
                            size="small-short"
                            style="width: 90%">
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <el-row v-if="props.row.dsr_type === 1" class="mg-bottom-15">
                                        <el-col :span="6">
                                            <div>
                                                <span>民族：</span>
                                                <span>{{ props.row.nation }}</span>
                                            </div>
                                        </el-col>
                                        <el-col :span="6">
                                            <div>
                                                <span>性别：</span>
                                                <span v-if=" props.row.sex ===0 ">男</span>
                                                <span v-else>女</span>
                                            </div>
                                        </el-col>
                                        <el-col :span="6">
                                            <div>
                                                <span>证件号：</span>
                                                <span>{{ props.row.card_num }}</span>
                                            </div>
                                        </el-col>
                                        <el-col :span="6">
                                            <div>
                                                <span>地址：</span>
                                                <span>{{ props.row.address }}</span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row v-if="props.row.dsr_type === 1" class="mg-bottom-15">
                                        <el-col :span="24">
                                            <div style="display: flex">
                                                <span>备注：</span>
                                                <span style="flex: 1">{{ props.row.mark }}</span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row v-if="props.row.dsr_type === 2" class="mg-bottom-15">
                                        <el-col :span="8">
                                            <div>
                                                <span class="expand-label">法定代表人：</span>
                                                <span>{{ props.row.address }}</span>
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div>
                                                <span class="expand-label">统一社会信用代码：</span>
                                                <span>{{ props.row.card_num }}</span>
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div>
                                                <span class="expand-label">地址：</span>
                                                <span>{{ props.row.address }}</span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row v-if="props.row.dsr_type === 2">
                                        <el-col :span="24">
                                            <div style="display: flex">
                                                <span class="expand-label">备注：</span>
                                                <span style="flex: 1">{{ props.row.mark }}</span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="名称"
                                prop="name">
                            </el-table-column>
                            <el-table-column
                                label="类别">
                                <template slot-scope="scope">
                                    <span v-if=" scope.row.dsr_type === 1">个人</span>
                                    <span v-else>企业</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="委托人">
                                <template slot-scope="scope">
                                    <span v-if=" scope.row.type === 1">是</span>
                                    <span v-else>否</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="联系方式"
                                prop="phone">
                            </el-table-column>
                            <el-table-column
                                label="属性">
                                <template slot-scope="scope">
                                    <span v-if=" scope.row.c_type === 1">原告</span>
                                    <span v-else-if=" scope.row.c_type === 2">被告</span>
                                    <span v-else-if=" scope.row.c_type === 3">第三人</span>
                                    <span v-else>案件对接人</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </li>
            <li class="item" v-if="type === 2">
                <span class="step-circle"></span>
                <span class="step-line"></span>
                <div class="step-main">
                    <span class="sm-label">待审核的文件：</span>
                    <div class="sm-content">
                        <a class="sm-file" v-for="item in linkidData.firmfile_list" :key="item.id"
                           :href="url+'downloadFirmfile/'+item.id+'?token='+mytoken"
                           target="_blank">
                            <i class="iconfont  icon-fileempty co-666 pd-right-5"></i>
                            <span class="nowrap co-333 pd-right-5">{{item.name}}</span>
                            <i class="iconfont  icon-xiazai co-409EFF"></i>
                        </a>
                    </div>
                </div>
            </li>
            <li class="item" v-if="type ===1 ">
                <span class="step-circle"></span>
                <span class="step-line"></span>
                <div class="step-main">
                    <span class="sm-label">检索：</span>
                    <div class="sm-conflict">
                        <div class="list-group">
                            <div class="form-title">可能与之有冲突的案件</div>
                            <div class="form-control">
                                <el-form ref="searchForm" :model="searchForm" :rules="searchRules" :inline="true"
                                         class="demo-form-inline" size="mini">
                                    <el-form-item label="当事人" prop="name">
                                        <el-input v-model="searchForm.name"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="openSearchDialog('searchForm')" plain>查询
                                        </el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <div class="table">
                            <el-table
                                :data="privycData"
                                size="small-short"
                                style="width: 90%">
                                <el-table-column
                                    prop="name"
                                    label="当事人名称">
                                </el-table-column>
                                <el-table-column
                                    prop="type"
                                    label="委托人">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.type === 1">是</span>
                                        <span v-else>否</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="c_type"
                                    label="属性">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.c_type === 1">原告</span>
                                        <span v-else-if="scope.row.c_type === 2">被告</span>
                                        <span v-else-if="scope.row.c_type === 3">第三人</span>
                                        <span v-else>案件对接人</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="case_name"
                                    label="案件名称">
                                </el-table-column>
                                <el-table-column
                                    prop="type_text"
                                    label="案件类别">
                                </el-table-column>
                                <el-table-column
                                    prop="host"
                                    label="主办律师">
                                </el-table-column>
                                <el-table-column
                                    prop="wa_time_text"
                                    label="委案日期">
                                </el-table-column>
                                <el-table-column
                                    prop="ja_time_text"
                                    label="结案日期">
                                </el-table-column>
                                <!--<el-table-column-->
                                    <!--prop="status"-->
                                    <!--label="状态">-->
                                    <!--<template slot-scope="scope">-->
                                        <!--<span v-if="scope.row.status === 0">正在处理</span>-->
                                        <!--<span v-else-if="scope.row.status === 1">通过</span>-->
                                        <!--<span v-else>不通过</span>-->
                                    <!--</template>-->
                                <!--</el-table-column>-->
                            </el-table>
                        </div>
                    </div>
                </div>
            </li>
            <!--文件报审-->
            <li class="item" v-if="type === 3">
                <span class="step-circle"></span>
                <span class="step-line"></span>
                <div class="step-main">
                    <span class="sm-label">报审信息：</span>
                    <ul class="sm-group">
                        <li class="item-text">
                            <span class="it-label">报审人</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{linkidData.case_name}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">文书类型</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{linkidData.type_text}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">报审时间</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{linkidData.anyou}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">盖章分数</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{linkidData.stamp_num}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">盖章类型</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{linkidData.stamp_type}}</span>
                        </li>
                    </ul>
                </div>
            </li>
            <li class="item" v-if="type === 3">
                <span class="step-circle"></span>
                <span class="step-line"></span>
                <div class="step-main">
                    <span class="sm-label">备注：</span>
                    <p>{{linkidData.mark}}</p>
                </div>
            </li>
            <li class="item" v-if="type === 3">
                <span class="step-circle"></span>
                <span class="step-line"></span>
                <div class="step-main">
                    <span class="sm-label">待审核的文件：</span>
                    <div class="sm-content">
                        <a :href="url+'downloadFirmfile/'+baseData.linkid+'?token='+mytoken"
                           target="_blank">
                            <i class="iconfont  icon-fileempty co-666 pd-right-5"></i>
                            <span class="nowrap co-333 pd-right-5">{{linkidData.name}}</span>
                            <i class="iconfont  icon-xiazai co-409EFF"></i>
                        </a>
                    </div>
                </div>
            </li>
            <!--公用-->
            <li class="item">
                <span class="step-circle"></span>
                <span class="step-line"></span>
                <div class="step-main">
                    <span class="sm-label">处理结果：</span>
                    <div class="sm-conflict">
                        <div class="mg-bottom-15">请根据上面的检索结果及实际情况进行反馈</div>
                        <div class="">
                            <el-form ref="form" :model="form" :rules="rules" label-width="70px" size="mini"
                                     label-position="left">
                                <el-form-item label="状态" prop="res_status">
                                    <el-radio-group v-model="form.res_status">
                                        <el-radio :label="0">等待审批</el-radio>
                                        <el-radio :label="1">审核通过</el-radio>
                                        <el-radio :label="2">审核不通过</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="处理意见" prop="comments">
                                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 7}"
                                              v-model="form.comments"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary"  @click="putFormData('form')">反馈结果</el-button>
                <el-button type=""  plain @click="visible = false">取消</el-button>
        </span>
    </el-dialog>
</template>
<script>

    import { mapGetters, mapActions } from 'vuex'
    import { SET_EDIT_DATA } from 'store/actions/type'
    import store from 'store'
    import { server_base_url } from 'common/config'

    export default {
        props: ['taskDetail', 'openStatus'],
        data () {
            return {
                visible:false,
                title: '',
                tableTitle: '',
                records: [],
                searchForm: {
                    name: ''
                },
                searchRules: {
                    name: [
                        { required: true, message: '必填项', trigger: 'blur' }
                    ]
                },
                baseData: {},
                dialogForm: {},
                conflictLawyerOptions: [],
                dialogFormVisible: false,
                privycData: [],
                apprvalId: '',
                rules: {
                    res_status: [
                        { required: true, message: '必填项', trigger: 'change' }
                    ]
                },
                form: {
                    res_status: 0,
                    comments: ''
                },
                linkidData: {},
                loading: false,
                url: server_base_url,
                sideout: 0,
                type: '',
                mytoken: store.state.user_info.token

            }
        },

        watch: {
            taskDetail (val) {
                console.log('pdata-val', val)
                this.visible = val.visible
                this.type = val.type
                this.titleText(val.type)
                this.apprvalId = val.id
                this.getLookData(val.id)
            },
            openStatus (val) {
                this.sideout = val[0]
            }
        },
        methods: {
            titleText (type) {
                switch (type) {
                    case 1:
                        this.title = '冲突处理'
                        this.tableTitle = '案件信息'
                        break
                    case 2:
                        this.title = '合同审批'
                        this.tableTitle = '合同信息'
                        break
                    case 3:
                        this.title = '文件审批'
                        this.tableTitle = '报审信息'
                        break
                }
            },

            openSearchDialog (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {return false}
                    this.dialogFormVisible = true
                    this.loading = true
                    this.$fetch.api_lawprivyc.list(
                        {
                            name: this.searchForm.name
                        }
                    )
                        .then(({ data, msg }) => {
                            this.loading = false
                            this.privycData = data.data
                            if (data.data.length === 0) {
                                this.$message.info('暂无数据')
                            }
                        })
                        .catch(({ msg }) => {
                            this.loading = false
                            this.$message.error(msg)
                        })
                })
            },
            putFormData (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {return false}
                    this.loading = true
                    this.$fetch.api_apprval.put(this.apprvalId, this.form)
                        .then(({
                                   data,
                                   msg
                               }) => {
                            this.loading = false
                            this.$message.success(msg)
                            //关闭，更新列表页数据
                            this.visible = false
                            this.$emit('refreshStatus',
                                {
                                    isRefresh: true
                                })
                        })
                        .catch(() => {
                            this.loading = false
                        })
                })
            },
            ...mapActions({
                set_edit_data: SET_EDIT_DATA
            }),
            //获取详情
            getLookData (id) {
                //打开sidebox，清空表单
                this.form = {
                    res_status: 0,
                    comments: ''
                }
                this.$fetch.api_apprval.look(id)
                    .then(({
                               data
                           }) => {
                        this.form.res_status = data.res_status
                        this.form.comments = data.comments
                        this.baseData = data
                        this.linkidData = data.linkid_info
                    })
                    .catch(() => {
                        this.loading = false
                    })
            },

            //点击左侧栏，关闭
            closeSidebox () {
                this.sideout = 0
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>


