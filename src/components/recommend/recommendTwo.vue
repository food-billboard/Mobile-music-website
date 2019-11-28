<template>
    <div class="recommendTwo">
        <div class="isget">
            <mt-spinner :type="3" v-show="!isGet" :size="40"></mt-spinner>
        </div>
        <div class="head">
            <common-head :list="titleList"
                :title="headTitle"
                @getComment='getComment'
                @addList='addList'
                :isAdd='isAdd'
                :listNeed="!this.$route.query.ismine"
                ></common-head>
        </div>
        <div class="main">
            <common-list :list="detailList"
                @getUrl="changeUrl"
                :isDel='isDel'
                @delSong='delSong'></common-list>
        </div>
    </div>
</template>
<script>
    import {getData, changeArray, toPlayer, getItem} from '@/common/tools.js'
    import CommonList from '@/common/commonList'
    import CommonHead from '@/common/commonHead'
    export default {
        name: "RecommentTwo",
        components: {
            CommonList,
            CommonHead,
        },
        created(){
            const url = `${this.$store.state.baseUrl._url}/playlist/detail?id=${this.$route.params.id}&timestamp=${new Date().getTime()}`
            getData(this, url, res => {
                this.titleList[0].title = res.data.playlist.name;
                this.titleList[0].img = res.data.playlist.coverImgUrl;
                this.titleList[0].singer = res.data.playlist.creator.nickname;
                this.titleList[0].description = res.data.playlist.description;
                this.titleList[0].playcount = res.data.playlist.playcount;
                this.titleList[0].id = res.data.playlist.id;
                res.data.playlist.tracks.map((value, index) => {
                    this.detailList[index] = {};
                    this.detailList[index].name = value.name;
                    this.detailList[index].id = value.id;
                    this.detailList[index].singer = value.ar[0].name;
                    this.detailList[index].time = value.dt;
                    this.detailList[index].img = value.ar.picUrl;
                });
                if(this.detailList.length) {
                    changeArray(this.detailList);
                }
                changeArray(this.titleList);
                if(this.$route.params.mine == false || this.$route.params.mine == 'false') {
                    if(this.$store.state.isLogin) {     //判断是否已经收藏;
                        const listUrl = `${this.$store.state.baseUrl._url}/user/playlist?uid=${getItem('users')['id']}&timestamp=${new Date().getTime()}`;
                        getData(this, listUrl, res => {
                            if(!res.data.playlist.every((value, index) => {
                                return value.id != this.titleList[0].id;
                            })) {
                                this.isAdd = true;
                            }
                        }, err => {
                            this.$toast({
                                message: '出错了哦',
                                position: 'middle',
                                duration:2000
                            });
                        });
                    }
                }else {
                    this.isAdd = true;
                }
                this.isGet = true;
            }, err => {
                this.$toast({
                    message: '没有更多了',
                    position: 'middle',
                    duration: 2000
                });
            });
        },
        data() {
            return {
                titleList: [{}],
                detailList:[],
                headTitle: "歌单",
                isGet: false,
                isAdd:false,
                isDel: this.$route.query.ismine == true || this.$route.query.ismine == 'true'
            }
        },
        methods: {
            delSong(index) {     //删除歌曲;
                const url = `${this.$store.state.baseUrl._url}/playlist/tracks?op=del&pid=${this.titleList[0]['id']}&tracks=${this.detailList[index].id}`;
                getData(this, {url, withCredentials: true}, res => {
                    getData(this, `${this.$store.state.baseUrl._url}/playlist/detail?id=${this.$route.params.id}&timestamp=${new Date().getTime()}`, res => {
                        this.detailList = [];
                        res.data.playlist.tracks.map((value, index) => {
                            this.detailList[index] = {};
                            this.detailList[index].name = value.name;
                            this.detailList[index].id = value.id;
                            this.detailList[index].singer = value.ar[0].name;
                            this.detailList[index].time = value.dt;
                            this.detailList[index].img = value.ar.picUrl;
                        });
                        if(this.detailList.length) {
                            changeArray(this.detailList);
                        }
                    }, err => {
                        this.$toast({
                            message: '出错了呢',
                            position: 'middle',
                            duration: 2000
                        });
                    });
                }, err => {
                    this.$toast({
                        message: '删除失败了哦',
                        position:'middle',
                        duration:2000
                    });
                });
            },
            changeUrl(arg) {
                toPlayer(arg, this);
            },
            getComment() {      //评论展示;
                this.$router.push({name: 'Comment', params: {id: this.$route.params.id, name:'playlist'}});
            },
            addList() {     //歌单添加;
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
            }
        }
    }
</script>
<style scope>
    .recommendTwo{
        margin-top:1rem;
        background-color:lightgoldenrodyellow;
    }
    .recommendTwo .isget{
        position:absolute;
        left:50%;
        top:150px;
        margin-left:-20px;
    }
    .recommendTwo .head{
        width:100%;
    }
</style>