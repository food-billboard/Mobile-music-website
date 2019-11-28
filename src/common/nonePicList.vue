<template>
    <div class="nonepic">
        <div class="line">
            <div></div>
        </div>
        <div class="detail"
            :style="{height: complete > 0 ? '' : '8rem'}">
            <ul class="detail-content" 
                @touchend="loading">
                <li v-for="value, index in detailList"
                    :style="{backgroundColor: index % 2 == 0 ? '#f7f7f7' : 'white'}">
                    <a href="javascript:;"
                        @click="click(index)">
                        <p class="pic">
                            <img :src="value['img']" />
                        </p>
                        <P class="name">{{value['singer']}}</p>
                    </a>
                </li>
            </ul>
        </div>
        <div class='totop'
            v-show="show" 
            @click="top">
            top
        </div>
    </div>
</template>
<script>
    import {changeArray, toTop} from '@/common/tools.js'
    export default {
        name: "NonePic",
        props: {
            complete: {
                type:Boolean,
                default: true
            },
            detailList: {
                type: Array
            },
            titleList: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        created() {
            document.addEventListener('touchstart', (e) => {
                if(document.documentElement.scrollTop != 0) {
                    this.show = true;
                }else {
                    this.show = false;
                }
            }, false);
        },
        data() {
            return {
                show:false,
                speed: 100
            }
        },
        methods: {
            loading(e) {
                if(document.documentElement.scrollHeight - document.documentElement.scrollTop - document.documentElement.offsetHeight <= 20) {
                    this.$emit("loading");
                }
            },
            click(index) {
                const id = this.detailList[index].id;
                this.$emit("getSinger", id);
            },
            top() {
                toTop(this.speed, () => {
                    this.show = false;
                });
            }
        }
    }    
</script>
<style scope>
    .nonepic{
      
    }
    .nonepic .line{
        width:100%;
        padding:0.2rem 0.1rem 0 0.1rem;
        height:.24rem;
        box-sizing:border-box;
        border-radius:.2rem;
        overflow:hidden;
    }
    .nonepic .line div{
        width:100%;
        height:100%;
        border-radius:.2rem;
        background-color:red;
    }
    .nonepic .detail{
        width:100%;
        border-top-left-radius:.2rem;
        border-top-right-radius:.2rem;
    }
    .nonepic .detail .detail-content{
        width:100%;
        position:relative;
        top:0;
        left:0;
    }
    .nonepic .detail .detail-content li{
        width:100%;
        padding:0 0.2rem;
        box-sizing:border-box;
        height:1rem;
        overflow:hidden;
        border-bottom:1px solid gray;
    }
    .nonepic .detail .detail-content li a{
        width:100%;
        height:100%;
        display:block;
    }
    .nonepic .detail .detail-content li a .pic{
        width:1rem;
        height:1rem;
        overflow:hidden;
        text-align:center;
        float:left;
        display:flex;
        align-items:center;
    }
    .nonepic .detail .detail-content li a .pic img{
        width:.7rem;
        height:.7rem;
        border-radius:50%;
    }
    .nonepic .detail .detail-content li a .name{
        font-size:0.28rem;
        color:black;
        line-height:1rem;
        float:left;
    }
    .nonepic .detail .detail-content li a .add{
        width:1rem;
        height:1rem;
        float:right;
        text-align:center;
        line-height:1rem;
        font-size:.28rem;
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
</style>