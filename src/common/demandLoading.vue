<template>
    <div class="loading">
        <div class="header-content">
            <slot name="header"></slot>
        </div>
        <ul class="list-content" 
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="isLoading"
            infinite-scroll-distance="10">
            <li v-for="value, index in list"
                :key=index>
                <a href="jaavascript:;" @click="changeRouter(index)">
                    <p class="pic">
                        <img :src="value['img']" width="100%" height="100%" />
                        {{value['playcount']}}
                    </p>
                    <div class="title">
                        <p class="title-name">{{value['title']}}</p>
                        <p class="title-author"><i>by</i> {{value['author']}}</p>
                    </div>
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: "ListLoading",
        props: ["list", 'isLoading'],
        data() {
            return {
                
            }
        },
        created() {
            
        },
        methods: {
            loadMore() {
                this.$emit("loadMore");
            },
            changeRouter(index) {
                this.$emit("changeRoute", index);
            }
        }
    }
</script>
<style scope>
    .loading{
        width:100%;
    }
    .loading .list-content{
        width:100%;
        display:flex;
        justify-content: space-evenly;
        align-items: center;
        flex-wrap: wrap;
    }
    .loading .list-content li{
        width:2rem;
        height:3rem;
    }
    .loading .list-content li a{
        display:block;
        width:100%;
        height:100%;
    }
    .loading .list-content li a .pic{
        width:100%;
        height:2rem;
        direction:rtl;
        text-align:right;
        flex-direction:column-reverse;
    }
    .loading .list-content li a .title{
        width:100%;
        height:1rem;
    }
    .loading .list-content li a .title .title-name,
    .loading .list-content li a .title .title-author{
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
    .loading .list-content li a .title .title-name{
        color:black;
        font-size:0.28rem;
    }
    .loading .list-content li a .title .title-author i{
        color:gray;
    }
    .loading .list-content li a .title .title-author{
        color:darkslategray;
    }
</style>