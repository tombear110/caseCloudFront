<template>
    <el-dialog title="单位信息" :visible.sync="visible" width="500px">
        <el-form ref="form" label-width="80px"  label-position="right" class="" :model="form" :rules="rules">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="地区" prop="unit_area">
                        <el-cascader
                            style="width: 100%"
                            :options="area_options"
                            v-model="form.unit_area"
                            clearable
                            change-on-select
                            filterable>
                        </el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="单位类型" prop="unit_type">
                        <el-select v-model="form.unit_type" @change="unitTypeChange"  placeholder="请选择"
                                   style="width: 100%">
                            <el-option
                                v-for="item in unit_typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="单位名称">
                        <el-autocomplete
                            style="width: 100%"
                            v-model="form.unit_name"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入内容"
                            clearable
                            @focus="unitNameFocus">
                        </el-autocomplete>
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
    import store from 'store'
    import { mapActions } from 'vuex'
    import { SET_CASE_DATA, } from 'store/actions/type'
    import { SET_CASE_INFO } from 'store/actions/type'
    export default {
        components: {},
        props: ['unitInfo'],
        data () {
            return {
                area_options:[],
                case_id:'',
                visible: false,
                unit_typeOptions: [
                    {
                        value: 1,
                        label: '法院'
                    },
                    {
                        value: 2,
                        label: '检察院'
                    },
                    {
                        value: 3,
                        label: '公安机关'
                    },
                    {
                        value: 4,
                        label: '仲裁机构'
                    }
                ],
                feeTypeOptions: [],
                court_arr: [],
                form: {
                    unit_type: '',
                    unit_name: '',
                    unit_area: [],
                },
                rules: {},
            }
        },
        watch: {
            unitInfo (val) {
                this.visible = val.visible
                this.getOptions()
                this.getEditData(val.code)
            }
        },

        computed: {
            unitNameOptions () {
                return this.court_arr
            }
        },
        methods: {
            ...mapActions({
                set_case_data: SET_CASE_DATA,
                set_case_info: SET_CASE_INFO
            }),

            openPasswordDialog () {
                this.passwordData = {
                    visible: true
                }
            },

            //判断是否可以调用本地案由，地区
            //若不满足，则调用接口获取
            getOptions () {
                const caseInfo = store.state.case_info ? store.state.case_info : {}
                let result = ''
                //判断caseInfo中是否有数据
                if (caseInfo.expire) {
                    let oldTime = caseInfo.time
                    let newTime = new Date().getTime()
                    result = (newTime - oldTime) < 15 * 24 * 60 * 60 * 1000
                }
                //当前时间-存储时间<15，使用本地存储的地区
                //result为true，无需发送请求
                if (result && caseInfo.area) {
                    this.area_options = caseInfo.area
                } else {
                    this.getAreaOptions(caseInfo)
                }
            },

            //获取地区数据
            getAreaOptions (caseInfo) {
                this.$fetch.api_case.caseArea()
                    .then(({
                               data
                           }) => {
                        let arr = []
                        //受理---地区
                        for (let i in data.area_arr) {
                            arr.push(data.area_arr[i])
                        }
                        this.area_options = arr
                        caseInfo.area = arr
                        caseInfo.expire = 15
                        //存储当前时间
                        caseInfo.time = new Date().getTime()
                        this.set_case_info(caseInfo)
                    })
                    .catch(({
                                msg
                            }) => {
                    })
            },

            //获取法院列表
            getCourtList (arr) {
                this.court_arr = []
                this.$fetch.api_court.courtList({ area: arr })
                    .then(({
                               data
                           }) => {
                        for (let i in data.court_arr) {
                            let obj = {}
                            obj = { value: data.court_arr[i].name }
                            this.court_arr.push(obj)
                        }
                    })
                    .catch(({
                                msg
                            }) => {
                    })
            },
            unitTypeChange (val) {
                //类型改变，清除待选项，已选项
                this.form.unit_name = ''
                this.court_arr = []
            },
            //选择地区
            unitNameFocus () {
                //focue时根据前面两个选项的值来确认待选项
                if (this.form.unit_area.length > 0 && this.form.unit_type === 1) {
                    this.getCourtList(this.form.unit_area)
                }
            },
            querySearch (queryString, cb) {
                let unitNameOptions = this.unitNameOptions
                let results = queryString ? unitNameOptions.filter(this.createFilter(queryString)) : unitNameOptions
                // 调用 callback 返回建议列表的数据
                cb(results)
            },
            createFilter (queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
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
                this.feeTypeOptions = []
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
                        //受理单位-类型，名称
                        this.form.unit_type = case_data.unit_type
                        this.form.unit_name = case_data.unit_name
                        //受理单位-地区-如果存在才进行赋值，否则阻塞后面
                        if (case_data.unit_area) {
                            this.form.unit_area = []
                            let area_temp = case_data.unit_area.split(',')
                            for (let i = 0; i < area_temp.length; i++) {
                                this.form.unit_area.push(parseInt(area_temp[i]))
                            }
                        }
                    })
                    .catch(({
                                msg
                            }) => {
                    })
            },

        }

    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">


</style>

