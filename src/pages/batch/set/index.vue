<template>
    <div class="batch-my">
        <div class="search-box">
            <el-form :model="form"  label-position="right" label-width="80px" :rules="rules" ref="form" >
                <el-row :gutter="20">
                    <el-col :span="4">
                        <el-form-item label="客户名称" prop="client_id">
                            <el-select v-model="form.client_id" @change="clientChange">
                                <el-option
                                    v-for="item in client_arr"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="项目名称" prop="project_id">
                            <el-select v-model="form.project_id" @change="projectChange">
                                <el-option
                                    v-for="item in project_arr"
                                    :key="item.id"
                                    :label="item.pr_name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="委案批次" prop="batch_id">
                            <el-select v-model="form.batch_id" placeholder="请选择活动区域">
                                <el-option
                                    v-for="item in batch_arr"
                                    :key="item.id"
                                    :label="item.batch"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" style="margin-left: 40px">
                        <el-button type="primary"  @click="search('form')">查找</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="table-box">
            <el-table
                
                ref="multipleTable"
                :data="table_data"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="index"
                    label="序号"
                    width="">
                </el-table-column>

                <el-table-column
                    label="字段类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type===1">系统字段</span>
                        <span v-else>自定义字段</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="字段名称"
                >
                </el-table-column>
                <el-table-column
                    prop="is_show"
                    label="列表显示"
                    width="">
                    <template slot-scope="scope">
                        <span v-if="scope.row.is_show===1">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="is_export"
                    label="是否导出"
                    width="">
                    <template slot-scope="scope">
                        <span v-if="scope.row.is_export===1">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="sort"
                    label="排序"
                    width="">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="">
                    <template slot-scope="scope">
                        <span class="text-link cursor" @click="edit(scope.row)">编辑</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="编辑字段" :visible.sync="dialogFormVisible" width="530px">
            <el-form :model="dialog_form" ref="dialog_form"  label-width="80px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="字段类型" >
                            <span v-if="dialog_form.type===1">系统字段</span>
                            <span v-else>自定义字段</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="字段名称"  prop="title">
                            <el-input v-model="dialog_form.title" :disabled="dialog_form.type===1"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="排序"  prop="sort">
                            <el-input v-model="dialog_form.sort" auto-complete="on"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="列表显示" prop="is_show">
                            <el-switch
                                :disabled="dialog_form.type===1"
                                v-model="dialog_form.is_show"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-value="1"
                                inactive-value="0">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否导出" prop="is_export">
                            <el-switch
                                :disabled="dialog_form.type===1"
                                v-model="dialog_form.is_export"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-value="1"
                                inactive-value="0">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="text-right">
                    <el-form-item label="" >
                        <el-button type="primary"  @click="dialogSubmit('dialog_form')">保存</el-button>
                        <el-button   @click="dialogReset('dialog_form')" plain>重置</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>

    export default {

        data() {
            return {
                typeOptions:[
                    {
                        value:0,
                        label:''
                    }
                ],
                client_arr: [],
                temp_project_arr: [],
                project_arr: [],
                temp_batch_arr: [],
                batch_arr: [],
                table_data: [],
                dialogFormVisible: false,
                clickLi: 0,
                form: {
                    client_id: '',
                    project_id: '',
                    batch_id: '',
                },
                dis_dialog: false,
                dialog_id: '',
                dialog_form: {
                    client_id: '',
                    batch: '',
                    sys_name: '',
                    type: '',
                    title: '',
                    is_show: 1,
                    is_export: 1,
                    sort: '',

                },
                table_type_arr: [
                    {
                        icon: 'icon-quanbu',
                        text: '全部字段',
                    }, {
                        icon: 'icon-ziduanguanli',
                        text: '系统字段',
                    }, {
                        icon: 'icon-zidingyi',
                        text: '自定义字段',
                    },
                ],
                multipleSelection: [],

                rules: {
                    project_id: [
                        {required: true, message: '必选项'},
                    ],
                    client_id: [
                        {required: true, message: '必选项'}
                    ],
                    batch_id: [
                        {required: true, message: '必选项'}

                    ],
                }
            };
        },
        created() {
            this.get_base_search()
//            this.get_base_data()
        },
        methods: {
            //获取搜索栏基础数据
            get_base_search() {
                this.$fetch.api_batch.baseSearchData()
                    .then(({
                               data
                           }) => {
                        console.log('data--search', data)
                        this.client_arr = data.client_arr
                        this.temp_project_arr = data.project_arr
                        this.temp_batch_arr = data.batch_arr
                    })
                    .catch(({
                                msg
                            }) => {
                        this.$message.warning(msg)
                    })
            },
            //根据客户选择对应的项目
            clientChange(val) {
                //每次必先清空项目数组,上次选中的项目id
                this.form.project_id = ''
                this.project_arr = []
                for (let i in this.temp_project_arr) {
                    if (val === this.temp_project_arr[i].client_id) {
                        this.project_arr.push(this.temp_project_arr[i])
                    }
                }

            },
            //根据项目选择对应的批次号
            projectChange(val) {
                //每次必先清空项目数组,上次选中的项目id
                this.form.batch_id = ''
                this.batch_arr = []
                for (let i in this.temp_batch_arr) {
                    if (val === this.temp_batch_arr[i].project_id) {
                        this.batch_arr.push(this.temp_batch_arr[i])
                    }
                }
            },
            //点击搜索
            search(formName) {

                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.$fetch.api_batch.search(this.form)
                        .then(({
                                   data
                               }) => {
                            const index = parseInt(this.$route.query.index)
                            if (index){
                                for (let i=0;i<data.length;i++) {
                                    if (index === data[i].type) {
                                        this.table_data.push(data[i])
                                    }
                                }
                            }else {
                                this.table_data = data
                            }
                        })
                        .catch(({
                                    msg
                                }) => {
                            this.$message.warning(msg)
                        })
                });

            },
            //获取dialog编辑页的基本数据
            edit(data) {
                this.dialogFormVisible = true
//                console.log('data----', data)
                this.dialog_form.id = data.id
                this.dialog_form.type = data.type
                this.dialog_form.title = data.title
                this.dialog_form.is_show = data.is_show
                this.dialog_form.is_export = data.is_export
                this.dialog_form.sort = data.sort
                this.dialog_form.sys_name = data.sys_name
                this.dialog_form.client_id = this.form.client_id
                this.dialog_form.batch_id = this.form.batch_id
            },
            dialogSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    if (!this.dialog_form.id) {
//                        let form = {}
                        delete this.dialog_form.type
                        delete this.dialog_form.batch
                        this.$fetch.api_batch.bfield_store(this.dialog_form)
                            .then(({
                                       data,
                                       msg
                                   }) => {
                                this.$message.success('修改成功')
                                //更新表格数据
                                for (let i in this.table_data) {
                                    if (this.dialog_form.sys_name === this.table_data[i].sys_name) {
                                        this.table_data[i].title = this.dialog_form.title
                                        this.table_data[i].is_show = this.dialog_form.is_show
                                        this.table_data[i].is_export = this.dialog_form.is_export
                                        this.table_data[i].sort = this.dialog_form.sort
                                    }
                                }
                                this.dialogFormVisible = false
//                                console.log('data--list', data)
                            })
                            .catch(({
                                        msg
                                    }) => {
                                this.$message.warning(msg)
                            })
                    } else {
                        delete this.dialog_form.type
                        let id = this.dialog_form.id
                        delete this.dialog_form.id
                        this.$fetch.api_batch.bfield_put(id, this.dialog_form)
                            .then(({
                                       data
                                   }) => {
                                this.$message.success('修改成功')
//                                console.log('data--list', data)
                                //更新表格数据
                                for (let i in this.table_data) {
                                    if (this.dialog_form.sys_name === this.table_data[i].sys_name) {
                                        this.table_data[i].title = this.dialog_form.title
                                        this.table_data[i].is_show = this.dialog_form.is_show
                                        this.table_data[i].is_export = this.dialog_form.is_export
                                        this.table_data[i].sort = this.dialog_form.sort
                                    }
                                }
                                this.dialogFormVisible = false
                            })
                            .catch(({
                                        msg
                                    }) => {
                                this.$message.warning(msg)
                            })
                    }

                });
            },
            dialogReset(formName) {
                this.$refs[formName].resetFields();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>

</style>
