<template>
    <el-dialog title="案件详情" :visible.sync="visible" top="15vh" @close="closeDialog">
        <ul class="step-group" v-loading="loading">
            <li class="item">
                <span class="step-circle"></span>
                <span class="step-line"></span>
                <div class="step-main">
                    <span class="sm-label">案件信息：</span>
                    <ul class="sm-group">
                        <li class="item-text">
                            <span class="it-label">案件名称</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{tableData.case_name}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">案件类别</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{tableData.type_text}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">案由</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{tableData.anyou}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">主办律师</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{tableData.host}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">委案日期</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{tableData.wa_time}}分钟</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">结案日期</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{tableData.ja_time}}元</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">协办律师</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{tableData.assit}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">收费方式</span>
                            <span class="it-line">— —</span>
                            <span class="it-text" v-if="tableData.charge_type === 1" >正常收费</span>
                            <span class="it-text" v-else-if="tableData.charge_type === 2" >风险收费</span>
                            <span class="it-text" v-else >计时收费</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">固定金额</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{tableData.fixed_amount}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">聘用合同</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{tableData.contract}}</span>
                        </li>
                    </ul>
                </div>
            </li>
            <li class="item">
                <span class="step-circle"></span>
                <span class="step-line"></span>
                <div class="step-main">
                    <span class="sm-label">案情简介：</span>
                    <p>{{tableData.case_summary}}</p>
                </div>
            </li>
            <li class="item">
                <span class="step-circle"></span>
                <span class="step-line"></span>
                <div class="step-main">
                    <span class="sm-label">当事人信息：</span>
                    <el-table
                        :data="tableData.firmprivyc_list"
                        
                        style="width: 100%">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-row v-if="props.row.dsr_type === 1" class="mg-bottom-15">
                                    <el-col :span="6">
                                        <div>
                                            <span>民族：</span>
                                            <span>{{ props.row.nation }}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="6">
                                        <div>
                                            <span>性别：</span>
                                            <span v-if=" props.row.sex ===0 ">男</span>
                                            <span v-else>女</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="6">
                                        <div>
                                            <span>证件号：</span>
                                            <span>{{ props.row.card_num }}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="6">
                                        <div>
                                            <span>地址：</span>
                                            <span>{{ props.row.address }}</span>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row v-if="props.row.dsr_type === 1" class="mg-bottom-15">
                                    <el-col :span="24">
                                        <div style="display: flex">
                                            <span>备注：</span>
                                            <span style="flex: 1">{{ props.row.mark }}</span>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row v-if="props.row.dsr_type === 2" class="mg-bottom-15">
                                    <el-col :span="6">
                                        <div>
                                            <span class="expand-label">法定代表人：</span>
                                            <span>{{ props.row.address }}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="6">
                                        <div>
                                            <span class="expand-label">统一社会信用代码：</span>
                                            <span>{{ props.row.card_num }}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div>
                                            <span class="expand-label">地址：</span>
                                            <span>{{ props.row.address }}</span>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row v-if="props.row.dsr_type === 2">
                                    <el-col :span="24">
                                        <div style="display: flex">
                                            <span class="expand-label">备注：</span>
                                            <span style="flex: 1">{{ props.row.mark }}</span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="名称"
                            prop="name">
                        </el-table-column>
                        <el-table-column
                            label="类别">
                            <template slot-scope="scope">
                                <span v-if=" scope.row.dsr_type === 1">个人</span>
                                <span v-else>企业</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="委托人">
                            <template slot-scope="scope">
                                <span v-if=" scope.row.type === 1">是</span>
                                <span v-else>否</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="联系方式"
                            prop="phone">
                        </el-table-column>
                        <el-table-column
                            label="属性">
                            <template slot-scope="scope">
                                <span v-if=" scope.row.c_type === 1">原告</span>
                                <span v-else-if=" scope.row.c_type === 2">被告</span>
                                <span v-else-if=" scope.row.c_type === 3">第三人</span>
                                <span v-else>案件对接人</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </li>
            <li class="item">
                <span class="step-circle"></span>
                <span class="step-line"></span>
                <div class="step-main">
                    <span class="sm-label">审批结果：</span>
                    <p>{{tableData.res_status}}</p>
                </div>
            </li>
            <li class="item">
                <span class="step-circle"></span>
                <div class="step-main">
                    <span class="sm-label">审批意见：</span>
                    <p>{{tableData.comments}}</p>
                </div>
            </li>

            <!--<li class="item">-->
                <!--<span class="step-circle"></span>-->
                <!--<div class="step-main">-->
                    <!--<span class="sm-label">案件文书：</span>-->
                    <!--<div class="sm-content" v-if="tableData.case_file.length">-->
                        <!--<a class="sm-file" v-for="(item,index) in tableData.case_file" :key="index"-->
                           <!--v-if="tableData.case_file.length" :href="url+'cfile/'+item.id+'/download?token='+mytoken"-->
                           <!--target="_blank">-->
                            <!--<i class="iconfont  icon-fileempty co-666 pd-right-5"></i>-->
                            <!--<span class="nowrap co-333 pd-right-5">{{item.file_name}}</span>-->
                            <!--<i class="iconfont  icon-xiazai co-409EFF"></i>-->
                        <!--</a>-->
                    <!--</div>-->
                    <!--<p v-if="!tableData.case_file.length">暂无相关文书</p>-->
                <!--</div>-->
            <!--</li>-->
        </ul>
        <span slot="footer" class="dialog-footer" >
            <el-button type="primary"  @click="openEditDialog">编辑</el-button>
            <el-button type=""  plain @click="visible = false">取消</el-button>
        </span>
    </el-dialog>
</template>
<script>


    export default {
        props: ['rowData'],
        data () {
            return {
                visible: false,

                sideout: 0,
                tableData: {},
                loading: false,
                rowId: ''
            }
        },

        watch: {
            rowData (val) {
                console.log('val---', val)
                this.visible = true
                this.rowId = val.id
                this.getTableData(val.id)
            }

        },
        methods: {

            //获取详情
            getTableData (id) {
                this.loading = true
                this.$fetch.api_lawcase.look(id)
                    .then(({
                               data
                           }) => {
                        this.loading = false
//                    console.log('data',data)
                        this.tableData = data

                    })
                    .catch(() => {
                        this.loading = false
                    })
            },
            closeDialog () {

            },

            //去编辑页-dialog
            openEditDialog () {
                //点击编辑按钮，关闭当前页，打开编辑的dialog，
                this.visible = false
                this.$emit('onEdit', this.rowId)
            },
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
    .table-expand {
        .expand-label {
            display: inline-block;
            width: 110px;
            text-align: right;
        }
    }

</style>


