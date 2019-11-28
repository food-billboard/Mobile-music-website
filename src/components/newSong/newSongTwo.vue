<template>
    <div class="newsongtwo">
        <div class="isget">
            <mt-spinner :type="3" v-show="!isGet" :size="40"></mt-spinner>
        </div>
        <div class="head">
            <common-head :list="titleList"
                :title="headTitle"
                @getComment='getComment'
                @addList='addList'>   
            </common-head>
        </div>
        <div class="main">
            <common-list :list="detailList"
                @getUrl="changeRoute"></common-list>
        </div>
    </div>
</template>
<script>
    import CommonList from '@/common/commonList'
    import CommonHead from '@/common/commonHead'
    import {getData, changeArray, toPlayer} from '@/common/tools.js'
    export default {
        name: "NewSongTwo",
        components: {
            CommonList,
            CommonHead,
        },
        created() {
            const url = `${this.$store.state.baseUrl._url}/album?id=${this.$route.params.id}`
            getData(this, url, res => {
                this.titleList[0].img = res.data.album.blurPicUrl;
                this.titleList[0].name = res.data.album.name;
                this.titleList[0].description = res.data.album.description;
                this.titleList[0].singer = res.data.album.artists[0].name;
                this.titleList[0].time = res.data.album.publishTime;
                this.titleList[0].company = res.data.album.company;
                this.titleList[0].id = res.data.album.id;
                res.data.songs.map((value, index) => {
                    this.detailList[index] = {};
                    this.detailList[index].name = value.name;
                    this.detailList[index].singer = value.ar[0].name;
                    this.detailList[index].time = value.dt;
                    this.detailList[index].id = value.privilege.id;
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
                titleList:[{}],
                commentList:[],
                headTitle: "新碟上架",
                isGet: false,
            }
        },
        methods: {
            changeRoute(arg) {  
                toPlayer(arg, this);
            },
            getComment() {      //评论展示;
                this.$router.push({name: 'Comment', params: {id: this.$route.params.id, name: 'album'}});
            },
            addList() {     //歌单添加;
                const url = `${this.$store.state.baseUrl._url}/album/sub?t=0&id=${this.titleList[0].id}`;
                getData(this, {url, withCredentials: true}, res => {
                    this.$router.push({name: "AlertList", params: {id: this.titleList[0].id}, query: {isdj: 1}});
                }, err => {
                    this.$toast({
                        message: '出错了咯',
                        position:'middle',
                        duration: 2000
                    });
                });
            }
        }
    }
</script>
<style scope>
    .newsongtwo{
        margin-top:1rem;
    }
    .newsongtwo .isget{
        position:absolute;
        left:50%;
        top:150px;
        margin-left:-20px;
    }
</style>