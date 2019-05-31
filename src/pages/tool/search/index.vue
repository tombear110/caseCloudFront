<template>
    <div class="tool-search " @keyup.enter="tabSearch">
        <div class="tab-component">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===index}"
                    v-for="(item,index) in infoTab"
                    :key="item.text">
                    {{item.text}}
                </li>
            </ul>
        </div>
        <div class="search-select">
            <el-input :placeholder="searchTypeHolder" v-model="keyword" class="select">
                <el-select v-model="searchType" slot="prepend" @change="changeSearchType" style="width: 110px">
                    <el-option label="无讼法规" :value="0"></el-option>
                    <el-option label="无讼案例" :value="1"></el-option>
                    <el-option label="企业征信" :value="2"></el-option>
                    <el-option label="公开信息" :value="3"></el-option>
                </el-select>
            </el-input>
            <el-button type="primary" @click="tabSearch">查询</el-button>
        </div>
        <div class="content-links" v-for="(list,index) in linkList" :key="list.title">
            <h3>{{list.title}}</h3>
            <ul class="link-list">
                <li v-for="(item,index) in list.list" :key="item.text" >
                    <i class="iconfont" :class="item.icon" @click="goLink(list.title,index)"></i>
                    <span @click="goLink(list.title,index)">{{item.text}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { myTab } from 'components'
    export default {
        components: { myTab },
        data() {
            return {

                input3: '',
                input4: '',
                input5: '',
                select: '',

                infoTab: [
                    {
                        text: '法规案例'
                    }
                ],
                tabActive: 0,
                searchText:'',
                searchType:0,
                searchTypeHolder:'请输入法规关键词',
                keyword: '',
                searchPlaceholder: '请输入法规关键词',
                linkList: [
                    {
                        title: '费用计算',
                        list: [
                            {
                                icon: 'icon-xuanzelvshi' + ' ' + 'bg-00A3C0',
                                text: '律师费',
                            },
                            {
                                icon: 'icon-sifa' + ' ' + 'bg-617EFB',
                                text: '诉讼费',
                            },
                            {
                                icon: 'icon-jiaotong' + ' ' + 'bg-9A78F1',
                                text: '交通赔偿',
                            },
                            {
                                icon: 'icon-days' + ' ' + 'bg-08BE78',
                                text: '天数计算',
                            },
                            {
                                icon: 'icon-sifajiandingsuo' + ' ' + 'bg-FB6161',
                                text: '司法鉴定',
                            },
                            {
                                icon: 'icon-gongzhengchu' + ' ' + 'bg-FFB83C',
                                text: '公证费',
                            },
                        ],
                    }, {
                        title: '法院直达',
                        list: [
                            {
                                icon: 'icon-shixin' + ' ' + 'bg-87C932',
                                text: '失信被执行人',
                            },
                            {
                                icon: 'icon-fayuan-copy' + ' ' + 'bg-E4C445',
                                text: '最高院',
                            },
                            {
                                icon: 'icon-oriental-pearl-tower' + ' ' + 'bg-28AEF2',
                                text: '上海高院',
                            },
                            {
                                icon: 'icon-niaochao2' + ' ' + 'bg-738CFB',
                                text: '北京高院',
                            },
                            {
                                icon: 'icon-wenshu' + ' ' + 'bg-4E4848',
                                text: '裁判文书网',
                            },
                            {
                                icon: 'icon-falvshengming' + ' ' + 'bg-1B65B0',
                                text: '北大法宝',
                            },
                        ],
                    },
                ],

            }
        },

        methods: {
            //弹出窗口居中显示
            openWin(url, name, iWidth, iHeight) {
                //获得窗口的垂直位置
                let iTop = (window.screen.availHeight - 30 - iHeight) / 2;
                //获得窗口的水平位置
                let iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
                window.open(url, name, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no');
            },
            changeSearchType(val){
                console.log('this.searchType',this.searchType)
                //切换即清空关键词
                this.keyword = ''
//                console.log('searchType---',this.searchType)
                const placeholderArr = ['法规','案例','征信','信息']
                this.searchTypeHolder = `请输入${placeholderArr[val]}关键词`
            },
            tabSearch() {
                let keyword = this.keyword
                if(!keyword){
                    this.$message.error('请输入关键词');
                    return false
                }
                switch (this.searchType) {
                    case 0:
                        window.open('https://www.itslaw.com/search/lawsAndRegulations?searchMode=lawsAndRegulations&sortType=5&conditions=searchWord%2B' + keyword + '%2B1%2B' + keyword);
                        break;
                    case 1:
                        window.open('https://www.itslaw.com/search?searchMode=judgements&sortType=1&conditions=searchWord%2B' + keyword + '%2B1%2B' + keyword + '&searchView=text');
                        break;
                    case 2:
                        window.open('http://www.qichacha.com/search?key=' + keyword);
                        break;
                    case 3:
                        window.open('https://www.baidu.com/s?tn=99006304_1_oem_dg&isource=infinity&wd=' + keyword)
                        break;
                }
            },
            goLink(title, index) {
                if (title === '费用计算') {
                    switch (index) {
                        case 0:
                            this.openWin('http://tool.faniuwenda.com/legalfee.html', '律师费', 375, 667)
                            break;
                        case 1:
                            this.openWin('http://tool.faniuwenda.com/litigation.html', '诉讼费', 375, 667)
                            break;
                        case 2:
                            this.openWin('http://tool.faniuwenda.com/traffic.html', '交通赔偿', 375, 667)
                            break;
                        case 3:
                            this.openWin('http://tool.faniuwenda.com/daycalculate.html', '天数计算', 375, 667)
                            break;
                        case 4:
                            this.openWin('http://tool.faniuwenda.com/attorneys.html', '司法鉴定', 375, 667)
                            break;
                        case 5:
                            this.openWin('http://tool.faniuwenda.com/notarial.html', '公证费', 375, 667)
                            break;
                    }
                } else {
                    switch (index) {
                        case 0:
                            window.open('http://shixin.court.gov.cn/');
                            break;
                        case 1:
                            window.open('http://www.court.gov.cn/');
                            break;
                        case 2:
                            window.open('http://www.hshfy.sh.cn/shfy/gweb2017/index.html');
                            break;
                        case 3:
                            window.open('http://www.bjcourt.gov.cn/ ');
                            break;
                        case 4:
                            window.open('http://wenshu.court.gov.cn/ ');
                            break;
                        case 5:
                            window.open('http://oa.lawyers.org.cn/hall/ ');
                            break;
                    }
                }
                return false
            },
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

</style>
