<template>
    <div class="section section--table">
        <div class="tab-component__mini">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===index}"
                    v-for="(item,index) in linkTab"
                    :key="item.index">
                    {{item.text}}
                </li>
            </ul>
            <div class="co-9FA5B9 cursor" @click="showLinkDialog">
                <i class="iconfont  icon-add1 ft-14 mg-right-5"></i>
                <span>新增关联</span>
            </div>
        </div>
        <el-table
            :data="hasLinkData"
            row-class-name="toggle-row">
            <el-table-column
                prop="c_type_title"
                width="100"
                :show-overflow-tooltip="true"
                label="案件类型">
            </el-table-column>
            <el-table-column prop="case_name" label="案件名称" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span @click.stop="jumpCaseDetail(scope.row)">{{scope.row.case_name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="process_text"
                width="100"
                label="案件程序">
            </el-table-column>
            <el-table-column
                prop=""
                width="100"
                label="主办/操作">
                <template slot-scope="scope">
                            <span class="text-danger hover-show"
                                  @click="releaseClient(scope.row,scope.$index)">解除关联</span>
                    <span class="is-show">{{scope.row.host_text}}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="关联案件" :visible.sync="linkDialogVisible" width="800px" custom-class="link-project">
            <div style="padding: 15px 0;width: 65%;margin: 0 auto">
                <el-input
                    placeholder="请输入案件名称进行搜索"
                    size="mini"
                    clearable
                    v-model="caseName">
                    <i slot="prefix" class="el-input__icon el-icon-search ft-16 "></i>
                </el-input>
            </div>
            <el-table :data="notLinkData" v-loading="dialogLoading" max-height="600">
                <el-table-column
                    prop="c_type_title"
                    width="120"
                    label="案件类型">
                </el-table-column>
                <el-table-column prop="pr_name" label="案件名称" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span class="text-info" @click.stop="jumpCaseDetail(scope.row)">{{scope.row.case_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="process_text"
                    width="80"
                    label="案件程序">
                </el-table-column>
                <el-table-column
                    prop="host_text"
                    width="80"
                    label="主办律师">
                </el-table-column>
                <el-table-column prop="address" label="操作" width="120">
                    <template slot-scope="scope">
                        <span class="text-info" @click="catchClient(scope.row,scope.$index,)">关联到当前项目</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
    // import {
    //     projectNew,
    //     linkmanDetail,
    //     linkmanAdd
    // } from 'components'
    let timer = null
    export default {
        props: ['caseData'],
        // components: {
        //     linkmanAdd,
        //     linkmanDetail
        // },
        data() {
            return {
                caseName: '',
                dialogLoading: false,
                notLinkData: [],
                notLinkDataStatic: [],
                linkDialogVisible: false,
                hasLinkData: [],
                form: {
                    file_name: ''
                },
                baseData: {},
                tabActive: 0,
                linkTab: [
                    {
                        text: '关联案件'
                    }
                ],
            }
        },
        created() {
        },
        watch: {
            caseData(val) {
                this.baseData = val
                //只有type=1（诉讼项目），才会在详情里有关联案件
                if (val.type === 1) {
                    val.link_lawcases.forEach(item => {
                        if (item.link_pr) {
                            this.hasLinkData.push(item)
                        } else {
                            this.notLinkData.push(item)
                            this.notLinkDataStatic.push(item)
                        }
                    })
                }

            },

            //根据案件名称进行搜索
            caseName(val) {
                //加入防抖函数
                let that = this
                clearTimeout(timer)
                that.dialogLoading = true
                timer = setTimeout(function () {
                    that.notLinkData = []
                    that.notLinkDataStatic.forEach(item => {
                        //搜索方法，根据indexof，判断字符串a是否在字符串b中
                        //宁少输入，不输错
                        if (item.case_name.indexOf(val) !== -1) {
                            that.notLinkData.push(item)
                        }
                    })
                    that.dialogLoading = false
                }, 500)
            }
        },
        methods: {

            //关联项目
            catchClient(row, index) {
                row.link_pr = this.baseData.id
                this.onSubmit(row, index)
            },
            //解除关联
            releaseClient(item, index) {
                item.link_pr = 0
                this.onSubmit(item, index)
            },
            //修改案件的link_pr
            onSubmit(data, index) {
                this.$fetch.api_case.save({link_pr: data.link_pr}, data.id)
                    .then(({
                               msg
                           }) => {
                        if (data.link_pr) {
                            //关联客户
                            //从notLinkData中去除，加入到hasLinkData
                            this.notLinkData.splice(index, 1)
                            this.notLinkDataStatic.splice(index, 1)
                            this.hasLinkData.push(data)
                        } else {
                            //解除关联
                            //从hasLinkData中去除，加入到notLinkData
                            this.hasLinkData.splice(index, 1)
                            this.notLinkData.push(data)
                            this.notLinkDataStatic.push(data)
                        }
                    })
                    .catch(({
                                msg
                            }) => {
                    })
            },

            jumpCaseDetail(row) {
                this.$router.push({
                    name: 'caseDetail',
                    params: {
                        code: row.case_code
                    }
                })
            },

            showLinkDialog() {
                if (this.notLinkData.length) {
                    this.linkDialogVisible = true
                } else {
                    this.$message.warning('暂无待关联案件')
                }

            },

        }

    }
</script>
