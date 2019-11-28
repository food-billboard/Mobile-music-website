<template>
    <div class="commonheadbottom">
        <ul class="common-head-content-main">
            <li v-for="value, index in bottomList.slice(0, 2)"
                @click="bottomOperate(index)"
                v-show="isNeed(index)">
                <a href="javascript:;">
                    {{index == 0 ? isAdd ? bottomList[2] : value : value}}
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'CommonHeadBottom',
        props: {
            listNeed:{
                type:Boolean,
                default: true
            },
            commentNeed: {
                type:Boolean,
                default: true
            },
            isAdd: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                bottomList: ['添加歌单', '评论查看', '取消收藏']
            }
        },
        methods: {
            bottomOperate(index) {      //歌单添加和查看评论按钮;
                this.$emit('bottomOperate', index);
            }
        },
        computed: {
            isNeed() {
                return function(index) {
                    if(index == 0 && this.listNeed) {
                        return true;
                    }else if(index == 0 &&  !this.listNeed) {
                        return false;
                    }
                    if(index == 1 && this.commentNeed) {
                        return true;
                    }else if(index == 1 && !this.commentNeed) {
                        return false;
                    }
                }
            }
        }
    }
</script>
<style scope>
    .commonheadbottom{
        width:100%;
        height:100%;
    }
    .commonheadbottom .common-head-content-main{
        width:100%;
        height:100%;
        display:flex;
        justify-content:space-between;
        align-items: center;
    }
    .commonheadbottom .common-head-content-main li{
        width:2rem;
        height:100%;
        line-height:.8rem;
        text-align:center;
    }
    .commonheadbottom .common-head-content-main li a{
        color:white;
        font-weight:bold;
        width:100%;
        height:100%;
        display:inline-block;
    }
</style>