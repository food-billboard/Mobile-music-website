<template>
    <div class="minelist">
        <div class="content"
            :style="{top: top + 'px', height: this.list.length + 1 + 'rem'}"
            ref="content">
            <ul class="content-main">
                <li @click='addList' 
                    class='content-main-addlist'
                    v-if='addBtnNeed'>
                    <a href="javascript:;">
                        <p>+</p>
                        <span>添加歌单</span>
                    </a>
                </li>
                <li v-for="value, index in list">
                    <a href="javascript:;"
                        @click="changeRoute(index)">
                        <h5 v-if="!noIcon"
                            class="index"
                            :style="{color:index < 3 ? 'red' : ''}">{{index + 1}}</h5>
                        <img v-if="noIcon" :src="value['img']">
                        <div class="text">
                            <p class="name">{{value['name']}}</p>
                            <p class="singer" v-show="!noIcon">by- {{value['singer']}}</p>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import {getData} from '@/common/tools.js'
    export default {
        name: "MineList",
        props: {
            list: {
                type:Array,
                default() {
                    return [];
                }
            },
            noIcon: {
                type: Boolean,
                default:true
            },
            needScroll: {       //是否需要滚动条;
                type: Boolean,
                default: true
            },
            top: {
                type: Number,
                default:0
            },
            moveEnd: {
                type: Boolean,
                default: true
            },
            addBtnNeed: {
                type: Boolean,
                default: true
            }
        },
        watch: {
            'moveEnd'(newV, oldV) {
                if(newV) {
                    var area = 0,
                        goal = 0,
                        dir = 0,
                        _y = this.top;
                    if(this.top > 0 || this.$refs.content.offsetHeight < this.$refs.content.parentNode.offsetHeight) {
                        goal = 0;
                        dir = -20;
                    }else if(this.top < - this.$refs.content.offsetHeight + this.$refs.content.parentNode.offsetHeight) {
                        goal = - this.$refs.content.offsetHeight + this.$refs.content.parentNode.offsetHeight;
                        dir = 20;
                    }else {
                        return;
                    }
                    var timer = setInterval(() => {
                        if((dir < 0 && _y > 0) || (dir > 0 && _y < - this.$refs.content.offsetHeight + this.$refs.content.parentNode.offsetHeight)) {
                            _y += dir;
                            this.$emit('posChange', _y);
                        }else {
                            clearInterval(timer);
                            this.$emit('posChange', goal);
                        }
                    }, 1000 / 60);
                }
            }
        },
        created() {
            
        },
        data() {
            return {
                
            }
        },
        methods: {
            changeRoute(index) {
                this.$emit("changeRoute", this.list[index].id);
            },
            addList(e) {
                this.$messageBox.prompt('输入你的歌单名字').then(({ value, action }) => {
                    if(action == 'confirm') {
                        const url = `${this.$store.state.baseUrl._url}/playlist/create?name=${value}`;
                        getData(this, {url, withCredentials: true}, res => {
                            this.$emit('addList');
                        }, err => {
                            this.$messageBox('操作失败', '你的歌单名字重复或者' + err);
                        }); 
                    }
                }).catch(err => {
                    
                });
            }
        }
    }
</script>
<style>
    .minelist{
        width:100%;
        height:100%;
        overflow:hidden;
        position:relative;
        left:0;
        top:0;
    }
    .minelist .content{
        position:absolute;
        left:0;
        top:0;
        width:100%;
        height:100%;
    }
    .minelist .content .content-main{
        width:100%;
        /* height:100%; */
    }
    .minelist .content .content-main li{
        width:100%;
        height:1rem;
    }
    .minelist .content .content-main li.content-main-addlist{
        font-size:.3rem;
        line-height:1rem;
    }
    .minelist .content .content-main li.content-main-addlist a{
        width:100%;
        height:100%;
        display:block;
    }
    .minelist .content .content-main li.content-main-addlist a p{
        width:.8rem;
        height:.8rem;
        text-align:center;
        float:left;
        line-height:.8rem;
        margin-right:.2rem;
        margin-top:.1rem;
        background:rgba(0, 0, 0, 0.7);
    }
    .minelist .content .content-main li:nth-of-type(even){
        background-color:#f7f7f7;
    }
    .minelist .content .content-main li:nth-of-type(odd){
        background-color:white;
    }
    .minelist .content .content-main li a{
        width:100%;
        height:100%;
        display:block;
        padding:0 .2rem;
        box-sizing:border-box;
    }
    .minelist .content .content-main li a h5{
        line-height:1rem;
    }
    .minelist .content .content-main li a img{
        width:.8rem;
        height:.8rem;
        margin-top:.1rem;
        float:left;
        margin-right:.2rem;
    }
    .mint-cell-wrapper:nth-of-type(2n){
        background-color:#f7f7f7 !important;
    }
    .minelist .index{
        font-weight:bold;
        margin-right:.2rem;
        float:left;
        font-size:.3rem;
        line-height:.5rem;
    }
    .minelist .text{
        height:100%;
        display:flex;
        align-items: center;
        flex-wrap: wrap;
        line-height:.5rem;
    }
    .minelist .name{
        font-size:.3rem;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .minelist .singer{
        font-size:.25rem;
        color:gray;
        margin-left:.2rem;
    }
</style>