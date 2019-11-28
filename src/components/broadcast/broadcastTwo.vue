<template>
    <div class="broadcasttwo">
        <div class="isget">
            <mt-spinner :type="3" v-show="!isGet" :size="40"></mt-spinner>
        </div>
        <h1 class="title">{{mes}}</h1>
        <p class="back"
            @click="back"><</p>
        <div class="main">
            <common-album
                :isLoading='isLoading'
                :list='list'
                :bg="bgUrl"
                @changeRoute="changeRoute"></common-album>
        </div>
    </div>  
</template>
<script>
    import CommonAlbum from '@/common/commonAlbum'
    import {getData, changeArray} from '@/common/tools.js'
    export default {
        name: "BroadcastTwo",
        components: {
            CommonAlbum
        },
        created() {
            const url = `${this.$store.state.baseUrl._url}/dj/recommend/type?type=${this.$route.params.id}`;
            getData(this, url, res => {
                res.data.djRadios.map((value, index) => {
                    this.list[index] = {};
                    this.list[index].img = value.picUrl;
                    this.list[index].name = value.name;
                    this.list[index].author = value.rcmdtext;
                    this.list[index].id = value.id;
                    this.list[index].category = value.category;
                });
                changeArray(this.list);
                this.isGet = true;
            }, err => {
                this.$toast({
                    message: "没有更多了",
                    position: 'middle',
                    duration:2000
                });
            });
        },
        data() {
            return {
                list: [],
                mes: '电台推荐',
                isLoading: true,
                isGet: false,
                bgUrl: '../../../static/broad-rotation.jpg'
            }
        },
        methods: {
            back() {
                this.$router.go(-1);
            },
            changeRoute(arg) {
                this.$router.push({name: 'BroadcastThree', params: {id: arg}});
            }
        }
    }
</script>
<style>
    .broadcasttwo{
        margin-top:1rem;
        position:relative;
        left:0;
        top:0;
        margin-bottom:1rem;
        background-color:lightgoldenrodyellow;
    }
    .broadcasttwo .isget{
        position:absolute;
        left:50%;
        top:150px;
        margin-left:-20px;
    }
    .broadcasttwo .title{
        line-height:.5rem;
        font-size:.4rem;
        text-align:center;
        border-bottom:0.06rem solid red;
        margin-bottom:.5rem;
    }
    .broadcasttwo .back{
        position:absolute;
        left:.5rem;
        top:0rem;
        padding:0 .2rem;
        font-weight:bold;
        color:black;
        font-size:.4rem;
    }
    .broadcasttwo .list-content{
        width:100%;
        display:flex;
        flex-wrap:wrap;
        justify-content:space-evenly;
    }
    .broadcasttwo .list-content li{
        width:115px;
        height:130px;
        float:left;
        margin-bottom:.6rem;
    }
    .broadcasttwo .list-content li a{
        width:100%;
        height:100%;
        display:block;
    }
    .broadcasttwo .list-content li a .pic{
        width:100%;
        height:100px;
        background-position:0 -570px;
    }
    .broadcasttwo .list-content li a .pic img{
        width:100x;
        height:100%;
        margin:0;
    }
    .broadcasttwo .list-content li a .detail{
        width:100%;
        height:30px;
        padding-left:5px;
        box-sizing:border-box;
    }
    .broadcasttwo .list-content li a .detail p{
        text-overflow:ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .broadcasttwo .list-content li a .detail p:nth-of-type(1){
        color:black;
        font-size:.2rem;
        line-height:14px;
    }
    .broadcasttwo .list-content li a .detail p:nth-of-type(2){
        color:gray;
        font-size:.18rem;
        line-height:14px;
    }
</style>