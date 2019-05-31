<template>
    <div class="info-box">
        <div class="tab-component tab-component__mini">
            <ul class="tab-list">
                <li class="tab-item  tab-active">单位信息</li>
            </ul>
            <div class="co-9FA5B9 mg-right-15 cursor" @click="openInfoDialog(stepData)">
                <i class="iconfont  icon-bianji5 ft-14 mg-right-5"></i>
                <span>编辑</span>
            </div>
        </div>
        <ul class="list-group">
            <li class="item">
                <span class="item-label">地区：</span>
                <span class="item-text">{{stepData.unit_area_text}}</span>
            </li>
            <li class="item" style="width: 66%">
                <span class="item-label">单位类型：</span>
                <span class="item-text" v-if="stepData.unit_type===1">法院</span>
                <span class="item-text" v-if="stepData.unit_type===2">检察院</span>
                <span class="item-text" v-if="stepData.unit_type===3">公安机关</span>
                <span class="item-text" v-if="stepData.unit_type===4">仲裁机构</span>
            </li>
            <li class="item" style="width: 100%">
                <span class="item-label">单位名称：</span>
                <span class="item-text">{{stepData.unit_name}}</span>
            </li>
        </ul>
        <div class="tab-component tab-component__mini">
            <ul class="tab-list">
                <li class="tab-item  tab-active">承办人员</li>
            </ul>
            <div class="co-9FA5B9 mg-right-15 cursor" @click="addJudgeDialog">
                <i class="iconfont  icon-add1 ft-14 mg-right-5"></i>
                <span>添加</span>
            </div>
        </div>
        <el-table :data="judgeData" style="margin-bottom: 10px" cell-class-name="border-dashed" element-loading-text="正在加载中...">
            <el-table-column prop="name" label="姓名" width="70" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="phone" label="联系方式" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="class" label="科室"></el-table-column>
            <el-table-column prop="job" label="职务"></el-table-column>
            <el-table-column prop="address" label="联系地址" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button class="co-9FA5B9" type="text"  @click="editJudgeDialog(scope.row)">
                        编辑
                    </el-button>
                    <span class="bar"></span>
                    <el-button class="text-danger" type="text"
                               @click="deleteJudgeRow(scope.row,scope.$index)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="tab-component tab-component__mini">
            <ul class="tab-list">
                <li class="tab-item  tab-active">庭审记录</li>
            </ul>
            <div class="co-9FA5B9 mg-right-15 cursor" @click="openTrialAdd(stepData)">
                <i class="iconfont icon-add1 ft-14 mg-right-5"></i>
                <span>添加</span>
            </div>
        </div>
        <ul class="list-group" v-for="item in trialData" :key="item.id">
            <li class="item__panel">
                <span class="item__panel-title">{{item.type}}（{{item.start_time}}）</span>
                <div class="item__panel-control cursor">
                    <div class="co-9FA5B9 mg-right-30" @click="openTrialEdit(item)">
                        <i class="iconfont  icon-bianji5 ft-14 mg-right-5"></i>
                        <span>编辑</span>
                    </div>
                    <div class="text-danger" @click="deleteTrialRow(item)">
                        <i class="iconfont  icon-shanchu2 ft-14 mg-right-5"></i>
                        <span>删除</span>
                    </div>
                </div>
            </li>
            <li class="item" style="width: 100%">
                <span class="item-label" >出庭律师：</span>
                <span class="item-text">{{item.lawyers_text}}</span>
            </li>
            <li class="item" style="width: 100%">
                <span class="item-label">开庭地址：</span>
                <span class="item-text">{{item.address}}</span>
            </li>
            <li class="item" style="width: 100%">
                <span class="item-label text-link">争议焦点：</span>
                <span class="item-text">{{item.arguments}}</span>
            </li>
            <li class="item " style="width: 100%">
                <span class="item-label">我方意见：</span>
                <span class="item-text">{{item.mine_view}}</span>
            </li>
            <li class="item " style="width: 100%">
                <span class="item-label">对方意见：</span>
                <span class="item-text">{{item.other_view}}</span>
            </li>
            <li class="item " style="width: 100%">
                <span class="item-label">法官态度：</span>
                <span class="item-text">{{item.judge_view}}</span>
            </li>
            <li class="item " style="width: 100%">
                <span class="item-label">庭审总结：</span>
                <span class="item-text">{{item.summary}}</span>
            </li>
        </ul>
        <div v-if="trialData.length===0" class="text-center co-999" style="padding: 100px 0">
            暂无信息，请点击<em class="co-9FA5B9"> "添加" </em>您的庭审记录
        </div>
        <trial-new :trialAdd="trialAdd" :trialEdit="trialEdit" @trialRefresh="trialRefresh"></trial-new>
        <case-judge :judgeEdit="judgeEdit" :judgeAdd="judgeAdd" @judgeRefresh="judgeRefresh"></case-judge>
        <unit-info :unitInfo="unitInfo"></unit-info>
    </div>
</template>
<script>
    import trialNew from '../case/trial-new/index'
    import caseJudge from '../case/case-judge/index'
    import unitInfo from '../case-simple/unit-info/index'

    export default {
        components: {
            trialNew,
            caseJudge,
            unitInfo
        },
        props: ['stepData'],
        data() {
            return {
                unitInfo: {},
                judgeEdit: {},
                judgeAdd: {},
                trialAdd: {},
                trialEdit: {},
                trialData: [],
                detailVisible: false,
                detailData: {},
                loading: false,
                rowId: '',
                rowIndex: '',
                lawyersOptions: [],
                trStatusOptions: [],
                judgeData: [],
                typeOptions: [],
                trialVisible: false,
                isCreated: 1,
                btnActive: 0,
            }
        },
        mounted() {
            this.getTrialList(this.stepData.id)
            this.getJudgeList(this.stepData.id)
        },

        methods: {

            /**
             * 打开单位信息编辑弹窗
             * @params: mod
             * @return: 返回值/返回值说明
             */
            openInfoDialog(stepData) {
                this.unitInfo = {
                    visible: true,
                    code: stepData.case_code
                }
            },

            //打开新增弹窗
            addJudgeDialog() {
                this.judgeAdd = {
                    visible: true,
                    caseId: this.stepData.id,
                }
            },
            //打开编辑执行弹窗
            editJudgeDialog(item) {
                this.judgeEdit = {
                    visible: true,
                    id: item.id,
                }
            },

            closeTrialDialog(formName) {
                this.$refs[formName].resetFields()
                this.trialForm = {}
            },

            /**
             * 点击表格一整行
             * @params: mod
             * @return: 返回值/返回值说明
             */
            clickRow(row, event, column) {
                return false
                this.detailVisible = true
                this.$fetch.api_receivables.detail(row.id)
                    .then(
                        ({
                             data, msg
                         }) => {
                            this.detailData = data
                        }
                    )
                    .catch((
                        msg
                    ) => {
                    })
            },


            /**
             * 获取table数据
             * @params: mod
             * @return: []
             */
            getJudgeList(cid) {
                this.$fetch.api_judge.list({cid: cid})
                    .then(
                        ({
                             data
                         }) => {
                            this.judgeData = data.data
                        }
                    )
                    .catch((
                        msg
                    ) => {
                    })
            },

            /**
             * 获取庭审记录数据
             * @params: mod
             * @return: []
             */
            getTrialList(cid) {
                this.$fetch.api_trial.list({cid: cid})
                    .then(
                        ({
                             data
                         }) => {
                            this.trialData = data.data
                        }
                    )

            },

            /**
             * 打开庭审新增弹窗
             * @params: mod
             * @return: 返回值/返回值说明
             */
            openTrialAdd(stepData) {
                this.trialAdd = {
                    visible: true,
                    caseId: stepData.id,
                }
            },

            /**
             * 打开庭审编辑弹窗
             * @params: mod
             * @return: 返回值/返回值说明
             */
            openTrialEdit(item) {
                this.trialEdit = {
                    visible: true,
                    id: item.id,
                }
            },

            trialRefresh() {
                this.getTrialList(this.stepData.id)
            },

            judgeRefresh() {
                this.getJudgeList(this.stepData.id)
            },

            deleteJudgeRow(row, index) {
                this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'is-plain'
                })
                    .then(() => {
                        this.handelJudgeDel(row, index)
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
            },
            /**
             * 发送请求，删除
             * @params: mod
             * @return: 返回值/返回值说明
             */
            handelJudgeDel(row, index) {
                this.$fetch.api_judge.deleted(row.id)
                    .then(
                        ({
                             msg
                         }) => {
                            this.$message.success(msg)
                            this.judgeData.splice(index, 1)
                        }
                    )
                    .catch((
                        msg
                    ) => {
                    })
            },

            /**
             * 删除前二次确认
             * @params: mod
             * @return: 返回值/返回值说明
             */
            deleteTrialRow(row, index) {
                this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'is-plain'
                })
                    .then(() => {
                        this.handelJudgeDel(row, index)
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
            },

            /**
             * 发送请求，删除
             * @params: mod
             * @return: 返回值/返回值说明
             */
            handelDel(row, index) {
                this.$fetch.api_trial.deleted(row.id)
                    .then(
                        ({
                             msg
                         }) => {
                            this.$message.success(msg)
                            this.trialData.splice(index, 1)
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
