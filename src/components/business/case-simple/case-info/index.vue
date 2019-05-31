<template>
    <el-dialog title="基本信息" :visible.sync="visible" width="730px" top="5vh">
        <el-form ref="form" label-width="90px" label-position="right" :model="form" :rules="rules">
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-form-item label="案件名称" prop="case_name" class="form-border-left">
                        <el-input v-model="form.case_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="委托日期" prop="pr_time">
                        <el-date-picker type="date" placeholder="选择日期"
                                        v-model="form.pr_time"
                                        style="width: 100%;"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        :editable="false">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="案件类型" prop="c_type_arr">
                        <el-cascader :options="caseTypeOptions" v-model="form.c_type_arr"
                                     style="width: 100%"
                                     disabled
                                     filterable>
                        </el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="立案日期" prop="la_time">
                        <el-date-picker type="date" placeholder="选择日期"
                                        v-model="form.la_time"
                                        style="width: 100%;"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        :editable="false">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="案由">
                        <el-autocomplete
                            style="width: 100%"
                            v-model="form.anyou"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            @select="handleSelect">
                        </el-autocomplete>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="裁决日期" prop="cj_time">
                        <el-date-picker type="date" placeholder="选择日期"
                                        v-model="form.cj_time"
                                        style="width: 100%;"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        :editable="false"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="案件程序" prop="process">
                        <el-select v-model="form.process" @change="changeProcess" style="width: 100%">
                            <el-option
                                v-for="(item,index) in processOptions"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="案号" prop="anhao" class="form-border-left">
                        <el-input v-model="form.anhao"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="审理结果" prop="trail">
                        <el-select v-model="form.trail" clearable placeholder="请选择" style="width: 100%">
                            <el-option
                                v-for="item in trailOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="所属项目" prop="link_pr">
                        <el-select v-model="form.link_pr" clearable placeholder="请选择" style="width: 100%">
                            <el-option
                                v-for="item in projectOptions"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="案件标的" prop="c_amount">
                        <el-input v-model.number="form.c_amount">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="胜诉金额" prop="suc_amount">
                        <el-input v-model.number="form.suc_amount">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="实际回款" prop="actual_receipt">
                        <el-input v-model.number="form.actual_receipt">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <!--                <el-col :span="12">-->
                <!--                    <el-form-item label="实际回款"  style="visibility: hidden;">-->
                <!--                        <el-input >-->
                <!--                           -->
                <!--                        </el-input>-->
                <!--                    </el-form-item>-->
                <!--                </el-col>-->
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
                <el-col :span="24">
                    <el-form-item label="归档保管地" prop="g_address">
                        <el-input v-model="form.g_address"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="其他备注" prop="case_mark">
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容"
                                  v-model="form.case_mark">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="text-center">
                <el-button type="primary" class="mg-top-20" @click="onSubmit('form')">确认修改</el-button>
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
        props: ['caseInfo'],
        data() {

            return {
                lawyerOptions: [],
                case_id: '',
                processOptions: [],
                visible: false,
                caseTypeOptions: [],
                jaStatusOptions: [],
                projectOptions: [],
                trailOptions: [],
                staticTrailOptions: {},
                form: {
                    case_name: '',
                    c_amount: 0,
                    suc_amount: 0,
                    actual_receipt: 0,
                    anyou: '',
                    anhao: '',
                    la_time: '',
                    pr_time: '',
                    cj_time: '',
                    j_time: '',
                    g_time: '',
                    g_address: '',
                    trail: '',
                    ja_status: '',
                    c_type_arr: [],
                    process: '',
                    case_mark: '',
                    link_pr:'',
                },
                rules: {
                    c_type_arr: [
                        {required: true, message: '请选择其中一项', trigger: 'change'}
                    ],
                    c_amount: [
                        {type: 'number', message: '请输入数字', trigger: 'blur'}
                    ],
                    suc_amount: [
                        {type: 'number', message: '请输入数字', trigger: 'blur'}
                    ],
                    actual_receipt: [
                        {type: 'number', message: '请输入数字', trigger: 'blur'}
                    ],
                    process: [
                        {required: true, message: '请选择其中一项', trigger: 'change'}
                    ]
                },
            }
        },
        watch: {
            caseInfo(val) {
                this.visible = val.visible
                this.getEditData(val.code)
            }
        },
        mounted() {
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
                    this.form.c_type = this.form.c_type_arr[1]
                    this.form.c_type_pid = this.form.c_type_arr[0]
                    //删除多余的选项，用于提交的表单需要删除c_type_arr,且不能对this.form进行改动，故深拷贝this.form
                    let submit_form = JSON.parse(JSON.stringify(this.form))
                    delete submit_form.c_type_arr
                    this.$fetch.api_case.save(submit_form, this.case_id)
                        .then(({
                                   data,
                                   msg
                               }) => {
                            let temp = !this.$store.state.case_data.isChange
                            this.set_case_data({isChange: temp})
                            this.visible = false
                        })
                })
            },
            //获取编辑数据
            getEditData(case_code) {
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
                        //案件类型-case_type
                        let father_data = case_type.fathers
                        let children_data = case_type.childrens
                        let case_type_data = []
                        for (let i = 0; i < father_data.length; i++) {
                            let c_data = []
                            for (let j = 0; j < children_data[father_data[i]['id']].length; j++) {
                                c_data[j] = {
                                    value: children_data[father_data[i]['id']][j].id,
                                    label: children_data[father_data[i]['id']][j].name
                                }
                            }
                            case_type_data[i] = {
                                value: father_data[i].id,
                                label: father_data[i].name,
                                children: c_data
                            }
                        }
                        this.caseTypeOptions = case_type_data
                        //获取添加的案件类型
                        this.form.c_type_arr = [case_data.c_type_fid, case_data.c_type]
                        //案件程序
                        for (let i in processes) {
                            this.processOptions.push({
                                value: parseInt(i),
                                label: processes[i]
                            })
                        }
                        this.form.process = case_data.process
                        //案由，案号
                        if (case_data.c_amount) {
                            this.form.c_amount = parseInt(case_data.c_amount)
                        }
                        if (case_data.suc_amount) {
                            this.form.suc_amount = parseInt(case_data.suc_amount)
                        }
                        if (case_data.actual_receipt) {
                            this.form.actual_receipt = parseInt(case_data.actual_receipt)
                        }
                        this.form.anyou = case_data.anyou
                        this.form.anhao = case_data.anhao
                        this.form.case_name = case_data.case_name
                        //立案日期,，委托时间
                        this.form.la_time = case_data.la_time
                        this.form.pr_time = case_data.pr_time
                        //审理结果(实际应用需要对该数据进行处理)
                        this.staticTrailOptions = trail_arr
                        let temp = []
                        if (case_data.process === 108) {
                            //执行
                            for (let i in trail_arr) {
                                let p = parseInt(i)
                                if (p > 199 && p < 300) {
                                    temp.push({value: p, label: trail_arr[p]})
                                }
                            }
                            temp.push({value: 0, label: '其他'})
                        } else {
                            //非执行
                            for (let i in trail_arr) {
                                let p = parseInt(i)
                                if (p > 99 && p < 200) {
                                    temp.push({value: p, label: trail_arr[p]})
                                }
                            }
                            temp.push({value: 0, label: '其他'})
                        }
                        this.trailOptions = temp
                        this.form.trail = case_data.trail
                        //所属项目
                        this.projectOptions = link_projects
                        this.form.link_pr = case_data.link_pr
                        //结案状态
                        this.jaStatusOptions = ja_status_arr.map((item, index) => {
                            return {value: index, label: item}
                        })
                        this.form.ja_status = case_data.ja_status
                        //裁决日期，
                        this.form.cj_time = case_data.cj_time
                        //截案日期，
                        this.form.j_time = case_data.j_time
                        //归档日期，
                        this.form.g_time = case_data.g_time
                        this.form.g_address = case_data.g_address
                        //其他备注
                        this.form.case_mark = case_data.case_mark
                    })

            },
            //在案由输入框中进行案由options的搜索
            querySearchAsync(queryString, callBack) {
                clearTimeout(this.timeout)
                this.$fetch.api_case.caseAnyou({title: queryString})
                    .then(({
                               data
                           }) => {
                        let arr = data.anyou_list.map(item => {
                            item.value = item.title
                            return item
                        })
                        this.timeout = setTimeout(() => {
                            callBack(arr)
                        }, 1000 * Math.random())
                    })
                    .catch(({
                                msg
                            }) => {
                    })
            },
            handleSelect(item) {
                console.log(item)
            },
            /**
             * 案件程序改变，设立结果随之改变
             * @params: mod
             * @return: 非执行-100，执行-200，
             */
            changeProcess(val) {
                this.form.trail = ''
                let temp = [{value: 0, label: '其他'}]
                if (val === 108) {
                    //执行
                    for (let i in this.staticTrailOptions) {
                        let p = parseInt(i)
                        if (p > 199 && p < 300) {
                            temp.push({value: p, label: this.staticTrailOptions[p]})
                        }
                    }
                } else {
                    //非执行
                    for (let i in this.staticTrailOptions) {
                        let p = parseInt(i)
                        if (p > 99 && p < 200) {
                            temp.push({value: p, label: this.staticTrailOptions[p]})
                        }
                    }
                }
                this.trailOptions = temp
            },
        }

    }
</script>

