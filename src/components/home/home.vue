<template>
    <div class="home">
        <div class="isget">
            <mt-spinner :type="3" v-show="!isGet" :size="40"></mt-spinner>
        </div>
        <div class="home-pic-list">
            <rotation :rotationList="rotationList"
                :complete="complete"
                :rotationSize="rotationSize"></rotation>
        </div>
        <ul class="home-link">
            <li v-for="value, index in mainOption">
                <router-link class="home-link-a" :to="value['link']">{{value["content"]}}</router-link>
            </li>
        </ul>
        <router-view></router-view>
    </div>
</template>
<script>
    import Rotation from '@/common/rotation'
    import {getData, changeArray, getWidth} from '@/common/tools.js'
    export default {
        name: "Home",
        components: {
            Rotation,
        },
        beforeRouteLeave(to, from, next) {
            this.complete = false;
            var timer = setTimeout(() => {
                next();
                timer = null;
            }, 0);
        },
        created() {
            const url = `${this.$store.state.baseUrl._url}/banner?type=2`;
            getData(this, url, res => {
                res.data.banners.slice(0, this.rotationCount).map((value, index) => {
                    this.rotationList[index] = {};
                    this.rotationList[index]['img'] = value['pic'];
                });
                changeArray(this.rotationList);
                this.complete = true;
                this.isGet = true;
            }, err => {
                this.$toast({
                    message: "没有更多了",
                    position: 'middle',
                    duration: 2000
                });
            });
        },
        data() {
            return {
                rotationCount: 6,
                isGet: false,
                rotationSize: [getWidth() * 0.8, getWidth() * 0.58],
                rotationList: [],
                complete: false,
                mainOption: [
                    {
                        link: "/home/recommend",
                        content:"推荐"
                    },
                    {
                        link: "/home/newsong",
                        content: "新碟上架"
                    },
                    {
                        link: "/home/search",
                        content: "发现"
                    },
                    {
                        link: "/home/singer",
                        content: "歌手"
                    },
                    {
                        link: "/home/broadcast",
                        content: "电台"
                    },
                    {
                        link: "/home/rank",
                        content: "排行榜"
                    }
                ]
            }
        }
    }
</script>
<style scope>
    .home{
        width:100%;
        height:11.34rem;
        margin-top:1rem;
        background-color:lightgoldenrodyellow;
    }
    .home .isget{
        position:absolute;
        left:50%;
        top:150px;
        margin-left:-20px;
    }
    .home .home-pic-list{
        width:100%;
        height:4rem;
        margin-bottom:.5rem;
        overflow:hidden;
    }
    .home .home-link{
        width:100%;
        padding-left:0.4rem;
        box-sizing:border-box;
    }
    .home .home-link li{
        float:left;
        width:2rem;
        height:2rem;
        background-color:#FFEFDB;
        border-radius:50%;
        margin-right:0.3rem;
        margin-bottom:0.3rem;
        box-shadow:0 0 5px #ccc;
    }
    .home .home-link li:nth-of-type(5) {
        margin-top:1.5rem;
    }
    .home .home-link li .home-link-a{
        width:100%;
        height:100%;
        display:inline-block;
        text-align:center;
        line-height:2rem;
        color:chocolate;
        font-size:0.3rem;
    }
</style>
