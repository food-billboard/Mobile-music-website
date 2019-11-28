<template>
    <div class="singerlist">
        <div class="isget">
            <mt-spinner :type="3" v-show="!isGet" :size="40"></mt-spinner>
        </div>
        <common-list :list="detailList" 
            @getUrl="changeRoute"
            :isNeedSinger="false"></common-list>
    </div>
</template>
<script>
    import CommonList from '@/common/commonList'
    import {changeArray, getData, toTop, toPlayer} from '@/common/tools.js'
    export default {
        name: 'SingerList',
        components: {
            CommonList
        },
        created() {
            this.getSongs();
        },
        data() {
            return {
                detailList: [],
                isGet: false,
            }
        },
        methods: {
            changeRoute(arg) {
                toPlayer(arg, this);
            },
            getSongs() {
                this.isGet = false;
                const url = `${this.$store.state.baseUrl._url}/artists?id=${this.$route.params.id}`;
                getData(this, url, res => {
                    res.data.hotSongs.map((value, index) => {
                        this.detailList[index] = {};
                        this.detailList[index].name = value.name;
                        this.detailList[index].time = value.dt;
                        this.detailList[index].singer = res.data.artist.name;
                        this.detailList[index].id = value.privilege.id;
                    });
                    changeArray(this.detailList);
                    this.isGet = true;
                }, err =>{
                    this.$toast({
                        message: '没有更多了',
                        position: 'middle',
                        duration: 2000
                    });
                });
            }
        }
    }
</script>
<style scope>
    .singerlist{
        margin-top:.2rem;
    }
</style>