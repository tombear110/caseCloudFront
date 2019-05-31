<template>
    <div class="info-box">
        <div class="tab-component tab-component__mini">
            <ul class="tab-list">
                <li class="tab-item  tab-active">收费信息</li>
            </ul>
            <div class="co-9FA5B9 mg-right-15 cursor" @click="openFeeDialog(stepData)">
                <i class="iconfont  icon-bianji5 ft-14 mg-right-5"></i>
                <span>编辑</span>
            </div>
        </div>
        <ul class="list-group">
            <li class="item">
                <span class="item-label">收费方式：</span>
                <span class="item-text">{{stepData.fee_type_text}}</span>
            </li>
            <li class="item">
                <span class="item-label">合同金额：</span>
                <span class="item-text">{{stepData.w_fee}}</span>
            </li>
            <li class="item" style="width: 100%">
                <span class="item-label">收费简介：</span>
                <span class="item-text">{{stepData.fee_mark}}</span>
            </li>
        </ul>
        <div class="tab-component tab-component__mini">
            <ul class="tab-list">
                <li class="tab-item  tab-active">应收款记录</li>
            </ul>
            <div class="co-9FA5B9  mg-right-15 cursor" @click="openReceivableAdd(stepData)">
                <i class="iconfont icon-add1 ft-14 mg-right-5"></i>
                <span>添加</span>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%;padding: 10px 0" @row-click="clickRow"
                  cell-class-name="border-dashed" element-loading-text="正在加载中...">
            <el-table-column prop="type_text" label="款项类别" width="90"></el-table-column>
            <el-table-column prop="r_amount" label="应收金额" width="80"></el-table-column>
            <el-table-column prop="amount_r" label="已收金额" width="80"></el-table-column>
            <el-table-column prop="r_date" label="约定收款日期" width="110"></el-table-column>
            <el-table-column prop="date_r" label="实际收款日期" width="110"></el-table-column>
            <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button class="co-9FA5B9" type="text"  @click.stop="openReceivableEdit(scope.row)">
                        编辑
                    </el-button>
                    <span class="bar"></span>
                    <el-button class="text-danger"  @click.stop="deleteRowData(scope.row,scope.$index)"
                               type="text">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <receivable-new :receivableEdit="receivableEdit" :receivableAdd="receivableAdd"
                        @receivableRefresh="receivableRefresh"></receivable-new>
        <fee-info :feeInfo="feeInfo"></fee-info>
    </div>
</template>
<script>
    import receivableNew from '../case/receivable-new'
    import feeInfo from '../case-simple/fee-info'

    export default {
        components: {
            receivableNew,
            feeInfo
        },
        props: ['stepData'],
        data() {
            return {
                feeInfo: {},
                receivableEdit: {},
                receivableAdd: {},
                detailVisible: false,
                detailData: {},
                tableData: [],
            }
        },
        mounted() {
            console.log(this.stepData.id)
            this.getTableList(this.stepData.id)
        },
        methods: {

            openFeeDialog(stepData) {
                this.feeInfo = {
                    visible: true,
                    code: stepData.case_code
                }
            },

            receivableRefresh(val) {
                this.getTableList(this.stepData.id)
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
            },

            /**
             * 获取table数据
             * @params: mod
             * @return: []
             */
            getTableList(linkid) {
                this.$fetch.api_receivables.list({linkid: linkid,linktype:1})
                    .then(
                        ({
                             data
                         }) => {
                            this.tableData = data.data
                        }
                    )
            },
            openReceivableAdd(stepData) {
                this.receivableAdd = {
                    visible: true,
                    linkid: stepData.id,
                    linktype:1,
                }
            },

            openReceivableEdit(row) {
                this.receivableEdit = {
                    visible: true,
                    id: row.id,
                }
            },

            /**
             * 删除前二次确认
             * @params: mod
             * @return: 返回值/返回值说明
             */
            deleteRowData(row, index) {
                this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'is-plain'
                })
                    .then(() => {
                        this.handelDel(row, index)
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
                this.$fetch.api_receivables.deleted(row.id)
                    .then(
                        ({
                             msg
                         }) => {
                            this.tableData.splice(index, 1)
                        }
                    )

            }
        }

    }
</script>
