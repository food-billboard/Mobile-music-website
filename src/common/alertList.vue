<template>
    <div class="alert-content"
            :style="{opacity: shadeOpacity, zIndex: shadeIndex}"
            @touchstart='moveAlert'>
            <div class="close">
                <a href="javascript:;"
                    @click='close'>关闭</a>
            </div>
            <mine-list :list="songLists"
                @changeRoute="checkMusic"
                :top='listTop'
                :moveEnd="listMoveEnd"
                @posChange='posChange'
                class="list"></mine-list>
    </div>
</template>
<script>
    import MineList from '@/common/mineList'
    import {getData, changeArray} from '@/common/tools.js'
    export default {
        name: "AlertList",
        components: {
            MineList
        },
        created() {
            this.getSongList();
            if(this.$route.query.isdj > 0) {
                const url = `${this.$store.state.baseUrl._url}/album?id=${this.$route.params.id}`;
                getData(this, url, res =>{
                    res.data.songs.map((value, index) => {
                        this.albumList[index] = {};
                        this.albumList[index].id = value.id;
                    })
                }, err => {
                    this.$toast({
                        message: '出错了呢',
                        position: 'middle',
                        duration:2000
                    });
                });
            }
        },
        data() {
            return {
                shadeOpacity:0,     //歌单列表透明度;
                shadeIndex:-1,   //歌单列表z-index;
                listMoveEnd: true,  //歌单列表是否完成移动;
                listTop:0,      //歌单列表top值;
                songLists: [],      //歌单列表;
                isAdding: false,    //是否为添加歌曲状态;
                albumList: []
            }
        },
        methods: {
            close() {
                var timer = setInterval(() => {     //歌单列表透明度控制;
                    if(this.shadeOpacity > 0) {
                        this.shadeOpacity -= 0.1;
                    }else {
                        this.isAdding = false;
                        this.shadeIndex = -1;
                        clearInterval(timer);
                        timer = null;
                        this.$router.go(-1);
                    }
                }, 1000 / 60);
            },
            posChange(arg) {        //位置改变;
                this.listTop = arg;
            },
            moveAlert(e) {
                var click = false;
                this.listMoveEnd = false;
                var prevTop = e.changedTouches[0].clientY,
                    offsetTop = this.listTop,
                    nowTop = 0,
                    _y = 0;
                document.ontouchmove = (e) => {
                    click = true;
                    nowTop = e.changedTouches[0].clientY;
                    _y = nowTop - prevTop + offsetTop;
                    this.listTop = _y;
                };
                document.ontouchend = (e) => {
                    if(!click) {
                        return;
                    }
                    document.ontouchmove = false;
                    document.ontouchend = false;
                    this.listMoveEnd = true;
                }
            },
            addMusic(listId) {        //歌曲添加;
                var list = '';
                if(this.$route.query.isdj < 0) {
                    list += this.$route.params.id;
                }else {
                    this.albumList.map((value, index) => {
                        if(index == 0) {
                            list += (value.id);
                        }else {
                            list += (',' + value.id);
                        }
                    });
                }
                const url = `${this.$store.state.baseUrl._url}/playlist/tracks?op=add&pid=${listId}&tracks=${list}`;
                getData(this, {url, withCredentials: true}, res => {
                    this.$toast({
                        message: '添加成功',
                        position: 'middle',
                        duration: 2000
                    });
                    this.close();
                }, err => {
                    this.$toast({
                        message: '可能网络有问题吧',
                        position:'middle',
                        duration: 2000
                    });
                });  
            },
            checkMusic(arg) {       //检查音乐是否在列表中;
                const url = `${this.$store.state.baseUrl._url}/playlist/detail?id=${arg}&timestamp=${new Date().getTime()}`;
                getData(this, url, res => {
                    if(this.$store.state.userInfo[0].id == res.data.playlist.creator.userId) {
                        for(let i = 0, len = res.data.playlist.tracks.length;i < len; i ++) {
                            if(this.$route.query.isdj < 0) {
                                if(res.data.playlist.tracks[i].id == this.$route.params.id) {
                                    this.$toast({
                                        message: '这首歌已经添加过了!',
                                        position:'middle',
                                        duration: 2000
                                    });
                                    return;
                                }
                            }else {
                                for(let j = 0, length = this.albumList.length; j < length; j ++) {
                                    if(res.data.playlist.tracks[i].id == this.$route.params.id) {
                                        this.$toast({
                                            message: '里面有一首歌是添加过的',
                                            position:'middle',
                                            duration: 2000
                                        });
                                        return;
                                    }
                                }
                            }
                        }
                        this.addMusic(arg);
                    }else {
                        this.$toast({
                            message: '不能添加到非原创歌单内',
                            position:'middle',
                            duration:2000
                        });
                    }
                }, err => {
                    this.$toast({
                        message: '出错了呢',
                        position: 'middle',
                        duration:2000
                    });
                });
            },
            getSongList() {
                const url = `${this.$store.state.baseUrl._url}/user/playlist?uid=${this.$store.state.userInfo[0]['id']}`;
                getData(this, url, res => {         //获取所有歌单信息;
                    res.data.playlist.map((value, index) => {
                        this.songLists[index] = {};
                        this.songLists[index].name = value.name;
                        this.songLists[index].singer = value.nickname;
                        this.songLists[index].img = value.coverImgUrl;
                        this.songLists[index].id = value.id;
                    });
                    changeArray(this.songLists);
                    this.shadeIndex = 81;
                    var timer = setInterval(() => {     //歌单列表透明度控制;
                        if(this.shadeOpacity < 1) {
                            this.shadeOpacity += 0.1;
                        }else {
                            this.isAdding = true;
                            clearInterval(timer);
                            timer = null;
                        }
                    }, 1000 / 60);
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
<style scope>
        .alert-content{
        width:7.5rem;
        height:12.34rem;
        position:fixed;
        left:0;
        top:1rem;
        z-index:80;
        background-color:white;
    }
    .alert-content .list{
        margin-top:1rem;
        height:10.34rem;
    }
    .alert-content .close{
        width:100%;
        height:1rem;
        text-align:right;
        background-color:#f7f7f7;
        position:absolute;
        left:0;
        top:0;
        z-index:81;
    }
    .alert-content .close a{
        font-size:.35rem;
        font-weight:bold;
        line-height:1rem;
        padding:.5rem .5rem;
    }
</style>