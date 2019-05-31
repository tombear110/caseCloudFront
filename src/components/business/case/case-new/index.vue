<template>
    <el-dialog :title="isCreated===1?'新建案件':'编辑案件'" :visible.sync="visible" width="738px" top="2vh"
               class="collapse-dialog" :close-on-click-modal="false" @close="closeDialog">
        <el-form :model="form" :rules="formRules" ref="form" v-loading="loading"
                 element-loading-text="拼命加载中" label-width="90px" class="collapse-form">
            <h3>案件基本信息</h3>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="案件类型" prop="c_type_arr">
                        <el-cascader :options="caseTypeOptions" v-model="form.c_type_arr" @change="change_c_type"
                                     style="width: 100%"
                                     :disabled="isCreated===0"
                                     filterable>
                        </el-cascader>
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
                <el-col :span="24">
                    <el-form-item label="案件名称" prop="case_name">
                        <el-input v-model="form.case_name" placeholder="名称为空时，会根据当事人生成案件名称"></el-input>
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
                    <el-form-item label="案号" prop="anhao" class="form-border-left">
                        <el-input v-model="form.anhao"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="委托时间" prop="pr_time">
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
                    <el-form-item label="案件标的" prop="c_amount">
                        <el-input v-model.number="form.c_amount">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="主办律师" prop="host">
                        <el-select v-model="form.host" placeholder="请选择" style="width: 100%">
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
                    <el-form-item label="协办律师" prop="assit">
                        <el-select v-model="form.assit" style="width: 100%" multiple collapse-tags clearable
                                   placeholder="请选择">
                            <el-option
                                v-for="item in lawyerOptions"
                                :key="item.id"
                                :label="item.real_name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="form-section">
                <h3>案件当事人</h3>
                <div v-for="(priv1,index) in form.priv1s" :key="index">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="类型">
                                <el-radio-group v-model="priv1.dsr_type">
                                    <el-radio :label="1">个人</el-radio>
                                    <el-radio :label="2">企业</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="委托方">
                                <el-radio-group v-model="priv1.type">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="2">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item :label="priv1.dsr_type === 1?'姓名':'单位名称'"
                                          style="width: 100%"
                                          :prop="'priv1s.' + index + '.name'"
                                          :rules="{required: true, message: '必填项', trigger: 'blur'}">
                                <el-input v-model="priv1.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <!--刑事案件-->
                            <el-form-item label="属性">
                                <el-select v-model="priv1.c_type" style="width: 100%">
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
                    <el-row v-if="priv1.dsr_type===1">
                        <el-col :span="12">
                            <el-form-item label="民族">
                                <el-input v-model="priv1.nation"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性别">
                                <el-radio-group v-model="priv1.sex">
                                    <el-radio :label="0">男</el-radio>
                                    <el-radio :label="1">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="priv1.dsr_type===1">
                        <el-col :span="12">
                            <el-form-item label="联系方式" class="form-border-left">
                                <el-input v-model="priv1.phone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="证件号码" class="  ">
                                <el-input v-model="priv1.card_num"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="priv1.dsr_type===1">
                        <el-col :span="24">
                            <el-form-item label="住所地">
                                <el-input v-model="priv1.address"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--dsr_type=2为企业-->
                    <el-row v-if="priv1.dsr_type===2">
                        <el-col :span="24">
                            <el-form-item label="单位地址">
                                <el-input v-model="priv1.address"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="priv1.dsr_type===2">
                        <el-col :span="12">
                            <el-form-item label="法定代表人">
                                <el-input v-model="priv1.legal_man"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系方式">
                                <el-input v-model="priv1.phone"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="priv1.dsr_type===2">
                        <el-col :span="24">
                            <el-form-item label="统一社会信用代码">
                                <el-input v-model="priv1.card_num"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="备注">
                                <el-input v-model="priv1.mark"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--dsr_type=1为个人-->
                    <ul class="form-section__suffix">
                        <li class="co-9FA5B9" v-if="index===0" @click="addPriv1(form.c_type_arr)">
                            <i class="iconfont icon-add"></i>
                            <span>添加当事人</span>
                        </li>
                        <li class="co-9FA5B9" @click="copyPriv1(priv1)">
                            <i class="iconfont icon-copy "></i>
                            <span>复制当事人</span>
                        </li>
                        <li class="text-danger " v-if="index!==0" @click="removePriv1(priv1)">
                            <i class="iconfont icon-shibai "></i>
                            <span>删除当事人</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="text-center co-ECB86C cursor" v-if="!isMore" @click="isMore = true ">
                <span class="ft-14 mg-right-5">添加更多案件信息</span>
                <i class="iconfont icon-zhankai-copy ft-14"></i>
            </div>
            <div class="form-section" v-if="isMore">
                <h3>受理单位</h3>
                <el-row>
                    <el-col :span="12">
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
                    <el-col :span="12">
                        <el-form-item label="单位类型" prop="unit_type">
                            <el-select v-model="form.unit_type" @change="unitTypeChange" placeholder="请选择"
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
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="unitNameLabel" prop="unit_name">
                            <el-autocomplete
                                style="width: 100%"
                                v-model="form.unit_name"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入内容"
                                clearable
                                @focus="unitNameFocus"
                            ></el-autocomplete>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <div class="form-section" v-if="isMore">
                <h3>承办人信息</h3>
                <div v-for="(priv2, index) in form.priv2s" :key="index">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="承办人">
                                <el-input v-model="priv2.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系电话">
                                <el-input v-model="priv2.phone"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="科室">
                                <el-input v-model="priv2.class"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="职务">
                                <el-input v-model="priv2.job"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="地址">
                                <el-input v-model="priv2.address"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="备注">
                                <el-input v-model="priv2.remark"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <ul class="form-section__suffix">
                        <li class="text-danger" v-if="index!==0" @click="removePriv2(priv2)">
                            <i class="iconfont icon-shibai"></i>
                            <span>删除承办人</span>
                        </li>
                        <li class="co-9FA5B9 " v-if="index===0" @click="addPriv2">
                            <i class="iconfont icon-add"></i>
                            <span>添加承办人</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="form-section" v-if="isMore">
                <h3>收费信息</h3>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="收费方式" prop="fee_type">
                            <el-select v-model="form.fee_type" placeholder="请选择" style="width: 100%">
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
                            <el-input
                                v-model.number="form.w_fee">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="收费备注" prop="fee_mark">
                            <el-input v-model="form.fee_mark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <div class="form-section" v-if="isMore">
                <h3>归档信息</h3>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="立案日期" prop="la_time">
                            <el-date-picker type="date" placeholder="选择日期"
                                            v-model="form.la_time"
                                            style="width: 100%;"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            :editable="false"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="审理结果" prop="trail">
                            <el-select v-model="form.trail" placeholder="请选择" style="width: 100%">
                                <el-option
                                    v-for="item in trailOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>

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
                </el-row>
                <el-row>

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
                </el-row>
                <el-row>
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
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="档案保管地" prop="g_address">
                            <el-input v-model="form.g_address"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <div class="form-section" v-if="isMore">
                <h3>其他</h3>
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
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="关联案件" prop="link_cases">
                            <el-select v-model="form.link_cases" clearable collapse-tags filterable multiple
                                       style="width: 100%">
                                <el-option
                                    v-for="item in caseOptions"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="其他备注" prop="case_mark">
                            <el-input v-model="form.case_mark" type="textarea"
                                      :autosize="{ minRows: 3, maxRows: 10}"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form>
        <div slot="footer" class="text-center">
            <el-button type="primary" :disabled="submitDisabled" @click="submitForm('form')">保存并提交</el-button>
            <el-button plain @click="visible = false" v-if="isCreated" plain>关闭</el-button>
        </div>
    </el-dialog>

</template>
<script>
    import store from 'store'
    import {mapActions} from 'vuex'
    import {SET_CASE_INFO} from 'store/actions/type'

    export default {
        props: ['newAdd', 'caseEdit'],
        data() {
            return {
                isMore: false,
                submitDisabled: false,
                processOptions: [],
                isCriminal: false,
                visible: false,
                loading: false,
                caseTypeOptions: [],
                unitNameLabel: '法院',
                lawyerOptions: [],
                caseOptions: [],
                projectOptions: [],
                jaStatusOptions: [],
                feeTypeOptions: [],
                trailOptions: [],
                staticTrailOptions: {},
                form: {
                    trail: '',
                    c_type_arr: [], //提交表单时需删除该项
                    pr_time: '',
                    anyou: '',
                    link_pr: '',
                    anhao: '',
                    c_amount: 0,
                    w_fee: 0,
                    fee_mark: '',
                    ja_status: '',
                    cj_time: '',
                    case_name: '',
                    link_cases: [],
//                    court: '',
                    g_user: '',
                    host: store.state.user_info.user.id,
                    assit: [],
//                    g_address: '',
                    g_time: '',
                    j_time: '',
                    case_mark: '',
                    unit_area: [],
                    g_status: 1,
                    unit_type: 1,
                    unit_name: '',
                    process: '',
                    priv1s: [{
                        c_type: 111,
                        type: 1,
                        dsr_type: 1,
                        sex: 0
                    }],
                    priv2s: [{
                        name: '',
                        phone: '',
                        remark: ''
                    }]
                },
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
                formRules: {
                    c_amount: [
                        {type: 'number', message: '请输入数字', trigger: 'blur'}
                    ],
                    w_fee: [
                        {type: 'number', message: '请输入数字', trigger: 'blur'}
                    ],
                    c_type_arr: [
                        {required: true, message: '请选择其中一项', trigger: 'change'}
                    ],
                    process: [
                        {required: true, message: '请选择其中一项', trigger: 'change'}
                    ]
                },
                court_arr: [],
                unitArea: [],
                area_options: [],
                priv1NameArr: ['姓名', '单位名称'],
                priv1Name: '姓名',
                case_id: '',
                title: '',
                isCreated: 0,
                timeout: null
            }
        },
        created() {
        },
        mounted() {

        },
        watch: {
            newAdd(val) {
                this.visible = val.visible
                this.isCreated = 1
                this.getCreateData()
                this.getOptions()
            },
            // caseEdit (val) {
            //     // console.log('val-edit', val)
            //     this.visible = val.visible
            //     this.isCreated = 0
            //     this.getOptions()
            //     this.getEditData(val.code)
            // }
        },

        computed: {
            //刑事案件c_type_arr[0]===1，
            //非刑事案件c_type_arr[0]不为1，
            c_type_options() {
                let temp1 = [{
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
                let temp2 = [{
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
                return this.form.c_type_arr[0] === 1 ? temp2 : temp1

            },
            unitNameOptions() {
                return this.court_arr
            }
        },
        methods: {

            ...mapActions({
                set_case_info: SET_CASE_INFO
            }),

            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields()
            },

            /**
             * 关闭弹窗，清空选择器数据
             * 重置表单
             * @params: mod
             * @return: []
             */
            closeDialog() {
                Object.assign(this.$data, this.$options.data())
            },

            /**
             * 案件程序改变，设立结果随之改变
             * @params: mod
             * @return: 非执行-100，执行-200，
             */
            changeProcess(val) {
                this.form.trail = ''
                let temp = []
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
                temp.push({value: 0, label: '其他'})
                this.trailOptions = temp
            },

            //判断是否可以调用本地案由，地区
            //若不满足，则调用接口获取
            getOptions() {
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
            getAreaOptions(caseInfo) {
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

            //在案由输入框中进行案由options的搜索
            querySearchAsync(queryString, callBack) {
                clearTimeout(this.timeout)
                //刑事案件1，传type=1；非刑事案件2，传type=2
                let type = this.form.c_type_arr[0] === 1 ? 1 : 2
                this.$fetch.api_case.caseAnyou({title: queryString, type: type})
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

            //选择地区
            unitNameFocus() {
                //focue时根据前面两个选项的值来确认待选项
                if (this.form.unit_area.length > 0 && this.form.unit_type === 1) {
                    this.getCourtList(this.form.unit_area)
                }
            },
            //获取法院列表
            getCourtList(arr) {
                this.court_arr = []
                this.$fetch.api_court.courtList({area: arr})
                    .then(({
                               data
                           }) => {
                        for (let i in data.court_arr) {
                            let obj = {}
                            obj = {value: data.court_arr[i].name}
                            this.court_arr.push(obj)
                        }
                    })
                    .catch(({
                                msg
                            }) => {
                    })
            },
            unitTypeChange(val) {
                //类型改变，清除待选项，已选项
                this.form.unit_name = ''
                this.court_arr = []
                //切换label
                const unitNameArry = ['法院', '检察院', '公安机关', '仲裁机构']
                this.unitNameLabel = unitNameArry[val - 1]
            },
            querySearch(queryString, cb) {
                let unitNameOptions = this.unitNameOptions
                let results = queryString ? unitNameOptions.filter(this.createFilter(queryString)) : unitNameOptions
                // 调用 callback 返回建议列表的数据
                cb(results)
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
                }
            },
            //动态增加表单1
            addPriv1(val) {
                let c_type = val[0] === 1 ? 211 : 111
                this.form.priv1s.push({
                    c_type: c_type,
                    type: 1,
                    dsr_type: 1,
                    sex: 0,
                    name: ''
                })
            },

            copyPriv1(item) {
                let temp = JSON.parse(JSON.stringify(item))
                delete temp.id
                delete temp.cid
                delete temp.c_type_text
                this.form.priv1s.push(temp)
            },

            handlePrivycDelete(item) {
                this.$fetch.api_case.privycDelete(item.id)
                    .then(({
                               data,
                               msg
                           }) => {
                        this.$message.success(msg)
                        let index = this.form.priv1s.indexOf(item)
                        if (index !== -1) {
                            this.form.priv1s.splice(index, 1)
                        }
                    })
                    .catch(({
                                msg
                            }) => {
                    })
            },
            //动态移除表单1
            removePriv1(item) {
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
                    let index = this.form.priv1s.indexOf(item)
                    this.form.priv1s.splice(index, 1)
                }
            },
            //动态增加表单2
            addPriv2(item) {
                this.form.priv2s.push({
                    name: '',
                    phone: '',
                    remark: ''
                })
            },
            //动态移除表单2
            removePriv2(item) {
                let index = this.form.priv2s.indexOf(item)
                if (index !== -1) {
                    this.form.priv2s.splice(index, 1)
                }
            },
            //获取编辑数据
            getEditData(case_code) {
                this.loading = true
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
                        this.loading = false
                        this.isMore = true
                        //案件id
                        this.case_id = case_data.id
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
                        //案件名称，案由，案号，委托时间，案件标的
                        this.form.case_name = case_data.case_name
                        this.form.anyou = case_data.anyou
                        this.form.anhao = case_data.anhao
                        this.form.pr_time = case_data.pr_time
                        this.form.c_amount = parseInt(case_data.c_amount)
                        //主办律师，协办律师
                        this.lawyerOptions = team_lawyers
                        this.form.host = case_data.host
                        if (case_data.assit) {
                            let temp = case_data.assit.split(',')
                            this.form.assit = temp.map(item => {
                                return parseInt(item)
                            })
                        }
                        //案件当事人,承办人信息
                        this.form.priv1s = case_data.plist
                        this.form.priv2s = case_data.jlist.length ? case_data.jlist : [{
                            name: '',
                            phone: '',
                            remark: ''
                        }]
                        //受理单位-地区-如果存在才进行赋值，否则阻塞后面
                        if (case_data.unit_area) {
                            this.form.unit_area = []
                            let area_temp = case_data.unit_area.split(',')
                            for (let i = 0; i < area_temp.length; i++) {
                                this.form.unit_area.push(parseInt(area_temp[i]))
                            }
                        }
                        //受理单位-类型，名称
                        this.form.unit_type = case_data.unit_type
                        const unitNameArry = ['法院', '检察院', '公安机关', '仲裁机构']
                        this.unitNameLabel = unitNameArry[case_data.unit_type - 1]
                        this.form.unit_name = case_data.unit_name
                        //收费信息
                        for (let i in fee_type_arr) {
                            this.feeTypeOptions.push({value: parseInt(i), label: fee_type_arr[i]})
                        }
                        this.form.fee_type = case_data.fee_type
                        //合同金额，收费备注
                        this.form.w_fee = case_data.w_fee
                        this.form.fee_mark = case_data.fee_mark
                        //办理状态,立案日期
                        this.form.g_status = case_data.g_status
                        this.form.la_time = case_data.la_time
                        //审理结果(实际应用需要对该数据进行处理)
                        this.staticTrailOptions = JSON.parse(trail_arr)

                        let temp = [{value: 0, label: '其他'}]
                        if (case_data.process === 108) {
                            //执行
                            for (let i in trail_arr) {
                                let p = parseInt(i)
                                if (p > 199 && p < 300) {
                                    temp.push({value: p, label: trail_arr[p]})
                                }
                            }
                        } else {
                            //非执行
                            for (let i in trail_arr) {
                                let p = parseInt(i)
                                if (p > 99 && p < 200) {
                                    temp.push({value: p, label: trail_arr[p]})
                                }
                            }
                        }
                        this.trailOptions = temp
                        this.form.trail = case_data.trail
                        //结案状态
                        this.jaStatusOptions = ja_status_arr.map((item, index) => {
                            return {value: index, label: item}
                        })
                        this.form.ja_status = case_data.ja_status
                        //结案日期，裁决日期，归档日期，档案保管地，归档人
                        this.form.j_time = case_data.j_time
                        this.form.cj_time = case_data.cj_time
                        this.form.g_time = case_data.g_time
                        this.form.g_address = case_data.g_address
                        this.form.g_user = case_data.g_user
                        //所属项目
                        this.projectOptions = link_projects
                        this.form.link_pr = case_data.link_pr ? case_data.link_pr : ''
                        //关联案件
                        //在编辑的时候，关联案件options中禁用当前案件
                        this.caseOptions = link_cases.map(item => {
                            item.disabled = item.code === case_code
                            return item
                        })
                        if (case_data.link_cases) {
                            let caseOptions = case_data.link_cases.split(',')
                            let temp = []
                            for (let i in caseOptions) {
                                temp.push(parseInt(caseOptions[i]))
                            }
                            this.form.link_cases = temp
                        }
                        //其他备注
                        this.form.fee_mark = case_data.fee_mark
                        //判断是否为刑事案件,展示相应数据
                        this.isCriminal = case_data.c_type_fid === 1
                    })
                    .catch(({
                                msg
                            }) => {
                    })
            },
            //获取创建数据
            getCreateData() {
                this.loading = true
                this.$fetch.api_case.caseCreate()
                    .then(({
                               data: {
                                   case_status,
                                   team_lawyers,
                                   case_type,
                                   link_cases,
                                   link_projects,
                                   fee_type_arr,
                                   trail_arr,
                                   ja_status_arr
                               }
                           }) => {
                        this.loading = false
                        //结案状态
                        this.jaStatusOptions = ja_status_arr.map((item, index) => {
                            return {value: index, label: item}
                        })
                        //收费方式
                        for (let i in fee_type_arr) {
                            this.feeTypeOptions.push({value: parseInt(i), label: fee_type_arr[i]})
                        }
                        //审理结果(实际应用需要对该数据进行处理)
                        this.staticTrailOptions = JSON.parse(trail_arr)
                        this.lawyerOptions = team_lawyers
                        this.caseOptions = link_cases
                        this.projectOptions = link_projects
                        //将案件类型数据转换成标准格式
                        let father_data = case_type.fathers
                        let children_data = case_type.childrens
                        let data = []
                        for (let i = 0; i < father_data.length; i++) {
                            let c_data = []
                            for (let j = 0; j < children_data[father_data[i]['id']].length; j++) {
                                c_data[j] = {
                                    value: children_data[father_data[i]['id']][j].id,
                                    label: children_data[father_data[i]['id']][j].name
                                }
                            }
                            data[i] = {value: father_data[i].id, label: father_data[i].name, children: c_data}
                        }
                        this.caseTypeOptions = data
                        //当用户有无团队，主办律师，归档人默认自己
                        let myId = store.state.user_info.user.id
                        let myName = store.state.user_info.user.real_name
                        if (!team_lawyers.length) {
                            this.lawyerOptions = [{id: myId, real_name: myName}]
                        } else {
                            this.lawyerOptions = team_lawyers
                        }
                    })
                    .catch(({
                                msg
                            }) => {
                        this.$message.warning(msg)
                        this.loading = false
                    })
            },

            //获取案件程序
            getProcess(code) {
                this.processOptions = []
                this.$fetch.api_case.caseProcess({
                    code: code
                })
                    .then(({
                               data
                           }) => {
                        for (let i in data) {
                            this.processOptions.push(
                                {value: parseInt(i), label: data[i]}
                            )
                        }
                    })
                    .catch(({
                                code
                            }) => {

                    })
            },

            //当刑事案件，委托方变,对方隐藏
            change_c_type(val) {
                let temp = val[0]
                //清空案件程序值及options
                this.form.process = ''
                this.isCriminal = val[0] === 1
                //刑事案件切换
                if (temp === 1) {
                    //刑事案件
                    // 将当事人-priv1s属性全部重置为c_type=211
                    for (let i of this.form.priv1s) {
                        i.c_type = 211
                    }
                    //案由改变为设诉案由
                    //结案状态改变
                    this.form.ja_status = ''
                } else {
                    //非刑事案件
                    //将当事人-priv1s属性全部重置为c_type=111
                    for (let i of this.form.priv1s) {
                        i.c_type = 111
                    }
                }
                this.getProcess(temp)

            },


            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    let pData1 = this.form.priv1s
                    for (let i = 0; i < pData1.length; i++) {
                        delete pData1[i].c_type_text
                    }
                    let pData2 = this.form.priv2s

                    //将表单外数据放到表单内部一起提交
                    this.form.privyc_data = JSON.stringify(pData1)
                    this.form.judge_data = JSON.stringify(pData2)
                    this.form.c_type = this.form.c_type_arr[1]
                    this.form.c_type_pid = this.form.c_type_arr[0]
                    //删除多余的选项，用于提交的表单需要删除c_type_arr,且不能对this.form进行改动，故深拷贝this.form
                    let submit_form = JSON.parse(JSON.stringify(this.form))
                    delete submit_form.c_type_arr
                    delete submit_form.priv1s
                    delete submit_form.priv2s

                    this.loading = true
                    this.submitDisabled = true
                    this.$fetch.api_case.save(submit_form, this.case_id)
                        .then(({
                                   data,
                                   msg
                               }) => {
                            this.$message.success(msg)
                            const code = this.case_id ? this.$route.params.code : data.case_code
                            this.$router.push({
                                name: 'caseDetail',
                                params: {
                                    code: code
                                },
                                query: {key: new Date().getTime()}
                            })
                            this.loading = false
                            this.submitDisabled = false
                            this.visible = false
                        })
                        .catch(({
                                    code
                                }) => {
                            this.loading = false
                        })
                })
            }

        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>

</style>
