<template>
    <div class="rank">
        <div class="isget">
            <mt-spinner :type="3" v-show="!isGet" :size="40"></mt-spinner>
        </div>
        <div class="title">
            <h3>
                {{titleList[0]}}
            </h3>
            <div class="title-main">
                <ul class="title-main-content">
                    <li v-for="value, index in list.slice(0, 4)" class="li-first">
                        <router-link :to="{name: 'RankTwo', params: {index:index}}">
                            <p class="pic">
                                <img :src="value['img']" width=100% height="100%" />
                            </p>
                            <div class="list">
                                <ul class="list-content">
                                    <li v-for="v, i in value['song']">
                                        {{i + 1}}.{{v['name']}}-{{v['author']}}
                                    </li>
                                </ul>
                            </div>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
        <div class="main">
            <h3>
                {{titleList[1]}}
            </h3>
            <div class="main-content">
                <ul class="main-content-box">
                    <li class="main-content-box-child" v-for="value, index in list.slice(4)">
                        <router-link :to="{name: 'RankTwo', params: {index: index + 4}}">
                            <p class="main-content-box-child-pic">
                                <img :src="value['img']" width=100% height="100%" />
                                <span>{{value['time'] | ago}}更新</span>
                            </p>
                            <div class="title">
                                {{value['name']}}
                            </div>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import {changeArray, getData} from '@/common/tools.js'
    export default {
        name: "Rank",
        created() {
            const url = `${this.$store.state.baseUrl._url}/toplist/detail`;
            getData(this, url, res => {
                var list = res.data.list;
                list.map((value, index) => {
                    this.list[index] = {};
                    this.list[index].song = [];
                    if(index < 4) {
                        value.tracks.map((v, i) => {
                            this.list[index].song[i] = {};
                            this.list[index].song[i].author = v['second'];
                            this.list[index].song[i].name = v['first'];
                        });
                    }
                    this.list[index].img = value.coverImgUrl;
                    this.list[index].time = value.updateTime;
                    this.list[index].name = value.name;
                });
                changeArray(this.list);
                this.isGet = true;
            }, err => {
                this.$toast({
                    message: '没有更多了',
                    position:'middle',
                    duration:2000
                });
            });
            /*
                云音乐官方榜
                飙升，新歌，原创，热歌
                全球榜
                说唱榜，古典音乐榜，电音榜，抖音，新歌，ACG，韩语，国电榜，英国杂志，电竞，UK，美国
            */
            
        },
        data() {
            return {
                listCount: 24,
                titleList: ["音乐官方榜", "全球榜"],
                showCount: 3,
                list: [],
                isGet: false,
            }
        }
    }
</script>
<style scope>
    .rank{
        background-color:lightgoldenrodyellow;
        margin-top:1rem;
        padding:0 .2rem;
        padding-bottom:2rem;
        box-sizing:border-box;
    }
    .rank .isget{
        position:absolute;
        left:50%;
        top:150px;
        margin-left:-20px;
    }
    .rank .title{

    }
    h3{
        font-size:0.3rem;
        line-height:0.6rem;
    }
    .rank .title h3{
        font-size:0.4rem;
    }
    .rank .title .title-main{
        width:100%;
    }
    .rank .title .title-main ul{

    }
    .rank .title .title-main ul li{
        width:3.4rem;
        height:1.5rem;
        float:left;
        margin-bottom:0.3rem;
    }
    .rank .title .title-main ul li:nth-of-type(odd){
        margin-right:0.3rem;
    }
    .rank .title .title-main .title-main-content .li-first a{
        display:block;
        width:100%;
        height:100%;
    }
    .rank .title .title-main .title-main-content .li-first a .pic{
        width:1.5rem;
        height:100%;
        margin:0;
        float:left;
    }
    .rank .title .title-main .title-main-content .li-first a .pic img{
        margin:0;
        padding:0;
    }
    .rank .title .title-main .title-main-content .li-first a .list{
        width:1.9rem;
        height:100%;
        float:right;
    }
    .rank .title .title-main .title-main-content .li-first a .list .list-content{
        width:100%;
        height:100%;
    }
    .rank .title .title-main .title-main-content .li-first a .list .list-content li{
        width:1.9rem;
        height:33%;
        margin:0;
        line-height:0.5rem;
        text-indent:0.1rem;
        text-overflow:ellipsis;
        white-space: nowrap;
        overflow:hidden;
        color:darkgray;
    }
    .rank .main{
        
    }
    .rank .main .main-content{

    }
    .rank .main .main-content .main-content-box{
        width:100%;
    }
    .rank .main .main-content .main-content-box .main-content-box-child{
        width:1.6rem;
        height:2rem;
        max-width:100px;
        float:left;
        margin-right:0.2rem;
    } 
    .rank .main .main-content .main-content-box .main-content-box-child:nth-last-of-type(1) {
        margin-bottom:1rem;
    }
    .rank .main .main-content .main-content-box .main-content-box-child:nth-of-type(4n) {
        margin-right:0;
    }
    .rank .main .main-content .main-content-box .main-content-box-child a{
        width:100%;
        height:100%;
        display:block;
    }
    .rank .main .main-content .main-content-box .main-content-box-child a .main-content-box-child-pic{
        width:100%;
        height:1.6rem;
        position:relative;
        left:0;
        top:0;
    }
    .rank .main .main-content .main-content-box .main-content-box-child a .main-content-box-child-pic span{
        position:absolute;
        left:0;
        bottom:0;
        color:black;
        text-shadow:0 0 1px white;
        font-size:12px;
        transform:scale(0.8);
    }
    .rank .main .main-content .main-content-box .main-content-box-child a .title{
        width:100%;
        height:.4rem;
        text-align:center;
        line-height:.4rem;
    }
</style>