<template>
    <div class="singerlist"
        :style="{top: top + 'px'}"
        ref="content">
        <ul class="singerlist-content">
            <li v-for="value, index in list"
                class="singerlist-icon">
                <a href="javascript:;"
                    @click="singerChange(index)">
                    <img :src="value['img']"
                        width="100%" 
                        heihgt="100%" />
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: "SingerList",
        props: {
            list: {
                type: Array,
                default() {
                    return []
                }
            },
            top: {
                type: Number,
                default:0
            },
            moveEnd: {
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
        data() {
            return {

            }
        },
        methods: {
            singerChange(index) {
                this.$emit('singerChange', index);
            }
        }
    }
</script>
<style scope>
    .singerlist{
        width:100%;
        position:absolute;
        left:0;
    }
    .singerlist-main .singerlist-content{
        width:100%;
        display:flex;
        justify-content:space-evenly;
        flex-wrap: wrap;
    }
    .singerlist-main .singerlist-content li.singerlist-icon{
        width:1.5rem;
        height:1.5rem;
        border-radius:50%;
        overflow:hidden;
        margin-right:.5rem;
        margin-bottom:.5rem;
        position:relative;
        left:0;
        top:0;
    }
    .singerlist-main .singerlist-content li.singerlist-icon:nth-of-type(2n){
        animation:animateEven 3s infinite linear;
    }
    .singerlist-main .singerlist-content li.singerlist-icon:nth-of-type(2n - 1){
        animation:animateOdd 3s infinite linear;
    }
    .singerlist-main .singerlist-content li.singerlist-icon a{
        width:100%;
        height:100%;
        display:inline-block;
    }
    @keyframes animateOdd{
        0% {opacity:1;left:0;top:0;}
        25% {opacity:0.8;left:5px;top:5px;}
        50% {opacity:0.6;left:0;top:0px;}
        75% {opacity:0.8;left:-5px;top:5px;}
        100% {opacity:1;left:0;top:0}
    }
    @keyframes animateEven{
        0% {opacity:0.8;top:5px;left:5px;}
        25% {opacity:1;top:0px;left:0px;}
        50% {opacity:0.8;top:5px;left:-5px;}
        75% {opacity:0.6;top:0px;left:0px;}
        100% {opacity:0.8;top:5px;left:5px;}
    }
</style>