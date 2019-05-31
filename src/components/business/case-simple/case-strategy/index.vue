<template>
    <el-dialog :title="isCreated===1?'新增办案策略':'编辑办案策略'" :visible.sync="visible" width="640px">
        <el-form :model="form" label-width="80px"  label-position="right" class="">
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form-item label="问题描述" prop="difficulty" class="form-border-left">
                        <el-input v-model="form.difficulty"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="解决方案" prop="solution">
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容"
                                  v-model="form.solution">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="处理结果" prop="result" class="form-border-left">
                        <el-input v-model="form.result"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="text-center">
                <el-button type="primary"  class="mg-top-20" @click="onSubmit('form')">提交</el-button>
                <el-button  class="mg-top-20" @click="visible = false" plain>返回</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>
<script>
    import { mapActions } from 'vuex'
    import { SET_CASE_DATA, } from 'store/actions/type'
    export default {
        components: {},
        props: ['isCreated', 'difficultyData'],
        data () {
            return {
                visible: false,
                form: {
                    difficulty: '',
                    solution: '',
                    result: '',
                },
                nowId: '',
                rules: {},
                stepData: null
            }
        },
        watch: {
            difficultyData(val) {
                this.visible = val.visible
                this.stepData = val.stepData
                if (val.nowId) {
                    this.nowId = val.nowId
                    this.getEditData()
                }
            }
        },
        methods: {
            onSubmit(formName) {
                let submit_form = JSON.parse(JSON.stringify(this.form))
                submit_form.cid = this.stepData.id
                if (this.isCreated === 1) {
                    this.addStrategy(submit_form)
                } else {
                    this.modifyStrategy(submit_form)
                }
            },
            addStrategy(submit_form) {
                this.$fetch.api_strategy.save(submit_form).then(({msg}) => {
                    this.$message.success(msg)
                    this.visible = false
                    this.$emit("updateStragegy") 
                }).catch(({msg})=>{

                })
            },
            modifyStrategy(submit_form) {
                this.$fetch.api_strategy.modify(submit_form, this.nowId).then(({msg}) => {
                    this.$message.success(msg)
                    this.visible = false
                    this.$emit("updateStragegy") 
                }).catch(({msg})=>{

                })
            },
            //获取编辑数据
            getEditData () {
                this.$fetch.api_strategy.edit(this.nowId).then(({msg, data}) => {
                    this.form.difficulty = data.data.difficulty
                    this.form.result = data.data.result
                    this.form.solution = data.data.solution
                }).catch(({msg})=>{

                })
            },
        }

    }
</script>

