<template>
    <div class="batch-my">
        <div class="search-box">
            <el-form :model="form"  label-position="right" :rules="rules" ref="form" label-width="80px"
                     class="">
                <el-row :gutter="10">
                    <el-col :lg="6" :xl="4">
                        <el-form-item label="客户名称" prop="client_id">
                            <el-select v-model="form.client_id" @change="clientChange" filterable style="width: 100%">
                                <el-option
                                    v-for="item in client_arr"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :xl="4">
                        <el-form-item label="项目名称" prop="project_id">
                            <el-select v-model="form.project_id" @change="projectChange" filterable style="width: 100%">
                                <el-option
                                    v-for="item in project_arr"
                                    :key="item.id"
                                    :label="item.pr_name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :xl="4">
                        <el-form-item label="委案批次" prop="batch_id">
                            <el-select v-model="form.batch_id" filterable style="width: 100%">
                                <el-option
                                    v-for="item in batch_arr"
                                    :key="item.id"
                                    :label="item.batch"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :xl="4">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :xl="4">
                        <el-form-item label="身份证号" prop="name">
                            <el-input v-model="form.idcard"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :xl="4">
                        <el-form-item label="卡号" prop="name">
                            <el-input v-model="form.card_num"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :xl="4">
                        <el-form-item label="委案日期">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.weian_time_s"
                                            style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :xl="4">
                        <el-form-item label="开庭时间">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.kaiting_time"
                                            style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :xl="4">
                        <el-form-item label="处理类型" prop="h_type">
                            <el-input v-model="form.h_type"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :xl="4">
                        <el-form-item label="结案状态" prop="ja_status">
                            <el-input v-model="form.ja_status"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :xl="4">
                        <el-form-item>
                            <el-button type="primary" style="width: 50%" @click="search('form')">查找</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="table-prefix mg-bottom-10">
            <el-radio-group class="mg-right-20" v-model="filterValue" @change="changeFilter" size="mini" fill="#85AFC1">
                <el-radio-button :label="10">展示10列</el-radio-button>
                <el-radio-button :label="20">展示20列</el-radio-button>
            </el-radio-group>
            <el-button type="text" :disabled="!ids" size="mini" class="mg-right-20" @click="share('form')">
                <i class="iconfont ft-16 icon-daochu1 mg-right-10"></i>
                <span class="ft-16 ">批量操作</span>
            </el-button>
            <el-button type="text" v-if="!export_btn" size="mini" disabled class="mg-right-20">
                <i class="iconfont ft-16 icon-daochu1 mg-right-10"></i>
                <span class="ft-16 ">导出excel</span>
            </el-button>
            <a :href="url+'exportBatchcase?token='+mytoken+export_url" v-if="export_btn" class="co-409EFF">
                <el-button type="text" size="mini">
                    <i class="iconfont ft-16 icon-daochu1 mg-right-10"></i>
                    <span class="ft-16 ">导出excel</span>
                </el-button>
            </a>
        </div>
        <div class="table-box">
            <el-table
                
                v-loading="loading"
                element-loading-text="拼命加载中"
                ref="multipleTable"
                :data="table_data"
                highlight-current-row
                header-row-class-name="batch-thead"
                fit
                border
                max-height="800"
                :row-key="getRowKeys"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    fixed="left"
                    :reserve-selection="true">
                </el-table-column>
                <el-table-column
                    label="序号"
                    type="index">
                </el-table-column>
                <el-table-column
                    :label="item.title"
                    v-for="item in table_header"
                    :prop="item.key"
                    :key="item.title"
                    v-if="item.is_show===1"
                >
                </el-table-column>
                <el-table-column
                    label="操作"
                    fixed="right"
                    prop="operate">
                    <template slot-scope="scope">
                        <el-button class="co-darkblue" type="text" size="mini"
                                   @click="openDetailDialog(scope.row)">
                            查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <page :page-data="pageData" v-on:pageEvent="pageChange" class="mat-15 mab-40 text-right"></page>
            <!--批量操作弹窗-->
        </div>

        <el-dialog title="批量操作" :visible.sync="dialogFormVisible" width="400px">
            <el-form label-width="80px" ref="dialog_form"  :model="dialog_form" :rules="dialog_rules">
                <!--:model="form"-->
                <div class="share-col">
                    <el-form-item label="" label-width="13px">
                        <div class="">您已选择
                            <strong class="ft-14 co-1f2f3d ">{{ids_length}}</strong>
                            条案件
                        </div>
                    </el-form-item>
                    <el-form-item label="选择字段" prop="key">
                        <el-select v-model="dialog_form.key" placeholder="请选择" filterable style="width: 100%">
                            <el-option
                                v-for="item in table_header"
                                :key="item.key"
                                :label="item.title"
                                :value="item.key"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设置值" prop="value">
                        <el-input v-model="dialog_form.value"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <p class="ft-12 co-AFB9C3">
                            最多输入16个汉字或32个字母、数字
                            时间格式：2017-01-01 00:00:01
                        </p>
                    </el-form-item>
                </div>
                <div class="text-right">
                    <el-button type="primary"  @click="saveDialogForm('dialog_form')">
                        保存
                    </el-button>
                    <el-button plain  @click="resetDialogForm('dialog_form')">
                        重置
                    </el-button>
                </div>
            </el-form>
        </el-dialog>
        <!--弹出的详情页-->
        <batch-detail :batch-data="batchData"></batch-detail>
    </div>
</template>

<script>
    import store from 'store'
    import { server_base_url } from 'common/config'
    import { batchDetail } from 'components'
    import { page } from 'components'

    export default {
        components: {
            page,
            batchDetail
        },
        data () {
            return {

                getRowKeys (row) {
                    return row.id
                },
                base_header: [],
                filterValue: '',
                batchData: {},
                row_less_10: true,
                dialog_form: {
                    key: '',
                    value: ''
                },
                loading: false,
                params: {},
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                ids: '',
                ids_arr: [],
                ids_length: '',
                dialogFormVisible: false,
                mytoken: store.state.user_info.token,
                url: server_base_url,
                table_data: [],
                table_header: [],
                client_arr: [],
                temp_project_arr: [],
                project_arr: [],
                temp_batch_arr: [],
                batch_arr: [],
                export_btn: false,
                export_url_params: '',
                myCal: '',
                form: {
                    client_id: '',
                    project_id: '',
                    batch_id: '',
                    name: '',
                    idcard: '',
                    card_num: '',
                    weian_time_s: '',
                    weian_time_e: '',
                    h_type: '',
                    ja_status: ''
                },
                dialog_rules: {
                    key: [
                        { required: true, message: '必选项' }
                    ],
                    value: [
                        { required: true, message: '必填项' }
                    ]
                },
                rules: {
                    project_id: [
                        { required: true, message: '必选项' }
                    ],
                    client_id: [
                        { required: true, message: '必选项' }
                    ],
                    batch_id: [
                        { required: true, message: '必选项' }

                    ]

                }
            }
        },
        created () {
            this.get_base_search()
        },
        mounted () {

        },
        computed: {
            export_url: function () {
                return this.export_url_params + '&case_ids=' + this.ids
            }
        },
        methods: {

            changeFilter (val) {
                console.log('val---', val)
                let base = JSON.parse(JSON.stringify(this.base_header))
                this.table_header = []
                this.table_header = base.splice(0, val)
                console.log('this.table_header', this.table_header)

            },


            //打开共享案件窗口
            share (row) {
                this.dialogFormVisible = true
            },
            resetDialogForm (formName) {
                this.$refs[formName].resetFields()
            },
            //表格多选--reserve-selection
            handleSelectionChange (val) {
                //每次改变要先清空
                this.ids_arr = []
                this.ids = ''
                //设置值
                for (let i in val) {
                    this.ids_arr.push(val[i].id)
                }
//                console.log('this.ids_arr',this.ids_arr)
                this.ids_length = val.length
                this.ids = this.ids_arr.join(',')
//                console.log('this.ids',this.ids)

            },
            //批量操作
            saveDialogForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    let sub_form = {}
                    sub_form[this.dialog_form.key] = this.dialog_form.value
                    this.$fetch.api_batch.case_put(this.ids, sub_form)
                        .then(({
                                   msg
                               }) => {
                            this.$message.success(msg)
                            //更新表格数据
                            for (let i in this.table_data) {
                                for (let j in this.ids_arr) {
                                    if (this.ids_arr[j] === this.table_data[i].id) {
                                        this.table_data[i][this.dialog_form.key] = this.dialog_form.value
                                    }
                                }
                            }
                            this.dialogFormVisible = false
                        })
                        .catch(({
                                    msg
                                }) => {
                            this.$message.warning(msg)
                        })
                })
            },
            //获取搜索栏基础数据
            get_base_search () {
                this.$fetch.api_batch.baseSearchData()
                    .then(({
                               data
                           }) => {
                        this.client_arr = data.client_arr
                        this.temp_project_arr = data.project_arr
                        this.temp_batch_arr = data.batch_arr

                        //如果是从列表页跳转过来
                        //根据url参数展示默认数据
                        let route_client_id = this.$route.query.client_id
                        if (route_client_id) {
                            //根据客户id，取出对应的项目列表
                            this.form.client_id = parseInt(route_client_id)
                            for (let i in this.temp_project_arr) {
                                if (this.form.client_id === this.temp_project_arr[i].client_id) {
                                    this.project_arr.push(this.temp_project_arr[i])
                                }
                            }
                            //根据项目id,取出对应的批次列表
                            this.form.project_id = parseInt(this.$route.query.project_id)
                            for (let i in this.temp_batch_arr) {
                                if (this.form.project_id === this.temp_batch_arr[i].project_id) {
                                    this.batch_arr.push(this.temp_batch_arr[i])
                                }
                            }
                            this.form.batch_id = this.$route.query.batch_id
                            this.params = this.form
                            //根据三个id，获取批次详情
                            this.getList()
                        }

                    })
                    .catch(({
                                msg
                            }) => {
                        this.$message.warning(msg)
                    })
            },
            //获取列表
            getList () {
                this.loading = true
                this.$fetch.api_batch.caseList(this.params)
                    .then(({
                               data
                           }) => {
                        this.loading = false
                        this.table_data = data.data.data
                        console.log(' this.table_data --', this.table_data)
                        this.table_header = data.header_arr
                        this.base_header = data.header_arr
                        //分页
                        this.pageData.pageSize = parseInt(data.data.per_page)
                        this.pageData.total = data.data.total
                        this.export_btn = true
                        this.export_url_params = '&client_id=' + this.form.client_id + '&project_id=' + this.form.project_id +
                            '&batch_id=' + this.form.batch_id + '&name=' + this.form.name + '&idcard=' + this.form.idcard + '&card_num=' + this.form.card_num +
                            '&weian_time_s=' + this.form.weian_time_s + '&weian_time_e=' + this.form.weian_time_e + '&h_type=' + this.form.h_type +
                            '&ja_status=' + this.form.ja_status
                    })
                    .catch(({
                                msg
                            }) => {
                        this.loading = false
                        this.$message.warning(msg)
                    })
            },
            //分页操作
            pageChange (data) {
                this.params.pageSize = data.pageSize
                this.params.page = data.currentPage
                this.getList()
            },

            //根据客户选择对应的项目
            clientChange (val) {
                //每次必先清空项目数组,上次选中的项目id
                this.form.project_id = ''
                this.form.batch_id = ''

                this.project_arr = []
                for (let i in this.temp_project_arr) {
                    if (val === this.temp_project_arr[i].client_id) {
                        this.project_arr.push(this.temp_project_arr[i])
                    }
                }

            },
            //根据项目选择对应的批次号
            projectChange (val) {
                //每次必先清空项目数组,上次选中的项目id
                this.form.batch = ''

                this.batch_arr = []
                for (let i in this.temp_batch_arr) {
                    if (val === this.temp_batch_arr[i].project_id) {
                        this.batch_arr.push(this.temp_batch_arr[i])
                    }
                }
            },
            //点击筛选
            search (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    this.params = this.form
                    this.getList()
                })
            },
//            侧边栏展示,传当前点击数据
            openDetailDialog (data) {
                this.batchData = {
                    visible: true,
                    data: data,
                    title: this.table_header
                }
//                let rand = Math.random(188, 299999)
//                this.myCal = [data, rand, this.table_header]
            },

            resetForm (formName) {
                this.$refs[formName].resetFields()
            }

        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>

</style>
