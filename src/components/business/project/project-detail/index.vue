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
            <div class="text-info mg-right-15 cursor " @click="editCase(code,case_id)">
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
                            <li class="item-text">开始时间({{baseData.start_time_text}})</li>
                            <li class="item-line">— —</li>
                            <li class="item-text">结束时间({{baseData.end_time_text}})</li>
                            <li class="item-line">— —</li>
                            <li class="item-text" v-if="baseData.pr_status===1">项目状态(进行中)</li>
                            <li class="item-text" v-if="baseData.pr_status===2">项目状态(已结束)</li>
                        </ul>
                    </div>
                </li>
                <li class="item" >
                    <span class="step-circle"></span>
                    <span class="step-line"></span>
                    <div class="step-main">
                        <span class="sm-label">基本信息：</span>
                        <ul class="sm-group">
                            <li class="item-text">项目名称({{baseData.pr_name}})</li>
                            <li class="item-line">— —</li>
                            <li class="item-text">项目类型({{baseData.pr_type_text}})</li>
                            <li class="item-line">— —</li>
                            <li class="item-text">所属客户({{baseData.cl_id_name}})</li>
                        </ul>
                    </div>
                </li>
                <li class="item" >
                    <span class="step-circle"></span>
                    <div class="step-main">
                        <span class="sm-label">其他：</span>
                        <ul class="sm-group">
                            <li class="item-text">发票金额({{baseData.invoice_money_count}}元)</li>
                        </ul>
                    </div>
                </li>
            </ul>
            <ul class="list-group" v-show="btnActive===1">
                <li class="item">
                    <span class="step-circle"></span>
                    <span class="step-line"></span>
                    <div class="step-main">
                        <span class="sm-label">主要联系人：</span>
                        <ul class="sm-group">
                            <li class="item-text co-409EFF"
                                v-for="(item,index) in baseData.clcontact_data"
                                :key="index"
                            >{{item.name}}</li>
                        </ul>
                    </div>
                </li>
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
            <ul class="list-group" v-show="btnActive===2">
                <li class="item">
                    <span class="step-circle"></span>
                    <div class="step-main">
                        <span class="sm-label">项目发票：</span>
                        <ul class="sm-group">
                            <li class="item-text co-409EFF"
                                v-for="(item,index) in baseData.invoice_file_arr"
                                :key="index"
                            >{{item.file_name}}</li>
                        </ul>
                    </div>
                </li>
                <li class="item">
                    <span class="step-circle"></span>
                    <div class="step-main">
                        <span class="sm-label">项目合同：</span>
                        <ul class="sm-group">
                            <li class="item-text co-409EFF"
                                v-for="(item,index) in baseData.contract_file_arr"
                                :key="index"
                            >{{item.linkid_text}}</li>
                        </ul>
                    </div>
                </li>
            </ul>
            <div class="list-group" v-show="btnActive===3">
                <li class="item">
                    <span class="step-circle"></span>
                    <div class="step-main">
                        <span class="sm-label">项目需求：</span>
                        <ul class="sm-group">
                            <li class="item-text">({{baseData.require_des}})</li>
                        </ul>
                    </div>
                </li>

            </div>
            <ul class="list-group" v-show="btnActive===4">
                <li class="item">
                    <span class="step-circle"></span>
                    <div class="step-main">
                        <span class="sm-label">项目备注：</span>
                        <ul class="sm-group">
                            <li class="item-text">({{baseData.mark}})</li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
        <project-new :editData="editData" @refreshData="refreshData"></project-new>
    </div>
</template>
<script>
    import projectNew from '../project-new'

    export default {
        components: {
            projectNew,
        },
        data () {
            return {
                baseData:{},
                btnActive:0,
                tabTitle:'案件',
                editData: '',
                code: this.$route.query.code,
                case_id: this.$route.query.id,
                tabActive: 0,
                btnList: [
                    {
                        icon: 'icon-quanbu',
                        text: '项目详情'
                    },
                    {
                        icon: 'icon-feiyong',
                        text: '项目承办'
                    },
                    {
                        icon: 'icon-lvsuo',
                        text: '项目附件'
                    },
                    {
                        icon: 'icon-tuanduichengyuan',
                        text: '项目需求'
                    },
                    {
                        icon: 'icon-feiyong',
                        text: '项目备注'
                    },
                ],

                infoTab: [
                    {
                        text: '项目详情'
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
                this.editData = {
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
                this.$fetch.api_project.projectLook(this.code)
                    .then(
                        ({
                             data,
                         }) => {
                            this.baseData = data
                        }
                    )
            },
            refreshData(val){
                if (val){
                   this.getBaseData()
                }
            }
        },


    }
</script>
