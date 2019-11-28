<template>
    <div class="singertwo"
        @touchstart="drag"
        ref="content">
        <div class="head"
            ref="head">
            <singer-head :list="titleList"
                @back='back'
                :isLike="isLike"
                @likeSinger="likeSinger"></singer-head>
        </div>
        <div class="main">
            <div class="main-tab">
                <mt-navbar v-model="selected">
                    <mt-tab-item id="1"><router-link :to='list[0]'>{{options[0]}}</router-link></mt-tab-item>
                    <mt-tab-item id="2"><router-link :to='list[1]'>{{options[1]}}</router-link></mt-tab-item>
                    <mt-tab-item id="3"><router-link :to='list[2]'>{{options[2]}}</router-link></mt-tab-item>
                </mt-navbar>
            </div>
            <router-view></router-view>
        </div>
        <div class="totop" v-show="show" 
            @click="top">
            top
        </div>
    </div>
</template>
<script>
    import SingerHead from '@/components/singer/singerHead'
    import {changeArray, getData, toTop, toPlayer} from '@/common/tools.js'
    export default {
        name: "RecommentTwo",
        components: {
            SingerHead
        },
        created() {
            this.getTitle();
            this.$router.push(this.list[0]);
            this.login = this.$store.state.isLogin;
            if(this.login) {
                const url = `${this.$store.state.baseUrl._url}/artist/sublist?timestamp=${new Date().getTime()}`;
                getData(this, {url, withCredentials: true}, res => {
                    res.data.data.map((value, index) =>{
                        if(value.id == this.$route.params.id) {
                            this.isLike = true;
                        }
                    });
                }, err => {
                    this.$toast({
                        message: '出错了呢',
                        position: 'middle',
                        duration: 2000
                    });
                });
            }
        },
        data() {
            return {
                login: false,
                titleList: [{}],
                isLike: false,
                toTopSpeed: 100,
                show:false,
                selected:'1',
                speed:20,
                selectedList:[],
                options: ["热门单曲", "专辑", "艺人介绍"],
                list:[
                    `/home/singer/${this.$route.params.id}/list`,
                    `/home/singer/${this.$route.params.id}/album`,
                    `/home/singer/${this.$route.params.id}/introduce`
                ]
            }
        },
        methods: {
            likeSinger() {      //收藏歌手;
                if(this.login) {
                    var t = 1;
                    if(this.isLike) {
                        t = 0;
                    }
                    const url = `${this.$store.state.baseUrl._url}/artist/sub?id=${this.$route.params.id}&t=${t}`;
                    getData(this, {url, withCredentials: true}, res => {
                        this.isLike = !this.isLike;
                    }, err => {
                        this.$toast({
                            message: '出错了呢',
                            position: 'middle',
                            duration: 2000
                        });
                    });
                }else {
                    this.$messageBox.confirm('', {      //前往登录;
                        title:'你还没有登录',
                        message:'是否前往登录',
                        confirmButtonText:'马上去',
                        cancelButtonText:'宁死不屈'
                    }).then(action => {     //登录;
                        this.$store.commit('setPrevRoute', true);
                        this.$router.push({name: 'Mine'});
                    }).catch(err => {       //不登录;
                        
                    });
                }
            },
            back() {        //返回;
                var content;
                if(!this.$store.state.prevRoute) {
                    content = {
                        name: "Singer"
                    }
                }else {
                    content = {
                        name: 'Login',
                        params: {id: this.$store.state.userInfo[0].id}
                    } 
                }   
                this.$router.push(content);
            },
            getTitle() {        //获取title信息;
                const url = `${this.$store.state.baseUrl._url}/artists?id=${this.$route.params.id}`;
                getData(this, url, res => {
                    this.titleList[0].img = res.data.artist.img1v1Url;
                    this.titleList[0].intr = res.data.artist.briefDesc;
                    this.titleList[0].name = res.data.artist.name;
                    changeArray(this.titleList);
                }, err =>{
                    this.$toast({
                        message: '没有更多了',
                        position: 'middle',
                        duration: 2000
                    });
                });
            },
            check(e) {      //检查是否是顶部状态;
                if(document.documentElement.scrollTop != 0) {
                    this.show = true;
                }else {
                    this.show = false;
                }
            },
            top() {     //置顶;
                toTop(this.toTopSpeed, () => {
                    this.show = false;
                });
            },
            drag(e) {       //背景拖拽;
                var prevLeft = e.changedTouches[0].clientY,
                    nowLeft = 0,
                    _x = 0,
                    prevX = 0,
                    height = this.$refs.head.offsetHeight,
                    that = this,
                    isMove = false,
                    first = true,
                    isClick = true;
                    if(document.documentElement.scrollTop > 0) {
                        isMove = true;
                    }
                document.ontouchmove = function(e) {
                    isClick = false;
                    that.check();
                    if(document.documentElement.scrollTop == 0) {
                        that.$refs.content.style.overflow = 'hidden';
                        if(isMove && first) {
                            first = false;
                            prevLeft = e.changedTouches[0].clientY;
                        }
                        nowLeft = e.changedTouches[0].clientY;
                        _x = nowLeft - prevLeft;
                        if(nowLeft < prevLeft) {
                            that.$refs.content.style.overflow = 'visible';
                        }else {
                            that.$refs.content.style.overflow = 'hidden';
                        }
                        prevX = _x;
                        that.$refs.head.style.height = _x + height + 'px';
                    }
                }
                document.ontouchend = function(e) {
                    document.ontouchmove = false;
                    if(isClick) {
                        return;
                    }
                    var count = that.$refs.head.offsetHeight;
                    var timer = setInterval(() => {
                        if(count > height) {
                            count -= that.speed;
                            that.$refs.head.style.height = count + 'px';
                        }else {
                            clearInterval(timer);
                            that.$refs.content.style.overflow = 'visible';
                            that.$refs.head.style.height = height + 'px';
                            timer = null;
                        }
                    }, 1000 / 60);
                }
            },
        }
    }
</script>
<style scope>
    .singertwo{
        margin-top:1rem;
        width:100%;
        height:12.34rem;
    }
    .singertwo .isget{
        position:absolute;
        left:50%;
        top:6rem;
        margin-left:-20px;
        z-index:99;
    }
    .singertwo .head{
        width:100%;
        height:4rem;
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