<template>
    <el-dialog title='加入律所' :visible.sync="dialogFormVisible" class="dialog-320">
        <el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm"    label-width="80px" label-position="left">
            <el-form-item label="律所代码" prop="code">
                <el-input v-model="dialogForm.code" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="" v-loading="loading">
                <el-button type="primary" @click="joinLawfirm('dialogForm')" >确 定</el-button>
                <el-button @click="dialogFormVisible = false"  plain>取 消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>

    export default {
        props: ['data'],
        data() {
            return {
                dialogForm: {
                    code: '',
                },
                dialogRules:{
                    code: [
                        { required: true, message: '必填项', trigger: 'change' }
                    ]
                },
                dialogFormVisible:false,
                loading:false,
                join_type:'',
            }
        },
        watch: {
            data(val) {
                this.dialogFormVisible = true
                this.join_type = val.join_type
            },
        },
        created() {

        },

        methods: {
            joinLawfirm(formName){
                this.$refs[formName].validate((valid) => {
                    if (!valid) return false
                    this.loading = true
                    this.$fetch.api_firm.join(
                        {
                            join_type:this.join_type,
                            firm_code: this.dialogForm.code
                        }
                    )
                        .then(({
                                   msg,
                                   data
                               }) => {
                            this.loading = false
                            this.$emit('refreshData',true)
                            this.dialogFormVisible = false
                        })
                        .catch(({
                                    code,
                                    msg
                                }) => {
                            this.loading = false
                        })
                })
            },

        }

    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" >
    .dialog-320{
        .el-dialog{
            width: 320px;
        }
    }

</style>
