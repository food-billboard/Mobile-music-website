<template>
    <div class="searchlist">
        <ul class="content"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="isLoading"
            infinite-scroll-distance="10">
            <li v-for="value, index in list">
                <a href="javascript:;" @click="changeRoute(index)">
                    <h5>{{value['name']}}</h5>
                    <p>
                        <span class="author">{{value['author']}}</span> - 
                        <span class="list">{{value['list']}}</span>
                    </p>
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: "SearchList",
        props:['list', 'isLoading'],
        data() {
            return {
                
            }
        },
        created() {
            
        },
        methods: {
            loadMore() {
                this.$emit("loadBottom");
            },
            changeRoute(index) {
                this.$emit("changeRoute", index);
            }
        }
    }
</script>
<style scope>
    .searchlist{
        width:100%;
    }
    .searchlist .content{
        width:100%;
        padding-left:.3rem;
        box-sizing:border-box;
    }
    .searchlist .content li{
        width:100%;
        height:1rem;
        border-bottom:1px solid gray;
    }
    .searchlist .content li a{
        display:block;
        width:100%;
        height:100%;
    }
    .searchlist .content li a h5{
        font-size:0.3rem;
        line-height:.5rem;
    }
    .searchlist .content li a{

    }
    .searchlist .content li a p{
        
    }
    .searchlist .content li a p .name{
        font-size:.24rem;
    }
    .searchlist .content li a p .author{
        font-size:.24rem;
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