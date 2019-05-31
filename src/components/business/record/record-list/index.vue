<template>
<div class="">
    <div class="detail-record">
        <div class="tab-component">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===index}" v-for="(item,index) in tabData" :key="item.text">
                    <span> {{item.text}}</span>
                    （<span class="text-info">已办5项</span> <span class="text-danger">待办6项</span>）
                </li>
            </ul>
            <div class="text-info mg-right-15 cursor " @click="openAddModal">
                <i class="iconfont  icon-tianjia ft-14 mg-right-5"></i>
                <span>新增记录</span>
            </div>
            <div class="text-info">
                <i class="iconfont  icon-daochu1 ft-14 mg-right-5"></i>
                <!--<a :href="url+'record/export?token='+mytoken+'&type=1'+'&code='+code"-->
                <!--class="text-info">导出记录</a>-->
                <a :href="`${url}record/export?token=${mytoken}&type=${type}&code=${code}`"
                       class="text-info">导出记录</a>
            </div>
        </div>

        <ul class="record-table">
            <li class="item" v-for="(item,index) in tableData" :key="index">
                <div class="item-heading">
                    <ul class="ih-title">
                        <li class=" mg-right-10 cursor">
                            <el-popover placement="right" width="100" trigger="hover" popper-class="de-popover">
                                <div v-for="(item1, index1) in degrees" :key="index1" class="degree-box" :class="{'degree-active':clickLi == index}" @click="degree_change(index1,item.id)">
                                    <i class="iconfont icon-hasdone  mg-left-15 mg-right-10 "
                                           :class="{' text-danger':index1===0,}"></i>
                                    {{item1}}
                                </div>
                                <div slot="reference">
                                    <i class="iconfont icon-hasdone mg-right-10"
                                           :class="{' text-danger':!item.hstatus,}"></i>
                                </div>
                            </el-popover>
                            <span :class="{'text-danger':item.hstatus===0,}"
                                      @click="openDetailModal(item.rcode)">{{item.rtype_text}}</span>
                        </li>
                        <li class="mg-right-10">{{item.huser_text}}</li>
                        <li class="text-info cursor" @click="openEditModal(item.rcode)">
                            <i class="iconfont icon-xiugai"></i>
                        </li>
                    </ul>
                    <ul class="ih-control">
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
            </li>
        </ul>
    </div>
    <!--分页-->
    <page :page-data="pageData" v-on:pageEvent="pageChange"></page>
    <record-detail :recordDetail="recordDetail" :refreshDelete="refreshDelete"></record-detail>
    <record-edit :recordEdit="recordEdit" :recordAdd="recordAdd" @refreshSave="refreshSave" ></record-edit>
</div>
</template>

<script>
import page from '../../../pagination'
import recordDetail from '../record-detail'
import recordEdit from '../record-edit'

import store from 'store'
import {
    server_base_url
} from 'common/config'

export default {
    props: ['pdata'],
    components: {
        page,
        recordDetail,
        recordEdit
    },
    data() {
        return {
            recordEdit: {},
            recordAdd: {},
            recordDetail: {},
            recordTableData: [],
            loading: false,
            auth: 1,
            code: this.$route.query.code,
            tableData: [],
            degrees: ['待办', '已办'],
            record_arr: [],
            mytoken: store.state.user_info.token,
            url: server_base_url,
            type: parseInt(this.$route.query.type),
            tabData: [{
                text: '记录列表'
            }],
            tabActive: 0,
            tabList: [{
                    text: '全部事项'
                },
                {
                    text: '待办事项'
                },
                {
                    text: '已办事项'
                }
            ],
            clickLi: 0,
            myCal: '',
            addData: {},
            recordData: '',
            pageData: {
                currentPage: 1,
                total: 0,
                pageSize: 10
            },
            params: {
                linkid: parseInt(this.$route.query.id),
                type: parseInt(this.$route.query.type),
            },
            timeCost: '',
            moneyCost: '',
            cl_id: '',
            cl_code: '',
        }
    },
    created() {
        this.getList()
        this.getProjectInfo()
    },
    methods: {

        //新增记录
        openAddModal() {
            this.recordAdd = {
                visible: true,
                type: this.params.type,
                linkid: this.params.linkid,
                cl_id: this.cl_id,
                cl_code: this.cl_code,
            }
        },

        //编辑记录
        openEditModal(code) {
            this.recordEdit = {
                visible: true,
                code: code,
                cl_id: this.cl_id,
                cl_code: this.cl_code,
            }
        },
        //通过获取项目信息，获取项目所属客户cl_id,cl_code
        getProjectInfo() {
            let code = this.$route.query.code
            this.$fetch.api_project.projectLook(code)
                .then(
                    ({
                        data,
                    }) => {
                        this.cl_id = data.cl_id
                        this.cl_code = data.cl_id_code
                    }
                )
        },
        //查看记录
        openDetailModal(code) {
            this.recordDetail = {
                visible: true,
                code: code
            }
        },
        //表格统计
        getSummaries(param) {
            const {
                columns,
                data
            } = param
            const sums = []
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计'
                    return
                }
                const values = data.map(item => Number(item[column.property]))
                if (index === 5 || index === 6) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            return prev + curr
                        } else {
                            return prev
                        }
                    }, 0)
                    if (index === 5) {
                        sums[index] += ' 分'
                    } else {
                        sums[index] += ' 元'
                    }

                }
            })
            this.timeCost = sums[5]
            this.moneyCost = sums[6]
            return sums
        },
        //修改状态
        put_table(hstatus, id) {
            this.$fetch.api_record.recordThree({
                    hstatus: hstatus
                }, id)
                .then(({
                    msg
                }) => {
                    this.$message({
                        message: msg,
                        type: 'success'
                    })
                    for (let i in this.tableData) {
                        if (id === this.tableData[i].id) {
                            this.tableData[i].hstatus = hstatus
                        }
                    }
                })
                .catch(({
                    msg
                }) => {
                    //                            this.$message.warning(msg)
                })
        },
        //切换状态
        degree_change(index, cid) {
            this.put_table(index, cid)
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
        //            侧边栏展示,传当前点击数据
        showDetail(rcode) {
            let rand = Math.random(188, 299999)
            this.myCal = [rcode, rand, this.auth]
        },
        //子组件删除的记录
        showDelRecord(data) {
            for (let i in this.tableData) {
                if (data.id === this.tableData[i]['id']) {
                    this.tableData.splice(i, 1)
                }
            }
        },

        //分页操作
        pageChange(data) {
            this.params.pageSize = data.pageSize
            this.params.page = data.currentPage
            this.getList()

        },

        //获取案件记录列表
        getList() {
            //监听
            this.loading = true
            this.params.pageSize = 10
            this.params.page = 1
            this.$fetch.api_record.list(this.params)
                .then(({
                    data
                }) => {
                    //权限
                    this.auth = data.auth
                    for (let i in data.data) {
                        if (data.data[i].content === null) {
                            data.data[i].content = ''
                        }
                    }
                    this.tableData = data.data
                    this.pageData.pageSize = parseInt(data.per_page)
                    this.pageData.total = data.total
                    this.loading = false

                })
                .catch(({
                    msg
                }) => {
                    this.$message.error(msg)
                    this.loading = false
                })
        }
    }

}
</script>
