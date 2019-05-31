<template>
    <!--@close='closeDialog'-->
    <el-dialog :title="title" :visible.sync="visible" top="5vh" width="950px" custom-class="approval-dialog"
               @close="closeDialog">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px" v-loading="loading" class="approval-form"
                 >
            <h4>案件基本信息</h4>
            <el-row >
                <el-col :span="12">
                    <el-form-item label="案件类别" required>
                        <el-col :span="11">
                            <el-form-item prop="type_b">
                                <el-select v-model="form.type_b" placeholder="请选择">
                                    <el-option
                                        v-for="item in type_b_arr"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">
                            <span style="visibility: hidden">-</span>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item prop="type_b">
                                <el-select v-model="form.type_s" placeholder="请选择">
                                    <el-option
                                        v-for="item in type_s_arr"
                                        :key="item.id"
                                        :label="item.title"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="案件名称" prop="case_name">
                        <el-input v-model="form.case_name">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="案由分类" prop="anyou">
                        <el-cascader
                            placeholder="案由选择"
                            :show-all-levels="false"
                            :options="anyouOptions"
                            change-on-select
                            filterable
                            clearable
                            style="width: 100%"
                            v-model="form.anyou"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="委案日期" prop="wa_time">
                        <el-date-picker style="width: 100%" type="date" placeholder="选择日期" v-model="form.wa_time"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结案日期" prop="ja_time">
                        <el-date-picker style="width: 100%" type="date" placeholder="选择日期" v-model="form.ja_time"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="案情简介" prop="case_summary">
                        <el-input type="textarea"
                                  :rows="6"
                                  v-model="form.case_summary">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <h4>案件当事人</h4>
            <el-row
                v-for="( privyc,index) in this.form.privyc_data"
                :key="index"
                :class="{'border-active':(index !==0)}">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="类型">
                            <el-radio-group v-model="privyc.dsr_type">
                                <el-radio :label="1">个人</el-radio>
                                <el-radio :label="2">企业</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="委托人">
                            <el-radio-group v-model=" privyc.type">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="2">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="(privyc.dsr_type === 1) ? '姓名' : '单位名称'"
                                      :prop="'privyc_data.' + index + '.name'"
                                      :rules="{
                        required: true, message: '必填项', trigger: 'blur'
                        }"
                        >
                            <el-input v-model="privyc.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="属性" prop="c_type">
                            <el-select
                                v-model=" privyc.c_type"
                                filterable
                                clearable
                                style="width: 100%"
                                placeholder="请选择">
                                <el-option
                                    v-for="item in cTypeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row :gutter="20" v-show=" privyc.dsr_type === 1 ">
                    <el-col :span="12">
                        <el-form-item label="电话" prop="phone">
                            <el-input v-model=" privyc.phone">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="民族">
                            <el-input v-model=" privyc.nation">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-show=" privyc.dsr_type === 1 ">
                    <el-col :span="12">
                        <el-form-item label="性别">
                            <el-radio-group v-model=" privyc.sex">
                                <el-radio :label="0">男</el-radio>
                                <el-radio :label="1">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="证件号" prop="card_num">
                            <el-input v-model=" privyc.card_num">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-show=" privyc.dsr_type === 1 ">
                    <el-col :span="24">
                        <el-form-item style="width: 100%;" label="地址" prop="address">
                            <el-input v-model=" privyc.address">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-show=" privyc.dsr_type === 1 ">
                    <el-col :span="24">
                        <el-form-item style="width: 100%;" label="备注" prop="mark">
                            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model=" privyc.mark">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-show=" privyc.dsr_type === 2 ">
                    <el-col :span="12">
                        <el-form-item label="地址" prop="address">
                            <el-input v-model=" privyc.address">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="法定代表人" prop="legal_man">
                            <el-input v-model=" privyc.legal_man">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-show=" privyc.dsr_type === 2 ">
                    <el-col :span="12">
                        <el-form-item label="联系电话" prop="phone">
                            <el-input v-model=" privyc.phone">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="统一社会信用代码" prop="b_risk_amount">
                            <el-input v-model=" privyc.card_num">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-show=" privyc.dsr_type === 2 ">
                    <el-col :span="24">
                        <el-form-item style="width: 100%;" label="备注" prop="mark">
                            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model=" privyc.mark">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="text-right" v-if="index===0">
                    <div style="display: inline-block" class="cursor text-link" @click="onAddItem( privyc)">
                        <i class="el-icon-circle-plus-outline"></i>
                        <span>添加当事人</span>
                    </div>
                </div>
                <div class="text-right" v-else>
                    <div style="display: inline-block" class="cursor text-danger" @click="onRemoveItem(privyc)">
                        <i class="el-icon-remove-outline"></i>
                        <span>删除</span>
                    </div>
                </div>
            </el-row>


            <h4>承办律师</h4>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="主办" prop="host">
                        <el-select
                            v-model="form.host"
                            filterable
                            clearable
                            style="width: 100%"
                            placeholder="请选择">
                            <el-option
                                v-for="item in lawyerOptions"
                                :key="item.id"
                                :label="item.real_name"
                                :value="item.real_name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="协办" prop="assit">
                        <el-input v-model="form.assit">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <h4>费用与合同</h4>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="收费方式" prop="charge_type">
                        <el-select
                            v-model="form.charge_type"
                            filterable
                            clearable
                            style="width: 100%"
                            placeholder="请选择">
                            <el-option
                                v-for="item in chargeTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="固定金额" prop="fixed_amount">
                        <el-input v-model.number="form.fixed_amount">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="聘用合同">
                        <el-upload
                            class="upload-demo"
                            ref="upload"
                            :action=uploadUrl()
                            :headers=header()
                            :before-upload="beforeFileUpload"
                            :on-remove="handleRemove"
                            :on-success="successBack"
                            name="tempFile"
                            :file-list="fileList"
                            show-file-list
                            multiple
                        >
                            <el-button slot="trigger"  type="primary" plain>选取文件</el-button>
                            <span slot="tip" class="el-upload__tip mal-10">上传的文件不能超过10M</span>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item>
                        <el-button type="primary" 
                                   @click="postFormData('form')">立即提交
                        </el-button>
                        <el-button type=""  plain @click="visible = false">关闭
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>

    import store from 'store'
    import { mapGetters, mapActions } from 'vuex'
    import { server_base_url } from 'common/config'

    export default {
        props: ['approvalNew', 'editData'],

        data () {
            return {
                lawcase_info: {},
                type_b_arr: [],
                type_s_arr: [],

                url: server_base_url,
                fileData: {},
                typeOptions: [
                    { value: 1, label: '个人' },
                    { value: 2, label: '单位' }
                ],
                cTypeOptions: [
                    { value: 1, label: '原告' },
                    { value: 2, label: '被告' },
                    { value: 3, label: '第三人' },
                    { value: 4, label: '案件对接人' }
                ],
                title: '',
                anyouOptions: [],
                loading: false,
                fileList: [],
                caseTypeOptions: [],
                lawyerOptions: [],
                chargeTypeOptions: [
                    {
                        value: 1,
                        label: '正常收费'
                    },
                    {
                        value: 2,
                        label: '风险收费'
                    },
                    {
                        value: 3,
                        label: '小时收费'
                    }
                ],
                form: {},
                rules: {
                    type_b: [
                        { required: true, message: '必选项', trigger: 'change' }
                    ],
                    type_s: [
                        { required: true, message: '必选项', trigger: 'change' }
                    ],
                    host: [
                        { required: true, message: '必选项', trigger: 'change' }
                    ],
                    type: [
                        { required: true, message: '必填项', trigger: 'change' }
                    ],
                    case_name: [
                        { required: true, message: '必填项', trigger: 'blur' }
                    ]

                },
                visible: false,
                apprvalId: ''
            }
        },
        watch: {
            approvalNew (val) {
                console.log('新增', val)
                this.title = '新增报审'
                this.createFormData(val.case_code)
                this.visible = val.visible
            },
            editData (val) {
                console.log('编辑', val)
                this.title = '编辑报审'
                this.visible = true
                this.apprvalId = val.id
                this.editFormData(val.id)

            }
        },
        created () {

        },
        methods: {

            //动态增加表单1
            onAddItem (item) {
                this.form.privyc_data.push({
                    type: 1,
                    dsr_type: 1,
                    sex: 0
                })
            },
            //动态移除表单
            onRemoveItem (item) {
                let index = this.form.privyc_data.indexOf(item)
                if (index !== -1) {
                    this.form.privyc_data.splice(index, 1)
                }
            },

            beforeFileUpload (file) {
                const isLt10M = file.size / 1024 / 1024 < 10
                if (!isLt10M) {
                    this.$message.error('上传文件大小不能超过 10MB!')
                }
                return isLt10M
            },
            uploadUrl: function () {
                return this.url + 'uploadTempFile'
            },
            header: function () {
                return { authorization: 'Bearer' + store.state.user_info.token }
            },
            successBack (response, file, fileList) {
                this.fileList = fileList
            },
            //发送请求，进行删除文件动作
            deleteFile (id) {
                this.$fetch.api_lawdoc.del(id)
                    .then(
                        ({
                             msg
                         }) => {
                            this.$message.success('删除成功')
                        }
                    )
                    .catch((msg) => {

                    })
            },
            //点×
            //1. 删除已存在的文件，需要调用接口
            //2. 删除刚上传的临时文件，不需掉接口
            handleRemove (file, fileList) {
                if (file.id) {
                    this.deleteFile(file.id)
                }
                this.fileList = fileList
            },
            //创建
            createFormData (code) {
                this.loading = true
                this.$fetch.api_lawcase.create(
                    { case_code: code }
                )
                    .then(({
                               data: {
                                   anyou_list,
                                   team_layers,
                                   type_b_arr,
                                   type_s_arr,
                                   lawcase_info
                               }
                           }) => {
                        this.lawyerOptions = team_layers
                        this.type_s_arr = type_s_arr
                        //循环type_b_arr对象，将其转化成数组
                        //特别小心Push这个方法，每次打开都要清空数组
                        this.type_b_arr = []
                        for (let i in type_b_arr) {
                            this.type_b_arr.push(
                                {
                                    value: parseInt(i),
                                    label: type_b_arr[i]
                                }
                            )
                        }
                        //将案由转化成标准格式
                        let options1 = anyou_list.option1
                        let options2 = anyou_list.option2
                        let options3 = anyou_list.option3
                        let arr = []
                        for (let i = 0; i < options1.length; i++) {
                            // 第二层
                            let arr_1 = []

                            for (let j = 0; j < options2.length; j++) {
                                // 第三层
                                let arr_2 = []
                                for (let k = 0; k < options3.length; k++) {
                                    let temp_1 = {}
                                    if (options3[k]['pid'] == options2[j].id) {
                                        temp_1 = {
                                            value: options3[k].id,
                                            label: options3[k].title
                                        }
                                        arr_2.push(temp_1)
                                    }
                                }
                                let temp = {}
                                if (options2[j]['pid'] == options1[i].id) {
                                    if (arr_2.length == 0) {
                                        temp = {
                                            value: options2[j].id,
                                            label: options2[j].title

                                        }
                                    } else {
                                        temp = {
                                            value: options2[j].id,
                                            label: options2[j].title,
                                            children: arr_2
                                        }
                                    }

                                    arr_1.push(temp)
                                }
                            }
                            arr[i] = {
                                value: options1[i].id,
                                label: options1[i].title,
                                children: arr_1
                            }
                        }
                        this.anyouOptions = arr
                        this.loading = false
//                        return false
                        //填写一部分案件信息
                        this.form = {
                            privyc_data: [{
                                type: 1,
                                dsr_type: 1,
                                sex: 0
                            }],
                            wa_time: lawcase_info.pr_time,
                            ja_time: lawcase_info.j_time,
                            host: lawcase_info.host_text,
                            case_name: lawcase_info.case_name,
                            assit: lawcase_info.assit_text
                        }

                    })
                    .catch(({
                                msg
                            }) => {
                        this.loading = false
                    })
            },

            //获取编辑基本数据
            editFormData (id) {
                this.loading = true
                this.$fetch.api_lawcase.edit(id)
                    .then(({
                               data: {
                                   anyou_list,
                                   team_layers,
                                   type_b_arr,
                                   type_s_arr,
                                   firmcase
                               }
                           }) => {
                        this.lawyerOptions = team_layers
                        this.type_s_arr = type_s_arr
                        //循环type_b_arr对象，将其转化成数组
                        this.type_b_arr = []
                        for (let i in type_b_arr) {
                            this.type_b_arr.push(
                                {
                                    value: parseInt(i),
                                    label: type_b_arr[i]
                                }
                            )
                        }
                        //将案由转化成标准格式
                        let options1 = anyou_list.option1
                        let options2 = anyou_list.option2
                        let options3 = anyou_list.option3
                        let arr = []
                        for (let i = 0; i < options1.length; i++) {
                            // 第二层
                            let arr_1 = []

                            for (let j = 0; j < options2.length; j++) {
                                // 第三层
                                let arr_2 = []
                                for (let k = 0; k < options3.length; k++) {
                                    let temp_1 = {}
                                    if (options3[k]['pid'] == options2[j].id) {
                                        temp_1 = {
                                            value: options3[k].id,
                                            label: options3[k].title
                                        }
                                        arr_2.push(temp_1)
                                    }
                                }
                                let temp = {}
                                if (options2[j]['pid'] == options1[i].id) {
                                    if (arr_2.length == 0) {
                                        temp = {
                                            value: options2[j].id,
                                            label: options2[j].title

                                        }
                                    } else {
                                        temp = {
                                            value: options2[j].id,
                                            label: options2[j].title,
                                            children: arr_2
                                        }
                                    }

                                    arr_1.push(temp)
                                }
                            }
                            arr[i] = {
                                value: options1[i].id,
                                label: options1[i].title,
                                children: arr_1
                            }
                        }
                        this.anyouOptions = arr

                        //填写部分dialog信息
//                        this.form.privyc_data = []
//                        this.form.privyc_data = firmcase.firmprivyc_list
                        let tempArr = [], anyou = []
                        if (firmcase.anyou) {
                            tempArr = firmcase.anyou.split(',')
                            for (let i = 0; i < tempArr.length; i++) {
                                anyou.push(parseInt(tempArr[i]))
                            }
                        }
                        this.form = {
                            privyc_data: firmcase.firmprivyc_list,
                            type_b: firmcase.type_b,
                            type_s: firmcase.type_s,
                            case_name: firmcase.case_name,
                            case_summary: firmcase.case_summary,
                            anyou: anyou,
                            wa_time: firmcase.wa_time,
                            ja_time: firmcase.ja_time,
                            host: firmcase.host,
                            assit: firmcase.assit,
                            charge_type: firmcase.charge_type,
                            fixed_amount: firmcase.fixed_amount
                        }
                        this.fileList = firmcase.firmfile_list
                        this.loading = false
                    })
                    .catch(({
                                msg
                            }) => {
                        this.loading = false
                    })
            },

            //提交表单
            postFormData (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return false
                    this.loading = true
                    if (this.title === '新增报审') {
                        let tempList = []
                        for (let i = 0; i < this.fileList.length; i++) {
                            tempList.push(
                                {
                                    name: this.fileList[i].name,
                                    path: this.fileList[i].response.data.path
                                }
                            )
                        }
                        this.form.file_data = JSON.stringify(tempList)
                        let submitForm = JSON.parse(JSON.stringify(this.form))
                        submitForm.privyc_data = JSON.stringify(submitForm.privyc_data)
                        this.$fetch.api_lawcase.save(submitForm)
                            .then(({
                                       msg
                                   }) => {
                                this.$message.success(msg)
                                this.loading = false
                                this.closeDialog()
                            })
                            .catch(({
                                        msg
                                    }) => {
                                this.$message.warning(msg)
                            })
                    } else {
                        let tempList = []
                        for (let i = 0; i < this.fileList.length; i++) {
                            if (this.fileList[i].id) {
                                tempList.push(this.fileList[i])
                            } else {
                                tempList.push(
                                    {
                                        name: this.fileList[i].name,
                                        path: this.fileList[i].response.data.path
                                    }
                                )
                            }
                        }
                        this.form.file_data = JSON.stringify(tempList)
                        let submitForm = JSON.parse(JSON.stringify(this.form))
                        submitForm.privyc_data = JSON.stringify(submitForm.privyc_data)
                        this.$fetch.api_lawcase.update(this.apprvalId, submitForm)
                            .then(({
                                       msg
                                   }) => {
                                this.$message.success(msg)
                                this.loading = false
                                this.$emit('refreshEdit', { isRefresh: true })
                                this.closeDialog()
                            })
                            .catch(({
                                        msg
                                    }) => {
                                this.$message.warning(msg)
                            })
                    }
                })
            },
            closeDialog () {
                this.visible = false
                this.form.privyc_data = []
                this.form.privyc_data = [{
                    type: 1,
                    dsr_type: 1,
                    sex: 0
                }]
                this.fileList = []
                this.resetFormData('form')
            },
            //重置表单
            resetFormData (formName) {
                this.$refs[formName].resetFields()
            }
        }

    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>
