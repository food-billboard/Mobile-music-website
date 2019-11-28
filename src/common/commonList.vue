<template>
    <div class="common-list">
        <div class="main"
            :style="{top: top + 'px'}"
            ref="content">
            <ul class="main-content">
                <li v-for="value, index in list"
                    :key="index"
                    :style="{backgroundColor: index %2 == 0 ? '#f7f7f7' : 'white'}">
                    <h5 class="list-title"
                        :style="{color: index < 3 ? 'red' : ''}">{{index + 1}}</h5>
                    <a href="javascript:;" 
                        @click="changeRoute(index)">
                        <div class="list-content">
                            <p class="list-info">
                                <span class="name">{{value['name'] | setTextLen(value['name'], true)}}</span>
                                <span class="singer" v-if="isNeedSinger"><i>by-</i> {{value['singer'] | setTextLen()}}</span> 
                                <span class="playcount" v-if="isNeedCount">{{value['playcount']}}次播放</span>
                            </p>
                            <p class="list-right"
                                v-if="isNeedAdd"
                                @click.stop="add($event, index)">{{isX ? 'x' : '+'}}</p>
                            <p class="del"
                                v-if="isDel"
                                @click.stop='delSong(index)'>删除</p>
                            <p class="list-right"
                                v-if="isNeedPlay">
                                <a href="javascript:;">
                                    <span></span>
                                </a>
                            </p>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
        <div class='totop'
            v-show="show" 
            @click="toTop">
            top
        </div>
    </div>
</template>
<script>
    import {getData, changeArray} from '@/common/tools.js'
    export default {
        name: "CommonList",
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            },
            isNeedSinger: {     //是否需要歌手名字;
                type: Boolean,
                default: true
            },
            toTopSpeed: {       //置顶速度;
                type: Number,
                default: 100
            },
            isNeedCount: {  //是否需要播放次数;
                type: Boolean,
                default: false
            },
            isNeedAdd: {    //是否需要添加按钮;
                type: Boolean,
                default:true
            },
            isX: {
                type: Boolean,
                default: false
            },
            isNeedPlay: {
                type: Boolean,
                default: false
            },
            top: {      //列表top值;
                type:Number,
                default:0
            },
            moveEnd: {      //是否结束移动;
                type:Boolean,
                default: true
            },
            isDel: {        //是否需要删除按钮;
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                show:false, //指定按钮显示开关;
                login: false,   //是否登录;
                addSongId:0 ,       //被添加的歌曲的id;
            }
        },
        created() {
            this.login = this.$store.state.isLogin;
            document.addEventListener('touchstart', (e) => {
                if(document.documentElement.scrollTop != 0) {
                    this.show = true;
                }else {
                    this.show = false;
                }
            }, false);
        },
        watch: {
            'moveEnd'(newV, oldV) {     //是否移动完成的监听;
                if(newV) {
                    var area = 0,
                        goal = 0,
                        dir = 0,
                        _y = this.top;
                    if(this.top > 0 || this.$refs.content.offsetHeight < this.$refs.content.parentNode.offsetHeight) {
                        goal = 0;
                        dir = -20;
                    }else if(this.top < - this.$refs.content.offsetHeight + this.$refs.content.parentNode.offsetHeight) {
                        goal = -this.$refs.content.offsetHeight + this.$refs.content.parentNode.offsetHeight;
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
        methods: {
            delSong(index) {     //删除歌曲;
                this.$emit('delSong', index);
            },
            changeRoute(index) {
                this.$emit('getUrl', this.list[index]['id']);
            },
            add(e, index) {
                if(this.isX) {      //播放器界面;
                    this.$emit('delId', this.list[index]['id']);
                }else {     //非播放器界面;
                    if(this.$store.state.isLogin) {     //是否登录;
                        this.addSongId = this.list[index]['id'];
                        this.$router.push({name: 'AlertList', params: {id: this.addSongId}, query: {isdj: -1}});
                    }else {     //没有登录;
                        this.toLogin();
                    }
                }
            },
            toLogin() {
                this.$messageBox.confirm('', {      //前往登录;
                    title:'你还没有登录',
                    message:'是否前往登录',
                    confirmButtonText:'马上去',
                    cancelButtonText:'宁死不屈'
                }).then(action => {     //登录;
                    this.$store.commit('setPrevRoute', true);
                    this.$router.push({name: 'Mine'});
                }).catch(err => {       //不登录;
                    
                });
            },
            toTop() {
                var scrollTop = document.documentElement.scrollTop;
                var timer = setInterval(() => {
                    if(document.documentElement.scrollTop > 0) {
                        scrollTop -= this.toTopSpeed;
                        document.documentElement.scrollTo(0, scrollTop);
                    }else {
                        clearInterval(timer);
                        document.documentElement.scrollTo(0, 0);
                        this.show = false;
                    }
                }, 1000 / 60);
            },
        },
        computed: {
        
        }
    }
</script>
<style scope>
    .common-list{
        width:100%;
        background-color:white;
        margin-bottom:1rem;
        height:100%;
    }
    .common-list .main{
        width:100%;
    }
    .common-list .main .main-content{
        width:100%;
        border-top-left-radius:15px; 
        border-top-right-radius:15px;
    }
    .common-list .main .main-content li{
        width:100%;
        height:.8rem;
        position:relative;
        left:0;
        top:0;
    }
    .common-list .main .main-content li h5{
        float:left;
        line-height:.8rem;
        text-indent:5px;
    }
    .common-list .main .main-content li a{
        padding-left:.5rem;
        width:100%;
        height:100%;
        display:block;
        box-sizing:border-box;
        position:absolute;
        left:0;
        top:0;
        overflow:hidden;
    }
    .common-list .main .main-content li a .list-content{
        width:100%;
        height:100%;
        box-sizing:border-box;
        overflow:hidden;
        position:absolute;
        left:.5rem;
        top:0;
    }
    .common-list .main .main-content li a .list-content .list-info{
        float:left;
        height:100%;
    }
    .common-list .main .main-content li a .list-content .list-info .singer,
    .common-list .main .main-content li a .list-content .list-info .name,
    .common-list .main .main-content li a .list-content .list-info .playcount{
        text-indent:.2rem;
    }
    .common-list .main .main-content li a .list-content .list-info .name{
        line-height:.8rem;
        padding-left:.2rem;
    }
    .common-list .main .main-content li a .list-content .list-info .singer{
        font-size:.24rem;
        display:inline-block;
        transform:scale(0.8);
        line-height:.4rem;
    }
    .common-list .main .main-content li a .list-content .list-info .playcount{
        margin-left:.35rem;
        font-size:.24rem;
        color:gray;
    }
    .common-list .main .main-content li a .list-content .del{
        float:right;
        position:absolute;
        right:1.7rem;
        top:0;
        height:100%;
        width:1rem;
        text-align:center;
        line-height:.8rem;
        font-size:.24rem;
    }
    .common-list .main .main-content li a .list-content .list-right{
        float:right;
        position:absolute;
        right:.7rem;
        top:0;
        height:100%;
        width:1rem;
        text-align:center;
        line-height:.8rem;
        font-size:.4rem;
        display:flex;
        justify-content: center;
        align-items: center;
    }
    .common-list .main .main-content li a .list-content .list-right a{
        opacity:0.5;
        width:60%;
        height:75%;
        display:block;
        border-radius:50%;
        border:3px solid gray;
        position:relative;
        left:0;
        top:0;
        margin:0 auto;
        display:flex;
        justify-content: center;
        align-items: center;
    }
    .common-list .main .main-content li a .list-content .list-right a span{
        display:block;
        border-top:0.18rem solid transparent;
        border-bottom:0.18rem solid transparent;
        border-right:0.18rem solid transparent;
        border-left:0.18rem solid gray;
        margin-left:-0.25rem;
    }
    .totop{
        width:.5rem;
        height:.5rem;
        background-color:gray;
        position:fixed;
        right:.3rem;
        bottom:2rem;
        text-align:center;
        line-height:.5rem;
        border-radius:3px;
        opacity:.5;
        animation:opacityChange 5s infinite;
    }
    @keyframes opacityChange{
        0% {opacity:.8;}
        50% {opacity: .6;}
        100% {opacity: .8}
    }


    
    /* .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    } */
</style>