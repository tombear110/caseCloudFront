<template>
    <el-dialog title="文书详情" :visible.sync="visible" top="15vh">
        <ul class="step-group" v-loading="loading">
            <li class="item">
                <span class="step-circle"></span>
                <span class="step-line"></span>
                <div class="step-main">
                    <span class="sm-label">报审信息：</span>
                    <ul class="sm-group">
                        <li class="item-text">
                            <span class="it-label">报审人</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{tableData.applicant}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">文书类型</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{tableData.type_text}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">报审时间</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{tableData.created_at_text}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">盖章份数</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{tableData.stamp_num}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">盖章类型</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{tableData.stamp_type_text}}</span>
                        </li>
                    </ul>
                </div>
            </li>
            <li class="item">
                <span class="step-circle"></span>
                <span class="step-line"></span>
                <div class="step-main">
                    <span class="sm-label">备注：</span>
                    <p>{{tableData.mark}}</p>
                </div>
            </li>
            <li class="item">
                <span class="step-circle"></span>
                <span class="step-line"></span>
                <div class="step-main">
                    <span class="sm-label">待审批的文件：</span>
                    <div class="sm-content">
                        <a class="sm-file" :href="url+'downloadFirmfile/'+id+'?token='+mytoken"
                           target="_blank">
                            <i class="iconfont  icon-fileempty co-666 pd-right-5"></i>
                            <span class="nowrap co-333 pd-right-5">{{tableData.name}}</span>
                            <i class="iconfont  icon-xiazai co-409EFF"></i>
                        </a>
                    </div>
                </div>
            </li>
            <li class="item">
                <span class="step-circle"></span>
                <span class="step-line"></span>
                <div class="step-main">
                    <span class="sm-label">处理结果：</span>
                    <ul class="sm-group">
                        <li class="item-text">
                            <span class="it-label">状态</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{tableData.status_text}}</span>
                        </li>
                        <li class="item-text">
                            <span class="it-label">处理意见</span>
                            <span class="it-line">— —</span>
                            <span class="it-text">{{tableData.comments}}</span>
                        </li>
                    </ul>
                </div>
            </li>
            <li class="item">
                <span class="step-circle"></span>
                <div class="step-main">
                    <span class="sm-label">审批意见：</span>
                    <p>{{tableData.content}}</p>
                </div>
            </li>
        </ul>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary"  @click="goEdit">编辑</el-button>
            <el-button type=""  plain @click="visible = false">取消</el-button>
        </span>
    </el-dialog>
</template>
<script>

    import store from 'store'
    import { server_base_url } from 'common/config'

    export default {
        props: ['fData'],
        data () {
            return {
                title: '',
                info: '',
                auth: 1,
                visible: false,
                loading: false,
                url: server_base_url,
                sideout: '',
                fdata: '',
                tableData: '',
                link_title: '',
                mytoken: store.state.user_info.token,
                id: ''
            }
        },

        watch: {
            fData (val) {
                console.log('fData-val', val)
                this.visible = true
                this.id = val.id
                this.getData(val.id)
            }

        },
        methods: {
            //获取详情
            getData (id) {
                this.$fetch.api_lawdoc.look(id)
                    .then(({
                               data
                           }) => {
                        this.tableData = data
                        console.log(' this.tableData', data)
                    })
                    .catch(() => {
                        this.load_data = false
                    })
            },

            //去编辑页-dialog
            goEdit () {
                //点击编辑按钮，关闭当前页，打开编辑的dialog，
                this.sideout = 0
                this.$emit('onEdit', { isEdit: true, id: this.id })
            },

            //点击左侧栏，关闭
            closeSidebox () {
                this.sideout = 0
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>


