<template>
    <div class="info-box">
        <div class="tab-component tab-component__mini">
            <ul class="tab-list">
                <li class="tab-item  tab-active">立案</li>
            </ul>
        </div>
        <ul class="list-group">
            <li class="item">
                <span class="item-label">立案进度：</span>
                <span class="item-text">{{stepData.pr_time}}</span>
            </li>
            <li class="item">
                <span class="item-label">立案时间：</span>
                <span class="item-text">{{stepData.la_time}}</span>
            </li>
            <li class="item">
                <span class="item-label">律所案号：</span>
                <span class="item-text">{{stepData.anhao}}</span>
            </li>
            <li class="item" style="width: 100%;justify-content: flex-end">
                <el-button type="primary" size="micro" plain>查看进度</el-button>
                <el-button type="danger" size="micro" plain>撤回申请</el-button>
            </li>
        </ul>
        <div class="tab-component tab-component__mini">
            <ul class="tab-list">
                <li class="tab-item  tab-active">用印</li>
            </ul>
        </div>
        <div class="table-group">
            <el-table :data="contractData" style="width: 100%;min-width:100%;padding: 10px 0" size="mini"
                      cell-class-name="border-dashed"
                      element-loading-text="正在加载中...">
                <el-table-column prop="title" label="文件名称" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="sign_at" label="盖章类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.sign_at_text}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="end_time" label="盖章份数">
                    <template slot-scope="scope">
                        <span>{{scope.row.end_time_text}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="审批状态" width="170">
                    <template slot-scope="scope">
                        <span class="co-9FA5B9" v-if="scope.row.period">{{scope.row.period}}年</span>
                        <span class="co-9FA5B9" v-else>0年</span>
                        <span class="bar"></span>
                        <span class="text-danger">{{scope.row.status_text}}</span>
                        <span class="bar"></span>
                        <span class="co-9FA5B9" v-if="scope.row.is_extend">自动延长</span>
                        <span class="co-9FA5B9" v-else>不延长</span>
                    </template>
                </el-table-column>
                <el-table-column prop="end_time" label="审批时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.end_time_text}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="end_time" label="备注">
                    <template slot-scope="scope">
                        <span>{{scope.row.end_time_text}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div style="text-align: right;width:100%;padding: 10px 0">
                <el-button type="primary" size="micro" plain>发起申请</el-button>
            </div>
        </div>
    </div>
</template>
<script>

    export default {
        components: {},
        props: ['stepData'],
        data () {
            return {
                contractData: [],
                btnActive: 0,
                tabTitle: '案件',
                caseEdit: {},
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
                ]
            }
        },
        created () {
//            this.getstepData()
        },

        methods: {
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
            //详情切换
            onTabChange (index) {
                this.btnActive = index
                this.tabTitle = this.btnList[index].text
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
            getstepData () {
                this.$fetch.api_case.caseShow(this.case_code)
                    .then(
                        ({
                             data
                         }) => {
                            this.stepData = data
                            console.log('案件信息', this.stepData)
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
