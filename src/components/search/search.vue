<template>
    <div class="search" @touchmove="check">
        <div class="search-input">
            <mt-search v-model="value"
                cancel-text="取消"
                placeholder="搜索"
                class="search-content">
                {{value}}
            </mt-search>
        </div>
        <div class="hot" v-show="!isSearch">
            <ul class="hot-content">
                <li v-for="value, index in hotList"
                    :key='index'
                    @click="search(value)">
                    <a href="javascript:;">{{value}}</a>
                </li>
            </ul>
        </div>
        <div v-show="complete" class="result">
            <search-list :list="resultList" 
                @loadBottom="loadBottom"
                @changeRoute="changeRoute"
                :isLoading="isLoading"></search-list>
        </div>
        <div class="totop" v-show="show" 
            @click="toTop">
            top
        </div>
    </div>
</template>
<script>
    import {getData, changeArray, isSpace} from '@/common/tools.js'
    import SearchList from '@/common/searchList'
    export default {
        name: "Search",
        components: {
            SearchList,
        },
        data() {
            return {
                value: "",     
                hotList: [], //热搜;
                isSearch: false, 
                complete: true,  //是否完成搜索;
                resultList: [],  //结果列表;
                limit:20,    //请求限制;
                offset:1,    //请求page;
                show: false,     //是否显示置顶按钮;
                isLoading:false, //是否为无限滚动;
                keyword:"",   //搜索关键字
            }
        },
        watch: {
            'value'(newV, oldV) {
                this.offset = 1;
                this.resultList = [];
                this.keyword = newV;
                if(newV == "") {
                    this.isSearch = false;
                    return;
                }else {
                    this.isSearch = true;
                    this.sGetData();
                }
            }
        },
        created() {
            const url = `${this.$store.state.baseUrl._url}/search/hot`;
            getData(this, url, (res) => {
                res.data.result.hots.map((value, index) => {
                    this.hotList[index] = value.first;
                });
                changeArray(this.hotList);
            }, err => { 
                this.$toast({
                    message: '没有更多了',
                    position: 'middle',
                    duration: 2000
                });
            });
        },
        methods: {
            search(hotVal) {
                this.value = hotVal;
            },
            sGetData() {
                if(!isSpace(this.keyword)) {
                    this.isLoading = true;
                    const url = `${this.$store.state.baseUrl._url}/search?keywords=${this.keyword}&offset=${this.offset}&limit=${this.limit}`;
                    getData(this, url, (res) => {
                        if(!res.data.result.songs) {
                            this.$toast({
                                message: '已经是全部结果了',
                                position: 'middle',
                                duration: 2000
                            });
                            return;
                        }else {
                            var data = res.data.result.songs;
                            const length = this.resultList.length;
                            res.data.result.songs.map((value, index) => {
                                this.resultList[index + length] = {};
                                this.resultList[index + length].name = value.album.name;
                                this.resultList[index + length].author = value.artists[0].name;
                                this.resultList[index + length].list = value.name;
                                this.resultList[index + length].id = value.id;
                            });
                            changeArray(this.resultList);
                            this.isLoading = false;
                        }
                    }, err => { 
                        this.$toast({
                            message: '没有更多了',
                            position: 'middle',
                            duration: 2000
                        });
                    });
                }
            },
            check(e) {
                if(document.documentElement.scrollTop != 0) {
                    this.show = true;
                }else {
                    this.show = false;
                }
            },
            loadBottom() {
                if(this.value != "") {
                    this.offset ++;
                    this.sGetData();
                }
            },
            toTop() {
                var scrollTop = document.documentElement.scrollTop;
                var timer = setInterval(() => {
                    if(document.documentElement.scrollTop > 0) {
                        scrollTop -= this.toTopSpeed;
                        document.documentElement.scrollTo(0, scrollTop);
                    }else {
                        clearInterval(timer);
                        this.show = false;
                        document.documentElement.scrollTo(0, 0);
                    }
                }, 1000 / 60);
            },
            changeRoute(arg) {
                this.$router.push({name: 'Player', params: {id: this.resultList[arg].id}});
            }
        },
    }
</script>
<style scope>
    .search{
        padding-top:1rem;
    }
    .search .search-input{
        width:100%;
        position:fixed;
        top:1rem;
        left:0;
    }
    .mint-search{
        height:1rem;
    }
    .mint-search-list{
        height:0;
    }
    .search .hot{
        width:100%;
        height:2.5rem;
        margin-top:1.5rem;
        position:absolute;
        left:0;
        top:1rem;
    }
    .search .hot .hot-content{
        width:100%;
    }
    .search .hot .hot-content li{
        float:left;
        margin-left:.2rem;
        margin-bottom:.18rem;
    }
    .search .hot .hot-content li a{
        display:inline-block;
        padding:3px 5px;
        border-radius:10px;
        border:1px solid gainsboro;
    }
    .search .result{
        width:7.5rem;
        margin-top:1rem;
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