<template>
    <div class="broadcast">
        <div class="shade"
            :style="{backgroundImage: 'url(' + bgurl + ')'}">
        </div>
        <div class="isget">
            <mt-spinner :type="3" v-show="!isGet" :size="40"></mt-spinner>
        </div>
        <div class="hot"
            :style="{backgroundImage: 'url(' + tvurl + ')'}">
            <div class="hot-content">
                <mt-swipe :show-indicators="false"
                    :auto="5000"
                    :speed="1000">
                    <mt-swipe-item v-for="value, index in hotList"
                        :key="index">
                        <a href="javascript:;" name="mt-swipe-item">
                            <img :src="value['img']" width=100% height="100%" />
                            {{value['name']}}
                        </a>
                    </mt-swipe-item>
                </mt-swipe>
            </div>
        </div>
        <div class="list">
            <impact-ball :list="list"
                @changeRoute="changeRoute"></impact-ball>
        </div>
    </div>
</template>
<script>
    import {getData, changeArray} from '@/common/tools.js'
    import ImpactBall from '@/common/impactBall'
    export default {
        name: "Broadcast",
        components: {
            ImpactBall
        },
        created() {
            const hotUrl = `${this.$store.state.baseUrl._url}/dj/recommend`,
                  listUrl = `${this.$store.state.baseUrl._url}/dj/catelist`;
            this.$axios.all([this.$axios(hotUrl), this.$axios(listUrl)]).
            then(this.$axios.spread((hot, list) => {
                this.getHot(hot);
                this.getList(list);
                this.isGet = true;
            })).
            catch(err => {
                this.$toast({
                    message: "没有更多了",
                    position: 'middle',
                    duration:2000
                });
            });
        },
        data() {
            return {
                isGet:false,
                tvurl: "../static/broad-rotation.jpg",
                bgurl: '../static/broadcastbg.jpg',
                hotList:[],
                list: []
            }
        },
        methods: {
            changeRoute(arg) {
                this.$router.push({name: 'BroadcastTwo', params: {id: this.list[arg].id}});
            },
            getHot(res) {
                res.data.djRadios.map((value, index) => {
                    this.hotList[index] = {};
                    this.hotList[index].img = value.picUrl;
                    this.hotList[index].name = value.name;
                });
                changeArray(this.hotList);
            },
            getList(res) {
                res.data.categories.map((value, index) => {
                    this.list[index] = {};
                    this.list[index].img = value.pic56x56Url;
                    this.list[index].name = value.name;
                    this.list[index].id = value.id;
                });
                changeArray(this.list);
            }
        }
    }
</script>
<style>
    .broadcast{
        margin-top:1rem;
        width:100%;
        height:12.34rem;
        background-color:lemonchiffon;
        position:relative;
        left:0;
        top:0;
    }
    .broadcast .shade{
        width:100%;
        height:100%;
        position: absolute;
        left:0;
        top:0;
        opacity:0.8;
        background-repeat: no-repeat;
    }
    .broadcast .isget{
        position:absolute;
        left:50%;
        top:150px;
        margin-left:-20px;
    }
    .broadcast .hot{
        width:100%;
        height:6rem;
        background-size:100% 100%;
        position:relative;
        left:0;
        top:0;
    }
    .broadcast .hot .hot-content{
        width:5.1rem;
        height:4.8rem;
        position:absolute;
        left:.5rem;
        top:.5rem;
        border-radius:.5rem;
        overflow:hidden;
    }
    .broadcast .list{
        width:100%;
        display:flex;
        justify-content: center;
    }
</style>