import Vue from 'vue'
import Vuex from 'vuex'
import Lyric from 'lyric-parser'   //歌词格式化模块;
import {changeArray, getItem, setItem, removeItem} from '@/common/tools.js'
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        isLogin: false,     //是否登录;
        playLists:[],   //播放列表;
        playing: '',    //正在播放;
        songCache: [{}],    //正在播放缓存;
        infoComplete: false,    //信息是否加载完成;
        singerRoutePageInfo: [{}],      //歌手路由页面信息;
        userInfo: [],       //个人信息;
        prevRoute: false,        //是否存在上一路由;
        musicTime: [false],        //音乐的当前
        baseUrl: {      //请求地址;
            _url: 'http://localhost:3000',   //基础地址;
            
        }
    },
    mutations: {
        quit(state, payload) {      //退出登录;
            state.isLogin = false;
            state.userInfo = {};
            removeItem('users');
        },  
        login(state, payload) {     //登录;
            state.isLogin = payload;
        },
        playSong(state, payload) {      //歌曲id列表缓存;
            payload += '';
            if(state.playLists.indexOf(payload) == -1) {
                state.playLists.push(payload);
            }else {
                return;
            }
            if(getItem('songLists')) {
                var list = getItem('songLists');
                for(let i = 0, len = state.playLists.length; i < len; i ++) {
                    if(list.indexOf(state.playLists[i]) == -1) {
                        list.push(state.playLists[i]);
                    }
                }
                setItem('songLists', list);
            }else {
                setItem('songLists', state.playLists);
            }
        },
        setSongCache(state, payLoad) {      //播放中歌曲缓存设置;
            state.songCache[0].url = payLoad.perms.data.data[0].url;
            state.songCache[0].img = payLoad.acct.data.songs[0].al.picUrl;
            state.songCache[0].name = payLoad.acct.data.songs[0].name;
            state.songCache[0].singer = payLoad.acct.data.songs[0].ar[0].name;
            state.songCache[0].time = payLoad.acct.data.songs[0].dt;
            state.songCache[0].id = payLoad.id;
            state.playing = payLoad.id;
            let lyric = new Lyric(payLoad.lyrics.data.lrc.lyric, this.handlerLyrics);
            state.songCache.curLine = lyric.curLine;
            state.songCache[0].lyricsTime = [];
            state.songCache[0].lyricsText = [];
            for(let i = 0, len = lyric.lines.length; i < len; i ++) {
                state.songCache[0].lyricsText.push(lyric.lines[i].txt);
                state.songCache[0].lyricsTime.push(lyric.lines[i].time);
            }
            setItem('song', state.songCache);
            changeArray(state.songCache);
            this.commit('playSong', payLoad.id);
            state.infoComplete = true;
        },
        setUserInfo(state, payload) {       //设置用户名和密码;
            state.userInfo = [];
            state.userInfo.push(payload);
            if(getItem('users')) {
                removeItem('users');
            }
        },
        setPrevRoute(state, payload) {        //设置上一路由;
            state.prevRoute = payload;
        },
        setMusicTime(state, payload) {        //设置当前播放音乐时间;
            if(!payload) {
                state.musicTime = [false];
            }else {
                state.musicTime[0] = {};
                state.musicTime[0].id = payload.id;
                state.musicTime[0].time = payload.time;
            }
        },
        getSongCache(state, payload) {      //获取正在播放中歌曲缓存;
            state.songCache = getItem('song');
            state.playing = state.songCache[0].id;
        },
        getSongList(state, payLoad) {       //获取歌曲id列表缓存;
            state.playLists = getItem('songLists');
            state.playing = state.playLists[0];
        },
        handlerLyrics({lineNum, txt}) {
            console.log(txt);
        },
        getUserInfo(state, payload) {     //获取用户信息;
            state.userInfo = [];
            state.userInfo.push(getItem('users'));
        },
        infoStatus(state) {     //信息更新完成开关;
            state.infoComplete = false;
        },
        changeSingerPageInfo(state, payload) {
            // if() {
                state.singerRoutePageInfo[0].index = payload.index;
                state.singerRoutePageInfo[0].id = payload.id;
                state.singerRoutePageInfo[0].titleInfo = payload.title;
            // }
        },
        clearSingerPageInfo(state, payload) {
            state.singerRoutePageInfo[0].index = null;
        },
        delSong(state, payload) {
            const i = state.playLists.indexOf(payload + '');
            state.playLists.splice(i, 1);
            setItem('songLists', state.playLists);
        }
    },
    action: {

    }
});
export default store;