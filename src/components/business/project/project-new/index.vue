<template>
    <el-dialog :title="title" :visible.sync="visible" :close-on-click-modal="false" width="800px"
               class="collapse-dialog" @close="closeDialog">
        <el-form :model="form" :rules="rules" ref="form" v-loading="loading"
                 element-loading-text="拼命加载中" label-width="80px" class="collapse-form">
            <div class="form-section">
                <h3>项目基本信息</h3>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="项目名称" prop="pr_name">
                            <el-input v-model="form.pr_name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="项目类型" prop="pr_type" class="form-border-left">
                            <el-select v-model="form.pr_type" placeholder="请选择" filterable style="width: 100%">
                                <el-option
                                    v-for="item in pr_type_arr"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id"
                                    :disabled="item.disabled">
                                    <span style="float: left">{{ item.title }}</span>
                                    <span style="float: right; color: #C0C4CC; font-size: 13px">{{ item.text }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="关联客户" prop="cl_id" class="form-border-left">
                            <el-select v-model="form.cl_id" placeholder="请选择" clearable
                                       style="width: 100%" filterable>
                                <el-option
                                    v-for="item in client_arr"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="开始时间" prop="start_time">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.start_time"
                                            style="width: 100%"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            @change="changeStartTime"
                                            :editable="false"
                                            :clearable="false"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结束时间" prop="end_time">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.end_time"
                                            style="width: 100%"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            :picker-options="pickerOptions1"
                                            :editable="false"
                                            :clearable="false"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="主办律师" prop="host">
                            <el-select v-model="form.host" placeholder="请选择" filterable style="width: 100%">
                                <el-option
                                    v-for="item in host_arr"
                                    :key="item.id"
                                    :label="item.real_name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="协办律师" prop="assit" style="width: 100%">
                            <el-select v-model="form.assit" placeholder="请选择" multiple clearable filterable
                                       style="width: 100%"
                                       collapse-tags>
                                <el-option
                                    v-for="item in assist_arr"
                                    :key="item.id"
                                    :label="item.real_name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="项目经费" prop="funding">
                            <el-input v-model.number="form.funding">
                                <template slot="append"> 元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="项目状态" prop="pr_status">
                            <el-radio-group v-model="form.pr_status">
                                <el-radio :label="1">进行中</el-radio>
                                <el-radio :label="2">已结束</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="备注" prop="mark" class="project-input">
                            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" placeholder="请输入内容"
                                      v-model="form.mark" class="textarea">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <div class="text-center co-9FA5B9 cursor" v-if="!isMore" @click="isMore = true ">
                <span class="ft-14 mg-right-5">添加更多项目信息</span>
                <i class="iconfont icon-zhankai-copy ft-14"></i>
            </div>
            <div class="form-section" v-if="isMore">
                <h3 v-if="isCreated">项目联系人</h3>
                <el-row :gutter="20" v-if="isCreated" v-for="(priv1,index) in priv1s"
                        v-model="priv1.value"
                        :key="priv1.key"
                        :label="'名称' + index">
                    <el-col :span="12">
                        <el-form-item label="姓名" class="form-border-left">
                            <el-input v-model="priv1.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话">
                            <el-input v-model="priv1.mobile"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱">
                            <el-input v-model="priv1.email"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="办公地址" prop="address"
                                      class=" form-border-left form-border-bottom">
                            <el-input v-model="priv1.address"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注" class="row-2x form-border-bottom form-item-mark">
                            <el-input v-model="priv1.remark"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" class="text-right mg-bottom-20">
                        <div class="ft-14 text-danger cursor" style="display: inline-block" v-if="index!==0"
                             @click="removePriv1(priv1)">
                            <i class="iconfont icon-shibai mg-right-5"></i>
                            <span>删除联系人</span>
                        </div>
                        <div class="ft-14 text-info cursor" style="display: inline-block" v-if="index===0"
                             @click="addPriv1">
                            <i class="iconfont icon-add mg-right-5"></i>
                            <span>添加联系人</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-form>
        <div slot="footer" class="text-center">
            <el-button type="primary" @click="onSubmit('form')">保存</el-button>
            <el-button @click="visible= false" plain>关闭</el-button>
        </div>
    </el-dialog>

</template>

<script>
    import store from 'store'

    export default {
        props: ['projectNew', 'editData'],
        data() {
            return {
                isMore: false,
                pickerOptions1: {
                    disabledDate: (time) => {
                        let pick_time = time.getTime() - 24 * 3600 * 1000
                        let select_time = this.$dayjs(this.form.start_time).valueOf()
                        return pick_time < select_time
                    }
                },
                priv1s: [{
                    name: '',
                    mobile: '',
                    email: '',
                    address: '',
                    remark: ''
                }],
                isCreated: 0,
                visible: false,
                userId: store.state.user_info.user.id,
                loading: false,
                client_arr: [],
                pr_type_arr: [],
                host_arr: [],
                assist_arr: [],
                form: {
                    cl_id: '',
                    pr_type: '',
                    pr_name: '',
                    start_time: this.$dayjs().format('YYYY-MM-DD'),
                    end_time: '',
                    pr_status: 1,
                    host: '',
                    assit: [],
                    mark: ''
                },
                baseData: {},
                rules: {
                    pr_name: [
                        {required: true, message: '必填项', trigger: 'change'}
                    ],
                    pr_type: [
                        {required: true, message: '请选择其中一项'}
                    ],
                    host: [
                        {required: true, message: '请选择其中一项'}
                    ]
                }

            }
        },
        watch: {
            projectNew(val) {
                this.isCreated = 1
                this.visible = val.visible
                //如果在客户详情页新建项目，则带上客户
                this.getCreateData()
            },
            editData(val) {
                this.isCreated = 0
                this.visible = val.visible
                this.getEditData(val.code)
            }
        },
        computed: {
            title() {
                let result = ''
                if (this.isCreated === 0) {
                    result = '编辑项目'
                } else {
                    result = this.$route.name === 'projectLawsuit' ? '新建诉讼项目' : '新建非诉项目'
                }
                return result
            }
        },
        methods: {
            //关闭弹窗，重置data
            closeDialog() {
                // Object.assign(this.$data, this.$options.data())
                this.form = {
                    cl_id: '',
                    pr_type: '',
                    pr_name: '',
                    start_time: this.$dayjs().format('YYYY-MM-DD'),
                    end_time: '',
                    pr_status: 1,
                    host: '',
                    assit: [],
                    mark: ''
                }
                this.priv1s = [{
                    name: '',
                    mobile: '',
                    email: '',
                    address: '',
                    remark: ''
                }]
                this.isMore = false
            },

            //动态增加表单1
            addPriv1() {
                this.priv1s.push({
                    name: '',
                    mobile: '',
                    email: '',
                    address: '',
                    remark: ''
                })
            },

            handlePrivycDelete(item) {
                this.$fetch.api_case.privycDelete(item.id)
                    .then(({
                               data,
                               msg
                           }) => {
                        let index = this.priv1s.indexOf(item)
                        if (index !== -1) {
                            this.priv1s.splice(index, 1)
                        }
                    })
            },
            //动态移除表单1
            removePriv1(item) {
                if (item.id) {
                    //如果是编辑,则调用接口进行删除
                    this.$confirm('确认删除该当事人, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.handlePrivycDelete(item)

                    }).catch(() => {
                        this.$message.info('已取消删除')
                    })
                } else {
                    //如果是新增，直接删除
                    let index = this.priv1s.indexOf(item)
                    this.priv1s.splice(index, 1)
                }
            },

            //项目开始时间改变
            //若开始时间小与结束时间，则清空结束时间
            changeStartTime(val) {
                let start = this.$dayjs(val).valueOf()
                let end = this.$dayjs(this.form.end_time).valueOf()
                if (start >= end) {
                    this.form.end_time = ''
                }

            },

            //创建---获取基础数据
            getCreateData() {
                this.$fetch.api_project.projectCreate()
                    .then(({
                               data
                           }) => {
                        this.client_arr = data.client_arr
                        this.host_arr = data.team_lawyers
                        this.assist_arr = data.team_lawyers
                        const routeName = this.$route.name
                        //如果是诉讼项目，则项目类型前三项去掉
                        if (routeName === 'projectLawsuit') {
                            data.pr_type = data.pr_type.map((item, index) => {
                                item.text = index < 3 ? '非诉' : ''
                                item.disabled = index < 3
                                return item
                            })
                        }
                        this.pr_type_arr = data.pr_type
                        this.form.host = store.state.user_info.user.id
                    })


            },

            //若是项目编辑--渲染编辑页数据
            getEditData(code) {
                //编辑时禁止修改客户
                this.loading = true
                this.$fetch.api_project.projectEdit(
                    code
                )
                    .then(({
                               data
                           }) => {
                        this.loading = false
                        this.isMore = true
                        this.baseData = data.pr_data
                        this.client_arr = data.client_arr
                        //如果是诉讼项目，则项目类型前三项禁用
                        if (data.pr_data.type === 1) {
                            data.pr_type = data.pr_type.map((item, index) => {
                                item.text = index < 3 ? '非诉' : ''
                                item.disabled = index < 3
                                return item
                            })
                        }
                        this.pr_type_arr = data.pr_type

                        this.host_arr = data.team_lawyers
                        this.assist_arr = data.team_lawyers
                        let assitArr = []
                        if (data.pr_data.assit) {
                            let temp_arr = data.pr_data.assit.split(',')
                            let temp = []
                            for (let i in temp_arr) {
                                temp.push(parseInt(temp_arr[i]))
                            }
                            assitArr = temp
                        }

                        this.form = {
                            pr_name: data.pr_data.pr_name,
                            pr_type: data.pr_data.pr_type,
                            cl_id: data.pr_data.cl_id,
                            start_time: data.pr_data.start_time,
                            end_time: data.pr_data.end_time,
                            host: data.pr_data.host,
                            assit: assitArr,
                            funding: data.pr_data.funding,
                            pr_status: data.pr_data.pr_status,
                            mark: data.pr_data.mark
                        }
                    })
                    .catch(({
                                msg
                            }) => {
                        this.loading = false
                    })
            },

            //点击勾选全天，勾选结束时间，
            //提交表单
            onSubmit(formName) {
                //根据路由，在新建项目中加入项目类型 type
                const routeName = this.$route.name
                //如果在团队中新建，将type默认为2（非诉项目）
                let type = routeName === 'projectLawsuit' ? 1 : 2
                this.$refs[formName].validate((valid) => {
                    if (!valid) return false
                    if (this.isCreated === 1) {
                        let sub_form = this.form
                        sub_form.clcontact_data = JSON.stringify(this.priv1s)
                        sub_form.type = type
                        this.loading = true
                        this.$fetch.api_project.projectStore(sub_form)
                            .then(({
                                       msg,
                                       data
                                   }) => {
                                this.loading = false
                                this.visible = false
                                this.$router.push({
                                    name: 'projectCode',
                                    params: {
                                        code: data.pr_code
                                    }
                                })
                            })
                            .catch(({
                                        msg
                                    }) => {
                                this.loading = false
                            })
                    } else {
                        let id = this.baseData.id
                        let temp_form = JSON.parse(JSON.stringify(this.form))
                        temp_form.assit = temp_form.assit.join(',')
                        this.loading = true
                        this.$fetch.api_project.projectPut(temp_form, id)
                            .then(({
                                       msg
                                   }) => {
                                this.loading = false
                                this.visible = false
                                this.$emit('refreshData', temp_form)

                            })
                            .catch(({
                                        msg
                                    }) => {
                                this.loading = false
                            })
                    }

                })
            },
            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields()
                this.host_arr = []
                this.assist_arr = []
                this.pr_type_arr = []
            }
        }

    }
</script>
