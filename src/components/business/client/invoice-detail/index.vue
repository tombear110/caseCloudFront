<template>
    <el-dialog
        :title="baseData.title"
        :visible.sync="visible"
        v-loading="loading"
        width="800px">
        <ul class="step-group">
            <li class="item">
                <div class="title">
                    <h4>发票详情</h4>
                </div>
                <ul class="list-group">
                    <li class="item-text">
                        <span class="it-label">发票类型：</span>
                        <span class="it-text">{{baseData.type_text}}</span>
                    </li>
                    <li class="item-text">
                        <span class="it-label">申请人：</span>
                        <span class="it-text">{{baseData.apply_uid_text}}</span>
                    </li>
                    <li class="item-text">
                        <span class="it-label">发票日期：</span>
                        <span class="it-text">{{baseData.date_text}}</span>
                    </li>
                    <li class="item-text">
                        <span class="it-label">发票金额：</span>
                        <span class="it-text">{{baseData.money}}</span>
                    </li>
                    <li class="item-text" style="width: 66%">
                        <span class="it-label">所属项目：</span>
                        <span class="it-text" v-if="baseData.pr_data">{{baseData.pr_data.pr_name}}</span>
                    </li>
                </ul>
            </li>
            <li class="item">
                <div class="title">
                    <h4>发票备注</h4>
                </div>
                <p class="text" v-if="baseData.mark">{{baseData.mark}}</p>
                <p class="text" v-else>暂无详情</p>
            </li>
            <li class="item">
                <div class="title">
                    <h4>发票附件</h4>
                </div>
                <div class="file" v-if="baseData.file_arr.length">
                    <a class="sm-file" v-for="(item,index) in baseData.file_arr" :key="index"
                       v-if="baseData.file_arr.length" :href="url+'cfile/'+item.id+'/download?token='+mytoken" target="_blank">
                        <i class="iconfont  icon-fileempty co-666 pd-right-5"></i>
                        <span class="nowrap co-333 pd-right-5">{{item.file_name}}</span>
                        <i class="iconfont  icon-xiazai text-info"></i>
                    </a>
                </div>
                <p class="text" v-if="!baseData.file_arr.length">暂无相关文书</p>
            </li>
        </ul>
        <span slot="footer" class="dialog-footer">
            <el-button  type="primary" @click="onEdit(baseData.code)">编辑</el-button>
            <el-button  @click="onDelete(baseData.id)">删除</el-button>
        </span>
    </el-dialog>
</template>
<script>

    import store from 'store'
    import { server_base_url } from 'common/config'

    export default {
        props: [  'invoiceDetail'],
        data () {
            return {
                title: '',
                baseData: {
                    file_arr: []
                },
                loading:false,
                visible: false,
                url: server_base_url,
                mytoken: store.state.user_info.token,
            }
        },
        //
        watch: {
            invoiceDetail (val) {
                this.visible = val.visible
                this.getBaseData(val.code)
            }
        },
        methods: {

            handleClose (done) {
//
            },
            //获取详情
            getBaseData(code) {
//                console.log(' this.fdata', this.fdata)
                this.$fetch.api_invoice.invoiceLook(code)
                    .then(({
                               data
                           }) => {
                        this.baseData = data
                    })
                    .catch(() => {

                    })
            },

            //删除
            onDelete(id) {
                this.$confirm('此操作将删除该发票, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass:'is-plain',
                }).then(() => {
                    this.handleDelete(id)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            onEdit(code){
                this.$emit('onInvoiceEdit',code)
                this.visible= false
            },
            //删除文件
            handleDelete(id) {
                this.$fetch.api_invoice.invoiceDel(
                    id
                )
                    .then(({
                               msg
                           }) => {
                            this.$message.success(msg)
                            this.visible = false
                            this.$emit('refreshInvoiceDelete',{code:this.baseData.code})
                        }
                    )
            },
        }
    }
</script>


