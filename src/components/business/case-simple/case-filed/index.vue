<template>
    <el-dialog title="归档情况" :visible.sync="visible" width="640px">
        <el-form ref="form" label-width="100px"  label-position="right" class=""
                 :model="form"
                 :rules="rules">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="办理状态" prop="g_status">
                        <el-select placeholder="请选择" v-model="form.g_status" style="width: 100%">
                            <el-option label="在办案件" :value="1"></el-option>
                            <el-option label="结案案件" :value="2"></el-option>
                            <el-option label="归档案件" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="结案日期" prop="j_time">
                        <el-date-picker type="date" placeholder="选择日期"
                                        v-model="form.j_time"
                                        style="width: 100%;"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        :editable="false"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="结案状态" prop="ja_status">
                        <el-select v-model="form.ja_status" clearable style="width: 100%">
                            <el-option
                                v-for="item in jaStatusOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="归档人" prop="g_user">
                        <el-select v-model="form.g_user" placeholder="请选择" clearable style="width: 100%">
                            <el-option
                                v-for="item in lawyerOptions"
                                :key="item.id"
                                :label="item.real_name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="归档日期" prop="g_time">
                        <el-date-picker type="date" placeholder="选择日期"
                                        v-model="form.g_time"
                                        style="width: 100%;"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        :editable="false"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="档案保管地" prop="g_address">
                        <el-input v-model="form.g_address"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="text-center">
                <el-button type="primary"  class="mg-top-20" @click="onSubmit('form')">立即提交</el-button>
                <el-button  class="mg-top-20" @click="visible = false" plain>返回</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>
<script>
    import { mapActions } from 'vuex'
    import { SET_CASE_DATA, } from 'store/actions/type'
    export default {
        components: {},
        props: ['caseFiled'],
        data () {

            return {
                case_id:'',
                visible: false,
                lawyerOptions: [],
                jaStatusOptions: [],
                form: {
                    link_pr: '',
                    g_status: '',
                    j_time: '',
                    ja_status: '',
                    g_user: '',
                    g_time: '',
                    g_address: '',
                },
                rules: {},
            }
        },
        watch: {
            caseFiled (val) {
                this.visible = val.visible
                this.getEditData(val.code)
            }
        },
        methods: {
            ...mapActions({
                set_case_data: SET_CASE_DATA,
            }),
            //提交表单
            onSubmit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {return false}
                    //删除多余的选项，用于提交的表单需要删除c_type_arr,且不能对this.form进行改动，故深拷贝this.form
                    let submit_form = JSON.parse(JSON.stringify(this.form))
                    this.$fetch.api_case.caseChange(submit_form, this.case_id)
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
            getEditData (case_code) {
                this.$fetch.api_case.caseEdit(case_code)
                    .then(({
                               data: {
                                   case_data,
                                   case_type,
                                   fee_type_arr,
                                   ja_status_arr,
                                   link_cases,
                                   link_projects,
                                   processes,
                                   team_lawyers,
                                   trail_arr
                               }
                           }) => {
                        //案件id
                        this.case_id = case_data.id
                        this.lawyerOptions = team_lawyers
                        //结案状态
                        this.jaStatusOptions = ja_status_arr.map((item, index) => {
                            return { value: index, label: item }
                        })
                        this.form.ja_status = case_data.ja_status
                        //办理状态,立案日期
                        this.form.g_status = case_data.g_status
                        //结案日期，归档日期，档案保管地，归档人
                        this.form.j_time = case_data.j_time
                        this.form.g_time = case_data.g_time
                        this.form.g_address = case_data.g_address
                        this.form.g_user = case_data.g_user
                    })
                    .catch(({
                                msg
                            }) => {
                    })
            },

            /**
             * 案件程序改变，设立结果随之改变
             * @params: mod
             * @return: 非执行-100，执行-200，
             */
            changeProcess (val) {
                this.form.trail = ''
                let temp = [{ value: 0, label: '其他' }]
                if (val === 108) {
                    //执行
                    for (let i in this.staticTrailOptions) {
                        let p = parseInt(i)
                        if (p > 199 && p < 300) {
                            temp.push({ value: p, label: this.staticTrailOptions[p] })
                        }
                    }
                } else {
                    //非执行
                    for (let i in this.staticTrailOptions) {
                        let p = parseInt(i)
                        if (p > 99 && p < 200) {
                            temp.push({ value: p, label: this.staticTrailOptions[p] })
                        }
                    }
                }
                this.trailOptions = temp
            },
        }

    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">


</style>

