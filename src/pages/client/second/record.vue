<template>
    <div class="section section--table" :style="sectionStyle">
        <div class="tab-component__mini">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===index}" v-for="(item,index) in tabData"
                    :key="item.text">
                    <span> {{item.text}}</span>
                </li>
            </ul>
            <div class="co-9FA5B9 cursor" v-if="isLinkProject === 0" @click="addRecord">
                <i class="iconfont  icon-add1 "></i>
                <span>添加</span>
            </div>
<!--            <div class="co-9FA5B9 mg-right-30 cursor" v-if="isLinkProject === 0">-->
<!--                <i class="iconfont  icon-daochu "></i>-->
<!--                <a :href="`${baseUrl}record/export?token=${mytoken}&type=${params.type}&code=${clientCode}`"-->
<!--                   target="_blank" class="co-9FA5B9">-->
<!--                    导出-->
<!--                </a>-->
<!--            </div>-->
            <div style="width: 120px;height: 28px;margin-bottom: 8px;" v-if="isLinkProject === 1">
                <el-select v-model="projectType" size="mini" placeholder="请选择" class="client-select--round"
                           @change="projectChange">
                    <el-option v-for="item in projectOptions" :key="item.id" :label="item.pr_name" :value="item.id"></el-option>
                </el-select>
            </div>
        </div>
        <!--无数据-->
        <p class="nodata" v-if="recordData.length===0" key="no-data">暂无数据</p>
        <ul class="record-table" v-else key="no-data">
            <li class="item" v-for="(item,index) in recordData" :key="index"
                @click="openDetailModal(item.rcode)">
                <div class="item-box">
                    <div class="item-heading">
                        <ul class="ih-title">
                            <li class=" mg-right-10 cursor">
                                <i class="iconfont mg-right-10"
                                   :class="(item.hstatus)?'icon-tucenggouxuan co-999':'icon-weigouxuan1 text-danger'"
                                   @click.stop="setHstatus(item)"></i>
                                <span class="co-999" :class="{'text-danger':item.hstatus===0}">{{item.rtype_text}}</span>
                                <el-tooltip v-if="item.linkid_text" effect="dark" :content="item.linkid_text" placement="top-start">
                                    <span class="ih-title__suffix" >{{item.linkid_text.substr(0,1)}}</span>
                                </el-tooltip>
                            </li>
                            <!--<li class="text-info cursor" @click.stop="openEditModal(item)">-->
                            <!--<i class="iconfont icon-xiugai"></i>-->
                            <!--</li>-->
                            <li v-if="item.c_file.length">
                                <i class="iconfont icon-biezhen1"></i>
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
                    <p>{{item.content}}</p>
                </div>
            </li>
        </ul>
        <!--分页-->
        <!--        <page :page-data="pageData" v-on:pageEvent="pageChange"></page>-->
        <record-detail :recordDetail="recordDetail" @refreshDelete="refreshDelete"
                       @onEdit="onDetailEdit"></record-detail>
        <record-edit :recordEdit="recordEdit" :recordAdd="recordAdd" @refreshSave="refreshSave"></record-edit>
    </div>
</template>

<script>
    import {
        page,
        recordDetail,
        recordEdit
    } from 'components'

    import store from 'store'
    import {
        server_base_url
    } from 'common/config'

    export default {
        props: ['detailData'],
        components: {
            page,
            recordDetail,
            recordEdit
        },
        data() {
            return {
                projectType: 0,
                projectOptions: [{
                    id: 0,
                    pr_name: '全部项目'
                }],
                recordEdit: {},
                recordAdd: {},
                recordDetail: {},
                recordData: [],
                mytoken: store.state.user_info.token,
                baseUrl: server_base_url,
                type: parseInt(this.$route.query.type),
                tabActive: 0,
                addData: {},
                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                params: {
                    type: 4,
                    link_client: '',
                    page: 1,
                    pageSize: 20
                },
                clientId: '',
                clientCode: '',
                clientRecordDataStatic: [],
                isLinkProject: -1,
                project: [],
            }
        },
        created() {

        },
        computed: {
            tabData() {
                return this.isLinkProject === 1 ? [{text: '项目动态'}] : [{text: '联系记录'}]
            },
            sectionStyle(){
                return this.isLinkProject === 1 ? {marginBottom:'0px', flex:4,} :{marginBottom:'20px', flex:6,}
            },
        },
        watch: {
            detailData(val) {
                this.isLinkProject = val.isLinkProject
                this.clientId = val.id
                this.clientCode = val.code
                this.params.link_client = val.id
                //联系记录和项目动态分开获取
                if (val.isLinkProject === 1) {
                    //详情中project包含cl_id=0和cl_id=当前客户id的
                    //此处要去掉cl_id=0的项目
                    val.project.forEach(item => {
                        if (item.cl_id) {
                            this.projectOptions.push(item)
                        }
                    })
                    this.getProjectRecordList(val.id)
                } else {
                    this.getLinkRecordList(this.params)
                }
            }
        },
        methods: {
            //切换项目id，过滤对应记录
            projectChange(val) {
                this.recordData = this.clientRecordDataStatic.filter(item => val === 0 ? true : item.linkid === val)
            },

            //获取记录列表
            getLinkRecordList() {
                //监听
                this.$fetch.api_record.list(this.params)
                    .then(({
                               data
                           }) => {
                        this.recordData = data.data
                        // this.pageData.pageSize = parseInt(data.per_page)
                        // this.pageData.total = data.total
                    })
            },

            //获取记录列表
            getProjectRecordList(id) {
                this.$fetch.api_client.clientRecord(id)
                    .then(({
                               data
                           }) => {
                        this.recordData = data.data
                        this.clientRecordDataStatic = data.data
                    })

            },

            addRecord() {
                this.recordAdd = {
                    visible: true,
                    type: 4,
                    link_client: this.clientId
                }
            },
            //接受从详情传过来的code，打开编辑dialog
            onDetailEdit(data) {
                this.recordEdit = {
                    visible: true,
                    code: data.rcode,
                    type: data.type
                }
            },

            //编辑记录
            openEditModal(data) {
                this.recordEdit = {
                    visible: true,
                    type: 4,
                    code: data.rcode
                }
            },
            //查看记录
            openDetailModal(code) {
                this.recordDetail = {
                    visible: true,
                    code: code
                }
            },

            setHstatus(item) {
                let hstatus = item.hstatus ? 0 : 1
                this.changeHstatus(hstatus, item.rcode)
            },
            //修改状态
            changeHstatus(hstatus, rcode) {
                this.$fetch.api_record.save({hstatus: hstatus}, rcode)
                    .then(({
                               msg
                           }) => {

                        for (let value of this.recordData) {
                            if (rcode === value.rcode) {
                                value.hstatus = hstatus
                            }
                        }
                    })
            },


            refreshDelete(val) {
                if (val && this.isLinkProject === 1) {
                    this.getProjectRecordList(this.clientId)
                } else {
                    this.getLinkRecordList()
                }
            },
            //子页面新增数据完毕，刷新列表页数据
            refreshSave(val) {
                if (val && this.isLinkProject === 1) {
                    this.getProjectRecordList(this.clientId)
                } else {
                    this.getLinkRecordList()
                }
            },

            //分页操作
            pageChange(data) {
                this.paramas.page = data.page
                this.paramas.pageSize = data.pageSize
                this.getLinkRecordList()
            }

        }

    }
</script>
