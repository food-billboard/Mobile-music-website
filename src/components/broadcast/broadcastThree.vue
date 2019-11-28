<template>
    <div class="broadthree">
        <div class="isget">
            <mt-spinner :type="3" v-show="!isGet" :size="40"></mt-spinner>
        </div>
        <div class="head">
            <rank-head :list="titleList"
                :listNeed='false'
                :commentNeed='false'
                :isNeedCount='false'>   
            </rank-head>
        </div>
        <div class="main">
            <common-list :list="detailList"
                @getUrl="changeRoute"
                :isNeedAdd='false'
                :isNeedPlay="true"
                :isNeedSinger='false'
                :isNeedCount='true'>
            </common-list>
        </div>
    </div>
</template>
<script>
    import CommonList from '@/common/commonList'
    import RankHead from '@/components/rank/rankHead'
    import {getData, changeArray, toPlayer} from '@/common/tools.js'
    export default {
        name: "BroadcastThree",
        components: {
            CommonList,
            RankHead,
        },
        created() {
            const url = `${this.$store.state.baseUrl._url}/dj/program?rid=${this.$route.params.id}&limit=40`;
                getData(this, url, res => {
                    this.titleList[0].img = res.data.programs[0].coverUrl;
                    this.titleList[0].title = res.data.programs[0].channels[0];
                    this.titleList[0].updateTime = res.data.programs[0].createTime;
                    this.titleList[0].id = this.$route.params.id;
                    this.titleList[0].name = res.data.programs[0].radio['name'];
                    res.data.programs.map((value, index) => {
                        this.detailList[index] = {};
                        this.detailList[index].time = value.createTime;
                        this.detailList[index].id = value.id;
                        this.detailList[index].name = value.name;
                        this.detailList[index].playcount = value.listenerCount;
                        this.detailList[index].desc = value.radio.desc;
                    });
                    changeArray(this.detailList);
                    changeArray(this.titleList);
                    this.isGet = true;
                }, err => {
                    this.$toast({
                        message: '没有更多了',
                        position: 'middle',
                        duration: 2000
                    });
                });
        },
        data() {
            return {
                detailList: [],
                titleList:[{}],
                headTitle: "电台详情",
                isGet: false
            }
        },
        methods: {
            changeRoute(arg) {
                console.log('路由跳转, 现在播放不了');
            },
        }
    }
</script>
<style scope>
    .broadthree{
        margin-top:1rem;
    }
    .broadthree .isget{
        position:absolute;
        left:50%;
        top:150px;
        margin-left:-20px;
    }
</style>