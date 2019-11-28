<template>
    <div class="newsong" @touchmove="check">
        <div class="isget">
            <mt-spinner :type="3" v-show="!isGet" :size="40"></mt-spinner>
        </div>
        <h3>
            {{msg}}
        </h3>
        <common-album :list="list"
            @loadMore="loadMore"
            isLoading="isLoading"
            @changeRoute="changeRoute"></common-album>
        <div class="totop" v-show="show" 
            @click="top">
            top
        </div>
    </div>
</template>
<script>
    import {getWidth, changeArray, toTop, getData} from '@/common/tools.js'
    import CommonAlbum from '@/common/commonAlbum'
    export default {
        name: "NewSong",
        components: {
            CommonAlbum,
        },
        data() {
            return {
                msg:"新碟推荐",
                bgUrl:'https://s2.music.126.net/style/web2/img/coverall.png?bca201cf9dee3749e8dd00063d8db267',
                list: [],
                liWidth:115,
                allLoaded:false,
                isLoading: false,
                offset: 1,
                limit:20,
                toTopSpeed: 100,
                show: false,
                isGet: false
            }
        },
        created() {
            this.loadMore();
        },
        methods: {
            changeRoute(arg) {
                this.$router.push({name: 'NewSongTwo', params: {id: arg}});
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
            loadMore() {
                // this.$refs.loadmore.onBottomLoaded();
                this.isLoading = true;
                /**
                 * img name author
                 */
                const url = `${this.$store.state.baseUrl._url}/top/album?offset=${this.offset}&limit=${this.limit}`;
                getData(this, url, res => {
                    const length = this.list.length;
                    res.data.albums.map((value, index) => {
                        this.list[index + length] = {};
                        this.list[index + length].img = value.blurPicUrl;  //picUrl
                        this.list[index + length].name = value.name;
                        this.list[index + length].author = value.artists.trans;
                        this.list[index + length].id = value.id;
                    });
                    changeArray(this.list);
                    this.isLoading = false;
                    this.offset ++;
                    this.isGet = true;
                }, err => {
                    this.$toast({
                        message: '没有更多了',
                        position: 'middle',
                        duration: 2000
                    });
                });
            }
        }
    }
</script>
<style scope>
    .newsong{
        background-color:lightgoldenrodyellow;
        width:100%;
        overflow:hidden;
        margin-top:1rem;
        padding:0 .2rem;
        box-sizing:border-box;
    }
    .newsong .isget{
        position:absolute;
        left:50%;
        top:150px;
        margin-left:-20px;
    }
    .newsong h3{
        width:100%;
        text-indent:5px;
        font-size:.4rem;
        line-height:.5rem;
        border-bottom:0.06rem solid red;
        margin-bottom:.5rem;

    }
    .newsong .list-content{
        width:100%;
        display:flex;
        flex-wrap:wrap;
        justify-content:space-evenly;
    }
    .newsong .list-content li{
        width:115px;
        height:130px;
        float:left;
        margin-bottom:10px;
    }
    .newsong .list-content li a{
        width:100%;
        height:100%;
        display:block;
    }
    .newsong .list-content li a .pic{
        width:100%;
        height:100px;
        background-position:0 -570px;
    }
    .newsong .list-content li a .pic img{
        width:100x;
        height:100%;
        margin:0;
    }
    .newsong .list-content li a .detail{
        width:100%;
        height:30px;
        padding-left:5px;
        box-sizing:border-box;
    }
    .newsong .list-content li a .detail p{
        text-overflow:ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .newsong .list-content li a .detail p:nth-of-type(1){
        color:black;
        font-size:.2rem;
        line-height:14px;
    }
    .newsong .list-content li a .detail p:nth-of-type(2){
        color:gray;
        font-size:.18rem;
        line-height:14px;
    }
    .loading{
        position:relative;
        left:0;
        bottom:1rem;
        margin-bottom:1rem;
    }
    .icon{
        position:absolute;
        left:50%;
        margin-left:-14px;
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