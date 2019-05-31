<template>
    <div class="info-box">
        <div class="tab-component tab-component__mini">
            <ul class="tab-list">
                <li class="tab-item  tab-active">委托方</li>
            </ul>
            <div class="co-9FA5B9 mg-right-15 cursor" @click="addPrivycDialog(1)">
                <i class="iconfont  icon-add1 ft-14 mg-right-5"></i>
                <span>添加</span>
            </div>
        </div>
        <div v-for="(item,index) in privycData1" :key="item.id">
            <div class="list-group" v-if="item.dsr_type===2">
                <div class="item__panel">
                    <span class="item__panel-title">{{item.name}}（企业）</span>
                    <div class="item__panel-control">
                        <div class="co-9FA5B9 mg-right-30 cursor"  @click="editPrivycDialog(item)">
                            <i class="iconfont  icon-bianji5 ft-14 mg-right-5"></i>
                            <span>编辑</span>
                        </div>
                        <div class="text-danger cursor" @click="deletePrivycDialog(item,index,2)">
                            <i class="iconfont  icon-shanchu2 ft-14 mg-right-5"></i>
                            <span>删除</span>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <span class="item-label">属性：</span>
                    <span class="item-text">{{item.c_type_text}}</span>
                </div>
                <div class="item">
                    <span class="item-label">法人代表：</span>
                    <span class="item-text">{{item.legal_man}}</span>
                </div>
                <div class="item">
                    <span class="item-label" style="width: 130px">社会统一信用代码：</span>
                    <span class="item-text">{{item.card_num}}</span>
                </div>
                <div class="item">
                    <span class="item-label">联系电话：</span>
                    <span class="item-text">{{item.phone}}</span>
                </div>
                <div class="item" style="width: 66%">
                    <span class="item-label">单位地址：</span>
                    <span class="item-text">{{item.address}}</span>
                </div>
                <div class="item" style="width: 100%">
                    <span class="item-label">备注：</span>
                    <span class="item-text">{{item.mark}}</span>
                </div>
            </div>
            <div class="list-group"  v-else>
                <div class="item__panel">
                    <span class="item__panel-title">{{item.name}}（个人）</span>
                    <div class="item__panel-control">
                        <div class="co-9FA5B9 mg-right-30 cursor" @click="editPrivycDialog(item)">
                            <i class="iconfont  icon-bianji5 ft-14 mg-right-5 " ></i>
                            <span>编辑</span>
                        </div>
                        <div class="text-danger cursor"  @click="deletePrivycDialog(item,index,1)">
                            <i class="iconfont  icon-shanchu2 ft-14 mg-right-5 "></i>
                            <span>删除</span>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <span class="item-label">属性：</span>
                    <span class="item-text">{{item.c_type_text}}</span>
                </div>
                <div class="item">
                    <span class="item-label">民族：</span>
                    <span class="item-text">{{item.nation}}</span>
                </div>
                <div class="item">
                    <span class="item-label">身份证号码：</span>
                    <span class="item-text">{{item.card_num}}</span>
                </div>
                <div class="item">
                    <span class="item-label">性别：</span>
                    <span class="item-text" v-if="item.sex===0">男</span>
                    <span class="item-text" v-if="item.sex===1">女</span>
                </div>
                <div class="item">
                    <span class="item-label">住所地：</span>
                    <span class="item-text">{{item.address}}</span>
                </div>
                <div class="item">
                    <span class="item-label">联系电话：</span>
                    <span class="item-text">{{item.phone}}</span>
                </div>
                <div class="item" style="width: 100%">
                    <span class="item-label">备注：</span>
                    <span class="item-text">{{item.mark}}</span>
                </div>
            </div>
        </div>
        <div v-if="privycData1.length===0" class="text-center co-999" style="padding: 100px 0">
            暂无信息，请点击<em class="co-9FA5B9"> "添加" </em>委托方
        </div>
        <div class="tab-component tab-component__mini">
            <ul class="tab-list">
                <li class="tab-item  tab-active">对方当事人</li>
            </ul>
            <div class="co-9FA5B9 mg-right-15 cursor" @click="addPrivycDialog(2)">
                <i class="iconfont  icon-add1 ft-14 mg-right-5"></i>
                <span>添加</span>
            </div>
        </div>
        <div  v-for="(item,index) in privycData2" :key="item.id">
            <div class="list-group" v-if="item.dsr_type===2">
                <div class="item__panel">
                    <span class="item__panel-title">{{item.name}}（企业）</span>
                    <div class="item__panel-control">
                        <div class="co-9FA5B9 mg-right-30 cursor"  @click="editPrivycDialog(item)">
                            <i class="iconfont  icon-bianji5 ft-14 mg-right-5 "></i>
                            <span>编辑</span>
                        </div>
                        <div class="text-danger cursor"  @click="deletePrivycDialog(item,index,2)">
                            <i class="iconfont  icon-shanchu2 ft-14 mg-right-5 "></i>
                            <span>删除</span>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <span class="item-label">属性：</span>
                    <span class="item-text">{{item.c_type_text}}</span>
                </div>
                <div class="item">
                    <span class="item-label">法人代表：</span>
                    <span class="item-text">{{item.legal_man}}</span>
                </div>
                <div class="item">
                    <span class="item-label" style="width: 130px">社会统一信用代码：</span>
                    <span class="item-text">{{item.card_num}}</span>
                </div>
                <div class="item">
                    <span class="item-label">联系电话：</span>
                    <span class="item-text">{{item.phone}}</span>
                </div>
                <div class="item" style="width: 66%">
                    <span class="item-label">单位地址：</span>
                    <span class="item-text">{{item.address}}</span>
                </div>
                <div class="item" style="width: 100%">
                    <span class="item-label">备注：</span>
                    <span class="item-text">{{item.mark}}</span>
                </div>
            </div>
            <div class="list-group"  v-else>
                <div class="item__panel">
                    <span class="item__panel-title">{{item.name}}（个人）</span>
                    <div class="item__panel-control">
                        <div class="co-9FA5B9 mg-right-30 cursor" @click="editPrivycDialog(item)">
                            <i class="iconfont  icon-bianji5 ft-14 mg-right-5 " ></i>
                            <span>编辑</span>
                        </div>
                        <div class="text-danger cursor"  @click="deletePrivycDialog(item,index,2)">
                            <i class="iconfont  icon-shanchu2 ft-14 mg-right-5"></i>
                            <span>删除</span>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <span class="item-label">属性：</span>
                    <span class="item-text">{{item.c_type_text}}</span>
                </div>
                <div class="item">
                    <span class="item-label">民族：</span>
                    <span class="item-text">{{item.nation}}</span>
                </div>
                <div class="item">
                    <span class="item-label">身份证号码：</span>
                    <span class="item-text">{{item.card_num}}</span>
                </div>
                <div class="item">
                    <span class="item-label">性别：</span>
                    <span class="item-text" v-if="item.sex===0">男</span>
                    <span class="item-text" v-if="item.sex===1">女</span>
                </div>
                <div class="item">
                    <span class="item-label">住所地：</span>
                    <span class="item-text">{{item.address}}</span>
                </div>
                <div class="item">
                    <span class="item-label">联系电话：</span>
                    <span class="item-text">{{item.phone}}</span>
                </div>
                <div class="item" style="width: 100%">
                    <span class="item-label">备注：</span>
                    <span class="item-text">{{item.mark}}</span>
                </div>
            </div>
        </div>
        <div v-if="privycData2.length===0" class="text-center co-999" style="padding: 100px 0">
            暂无信息，请点击<em class="co-9FA5B9"> "添加" </em>对方当事人
        </div>
        <case-privyc :privycEdit="privycEdit" :privycAdd="privycAdd" @privycRefresh="privycRefresh"></case-privyc>
    </div>
</template>
<script>
    import casePrivyc from '../case/case-privyc/index'
    export default {
        components: {
            casePrivyc
        },
        props: ['stepData'],
        data () {
            return {
                privycData1:[],
                privycData2:[],
                privycAdd:{},
                privycEdit:{},
                judgeAdd:{},
                contractData:[],
                btnActive: 0,
                tabTitle: '案件',
                caseEdit: {},
                tabActive: 0,

                infoTab: [
                    {
                        text: '案件详情'
                    }
                ]
            }
        },
        created () {
//            this.getstepData()
        },
        mounted(){
            this.getPrivycList(this.stepData.id)
        },

        methods: {
            /**
             * 获取table数据
             * @params: mod
             * @return: []
             */
            getPrivycList (cid) {
                this.privycData1 = []
                this.privycData2 = []
                this.$fetch.api_privyc.list({ cid: cid })
                    .then(
                        ({
                             data
                         }) => {
                             data.forEach(item =>{
                                 if (item.type===1){
                                     this.privycData1.push(item)
                                 }else {
                                     this.privycData2.push(item)
                                 }
                             })

                        }
                    )
                    .catch((
                        msg
                    ) => {
                    })
            },
            //打开
            addPrivycDialog(type){
                this.privycAdd = {
                    visible:true,
                    caseId:this.stepData.id,
                    type:type,
                    caseType:this.stepData.c_type_fid,
                }
            },
            //打开编辑执行弹窗
            editPrivycDialog(item){
                console.log('val-item',item)
                this.privycEdit = {
                    visible:true,
                    id:item.id,
                    caseId:this.stepData.id,
                    type:item.type,
                    caseType:this.stepData.c_type_fid,
                }
            },

            privycRefresh(){
                this.getPrivycList(this.stepData.id)
            },



            deletePrivycDialog (row, index,type) {
                this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'is-plain'
                })
                    .then(() => {
                        this.handelJudgeDel(row, index,type)
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
            handelJudgeDel (row, index,type) {
                this.$fetch.api_privyc.deleted(row.id)
                    .then(
                        ({
                             msg
                         }) => {
                            this.$message.success(msg)
                            if (type===1){
                                this.privycData1.splice(index, 1)
                            }else {
                                this.privycData2.splice(index, 1)
                            }

                        }
                    )
                    .catch((
                        msg
                    ) => {})
            },

            jumpProject (row) {
                this.$router.push({
                    name: 'project_code',
                    params: {
                        code: row.pr_code
                    }
                })
            },

            jumpLinkCase (item) {
                this.$router.push({ name: 'case_detail', params: { code: item.code } })
            },


            //编辑案件
            editCase (data) {
                if (data.auth) {
                    this.caseEdit = {
                        visible: true,
                        code: data.case_code,
                        id: data.id
                    }
                } else {
                    this.$message.warning('暂无权限')
                }

            },

            openEditModal (code) {
                console.log('code***', code)
                this.recordEdit = {
                    visible: true,
                    code: code
                }
            },

            //渲染数据
            getBaseData () {
                this.$fetch.api_case.caseShow(this.case_code)
                    .then(
                        ({
                             data
                         }) => {
                            this.baseData = data
                            console.log('案件信息', this.baseData)
                        }
                    )
                    .catch((
                        msg
                    ) => {
                        this.$message.error(msg)
                    })
            }

        }

    }
</script>
