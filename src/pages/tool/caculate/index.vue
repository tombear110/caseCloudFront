<template>
    <div class="tool-caculate">
        <div class="tab-component">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===index}"
                    v-for="(item,index) in infoTab"
                    @click="tabChange(index)"
                    :key="item.text">
                    {{item.text}}
                </li>
            </ul>
        </div>
        <div class="fee-box" v-show="tabActive===0">
            <div class="left">
                <!--收费-->
                <el-form ref="fee_form" label-width="80px"  label-position="right" class="" :model="fee_form"
                         :rules="fee_rules">
                    <el-row class="">
                        <el-col :span="12">
                            <el-form-item label="区域" prop="address" :show-message="false" size="">
                                <el-select v-model="fee_form.address" placeholder="请选择"
                                           @change="addressChange">
                                    <el-option
                                        v-for="item in address_arr"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="案件类型" prop="type" :show-message="false">
                                <el-select v-model="fee_form.type"  @change="caseChange" style="width: 100%">
                                    <el-option
                                        v-for="item in case_arr"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="涉及财产" prop="money" style="margin-bottom: 0">
                                <el-switch
                                    @change="money_change"
                                    :disabled='money_show'
                                    v-model="fee_form.money">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="标的额" prop="number" class="l-input" style="margin-bottom: 0">
                                <el-input v-model.number="fee_form.number" :disabled="fee_dis">
                                    <template slot="append">万元</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="form-result">
                    <div>律师费</div>
                    <span class="co-1f2f3d">{{earning}}</span>
                </div>
            </div>
            <div class="submit-row">
                <el-button type="primary"   @click="caculate('fee_form')">计算</el-button>
                <el-button   @click="reset('fee_form')" plain>重置</el-button>
            </div>

        </div>
        <div class="fee-formulae" v-show="tabActive===0">
            <div class="list-title">
                <span>律师费计算公式：</span>
                <span class="text-info cursor" @click="lawyerFeeLink">(律师费有疑惑？)</span>
            </div>
            <!--<div class="list-title">律师费有疑惑？</div>-->
            <!--上海-->
            <ul class="list-group" v-if="address_standard===1">
                <li><span>代理涉及财产关系的民事、行政诉讼和国家赔偿案件可以根据诉讼标的额，按照下列比例分段累计收费：</span></li>
                <li><span>10万元以下（含10万元）部分收费比例为8%－12%，收费不足3000元的，可按3000元收取；</span></li>
                <li><span>10万元以上至100万元（含100万元）部分收费比例为 5%－7%；</span></li>
                <li><span>100万元以上至1000万元（含1000万元）部分收费比例为3%－5%；</span></li>
                <li><span>1000万元以上至1亿元（含1亿元）部分收费比例为1%－3%；</span></li>
                <li><span>1亿元以上部分收费比例为0.5%-1%</span></li>
            </ul>

            <!--北京-->
            <ul class="list-group" v-if="address_standard===2">
                <li><span>按审判阶段确定收费标准。</span></li>
                <li class=""><span>① 计件收费标准为每件3000--15000元。</span></li>
                <li class=""><span>② 按标的额比例收费标准
                10万元以下（含10万元），10%（最低收费3000元）；
                10万元至100万元（含100万元）, 6%；
                100万元至1000万元（含1000万元）, 4%；
                1000万元以上, 2%。
                按当事人争议标的额差额累进计费。 </span></li>
                <li><span>再审、申诉案件分别按照一个审判阶段确定的收费方式和收费标准收取律师服务费。</span></li>
                <li><span>计时收费标准，100-3000元/有效工作小时。 </span></li>
                <li><span>收费标准下浮不限</span></li>
                <li><span>一个律师事务所代理一个案件的多个阶段，可自第二阶段起酌减收费。</span></li>
            </ul>

            <!--江苏-->
            <ul class="list-group" v-if="address_standard===3">
                <li><span>简单案件：</span></li>
                <li><span>① 不涉及财产2500-10000元</span></li>
                <li><span>② 涉及财产按诉讼争议标的额：
                ≤1万元按民事不涉及财产案件标准执行；>1万元，≤10万元6-7%；>10万元，≤50万元5-6%；>50万元，≤100万元4-5%；；>100万元，≤500万元3-4%；>500万元，≤1000万元2-3%；>1000万元，≤1亿元1-2%；>1亿元0.5-1%
                </span></li>
                <li><span>重大、疑难、复杂案件不高于简单案件5倍标准执行</span></li>
            </ul>

            <!--浙江-->
            <ul class="list-group" v-if="address_standard===4">
                <li><span>代理不涉及财产关系的民事诉讼、行政诉讼案件：1500-8000元/件。</span></li>
                <li><span>代理涉及财产关系的民事诉讼、行政诉讼案件，根据诉讼标的额，按照下列比例分段累计收费：</span></li>
                <li><span>
                        10万元以上至50万元（含50万元）：4-4.8%；
                        50万元以上至100万元（含100万元）：3.2-4%；
                        100万元以上至500万元（含500万元）：2.4-3.2%；
                        500万元以上至1000万元（含1000万元）：1.6-2.4%；
                        1000万元以上：0.8-1.6%。
                    </span></li>
                <li>担任二审代理、异地办案差旅费、诉讼费、仲裁费、司法鉴定费等，依照律师服务收费规定执行。<span></span></li>
            </ul>
        </div>
        <div class="fee-box" v-show="tabActive===1">
            <div class="left">
                <el-form ref="f_form" label-width="80px"  label-position="right" class="" :model="f_form"
                         :rules="f_rules">
                    <el-row class="">
                        <el-col :span="24">
                            <el-form-item label="案件类型" prop="f_type" :show-message="false">
                                <el-select v-model="f_form.f_type" placeholder="请选择" @change="ftype" filterable style="width: 100%">
                                    <el-option
                                        v-for="item in f_type_arr"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="案件标的" prop="f_number" class="l-input" style="margin-bottom: 0">
                                <el-input v-model.number="f_form.f_number" :disabled="f_fee_dis"
                                          placeholder="请输入">
                                    <template slot="append">元</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-form>
                <div class="f-right">
                    <div class="f-right-item">
                        <span>案件受理费</span>
                        <span>{{f_sl}}元</span>
                    </div>
                    <div class="f-right-item">
                        <span>案件保全费</span>
                        <span>{{f_bq}}元</span>
                    </div>
                    <div class="f-right-item">
                        <span>案件执行费</span>
                        <span>{{f_zx}}元</span>
                    </div>
                </div>
            </div>
            <div class="submit-row">
                <el-button type="primary"   @click="f_caculate('f_form')">计算</el-button>
                <el-button   @click="f_reset('f_form')" plain>重置</el-button>
            </div>

        </div>
        <div class="fee-formulae" v-show="tabActive===1">
            <div class="list-title">
                <span>法院收费计算公式：</span>
                <span class="text-info cursor" @click="courtFeeLink">法院收费有疑惑？</span>
            </div>
            <div class="f-group" v-show="f_form.f_type===1">
                <!--案件受理费-->
                <div class="f-item-title">案件受理费：</div>
                <p>根据标的额：1万内：50元；10万内：2300元；20万内：4300元；50万内：8800元；
                    100万内：13800元；200万内：22800元；500万内：46800元；1000万内：81800元；
                    2000万内：141800元；2000万以上：（标的额-2000万）*0.5%+141800;
                </p>
                <!--案件保全费-->
                <div class="f-item-title">案件保全费：</div>
                <p>根据标的额：1000以内：30元；10万以内：1020元；10万以上：1020元+（标的额-10万）*0.5%；最高收费5000元；
                </p>
                <!--案件执行费-->
                <div class="f-item-title">案件执行费：</div>
                <p>根据标的额：1万以内：50元；50万以内：7400元；500万以内：52400元；1000万以内：77400元；1000万以上：77400元+（标的额-1000万）*0.1%；
                </p>
            </div>
            <div class="f-group" v-show="f_form.f_type===2">
                <!--案件受理费-->
                <div class="f-item-title">案件受理费：</div>
                <p>50-100元</p>
                <!--案件保全费-->
                <div class="f-item-title">案件保全费：</div>
                <p>30元</p>
                <!--案件执行费-->
                <div class="f-item-title">案件执行费：</div>
                <p>50-500元</p>
            </div>
            <div class="f-group" v-show="f_form.f_type===3">
                <!--案件受理费-->
                <div class="f-item-title">案件受理费：</div>
                <p>根据标的额：20万内：50-300元；20万以上：（标的额-20万）*0.5%+300;
                </p>
                <!--案件保全费-->
                <div class="f-item-title">案件保全费：</div>
                <p>根据标的额：1000以内：30元；10万以内：1020元；10万以上：1020元+（标的额-10万）*0.5%；最高收费5000元；
                </p>
                <!--案件执行费-->
                <div class="f-item-title">案件执行费：</div>
                <p>根据标的额：1万以内：50元；50万以内：7400元；500万以内：52400元；1000万以内：77400元；1000万以上：77400元+（标的额-1000万）*0.1%；
                </p>
            </div>
            <div class="f-group" v-show="f_form.f_type===4">
                <!--案件受理费-->
                <div class="f-item-title">案件受理费：</div>
                <p>根据标的额：5万内：100-500元；10万内：1000元；10万以上：（标的额-10万）*0.5%+1000;
                </p>
                <!--案件保全费-->
                <div class="f-item-title">案件保全费：</div>
                <p>根据标的额：1000以内：30元；10万以内：1020元；10万以上：1020元+（标的额-10万）*0.5%；最高收费5000元；
                </p>
                <!--案件执行费-->
                <div class="f-item-title">案件执行费：</div>
                <p>根据标的额：1万以内：50元；50万以内：7400元；500万以内：52400元；1000万以内：77400元；1000万以上：77400元+（标的额-1000万）*0.1%；
                </p>
            </div>
            <div class="f-group" v-show="f_form.f_type===5">
                <!--案件受理费-->
                <div class="f-item-title">案件受理费：</div>
                <p>①若无标的额，500-1000元；②若有标的额，根据标的额：1万内：50元；10万内：2300元；20万内：4300元；50万内：8800元；
                    100万内：13800元；200万内：22800元；500万内：46800元；1000万内：81800元；
                    2000万内：141800元；2000万以上：（标的额-2000万）*0.5%+141800;
                </p>
                <!--案件保全费-->
                <div class="f-item-title">案件保全费：</div>
                <p>根据标的额：1000以内：30元；10万以内：1020元；10万以上：1020元+（标的额-10万）*0.5%；最高收费5000元；
                </p>
                <!--案件执行费-->
                <div class="f-item-title">案件执行费：</div>
                <p>根据标的额：1万以内：50元；50万以内：7400元；500万以内：52400元；1000万以内：77400元；1000万以上：77400元+（标的额-1000万）*0.1%；
                </p>
            </div>
            <div class="f-group" v-show="f_form.f_type===6">
                <!--案件受理费-->
                <div class="f-item-title">案件受理费：</div>
                <p>10元
                </p>
                <!--案件保全费-->
                <div class="f-item-title">案件保全费：</div>
                <p>根据标的额：1000以内：30元；10万以内：1020元；10万以上：1020元+（标的额-10万）*0.5%；最高收费5000元；
                </p>
                <!--案件执行费-->
                <div class="f-item-title">案件执行费：</div>
                <p>根据标的额：1万以内：50元；50万以内：7400元；500万以内：52400元；1000万以内：77400元；1000万以上：77400元+（标的额-1000万）*0.1%；
                </p>
            </div>
            <div class="f-group" v-show="f_form.f_type===7">
                <!--案件受理费-->
                <div class="f-item-title">案件受理费：</div>
                <p>50元
                </p>
                <!--案件保全费-->
                <div class="f-item-title">案件保全费：</div>
                <p>根据标的额：1000以内：30元；10万以内：1020元；10万以上：1020元+（标的额-10万）*0.5%；最高收费5000元；
                </p>
                <!--案件执行费-->
                <div class="f-item-title">案件执行费：</div>
                <p>根据标的额：1万以内：50元；50万以内：7400元；500万以内：52400元；1000万以内：77400元；1000万以上：77400元+（标的额-1000万）*0.1%；
                </p>
            </div>
            <div class="f-group" v-show="f_form.f_type===8">
                <!--案件受理费-->
                <div class="f-item-title">案件受理费：</div>
                <p>100元
                </p>
                <!--案件保全费-->
                <div class="f-item-title">案件保全费：</div>
                <p>根据标的额：1000以内：30元；10万以内：1020元；10万以上：1020元+（标的额-10万）*0.5%；最高收费5000元；
                </p>
                <!--案件执行费-->
                <div class="f-item-title">案件执行费：</div>
                <p>根据标的额：1万以内：50元；50万以内：7400元；500万以内：52400元；1000万以内：77400元；1000万以上：77400元+（标的额-1000万）*0.1%；
                </p>
            </div>
            <div class="f-group" v-show="f_form.f_type===9">
                <!--案件受理费-->
                <div class="f-item-title">案件受理费：</div>
                <p>50-100元
                </p>
                <!--案件保全费-->
                <div class="f-item-title">案件保全费：</div>
                <p>根据标的额：1000以内：30元；10万以内：1020元；10万以上：1020元+（标的额-10万）*0.5%；最高收费5000元；
                </p>
                <!--案件执行费-->
                <div class="f-item-title">案件执行费：</div>
                <p>根据标的额：1万以内：50元；50万以内：7400元；500万以内：52400元；1000万以内：77400元；1000万以上：77400元+（标的额-1000万）*0.1%；
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import { myTab } from 'components'

    export default {
        components: { myTab },
        data() {
            return {
                infoTab: [
                    {
                        text: '律师收费'
                    },
                    {
                        text: '法院收费'
                    },
                ],
                tabData: [
                    {
                        text:'律师收费计算器',
                    },{
                        text:'法院收费计算器',
                    }
                ],
                title_arr: [
                    {
                        title: '律师收费计算器'
                    },
                    {
                        title: '法院收费计算器'
                    },
                ],
                active: 'first',
                fee_form: {
                    type: 2,
                    address: 1,
                    number: 0,
                    money: true,

                },
                earning: '0元',
                f_form: {
                    f_type: 1,
                    f_number: 0,
                },
                options: [
                    {
                        value: 0,
                        label: '否',
                    },
                    {
                        value: 1,
                        label: '是',
                    },
                ],
                case_arr: [
                    {
                        value: 1,
                        label: '刑事案件',
                    },
                    {
                        value: 2,
                        label: '民事案件',
                    },
                    {
                        value: 3,
                        label: '行政案件',
                    },
                    {
                        value: 4,
                        label: '国家赔偿案件',
                    },
                ],
                address_arr: [
                    {
                        value: 1,
                        label: '上海'
                    },
                    {
                        value: 2,
                        label: '北京'
                    },
                    {
                        value: 3,
                        label: '江苏'
                    },
                    {
                        value: 4,
                        label: '浙江'
                    }
                ],
                f_type_arr: [
                    {
                        value: 1,
                        label: '财产案件'
                    },
                    {
                        value: 2,
                        label: '普通非财产案件'
                    },
                    {
                        value: 3,
                        label: '离婚案件'
                    },
                    {
                        value: 4,
                        label: '人格权案件'
                    },
                    {
                        value: 5,
                        label: '知识产权案件'
                    },
                    {
                        value: 6,
                        label: '劳动争议案件'
                    },
                    {
                        value: 7,
                        label: '行政案件'
                    },
                    {
                        value: 8,
                        label: '商标，专利，海事行政案件'
                    },
                    {
                        value: 9,
                        label: '管辖权异议不成立案件'
                    },
                ],
                f_rules: {
                    f_type: [
                        {required: true, message: '请选择',},
                    ],
                    f_number: [
                        {type: 'number', message: '费用必须为数字'}
                    ],
                },
                fee_rules: {
                    type: [
                        {required: true, message: '请选择',},
                    ],
                    address: [
                        {required: true, message: '请选择',},
                    ],
                    number: [
                        {type: 'number', message: '费用必须为数字'}
                    ],
                },
                fee_dis: false,
                f_fee_dis: false,
                time_dis: false,
                money_show: false,
                address_standard: 1,
                fee_type: '',
                min: 0,
                max: 0,
                f_min: 0,
                f_max: 0,
                f_sl: 0,
                f_bq: 0,
                f_zx: 0,
                tabActive: 0,
            }
        },
        methods: {
            //点击去相应的页面
            tabChange(index) {

                this.tabActive = index
            },
            ftype(val) {
                this.f_form.f_type = val
                if (val === 2) {
                    this.f_fee_dis = true
                } else {
                    this.f_fee_dis = false
                }
            },
            //法院
            f_caculate(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    //a案件受理费(f_sl)，b案件保全费(f_bq)，c案件执行费(f_zx)，

                    if (this.f_form.f_type === 1 || this.f_form.f_type === 5) {
                        let m = this.f_form.f_number
                        switch (true) {
                            case m >= 0 && m <= 1000:
                                this.f_sl = 50;
                                this.f_bq = 30;
                                this.f_zx = 50;
                                break;
                            case m > 1000 && m <= 10000:
                                this.f_sl = 50;
                                this.f_bq = 1020;
                                this.f_zx = 50;
                                break;
                            case m > 10000 && m <= 100000:
                                this.f_sl = 2300;
                                this.f_bq = 1020;
                                this.f_zx = 7400;
                                break;
                            case m > 100000 && m <= 200000:
                                this.f_sl = 4300;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 7400;
                                break;
                            case m > 200000 && m <= 500000:
                                this.f_sl = 8800;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 7400;
                                break;
                            case m > 500000 && m <= 1000000:
                                this.f_sl = 13800;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 52400;
                                break;
                            case m > 1000000 && m <= 2000000:
                                this.f_sl = 22800;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 52400;
                                break;
                            case m > 2000000 && m <= 5000000:
                                this.f_sl = 46800;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 52400;
                                break;
                            case m > 5000000 && m <= 10000000:
                                this.f_sl = 81800;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 77400;
                                break;
                            case m > 10000000 && m <= 20000000:
                                this.f_sl = 141800;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 77400 + (m - 10000000) * 0.1 / 100;
                                break;
                            case m > 20000000:
                                this.f_sl = 141800 + (m - 20000000) * 0.5 / 100;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 77400 + (m - 10000000) * 0.1 / 100;
                                break;
                        }
                        if (this.f_bq >= 5000) {
                            this.f_bq = 5000
                        }

                    }else if (this.f_form.f_type === 2) {
                        this.f_sl = '50-100'
                        this.f_bq = 30
                        this.f_zx = '50-500'
                    } else if (this.f_form.f_type === 3) {
                        let m = this.f_form.f_number
                        switch (true) {
                            case m <= 1000:
                                this.f_sl = '50-300';
                                this.f_bq = 30;
                                this.f_zx = 50;
                                break;
                            case m > 1000 && m <= 10000:
                                this.f_sl = '50-300';
                                this.f_bq = 1020;
                                this.f_zx = 50;
                                break;
                            case m > 10000 && m <= 100000:
                                this.f_sl = '50-300';
                                this.f_bq = 1020;
                                this.f_zx = 7400;
                                break;
                            case m > 100000 && m <= 200000:
                                this.f_sl = '50-300';
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 7400;
                                break;
                            case m > 200000 && m <= 500000:
                                this.f_sl = 300 + (m - 200000) * 0.5 / 100;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 7400;
                                break;
                            case m > 500000 && m <= 5000000:
                                this.f_sl = 300 + (m - 200000) * 0.5 / 100;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 52400;
                                break;
                            case m > 5000000 && m <= 10000000:
                                this.f_sl = 300 + (m - 200000) * 0.5 / 100;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 77400;
                                break;
                            case 10000000 < m:
                                this.f_sl = 300 + (m - 200000) * 0.5 / 100;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 77400 + (m - 10000000) - 0.1 / 100;
                                break;
                        }
                        if (this.f_bq >= 5000) {
                            this.f_bq = 5000
                        }
                    } else if (this.f_form.f_type === 4) {
                        let m = this.f_form.f_number
                        switch (true) {
                            case m <= 1000:
                                this.f_sl = '100-500';
                                this.f_bq = 30;
                                this.f_zx = 50;
                                break;
                            case m > 1000 && m <= 10000:
                                this.f_sl = '100-500';
                                this.f_bq = 1020;
                                this.f_zx = 50;
                                break;
                            case m > 10000 && m <= 50000:
                                this.f_sl = '100-500';
                                this.f_bq = 1020;
                                this.f_zx = 7400;
                                break;
                            case m > 50000 && m < 100000:
                                this.f_sl = 1000;
                                this.f_bq = 1020;
                                this.f_zx = 7400;
                                break;
                            case m >= 100000 && m <= 500000:
                                this.f_sl = 1000 + (m - 100000) * 0.5 / 100;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 7400;
                                break;
                            case m > 500000 && m <= 5000000:
                                this.f_sl = 1000 + (m - 100000) * 0.5 / 100;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 52400;
                                break;
                            case m > 5000000 && m <= 10000000:
                                this.f_sl = 1000 + (m - 100000) * 0.5 / 100;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 77400;
                                break;
                            case 10000000 < m:
                                this.f_sl = 1000 + (m - 100000) * 0.5 / 100;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 77400 + (m - 10000000) - 0.1 / 100;
                                break;
                        }
                        if (this.f_bq >= 5000) {
                            this.f_bq = 5000
                        }
                    } else if (this.f_form.f_type === 6) {
                        let m = this.f_form.f_number
                        switch (true) {
                            case m <= 1000:
                                this.f_sl = 10;
                                this.f_bq = 30;
                                this.f_zx = 50;
                                break;
                            case m > 1000 && m <= 10000:
                                this.f_sl = 10;
                                this.f_bq = 1020;
                                this.f_zx = 50;
                                break;
                            case m > 10000 && m <= 100000:
                                this.f_sl = 10;
                                this.f_bq = 1020;
                                this.f_zx = 7400;
                                break;
                            case m > 100000 && m <= 500000:
                                this.f_sl = 10;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 7400;
                                break;
                            case m > 500000 && m <= 5000000:
                                this.f_sl = 10;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 52400;
                                break;
                            case m > 5000000 && m <= 10000000:
                                this.f_sl = 10;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 77400;
                                break;
                            case 10000000 < m:
                                this.f_sl = 10;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 77400 + (m - 10000000) - 0.1 / 100;
                                break;
                        }
                        if (this.f_bq >= 5000) {
                            this.f_bq = 5000
                        }

                    } else if (this.f_form.f_type === 7) {
                        let m = this.f_form.f_number
                        switch (true) {
                            case m <= 1000:
                                this.f_sl = 50;
                                this.f_bq = 30;
                                this.f_zx = 50;
                                break;
                            case m > 1000 && m <= 10000:
                                this.f_sl = 50;
                                this.f_bq = 1020;
                                this.f_zx = 50;
                                break;
                            case m > 10000 && m <= 100000:
                                this.f_sl = 50;
                                this.f_bq = 1020;
                                this.f_zx = 7400;
                                break;
                            case m > 100000 && m <= 500000:
                                this.f_sl = 50;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 7400;
                                break;
                            case m > 500000 && m <= 5000000:
                                this.f_sl = 50;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 52400;
                                break;
                            case m > 5000000 && m <= 10000000:
                                this.f_sl = 50;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 77400;
                                break;
                            case 10000000 < m:
                                this.f_sl = 50;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 77400 + (m - 10000000) - 0.1 / 100;
                                break;
                        }
                        if (this.f_bq >= 5000) {
                            this.f_bq = 5000
                        }
                    } else if (this.f_form.f_type === 8) {
                        let m = this.f_form.f_number
                        switch (true) {

                            case m > 0 && m <= 1000:
                                this.f_sl = 100;
                                this.f_bq = 30;
                                this.f_zx = 50;
                                break;
                            case m > 1000 && m <= 10000:
                                this.f_sl = 100;
                                this.f_bq = 1020;
                                this.f_zx = 50;
                                break;
                            case m > 10000 && m <= 100000:
                                this.f_sl = 100;
                                this.f_bq = 1020;
                                this.f_zx = 7400;
                                break;
                            case m > 100000 && m <= 500000:
                                this.f_sl = 100;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 7400;
                                break;
                            case m > 500000 && m <= 5000000:
                                this.f_sl = 100;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 52400;
                                break;
                            case m > 5000000 && m <= 10000000:
                                this.f_sl = 100;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 77400;
                                break;
                            case 10000000 < m:
                                this.f_sl = 100;
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 77400 + (m - 10000000) - 0.1 / 100;
                                break;
                        }
                        if (this.f_bq >= 5000) {
                            this.f_bq = 5000
                        }
                    } else if (this.f_form.f_type === 9) {

                        let m = this.f_form.f_number
                        switch (true) {
                            case m <= 1000:
                                this.f_sl = '50-100';
                                this.f_bq = 30;
                                this.f_zx = 50;
                                break;
                            case m > 1000 && m <= 10000:
                                this.f_sl = '50-100';
                                this.f_bq = 1020;
                                this.f_zx = 50;
                                break;
                            case m > 10000 && m <= 100000:
                                this.f_sl = '50-100';
                                this.f_bq = 1020;
                                this.f_zx = 7400;
                                break;
                            case m > 100000 && m <= 500000:
                                this.f_sl = '50-100';
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 7400;
                                break;
                            case m > 500000 && m <= 5000000:
                                this.f_sl = '50-100';
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 52400;
                                break;
                            case m > 5000000 && m <= 10000000:
                                this.f_sl = '50-100';
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 77400;
                                break;
                            case 10000000 && m:
                                this.f_sl = '50-100';
                                this.f_bq = 1020 + (m - 100000) * 0.5 / 100;
                                this.f_zx = 77400 + (m - 10000000) - 0.1 / 100;
                                break;
                        }
                        if (this.f_bq > 5000) {
                            this.f_bq = 5000
                        }
                    }

                    if (this.f_form.f_type === 5){
                        if (this.f_form.f_number === 0) {
                            this.f_sl = '500-1000';
                            this.f_bq = 30;
                            this.f_zx = 50;
                        }

                    }
                })
            },
            f_reset(formName) {
                this.$refs[formName].resetFields();
                this.f_fee_dis = false
                this.f_sl = 0
                this.f_bq = 0
                this.f_zx = 0
            },

            //律师区域
            addressChange(val) {
                this.fee_form.address = val
                this.address_standard = val
            },
            //律师案件类型改变
            caseChange(val) {
                console.log('case', val)
                this.earning = ''
                if (val === 1) {
                    this.fee_dis = true
                    this.money_show = true
                    this.fee_form.number = 0
                } else {
                    this.fee_dis = false
                    this.money_show = false
                    this.fee_form.number = 0
                }
            },

            //律师 是否涉及财产
            money_change(val) {
                console.log('valsdavcasdv',val)
                if (!val) {
                    this.fee_dis = true
                    this.fee_form.number = 0
                } else {
                    this.fee_dis = false
                }
            },
            //律师收费计算
            caculate(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    console.log('asjvcfaijvjha', this.fee_form)
                    if (this.fee_form.address === 1) {
                        if (this.fee_form.type === 1) {
                            this.earning = '侦查阶段1500-10000元，审查起诉阶段2000-10000元，一审阶段3000-30000元';
                        } else {
                            if (!this.fee_form.money) {
                                this.earning = '3000-12000元'
                            } else {
                                let m = this.fee_form.number * 10000
                                let min, max
                                switch (true) {
                                    case  m <= 100000:
                                        min = m * 8 / 100;
                                        break;
                                    case m > 100000 && m <= 1000000:
                                        min = 8000 + (m - 100000) * 5 / 100;
                                        break;
                                    case m > 1000000 && m <= 10000000:
                                        min = 53000 + (m - 1000000) * 3 / 100;
                                        break;

                                    case m > 10000000 && m <= 100000000:
                                        min = 323000 + (m - 10000000) * 1 / 100;
                                        break;
                                    case 100000000 < m:
                                        min = 1223000 + (m - 100000000) * 0.5 / 100;
                                        break;
                                }
                                if (min <= 3000) {
                                    min = 3000
                                }
                                switch (true) {
                                    case m <= 100000:
                                        max = m * 12 / 100;
                                        break;
                                    case m > 100000 && m <= 1000000:
                                        max = 12000 + (m - 100000) * 7 / 100;
                                        break;
                                    case m > 1000000 && m <= 10000000:
                                        max = 75000 + (m - 1000000) * 5 / 100;
                                        break;
                                    case m > 10000000 && m <= 100000000:
                                        max = 525000 + (m - 10000000) * 3 / 100;
                                        break;
                                    case m > 1000000000 < m:
                                        max = 3225000 + (m - 100000000) * 1 / 100;
                                        break;
                                }
                                if (max <= 3000) {
                                    max = 3000
                                }
                                if (m === 0) {
                                    this.earning = 3000 + '-' + 12000 + '元';
                                } else {
                                    this.earning = min + '-' + max + '元';
                                }


                            }
                        }
                    } else if (this.fee_form.address === 2) {
                        if (this.fee_form.type == 1) {
                            this.earning = '侦查阶段2000-10000元，审查起诉阶段2000-10000元，一审阶段4000-30000元';
                        } else {
                            if (!this.fee_form.money) {
                                this.earning = '3000-10000元/件'
                            } else {
                                let m = this.fee_form.number * 10000
                                let min, max
                                //min
                                switch (true) {
                                    case m <= 100000:
                                        min = 3000;
                                        break;
                                    case m > 100000 && m <= 1000000:
                                        min = 3000;
                                        break;
                                    case m > 1000000 && m <= 10000000:
                                        min = 3000;
                                        break;
                                    case m > 10000000 && m <= 100000000:
                                        min = 3000;
                                        break;
                                    case 100000000 < m:
                                        min = 3000;
                                        break;
                                }
                                if (min <= 3000) {
                                    min = 3000
                                }
                                //max
                                switch (true) {
                                    case m <= 100000:
                                        max = m * 10 / 100;
                                        break;
                                    case m > 100000 && m <= 1000000:
                                        max = 10000 + (m - 100000) * 6 / 100;
                                        break;
                                    case m > 1000000 && m <= 10000000:
                                        max = 64000 + (m - 500000) * 4 / 100;
                                        break;
                                    case 10000000 < m:
                                        max = 424000 + (m - 1000000) * 2 / 100;
                                        break;
                                }
                                if (max <= 3000) {
                                    max = 3000
                                }
                                this.earning = min + '-' + max + '元';
                            }
                        }
                    } else if (this.fee_form.address === 3) {
                        if (this.fee_form.type == 1) {
                            this.earning = '侦查阶段1000-8000元，审查起诉阶段1500-10000元，一审阶段3000-20000元';
                        } else {
                            if (!this.fee_form.money) {
                                this.earning = '2500-10000元'
                            } else {
                                let m = this.fee_form.number * 10000
                                let min, max
                                switch (true) {
                                    case m <= 10000:
                                        min = 2500;
                                        break;
                                    case m > 10000 && m <= 100000:
                                        min = 2500 + (m - 10000) * 6 / 100;
                                        break;
                                    case m > 100000 && m <= 500000:
                                        min = 7900 + (m - 100000) * 5 / 100;
                                        break;
                                    case m > 500000 && m <= 1000000:
                                        min = 27900 + (m - 500000) * 4 / 100;
                                        break;
                                    case m > 1000000 && m <= 5000000:
                                        min = 47900 + (m - 1000000) * 3 / 100;
                                        break;
                                    case m > 5000000 && m <= 10000000:
                                        min = 167900 + (m - 5000000) * 2 / 100;
                                        break;
                                    case m > 10000000 && m <= 100000000:
                                        min = 267900 + (m - 10000000) * 1 / 100;
                                        break;
                                    case 100000000 < m:
                                        min = 1167900 + (m - 100000000) * 0.5 / 100;
                                        break;
                                }
                                switch (true) {
                                    case m <= 10000:
                                        max = 10000;
                                        break;
                                    case m <= 100000:
                                        max = 10000 + (m - 10000) * 7 / 100;
                                        break;
                                    case m <= 500000:
                                        max = 16300 + (m - 100000) * 6 / 100;
                                        break;
                                    case m > 100000 && m <= 1000000:
                                        max = 40300 + (m - 500000) * 5 / 100;
                                        break;
                                    case m > 1000000 && m <= 5000000:
                                        max = 65300 + (m - 1000000) * 4 / 100;
                                        break;
                                    case m > 5000000 && m <= 10000000:
                                        max = 225300 + (m - 5000000) * 3 / 100;
                                        break;
                                    case m > 10000000 && m <= 100000000:
                                        max = 375300 + (m - 10000000) * 2 / 100;
                                        break;
                                    case 100000000 < m:
                                        max = 2175300 + (m - 100000000) * 1 / 100;
                                        break;
                                }
                                this.earning = min + '-' + max + '元';
                            }
                        }
                    } else if (this.fee_form.address === 4) {
                        if (this.fee_form.type == 1) {
                            this.earning = '侦查阶段1500-8000元，审查起诉阶段1500-10000元，一审阶段2500-25000元';
                        } else {
                            if (!this.fee_form.money) {
                                this.earning = '1500-8000元'
                            } else {
                                let m = this.fee_form.number * 10000
                                console.log('m--zj', m)
                                let min, max
                                switch (true) {
                                    case m <= 100000:
                                        min = 4.8 / 100 * m;
                                        break;
                                    case m > 100000 && m <= 500000:
                                        min = 4800 + (m - 100000) * 4 / 100;
                                        break;
                                    case m > 500000 && m <= 1000000:
                                        min = 20800 + (m - 500000) * 3.2 / 100;
                                        break;
                                    case m > 1000000 && m <= 5000000:
                                        min = 36800 + (m - 1000000) * 2.4 / 100;
                                        break;
                                    case m > 5000000 && m <= 10000000:
                                        min = 132800 + (m - 5000000) * 1.6 / 100;
                                        break;
                                    case 10000000 < m:
                                        min = 212800 + (m - 10000000) * 0.8 / 100;
                                        break;
                                }
                                if (min <= 1500) {
                                    min = 1500
                                }
                                switch (true) {
                                    case m <= 100000:
                                        max = 6.4 / 100 * m;
                                        break;
                                    case m > 100000 && m <= 500000:
                                        max = 6400 + (m - 100000) * 4.8 / 100;
                                        break;
                                    case m > 500000 && m <= 1000000:
                                        max = 25600 + (m - 500000) * 4 / 100;
                                        break;
                                    case m > 1000000 && m <= 5000000:
                                        max = 45600 + (m - 1000000) * 3.2 / 100;
                                        break;
                                    case m > 5000000 && m <= 10000000:
                                        max = 173600 + (m - 5000000) * 2.4 / 100;
                                        break;
                                    case 10000000 < m:
                                        max = 293600 + (m - 10000000) * 1.6 / 100;
                                        break;
                                }
                                if (max <= 1500) {
                                    max = 1500
                                }
                                this.earning = min + '-' + max + '元';
                            }

                        }
                    }
                })


            },
            lawyerFeeLink() {
                let index = this.fee_form.address

                switch (index) {
                    case 1:
                        window.open("http://lg.justice.gov.cn/help/law-article.jsp?id=13f096cb907aae4ee17f054942f071cf");
                        break;
                    case 2:
                        window.open("http://www.bjpc.gov.cn/zwxx/zcfg/xcwj/zcwj/201605/t10210624.htm");
                        break;
                    case 3:
                        window.open("http://www.yandu.gov.cn/Front/GovInfoPub/Infodetail_bm.aspx?infoid=9912f38f-b43b-41c8-babd-97af4ae0d91c&CategoryNum=002007001&DeptCode=002043");
                        break;
                    case 4:
                        window.open("http://www.zj.gov.cn/art/2015/10/14/art_13013_246847.html");
                        break;
                }
            },
            courtFeeLink() {
                window.open("http://www.gov.cn/zwgk/2006-12/29/content_483407.htm");
            },
            //重置律师收费
            reset(formName) {
                this.$refs[formName].resetFields();
                this.min = 0
                this.max = 0
                this.fee_dis = false
                this.time_dis = true
            },
            handleClickCase(tab, event) {

                console.log(tab.index);
            },

        },

    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>

</style>
