<template>
    <div class="detail-info">
        <div class="tab-component">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===index}"
                    v-for="(item,index) in infoTab"
                    :key="item.text">
                    {{item.text}}
                </li>
            </ul>
            <div class="text-info mg-right-15 cursor " @click="editCase(case_code,case_id)">
                <i class="iconfont  icon-bianji5 ft-14 mg-right-5"></i>
                <span>编辑详情</span>
            </div>
        </div>
        <ul class="list-btns">
            <li class="item" :class="{'btn-active':btnActive===index}" v-for="(item,index) in btnList" :key="index" @click="onTabChange(index)">
                <i class="iconfont" :class="item.icon"></i>
                <span>{{item.text}}</span>
            </li>
        </ul>
        <div class="info-box">
            <div class="title">
                <h5>{{tabTitle}}</h5>
            </div>
            <ul class="list-group" v-show="btnActive===0">
                <li class="item">
                    <span class="step-circle"></span>
                    <span class="step-line"></span>
                    <div class="step-main">
                        <span class="sm-label">时间：</span>
                        <ul class="sm-group">
                            <li class="item-text">委托时间({{baseData.pr_time}})</li>
                            <li class="item-line">— —</li>
                            <li class="item-text">立案时间({{baseData.la_time}})</li>
                            <li class="item-line">— —</li>
                            <li class="item-text">裁决日期({{baseData.cj_time}})</li>
                        </ul>
                    </div>
                </li>
                <li class="item" >
                    <span class="step-circle"></span>
                    <span class="step-line"></span>
                    <div class="step-main">
                        <span class="sm-label">基本信息：</span>
                        <ul class="sm-group">
                            <li class="item-text">案件类型({{baseData.c_type_text}})</li>
                            <li class="item-line">— —</li>
                            <li class="item-text">案件阶段({{baseData.h_status_text}})</li>
                            <li class="item-line">— —</li>
                            <li class="item-text">案由({{baseData.anyou}})</li>
                            <li class="item-line">— —</li>
                            <li class="item-text">案号({{baseData.anhao}})</li>
                            <li class="item-line">— —</li>
                            <li class="item-text">结案状态({{baseData.ja_status_text}})</li>
                        </ul>
                    </div>
                </li>
                <li class="item">
                    <span class="step-circle"></span>
                    <div class="step-main">
                        <span class="sm-label">关联案件：</span>
                        <ul class="sm-group">
                            <li class="item-text co-409EFF"
                                v-for="(item,index) in baseData.link_case_arr"
                                :key="index"
                            >{{item.linkid_text}}</li>
                        </ul>
                    </div>
                </li>
            </ul>
            <ul class="list-group" v-show="btnActive===1">
                <li class="item">
                    <span class="step-circle"></span>
                    <span class="step-line"></span>
                    <div class="step-main">
                        <span class="sm-label">合同费用：</span>
                        <ul class="sm-group">
                            <li class="item-text">{{baseData.w_fee}}元</li>
                        </ul>
                    </div>
                </li>
                <li class="item">
                    <span class="step-circle"></span>
                    <span class="step-line"></span>
                    <div class="step-main">
                        <span class="sm-label">已收费用：</span>
                        <ul class="sm-group">
                            <li class="item-text">{{baseData.g_fee}}</li>
                        </ul>
                    </div>
                </li>
                <li class="item">
                    <span class="step-circle"></span>
                    <div class="step-main">
                        <span class="sm-label">备注：</span>
                        <ul class="sm-group">
                            <li class="item-text">{{baseData.fee_mark}}</li>
                        </ul>
                    </div>
                </li>

            </ul>
            <ul class="list-group" v-show="btnActive===2">
                <li class="item">
                    <span class="step-circle"></span>
                    <span class="step-line"></span>
                    <div class="step-main">
                        <span class="sm-label">立案情况：</span>
                        <ul class="sm-group">
                            <li class="item-text">{{baseData.f_status_text}}</li>
                        </ul>
                    </div>
                </li>
                <li class="item">
                    <span class="step-circle"></span>
                    <span class="step-line"></span>
                    <div class="step-main">
                        <span class="sm-label">律所编号：</span>
                        <ul class="sm-group">
                            <li class="item-text">{{baseData.f_num}}</li>
                        </ul>
                    </div>
                </li>
                <li class="item">
                    <span class="step-circle"></span>
                    <div class="step-main">
                        <span class="sm-label">律所立案时间：</span>
                        <ul class="sm-group">
                            <li class="item-text">{{baseData.f_time}}</li>
                        </ul>
                    </div>
                </li>

            </ul>
            <div class="list-group" v-show="btnActive===3">

                <el-table
                    :data="baseData.dlist"
                    siez="mini"
                    style="width: 100%">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <div class="step-main">
                                <span class="sm-label">基本信息：</span>
                                <ul class="sm-group">
                                    <li class="item-text">住所地({{props.address}})</li>
                                    <li class="item-line">— —</li>
                                    <li class="item-text">法定代表人({{props.legal_man}})</li>
                                    <li class="item-line">— —</li>
                                    <li class="item-text">统一社会信用代码({{props.card_num}})</li>
                                    <li class="item-line">— —</li>
                                    <li class="item-text">联系方式({{props.phone}})</li>
                                </ul>
                            </div>
                            <div class="step-main">
                                <span class="sm-label">备注：</span>
                                <ul class="sm-group">
                                    <li class="item-text">住所地({{props.c_type_text}})</li>
                                </ul>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="当事人"
                        prop="name" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span v-if="scope.row.dsr_type===1">（个人）</span>
                            <span v-else>（企业）</span>{{scope.row.name}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="是否是委托人"
                        prop="type">
                        <template slot-scope="scope">
                            <span v-if="scope.row.type===1">是</span>
                            <span v-else>否</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="属性"
                        prop="c_type_text">
                    </el-table-column>
                </el-table>
            </div>
            <ul class="list-group" v-show="btnActive===4">
                <li class="item">
                    <span class="step-circle"></span>
                    <span class="step-line"></span>
                    <div class="step-main">
                        <span class="sm-label">受理单位：</span>
                        <ul class="sm-group">
                            <li class="item-text">单位({{baseData.unit_name}})</li>
                            <li class="item-line">— —</li>
                            <li class="item-text">类型({{baseData.unit_type_text}})</li>
                            <li class="item-line">— —</li>
                            <li class="item-text">法院({{baseData.unit_area_text}})</li>
                        </ul>
                    </div>
                </li>
                <li class="item" v-for="(item,index) in baseData.jlist" :key="index">
                    <span class="step-circle"></span>
                    <div class="step-main">
                        <span class="sm-label">承办人：</span>
                        <ul class="sm-group">
                            <li class="item-text">姓名({{item.name}})</li>
                            <li class="item-line">— —</li>
                            <li class="item-text">电话({{item.phone}})</li>
                            <li class="item-line">— —</li>
                            <li class="item-text">备注({{item.mark}})</li>
                        </ul>
                    </div>
                </li>
            </ul>
            <ul class="list-group" v-show="btnActive===5">
                <li class="item">
                    <span class="step-circle"></span>
                    <span class="step-line"></span>
                    <div class="step-main">
                        <span class="sm-label">主办律师：</span>
                        <ul class="sm-group">
                            <li class="item-text">{{baseData.host_text}}</li>
                        </ul>
                    </div>
                </li>
                <li class="item">
                    <span class="step-circle"></span>
                    <div class="step-main">
                        <span class="sm-label">协办律师：</span>
                        <ul class="sm-group">
                            <li class="item-text">{{baseData.assit_text}}</li>
                        </ul>
                    </div>
                </li>
            </ul>
            <ul class="list-group" v-show="btnActive===6">
                <li class="item">
                    <span class="step-circle"></span>
                    <span class="step-line"></span>
                    <div class="step-main">
                        <span class="sm-label">办理状态：</span>
                        <ul class="sm-group">
                            <li class="item-text">{{baseData.host_text}}</li>
                        </ul>
                    </div>
                </li>
                <li class="item">
                    <span class="step-circle"></span>
                    <span class="step-line"></span>
                    <div class="step-main">
                        <span class="sm-label">时间：</span>
                        <ul class="sm-group">
                            <li class="item-text">结案时间({{baseData.j_time}})</li>
                            <li class="item-line">— —</li>
                            <li class="item-text">归档时间({{baseData.g_time}})</li>
                        </ul>
                    </div>
                </li>
                <li class="item">
                    <span class="step-circle"></span>
                    <span class="step-line"></span>
                    <div class="step-main">
                        <span class="sm-label">归档人：</span>
                        <ul class="sm-group">
                            <li class="item-text">{{baseData.g_user}}</li>
                        </ul>
                    </div>
                </li>
                <li class="item">
                    <span class="step-circle"></span>
                    <div class="step-main">
                        <span class="sm-label">档案保管地：</span>
                        <ul class="sm-group">
                            <li class="item-text">{{baseData.g_address}}</li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
        <case-new :caseEdit="caseEdit"></case-new>
    </div>
</template>
<script>
    import store from 'store'
    import caseNew from '../case-new'

    export default {
        components: {
           caseNew,
        },
        data () {
            return {
                baseData:{},
                btnActive:0,
                tabTitle:'案件',
                caseEdit: '',
                case_code: this.$route.query.code,
                case_id: this.$route.query.id,
                tabActive: 0,
                btnList: [
                    {
                        icon: 'icon-quanbu',
                        text: '案件详情'
                    },
                    {
                        icon: 'icon-feiyong',
                        text: '收费'
                    },
                    {
                        icon: 'icon-lvsuo',
                        text: '律所'
                    },
                    {
                        icon: 'icon-tuanduichengyuan',
                        text: '当事人'
                    },
                    {
                        icon: 'icon-feiyong',
                        text: '受理单位'
                    },
                    {
                        icon: 'icon-renyuan1',
                        text: '办案人员'
                    },
                    {
                        icon: 'icon-guidang',
                        text: '归档情况'
                    }
                ],

                infoTab: [
                    {
                        text: '案件详情'
                    }
                ],
            }
        },
        created () {
            this.getBaseData()
        },

        methods: {
            //详情切换
            onTabChange(index){
                this.btnActive = index
                this.tabTitle = this.btnList[index].text


            },

            //编辑案件
            editCase (code,id) {
                this.caseEdit = {
                    visible: true,
                    code: code,
                    id:id,
                }
            },

            openEditModal (code) {
                // console.log('code***', code)
                this.recordEdit = {
                    visible: true,
                    code: code
                }
            },

            //渲染数据
            getBaseData() {
                this.$fetch.api_case.caseShow(this.case_code)
                    .then(
                        ({
                             data,
                         }) => {
                            this.baseData = data
                        }
                    )
                    .catch((
                        msg
                    ) => {
                        this.$message.error(msg)
                    })
            },



        },


    }
</script>
