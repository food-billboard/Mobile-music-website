<template>
    <div class="common-comment"
        @touchend='check'>
        <div class="common-comment-head"
            @click='goList'>
            <span class='comment-back'
                @click.stop="back"><------</span>
                <p>精彩评论</p>
        </div>
        <div class="common-comment-main">
            <div class="comment-shade">
                {{loadText}}
            </div>
            <ul class="common-comment-main-content"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="isLoading"
                infinite-scroll-distance="0"
                @touchstart='loadTop'
                ref='content'
                :style="{top: contentTop + 'px'}">
                <li v-for="value, index in commentList"> 
                    <a href="javascript:;">
                        <div class='pic'>
                            <img :src="value['icon']" />
                            <p class="info">
                                <span class="info-name">{{value['name']}}</span>
                                <br/>
                                <span class="info-time">{{value['time'] | getTime}}</span>
                            </p>
                            <span class="liked"
                                @click.stop='like(index)'>点赞<strong :style="{color: value['liked'] ? 'red' : 'black'}">❤</strong></span>
                        </div>
                        <div class='comment-list-content'>
                            <div class="comment-list-main">
                                <p class="comment-list-main-detail">
                                    {{value['detail']}}
                                </p>
                                <div class="callback"
                                    v-if="value['beReplied'][0]">
                                    <span class='callback-name'>{{value['beReplied'][0]['user']['nickname']}}: </span>
                                    <p class="callback-detail">{{value['beReplied'][0].content}}</p>
                                </div>
                            </div>
                            <div class="delete"
                                v-if="isMine(index)"
                                @click.stop='deleteComment(index)'>删除</div>
                        </div>
                    </a>
                </li>
            </ul>
            <div class="comment-text">
                <input type="text" 
                    v-model="commentText" 
                    class="text-main"
                    :style="{color: commentText == '说点什么吧' ? 'gray' : 'black'}"
                    />
                <button class="submit"
                    @click='submit(0)'>发送</button>
            </div>
        </div>
        <div class='totop'
            v-show="show" 
            @click="toTop">
            top
        </div>
    </div>
</template>
<script>
    import {getData, changeArray} from '@/common/tools.js'
    export default {
        name: "CommonComment",
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        created() {
            this.loadMore();
        },
        data() {
            return {
                offset:1,
                limit:20,
                commentList: [],
                titleList:[{}],
                show:false,
                isLoading: false,
                toTopSpeed: 100,
                commentText: '说点什么吧',
                loadText: '猛力加载中...',
                contentTop: 70,
                isMore: true
            }
        },
        methods: {
            deleteComment(index) {       //删除评论;
                var commentType = 0;
                switch(this.$route.params.name) {
                    case 'music': commentType = 0;break;
                    case 'mv': commentType = 1; break;
                    case 'playlist':commentType = 2;break;
                    case 'album':commentType = 3;break;
                    case 'dj':commentType = 4; break;
                    case 'video':commentType = 5; break;
                    default:commentType = 6; break;
                }
                const url = `${this.$store.state.baseUrl._url}/comment?t=0&type=${commentType}&id=${this.$route.params.id}&commentId=${this.commentList[index].id}`;
                getData(this, {url, withCredentials: true}, res => {
                    this.offset = 1;
                    this.isMore = true;
                    this.commentList = [];
                    this.loadMore();
                }, err => {
                    this.$toast({
                        message: '出错了呢',
                        position: 'middle',
                        duration: 2000
                    });
                });
            },
            goList() {
                
            },
            submit() {  //评论发送;
                var commentType = 0;
                switch(this.$route.params.name) {
                    case 'music': commentType = 0;break;
                    case 'mv': commentType = 1; break;
                    case 'playlist':commentType = 2;break;
                    case 'album':commentType = 3;break;
                    case 'dj':commentType = 4; break;
                    case 'video':commentType = 5; break;
                    default:commentType = 6; break;
                }
                const url = `${this.$store.state.baseUrl._url}/comment?t=1&type=${commentType}&id=${this.$route.params.id}&content=${this.commentText}`;
                getData(this, {url, withCredentials: true}, res =>{
                //    var arr = {};
                //    arr.icon = res.data.comment.user['avatarUrl'];
                //     arr.user = res.data.comment.user['userId'];
                //     arr.name = res.data.comment.user.nickname;
                //     arr.detail = res.data.comment.content;
                //     arr.time = res.data.comment.time;
                //     arr.liked = false;
                //     arr.likedCount = 0;
                //     arr.beReplied =  [];
                //     arr.id =  res.data.comment.commentId;
                //     console.log(arr);
                //     console.log(this.commentList);
                //     this.commentList.unshift(arr);
                // this.offset = 1;
                // this.isMore = true;
                // this.commentList = [];
                // this.loadMore();
                this.$toast({
                    message: '评论成功，不过可能需要等一会儿才能显示',
                    position: 'middle',
                    duration: 2000
                });
                this.commentText = '说点什么吧';
                }, err =>{
                    this.$toast({
                        message: '出错了呢',
                        position: 'middle',
                        duration: 2000
                    });
                });
            },
            back() {        //回到上一路由;
                this.$router.go(-1);
            },
            like(index) {       //点赞评论;
                //评论id:
                //资源id: this.$route.params.id
                //是否取消t 0 1:
                //类型type:
                var commentType = 0,
                    t = 0;
                switch(this.$route.params.name) {
                    case 'music': commentType = 0;break;
                    case 'mv': commentType = 1; break;
                    case 'playlist':commentType = 2;break;
                    case 'album':commentType = 3;break;
                    case 'dj':commentType = 4; break;
                    case 'video':commentType = 5; break;
                    default:commentType = 6; break;
                }
                if(this.commentList[index].liked) {
                    t = 0;
                }else {
                    t = 1;
                }
                const url = `${this.$store.state.baseUrl._url}/comment/like?id=${this.$route.params.id}&cid=${this.commentList[index].id}&t=${t}&type=${commentType}`;
                getData(this, {url, withCredentials: true}, res =>{
                    this.commentList[index].liked = !this.commentList[index].liked;
                    changeArray(this.commentList);
                }, err => {
                    this.$toast({
                        message: '出错了呢',
                        position: 'middle',
                        duration: 2000
                    });
                });
            },
            loadTop(e) {
                var prevTop = e.changedTouches[0].clientY,
                    nowTop = 0,
                    _y = 0,
                    offsetTop = this.contentTop,
                    maxTop = 70,
                    loadCompleteTop = 40,
                    initText = this.loadText,
                    click = true,
                    first = true;
                document.ontouchmove = (e) => {
                    click = false;
                    if(document.documentElement.scrollTop <= 0) {
                        if(first) {
                            first = false;
                            prevTop = e.changedTouches[0].clientY;
                            offsetTop = this.contentTop;
                        }else {
                            nowTop = e.changedTouches[0].clientY;
                            _y = nowTop - prevTop + offsetTop;
                            if(_y <= 0) {
                                _y = 0
                            }
                            if(_y >= maxTop) {
                                this.loadText = '可以放手了';
                            }
                            this.contentTop = _y;
                        }
                    }
                }
                document.ontouchend = () => {
                    if(click) {
                        return;
                    }
                    document.ontouchmove = false;
                    document.ontouchend = false;
                    if(this.loadText == initText) {
                        return;
                    }else {
                        this.offset = 1;
                        this.loadText = '猛力加载中...';
                        var first = true;
                        var timer = setInterval(() => {
                            if(this.contentTop >= loadCompleteTop) {
                                this.contentTop -= 10;
                            }else if(first){
                                first = false;
                                this.contentTop = loadCompleteTop;
                                this.commentList = [];
                                this.offset = 1;
                                this.isMore = true;
                                this.loadMore();
                                clearInterval(timer);
                            }
                        }, 1000 / 60);
                    }
                }
            },
            loadMore() {        //加载更多;
                if(this.isMore) {
                    this.isLoading = true;
                    const url = `${this.$store.state.baseUrl._url}/comment/${this.$route.params.name}?id=${this.$route.params.id}&offset=${this.offset}&limit=${this.limit}&timestamp=${new Date().getTime()}`;
                    getData(this, url, res =>{
                        this.isMore = res.data.more;
                        if(!res.data.comments.length) {
                            this.isLoading = true;
                            this.$toast({
                                message: '没有更多评论了',
                                position: 'middle',
                                duration:2000
                            });
                            this.loadText = '没力气了.....';
                        }else {
                            const length = this.commentList.length;
                            res.data.comments.map((value, index) => {
                                this.commentList[index + length] = {};
                                this.commentList[index + length].icon = value.user['avatarUrl'];
                                this.commentList[index + length].user = value.user['userId'];
                                this.commentList[index + length].name = value.user.nickname;
                                this.commentList[index + length].detail = value.content;
                                this.commentList[index + length].time = value.time;
                                this.commentList[index + length].liked = value.liked;
                                this.commentList[index + length].likedCount = value.likedCount;
                                this.commentList[index + length].beReplied =  value.beReplied;
                                this.commentList[index + length].id =  value.commentId;
                            });
                            changeArray(this.commentList);
                            this.offset ++;
                            this.isLoading = false;
                            this.loadText = '加载完成了鸭';
                            var time = setInterval(() => {
                                if(this.contentTop >= 0) {
                                    this.contentTop -= 10;
                                }else {
                                    this.loadText = '猛力下拉鸭';
                                    this.contentTop = 0;
                                    clearInterval(time);
                                }
                            });
                        }
                    }, err => {
                        this.$toast({
                            message: '没有更多了',
                            position:'middle',
                            duration:2000
                        });
                    });
                }else {
                    this.$toast({
                        message: '没有更多评论了',
                        position: 'middle',
                        duration:2000
                    });
                }
            },
            check() {
                if(document.documentElement.scrollTop != 0) {
                    this.show = true;
                }else {
                    this.show = false;
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
                        document.documentElement.scrollTo(0, 0);
                        this.show = false;
                    }
                }, 1000 / 60);
            },
        },
        computed: {
            isMine() {
                return (index) =>{
                    if(this.$store.state.isLogin && this.commentList[index].user == this.$store.state.userInfo[0].id) {
                        return true;
                    }
                    return false;
                }
            }
        },
        watch: {
            'commentText'(newV, oldV) {     //控制最大输入文字数量
                if(newV.length > 30) {
                    this.$toast({
                        message: '文字到达最大数量，继续键入将不会添加',
                        position: 'middle',
                        duration: 2000
                    });
                    newV = oldV
                    this.commentText = newV;
                }
            }
        }
    }
</script>
<style scope>
    .common-comment{
        margin-top:1rem;
        width:100%;
        margin-bottom:1rem;
    }
    .common-comment .common-comment-head{
        width:100%;
        height:1rem;
        position:relative;
        left: 0;
        top:0;
        background-color:paleturquoise;
    }
    .common-comment .common-comment-head .comment-back{
        color:white;
        font-size:.45rem;
        position:absolute;
        left:0;
        top:0;
        line-height:1rem;
    }
    .common-comment .common-comment-head p{
        color:white;
        line-height:1rem;
        text-align:center;
        font-size:.3rem;
    }
    .common-comment .common-comment-head img{
        width:100%;
        height:100%;
    }
    .common-comment .common-comment-main .comment-shade{
        width:100%;
        height:10.34rem;
        color:white;
        text-align:center;
        font-size:.4rem;
        font-weight:bold;
        line-height:1rem;
        background-color:paleturquoise;
        position:absolute;
        left:0;
        top:0;
        z-index:-1;
    }
    .common-comment .common-comment-main{
        width:100%;
        position:relative;
        left:0;
        top:0;
    }
    .common-comment .common-comment-main .common-comment-main-content{
        width:100%;
        position:absolute;
        left:0;
        background-color:white;
    }
    .common-comment .common-comment-main .common-comment-main-content li{
        width:100%;
        padding-top:.2rem;
        background-color:white;
    }
    .common-comment .common-comment-main .common-comment-main-content li:nth-of-type(2n) {
        background-color:#f7f7f7;
    }
    .common-comment .common-comment-main .common-comment-main-content li a{
        display:block;
        width:100%;
        height:100%;
    }
    .common-comment .common-comment-main .common-comment-main-content li a .pic{
        width:100%;
        height:.8rem;
        overflow:hidden;
        
    }
    .common-comment .common-comment-main .common-comment-main-content li a .pic img{
        width:.8rem;
        height:.8rem;
        border-radius:50%;
        float:left;
        margin-left:.15rem;
        margin-right:.15rem;
    }
    .common-comment .common-comment-main .common-comment-main-content li a .pic .info{
        height:100%;
        float:left;
    }
    .common-comment .common-comment-main .common-comment-main-content li a .pic .info .info-name{
        color:black;
        font-size:.25rem;
        font-weight:bold;
        line-height:.4rem;
    }
    .common-comment .common-comment-main .common-comment-main-content li a .pic .info .info-time{
        color:gray;
        font-size:.24rem;
    }
    .common-comment .common-comment-main .common-comment-main-content li a .pic .liked{
        line-height:.8rem;
        padding:0 .5rem;
        font-weight:bold;
        float:right;
    }
    .common-comment .common-comment-main .common-comment-main-content li a .comment-list-content{
        width:100%;
        padding:0 .8rem;
        box-sizing:border-box;
        position:relative;
        left:0;
        top:0;
    }
    .common-comment .common-comment-main .common-comment-main-content li a .comment-list-content .comment-list-main{
        width:100%;
        border-top:1px solid gray;
    }
    .common-comment .common-comment-main .common-comment-main-content li a .comment-list-content .comment-list-main .comment-list-main-detail{
        padding-left:.3rem;
        padding-right:.55rem;
        font-size:.24rem;
        word-break: break-all;
        line-height:.5rem;
    }
    .common-comment .common-comment-main .common-comment-main-content li a .comment-list-content .comment-list-main .callback{
        width:60%;
        margin-left:.3rem;
        padding-left:.2rem;
        box-sizing:border-box;
        background:rgba(0, 0, 0, 0.2);
        border-radius:0.2rem;
    }
    .common-comment .common-comment-main .common-comment-main-content li a .comment-list-content .comment-list-main .callback .callback-name{
        font-size:.24rem;   
        line-height:.5rem; 
    }
    .common-comment .common-comment-main .common-comment-main-content li a .comment-list-content .comment-list-main .callback .callback-detail{
        font-size:.24rem;
        text-indent:.2rem;
        line-height:.5rem;
        color:darkslategrey;
    }
    .common-comment .common-comment-main .comment-text{
        width:100%;
        height:.8rem;
        background-color:lightgray;
        position:fixed;
        bottom:1rem;
        left:0;
        border-top-left-radius: .3rem;
        border-top-right-radius:.3rem;
        border-top:1px solid gray;
    }
    .common-comment .common-comment-main .comment-text .text-main{
        width:5rem;
        height:.4rem;
        border-radius:.2rem;
        margin-top:.2rem;
        margin-left:.4rem;
        padding:0 .2rem;
        box-sizing:border-box;
    }
    .common-comment .common-comment-main .comment-text .submit{
        border-radius: .2rem;
        float:right;
        margin-top:.2rem;
        margin-right:1rem;
    }
    .delete{
        position:absolute;
        right:.75rem;
        top:0;
        padding:.2rem 0 .2rem .2rem;
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