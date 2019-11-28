<template>
    <div class="singer"
        :style="{width:singerGetWidth / 50 + 'rem', height: singerGetHeight / 50 + 'rem'}">
        <div class="isget">
            <mt-spinner :type="3" v-show="!isGet" :size="40"></mt-spinner>
        </div>
        <div class="main"
            @touchstart="loading">
            <ball :listCount="singerCount" 
                :list="singerList"
                :control="isMore"
                @singerChange="singerChange"
                @completed="completed"></ball>
        </div>
        <div class="point" 
            @click="top"
            :style="{opacity: 'opacity'}"
            >
            <span class="text1">{{msg[0]}}</span>
            <mt-spinner type="double-bounce" color="#87CEFA" :size="20" class="icon"></mt-spinner>
            <span class="text2">{{msg[1]}}</span>
        </div>
        <div class="more" 
            v-show="!isMore"
            :style="{top: moreHeight / 50 + 'rem'}">
            <more :complete="detailLoading"
                @getSinger="getSinger"></more>
        </div>
    </div>
</template>
<script>
    import Ball from '@/common/ball'
    import  More from './more'
    import {getHeight, getWidth} from '@/common/tools.js'
    export default {
        name: "Singer",
        components: {
            Ball,
            More
        },
        data() {
            return {
                singerCount: 8,
                singerList: [],
                isMore: true,
                control: true,
                complete: true,
                speed: 35,
                toTopSpeed: 100,
                moreHeight: getHeight(),
                offset: 1,
                limit:20,
                list: [],
                opacity:0.8,
                allComplete: true,
                msg: ["下拉加", "载全部"],
                detailLoading: false,
                isGet: false
            }
        },
        beforeRouteLeave(to, from, next) {
            this.isMore = false;
            var timer = setTimeout(() => {
                next();
                timer = null;
            }, 0);
        },
        created() {
            this.$axios(`${this.$store.state.baseUrl._url}/top/artists?offset=${this.offset}&limit=${this.limit}`).
            then(res => {
                let arr = {};
                res.data.artists.slice(0, this.singerCount).map((value, index) => {
                    arr = {};
                    arr['img'] = value['picUrl'];
                    arr['singer'] = value['name'];
                    arr['id'] = value['id'];
                    this.singerList.push(arr);
                });
                this.isGet = true;
            }).
            catch(err => {
                this.$toast({
                    message: '没有更多了',
                    position: 'middle',
                    duration: 2000
                });
            });
        },
        methods: {
            completed(arg) {
                this.complete = arg;
            },
            loading(e) {    //显示全部歌手;
                var that = this;
                if(that.complete && e.changedTouches[0].pageY >= e.target.offsetHeight * 0.8 && e.target.nodeName.toLowerCase() == "ul") {
                    that.complete = false;
                    that.opacity = 0;
                    var prevTop = e.changedTouches[0].pageY,
                        nowTop = 0,
                        areaY = 0,
                        moveY = prevTop,
                        height = getHeight();
                    document.ontouchmove = function(e) {
                        nowTop = e.changedTouches[0].pageY;
                        areaY = Math.abs(nowTop - moveY);
                        moveY = nowTop;
                        if(nowTop < prevTop) {
                            //显示全部歌手信息;
                            //动画更新;
                            that.isMore = false;
                            that.control = false;
                        }
                    }
                    document.ontouchend = function(e) {
                        document.ontouchmove = false;
                        document.ontouchend = false;
                        if(e.changedTouches[0].pageY - prevTop >= 2) {
                            that.isMore = true;
                            that.control = true;
                            that.complete = true;
                            return;
                        }
                        var nowScroll = document.documentElement.scrollTop;
                        var timer = setInterval(() => {
                            if(nowScroll > 0) {
                                nowScroll --;
                            }
                            if(that.moreHeight > 0) {
                                that.moreHeight -= that.speed;                                
                            }else {
                                that.moreHeight = 0;
                                that.complete = true;
                                that.msg = ["回到", "顶部"];
                                that.opacity = .8;
                                that.detailLoading = true;
                                clearInterval(timer);
                            }
                        }, 1000 / 60);
                    }
                }
            },
            top(e) {   //回到顶部;
                var that = this;
                if(this.complete && this.allComplete) {
                    that.allComplete = false;
                    that.opacity = 0;
                    this.complete = false;
                    var nowScroll = document.documentElement.scrollTop;
                    if(!this.isMore) {
                        var height = getHeight();
                        var timer = setInterval(() => {
                            if(nowScroll > 0) {
                                nowScroll --;
                            }
                            if(that.moreHeight < height) {
                                that.moreHeight += that.speed;
                            }else {
                                that.moreHeight = height;
                                that.isMore = true;
                                that.control = true;
                                that.allComplete = true;
                                that.msg = ["下拉加", "载全部"];
                                that.opacity = .8;
                                clearInterval(timer);
                            }
                        }, 1000 / 60);
                    }else {
                        that.isMore = false;
                        var height = getHeight();
                        var timer = setInterval(() => {
                            if(nowScroll > 0) {
                                nowScroll --;
                            }
                            if(that.moreHeight > 0) {
                                that.moreHeight -= that.speed;
                            }else {
                                that.moreHeight = 0;
                                that.isMore = false;
                                that.allComplete = true;
                                that.control = false;
                                that.msg = ["回到", "顶部"];
                                that.detailLoading = true;
                                that.opacity = .8;
                                clearInterval(timer);
                            }
                        }, 1000 / 60);
                    }
                }
            },
            getSinger(arg) {
                this.$store.commit("setPrevRoute", false);
                this.$router.push({name: "SingerList", params: {id: arg}});
            },
            singerChange(arg) {    //歌手界面跳转;
                this.$store.commit("setPrevRoute", false);
                this.$router.push({name: "SingerList", params: {id: this.singerList[arg]['id']}});
            }
        },
        computed: {
            singerGetWidth() {
                return getWidth();
            },
            singerGetHeight() {
                return getHeight();
            }
        }
    }
</script>
<style scope>
    .singer{
        background-color:lightgoldenrodyellow;
    }
    .singer .isget{
        position:absolute;
        left:50%;
        top:150px;
        margin-left:-20px;
    }
    .singer .main{
        width:100%;
        height:100%;
    }
    .singer .point{
        position:fixed;
        width:2rem;
        height:0.4rem;
        margin-left:-1rem;
        left:50%;
        bottom:1.4rem;
        transition:1s;
        z-index:4;
        overflow:hidden;
    }
    .singer .point span.text1,
    .singer .point span.text2{
        line-height:0.4rem;
        animation:filterChange infinite linear 2s;
    }
    @keyframes filterChange{
        0% {opacity:1}
        25% {opacity:0.5}
        50% {opacity:0}
        75% {opacity:0.5}
        100% {opacity:1}
    }
    .singer .point span.text1{
        float:left;
    }
    .singer .point span.text2{
        float:right;
    }
    .singer .point .icon{
        position:absolute;
        margin-left:-10px;
        left:50%;
        top:0;
    }
    .singer .more{
        width:100%;
        position:absolute;
        left:0;
        z-index:3;
    }
</style>