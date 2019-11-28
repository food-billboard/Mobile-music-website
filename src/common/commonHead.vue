<template>
    <div class="common-head"
        :style="{backgroundImage: 'url(' + list[0]['img'] + ')'}">
        <div class="common-head-content">
            <h2 class="head">
                <span @click="back"><</span>
            </h2>
            <div class="section">
                <p class="section-pic">
                    <img :src="list[0]['img']" />
                    <span>{{list[0]['playcount'] | setNum(list[0]['playcount'], 4)}}</span>
                </p>
                <div class="section-info">
                    <h4 class="section-info-title">{{list[0]['title']}}</h4>
                    <p class="section-info-author">作者: {{list[0]['singer']}}</p>
                    <p class="section-info-description">
                        {{list[0]['description']}}
                    </p>
                </div>
            </div>
            <div class="common-head-bottom">
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
        name: "CommonHead",
        components: {
            CommonHeadBottom
        },
        data() {
            return {
                
            }
        },
        props: {
            list:{
                type: Array,
                default() {
                    return [];
                }
            },
            title: {
                type: String, 
                default: "歌单"
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
                type:Boolean,
                default: false
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
    .common-head{
        width:100%;
        height:4rem;
        background-size:cover;
    }
    .common-head .common-head-content{
        width:100%;
        height:100%;
        background:rgba(0, 0, 0, .9);
    } 
    .common-head .common-head-content h2.head{
        width:100%;
        height:.8rem;
        position:relative;
        left:0;
        top:0;
        color:white;
        font-weight:normal;
    }  
    .common-head .common-head-content h2.head span{
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
    .common-head .common-head-content h2.head .title{
        width:100%;
        height:100%;
        line-height:.8rem;
        text-align:center;
        position:absolute;
        left:0;
        top:0;
        font-size:.3rem;
    }
    .common-head .common-head-content .section{
        padding: .1rem .3rem;
        width:100%;
        height:2.4rem;
        box-sizing:border-box;
    }
    .common-head .common-head-content .section .section-pic{
        width:2rem;
        height:100%;
        text-align:center;
        float:left;
        position:relative;
        left:0;
        top:0;
    }
    .common-head .common-head-content .section .section-pic span{
        position:absolute;
        right:0;
        top:.1rem;
    }
    .common-head .common-head-content .section .section-pic img{
        width:2rem;
        height:2rem;
        margin-top:.1rem;
    }
    .common-head .common-head-content .section .section-info{
        width:4.9rem;
        height:100%;
        padding-left:.5rem;
        box-sizing:border-box;
        float:right;
    }
    .common-head .common-head-content .section .section-info .section-info-title{
        font-size:.32rem;
        color:white;
        word-break: break-all;
        font-weight:400;
        line-height:.5rem;
    } 
    .common-head .common-head-content .section .section-info .section-info-author{
        font-size:.25rem;
        display:inline-block;
        white-space: nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
        width:100%;
        line-height:.5rem;
        text-shadow:0 0 1px white;
    }
    .common-head .common-head-content .section .section-info .section-info-description{
        font-size:.22rem;
        color:darkgrey;
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
    }
    .common-head .common-head-content .common-head-bottom{
        width:100%;
        height:.8rem;
        padding:0 .3rem;
        box-sizing:border-box;
    }
</style>