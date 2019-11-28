<template>
    <div class="player"
        :style="{backgroundImage: 'url(' + this.$store.state.songCache[0]['img'] + ')'}">
        <div class="shade">
            <div class="player-top">
                <div class="player-top-title">
                    <a href="javascript:;">
                        <p class="name">
                            {{this.$store.state.songCache[0]['name']}}
                        </p>
                        <p class="author">
                            {{this.$store.state.songCache[0]['singer']}}
                        </p>
                    </a>
                </div>
                <p class="close"
                    @click="back">
                    <    
                </p>
            </div>
            <div class="music">
                <audio :src="this.$store.state.songCache[0]['url']" ref="music" @canplay="canplay">
                    您的浏览器不支持 audio 标签。
                </audio>
            </div>
            <div class="player-section" @click="lycShow">
                <div class="lyrics" v-show="lyricShow">
                    <div class="text" 
                        ref="lyrics"
                        :style="{top: lyricPos + 'px'}"
                        @touchstart="lyricsTouch">
                        <p v-for="value, index in this.$store.state.songCache[0]['lyricsText']"
                            :class="{'active': curLine == index}">
                            {{value}}
                        </p>
                        <div class="line">
                            <p class="btn">
                                <span class="icon"></span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="cd" v-show="!lyricShow">
                    <div class="pic">
                        <img :src="this.$store.state.songCache[0]['img']" width="100%" height="100%" />
                    </div>
                </div>
            </div>
            <div class="player-footer">
                <p class="player-footer-add">
                    <a href="javascript:;" 
                        class="like" 
                        @click="like"
                        :style="{color: isLike ? 'red' : 'white'}">
                        ❤
                    </a>
                    <a href="javascript:;" 
                        class="add" 
                        @click="add">
                        +
                    </a>
                    <a href="javascript:;"
                        class="playerlist"
                        @click="showList">
                        <span v-for="value, index in [0, 1, 2, 3]"></span>
                    </a>
                    <a href="javascript:;"
                        class="playermode"
                        @click="modeChange">
                        {{modeIcon[modeIndex]}}
                    </a>
                </p>
                <div class="player-footer-control">
                    <span>{{time | musicTime}}</span>
                    <div class="control">
                        <p ref="progressBar">
                            <span class="played"
                                :style="{width: played + 'px'}"></span>
                            <a href="javascript:;" class="control-btn"
                                :style="{left: played + 'px'}"
                                @touchstart="control" 
                                ref="controlBtn"></a>
                        </p>
                    </div>
                    <span>{{this.$store.state.songCache[0]['time'] | musicTime}}</span>
                </div>
                <div class="player-footer-btn">
                    <ul class="btn-list">
                        <li v-for="value, index in btnList" @click="play($event, index)">
                            <a href="javascript:;">
                                <img :src="index != 1 ? value['img'][0] : value['img'][btnIndex]" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <mt-popup
            v-model="popupVisible"
            popup-transition="popup-fade">
            <div class="player-songlist"
                @touchstart='listMove'>
                <div class="player-songlist-main"
                    :style="{top: listTop + 'px'}"
                    ref="content">
                    <common-list :list="songLists"
                        :isX="true"
                        @delId='delId'
                        @getUrl='getUrl'>
                    </common-list>
                </div>
            </div>
        </mt-popup>
    </div>
</template>
<script>
/**
 * 歌名
 * 歌手
 * 专辑照片
 * 歌词
 * 时间
 * 歌曲
 */
    import moment from 'moment'     //时间格式化模块;
    import CommonList from '@/common/commonList'
    import {getData, changeArray} from '@/common/tools.js'
    export default {
        name: "Player",
        components: {
            CommonList
        },
        created() {
            if(this.$store.state.musicTime[0] != false) {
                this.playingId = this.$store.state.musicTime[0].id;
                this.getDetail(this.$store.state.musicTime[0].id);
                this.time = this.$store.state.musicTime[0].time * 1000;
                this.$store.commit('setMusicTime', null);
            }else {
                this.playingId = this.$route.params.id;
                this.getDetail(this.$route.params.id);
            }
            this.login = this.$store.state.isLogin;
            var list = '';
            this.$store.state.playLists.map((value, index) =>{
                if(index == 0) {
                    list += value;
                }else {
                    list += (',' + value);
                }
            });
            const url = `http://localhost:3000/song/detail?ids=${list}&timestamp=${new Date().getTime()}`;
            getData(this, url, res => {
                console.log(res);
                res.data.songs.map((value, index) =>{
                    this.songLists[index] = {};
                    this.songLists[index].name = res.data.songs[index].name;
                    this.songLists[index].singer = res.data.songs[index].ar[0].name;
                    this.songLists[index].id = res.data.songs[index].id;
                });
                changeArray(this.songLists);
            }, err => {
                console.log("出错了");
            });
        },
        beforeDestroy() {
           clearInterval(this.timer);
        },
        data() {
            var info = this.infomation;
            return {
                popupVisible: false,       //遮罩层是否显示;
                modeIndex:0,    //播放顺序索引;
                modeIcon:['loop', 'random', 'single'],  //播放模式;
                info:[],
                listTop:0,
                login:false,
                songLists: [],
                isLike: false,
                complete: false,
                isControl:false,    //按钮是否为控制状态;
                lyricControl:false,     //歌词面板是否为控制状态;
                playingId: '',      //正在播放的音乐Id;
                firstLoad: true,    //是否为第一次加载;
                getInfo: [{}],  
                time: 0,    //播放时间;
                timer:1,    //播放定时器;
                curLine:0,      //active歌词行数;
                progressLen:0,      //进度条长度;
                lyricLen:0, //歌词条数;
                lyricPos:0, //当前歌词位置;        
                btnList: [
                    {
                        img: ["../static/left.png"],
                        size:0.5
                    },
                    {
                        img: ["../static/play.png", "../static/stop.png"],
                        size:0.5
                    },
                    {
                        img: ["../static/right.png"],
                        size:0.5
                    },
                ],
                lyricShow: false,       //歌词是否显示;
                btnIndex: 1,    //播放暂停按钮当前状态;
                played: 0,      //按钮当前left值;
                maxPlayed: 4.3      //按钮最大拖动长度;
            }
        },
        methods: {
            delId(arg) {        //从列表中删除该歌曲;
                this.$store.commit('delSong', arg);
                var i = 0;
                this.songLists.map((value, index) => {
                    if(value['id'] == arg) {
                        i = index;
                    }
                });
                this.songLists.splice(i, 1);
                if(this.playingId == arg) {
                    this.afterPlay();
                }
            },
            getUrl(arg) {      //播放歌曲;
                clearInterval(this.timer);
                this.popupVisible = false;
                this.playingId = arg;
                this.getDetail(arg);
                this.reset();
                this.$router.push({name: 'Player', params: {id: this.playingId}});
            },
            canplay() {     //audio是否加载完成;
                var timer = setInterval(() => {
                    if(this.firstLoad && this.$store.state.infoComplete) {   
                        this.firstLoad = false;
                        this.$store.commit("infoStatus");
                        this.progressLen = this.$store.state.songCache[0].time;
                        this.curLine = this.$store.state.songCache[0].curLine;
                        this.lyricLen = this.$store.state.songCache[0].lyricsText.length;
                        this.playMusic();
                        clearInterval(timer);
                        timer = null;
                    }
                }, 1000);
            },
            timePlay() {    //顺序播放;
                var length = this.$refs.progressBar.offsetWidth - this.$refs.controlBtn.offsetWidth,
                    time = (this.$store.state.songCache[0].time / 1000) * 1000,
                    timeList = this.$store.state.songCache[0].lyricsTime,
                    prevL = 0,
                    duration = this.$refs.music.duration * 1000;
                this.$refs.music.currentTime = this.time / 1000;
                this.timer = setInterval(() => {
                    if(this.time < time && this.time < duration) {
                        this.time += 1000;      //时间控制;
                        if(!this.lyricControl && this.lyricShow) {      //歌词控制;
                            prevL = this.curLine;
                            for(let i = 0, len = timeList.length; i < len; i ++) {
                                if(this.time > timeList[len - 1]) {
                                    this.curLine = len - 1;
                                    break;
                                }
                                if(this.time < timeList[i]) {
                                    this.curLine = i;
                                    break;
                                }
                            }
                            if(this.curLine > 5 && this.curLine != prevL) {
                                var height = 0;
                                for(let i = 0, len = this.curLine; i < len; i ++) {
                                    height += this.$refs.lyrics.children[i].offsetHeight;
                                }
                                this.lyricPos = -height + this.$refs.lyrics.parentNode.offsetHeight / 2 - this.$refs.lyrics.children[this.curLine].offsetHeight / 2;
                            }
                        }
                        if(!this.isControl && this.played <= length) {      //按钮控制;
                            this.played = this.time / this.progressLen * length;
                        }
                    }else {
                        clearInterval(this.timer);
                        this.stopMusic();
                        this.afterPlay();
                    }
                }, 1000);
            },
            showList() {
                this.popupVisible = true;
            },
            back() {        //去到上一个路由;
                window.history.go(-1);
            },  
            like() {    //喜欢;
                if(this.login) {
                    const url = `http://localhost:3000/like?id=${this.playingId}&like=${!this.isLike}`;
                    getData(this, {url, withCredentials: true}, res => {
                        this.isLike = !this.isLike;
                    }, err =>{
                        this.$toast({
                            message: '出错了呢',
                            position:'middle',
                            duration: 2000
                        });
                    });
                }else {
                    this.$messageBox.confirm('', {      //前往登录;
                        title:'你还没有登录',
                        message:'是否前往登录',
                        confirmButtonText:'必须的',
                        cancelButtonText:'那我还是随便听听吧'
                    }).then(action => {     //登录;
                        this.$store.commit('setPrevRoute', true);
                        this.$router.push({name: 'Mine'});
                    }).catch(err => {       //不登录;
                        
                    });
                }
            },
            add() {     //添加到歌单;
                if(this.login) {
                    this.$store.commit('setMusicTime', {
                        id: this.playingId,
                        time: this.$refs.music.currentTime
                    });
                    this.$router.push({name: "AlertList", params: {id: this.playingId}, query: {isdj: -1}});
                }else {
                    this.$messageBox.confirm('', {      //前往登录;
                        title:'你还没有登录',
                        message:'是否前往登录',
                        confirmButtonText:'马上去',
                        cancelButtonText:'不不不'
                    }).then(action => {     //登录;
                        this.$store.commit('setPrevRoute', true);
                        this.$router.push({name: 'Mine'});
                    }).catch(err => {       //不登录;
                        
                    });
                }
            },
            control(e) {        //进度控制;
                var prevLeft = e.changedTouches[0].clientX,
                    pos = this.$refs.controlBtn.offsetLeft,
                    length = this.$refs.progressBar.offsetWidth - this.$refs.controlBtn.offsetWidth,
                    nowLeft = 0,
                    timeRate = 0;
                this.isControl = true;
                document.ontouchmove = (e) => {
                    nowLeft = e.changedTouches[0].clientX;
                    var _x = nowLeft - prevLeft + pos;
                    if(_x <= 0) {
                        _x = 0;
                    }else if(_x >= length) {
                        _x = length;
                    }
                    this.played = _x;
                    timeRate = this.played / length; //时间换算;
                }
                document.ontouchend = () => {
                    document.ontouchmove = false;
                    this.isControl = false;
                    this.$refs.music.currentTime = timeRate * this.progressLen / 1000 + timeRate * this.progressLen % 1000 / 1000;
                    this.time = timeRate * this.progressLen;
                    document.ontouchend = false;
                }
            },
            getDetail(id) {     //获取歌曲详细信息;
                var that = this;
                const detailUrl = `http://localhost:3000/song/detail?ids=${id}`,
                      urlUrl = `http://localhost:3000/song/url?id=${id}`,
                      lyricsUrl = `http://localhost:3000/lyric?id=${id}`;
                this.$axios.all([this.$axios(detailUrl), this.$axios(urlUrl), this.$axios(lyricsUrl)]).
                    then(this.$axios.spread((acct, perms, lyrics) => {
                        console.log(acct, perms, lyrics);
                        this.$store.commit('setSongCache', {acct, perms, lyrics, id: id});
                        if(this.login) {
                            const url = `http://localhost:3000/likelist?uid=${this.$store.state.userInfo[0]['id']}&timestamp=${new Date().getTime()}`;    //判断是否为喜欢歌曲;
                            getData(this, {url, withCredentials: true}, res => {
                                if(res.data.ids.indexOf(this.playingId - 1 + 1) != -1) {
                                    this.isLike = true;
                                }else {
                                    this.isLike = false;
                                }
                            }, err => {
                                this.isLike = false;
                            });
                        }
                    }));
            },
            play(e, index) {    //播放控制;
                switch(index) {
                    case 0: 
                        this.beforePlay();
                        ;break;
                    case 1: 
                        if(this.btnIndex == 0) {    //暂停状态;
                            this.playMusic();
                            this.btnIndex = 1;
                        }else {
                            this.btnIndex = 0;
                            this.stopMusic();
                        }
                        break;
                    case 2: 
                        this.afterPlay();
                        break;
                }
            },
            commonControl(dir) {    //歌曲播放控制方法;
                clearInterval(this.timer);
                this.stopMusic();
                if(this.$store.state.playLists.length == 1 || this.modeIndex == 2) {
                    this.$refs.music.currentTime = 0;
                    this.playMusic();
                }else {
                    this.firstLoad = true;
                    var index = index = this.$store.state.playLists.indexOf(this.playingId);
                    if(this.modeIndex == 0) {
                        if(dir > 0) {
                            index ++;
                            if(index == this.$store.state.playLists.length) {
                                index = 0;
                            }
                        }else {
                            index --;
                            if(index == -1) {
                                index = this.$store.state.playLists.length - 1;
                            }
                        }
                    }else {
                        var len = this.$store.state.playLists.length;
                        var _index = Math.floor(Math.random() * len);
                        while(_index == index) {
                            _index = Math.floor(Math.random() * len);
                        }
                        index = _index;
                    }
                    this.playingId = this.$store.state.playLists[index];
                    this.getDetail(this.playingId);
                    this.$router.push({name: 'Player', params: {id: this.playingId}});
                }
                //状态重置;
                this.reset();
            },  
            reset() {       //参数重置;
               this.$refs.controlBtn.style.left = 0 + 'px';
                this.btnIndex = 1;
                this.time = 0;
                this.played = 0;
                this.lyricPos = 0;
                this.lyricLen = 0;
                this.curLine = 0;
                this.lyricControl = false;
                this.firstLoad = true; 
            },
            beforePlay() {
                this.commonControl(-1);
            },
            afterPlay() {
                this.commonControl(1);
                
            },
            playMusic() {       //播放音乐;
                this.$refs.music.play();
                this.timePlay();
            },
            stopMusic() {   //暂停音乐;
                if(!this.$refs.music.paused) {
                    this.$refs.music.pause();
                    clearInterval(this.timer);
                }
            },
            lycShow() { //歌词显示;
                this.lyricShow = !this.lyricShow;
            },
            lyricsTouch(e){      //歌词手动控制;
                this.lyricControl = true;
                var prevTop = e.changedTouches[0].clientY,
                    nowTop = 0,
                    _y = 0,
                    top = this.lyricPos,
                    click =true;
                document.ontouchmove = (e) => {
                    click = false;
                    nowTop = e.changedTouches[0].clientY;
                    _y = nowTop - prevTop + top;
                    if(_y >= 0) {
                        _y = 0;
                    }
                    this.lyricPos = _y;
                }
                document.ontouchend = (e) => {
                    if(click) {
                        return;
                    }
                    document.ontouchmove = false;
                    var countTop = 0,
                        height = this.$refs.lyrics.parentNode.offsetHeight;
                    if(_y == 0 && this.curLine < 5) {      //下拉;
                        return;
                    }else {     //上拉;;
                        for(let i = 0, len = this.lyricLen; i < len; i ++) {
                            if(countTop > _y - (height / 2)) {
                                countTop -= this.$refs.lyrics.children[i].offsetHeight;
                            }else {
                                this.time = this.$store.state.songCache[0].lyricsTime[i - 1];
                                this.lyricControl = false;
                                break;
                            }
                        }
                    }
                    document.ontouchend = false;
                }
            },
            modeChange() {
                this.modeIndex ++;
                this.modeIndex %= 3;
            },
            listMove(e) {       //歌单列表移动;
                var prevTop = e.changedTouches[0].clientY,
                    offsetTop = this.listTop,
                    nowTop = 0,
                    _y = 0,
                    click = true,
                    maxTop = this.$refs.content.offsetHeight - this.$refs.content.parentNode.offsetHeight - 50,
                    long = this.$refs.content.offsetHeight > this.$refs.content.parentNode.offsetHeight;
                document.ontouchmove = (e) =>{
                    click = false;
                    if(long) {
                        nowTop = e.changedTouches[0].clientY,
                        _y = nowTop - prevTop + offsetTop;
                        this.listTop = _y;
                        if(this.listTop >= 0) {
                            this.listTop = 0;
                        }else if(- this.listTop > maxTop) {
                            this.listTop = - maxTop;
                        }
                    }
                }
                document.ontouchend = (e) => {
                    if(click) {
                        return;
                    }
                    document.ontouchmove = false;
                    document.ontouchend = false;
                }
            }
        },
        watch: {
            
        },
        computed: {
            
        }
    }
</script>
<style scope>
    .player{
        width:100%;
        height:100%;
        margin-top:1rem;
        background-size:cover;
    }
    .player .shade{
        width:100%;
        height:100%;
        background:rgba(0, 0, 0, .95);
        padding:0 0.4rem;
        box-sizing:border-box;
    }
    .player .player-top{
        width:100%;
        height:1.2rem;
        overflow:hidden;
    }
    .player .player-top .close{
        line-height:1rem;
        width:1rem;
        height:1rem;
        color:white;
        font-size:.5rem;
        padding:0 .5rem;
        position:absolute;
        left:0;
        top:1.1rem;
        text-align:center;
        animation:arrow infinite linear 2s;
    }
    @keyframes arrow{
        0% {left: 0rem;opacity:1}
        25% {left: -0.1rem; opacity:.5}
        50% {left: 0rem; opacity:0}
        75% {left: 0.1rem; opacity:0.5}
        100% {left: 0rem; opacity:1}
    }
    .player .player-top .player-top-title{
        padding:.3rem 0;
        box-sizing:border-box;
        text-align:center;
    }
    .player .player-top .player-top-title .name,
    .player .player-top .player-top-title .author{
        position:relative;
        left:0;
        top:0;
        animation:rotation infinite linear 20s;
    }
    @keyframes rotation{
        0% {left: 0}
        25% {left: 0.5rem}
        50% {left: 0rem}
        75% {left: -0.5rem}
        100% {left: 0}
    }
    .player .player-top .player-top-title .name{
        color:white;
        font-size:.2rem;
    }
    .player .player-top .player-top-title .author{
        color:gray;
        font-size:.15rem;
    }
    .player .player-section{
        width:100%;
        height:7.8rem;
        overflow:hidden;
    }
    .player .player-section .lyrics,
    .player .player-section .cd{
        transition: opacity 1s;
    }
    .player .player-section .lyrics{
        width:100%;
        height:100%;
        padding:.5rem .5rem 0 .5rem;
        overflow:hidden;
        box-sizing:border-box;
        position:relative;
        left:0;
        top:0;
    }
    .player .player-section .lyrics .text{
        width:100%;
        position:absolute;
        left:0;
        top:0;
    }
    .player .player-section .lyrics .text p{
        width:100%;
        text-align:center;
        color:gray;
        font-size:0.4rem;
        line-height:.6rem;
    }
    .player .player-section .lyrics .text p.active{
        color:white;
    }
    .player .player-section .cd{
        width:100%;
        height:100%;
        padding:1.7rem 1.05rem 1.5rem 1.05rem; 
        box-sizing:border-box;
    }
    .player .player-section .cd .pic{
        width:100%;
        height:100%;
        border-radius:50%;
        overflow:hidden;
        animation:rotateChange infinite linear 25s;
    }
    @keyframes rotateChange{
        0% {transform: rotate(0deg)}
        50%  {transform: rotate(180deg)}
        100% {transform: rotate(360deg)}
    }
    .player .player-footer{
        width:100%;
        height:2.4rem;
    }
    .player .player-footer .player-footer-add{
        width:100%;
        height:.8rem;
        display:flex;
        padding:0 .5rem;
        box-sizing:border-box;
        justify-content:space-between;
    }
    .player .player-footer .player-footer-add .like,
    .player .player-footer .player-footer-add .add,
    .player .player-footer .player-footer-add .playerlist,
    .player .player-footer .player-footer-add .playermode{
        width:.8rem;
        height:.8rem;
        line-height:.8rem;
        display:inline-block;
        text-align:center;
    }
    .player .player-footer .player-footer-add .like{
        float:left;
    }
    .player .player-footer .player-footer-add .add{
        float:right;
        color:white;
        font-size:.5rem;
    }
    .player .player-footer .player-footer-add .playerlist{
        padding:0.2rem 0.22rem;
        display:block;
        box-sizing:border-box;
    }
    .player .player-footer .player-footer-add .playerlist span{
        width:100%;
        height:0.05rem;
        margin-bottom:0.05rem;
        background-color:white;
        box-shadow:0 0 2px white;
        display:inline-block;
        float:left;
    }
    .player .player-footer .player-footer-add .playerlist span:nth-of-type(4) {
        margin-bottom:0;
    }
    .player .player-footer .player-footer-add .playermode{
        color:white;
        text-shadow:0 0 2px white;
    }
    .player .player-footer .player-footer-control{ 
        width:100%;
        height:.6rem;
    }
    .player .player-footer .player-footer-control>span:nth-of-type(1),
    .player .player-footer .player-footer-control>span:nth-of-type(2){
        line-height:.6rem;
        width:1rem;
        height:100%;
        display:inline-block;
        text-align:center;
        color:gray;
    }
    .player .player-footer .player-footer-control>span:nth-of-type(1){
        float:left;
    }
    .player .player-footer .player-footer-control>span:nth-of-type(2){
        float:right;
    }
    .player .player-footer .player-footer-control .control{
        width:4.7rem;
        height:.6rem;
        float:left;
        padding:.28rem 0.1rem;
        box-sizing:border-box;
    }
    .player .player-footer .player-footer-control .control p{
        width:100%;
        height:100%;
        background-color:gray;
        opacity:0.6;
        border-radius:5px;
        position:relative;
        left:0;
        top:0;
    }
    .player .player-footer .player-footer-control .control p .played{
        height:100%;
        background-color:white;
        opacity:0.8;
        border-radius:5px;
        display:inline-block;
        position:absolute;
        left:0;
        top:0;
    }
    .player .player-footer .player-footer-control .control p .control-btn{
        width:0.2rem;
        height:0.2rem;
        border-radius:50%;
        background-color:white;
        position:absolute;
        left:0;
        top:-0.09rem;
    }
    .player .player-footer .player-footer-btn{
        width:100%;
        padding:0 1rem;
        height:1rem;
        box-sizing:border-box;
    }
    .player .player-footer .player-footer-btn .btn-list{
        width:100%;
        height:100%;
        display:flex;
        justify-content:space-between;
        align-items:center;
    }
    .player .player-footer .player-footer-btn .btn-list li{
        float:left;
    }
    .player .player-footer .player-footer-btn .btn-list li a{
        width:100%;
        height:100%;
        display:inline-block;
    }
    .player .player-songlist{
        width:6rem;
        height:9rem;
        float:right;
        position:relative;
        left:0;
        top:0;
        overflow:hidden;
    }
    .player .player-songlist .player-songlist-main{
        width:100%;
        position:absolute;
        left:0;
        top:0;
    }
</style>


