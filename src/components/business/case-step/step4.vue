<template>
    <div class="info-box">
        <div class="tab-component tab-component__mini">
            <ul class="tab-list">
                <li class="tab-item  tab-active">财产保全</li>
            </ul>
            <div class="co-9FA5B9 mg-right-15 cursor" @click="addPropertyDialog">
                <i class="iconfont  icon-add1 ft-14 mg-right-5"></i>
                <span>添加</span>
            </div>
        </div>
        <ul class="list-group" v-for="(item,index) in propertyData" :key="index">
            <li class="item__panel">
                <span class="item__panel-title">{{item.p_type_text}}<span class="fw-400"> - {{item.status_text}}</span></span>
                <div class="item__panel-control cursor">
                    <div class="co-9FA5B9 mg-right-30" @click="editPropertyDialog(item)">
                        <i class="iconfont  icon-bianji5 ft-14 mg-right-5"></i>
                        <span>编辑</span>
                    </div>
                    <div class="text-danger" @click="deletePropertyDialog(item,index)">
                        <i class="iconfont  icon-shanchu2  ft-14 mg-right-5"></i>
                        <span>删除</span>
                    </div>
                </div>
            </li>
            <li class="item">
                <span class="item-label">裁定书编号：</span>
                <span class="item-text">{{item.cds_num}}</span>
            </li>
            <li class="item" style="width: 66%">
                <span class="item-label">申请人：</span>
                <span class="item-text">{{item.applicant}}</span>
            </li>
            <li class="item">
                <span class="item-label">保全金额：</span>
                <span class="item-text">{{item.bq_amount}}</span>
            </li>
            <li class="item" style="width: 66%">
                <span class="item-label">被申请人：</span>
                <span class="item-text">{{item.respondent}}</span>
            </li>
            <li class="item">
                <span class="item-label">财产类型：</span>
                <span class="item-text">{{item.p_type_text}}</span>
            </li>
            <li class="item" style="width: 66%">
                <span class="item-label">受理单位：</span>
                <span class="item-text">{{item.unit}}</span>
            </li>
            <li class="item">
                <span class="item-label">查封日期：</span>
                <span class="item-text">{{item.cf_date}}</span>
            </li>
            <li class="item" style="width: 66%">
                <span class="item-label">承办人员：</span>
                <span class="item-text">{{item.judge}}</span>
            </li>
            <li class="item">
                <span class="item-label">查封到期日：</span>
                <span class="item-text">{{item.cf_d_date}}</span>
            </li>
            <li class="item">
                <span class="item-label">续封日期：</span>
                <span class="item-text">{{item.xf_date}}</span>
            </li>
            <li class="item">
                <span class="item-label">续封到期日：</span>
                <span class="item-text">{{item.xf_d_date}}</span>
            </li>
            <li class="item" style="width: 100%">
                <span class="item-label">备注：</span>
                <span class="item-text">{{item.remark}}</span>
            </li>
        </ul>
        <div v-if="propertyData.length===0" class="text-center co-999" style="padding: 100px 0">
            暂无财产保全信息
        </div>
        <div class="tab-component tab-component__mini">
            <ul class="tab-list">
                <li class="tab-item  tab-active">执行情况</li>
            </ul>
            <div class="co-9FA5B9 mg-right-15 cursor" @click="addExecutionDialog">
                <i class="iconfont  icon-add1 ft-14 mg-right-5"></i>
                <span>添加</span>
            </div>
        </div>
        <ul class="list-group" v-for="(item,index) in executionData" :key="item.id">
            <li class="item__panel">
                <span class="item__panel-title">{{item.type_text}}<span class="fw-400"> - {{item.status_text}}</span></span>
                <div class="item__panel-control cursor">
                    <div class="co-9FA5B9 mg-right-30" @click="editExecutionDialog(item)">
                        <i class="iconfont  icon-bianji5 ft-14 mg-right-5"></i>
                        <span>编辑</span>
                    </div>
                    <div class="text-danger" @click="deleteExecutionDialog(item,index)">
                        <i class="iconfont  icon-shanchu2 ft-14 mg-right-5"></i>
                        <span>删除</span>
                    </div>
                </div>
            </li>
            <li class="item">
                <span class="item-label">受理单位：</span>
                <span class="item-text">{{item.unit}}</span>
            </li>
            <li class="item">
                <span class="item-label">执行案号：</span>
                <span class="item-text">{{item.anhao}}</span>
            </li>
            <li class="item">
                <span class="item-label">申请执行时间：</span>
                <span class="item-text">{{item.zx_date}}</span>
            </li>
            <li class="item" style="width: 100%">
                <span class="item-label">执行请求：</span>
                <span class="item-text">{{item.require}}</span>
            </li>
            <li class="item" style="width: 100%">
                <span class="item-label">履行情况：</span>
                <span class="item-text">{{item.remark}}</span>
            </li>
        </ul>
        <div v-if="executionData.length===0" class="text-center co-999" style="padding: 100px 0">
            暂无执行情况信息
        </div>
        <execution-new :executionEdit="executionEdit" :executionAdd="executionAdd"
                       @executionRefresh="executionRefresh"></execution-new>
        <property-new :propertyEdit="propertyEdit" :propertyAdd="propertyAdd"
                      @propertyRefresh="propertyRefresh"></property-new>
    </div>
</template>
<script>
    import executionNew from '../case/execution-new'
    import propertyNew from '../case/property-new'

    export default {
        components: {
            executionNew,
            propertyNew
        },
        props: ['stepData'],
        data () {
            return {
                executionData: [],
                propertyData: [],
                btnActive: 0,
                tabTitle: '案件',
                caseEdit: {},
                executionEdit: {},
                executionAdd: {},
                propertyEdit: {},
                propertyAdd: {}

            }
        },
        mounted () {
            this.getExecutionList(this.stepData.id)
            this.getPropertyList(this.stepData.id)
        },
        methods: {
            /**
             * 执行情况的新增，编辑提交后，更新列表页
             * @params: mod
             * @return: 返回值/返回值说明
             */
            executionRefresh (val) {
                if (val) {
                    this.getExecutionList(this.stepData.id)
                }
            },

            //打开新增执行弹窗
            addExecutionDialog () {
                this.executionAdd = {
                    visible: true,
                    caseOptions: [{ value: this.stepData.id, label: this.stepData.case_name }],
                    caseId: this.stepData.id
                }
            },
            //打开编辑执行弹窗
            editExecutionDialog (item) {
                this.executionEdit = {
                    visible: true,
                    caseOptions: [{ value: this.stepData.id, label: this.stepData.case_name }],
                    caseId: this.stepData.id,
                    id: item.id
                }
            },
            //执行情况删除请求
            handelDelExecution (row, index) {
                this.$fetch.api_trial.deleted(row.id)
                    .then(
                        ({
                             msg
                         }) => {
                            this.$message.success(msg)
                            this.executionData.splice(index, 1)
                        }
                    )
                    .catch((
                        msg
                    ) => {})
            },
            //执行情况删除确认
            deleteExecutionDialog (row, index) {
                this.$confirm('此操作将删除该条执行情况, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'is-plain'
                })
                    .then(() => {
                        this.handelDelExecution(row, index)
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
            },
            /**
             * 获取执行情况列表
             * @params: mod
             * @return: []
             */
            getExecutionList (cid) {
                this.$fetch.api_execution.list({ cid: cid })
                    .then(
                        ({
                             data
                         }) => {
                            this.executionData = data.data
                        }
                    )
                    .catch((
                        msg
                    ) => {
                    })
            },

            /**
             * 财产保全的新增，编辑提交后，更新列表页
             * @params: mod
             * @return: 返回值/返回值说明
             */
            propertyRefresh (val) {
                console.log('val-ppppppp', val)
                if (val) {
                    this.getPropertyList(this.stepData.id)
                }
            },

            //打开财产保全弹窗
            addPropertyDialog () {
                this.propertyAdd = {
                    visible: true,
                    caseOptions: [{ value: this.stepData.id, label: this.stepData.case_name }],
                    caseId: this.stepData.id
                }
            },
            //打开编辑执行弹窗
            editPropertyDialog (item) {
                this.propertyEdit = {
                    visible: true,
                    caseOptions: [{ value: this.stepData.id, label: this.stepData.case_name }],
                    caseId: this.stepData.id,
                    id: item.id
                }
            },
            //执行情况删除请求
            handelDelProperty (row, index) {
                this.$fetch.api_property.deleted(row.id)
                    .then(
                        ({
                             msg
                         }) => {
                            this.$message.success(msg)
                            this.propertyData.splice(index, 1)
                        }
                    )
                    .catch((
                        msg
                    ) => {})
            },
            //执行情况删除确认
            deletePropertyDialog (row, index) {
                this.$confirm('此操作将删除该条执行情况, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'is-plain'
                })
                    .then(() => {
                        this.handelDelProperty(row, index)
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
            },
            /**
             * 获取执行情况列表
             * @params: mod
             * @return: []
             */
            getPropertyList (cid) {
                console.log('cid', cid)
                this.$fetch.api_property.list({ cid: cid })
                    .then(
                        ({
                             data
                         }) => {
                            this.propertyData = data.data
                        }
                    )
                    .catch((
                        msg
                    ) => {
                    })
            }

        }

    }
</script>
