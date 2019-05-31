<template>
    <el-dialog title="收费信息" :visible.sync="visible" width="640px">
        <el-form ref="form" label-width="80px" label-position="right" class=""
                 :model="form"
                 :rules="rules">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="收费方式" prop="unit_type">
                        <el-select v-model="form.fee_type" placeholder="请选择" clearable style="width: 100%">
                            <el-option
                                v-for="item in feeTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合同金额" prop="w_fee">
                        <el-input v-model.number="form.w_fee">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>

                    <!--                    <el-form-item label="合同金额">-->
                    <!--                        <el-input v-model="form.w_fee"></el-input>-->
                    <!--                    </el-form-item>-->
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="收费备注" prop="fee_mark">
                        <el-input v-model="form.fee_mark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="text-center">
                <el-button type="primary" class="mg-top-20" @click="onSubmit('form')">立即提交</el-button>
                <el-button class="mg-top-20" @click="visible = false" plain>返回</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>
<script>
    import {mapActions} from 'vuex'
    import {SET_CASE_DATA,} from 'store/actions/type'

    export default {
        components: {},
        props: ['feeInfo'],
        data() {
            return {
                case_id: '',
                visible: false,
                feeTypeOptions: [],
                form: {
                    fee_type: '',
                    w_fee: '',
                    fee_mark: ''
                },
                rules: {
                    w_fee: [
                        {type: 'number', message: '请输入数字', trigger: 'blur'}
                    ],
                },
            }
        },
        watch: {
            feeInfo(val) {
                this.visible = val.visible
                this.getEditData(val.code)
            }
        },
        methods: {
            ...mapActions({
                set_case_data: SET_CASE_DATA,
            }),
            //提交表单
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    //删除多余的选项，用于提交的表单需要删除c_type_arr,且不能对this.form进行改动，故深拷贝this.form
                    let submit_form = JSON.parse(JSON.stringify(this.form))
                    this.$fetch.api_case.save(submit_form, this.case_id)
                        .then(({
                                   data,
                                   msg
                               }) => {
                            this.$message.success(msg)
                            let temp = !this.$store.state.case_data.isChange
                            this.set_case_data({isChange: temp})
                            this.visible = false

                        })
                        .catch(({
                                    code
                                }) => {
                        })
                })
            },
            //获取编辑数据
            getEditData(case_code) {
                this.feeTypeOptions = []
                this.$fetch.api_case.caseEdit(case_code)
                    .then(({
                               data: {
                                   case_data,
                                   case_type,
                                   fee_type_arr,
                               }
                           }) => {
                        //案件id
                        this.case_id = case_data.id
                        //收费信息
                        for (let i in fee_type_arr) {
                            this.feeTypeOptions.push({value: parseInt(i), label: fee_type_arr[i]})
                        }
                        this.form.fee_type = case_data.fee_type
                        //合同金额，收费备注
                        this.form.w_fee = case_data.w_fee ? parseInt(case_data.w_fee) : 0
                        this.form.fee_mark = case_data.fee_mark
                    })
            },

        }

    }
</script>

