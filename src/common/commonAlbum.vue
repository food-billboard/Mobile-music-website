<template>
    <div class="commonalbum">
        <ul class="list-content"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="isLoading"
            infinite-scroll-distance="10">
            <li v-for="value, index in list">
                <a href="javascript:;"
                    @click="changeRoute(index)">
                     <p class="def"
                        :class="{'pic': bg == '',
                            'other': bg != ''}"
                        :style="{backgroundImage: bg == '' ? ('url(' + bgUrl + ')') : ('url(' + bg + ')')}">
                        <img :src="value['img']"/>
                    </p>
                    <div class="detail">
                        <p>{{value['name']}}</p>
                        <p>{{value['author']}}</p>
                    </div> 
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: "CommonAlbum",
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            },
            isLoding: {
                type:Boolean,
                default: false
            },
            bg: {
                type:String,
                default: ''
            }
        },
        data(){
            return {
                bgUrl: 'https://s2.music.126.net/style/web2/img/coverall.png?bca201cf9dee3749e8dd00063d8db267'
            }
        },
        methods: {
            loadMore() {
                this.$emit("loadMore");
            },
            changeRoute(index) {
                this.$emit("changeRoute", this.list[index]['id']);
            }
        }
    }
</script>
<style scope>
    .commonalbum{
        width:100%;
    }
    .commonalbum .list-content{
        width:100%;
        display:flex;
        flex-wrap:wrap;
        justify-content:space-evenly;
    }
    .commonalbum .list-content li{
        width:115px;
        height:130px;
        float:left;
        margin-bottom:10px;
    }
    .commonalbum .list-content li a{
        width:100%;
        height:100%;
        display:block;
    }
    .commonalbum .list-content li a .def{
        width:100%;
        height:100px;
    }
    .commonalbum .list-content li a .def img{
        width:100x;
        height:100%;
        margin:0;
    }
    .commonalbum .list-content li a p.pic{
        background-position:0 -570px;
    }
    .commonalbum .list-content li a p.other{
        background-size: cover;
    }
    .commonalbum .list-content li a p.other img{
        width:98px;
        height:75%;
        margin-left:11px;
        margin-top:10px;
        border-radius:10px;
    }

    .commonalbum .list-content li a .detail{
        width:100%;
        height:30px;
        padding-left:5px;
        box-sizing:border-box;
    }
    .commonalbum .list-content li a .detail p{
        text-overflow:ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .commonalbum .list-content li a .detail p:nth-of-type(1){
        color:black;
        font-size:.2rem;
        line-height:14px;
    }
    .commonalbum .list-content li a .detail p:nth-of-type(2){
        color:gray;
        font-size:.18rem;
        line-height:14px;
    }
    .loading{
        position:relative;
        left:0;
        bottom:1rem;
        margin-bottom:1rem;
    }
    .icon{
        position:absolute;
        left:50%;
        margin-left:-14px;
    }
</style>