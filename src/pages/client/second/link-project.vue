<template>
    <div class="section section--table" >
        <div class="tab-component__mini">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===index}"
                    v-for="(item,index) in infoTab"
                    :key="item.index">
                    {{item.text}}
                </li>
            </ul>
            <div class="co-9FA5B9 cursor" @click="showProjectDialog">
                <i class="iconfont  icon-add1 ft-14 mg-right-5"></i>
                <span>新增关联</span>
            </div>
        </div>
        <el-table
            :data="hasLinkData"
            @row-click="clickRow"
            cell-class-name="border-dashed"
            row-class-name="toggle-row"
            style="width: 100%">
            <el-table-column prop="pr_name" label="项目名称" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                prop="pr_type_text"
                label="项目类型">
            </el-table-column>
            <el-table-column
                prop="start_time_text"
                label="开始时间">
            </el-table-column>
            <el-table-column
                prop="pr_status_text"
                label="项目状态">
            </el-table-column>
            <el-table-column
                prop=""
                label="主办/操作">
                <template slot-scope="scope">
                    <span class="text-danger hover-show" @click.stop="releaseClient(scope.row,scope.$index)">解除关联</span>
                    <span class="is-show">{{scope.row.host_text}}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="关联项目" :visible.sync="projectVisible" width="800px" custom-class="link-project">
            <el-table :data="noLinkData">
                <el-table-column prop="pr_name" label="项目名称">
                    <template slot-scope="scope">
                        <span class="text-info" @click.stop="jumpProjectDetail(scope.row)">{{scope.row.pr_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="pr_type_text"
                    label="项目类型">
                </el-table-column>
                <el-table-column
                    prop="start_time_text"
                    label="开始时间">
                </el-table-column>
                <el-table-column
                    prop="pr_status_text"
                    label="项目状态">
                </el-table-column>
                <el-table-column
                    prop="host_text"
                    label="主办律师">
                </el-table-column>
                <el-table-column prop="address" label="操作" width="120">
                    <template slot-scope="scope">
                        <span class="text-info" @click="catchClient(scope.row,scope.$index,)">关联到当前客户</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>

    export default {
        props: ['detailData'],
        components: {},
        data() {
            return {
                infoTab: [
                    {text: '关联项目'}
                ],
                tabActive: 0,
                projectVisible: false,
                projectData: [],
                baseData: {},
                clientEdit: '',
                hasLinkData: [],
                noLinkData: []
            }
        },
        created() {

        },
        watch: {
            detailData(val) {
                this.baseData = val
                let arr = val.project
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].cl_id) {
                        this.hasLinkData.push(arr[i])
                    } else {
                        this.noLinkData.push(arr[i])
                    }
                }

            }
        },
        methods: {
            jumpProjectDetail(row) {
                this.$router.push({
                    name: 'projectCode',
                    params: {
                        code: row.pr_code
                    }
                })
            },

            //点击关联项目的row，跳转到详情页
            clickRow(row, event, column) {
                this.$router.push({
                    name: 'projectCode',
                    params: {
                        code: row.pr_code
                    }
                })
            },

            //解除关联
            releaseClient(item, index) {
                item.cl_id = 0
                this.onSubmit(item, index)
            },

            //关联客户
            catchClient(row, index) {
                row.cl_id = this.baseData.id
                this.onSubmit(row, index)
            },

            //修改项目的cl_id
            onSubmit(data, index) {
                this.$fetch.api_project.projectPut({cl_id: data.cl_id}, data.id)
                    .then(({
                               msg
                           }) => {
                        this.$message.success(msg)
                        if (data.cl_id) {
                            //关联客户
                            //从noLinkData中去除，加入到hasLinkData
                            this.noLinkData.splice(index, 1)
                            this.hasLinkData.push(data)

                        } else {
                            //解除关联
                            //从hasLinkData中去除，加入到noLinkData
                            this.hasLinkData.splice(index, 1)
                            this.noLinkData.push(data)
                        }
                    })
            },

            openEditModal(data) {
                this.clientEdit = {
                    visible: true,
                    code: data.code
                }
            },

            refreshData() {

            },

            showProjectDialog() {
                if (this.noLinkData.length) {
                    this.projectVisible = true
                } else {
                    this.$message.warning('暂无待关联项目')
                }
            }
        }
    }
</script>
