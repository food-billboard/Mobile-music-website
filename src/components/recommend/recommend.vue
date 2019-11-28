<template>
    <div class="recommend"
        @touchmove="check">
        <div class="isget">
            <mt-spinner :type="3" v-show="!isGet" :size="40"></mt-spinner>
        </div>
        <div class="nav" :style="{width: getData() / 50 + 'rem', height: getData() / 50 + 'rem'}">
            <gpolygon @changeIndex="changeIndex"
                :titleList="titleList"
                :iconList="iconList"
                :isMove="isMove"></gpolygon>
        </div>
        <div class="list">
            <list-loading :list="detailList" 
                @loadMore="loadMore"
                @changeRoute="changeRoute"></list-loading>
        </div>
        <div class="totop" v-show="show" 
            @click="top">
            top
        </div>
    </div>
</template>
<script>
    /*
        具体歌单样式和懒加载动画;
    */
    import Gpolygon from './polygon'
    import {getWidth, toTop, getData} from '@/common/tools.js'
    import ListLoading from '@/common/demandLoading'
    import NonePicList from '@/common/nonePicList'
    export default {
        name: "Recommend",
        components: {
            Gpolygon,
            ListLoading,
        },
        created() {
            for(let i = 0; i <= this.polygonCount; i ++) {
                this.iconList[i] = {};
                this.iconList[i].img = '../static/iconR-' + (i + 1) + '.png';
            }
            const url = `${this.$store.state.baseUrl._url}/playlist/catlist`;
            getData(this, url, res => {
                console.log(res);
                res.data.sub.slice(0, this.polygonCount).map((value, index) => {
                    this.titleList[index] = value.name;
                });
                this.titleList.push("全部");
                this.changeIndex("全部", 9);
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
                polygonCount:8,
                titleList: [],
                detailList: [],
                index: 9,
                catTitle: '',
                limit:20,
                toTopSpeed: 100,
                isLoading: false,
                show:false,
                isMove: true,
                iconList: [],
                isGet: false
            }
        },
        beforeRouteLeave(to, from, next) {
            this.isMove = false;
            var timer = setTimeout(() => {
                next();
            }, 0);
        },
        methods: {
            getData() {     //获取父级宽度;
                const width = getWidth();
                return width * 0.8;
            },
            loadMore() {
                this.loadingIndex(this.catTitle, this.index);
            },
            loadingIndex(arg, index) {      //按需加载;
                this.isLoading = true;
                var url  = ``;
                if(arg == "全部") {
                    url = `${this.$store.state.baseUrl._url}/top/playlist/limit=${index}`;
                }else {
                    url = `${this.$store.state.baseUrl._url}/top/playlist/?cat=${arg}&limit=${index}`;
                }
                getData(this, url, res => {
                    /*
                        coverImgUrl
                        creator nickname
                        name
                        playCount

                    */
                   if(!res.data.playlists) {
                        this.$toast({
                            message: '没有更多了',
                            position: 'middle',
                            duration: 2000
                        });
                       return;
                   }else {
                        let arr = {};
                        for(let i = this.detailList.length, len = this.detailList.length + 9; i < len; i ++) {
                            arr = {};
                            arr['img'] = res.data.playlists[i].coverImgUrl;
                            arr['author'] = res.data.playlists[i].creator.nickname;
                            arr['title'] = res.data.playlists[i].name;
                            arr['playcount'] = res.data.playlists[i].playcount;
                            arr['id'] = res.data.playlists[i].id;
                            this.detailList.push(arr);
                        }
                        this.index *= 2;
                        this.catTitle = arg;
                        this.isLoading = false;
                   }
                   this.isGet = true;
                }, err => {
                    this.$toast({
                        message: '没有更多了',
                        position: 'middle',
                        duration: 2000
                    });
                });
            },
            changeIndex(arg) {      //切换加载;
                if(this.catTitle == arg) {
                    return;
                }
                this.detailList = [];
                this.index = 9;
                this.loadingIndex(arg, this.index);
            },
            check(e) {
                if(document.documentElement.scrollTop != 0) {
                    this.show = true;
                }else {
                    this.show = false;
                }
            },
            top() {
                toTop(this.toTopSpeed, () => {
                    this.show = false;
                });
            },
            changeRoute(arg) {
                this.$router.push({name: "RecommendTwo", params: {id: this.detailList[arg]['id'], mine: false}, querys: {isMine: false}});
            }
        },
        computed: {
            
        }
    }
</script>
<style scope>
    .recommend{
        width:100%;
        height:100%;
        background-color:lightgoldenrodyellow;
        overflow:hidden;
    }
    .recommend .isget{
        position:absolute;
        left:50%;
        top:150px;
        margin-left:-20px;
    }
    .recommend .nav{ 
        position:relative;
        left:0;
        top:0;
        margin:0 auto;
        padding-bottom:1rem;
        padding-top:1rem;
    }
    .recommend .list{
        width:100%;
        padding:0 0.2rem;
        box-sizing:border-box;
    }
    .totop{
        width:.5rem;
        height:.5rem;
        background-color:gray;
        position:fixed;
        right:.3rem;
        bottom:2rem;
        text-align:center;
        line-height:.5rem;
        border-radius:3px;
        opacity:.5;
        animation:opacityChange 5s infinite;
    }
    @keyframes opacityChange{
        0% {opacity:.8;}
        50% {opacity: .6;}
        100% {opacity: .8}
    }
</style>