<template>
    <div class="section section--table" style="margin-bottom: 0">
        <div class="tab-component__mini">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===index}" v-for="(item,index) in tabData"
                    :key="item.text">
                    <span> {{item.text}}</span>
                </li>
            </ul>
            <div class="co-9FA5B9 mg-right-30 cursor" @click="addRecord">
                <i class="iconfont  icon-add1 "></i>
                <span>添加</span>
            </div>
            <div class="co-9FA5B9  cursor">
                <i class="iconfont  icon-daochu "></i>
                <a :href="`${url}record/export?token=${mytoken}&type=${params.type}&code=${code}`" target="_blank"
                   class="co-9FA5B9">
                    导出
                </a>
            </div>
        </div>
        <div class="record-header--project">
            <div class="panel-title">
                <ul class="self-radio--round" style="width: 210px">
                    <li class="item" :class="{'item--active':hostActive===item.value}" v-for="item in hostList"
                        @click="changeHost(item)" :key="item.value">{{item.label}}
                    </li>
                </ul>
            </div>
            <div class="panel-text mg-right-30">总时间：<span class="text-info">{{timeCost}}</span>分钟</div>
            <div class="panel-text">总金额：<span class="text-info">{{feeCost}}</span>元</div>
        </div>
        <!--无数据-->
        <p class="nodata" v-if="tableData.length===0" key="no-data">暂无数据</p>
        <ul class="record-table" v-else key="no-data">
            <li class="item" v-for="(item,index) in tableData" :key="index" @click="openDetailModal(item.rcode)">
                <div class="item-box">
                    <div class="item-heading">
                        <ul class="ih-title">
                            <li class=" mg-right-10 cursor">
                                <i class="iconfont mg-right-10"
                                   :class="(item.hstatus)?'icon-tucenggouxuan co-999':'icon-weigouxuan1 text-danger'"
                                   @click.stop="setHstatus(item)"></i>
                                <span :class="{'text-danger':item.hstatus===0,}"
                                >{{item.rtype_text}}</span>
                            </li>
                            <!--<li class="text-info cursor" @click.stop="openEditModal(item)">-->
                            <!--<i class="iconfont icon-xiugai ft-14"></i>-->
                            <!--</li>-->
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
                    <p>{{item.content}}</p>
                </div>
            </li>
        </ul>


        <!--分页-->
        <record-detail :recordDetail="recordDetail" @refreshDelete="refreshDelete" @onEdit="onEdit"></record-detail>
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
        props: ['recordData'],
        components: {
            page,
            recordDetail,
            recordEdit
        },
        data() {
            return {
                tableData: [],
                recordEdit: {},
                recordAdd: {},
                recordDetail: {},
                code: this.$route.params.code,
                mytoken: store.state.user_info.token,
                url: server_base_url,
                tabActive: 0,
                params: {},
                timeCost: '',
                feeCost: '',
                staticTableData: [],
                hostActive: 0,
                hostList: [
                    {value: 0, label: '全部'},
                    {value: 1, label: '主办'},
                    {value: 2, label: '协办'},
                ],
                tabData:[{
                    text: '项目记录'
                }]
            }
        },
        created() {

        },
        watch: {
            recordData(val) {
                this.params.linkid = val.id
                this.params.type = 2
                this.getList()

            }
        },
        methods: {
            changeHost(item) {
                this.hostActive = item.value
                const huser = store.state.user_info.user.id
                switch (item.value) {
                    case 1:
                        this.tableData = this.staticTableData.filter(item => item.huser === huser);
                        break
                    case 2:
                        this.tableData = this.staticTableData.filter(item => item.assit ? item.assit.indexOf(huser) !== -1 : false);
                        break
                    default:
                        this.tableData = this.staticTableData;
                        break
                }
            },
            //接受从详情传过来的code，打开编辑dialog
            onEdit(data) {
                this.recordEdit = {
                    visible: true,
                    code: data.rcode,
                    type: data.type
                }
            },
            //新增记录
            addRecord() {
                this.recordAdd = {
                    visible: true,
                    type: this.params.type,
                    linkid: this.params.linkid
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
                this.put_table(hstatus, item.rcode)
            },

            //修改状态
            put_table(hstatus, rcode) {
                this.$fetch.api_record.save({
                    hstatus: hstatus
                }, rcode)
                    .then(({
                               msg
                           }) => {
                        for (let i = 0; i < this.tableData.length; i++) {
                            if (rcode === this.tableData[i].rcode) {
                                this.tableData[i].hstatus = hstatus
                            }
                        }
                    })
            },

            refreshDelete(val) {
                if (val) {
                    this.getList()
                }
            },
            //子页面新增数据完毕，刷新列表页数据
            refreshSave(val) {
                if (val) {
                    this.getList()
                }
            },

            //子组件删除的记录
            showDelRecord(data) {
                for (let i in this.tableData) {
                    if (data.rcode === this.tableData[i]['rcode']) {
                        this.tableData.splice(i, 1)
                    }
                }
            },

            //待办已办切换
            changeHstatus(hstatus) {
                let tableData = this.staticTableData
                this.tableData = []
                for (let i = 0; i < tableData.length; i++) {
                    if (hstatus === tableData[i].hstatus) {
                        this.tableData.push(tableData[i])
                    }
                }
            },

            //获取案件案件记录
            getList() {
                //监听
                this.$fetch.api_record.list(this.params)
                    .then(({
                               data
                           }) => {
                        this.timeCost = data.time_cost ? data.time_cost : 0
                        this.feeCost = data.fee_cost ? data.fee_cost : 0
                        this.staticTableData = data.data
                        this.tableData = data.data
                    })

            }
        }

    }
</script>
