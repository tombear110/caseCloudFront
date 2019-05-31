<template>
    <div class="sidebox" v-bind:class="{'side_off_active':this.sideout != 0}">
        <div class="box-wrap">
            <div class="title-box">
                <span class="title-text">文件审批</span>
                <div class="close-btn" @click="closeSidebox">
                    <i class="iconfont  icon-shouhui"></i>
                    <span>返回</span>
                </div>
            </div>
            <div class="heading-box ">
                <span>报审信息</span>
                <span v-if="records.hstatus === 0 && auth!=0" class="text-link cursor"
                      @click="setHstatus">设为已办</span>
            </div>
            <ul class="info-list">
                <li>
                    <i class="iconfont  icon-banli ft-12 ft-12 co-BFCBD9">&nbsp;</i>
                    <span class="co-1f2f3d">报审人&nbsp;</span>
                    <span class="co-5E6D82">{{records.huser_text}}</span>
                </li>
                <li>
                    <i class="iconfont  icon-xiezhu ft-12 co-BFCBD9">&nbsp;</i>
                    <span class="co-1f2f3d">文书证号&nbsp;</span>
                    <span class="co-5E6D82" v-if="records.assit">{{records.assit_text}}</span>
                    <span class="co-5E6D82" v-if="!records.assit">无</span>
                </li>
                <li>
                    <i class="iconfont  icon-shijian ft-12 co-BFCBD9">&nbsp;</i>
                    <span class="co-1f2f3d">报审时间&nbsp;</span>
                    <span class="co-5E6D82">{{records.htime_text}}</span>
                </li>
                <li>
                    <i class="iconfont  icon-jieshushijian ft-12 co-BFCBD9">&nbsp;</i>
                    <span class="co-1f2f3d">盖章份数&nbsp;</span>
                    <span class="co-5E6D82">{{records.time_cost}}分钟</span>
                </li>
                <li>
                    <i class="iconfont  icon-feiyong ft-12 co-BFCBD9">&nbsp;</i>
                    <span class="co-1f2f3d">盖章类型&nbsp;</span>
                    <span class="co-5E6D82">{{records.fee_cost}}元</span>
                </li>
                <li>
                    <i class="iconfont  icon-shijian ft-12 co-BFCBD9">&nbsp;</i>
                    <span class="co-1f2f3d">组织形式&nbsp;</span>
                    <span class="co-5E6D82">{{records.endtime_text}}</span>
                    <span class="co-5E6D82" v-if="records.endtime ==  0">无</span>
                </li>
            </ul>
            <div class="info-text">
                <div class="title">备注</div>
                <p class="co-grey2 pre-line">鉴于贵司在事故航次的适航证书有效等因素，初步推断，贵司可根据“海事赔偿责任限制”予以对应。</p>
            </div>
            <div class="info-text">
                <div class="title">待审批的文件</div>
                <ul class="file-list">
                    <li v-for="(item,index) in records.case_file" :key='index'>
                        <el-tooltip effect="dark" content="点击可下载该文件" placement="bottom-start">
                            <a :href="url+'cfile/'+item.id+'/download?token='+mytoken" class="">
                                <i class="iconfont  icon-fileempty co-5E6D82"></i>
                                <span class="nowrap co-1f2f3d">{{item.file_name}}</span>
                                <i class="iconfont  icon-xiazai text-link"></i>
                            </a>
                        </el-tooltip>
                    </li>
                </ul>
                <p v-if="records.case_file == ''" class="co-5E6D82">暂无相关文书</p>
            </div>
            <div class="info-text">
                <div class="title">处理结果</div>
                <p class="co-grey2 pre-line">{{records.content}}</p>
            </div>
            <div class="info-text">
                <div class="title">审批意见</div>
                <p class="co-grey2 pre-line">{{records.content}}</p>
            </div>
            <div class="info-operate" v-if="auth !== 0">
                <el-button type="primary"  @click="goEdit">编辑</el-button>
                <el-button type=""  plain @click="onDelete(records)">删除</el-button>
            </div>
        </div>
    </div>
</template>
<script>

    import {mapGetters, mapActions} from 'vuex'
    import { SET_EDIT_DATA} from 'store/actions/type'
    import store from 'store'
    import {server_base_url} from 'common/config'

    export default {
        props: ['pdata', 'openStatus'],
        data() {
            return {
                title: '',
                info: '',
                auth: 1,
                url: server_base_url,
                sideout: '',
                fdata: '',
                records: '',
                link_title: '',
                mytoken: store.state.user_info.token
            }
        },

        watch: {
            pdata(val) {
                console.log('pdata-val', val)
                this.sideout = val[1]
                this.fdata = val[0]
                this.auth = val[2]
                this.get_data()
            },

            openStatus(val) {
                this.sideout = val[0]
            }
        },
        methods: {
            ...mapActions({
                set_edit_data:SET_EDIT_DATA,
            }),
            //获取详情
            get_data() {
                this.$fetch.api_stage.recordLook(this.fdata)
                    .then(({
                               data
                           }) => {
                        this.records = data
                        console.log(' this.records', data)
                        switch (data.type) {
                            case 1:
                                this.title = '诉讼案件'
                                this.link_title = '所属案件'
                                this.info = data.linkid_id_info
                                break;
                            case 2:
                                this.title = '非诉项目'
                                this.link_title = '所属项目'
                                this.info = data.linkid_id_info
                                break;
                            case 3:
                                this.title = '其他事项'
                                break;
                        }
                    })
                    .catch(() => {
                        this.load_data = false
                    })
            },
            //去案件或者项目办案记录页面
            goDetail(val) {
                //TODO:待完善，团队案件加在办案件情况未处理，项目也一样
                if (this.records.type === 1) {
                    let father = ''
                    switch (val.g_status){
                        case 1:father = 'case_inworking';break;
                        case 2:father = 'case_finish';break;
                        case 3:father = 'case_filed';break;
                    }
                    this.$router.push({
                        name: "case_detail",
                        query: {
                            code: val.code, id: this.records.linkid,
                            name: val.linkid_text, type_text: val.c_type_text
                        },
                        params: {father: father},
                    });
                }
                if (this.records.type === 2) {
                    this.$router.push({
                        name: "project_detail",
                        query: {code: val.pr_code, id: this.records.linkid, pr_name: val.pr_name},
                        params: {father: 'project_my'},
                    })
                }
            },

            //去编辑页-dialog
            goEdit() {
                //点击编辑按钮，关闭当前页，打开编辑的dialog，
                this.set_edit_data(this.records)
                this.sideout = 0
            },
            //删除文件
            delRecord(val) {
                this.$fetch.api_stage.recordDelete(
                    val.id
                )
                    .then(({
                               msg
                           }) => {
                            this.$message.success(msg)
                            let routeName = this.$route.name
                            if (routeName === 'home_calendar_month') {
                                let day = this.records.htime_text.split(' ')[0]
                                this.$emit('delRecord', [val, day])
                            } else {
                                this.$emit('delRecord', val)
                            }
                            this.sideout = 0
                        }
                    )
                    .catch(({
                                msg
                            }) => {
                            this.$message.warning(msg)
                        }
                    )
            },
            //表格中删除某一条数据
            onDelete(val) {
                this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass:'is-plain',
                }).then(() => {
                    this.delRecord(val)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //设为已办
            setHstatus() {
                this.$fetch.api_stage.recordThree(
                    {hstatus: 1},
                    this.records.id
                )
                    .then(({
                               msg
                           }) => {
                            this.$message.success(msg)
                            this.records.hstatus = 1    //改变待办状态的页面显示
                            this.$emit('s_hstatus', this.records.id)
                        }
                    )
                    .catch(({
                                msg
                            }) => {
                            this.$message.warning(msg)
                        }
                    )
            },
            //点击左侧栏，关闭
            closeSidebox() {
                this.sideout = 0
            },
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>


