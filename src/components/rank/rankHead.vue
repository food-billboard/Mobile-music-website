<template>
    <div class="rankhead"
        :style="{backgroundImage: 'url(' + list[0]['img'] + ')'}">
        <div class="rankhead-content">
            <h2 class="head">
                <span @click="back"><</span>
            </h2>
            <div class="section">
                <h1><i>{{list[0]['name']}}</i></h1>
                <p class="time">最近更新: {{list[0]['updateTime'] | getTime}}</p>
                <span class="playcount"
                    v-if="isNeedCount">播放{{list[0]['playcount']}}次</span>
            </div>
            <div class="rankhead-bottom">
                <common-head-bottom @bottomOperate='bottomOperate'
                    :listNeed='listNeed'
                    :commentNeed='commentNeed'
                    :isAdd='isAdd'></common-head-bottom>
            </div>
        </div>
    </div>
</template>
<script>
    import CommonHeadBottom from '@/common/commonHeadBottom'
    export default {
        name: "RankHead",
        components: {
            CommonHeadBottom
        },
        data() {
            return {
                bottomList: ['添加歌单', '评论查看']
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
                default: "排行榜"
            },
            isNeedCount: {
                type:Boolean,
                default:true
            },
            listNeed: {
                type:Boolean,
                default: true
            },
            commentNeed: {
                type:Boolean,
                default: true
            },
            isAdd: {
                type: Boolean,
                default:false
            }
        },
        methods: {
            back() {
                this.$router.go(-1);
            },
            addList() {
                this.$emit('addList');
            },
            getComment() {
                this.$emit('getComment');
            },
            bottomOperate(index) {      //歌单添加和查看评论按钮;
                switch(index) {
                    case 0: this.addList();break;
                    case 1: this.getComment(); break;
                }
            }
        }
    }
</script>
<style scope>
    .rankhead{
        width:100%;
        height:100%;
        background-size:cover;
    }
    .rankhead .rankhead-content{
        width:100%;
        height:100%;
        background:rgba(0, 0, 0, .3);
    } 
    .rankhead .rankhead-content h2.head{
        width:100%;
        height:.8rem;
        position:relative;
        left:0;
        top:0;
        color:white;
        font-weight:normal;
    }  
    .rankhead .rankhead-content h2.head span{
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
    .rankhead .rankhead-content h2.head .title{
        width:100%;
        height:100%;
        line-height:.8rem;
        text-align:center;
        position:absolute;
        left:0;
        top:0;
        font-size:.3rem;
    }
    .rankhead .rankhead-content .section{
        width:100%;
        height:2.4rem;
        padding:.1rem .3rem;
        box-sizing:border-box;
    }
    .rankhead .rankhead-content .section h1{
        color:white;
        font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    }
    .rankhead .rankhead-content .section h1 i{
        text-shadow:0 0 10px gray;
    }
    .rankhead .rankhead-content .section .time{
        line-height:.5rem;
        text-shadow:0 0 5px white;
    }
    .rankhead .rankhead-content .section .playcount{
        color:darkslategrey;
    }

    .rankhead .rankhead-content .rankhead-bottom{
        width:100%;
        height:0.8rem;
    }
</style>