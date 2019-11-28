<template>
    <div class="big"
        ref="control"
        @touchstart="startTouch"
        :style="{width: rotationSize[0] + 'px', height: rotationSize[1] + 'px', transform:'rotateY(' + rotate + 'deg)'}">
        <ul v-for="value, index in rotationList"
            :style="{transform: rotationPos[index]['pos'],
                backgroundImage: 'url(' + value['img'] + ')'}"></ul>
    </div>
</template>
<script>
    import {changeArray} from './tools'
    export default {
        name: "Rotation",
        props:["rotationList", 'complete', 'rotationSize'],
        data() {
            return {
                rotationPos: [
                    {
                        pos: "rotateY(0deg) translateZ(" + (this.rotationSize[0] * 1.7 / 2 ) + "px)"
                    },
                    {
                        pos: "rotateY(60deg) translateZ(" + (this.rotationSize[0] * 1.7 / 2 ) + "px)"
                    },
                    {
                        pos: "rotateY(120deg) translateZ(" + (this.rotationSize[0] * 1.7 / 2 ) + "px)"
                    },
                    {
                        pos: "rotateY(-60deg) translateZ(" + (this.rotationSize[0] * 1.7 / 2) + "px)"
                    },
                    {
                        pos: "rotateY(-120deg) translateZ(" + (this.rotationSize[0] * 1.7 / 2 ) + "px)"
                    },
                    {
                        pos: "rotateY(180deg) translateZ(" + (this.rotationSize[0] * 1.7 / 2) + "px)"
                    }
                ],
                timer: 1,   //定时器;
                rotate: 0,
                angle:60,
            }
        },
        watch: {
            'complete'(newV, oldV) {
                if(newV) {
                    this.loop();
                }else {
                    clearInterval(this.timer);
                }
            }
        },
        methods: {
            play(count) {    //自动轮播效果;
                var speed = 1
                if(count < 0) {
                    speed = -1;
                }
                count = Math.abs(count);
                var timer = setInterval(() => {
                    if(count > 0) {
                        this.rotate += speed;
                        count --;
                    }else {
                        clearInterval(timer);
                        return new Promise(function (resolve, reject) {
                            resolve();
                        });
                    }
                }, 1000 / 60);
            },
            loop() {
                this.timer = setInterval(() => {
                    this.play(60);
                }, 4000);
            },
            startTouch(e) {  //开始;
                clearInterval(this.timer);
                var prevLeft = e.changedTouches[0].clientX,
                    nowLeft = 0,
                    that = this,
                    _x = 0,
                    rotate = this.rotate;
                document.ontouchmove = (e) => {
                    nowLeft = e.changedTouches[0].clientX;
                    _x = nowLeft - prevLeft;
                    this.rotate = rotate + _x / this.getRate();
                }
                document.ontouchend = (e) =>{
                    document.ontouchmove = false;
                    var _x = this.rotate % 60,
                        count = 0;
                    if(_x < 30) {
                        count = -_x;
                    }else {
                        count = (60 - _x);
                    }
                    var p = new Promise((resolve, reject) => {
                        resolve();
                    });
                    p.then(this.play(count)).then(this.loop());
                }
            },
            getData() {
                return document.documentElement.clientWidth;
            },
            getRate() {
                return this.rotationSize[0] / this.angle;
            }
        },
        computed: {
            getWidth() {        //获取客户端宽度;
                return document.documentElement.clientWidth;
            },
        }
    }
</script>
<style scope>
.big {
    position: relative;
    margin:0 auto;
    transform-style: preserve-3D;
    transform-origin:center center;
    transform:rotateY(0deg);
}
.big ul{
    width: 100%;
    height: 100%;
    position: absolute;
    background-size:100% 100%;
}
</style>