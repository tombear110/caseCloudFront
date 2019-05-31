<template>
    <div class="info-box difficulty">
        <div class="tab-component tab-component__mini ">
            <ul class="tab-list">
                <li class="tab-item  tab-active ">办案策略</li>
            </ul>
            <div class="co-9FA5B9 cursor" style="display: flex;align-items: center;" @click="openDifficulty">
                <i class="el-icon-circle-plus" style="padding-right: 10px;"></i>
                <div>添加策略</div>
            </div>
        </div>
        <div class="difficulty-wrap" v-if="strategyItems.length === 0">
            <div class="no-data">
                <img src="/static/images/no-strategy.png" alt="">
                <p>在这里，您可以对案件的办理难点、解决方案进行记录、分析。<br/>
                也可以根据解决方案为您的团队成员添加任务，跟进任务完成情况。</p>
            </div>
        </div>
        <div class="difficulty-wrap" v-for="(item, index) in strategyItems" v-else>
            <div class="difficulty-top">
                <div class="top-title">策略{{index + 1 | numberChinese}}</div>
                <div class="co-9FA5B9 mg-right-15 cursor" @click="editDifficulty(item.id)">
                    <i class="iconfont  icon-bianji5 ft-14 mg-right-5"></i>
                    <span>编辑</span>
                </div>
                <div class="co-EC5050 mg-right-10 cursor" @click="deleteStragegy(item.id)">
                    <i class="iconfont  icon-shanchu2 ft-14 mg-right-5"></i>
                    <span>删除</span>
                </div>
                <i class="iconfont icon-jiantou-copy-copy top-icon cursor" :class="item.down ? 'rotate-down' : 'rotate-up'" style="display: inline-block;transition: 0.3s ease;" @click="checkHide(item)"></i>
            </div>
            <div v-if="!item.down">
            <div class="step-content-wrap">
                <div class="content-title">问题描述：</div>
                <div class="content-item">{{item.difficulty}}</div>
            </div>
            <div class="step-content-wrap">
                <div class="content-title">解决方案：</div>
                <div class="content-item">{{item.solution}}</div>
            </div>
            <div class="step-content-wrap">
                <div class="content-title">处理结果：</div>
                <div class="content-item">{{item.result}}</div>
            </div>
            <div class="tab-component tab-component__mini  mat-10">
                <ul class="tab-list">
                    <li class="tab-item  tab-active" >待办事项</li>
                </ul>
                <div class="co-9FA5B9 cursor" style="display: flex;align-items: center;" @click="addLink(item)">
                    <i class="el-icon-circle-plus" style="padding-right: 10px;"></i>
                    <div>添加</div>
                </div>
            </div>
            <div class="upcoming-wrap">
            <div v-for="(wrapItem, wrapIndex) in matterItems" :key="wrapIndex" class="upcoming-content">
                <div class="matter-wrap cursor" v-for="(matterItem, matterIndex) in wrapItem" :key="matterIndex" v-if="matterItem.link_strategy === item.id" @click="openDetailModal(matterItem.rcode)">
                    <div class="matter-title">
                        <i class="iconfont icon-renshu" style="padding-right: 10px;"></i>
                        <span>{{matterItem.huser_text}}</span>
                    </div>
                    <div class="matter-content">
                        <div class="content-item1">
                            <i class="iconfont check-icon" :class="(matterItem.hstatus)?'icon-tucenggouxuan co-ccc':'icon-weigouxuan1'" @click.stop="setHstatus(matterItem, matterIndex)"></i>
                            <span :class="(matterItem.hstatus) ? 'line-through' : ''">{{matterItem.rtype_text}}</span>
                            <span class="time-out" v-if="calcTimeOut(matterItem.htime)">已超时</span>
                        </div>
                        <div class="content-item2">
                            <i class="iconfont icon-biezhen1 biezhen-icon co-9FA5B9" v-if="matterItem.c_file.length"></i>
                            <span class="co-9FA5B9" v-if="matterItem.c_file.length">样板</span>
                        </div>
                        <div class="content-item3">
                            <i class="iconfont icon-shijian time-icon"></i>
                            <span class="co-999">{{matterItem.htime}}</span>
                        </div>
                    </div>
                    <div class="matter-content-bottom">{{matterItem.content}}</div>
                </div>
            </div>
            </div>
            </div>
        </div>
        <!-- <div class="discuss-part">
            <div class="tab-component tab-component__mini height-35">
                <ul class="tab-list height-35">
                    <li class="tab-item  tab-active tab-active">讨论版块</li>
                </ul>
            </div>
            <div class="discuss-item">
                <div class="discuss-comment">
                    <div class="comment-info">
                        <div class="info-left">
                            <img src="../../../assets/images/user.png" alt="">
                            <span class="info-name">A律师</span>
                            <span class="co-999">2019-04-10</span>
                        </div>
                        <div class="info-right co-9FA5B9">
                            <i class="iconfont icon-pinglun-01" style="padding-right: 10px;font-size: 12px;"></i>
                            <span>回复</span>
                        </div>
                    </div>
                    <div class="comment-txt">保全申请书已完成，请查看</div>
                </div>
                <div class="discuss-comment">
                    <div class="comment-info">
                        <div class="info-left">
                            <img src="../../../assets/images/user.png" alt="">
                            <span class="info-name">A律师</span>
                            <span class="co-999">2019-04-10</span>
                        </div>
                        <div class="info-right co-9FA5B9">
                            <i class="iconfont icon-pinglun-01" style="padding-right: 10px;font-size: 12px;"></i>
                            <span>回复</span>
                        </div>
                    </div>
                    <div class="comment-txt">保全申请书已完成，请查看</div>
                </div>
                <div class="discuss-comment">
                    <div class="comment-info">
                        <div class="info-left">
                            <img src="../../../assets/images/user.png" alt="">
                            <span class="info-name">A律师</span>
                            <span class="co-999">2019-04-10</span>
                        </div>
                        <div class="info-right co-9FA5B9">
                            <i class="iconfont icon-pinglun-01" style="padding-right: 10px;font-size: 12px;"></i>
                            <span>回复</span>
                        </div>
                    </div>
                    <div class="comment-txt">保全申请书已完成，请查看</div>
                </div>
            </div>
            <el-input
                class="comment-input"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 5}"
                placeholder="请输入内容"
                v-model="commentTxt">
            </el-input>
            <el-button type="primary" round class="comment-btn">回复</el-button>
        </div> -->
        <case-strategy :is-created="isCreated" :difficulty-data="difficultyData" @updateStragegy="updateStragegy"></case-strategy>
        <record-detail :recordDetail="recordDetail" @refreshDelete="refreshDelete" @onEdit="onEdit"></record-detail>
        <record-edit :recordEdit="recordEdit" :recordAdd="recordAdd" @refreshSave="updateStragegy"></record-edit>
    </div>
</template>
<script>
    import caseStrategy from '../case-simple/case-strategy/index'
    import recordDetail from '../record/record-detail/index'
    import recordEdit from '../record/record-edit/index'
    export default {
        components: {
            caseStrategy,
            recordDetail,
            recordEdit
        },
        props: ['stepData'],
        data () {
            return {
                isCreated: 1,
                difficultyData: {},
                strategyItems: [],
                matterItems: [],
                recordEdit: {},
                recordAdd: {},
                recordDetail: {},
                commentTxt: '',
                tempItems: []
            }
        },
        computed: {
        },
        watch: {
        },
        created () {
            
        },
        mounted () {
            this.getStrategy()
        },
        methods: {
            openDifficulty() {
                this.isCreated = 1
                this.difficultyData = {
                    visible: true,
                    stepData: this.stepData
                }
            },
            editDifficulty(nowId) {
                this.isCreated = 0
                this.difficultyData = {
                    visible: true,
                    stepData: this.stepData,
                    nowId: nowId
                }
            },
            getStrategy() {
                this.matterItems = []
                this.tempItems = []
                let params = {
                    cid: this.stepData.id
                }
                this.$fetch.api_strategy.list(params).then(({msg, data}) => {
                    let indexNum
                    for (let i=0;i<data.record_list.data.length;i++) {
                        indexNum = this.tempItems.indexOf(data.record_list.data[i].huser)
                        let nowItems = []
                        nowItems.push(data.record_list.data[i])
                        if (indexNum < 0) {
                            this.tempItems.push(data.record_list.data[i].huser)
                            this.matterItems.push(nowItems)
                        } else {
                            this.matterItems[indexNum].push(data.record_list.data[i])
                        }
                    }
                    this.strategyItems = data.data
                    let newIndexNum
                    for (let i=0;i<this.matterItems.length;i++) {

                    }
                }).catch(({msg})=>{

                })
            },
            updateStragegy() {
                this.getStrategy()
            },
            handelStrategyDel(id) {
                let params = {
                    deleteRecords: 1
                }
                this.$fetch.api_strategy.deleted(params, id).then(({msg, data}) => {
                    this.getStrategy()
                }).catch(({msg})=>{

                })
            },
            deleteStragegy(id) {
                this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'is-plain'
                }).then(() => {
                    this.handelStrategyDel(id)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            addLink(item) {
                this.recordAdd = {
                    visible: true,
                    type: 1,
                    linkid: this.stepData.id,
                    isStrategy: 1,
                    strategyId: item.id
                }
            },
            checkHide(item) {
                if (item.down) {
                    item.down = false
                } else {
                    item.down = true
                }
                this.strategyItems = JSON.parse(JSON.stringify(this.strategyItems))
            },
            openDetailModal(rcode) {
                this.recordDetail = {
                    visible: true,
                    code: rcode
                }
            },
            refreshDelete(val) {
                this.getStrategy()
            },
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
            //记录状态-设为已办，
            setHstatus(item, index) {
                let hstatus = item.hstatus ? 0 : 1
                item.hstatus = hstatus
                this.$fetch.api_record.save({hstatus: hstatus}, item.rcode).then(({msg}) => {
                    this.$message({
                        message: msg,
                        type: 'success'
                    })
                }).catch(({msg}) => {

                })
            },
            calcTimeOut(time) {
                let newTime = '20' + time
                if (this.$dayjs(newTime).valueOf() - this.$dayjs().valueOf() < 0) {
                    return true
                } else {
                    return false
                }
            }
        }

    }
</script>
