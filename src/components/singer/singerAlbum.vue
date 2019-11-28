<template>
    <div class="singeralbum">
        <div class="isget">
            <mt-spinner :type="3" v-show="!isGet" :size="40"></mt-spinner>
        </div>
        <commonAlbum
            @loadMore="loadMore"
            :list="albumList"
            :isLoading="isLoading"
            @changeRoute="changeRoute"></commonAlbum>
    </div>
</template>
<script>
    import CommonAlbum from '@/common/commonAlbum'
    import {changeArray, getData, toTop, toPlayer} from '@/common/tools.js'
    export default {
        name: "SingerAlbum",
        components: {
            CommonAlbum
        },
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            },
        },
        created() {
            this.getAlbum();
        },
        data(){
            return {
                isLoading: false,
                albumList:[],
                albumOffset:0,
                albumLimit:10,
                albumIsLoading:false,
                isGet: false,
            }
        },
        methods: {
            loadMore() {
                this.getAlbum();
            },
            changeRoute(arg) {
                this.$router.push({name: 'NewSongTwo', params: {id: arg}});
            },
            getAlbum() {
                this.isGet = false;
                const url = `${this.$store.state.baseUrl._url}/artist/album/?id=${this.$route.params.id}&offset=${this.albumOffset}&limit=${this.albumLimit}`;
                getData(this, url, res => {
                    const length = this.albumList.length;
                    res.data.hotAlbums.map((value, index) => {
                        this.albumList[index + length] = {};
                        this.albumList[index + length].img = value.blurPicUrl;  //picUrl
                        this.albumList[index + length].name = value.name;
                        this.albumList[index + length].author = value.artists.trans;
                        this.albumList[index + length].id = value.id;
                    });
                    changeArray(this.albumList);
                    this.albumIsLoading = false;
                    this.albumOffset ++;
                    this.isGet = true;
                }, err => {
                    this.$toast({
                        message: '没有更多了',
                        position: 'middle',
                        duration: 2000
                    });
                });
            },
        }
    }
</script>
<style scope>
    .singeralbum{
        width:100%;
        margin-top:.2rem;
        background-color:white;
        margin-bottom:1rem;
    }
</style>