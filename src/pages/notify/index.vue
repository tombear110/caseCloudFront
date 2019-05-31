<template>
<div class="document">
    <div class="left">
        <div class="tab-component">
            <ul class="tab-list">
                <li class="tab-item tab-active" v-for="(item,index) in leftInfoTab" :key="index">
                    {{item.text}}
                </li>
            </ul>
        </div>
        <router-view name="notifyFaq"></router-view>
    </div>
    <div class="right">
        <div class="tab-component">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===item.value}" v-for="(item,index) in rightInfoTab" @click="tabChange(item)" :key="index">
                    {{item.text}}
                </li>
            </ul>
        </div>
        <router-view v-if="tabActive===1" :type="tabActive"></router-view>
        <router-view v-else name="notifyLog" :type="tabActive"></router-view>
    </div>
</div>
</template>

<script>
import {
    myTab
} from 'components'

export default {
    components: {
        myTab
    },
    data() {
        return {
            tabActive: 1,
            rightInfoTab: [{
                text: '帮助文档',
                value: 1
            }, {
                text: '更新日志',
                value: 2
            }, ],
            leftInfoTab: [{
                text: '常见问题',
                value: 1
            }, ]
        }
    },
    created() {

    },
    methods: {
        tabChange(item) {
            this.tabActive = item.value
        }
    }
}
</script>
