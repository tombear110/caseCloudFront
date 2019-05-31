<template>
    <el-dialog title="案件详情" :visible.sync="visible" width="800px">
            <div class="sidebox-content">
                <div class="title">系统字段</div>
                <div class="list">
                    <ul class="list-item">
                        <li v-for="item in system_1">
                            <span>{{item.label}}</span>
                            <span>{{item.value}}</span>
                        </li>
                    </ul>
                    <ul class="list-item">
                        <li v-for="item in system_2">
                            <span>{{item.label}}</span>
                            <span>{{item.value}}</span>
                        </li>
                    </ul>
                    <ul class="list-item">
                        <li v-for="item in system_3">
                            <span>{{item.label}}</span>
                            <span>{{item.value}}</span>
                        </li>
                    </ul>
                </div>
                <div class="title">自定义字段</div>
                <div class="list">
                    <ul class="list-item">
                        <li v-for="item in self_1">
                            <span>{{item.label}}</span>
                            <span>{{item.value}}</span>
                        </li>
                    </ul>
                    <ul class="list-item">
                        <li v-for="item in self_2">
                            <span>{{item.label}}</span>
                            <span>{{item.value}}</span>
                        </li>
                    </ul>
                    <ul class="list-item">
                        <li v-for="item in self_3">
                            <span>{{item.label}}</span>
                            <span>{{item.value}}</span>
                        </li>
                    </ul>
                </div>
            </div>
    </el-dialog>

</template>
<script>


    export default {
        props: ['batchData'],
        data() {
            return {
                visible:false,
                sideout: '',
                system_1: [],
                system_2: [],
                system_3: [],
                self_1: [],
                self_2: [],
                self_3: [],

            }
        },

        watch: {
            batchData(val) {
                this.visible = val.visible
                console.log('val-batch---',val)
//                return false
                let self_word = [],system_word = []
                self_word = val.title.slice(31, 61)
                system_word = val.title.slice(0, 31)
                console.log('self_word',self_word)
                this.self_1 = []
                this.self_2 = []
                this.self_3 = []
                this.system_1 = []
                this.system_2 = []
                this.system_3 = []
                this.sideout = val.data
                for (let i =0;i<system_word.length;i++ ) {
                    if (i < 11) {
                        this.system_1.push(
                            {
                                value: val.data[system_word[i].key],
                                label: system_word[i].title,
                            }
                        );
                    }
                    if (i > 10 && i < 21) {
                        this.system_2.push(
                            {
                                value: val.data[system_word[i].key],
                                label: system_word[i].title,
                            }
                        );
                    }
                    if (i > 20 && i < 31) {
                        this.system_3.push(
                            {
                                value: val.data[system_word[i].key],
                                label: system_word[i].title,
                            }
                        );
                    }
                }
                console.log('self_1',this.self_1)
                for (let i in self_word) {
                    if (i < 10) {
                        this.self_1.push(
                            {
                                value: val.data[self_word[i].key],
                                label: self_word[i].title,
                            }
                        )
                    }
                    if (i > 9 && i < 20) {
                        this.self_2.push(
                            {
                                value: val.data[self_word[i].key],
                                label: self_word[i].title,
                            }
                        )
                    }
                    if (i > 19 && i < 30) {
                        this.self_3.push(
                            {
                                value: val.data[self_word[i].key],
                                label: self_word[i].title,
                            }
                        )
                    }
                }
            },

        },
        methods: {
            //点击左侧栏，关闭
            closeSidebox() {
                this.sideout = 0
            },
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>



</style>


