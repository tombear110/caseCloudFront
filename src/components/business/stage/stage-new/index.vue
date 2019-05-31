<template>
    <el-dialog top="35vh" :title="isCreated===1 ? '新增阶段':'编辑阶段'" :visible.sync="visible" append-to-body
               @close="closeStageDialog()" width="30%">
        <el-form ref="form" :rules="rules" label-width="80px" :model="form" >
            <el-form-item label="阶段名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <div class="text-center">
                <el-button type="primary"  @click="submitForm('form')">提交</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>
<script>
    export default {
        props: ['stageAdd', 'stageEdit'],
        data() {
            return {
                visible: false,
                isCreated: 1,
                rules: {
                    name: [{
                        required: true,
                        message: '请填写阶段名称',
                        trigger: 'blur'
                    }]
                },
                form: {
                    name: ''
                },
                baseData: {},
                routeName: this.$route.name
            }
        },
        watch: {
            stageAdd(val) {
                this.visible = val.visible
                this.baseData = val
                this.isCreated = 1
            },
            stageEdit(val) {
                this.visible = val.visible
                this.form.name = val.name
                this.baseData = val
                this.isCreated = 0
            }

        },

        created() {

        },
        methods: {
            //关闭阶段弹窗，重置
            closeStageDialog() {
                this.form = {
                    name: ''
                }
            },

            //提交阶段的新增或编辑
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {return false}
                    if (this.isCreated === 1) {
                        //传案件id(int)
                        this.form.cid = this.baseData.caseId
                    }
                    this.$fetch.api_stage.save(this.form, this.baseData.stageId)
                        .then(({
                                   msg
                               }) => {
                            this.visible = false
                            this.$emit('stageRefresh', {isFresh: true,})
                        })
                })
            }

        },
    }
</script>
