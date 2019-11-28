<template>
    <div class="more">
        <div class="rotation">
            <mt-swipe :auto="6000" :show-indicators="true">
                <mt-swipe-item v-for="value, index in list" :key="index">
                    <a href="javascript:;" name="mt-swipe-item">
                        <img :src="value['img']" width=100% height="100%" />
                    </a>
                </mt-swipe-item>
            </mt-swipe>
        </div>
        <none-pic-list :complete="complete" 
            @loading="loading"
            @getSinger="getSinger"
            :detailList="detailList"></none-pic-list>
    </div>
</template>
<script>
    import {changeArray, getData} from '@/common/tools.js'
    import NonePicList from '@/common/nonePicList'
    export default {
        name: "More",
        props: {
            complete: {
                type: Boolean,
                default: false
            }
        },
        components: {
            NonePicList
        },
        created() {
            const url = `${this.$store.state.baseUrl._url}/top/artists?offset=1&limit=${this.rotationCount}`;
            getData(this, url, (res) => {
                res.data.artists.map((value, index) => {
                    this.list[index] = {};
                    this.list[index].img = value['picUrl'];
                    this.list[index].id = value['id'];
                });
                changeArray(this.list);
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
                rotationCount: 6,
                list: [],
                detailList: [],
                offset: 1,
                limit:10,
            }
        },
        watch: {
            "complete"() {
                if(this.complete) {
                    this.nGetData();
                }else {
                    this.detailList = [];
                }
            }
        },
        methods: {
            loading() {
                this.nGetData();
            },
            nGetData() {
                const url = `${this.$store.state.baseUrl._url}/top/artists?offset=${this.offset}&limit=${this.limit}`;
                const limit = 10;
                getData(this, url, (res) => {
                    const length = this.detailList.length;
                    this.offset ++;
                    res.data.artists.map((value, index) => {
                        this.detailList[index + length] = {};
                        this.detailList[index + length].img = value['img1v1Url'];
                        this.detailList[index + length].singer = value['name'];
                        this.detailList[index + length].id = value['id'];
                    });
                    changeArray(this.detailList);
                }, (err) => {
                    this.$toast({
                        message: '没有更多了',
                        position: 'middle',
                        duration: 2000
                    });
                });
            },
            getSinger(arg) {
                this.$emit("getSinger", arg);
            }
        }
    }
</script>
<style scope>
    .more{
        width:100%;
        background-color:lightgoldenrodyellow;
    }
    .more .rotation{
        width:100%;
        height:4rem;
    }
</style>