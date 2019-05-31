<template>
    <el-dialog :title="isCreated===1?'新建合同':'编辑合同'" :visible.sync="visible" @close='closeDialog' width="650px"
               class="contract">
        <el-form ref="form" :model="form" :rules="rules"
                 v-loading="loading"
                 element-loading-text="拼命加载中"
                 label-width="90px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="合同名称" prop="title">
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合同编号" prop="num">
                        <el-input v-model="form.num"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="签约甲方" prop="part_a">
                        <el-input v-model="form.part_a"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="签约乙方" prop="part_b">
                        <el-input v-model="form.part_b"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="所属项目" prop="pr_id">
                        <el-select v-model="form.pr_id" placeholder="请选择" filterable clearable
                                   :disabled="routeName==='projectCode'">
                            <el-option
                                v-for="item in project_arr"
                                :key="item.id"
                                :label="item.pr_name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合同期限" prop="period">
                        <el-input v-model.number="form.period">
                            <template slot="append">年</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="签约日期" prop="sign_at">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.sign_at"
                                        style="width: 100%"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        :editable="false"
                                        :clearable="false"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合同到期日" prop="end_time">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.end_time"
                                        style="width: 100%"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        :editable="false"
                                        :clearable="false"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="合同状态" prop="status">
                        <el-select v-model="form.status" placeholder="请选择">
                            <el-option label="未执行" :value="1"></el-option>
                            <el-option label="执行中" :value="2"></el-option>
                            <el-option label="已完成" :value="3"></el-option>
                            <el-option label="已关闭" :value="4"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="extend_at" label="自动延期">
                        <el-input v-model.number="form.extend_at">
                            <template slot="append">年</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="上传附件" prop="file_tem_ids">
                        <el-upload
                            class="upload-demo"
                            ref="upload"
                            :action=uploadUrl()
                            :headers=header()
                            :before-upload="beforeAvatarUpload"
                            :on-remove="handleRemove"
                            :on-success="successBack"
                            name='cfile'
                            :file-list="isUpList"
                        >
                            <el-button slot="trigger" type="primary" plain>选取文件</el-button>
                            <span slot="tip" class="el-upload__tip mal-10">上传的文件不能超过10M</span>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="付费条款" prop="fee_terms">
                        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容"
                                  v-model="form.fee_terms">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="text-right">
                <el-button type="primary" @click="onSubmit('form')">立即提交</el-button>
                <!--                <el-button type="" v-if="isCreated === 1 " plain @click="resetForm('form')">重置-->
                <!--                </el-button>-->
                <el-button type="" @click="visible = false" plain>取消</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
    import store from 'store'
    import {mapGetters, mapActions} from 'vuex'
    import {server_base_url} from 'common/config'

    export default {
        props: ['contractAdd', 'contractEdit'],
        data() {
            return {
                loading: false,
                title: '',
                project_arr: [],
                visible: false,
                addData: [],
                isUpList: [],
                url: server_base_url,
                cl_name: '',
                cl_id: '',
                form: {
                    extend_at: 0,
                    title: '',
                    num: '',
                    part_a: '',
                    part_b: '',
                    pr_id: '',
                    fee_terms: '',
                    sign_at: '',
                    period: 0,
                    end_time: '',
                    status: 1,
                    file_tem_ids: []
                },
                isCreated: 0,

                rules: {

                    title: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    extend_at: [
                        {type: 'number', message: '请输入数字',}
                    ],
                    period: [
                        {type: 'number', message: '请输入数字',}
                    ],
                },
                fee_terms_json: ''

            }
        },
        computed: {
            routeName() {
                return this.$route.name
            },
        },
        watch: {
            contractAdd(val) {
                this.isCreated = 1 //标记当前为新增状态
                this.visible = val.visible
                this.cl_id = val.id
                //需判断客户，项目下面新增
                //项目新增，传cl_id=0，将所属项目带过来
                if (this.routeName === 'projectCode') {
                    this.project_arr = [
                        {
                            id: val.options.value,
                            pr_name: val.options.label,
                        }
                    ]
                    this.form.pr_id = val.options.value
                } else {
                    this.getBaseData(val.id)
                }


            },
            contractEdit(val) {
                this.isCreated = 0//标记当前为编辑状态
                this.getEdit(val.code)
                this.visible = val.visible
            },
        },
        methods: {
            //关闭弹框的事件
            closeDialog() {
                Object.assign(this.$data, this.$options.data())
            },
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
                return this.url + 'cfile'
            },
            header: function () {
                return {authorization: 'Bearer ' + store.state.user_info.token}
            },
            handleRemove(file, fileList) {
                if (!file.response) {
                    return
                }     //beforeAvatarUpload也会触发handleRemove，避免报错
                if (file.is_record) {
                    this.deleteFile(file.id, {is_tem_file: 0})

                } else {
                    this.deleteFile(file.response.data.file_id, {is_tem_file: 1})
                }
                for (let i in fileList) {
                    if (!fileList[i].is_record) {
                        this.form.file_tem_ids.push(fileList[i].response.data.file_id)
                    }
                }

            },
            successBack(response, file, fileList) {
                if (parseInt(response.code) === 1) {
                    this.$message.error(response.msg)
                } else {
                    this.$message.success(response.msg)
                    let arr = []
                    for (let i in fileList) {
                        if (!fileList[i].is_record) {
                            arr.push(fileList[i].response.data.file_id)
                        }
                    }
                    this.form.file_tem_ids = arr
                }
            },
            //删除文件
            deleteFile(id, params) {
                this.$confirm('此操作将删除改文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'is-plain'
                }).then(() => {
                    this.$fetch.api_file.cfileDelete(id, params)
                        .then(
                            ({
                                 msg
                             }) => {
                                // this.$message.success('删除成功')
                            }
                        )

                }).catch(() => {

                })
            },
            //创建
            getBaseData(id) {
                this.$fetch.api_contract.contractCreate({cl_id: id})
                    .then(({
                               data
                           }) => {
                        this.project_arr = data.project_arr
                    })
            },
            //获取编辑详情
            getEdit(code) {
                this.$fetch.api_contract.contractEdit(
                    code
                )
                    .then(({
                               data
                           }) => {
                        for (let i in data.contract_arr.file_arr) {
                            data.contract_arr.file_arr[i].name = data.contract_arr.file_arr[i].file_name
                        }
                        for (let i in data.contract_arr.file_arr) {
                            data.contract_arr.file_arr[i].is_record = true
                        }
                        this.isUpList = data.contract_arr.file_arr
                        this.form = data.contract_arr
                        this.form.extend_at = parseInt(data.contract_arr.extend_at)
                        //区分项目，客户。
                        if (this.routeName === 'projectCode') {
                            this.project_arr = [
                                {
                                    id: data.contract_arr.pr_id,
                                    pr_name: data.contract_arr.pr_data.pr_name,
                                }
                            ]
                            this.form.pr_id = data.contract_arr.pr_id
                        } else {
                            this.project_arr = data.project_arr
                        }
                    })
            },

            //提交表单
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    //根据 到期日 - 签约日期，计算合同期限，结果四舍五入
                    if (!this.form.period && this.form.sign_at && this.form.end_time) {
                        const days = this.$dayjs(this.form.end_time).diff(this.$dayjs(this.form.sign_at), 'day')
                        this.form.period = Math.round(days * 10 / 364) / 10
                    }
                    if (!valid) return false
                    let id = '', sub_form = {}
                    if (this.isCreated === 1) {
                        this.form.cl_id = this.cl_id
                        let del_arr = ['file_arr']
                        for (let i in del_arr) {
                            delete this.form[del_arr[i]]
                        }
                        sub_form = JSON.parse(JSON.stringify(this.form))
                    } else {
                        id = this.form.id
                        let del_arr = ['pr_name', 'pr_data', 'sign_at_text', 'end_time_text', 'status_text', 'pr_code', 'file_arr']
                        for (let i in del_arr) {
                            delete this.form[del_arr[i]]
                        }
                        sub_form = JSON.parse(JSON.stringify(this.form))
                    }
                    this.$fetch.api_contract.save(sub_form, id)
                        .then(({
                                   msg,
                                   data
                               }) => {
                            this.visible = false
                            this.$emit('refreshContractSave', sub_form)
                        })
                })
            },
            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields()
            }
        }

    }
</script>
