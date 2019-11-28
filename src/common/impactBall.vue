<template>
    <div class="impactball">
        <ul class="impact-content">
            <li v-for="value, index in list.slice(first, first + 4)"
                :key="index"
                class="impact-content-box">
                <div class="impact-content-box-content">
                    <p class="impact-content-box-line"
                        :style="{transform: index == active ? 'rotate(' + rotate + 'deg)' : ''}"></p>
                    <a href="javascript:;"
                        :style="{transform: index == active ? 'rotate(' + rotate + 'deg)' : ''}"
                        @click="changeRoute(index)">
                        <img :src="value['img']" width="50%" height="50%" />
                        <p>{{value['name']}}</p>
                    </a>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: "ImpactBall",
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        created() {
            this.boxAnimate();
        },
        data() {
            return {
                active:0,
                rotate:0,
                first:0,
                maxRotate:30,
                leave: true,
                back: false,
                firstBall:0,
                lastBall:0,
                timer: 1,
            }
        },
        methods: {
            changeRoute(index) {
                this.$emit("changeRoute", index);
            },
            boxAnimate() {      //弹球运动;
                var speed = 0.7;
                this.timer = setInterval(() =>{
                    if(this.active == 0) {      //第一个球;
                        if(this.back) {
                            if(this.rotate > 0) {
                                this.rotate -= speed;
                            }else {
                                this.first += 4;
                                if(this.first + 4 >= this.list.length) {
                                    if(this.first + 4 - this.list.length > 0 && this.first + 4 - this.list.length < 4) {
                                        this.first -= this.first + 4 - this.list.length;
                                    }else {
                                        this.first = 0;
                                    }
                                }
                                this.rotate = 0;
                                this.active = 3;
                                this.back = false;
                                this.leave = true;
                            }
                        }else {     
                            if(this.rotate < this.maxRotate) {
                                this.rotate += speed;
                            }else {
                                this.rotate = this.maxRotate;
                                this.back = true;
                                this.leave = false;
                            }
                        }
                    }else {     //最后一个球;
                        if(this.back) {
                            if(this.rotate < 0) {
                                this.rotate += speed;
                            }else {
                                this.first += 4;
                                if(this.first + 4 >= this.list.length) {
                                    if(this.first + 4 - this.list.length > 0 && this.first + 4 - this.list.length < 4) {
                                        this.first -= this.first + 4 - this.list.length;
                                    }else {
                                        this.first = 0;
                                    }
                                }
                                this.rotate = 0;
                                this.back = false;
                                this.active = 0;
                                this.leave = true;
                            }
                        }else {
                            if(this.rotate > -this.maxRotate) {
                                this.rotate -= speed;
                            }else {
                                this.rotate = -this.maxRotate;
                                this.leave = false;
                                this.back = true;
                            }
                        }
                    }
                }, 1000 / 60);
            },
        }
    }
</script>
<style>
    .impactball{

    }
    .impactball .impact-content{
        width:7.5rem;
        height:3.5rem;
        border-top:8px solid brown;
        position:relative;
        left:0;
        top:0;
        position:relative;
        left:0;
        top:0;
    }
    .impactball .impact-content li{
        width:1.2rem;
        height:3.5rem;
        float:left;
    }
    .impactball .impact-content li:nth-of-type(1) {
        margin-left:1.35rem;
    }
    .impactball .impact-content li:nth-of-type(4){
        margin-right:1.35rem;
    }
    .impactball .impact-content li p.impact-content-box-content{
        width:100%;
        height:100%;
    }
    .impactball .impact-content li p.impact-content-box-line{
        display:block;
        width:.06rem;
        height:2.8rem;
        background-color:black;
        position:relative;
        left:0;
        top:0;
        margin:0 auto;
        transform-origin:top center;
    }
    .impactball .impact-content li a{
        display:block;
        width:1.2rem;
        height:1.2rem;
        border-radius:50%;
        background:radial-gradient(#adafbc 10%, #181821 90%, #f9f9fc 20%);
        position:relative;
        left:0;
        top:0;
        transform-origin:50% -280%;
        text-align:center;
        border:1px solid white;
    }
    .impactball .impact-content li a img{
        width:60%;
        height:60%;
        vertical-align:middle;
        margin-top:0.01rem;
    }
    .impactball .impact-content li a p{
        color:ghostwhite;
        font-size:.24rem;
    }
</style>