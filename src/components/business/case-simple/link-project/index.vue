<template>
    <el-dialog title="所属项目" :visible.sync="visible" width="640px">
        <el-form ref="form" label-width="80px"  label-position="right" class=""
                 :model="form"
                 :rules="rules">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="所属项目" prop="link_pr">
                        <el-select v-model="form.link_pr" clearable filterable style="width: 100%">
                            <el-option
                                v-for="item in projectOptions"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">
                            </el-option>
                        </el-select>
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
        props: ['linkProject'],
        data () {

            return {
                case_id:'',
                visible: false,
                projectOptions: [],
                form: {
                    link_pr: '',
                },
                rules: {},
            }
        },
        watch: {
            linkProject (val) {
                this.visible = val.visible
                this.getEditData(val.code)
            }
        },
        methods: {

            ...mapActions({
                set_case_data: SET_CASE_DATA,
            }),

            openPasswordDialog () {
                this.passwordData = {
                    visible: true
                }
            },

            //提交表单
            onSubmit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {return false}
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
                        //所属项目
                        this.projectOptions = link_projects
                        this.form.link_pr = case_data.link_pr ? case_data.link_pr : ''
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

