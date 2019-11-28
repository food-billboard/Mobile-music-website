<template>
    <div class="singerhead"
        :style="{backgroundImage: 'url(' + list[0]['img'] + ')'}">
        <div class="singerhead-content">
            <h2 class="head">
                <span @click="back"><</span>
            </h2>
            <div class="section">
                <p class="name">{{list[0]['name']}}</p>
            </div>
            <div class="singerhead-bottom">
                <a href="javascript:;"
                    @click="store">
                    <span>喜欢<strong :style="{color: isLike ? 'red' : 'white'}">❤</strong></span>
                </a>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "RankHead",
        data() {
            return {
                
            }
        },
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            },
            title: {
                type: String,
                default: "歌手"
            },
            isLike: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            back() {
                this.$emit('back');
            },
            store() {
                this.$emit("likeSinger");
            }
        }
    }
</script>
<style scope>
    .singerhead{
        width:100%;
        height:100%;
        background-size:cover;
    }
    .singerhead .singerhead-content{
        width:100%;
        height:100%;
        background:rgba(0, 0, 0, .3);
    } 
    .singerhead .singerhead-content h2.head{
        width:100%;
        height:.8rem;
        position:relative;
        left:0;
        top:0;
        color:white;
        font-weight:normal;
    }  
    .singerhead .singerhead-content h2.head span{
        line-height:.8rem;
        color:white;
        padding-left:.3rem;
        float:left;
        width:.8rem;
        height:.8rem;
        text-align:center;
        position:absolute;
        left:0;
        top:0;
        z-index:2;
    }
    .singerhead .singerhead-content .section .name{
        width:100%;
        line-height:.8rem;
        text-indent:.4rem;
        font-size:.4rem;
        margin-top:1.5rem;
        color:white;
    }
    .singerhead .singerhead-content .singerhead-bottom{
        float:right;
        margin-right:.5rem;
    }
    .singerhead .singerhead-content .singerhead-bottom a{
        width:1rem;
        height:1rem;
        box-sizing:border-box;
        padding:.2rem;
    }
    .singerhead .singerhead-content .singerhead-bottom a span{
        color:white;
        font-size:.3rem;
    }
</style>