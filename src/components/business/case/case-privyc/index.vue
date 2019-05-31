<template>
    <el-dialog :title="title" width="800px" :visible.sync="visible" top="15vh"
               @close="closeDialog">
        <el-form ref="form" :model="form" :rules="rules" label-width="85px"
                 v-loading="loading"
                 element-loading-text="拼命加载中"
        >
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="类型" prop="dsr_type">
                        <el-radio-group v-model="form.dsr_type" @change="changeDsrType">
                            <el-radio :label="1">个人</el-radio>
                            <el-radio :label="2">企业</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="委托方" prop="type">
                        <el-radio-group v-model="form.type">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="2">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <!--dsr_type=1为个人-->
            <el-row>
                <el-col :span="12">
                    <el-form-item :label="form.dsr_type===1?'姓名':'单位名称'" prop="name" style="width: 100%">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <!--刑事案件-->
                    <el-form-item label="属性" prop="c_type">
                        <el-select v-model="form.c_type" style="width: 100%">
                            <el-option-group
                                v-for="group in c_type_options"
                                :key="group.label"
                                :label="group.label">
                                <el-option
                                    v-for="item in group.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row v-if="form.dsr_type===1">
                <el-col :span="12">
                    <el-form-item label="民族" prop="nation">
                        <el-input v-model="form.nation"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="性别" prop="sex">
                        <el-radio-group v-model="form.sex">
                            <el-radio :label="0">男</el-radio>
                            <el-radio :label="1">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.dsr_type===1">
                <el-col :span="12">
                    <el-form-item label="联系方式" prop="phone">
                        <el-input v-model="form.phone"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="证件号码" prop="card_num">
                        <el-input v-model="form.card_num"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.dsr_type===1">
                <el-col :span="24">
                    <el-form-item label="住所地" prop="address">
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.dsr_type===2">
                <el-col :span="24">
                    <el-form-item label="单位地址" prop="address">
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.dsr_type===2">
                <el-col :span="12">
                    <el-form-item label="法定代表人" prop="legal_man">
                        <el-input v-model="form.legal_man"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系方式" prop="phone">
                        <el-input v-model="form.phone"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.dsr_type===2">
                <el-col :span="24">
                    <el-form-item label="统一社会信用代码" prop="card_num">
                        <el-input v-model="form.card_num"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注" prop="mark">
                        <el-input v-model="form.mark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item class="text-center">
                        <el-button type="primary" @click="onSubmit('form')">
                            立即提交
                        </el-button>
                        <el-button type="" plain
                                   @click=" visible = false">取消
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
    import store from 'store'
    import {mapActions} from 'vuex'
    import {SET_CASE_DATA,} from 'store/actions/type'

    export default {
        props: ['privycEdit', 'privycAdd'],
        components: {},
        data() {
            return {
                title: '',
                caseOptions: [],
                typeOptions: [],
                statusOptions: [],
                loading: false,
                form: {},
                rules: {
                    name: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    c_type: [
                        {required: true, message: '必填项', trigger: 'change'}
                    ]
                },
                visible: false,
                isCreated: 0,
                privycId: '',
                isCriminal: false,
                nowName: ''
            }
        },
        watch: {

            //编辑出发
            privycEdit(val) {
                this.isCreated = 0
                this.visible = val.visible
                this.privycId = val.id
                this.isCriminal = val.caseType
                this.editData(val)
            },
            //只会在新增的时候触发
            privycAdd(val) {
                this.isCreated = 1
                //新增时预设的表单选项
                this.form = {
                    dsr_type: 1,
                    type: '',
                    sex: 0,
                    name: '',
                    c_type: '',
                    nation: '',
                    phone: '',
                    address: '',
                    mark: '',
                    card_num: ''
                }
                this.form.cid = val.caseId
                this.form.type = val.type
                this.visible = val.visible
                this.title = val.type === 1 ? '新增委托方' : '新增对方当事人'
                this.isCriminal = val.caseType
            }
        },
        computed: {
            c_type_options() {
                /**
                 * 根据父页面传过来的案件类型，1，刑事案件，其他，费刑事案件
                 * @params: mod
                 * @return: 两种属性的options
                 */
                let temp = []
                if (this.isCriminal === 1) {
                    //刑事案件
                    temp = [{
                        label: '进攻方',
                        options: [
                            {value: 211, label: '被害人'},
                            {value: 212, label: '自诉人'},
                            {value: 213, label: '原告人'},
                            {value: 214, label: '申诉人'}
                        ]
                    }, {
                        label: '防御方',
                        options: [
                            {value: 221, label: '犯罪嫌疑人'},
                            {value: 222, label: '被告人'},
                            {value: 223, label: '上诉人'},
                            {value: 224, label: '原审被告人'}
                        ]
                    }, {
                        label: '其他参与人',
                        options: [
                            {value: 231, label: '第三人'},
                            {value: 232, label: '法定代理人'},
                            {value: 233, label: '委托代理人'},
                            {value: 234, label: '其他'}
                        ]
                    }]

                } else {
                    //非刑事案件
                    temp = [{
                        label: '进攻方',
                        options: [
                            {value: 111, label: '原告'},
                            {value: 112, label: '上诉人'},
                            {value: 113, label: '申请人'},
                            {value: 114, label: '再审申请人'},
                            {value: 115, label: '原审原告'}
                        ]
                    }, {
                        label: '防御方',
                        options: [
                            {value: 121, label: '被告'},
                            {value: 122, label: '被上诉人'},
                            {value: 123, label: '被申请人'},
                            {value: 124, label: '再审被申请人'},
                            {value: 125, label: '原审被告'}
                        ]
                    }, {
                        label: '其他参与人',
                        options: [
                            {value: 131, label: '第三人'},
                            {value: 132, label: '法定代理人'},
                            {value: 133, label: '委托代理人'},
                            {value: 134, label: '其他'}
                        ]
                    }]
                }
                return temp
            }
        },
        methods: {

            ...mapActions({
                set_case_data: SET_CASE_DATA,
            }),

            changeDsrType(val) {
                if (val === 1) {
                    delete this.form.legal_man
                    this.$set(this.form, 'sex', 0)

                } else {
                    delete this.form.sex
                    delete this.form.nation
                }
            },
            closeDialog() {
                this.loading = false
                this.$refs['form'].resetFields()
            },

            //编辑页基本数据
            editData(val) {
                this.loading = true
                this.$fetch.api_privyc.edit(val.id)
                    .then(({
                               data
                           }) => {
                        //清空form
                        this.form = {}
                        this.nowName = data.name
                        if (data.dsr_type === 1) {
                            //个人
                            this.form = {
                                c_type: data.c_type,
                                type: data.type,
                                dsr_type: data.dsr_type,
                                name: data.name,
                                phone: data.phone,
                                address: data.address,
                                mark: data.mark,
                                card_num: data.card_num,
                                sex: data.sex,
                                nation: data.nation,

                            }
                        } else {
                            this.form = {
                                c_type: data.c_type,
                                type: data.type,
                                dsr_type: data.dsr_type,
                                name: data.name,
                                phone: data.phone,
                                address: data.address,
                                mark: data.mark,
                                card_num: data.card_num,
                                legal_man: data.legal_man,
                            }
                        }
                        this.title = this.form.type === 1 ? '编辑委托方' : '编辑对方当事人'
                        this.form.cid = val.caseId
                        this.loading = false

                    })
                    .catch(({
                                msg
                            }) => {
                        this.loading = false
                    })
            },

            //提交表单
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return false
                    this.loading = true
                    let submitForm = JSON.parse(JSON.stringify(this.form))
                    this.$fetch.api_privyc.save(submitForm, this.privycId)
                        .then(({
                                   data
                               }) => {
                            this.loading = false
                            if (this.nowName === this.form.name) {
                                this.$emit('privycRefresh', true)
                                this.visible = false
                            } else {
                                this.$confirm(`是否同步变更案件名称为：${data.case_name}?`, '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.changeCaseName(data.case_name, this.form.cid)
                                }).catch(() => {
                                    this.$message.info('已取消更改!');
                                    this.$emit('privycRefresh', true)
                                    this.visible = false
                                });
                            }
                        })
                })
            },

            changeCaseName(name, cid) {
                this.$fetch.api_case.save({case_name: name}, cid)
                    .then(({
                               data,
                               msg
                           }) => {
                        //修改vue中case_data的isChange值，在case/first/detail中监测是否变化，决定是否发送请求
                        this.set_case_data({isChange: !store.state.case_data.isChange})
                        this.$emit('privycRefresh', true)
                        this.visible = false
                    })
            },

            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields()
            }
        }

    }
</script>
