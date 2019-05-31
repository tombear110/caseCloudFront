<template>
    <el-dialog :title="!receivableId?'添加应收款':'编辑应收款'" width="800px" :visible.sync="visible" top="15vh" @close="closeDialog('dialogForm')">
        <el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm" label-width="100px">
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="款项类型" prop="type">
                        <el-select v-model="dialogForm.type" placeholder="请选择" style="width: 100%" filterable>
                            <el-option
                                v-for="(item,index) in typeOptions"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="应收金额" prop="r_amount">
                        <el-input v-model.num="dialogForm.r_amount">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="已收金额" prop="amount_r">
                        <el-input v-model="dialogForm.amount_r">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item prop="r_date" label="约定收款日期">
                        <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                        v-model="dialogForm.r_date"
                                        style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="date_r" label="实际到款日期">
                        <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                        v-model="dialogForm.date_r"
                                        style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" v-model="dialogForm.remark"
                                  :autosize="{ minRows: 3, maxRows: 10}"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="text-center">
                <el-button type="primary" @click="OnSubmit('dialogForm')">提交</el-button>
                <el-button @click="visible = false">取消</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>

    export default {
        props: ['receivableEdit', 'receivableAdd'],
        components: {},
        data() {
            return {
                typeOptions: [],
                dialogForm: {
                    type: '',
                    r_amount: '',
                    amount_r: '',
                    r_date: '',
                    date_r: '',
                    remark: '',
                },
                dialogRules: {
                    r_amount: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '必选项', trigger: 'change'}
                    ]
                },
                visible: false,
                receivableId: '',
            }
        },
        created() {

        },

        watch: {

            //编辑
            receivableEdit(val) {

                this.visible = val.visible
                this.receivableId = val.id
                this.editData(val.id)
            },
            //只会在新增的时候触发
            receivableAdd(val) {
                this.dialogForm.linkid = val.linkid
                this.dialogForm.linktype = val.linktype
                this.visible = val.visible
                this.createData()
            }
        },
        methods: {
            closeDialog(formName){
                // Object.assign(this.$data, this.$options.data())
                this.typeOptions = []
                this.receivableId = ''
                this.$refs[formName].resetFields();
            },
            /**
             * 提交表单
             * @params: mod
             * @return: msg "修改成功"
             */
            OnSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    this.$fetch.api_receivables.save(this.dialogForm, this.receivableId)
                        .then(
                            ({
                                 data, msg
                             }) => {
                                this.$emit('receivableRefresh', true)
                                this.visible = false
                            }
                        )
                })
            },

            //创建
            createData() {
                this.loading = true
                this.typeOptions = []
                this.$fetch.api_receivables.create()
                    .then(
                        ({
                             data
                         }) => {
                            for (let i in data.type_arr) {
                                this.typeOptions.push(
                                    {value: parseInt(i), label: data.type_arr[i]}
                                )
                            }
                        }
                    )
            },

            //编辑页基本数据
            editData(id) {
                this.loading = true
                this.typeOptions = []
                this.$fetch.api_receivables.edit(id)
                    .then(
                        ({
                             data
                         }) => {
                            for (let i in data.type_arr) {
                                this.typeOptions.push(
                                    {value: parseInt(i), label: data.type_arr[i]}
                                )
                            }
                            this.dialogForm = {
                                type: data.trial_data.type,
                                r_amount: data.trial_data.r_amount,
                                amount_r: data.trial_data.amount_r,
                                r_date: data.trial_data.r_date,
                                date_r: data.trial_data.date_r,
                                remark: data.trial_data.remark
                            }
                        }
                    )
            },
        }

    }
</script>
