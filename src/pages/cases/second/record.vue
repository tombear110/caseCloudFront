<template>
    <div class="detail-info" style="padding: 0">
        <div class="record-header">
            <div class="case-name-wrap">
                <h3>{{this.baseData.case_name}}</h3>
                <div class="report-btn" @click="showReport">生成报告</div>
            </div>
            <div class="record-panel">
                <ul class="panel-title">
                    <li class="item-text">
                        <i class="iconfont icon-shijian2"></i>
                        <span>总工时：{{Math.round(time_cost/60*10)/10}} h</span>
                    </li>
                    <li class="item-bar">|</li>
                    <li class="item-text">
                        <i class="iconfont icon-amount1"></i>
                        <span>总金额：{{fee_cost}} 元</span>
                    </li>
                </ul>
                <ul class="panel-control">
                    <li class="item-text" @click="recordOpen = !recordOpen">
                        <el-tooltip class="item" effect="dark" :content="recordOpen?'切换为列表展示':'切换为阶段展示'"
                                    placement="top-start">
                            <div>
                                <i class="iconfont " :class="recordOpen?'icon-pingpumoshi':' icon-liebiao1'"></i>
                                <span v-if="recordOpen">阶段</span>
                                <span v-else>列表</span>
                            </div>
                        </el-tooltip>
                    </li>
                    <li class="item-bar">|</li>
                    <li class="item-text" @click="openStageDialog">
                        <el-tooltip class="item" effect="dark" content="添加案件阶段" placement="top-start">
                            <div>
                                <i class="iconfont icon-tianjiaxiangmu"></i>
                                <span>添加</span>
                            </div>
                        </el-tooltip>
                    </li>
                    <li class="item-bar">|</li>
                    <li class="item-text" @click="exportRecord">
                        <el-tooltip class="item" effect="dark" content="导出案件记录" placement="top-start">
                            <div>
                                <i class="iconfont icon-daochu-tianchong"></i>
                                <span>导出</span>
                            </div>
                        </el-tooltip>
                    </li>
                </ul>
            </div>
        </div>
        <div class="record-box" ref="recordBox" v-show="recordOpen">
            <div class="step-block" v-for="(stem,index) in stageArr" :key="stem.id" ref="stem">
                <div class="step-header" :style="stem.active===1? activeBorder:''">
                    <h3 class="step-header__title">{{stem.name}}</h3>
                    <i class="iconfont  icon-bianji5  step-header__icon" v-if="stem.id"
                       @click="editStageDialog(stem)"></i>
                    <ul class="step-header__group" v-if="stem.id">
                        <li class="item co-9FA5B9" @click="openAddModal(stem)">
                            <i class="iconfont icon-add1 "></i>
                            <span>添加记录</span>
                        </li>
                        <li class="item" @click="setStageActive(stem,index)">
                            <i class="iconfont"
                               :class="stem.active===1 ? 'icon-xingxing text-info':'icon-xingxing1'"></i>
                            <span>设为当前</span>
                        </li>
                        <li class="item text-danger" @click="deleteStage(stem)">
                            <i class="iconfont icon-shanchu2"></i>
                            <span>删除阶段</span>
                        </li>
                    </ul>
                </div>
                <ul class="step-table" v-if="stem.recordData.length">
                    <li class="item" v-for="item in stem.recordData" :key="item.id"
                        @click="openDetailModal(item.rcode)">
                        <div class="item-heading">
                            <ul class="ih-title">
                                <li class="mg-right-10 cursor">
                                    <i class="iconfont ft-15 mg-right-10"
                                       :class="(item.hstatus)?'icon-tucenggouxuan co-ccc':'icon-weigouxuan1 text-danger'"
                                       @click.stop="setHstatus(item)"></i>
                                    <span class="co-999" :class="{'text-danger':item.hstatus===0}"
                                    >{{item.rtype_text}}</span>
                                </li>
                                <li v-if="item.c_file.length">
                                    <i class="iconfont icon-biezhen1 ft-14 text-info"></i>
                                </li>
                            </ul>
                            <ul class="ih-control">
                                <li class="mg-right-20">
                                    <i class="iconfont icon-ren"></i>
                                    <span>{{item.huser_text}}</span>
                                </li>
                                <li class="mg-right-20">
                                    <i class="iconfont icon-shijian"></i>
                                    <span>{{item.time_cost}}分钟</span>
                                </li>
                                <li class="mg-right-40">
                                    <i class="iconfont icon-feiyong"></i>
                                    <span>{{item.fee_cost}}元</span>
                                </li>
                                <li>{{item.htime}}</li>
                            </ul>
                        </div>
                        <p class="item-p">{{item.content}}</p>
                    </li>
                </ul>
                <div class="step-none" v-if="!stem.recordData.length"></div>
            </div>
        </div>
        <div class="record-box" v-show="!recordOpen">
            <div class="step-block">
                <div class="step-header">
                    <h3 class="step-header__title">全部记录</h3>
                    <div style="flex: 1;text-align: right">
                        <div style="display: inline-block" class="text-info cursor" @click="openAddModal(0)">
                            <i class="iconfont icon-add1 "></i>
                            <span>添加记录</span>
                        </div>
                    </div>
                </div>
                <ul class="step-table" v-if="allRecordData.length">
                    <li class="item" v-for="item in allRecordData" :key="item.id" @click="openDetailModal(item.rcode)">
                        <div class="item-heading">
                            <ul class="ih-title">
                                <li class="mg-right-10 cursor">
                                    <i class="iconfont ft-14 mg-right-10"
                                       :class="(item.hstatus)?'icon-tucenggouxuan co-ccc':'icon-weigouxuan1 text-danger'"
                                       @click.stop="setHstatus(item)"></i>
                                    <span class="co-666" :class="{'text-danger':item.hstatus===0,}"
                                    >{{item.rtype_text}}</span>
                                </li>
                                <li v-if="item.c_file.length">
                                    <i class="iconfont icon-biezhen1 ft-14"></i>
                                </li>
                            </ul>
                            <ul class="ih-control">
                                <li class="mg-right-20">
                                    <i class="iconfont icon-ren"></i>
                                    <span>{{item.huser_text}}</span>
                                </li>
                                <li class="mg-right-20">
                                    <i class="iconfont icon-shijian"></i>
                                    <span>{{item.time_cost}}分钟</span>
                                </li>
                                <li class="mg-right-40">
                                    <i class="iconfont icon-feiyong"></i>
                                    <span>{{item.fee_cost}}元</span>
                                </li>
                                <li>{{item.htime}}</li>
                            </ul>
                        </div>
                        <p class="item-p">{{item.content}}</p>
                    </li>
                </ul>
                <div class="step-none" v-if="!allRecordData.length"></div>
            </div>
        </div>
        <stage-new :stageAdd="stageAdd" :stageEdit="stageEdit" @stageRefresh="stageRefresh"></stage-new>
        <record-detail :recordDetail="recordDetail" @refreshDelete="refreshDelete" @onEdit="onEdit"></record-detail>
        <record-edit :recordEdit="recordEdit" :recordAdd="recordAdd" @refreshSave="refreshSave"></record-edit>
        <report-create :report-info="reportInfo"></report-create>
    </div>
</template>

<script>
    import {
        page,
        recordDetail,
        recordEdit,
        stageNew
    } from 'components'
    import reportCreate from '../../../components/dialog/reportCreate'
    import store from 'store'
    import {
        server_base_url
    } from 'common/config'

    export default {
        props: ['caseData'],
        components: {
            page,
            recordDetail,
            recordEdit,
            stageNew,
            reportCreate
        },
        data() {
            return {
                activeBorder: {
                    borderColor: '#ECB86C'
                },
                recordOpen: true,
                isStep: false,
                recordEdit: {},
                recordAdd: {},
                stageAdd: {},
                stageEdit: {},
                recordDetail: {},
                recordTableData: [],
                params: {
                    pageSize: 10
                },
                routeName: this.$route.name,
                cl_code: '',
                cl_id: '',
                baseData: {},
                stageArr: [],
                recordData: [],
                allRecordData: [],
                stageType: 0,
                baseUrl: server_base_url,
                token: store.state.user_info.token,
                code: this.$route.params.code,
                scrollStep: [],
                box: '',
                jsonStage: [],
                time_cost: '',
                fee_cost: '',
                reportInfo: {}
            }
        },
        created() {
        },
        watch: {
            caseData(val) {
                this.params.linkid = val.id
                this.params.type = 1
                this.baseData = val
                this.getData()
            }
        },

        methods: {
            //导出案件记录
            exportRecord() {
                window.open(`${this.baseUrl}record/export?token=${this.token}&type=1&code=${this.code}`)
            },
            //打开新增阶段
            openStageDialog() {
                this.stageAdd = {
                    visible: true,
                    caseId: this.baseData.id
                }
            },
            //打开编辑阶段
            editStageDialog(data) {
                this.stageEdit = {
                    name: data.name,
                    stageId: data.id,
                    visible: true
                }
            },
            //删除阶段
            deleteStage(data) {
                this.$confirm('该操作将会连同案件阶段下面的记录一起删除，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'is-plain'
                }).then(() => {
                    this.$fetch.api_stage.deleted(data.id)
                        .then(({
                                   msg
                               }) => {
                            this.getData()
                        })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })

            },
            //接受从详情传过来的code，打开编辑dialog
            onEdit(data) {
                this.recordEdit = {
                    visible: true,
                    code: data.rcode,
                    type: data.type
                }
                if (data.type === 2) {
                    this.recordEdit.cl_code = data.linkid_id_info.cl_code
                }
            },
            //新增记录
            openAddModal(stem) {
                this.recordAdd = {
                    visible: true,
                    type: this.params.type,
                    linkid: this.params.linkid,
                    stage: stem.id
                }
            },

            //编辑记录
            openEditModal(data) {
                this.recordEdit = {
                    visible: true,
                    code: data.rcode,
                    type: data.type,
                    cl_code: this.cl_code,
                    cl_id: this.cl_id
                }

            },
            //查看记录
            openDetailModal(code) {
                console.log(code)
                this.recordDetail = {
                    visible: true,
                    code: code
                }
            },

            //将案件阶段设为当前
            setStageActive(data, index) {
                let stage_active = data.active === 1 ? 0 : data.id
                this.$fetch.api_case.save(
                    {stage_active: stage_active},
                    this.baseData.id
                )
                    .then(({
                               msg
                           }) => {
                        //标记当前阶段是否激活
                        //将其他阶段全部置0
                        this.stageArr = this.stageArr.map((ele, edex) => {
                            if (index === edex) {
                                ele.active = data.active === 1 ? 0 : 1
                            } else {
                                ele.active = 0
                            }
                            return ele
                        })
                    })

            },

            //记录状态-设为已办，
            setHstatus(item) {
                let hstatus = item.hstatus ? 0 : 1
                this.$fetch.api_record.save({
                    hstatus: hstatus
                }, item.rcode)
                    .then(({
                               msg
                           }) => {
                        for (let i of this.stageArr) {
                            for (let j of i.recordData) {
                                if (j.id === item.id) {
                                    j.hstatus = hstatus
                                }
                            }
                        }
                    })

            },

            refreshDelete(val) {
                if (val) {
                    this.getData()
                }
            },
            stageRefresh(val) {
                if (val.isFresh) {
                    this.getData()
                }
            },
            //子页面新增数据完毕，刷新列表页数据
            refreshSave(val) {
                if (val) {
                    this.getData()
                }
            },

            //获取案件案件记录
            getData() {
                this.$fetch.api_record.list(this.params)
                    .then(({
                               data
                           }) => {
                        this.allRecordData = data.data
                        //如果包含stage=0的数据，则增加一个未归类的stage
                        let otherInclude = data.data.some(item => !item.stage)
                        let stageTemp = otherInclude ? [...(data.stage_arr), {
                            id: 0,
                            name: '未归类'
                        }] : data.stage_arr
                        //给数组对象绑定一个recordData=[]属性
                        stageTemp = stageTemp.map(item => {
                            item.recordData = []
                            return item
                        })
                        //将记录根据阶段stage放入不同的阶段数组中
                        for (let i = 0; i < data.data.length; i++) {
                            for (let j = 0; j < stageTemp.length; j++) {
                                if (data.data[i].stage === stageTemp[j].id) {
                                    stageTemp[j].recordData.push(data.data[i])
                                }
                            }
                        }
                        this.stageArr = stageTemp
                        this.time_cost = data.time_cost ? data.time_cost : 0
                        this.fee_cost = data.fee_cost ? data.fee_cost : 0
                    })
            },
            showReport() {
                this.reportInfo = {
                    visible: true,
                    code: this.code,
                    report_code: this.caseData.report_code
                }
            }
        }

    }
</script>
