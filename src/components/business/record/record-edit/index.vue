<template>
    <el-dialog :title="isCreated===1?'新增待办':'编辑待办'" width="800px" :visible.sync="visible" top="15vh"
               :close-on-click-modal="false" @close="closeDialog">
        <el-form ref="form" :model="form" :rules="rules" label-width="85px" v-loading="loading"
                 element-loading-text="拼命加载中">
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="事件类型" prop="type">
                        <el-radio-group v-model="form.type" :disabled="disabledType" @change="onChangeType">
                            <el-radio :label="1" border>诉讼案件</el-radio>
                            <el-radio :label="2" border>项目管理</el-radio>
                            <el-radio :label="4" border>客户管理</el-radio>
                            <el-radio :label="3" border>其他事务</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12" v-if="typeActive!==3">
                    <el-form-item :label="linkLabel" prop="linkid">
                        <el-select v-model="form.linkid" placeholder="请选择" style="width: 100%" :disabled="disLinkid"
                                   filterable @change="onChangeLinkid">
                            <el-option v-for="(item,index) in linkOptions" :key="index" :label="item.title"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="工作摘要" class="" prop="rtype">
                        <el-select v-model="form.rtype" placeholder="请选择" style="width: 100%" filterable>
                            <el-option v-for="item in rtypeOptions" :key="item.key" :label="item.value"
                                       :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="案件阶段" class="" prop="stage" v-if="typeActive === 1">
                        <el-select v-model="form.stage" placeholder="请选择" style="width: 100%" filterable>
                            <el-option v-for="item in stageOptions" :key="item.id" :label="item.name"
                                       :disabled="item.disabled" :value="item.id">
                            </el-option>
                            <li class="el-select-dropdown__item--self">
                                没有找到您想要的案件阶段?
                                <span slot="reference" class="text-info cursor" @click="openStageAdd">点击新增</span>
                            </li>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="工作详情" prop="content">
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容"
                                  v-model="form.content">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="办理时间" prop="">
                        <el-row type="flex" justify="space-between">
                            <el-col :span="12">
                                <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                                                v-model="htimeDate" @change="onChangeHtimeDate" :clearable="false"
                                                style="width: 100%;"></el-date-picker>
                            </el-col>
                            <el-col :span="11">
                                <el-time-picker :clearable="false" @change="onChangeHtimeTime" placeholder="选择时间"
                                                value-format="HH:mm" format="HH:mm"
                                                v-model="htimeTime" style="width: 100%;"></el-time-picker>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="结束时间" prop="">
                        <el-row type="flex" justify="space-between">
                            <el-col :span="12">
                                <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                                                v-model="endtimeDate" @change="onChangeEndtimeDate"
                                                style="width: 100%;"></el-date-picker>
                            </el-col>
                            <el-col :span="11">
                                <el-time-picker value-format="HH:mm" format="HH:mm"
                                                @change="onChangeEndtimeTime" placeholder="选择时间" v-model="endtimeTime"
                                                style="width: 100%;"></el-time-picker>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="主办人员" class="" prop="huser">
                        <el-select v-model="form.huser" placeholder="请选择" style="width: 100%" filterable>
                            <el-option v-for="item in  host_arr" :key="item.id" :label="item.real_name"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="协办人员" prop="assit">
                        <el-select v-model="form.assit" multiple collapse-tags style="width: 100%" filterable
                                   placeholder="请选择">
                            <el-option v-for="item in assist_arr" :key="item.id" :label="item.real_name"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="时间花费" class="" prop="time_cost">
                        <el-input v-model.number="form.time_cost">
                            <template slot="append">分钟</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="费用花费" class="" prop="fee_cost">
                        <el-input v-model.number="form.fee_cost">
                            <template slot="append"> 元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="重要提醒" prop="remind_time">
                        <el-select v-model="form.remind_time" placeholder="请选择" style="width: 100%"
                                   :disabled="canRemind"
                                   filterable @change="onChangeRemind">
                            <el-option v-for="(item,index) in remindOptions" :key="index" :label="item.title"
                                       :value="item.val">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="重要提醒" prop="remind">
                        <el-radio-group v-model="form.remind">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item> -->
                </el-col>
                <el-col :span="12">
                    <el-form-item label="设为已办" prop="hstatus">
                        <el-radio-group v-model="form.hstatus" @change="changeHstatus">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="上传文书">
                        <el-upload class="upload-demo" ref="upload" :action=uploadUrl() :headers=header()
                                   :before-upload="beforeAvatarUpload" :on-remove="handleRemove"
                                   :on-success="successBack" name='cfile' :file-list="fileList" multiple>
                            <el-button slot="trigger" plain>选取文件</el-button>
                            <span slot="tip" class="el-upload__tip mal-10">※ 上传的文件不能超过{{fileLimit}}M</span>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item class="text-right">
                        <el-button type="primary" :disabled="disabledSubmit" @click="postForm('form')">
                            立即提交
                        </el-button>
                        <el-button type="" plain @click=" visible = false">取消
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <stage-new :stageAdd="stageAdd" @stageRefresh="stageRefresh"></stage-new>
    </el-dialog>
</template>

<script>
    import stageNew from '../../stage/stage-new'
    import store from 'store'
    import {
        server_base_url
    } from 'common/config'

    export default {
        props: ['recordAdd', 'recordEdit'],
        components: {
            stageNew
        },
        data() {
            return {
                value6: '',
                stageAdd: {},
                endtimeDate: '',
                endtimeTime: '',
                htimeDate: '',
                htimeTime: '',
                typeActive: 3,
                link_case_options: [],
                link_project_options: [],
                link_others_options: [],
                disabledType: true,
                disLinkid: false,
                loading: false,
                title: '',
                url: server_base_url,
                fileList: [],
                host_arr: [],
                assist_arr: [],
                rtypeOptions: [],
                linkLabel: '',
                linkOptions: [],
                linkCaseOptions: [],
                linkProjectOptions: [],
                linkClientOptions: [],
                stageOptions: [],
                form: {
                    stage: '',
                    content: '',
                    remind_time: '',
                    endtime: '',
                    htime: '',
                    huser: store.state.user_info.user.id,
                    assit: [],
                    type: '',
                    rtype: '',
                    linkid: '',
                    hstatus: 0,
                    file_tem_ids: [],
                    time_cost: 0,
                    fee_cost: 0,
                    rcode: ''
                },
                rules: {
                    rtype: [{
                        required: true,
                        message: '必填项',
                        trigger: 'change'
                    }],
                    linkid: [{
                        required: true,
                        message: '必填项',
                        trigger: 'change'
                    }],
                    fee_cost: [{
                        type: 'number',
                        message: '请输入数字',
                        trigger: 'change'
                    }],
                    time_cost: [{
                        type: 'number',
                        message: '请输入数字',
                        trigger: 'change'
                    }],
                    stage: [{
                        required: true,
                        message: '必填项',
                        trigger: 'change'
                    }]
                },
                visible: false,
                disabledSubmit: false,
                recordId: '',
                isCreated: 0,
                isStrategy: 0,
                strategyId: '',
                remindOptions: [{
                    title: '提前5分钟',
                    val: '5'
                }, {
                    title: '提前10分钟',
                    val: '10'
                }, {
                    title: '提前15分钟',
                    val: '15'
                }, {
                    title: '提前30分钟',
                    val: '30'
                }, {
                    title: '提前1小时',
                    val: '60'
                }, {
                    title: '提前2小时',
                    val: '120'
                }, {
                    title: '提前12小时',
                    val: '720'
                }, {
                    title: '提前1天',
                    val: '1440'
                }, {
                    title: '提前1周',
                    val: '10080'
                }, {
                    title: '不提醒',
                    val: ''
                }
                ],
                canRemind: false
            }
        },
        created() {
        },

        watch: {

            //新增记录，type:1-案件，2-项目
            recordEdit(val) {
                this.isCreated = 0
                this.visible = val.visible
                // this.disLinkid = true
                this.typeActive = val.type
                this.getEditData(val.code)
            },
            //只会在新增的时候触发
            recordAdd(val) {
                this.isCreated = 1
                /*type=1，无关联联系人选项
                type=2，选择项目禁用（用户项目-详情）
                type=22，选择项目可用，其他和项目一样(用于客户-项目-详情)
                type=3,日程管理*/
                this.form.type = val.type
                this.typeActive = val.type
                if (val.isStrategy === 1) {
                    this.isStrategy = 1
                    this.strategyId = val.strategyId
                }
                if (val.type === 2) {
                    //项目,选择项目禁用
                    this.disLinkid = true
                    this.getAbstract(val.type, val.linkid)
                }
                if (val.type === 4) {
                    this.disLinkid = true
                    this.getAbstract(val.type, val.link_client)
                }
                if (val.type === 3) {
                    //仅有日程管理，才可切换事件类型
                    this.form.linkid = 0
                    this.disabledType = false
                    this.getAbstract(val.type, 0)
                }
                if (val.type === 1) {
                    //默认事件类型为诉讼案件（type=1）
                    this.disLinkid = true
                    this.getAbstract(val.type, val.linkid)
                    this.getStage(val.linkid)
                    this.form.stage = val.stage
                }
                this.getCreateData(val)
                this.visible = true

            }
        },
        computed:{
            fileLimit(){
                const vType = store.state.v_info.type
                return vType>0 ? 100 :10
            },
        },
        methods: {

            //关闭页面，重置data
            closeDialog() {
                Object.assign(this.$data, this.$options.data())
            },

            //新增阶段
            openStageAdd() {
                this.stageAdd = {
                    visible: true,
                    caseId: this.form.linkid
                }
            },

            //更新阶段options
            stageRefresh(val) {
                if (val.isFresh) {
                    this.getStage(this.form.linkid)
                    this.form.stage = val.id
                }
            },
            //根据案件id，获取案件阶段列表
            getStage(cid) {
                this.$fetch.api_stage.list({
                    cid: cid
                })
                    .then(
                        ({
                             data,
                             msg
                         }) => {
                            this.stageOptions = data.length ? data : [{
                                id: 0,
                                name: '暂无数据',
                                disabled: true
                            }]
                        }
                    )
            },

            //获取摘要列表
            getAbstract(type, linkid) {
                this.rtypeOptions = []
                this.$fetch.api_record.recordAbstract({
                    type: type,
                    linkid: linkid
                })
                    .then(
                        ({
                             data,
                             msg
                         }) => {
                            this.rtypeOptions = data.rtype
                        }
                    )
            },

            //事件类型切换sta
            onChangeType(val) {
                //每次切换都清空 rtype=工作摘要，linkid=选择项目或案件
                this.typeActive = val
                this.form.linkid = ''
                this.form.rtype = ''
                this.form.stage = ''
                this.rtypeOptions = []
                this.linkOptions = []
                //配置改变
                if (val === 1) {
                    this.linkOptions = this.linkCaseOptions
                    this.linkLabel = '选择案件'
                    if (this.linkCaseOptions.length === 0) {
                        this.$message.error('暂无案件，请新建案件，否则无法添加案件记录')
                    }
                } else if (val === 2) {
                    this.linkLabel = '选择项目'
                    this.linkOptions = this.linkProjectOptions
                    if (this.linkProjectOptions.length === 0) {
                        this.$message.error('暂无项目，请新建项目，否则无法添加项目记录')
                    }
                } else if (val === 4) {
                    this.linkLabel = '选择客户'
                    this.linkOptions = this.linkClientOptions
                    if (this.linkClientOptions.length === 0) {
                        this.$message.error('暂无客户，请新建客户，否则无法添加客户记录')
                    }
                    this.getAbstract(4, 0)
                } else {
                    this.getAbstract(3, 0)
                }
            },
            //选择案件，项目发生改变，工作摘要跟着改变
            onChangeLinkid(val) {
                //清空已选择的
                this.form.rtype = ''
                this.form.stage = ''
                //获取选择项目/案件的options
                if (this.form.type !== 4) {
                    this.getAbstract(this.form.type, val)
                }
                //当事件类型为案件type=1,需要获取案件阶段
                if (this.form.type === 1) {
                    this.getStage(val)
                }
            },
            onChangeRemind(val) {
                let newTime = this.htimeDate + ' ' + this.htimeTime
                this.form.remind_time = this.$dayjs(newTime).subtract(val, 'minutes').format('YYYY-MM-DD HH:mm')
            },
            changeHstatus(val) {
                if (val === 1) {
                    this.canRemind = true
                } else {
                    let newTime = this.htimeDate + ' ' + this.htimeTime
                    if (this.calcFive()) {
                        this.canRemind = true
                    } else {
                        this.canRemind = false
                    }
                }
            },
            //提交表单后清除数据
            clearForm() {
                //必须要清除dialog数据
                this.resetForm('form')
                this.$refs.upload.clearFiles()
                this.disLinkid = false
                this.disabledType = true
                this.htimeDate = ''
                this.htimeTime = ''
                this.endtimeDate = ''
                this.endtimeTime = ''
            },

            beforeAvatarUpload(file) {
                //限制类型
                const fileType = file.name.split('.').reverse()[0]
                const limitTypes = ['jpg','jpeg','bmp','png','rar','zip','7z','doc','docx','rtf','txt','xls','xlsx','pdf','mp3','m4a']
                const isType = limitTypes.some(item=>item ===fileType )
                if(!isType){
                    this.$message.error(`上传文件类型不能为${fileType}!`)
                }
                //基础版10M内，收费版100M内
                //对应登录返回数据中，版本v_info中的type字段，type=0基础版，type>0高阶版
                const vType = store.state.v_info.type
                const limitValue = vType>0 ? 100 :10
                const isLimit =file.size / 1024 / 1024 < limitValue
                if (!isLimit) {
                    this.$message.error(`上传文件大小不能超过${limitValue}MB!`)
                }
                return isLimit && isType
            },
            uploadUrl: function () {
                return this.url + 'cfile'
            },
            header: function () {
                return {
                    //bearer后面需要带个空格
                    authorization: 'Bearer ' + store.state.user_info.token
                }
            },
            //删除文件
            deleteFile(id, params) {
                this.$fetch.api_file.cfileDelete(id, params)
                    .then(
                        ({
                             msg
                         }) => {}
                    )
            },
            handleRemove(file) {
                if (!file.response){return}     //beforeAvatarUpload也会触发handleRemove，避免报错
                if (file.is_record) {
                    this.deleteFile(file.id, {is_tem_file: 0})
                } else {
                    this.deleteFile(file.response.data.file_id, {is_tem_file: 1})
                    // 如果删除的文件是在编辑页新上传的，则删除this.form.file_tem_ids里面对应的file_id
                    // 始终保证只提交新增文件的file_id
                    for (let i in this.form.file_tem_ids) {
                        if (this.form.file_tem_ids[i] === file.response.data.file_id) {
                            delete this.form.file_tem_ids[i]
                        }
                    }
                }
            },
            successBack(response, file, fileList) {
                if (parseInt(response.code) === 1){
                    this.$message.error(response.msg)
                }else {
                    this.$message.success(response.msg)
                    // 只有新增的文件才会被添加到编辑页的表单提交里面
                    // 已经存在的文件列表不用提交
                    this.form.file_tem_ids.push(response.data.file_id)
                }
            },
            //创建
            getCreateData(val) {
                this.loading = true
                this.linkCaseOptions = []
                this.linkProjectOptions = []
                this.linkClientOptions = []
                this.$fetch.api_record.create()
                    .then(({
                               data: {
                                   link_arr,
                                   team_lawyers
                               }
                           }) => {
                        /*
                         * val.type,1为案件，2为项目，3为日程,4为客户
                         * 根据事项类型，选择案件/项目/其他事务*/
                        switch (val.type) {
                            case 1:
                                // 选择案件-候选项
                                this.linkLabel = '选择案件'
                                this.linkOptions = link_arr.link_case
                                this.form.linkid = val.linkid
                                break
                            case 2:
                                //选择项目-候选项
                                this.linkLabel = '选择项目'
                                this.linkOptions = link_arr.link_project
                                this.form.linkid = val.linkid
                                break
                            case 3:
                                if (val.huser) {
                                    //team-week页面中存在
                                    this.form.huser = val.huser
                                }
                                this.linkCaseOptions = link_arr.link_case
                                this.linkProjectOptions = link_arr.link_project
                                this.linkClientOptions = link_arr.link_client.map(item => {
                                    item.title = item.name
                                    delete item.name
                                    return item
                                })
                                break
                            case 4:
                                //选择项目-候选项
                                this.linkLabel = '选择客户'
                                this.linkOptions = link_arr.link_client.map(item => {
                                    item.title = item.name
                                    delete item.name
                                    return item
                                })
                                this.form.linkid = val.link_client
                                break
                        }
                        //主办人员默认自己,
                        // team_lawyers存在/不存在，分情况
                        if (team_lawyers) {
                            this.host_arr = team_lawyers
                            this.assist_arr = team_lawyers
                        } else {
                            this.host_arr = [{
                                id: store.state.user_info.user.id,
                                real_name: store.state.user_info.user.real_name
                            }]
                        }

                        /*预设时间
                         * val.type=3，在日程中添加，htime根据日历设置
                         * val,type=1/2,在项目或者客户中添加，htime根据当前时间设置*/
                        if (val.type === 3) {
                            this.htimeDate = val.htimeDate
                            this.htimeTime = val.htimeTime ? val.htimeTime : '09:00'    //在my-week，team-day中有起始时间
                        } else {
                            const today = new Date()
                            let currentHour = today.getHours()
                            if (currentHour < 14) {
                                this.htimeDate = this.$dayjs(today).format('YYYY-MM-DD')
                                this.htimeTime = '14:00'
                            } else {
                                let temp = today.setTime(today.getTime() + 3600 * 1000 * 24)
                                this.htimeDate = this.$dayjs(temp).format('YYYY-MM-DD')
                                this.htimeTime = '09:00'
                            }
                        }
                        this.loading = false
                    })
                    .catch(({
                                msg
                            }) => {
                        this.loading = false
                    })
            },
            //编辑页基本数据
            getEditData(code) {
                this.loading = true
                this.$fetch.api_record.edit(code)
                    .then(({
                               data: {
                                   abstract,
                                   link_arr,
                                   stage_arr,
                                   team_lawyers,
                                   record_data
                               }
                           }) => {
                        //team_lawyers存在/不存在，分情况
                        if (team_lawyers) {
                            this.host_arr = team_lawyers
                            this.assist_arr = team_lawyers
                        } else {
                            this.host_arr = [{
                                id: store.state.user_info.user.id,
                                real_name: store.state.user_info.user.real_name
                            }]
                        }
                        //表单渲染
                        this.recordId = record_data.id //这条记录的id，发送给后端
                        //事件类型
                        this.form.type = record_data.type
                        //选择案件-选择案件-选择客户
                        switch (record_data.type) {
                            case 1:
                                // 选择案件-候选项
                                this.linkLabel = '选择案件'
                                this.linkOptions = link_arr.link_case
                                this.form.linkid = record_data.linkid
                                break
                            case 2:
                                //选择项目-候选项
                                this.linkLabel = '选择项目'
                                this.linkOptions = link_arr.link_project
                                this.form.linkid = record_data.linkid
                                break
                            case 4:
                                //选择项目-候选项
                                this.linkLabel = '选择客户'
                                this.linkOptions = link_arr.link_client.map(item => {
                                    item.title = item.name
                                    delete item.name
                                    return item
                                })
                                this.form.linkid = record_data.link_client
                                break
                        }

                        //协办人员
                        let assit_data = record_data.assit
                        if (assit_data) {
                            let assit_arr = assit_data.split(',')
                            for (let i = 0; i < assit_arr.length; i++) {
                                this.form.assit.push(parseInt(assit_arr[i]))
                            }
                        }
                        this.form.content = record_data.content
                        this.form.huser = parseInt(record_data.huser)
                        //this.form.remind = record_data.remind
                        this.form.fee_cost = parseInt(record_data.fee_cost)
                        this.form.time_cost = parseInt(record_data.time_cost)
                        this.form.hstatus = record_data.hstatus
                        this.form.rcode = record_data.rcode

                        //办理时间，结案时间格式化后赋值
                        let temp1 = new Date((record_data.htime) * 1000)
                        let temp2 = new Date((record_data.endtime) * 1000)
                        if (record_data.endtime === 0) {
                            this.endtimeDate = ''
                            this.endtimeTime = ''
                        } else {
                            this.endtimeDate = this.$dayjs(temp2).format('YYYY-MM-DD')
                            this.endtimeTime = this.$dayjs(temp2).format('HH:mm')
                        }
                        this.htimeDate = this.$dayjs(temp1).format('YYYY-MM-DD')
                        this.htimeTime = this.$dayjs(temp1).format('HH:mm')
                        let newTime = this.htimeDate + ' ' + this.htimeTime
                        if (record_data.remind_time) {
                            this.form.remind_time = record_data.remind_time
                        }
                        if (this.calcFive() || record_data.hstatus === 1) {
                            this.canRemind = true
                        } else {
                            this.canRemind = false
                        }

                        //给已关联记录的文件做标记is_record=true
                        for (let i in record_data.case_file) {
                            record_data.case_file[i].name = record_data.case_file[i].file_name
                        }
                        for (let i in record_data.case_file) {
                            record_data.case_file[i].is_record = true
                        }
                        this.fileList = record_data.case_file
                        //摘要
                        this.rtypeOptions = abstract
                        this.form.rtype = record_data.rtype
                        //案件阶段
                        this.stageOptions = stage_arr
                        this.form.stage = record_data.stage === 'EqA5Kx5W' ? '' : record_data.stage //当stage为0是，显示为‘’
                        this.loading = false

                    })
                    .catch(({
                                msg
                            }) => {
                        this.loading = false
                    })
            },

            //办理时间-日期改变
            onChangeHtimeDate(val) {
                let newTime = this.htimeDate + ' ' + this.htimeTime
                if (this.calcFive() || this.form.hstatus === 1) {
                    this.canRemind = true
                } else {
                    this.canRemind = false
                }
                //若无结束时间，则不进行计算
                if (!this.endtimeDate) {
                    return false
                }
                this.calculateTimeCost()
            },

            //办理时间-时间改变
            onChangeHtimeTime(val) {
                let newTime = this.htimeDate + ' ' + this.htimeTime
                if (this.calcFive() || this.form.hstatus === 1) {
                    this.canRemind = true
                } else {
                    this.canRemind = false
                }
                //若无结束时间，则不进行计算
                if (!this.endtimeDate) {
                    return false
                }
                this.calculateTimeCost()
            },

            //结束时间-日起改变
            onChangeEndtimeDate(val) {
                if (val && !this.endtimeTime) {
                    this.endtimeTime = this.htimeTime
                }
                this.calculateTimeCost()
            },
            //结束时间-时间改变
            onChangeEndtimeTime(val) {
                if (val && !this.endtimeDate) {
                    let test = this.$dayjs(this.htimeDate).add(1, 'day').toDate()
                    this.endtimeDate = this.$dayjs(test).format('YYYY-MM-DD')
                }
                this.calculateTimeCost()

            },
            //计算时间花费
            calculateTimeCost() {
                //每次结束时间改变，时间花费清空,提交选项禁用取消
                this.form.time_cost = 0
                this.disabledSubmit = false
                let htime = `${this.htimeDate} ${this.htimeTime}`
                let hMinute = this.$dayjs(htime).valueOf() / 1000 / 60
                let endtime = `${this.endtimeDate} ${this.endtimeTime}`
                let eMinute = this.$dayjs(endtime).valueOf() / 1000 / 60
                if (!endtime) {
                    return false
                }
                if (eMinute - hMinute < 0) {
                    this.$message.warning('结束时间必须大于办理时间')
                    this.endtimeDate = ''
                    this.endtimeTime = ''
                } else {
                    this.form.time_cost = eMinute - hMinute
                }
            },

            //提交表单
            postForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return false
                    let newTime = this.htimeDate + ' ' + this.htimeTime
                    if (this.calcFive() || this.form.hstatus === 1) {
                        this.form.remind_time = ''
                    }
                    let submitForm = JSON.parse(JSON.stringify(this.form))
                    switch (this.form.type) {
                        case 1:
                            break
                        case 2:
                            delete submitForm.stage
                            break
                        case 4:
                            submitForm.link_client = submitForm.linkid
                            delete submitForm.stage
                            delete submitForm.linkid
                            break
                        case 3:
                            delete submitForm.stage
                            delete submitForm.linkid
                            break
                    }
                    submitForm.htime = `${this.htimeDate} ${this.htimeTime}`
                    submitForm.endtime = `${this.endtimeDate} ${this.endtimeTime}`
                    this.loading = true
                    if (this.isStrategy === 1) {
                        submitForm.link_strategy = this.strategyId
                    }
                    this.$fetch.api_record.save(submitForm, this.form.rcode)
                        .then(({
                                   msg
                               }) => {
                            this.loading = false
                            this.$emit('refreshSave', true)
                            this.visible = false
                        })
                        .catch(({
                                    msg
                                }) => {
                            this.loading = false
                        })

                })
            },

            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields()
                this.$refs.upload.clearFiles()
                this.disabledSubmit = false
            },
            calcFive() {
                //计算是否大于十分钟
                let newTime = this.htimeDate + ' ' + this.htimeTime
                if (this.$dayjs(newTime).valueOf() - this.$dayjs().valueOf() < (10 * 60 * 1000)) {
                    return true
                } else {
                    return false
                }
            }
        }

    }
</script>
