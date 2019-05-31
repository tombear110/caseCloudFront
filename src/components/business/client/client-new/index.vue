<template>
    <el-dialog :title="isCreated===1 ? '新建客户':'编辑客户'" :visible.sync="visible" :close-on-click-modal="false"
               width="770px" class="collapse-dialog" @close="closeDialog">
        <el-form :model="form" :rules="rules" ref="form" v-loading="loading"
                 element-loading-text="拼命加载中" label-width="130px" class="collapse-form" >
            <div class="form-section">
                <h3>客户基本信息</h3>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="客户编号" prop="c_num">
                            <el-input v-model="form.c_num"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户标识" prop="mark">
                            <el-radio-group v-model="form.mark" :disabled="isCreated===0">
                                <el-radio :label="2">个人</el-radio>
                                <el-radio :label="1">企业</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="跟进人" prop="follower">
                            <el-select v-model="form.follower" placeholder="请选择" filterable>
                                <el-option
                                    v-for="item in follower_arr"
                                    :key="item.id"
                                    :label="item.real_name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属行业" prop="industry" class="form-border-left">
                            <el-cascader
                                v-model="form.industry"
                                :options="c_industry_options"
                                change-on-select
                                clearable
                            ></el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="客户类型" prop="type">
                            <el-select v-model="form.type">
                                <el-option
                                    v-for="item in typeOptions"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户来源" prop="from">
                            <el-select v-model="form.from" clearable="">
                                <el-option
                                    v-for="item in c_from_arr"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-if="form.mark===2">
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="name" class="form-border-left">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="民族" prop="nation">
                            <el-input v-model="form.nation"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别" prop="sex">
                            <el-select v-model="form.sex" clearable="">
                                <el-option
                                    v-for="item in sexOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="证件号码" prop="card_num" class="form-border-left">
                            <el-input v-model="form.card_num"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="住所地" prop="address">
                            <el-input v-model="form.address"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系方式" prop="contact">
                            <el-input v-model="form.contact"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-if="form.mark===1">
                    <el-col :span="12">
                        <el-form-item label="单位名称" prop="name" class="form-border-left">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="社会统一信用代码" prop="card_num">
                            <el-input v-model="form.card_num"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系方式" prop="contact">
                            <el-input v-model="form.contact"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="法定代表人" prop="legal_per">
                            <el-input v-model="form.legal_per"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="地址" prop="address">
                            <el-input v-model="form.address"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="备注" prop="description">
                            <el-input v-model="form.description" type="textarea"
                                      :autosize="{ minRows: 2, maxRows: 4}"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <div class="text-center co-9FA5B9 cursor" v-if="!isMore" @click="isMore = true ">
                <span class="ft-14 mg-right-5">添加更多客户信息</span>
                <i class="iconfont icon-zhankai-copy ft-14"></i>
            </div>
            <div class="form-section" v-if="isMore">
                <h3 v-if="isCreated">联系人信息</h3>
                <el-row :gutter="20" v-if="isCreated" v-for="(priv1,index) in priv1s"
                        v-model="priv1.value"
                        :key="priv1.key"
                        :label="'名称' + index">
                    <el-col :span="12">
                        <el-form-item label="姓名">
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
                        <el-form-item label="地址" prop="m_address">
                            <el-input v-model="priv1.address"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注">
                            <el-input v-model="priv1.remark" type="textarea"
                                      :autosize="{ minRows: 2, maxRows: 4}"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" class="text-right mg-bottom-20">
                        <div class="ft-14 text-danger cursor" v-if="index!==0" @click="removePriv1(priv1)">
                            <i class="iconfont icon-shibai mg-right-5"></i>
                            <span>删除联系人</span>
                        </div>
                        <div class="ft-14 text-info cursor" v-if="index===0" @click="addPriv1">
                            <i class="iconfont icon-add mg-right-5"></i>
                            <span>添加联系人</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-form>
        <div slot="footer" class="text-center">
            <el-button  type="primary" @click="submitForm('form')">提交</el-button>
            <el-button  @click="visible= false" plain>关闭</el-button>
        </div>
    </el-dialog>

</template>

<script>
    import store from 'store'

    export default {
        props: ['clientNew', 'clientEdit'],
        data () {
            return {
                isMore: false,
                sexOptions: [
                    { value: 0, label: '男' },
                    { value: 1, label: '女' }
                ],
                priv1s: [{
                    name: '',
                    mobile: '',
                    email: '',
                    address: '',
                    remark: ''
                }],
                isCreated: 1,
                code: '',
                title: '',
                visible: false,
                loading: false,
                edit_show: true,
                c_from_arr: [],
                c_industry_options: [],
                follower_arr: [],
                typeOptions: [
                    {
                        id: 1,
                        title: '签约客户'
                    }, {
                        id: 2,
                        title: '意向客户'
                    }, {
                        id: 3,
                        title: '潜在客户'
                    }
                ],
                mark_arr: [
                    {
                        id: 1,
                        title: '企业'
                    }, {
                        id: 2,
                        title: '个人'
                    }
                ],
                userId: store.state.user_info.user.id,
                form: {
                    c_num: '',
                    mark: 1,
                    follower: store.state.user_info.user.id,
                    industry: [],
                    type: 2,
                    from: ''
                },
                rules: {
                    name: [
                        { required: true, message: '必填项' }
                    ],
                    m_name: [
                        { required: true, message: '必填项' }
                    ],
                    // industry: [
                    //     { required: true, message: '必填项' }
                    // ],
                    mark: [
                        { required: true, message: '请选择其中一项' }
                    ],
                    follower: [
                        { required: true, message: '请选择其中一项' }
                    ]
                },
                baseData: {}
            }
        },
        watch: {

            clientNew (val) {
                this.visible = val.visible
                this.isCreated = 1
                this.getBaseData()
            },
            clientEdit (val) {
                this.visible = val.visible
                this.isCreated = 0
                this.getBaseData(val.code)
            }
        },
        methods: {
            closeDialog () {
                Object.assign(this.$data, this.$options.data())
                // this.isMore = false
            },
            //动态增加表单1
            addPriv1 () {
                this.priv1s.push({
                    name: '',
                    mobile: '',
                    email: '',
                    address: '',
                    remark: ''
                })
            },

            handlePrivycDelete (item) {
                this.$fetch.api_case.privycDelete(item.id)
                    .then(({
                               data,
                               msg
                           }) => {
                        this.$message.success(msg)
                        let index = this.priv1s.indexOf(item)
                        if (index !== -1) {
                            this.priv1s.splice(index, 1)
                        }
                    })
            },
            //动态移除表单1
            removePriv1 (item) {
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
            //获取创建客户基本数据
            getBaseData (code) {
                if (this.isCreated === 0) {  //当编辑的时候
                    this.edit_show = false
                    this.$fetch.api_client.clientEdit(code)
                        .then(({
                                   data
                               }) => {
                            this.isMore = true
                            this.c_from_arr = data.c_from
                            this.c_industry_options = data.c_industry
                            this.follower_arr = data.team_lawyers
                            //将字符串转化为数组，若为值为Null，则返回[]
                            let tempIndustry = data.client_data.industry ? data.client_data.industry.split(',').map(item => {
                                return parseInt(item)
                            }) : []
                            let temp1 = {
                                c_num: data.client_data.c_num,
                                mark: data.client_data.mark,
                                follower: data.client_data.follower,
                                industry: tempIndustry,
                                type: data.client_data.type,
                                from: data.client_data.from,
                                contact: data.client_data.contact
                            }
                            if (data.client_data.mark === 1) {
                                //企业
                                let temp2 = {
                                    name: data.client_data.name,
                                    address: data.client_data.address,
                                    legal_per: data.client_data.legal_per,
                                    card_num: data.client_data.card_num,
                                    description: data.client_data.description
                                }
                                this.form = Object.assign(temp1, temp2)

                            } else {
                                //个人
                                let temp2 = {
                                    name: data.client_data.name,
                                    nation: data.client_data.nation,
                                    sex: data.client_data.sex,
                                    address: data.client_data.address,
                                    card_num: data.client_data.card_num,
                                    description: data.client_data.description
                                }
                                this.form = Object.assign(temp1, temp2)
                            }
                            this.baseData = data.client_data
                        })
                } else {     //当新增的时候
                    this.$fetch.api_client.clientCreate()
                        .then(({
                                   data
                               }) => {
                            this.c_from_arr = data.c_from
                            this.c_industry_options = data.c_industry
                            this.form.c_num = data.num
                            //若用户未加入团队，则在空的跟进人列表中加入自己
                            if (store.state.user_info.user.team_id) {
                                this.follower_arr = data.team_lawyers
                            } else {
                                this.follower_arr = [
                                    {
                                        id: store.state.user_info.user.id,
                                        real_name: store.state.user_info.user.real_name
                                    }
                                ]
                            }

                        })
                }
            },
            //提交表单
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {return false}
                    if (this.isCreated === 0) {
                        this.loading = true
                        this.$fetch.api_client.clientPut(this.form, this.baseData.id)
                            .then(({
                                       data,
                                       msg
                                   }) => {
                                this.loading = false
                                this.$message.success(msg)
                                this.visible = false
                                this.$router.push({
                                    name: 'clientDetail',
                                    params: {
                                        code: this.$route.params.code
                                    },
                                    query: { key: new Date().getTime() }
                                })
                            })
                    } else {
                        let sub_form = JSON.parse(JSON.stringify(this.form))
                        sub_form.industry = this.form.industry.join(',')
                        sub_form.clcontact_data = JSON.stringify(this.priv1s)
                        this.$fetch.api_client.clientStore(sub_form)
                            .then(({
                                       data,
                                       msg
                                   }) => {
                                this.loading = false
                                this.$message.success(msg)
                                this.visible = false
                                this.$router.push({
                                    name: 'clientDetail',
                                    params: {
                                        code: data.code
                                    }
                                })

                            })
                    }

                })
            },
            resetForm (formName) {
                this.$refs[formName].resetFields()
            }
        }
    }
</script>
