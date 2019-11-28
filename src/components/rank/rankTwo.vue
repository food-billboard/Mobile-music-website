<template>
    <div class="ranktwo"
     @touchstart="drag"
     ref='content'>
        <div class="isget">
            <mt-spinner :type="3" v-show="!isGet" :size="40"></mt-spinner>
        </div>
        <div class="head" ref="head">
            <rank-head :list="titleList" 
                :title="headTitle"
                :isAdd='isAdd'
                @getComment='getComment'
                @addList='addList'></rank-head>
        </div>
        <div class="main">
            <common-list :list="detailList"
                @getUrl="changeRoute"></common-list>
        </div>
    </div>
</template>
<script>
    import {getData, changeArray, toPlayer} from '@/common/tools.js'
    import CommonList from '@/common/commonList'
    import RankHead from '@/components/rank/rankHead'
    export default {
        name: "RecommentTwo",
        components: {
            CommonList,
            RankHead,
        },
        created() {
            const url = `${this.$store.state.baseUrl._url}/top/list?idx=${this.$route.params.index}`;
            getData(this, url, res => {
                this.titleList[0].img = res.data.playlist.coverImgUrl;
                this.titleList[0].name = res.data.playlist.name;
                this.titleList[0].playcount = res.data.playlist.playCount;
                this.titleList[0].updateTime = res.data.playlist.updateTime;
                this.titleList[0].id = res.data.playlist.id;
                this.titleList[0].adType = res.data.playlist.adType;
                if(res.data.playlist.adType != 0) {
                    this.isAdd = true;
                }
                res.data.playlist.tracks.map((value, index) => {
                    this.detailList[index] = {};
                    this.detailList[index].name = value.name;
                    this.detailList[index].singer = value.ar[0].name;
                    this.detailList[index].time = value.dt;
                    this.detailList[index].id = res.data.privileges[index].id;
                });
                changeArray(this.detailList);
                changeArray(this.titleList);
                this.isGet = true;
            }, err => {
                this.$toast({
                    message: "出错了",
                    position: 'middle',
                    duration: 2000   
                });
            });
        },
        data() {
            return {
                detailList: [],
                titleList: [{}],
                headTitle:"排行榜",
                speed: 20,
                isGet: false,
                isAdd:false
            }
        },
        methods: {
            addList() {     //歌单收藏;
                if(this.$store.state.isLogin) {
                    var t = 0;
                    if(!this.isAdd) {
                        t = 1;
                    }
                    const url = `${this.$store.state.baseUrl._url}/playlist/subscribe?t=${t}&id=${this.titleList[0].id}`;
                    getData(this, {url, withCredentials: true}, res => {
                        this.isAdd = !this.isAdd;
                    }, err => {
                        this.$toast({
                            message: '出错了咯',
                            position:'middle',
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
            getComment() {      //评论展示;
                this.$router.push({name: 'Comment', params: {id: this.titleList[0].id, name: 'playlist'}});
            },
            changeRoute(arg) {      //路由跳转;
                toPlayer(arg, this);
            },
            drag(e) {       //头部拖拽;
                var prevLeft = e.changedTouches[0].clientY,
                    nowLeft = 0,
                    _x = 0,
                    prevX = 0,
                    isClick = true,
                    height = this.$refs.head.offsetHeight,
                    that = this,
                    isMove = false,
                    first = true;
                    if(document.documentElement.scrollTop > 0) {
                        isMove = true;
                    }
                document.ontouchmove = function(e) {
                    isClick = false;
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
            }
        }
    }
</script>
<style scope>
    .ranktwo{
        margin-top:1rem;
        height:12.34rem;
    }
    .ranktwo .isget{
        position:absolute;
        left:50%;
        top:150px;
        margin-left:-20px;
    }
</style>