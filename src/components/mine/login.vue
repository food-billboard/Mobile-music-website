<template>
    <div class="login"
        :style="{backgroundImage: 'url(' + info[0].back + ')'}">
        <div class="isget">
            <mt-spinner :type="3" v-show="!isGet" :size="40"></mt-spinner>
        </div>
        <p class="head">
            <span class="pic"
                :style="{backgroundImage: 'url(' + info[0].head + ')'}"></span>
            <span class="name">{{info[0].name}}</span>
            <a href="javascript:;" class="quit"
                @click='qiut'>→  退出登录</a>
        </p>
        <div class="list">
            <ul class="list-content"
                @touchstart="indexChange"
                :style="{left: contentLeft + 'px'}">
                <li v-for="value, index in loginList"
                    class="list-content-first">
                    <a href="javascript:;">
                        <h4 class="list-content-title">{{value}}</h4>
                        <div class="index-one"
                            v-if="index==0">
                            <div class="singerlist-main">
                                <singer-list
                                    :list="singerList"
                                    @singerChange="singerChange"
                                    :moveEnd='active == 0 ? moveEnd : true'
                                    :top="singerTop"
                                    @posChange="posChange"></singer-list>
                            </div>
                        </div>
                        <div class="index-two"
                            v-if="index==1">
                            <mine-list :list='songLists'
                            @changeRoute="songlistChange"
                            :top='listTop'
                            :moveEnd='active == 1 ? moveEnd : true'
                            @posChange="posChange"
                            @addList="addList"></mine-list>
                        </div>
                        <div class="index-three"
                            v-if="index==2">
                            <mine-list :list="recentLists"
                                @changeRoute="songChange"
                                :noIcon='false'
                                :top='recentTop'
                                :moveEnd='active == 2 ? moveEnd : true'
                                @posChange='posChange'
                                :addBtnNeed='false'></mine-list>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
/**
 * 头像
 * id名字
 * 最近播放
 * 歌单
 * 我喜欢的
 *  (电台)
 */
    import {getData, getWidth, changeArray} from '@/common/tools.js'
    import MineList from '@/common/mineList'
    import CommonList from '@/common/commonList'
    import SingerList from './singerlist'
    export default {
        name: "Login",
        components: {
            MineList,
            CommonList,
            SingerList
        },
        created() {
            if(!this.$store.state.isLogin) {
                this.$messageBox.alert('你还没有登录').then(action => {
                    this.$router.go(-1);
                });
                return;
            }else {
                const infoUrl = `http://localhost:3000/user/detail?uid=${this.$route.params.id}`; 
                //头像: data.profile.avatarUrl
                //背景: data.profile.backgroundUrl
                //名字: data.profile.nickname 
                const songListUrl = `http://localhost:3000/user/playlist?uid=${this.$route.params.id}&timestamp=${new Date().getTime()}`;
                //歌单: 
                //名字: data.playlist[i].name
                //作者: data.playlist[i].creator.nickname
                //图片: data.playlist[i].coverImgUrl
                //id: data.playlist[i].id
                const recentPlayUrl = `http://localhost:3000/user/record?uid=${this.$route.params.id}&type=0&timestamp=${new Date().getTime()}`;
                //最近播放;
                //歌名: data.allData[i].song.name
                //id: data.allData[i].song.song.id
                //作者: data.allData[i].song.ar[0].name
                //专辑: data.allData[i].song.album.name
                const singerUrl = `http://localhost:3000/artist/sublist?timestamp=${new Date().getTime()}`;   
                const urls = `http://localhost:3000/mv/sublist?timestamp=${new Date().getTime()}`;
                //歌手收藏;
                //歌手名:data.data[i].name
                //歌手图:data.data[0].picUrl
                //歌手id:data.data[0].id
                this.$axios({
                    url: urls,
                    widthCredentials: true
                }).then(res => {
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                });
                // getData(this, {url: singerUrl, withCredentials: true}, res => {
                //     this.getSingerList(singer);
                // }, err => {
                //     console.log(err);
                // });
                this.$axios.all([this.$axios(infoUrl), this.$axios(songListUrl), this.$axios(recentPlayUrl)
                // , this.$axios({
                //     url: singerUrl,
                //     withCredentials: true
                // })
                ]).
                    then(this.$axios.spread((info, songlist, recent, singer) => {
                        this.getInfo(info);
                        this.getSongList(songlist);
                        this.getRecent(recent);
                        // this.getSingerList(singer);
                    })).catch(err => {
                        console.log(err);
                        this.$toast({
                            message: "没有更多了",
                            position: 'middle',
                            duration: 2000
                        });
                    });
            }
        },
        data() {
            return {
                loginList: [    //界面子菜单;
                    "我喜欢的歌手",
                    "我的歌单",
                    "最近播放"
                ],
                uid: 0,     //个人id;
                active:0,   //当前子界面;
                isGet: true,    //加载动画开关;
                contentLeft:0,      //组件left值;
                singerTop: 0,   //子组件歌手的top值;
                listTop:0,      //子组件歌单top值
                recentTop:0,       //子组件最近播放top值;
                info: [{}],     //个人信息;
                singerList: [],     //歌手列表;
                songLists: [],      //歌单;
                recentLists: [],        //最近播放;
                moveEnd: true       //子组件是否完成移动;
            }
        },
        methods: {
            qiut() {    //退出登录;
                this.$store.commit('quit');
                this.$router.push({name: 'Mine'});
                this.$toast({
                    message: '你已退出登录',
                    position:'middle',
                    duration: 2000
                });
            },
            posChange(arg) {   //子组件位置更新;
                switch(this.active) {
                    case 0:
                        this.singerTop = arg;
                        break;
                    case 1:
                        this.listTop = arg;
                        break;
                    case 2:
                        this.recentTop = arg;
                        break;
                }
            },
            getInfo(res) {      //获取个人信息;
                this.info[0].head = res.data.profile.avatarUrl;
                this.info[0].back = res.data.profile.backgroundUrl;
                this.info[0].name = res.data.profile.nickname;
            },
            getSingerList(res) {       //获取收藏的歌手列表;
                res.data.data.map((value, index) => {
                    this.singerList[index] = {};
                    this.singerList[index].name = value.name; 
                    this.singerList[index].img = value.picUrl;
                    this.singerList[index].id = value.id;
                });
                changeArray(this.singerList);
            },
            getSongList(res) {      //获取歌单;
                for(let i = 0, len = res.data.playlist.length; i < len; i ++) {
                    this.songLists[i] = {};
                    this.songLists[i].name = res.data.playlist[i].name;
                    this.songLists[i].singer = res.data.playlist[i].creator.nickname;
                    this.songLists[i].img = res.data.playlist[i].coverImgUrl;
                    this.songLists[i].id = res.data.playlist[i].id;
                }
                changeArray(this.songLists);
            },
            getRecent(res) {        //获取最近播放;
                for(let i = 0, len = res.data.allData.length; i < len; i ++) {
                    this.recentLists[i] = {};
                    this.recentLists[i].name = res.data.allData[i].song.name;
                    this.recentLists[i].id = res.data.allData[i].song.id;
                    this.recentLists[i].singer = res.data.allData[i].song.ar[0].name;
                }
                changeArray(this.recentLists);
            },
            singerChange(arg) {     //歌手界面跳转;
                this.$router.push({name: "SingerList", params: {id: this.singerList[arg]['id']}});
                this.$store.commit("setPrevRoute", true);
            },
            songlistChange(arg) {       //歌单路由跳转;
                var isMine = false;
                for(let i = 0, len = this.songLists.length; i < len; i ++) {
                    if(this.songLists[i].id == arg && this.songLists[i].singer == this.info[0].name) {
                        isMine = true;
                        break;
                    }
                }
                this.$router.push({name: 'RecommendTwo', params: {id: arg, mine:true}, query:{ ismine: isMine}});
            },
            songChange(arg) {       //歌曲路由跳转;
                this.$router.push({name: 'Player', params: {id: arg}});
            },
            indexChange(e) {        //我的界面子界面转换;
                var prevLeft = e.changedTouches[0].clientX,
                    prevTop = e.changedTouches[0].clientY,
                    offsetLeft = this.contentLeft,
                    offsetTop = 0,
                    nowLeft = 0,
                    nowTop = 0,
                    _x = 0,
                    _y = 0,
                    that = this,
                    LR = false,
                    TD = false,
                    count = 0,
                    click = true;
                this.moveEnd = false;
                switch(that.active) {
                    case 0: offsetTop = this.singerTop; break;
                    case 1: offsetTop = this.listTop; break;
                    case 2:offsetTop = this.recentTop; break;
                }
                document.ontouchmove = function(e) {
                    click = false;
                    count ++;
                    if(count == 5) {
                        if(Math.abs(e.changedTouches[0].clientX - prevLeft) >= Math.abs(e.changedTouches[0].clientY - prevTop)) {   //横向移动;
                            LR = true;
                        }else {     //纵向移动;
                            TD = true;
                        }
                        count ++;
                    }else if(count > 5) {
                        if(LR) {
                            nowLeft = e.changedTouches[0].clientX;
                            _x = nowLeft - prevLeft + offsetLeft;
                            that.contentLeft = _x;
                        }else {
                            nowTop = e.changedTouches[0].clientY;
                            _y = nowTop - prevTop + offsetTop;
                            switch(that.active) {
                                case 0: that.singerTop = _y; break;
                                case 1: that.listTop = _y; break;
                                case 2: that.recentTop = _y; break;
                            }
                        }
                    }
                }
                document.ontouchend = function(e) {
                    document.ontouchmove = false;
                    document.ontouchend = false;
                    if(click) {         //点击操作;
                        that.moveEnd = true;
                        return;
                    }
                    if(LR) {        //横向移动;
                        var width = getWidth(),     //恢复正常位置;
                            goal = 0,
                            rate = 0;
                        if(that.contentLeft > - width * 0.5) {
                            goal = 0;
                            that.active = 0;
                        }else if(that.contentLeft <= -width * 0.5 && that.contentLeft > -width * 1.5) {
                            goal = - width;
                            that.active = 1;
                        }else if(that.contentLeft <= -width * 1.5) {
                            goal = - width * 2;
                            that.active = 2;
                        }
                        if(goal - that.contentLeft > 0) {
                            rate = 20;
                        }else {
                            rate = -20;
                        }
                        var timer = setInterval(() => {
                            if((rate > 0 && that.contentLeft < goal) ||(rate < 0 && that.contentLeft > goal)) {
                                that.contentLeft += rate;
                            }else {
                                clearInterval(timer);
                                that.contentLeft = goal;
                            }
                        }, 1000 / 60);
                    }else {     //纵向移动;
                        that.moveEnd = true;
                    }
                }   
            },
            addList() {     //添加歌单;
                const url = `http://localhost:3000/user/playlist?uid=${this.$route.params.id}&timestamp=${new Date().getTime()}`;
                getData(this, url, res =>{
                    this.getSongList(res);
                }, err => {
                    this.$toast({
                        message: '出错了呢',
                        position: 'middle',
                        duration:2000
                    });
                });
            }
        }
    }
</script>
<style>
    .login{
        margin-top: 1rem;
    }
    .login{
        width:100%;
        height:100%; 
    }
    .login .head{
        width:100%;
        height:1.8rem;
        box-sizing:border-box;
        padding:0 2rem;
        text-align:center;
        position:relative;
        left:0;
        top:0;
    }
    .login .head .pic{
        border-radius:50%;
        width:1rem;
        height:1rem;
        display:block;
        position:relative;
        left:0;
        top:0;
        margin:0 auto;
        margin-bottom:.2rem;
        background-size:cover;
    }
    .login .head .name{
        font-size:.35rem;
        color:gray;
    }
    .login .head .quit{
        position:absolute;
        right:0;
        top:0;
        color:white;
        padding:.2rem .2rem;
    }
    .login .list{
        width:100%;
        height:9.55rem;
        overflow:hidden;
        position:relative;
        left:0;
        top:0;
    }
    .login .list ul.list-content{
        width:300%;
        height:100%;
        position:absolute;
        left:0;
        top:0;
    }
    .login .list ul.list-content li.list-content-first{
        width:7.5rem;
        height:100%;
        float:left;
    }
    .login .list ul.list-content li.list-content-first .list-content-title{
        color:white;
        font-size:.4rem;
        text-indent:.5rem;
        margin-top:.15rem;
        border-bottom:2px solid red;
    }
    .index-one{
        width:100%;
        height:8.8rem;
        overflow:hidden;
    }
    .index-one .singerlist-main{
        width:100%;
        height:100%;
        position:relative;
        left:0;
        top:0;
    }
    .index-two{
        width:100%;
        height:8.8rem;
    }
    .index-three{
        width:100%;
        height:8.8rem;
    }
</style>