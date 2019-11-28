<template>
    <div class="ball">
        <ul class="content">
            <li v-for="value, index in arr"
                :style="{left: posList[index]['x'] / 50 + 'rem', top: posList[index]['y'] / 50 + 'rem'}"
                :key="index"
                v-drag="{dragStart, index,dragMove, dragEnd}">
                <a href="javascript:;">
                    <img :src="value['img']" />
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
    import {getHeight, getWidth, impactCheck, retNumForArea, circleCheck, dataChange} from '@/common/tools.js'
    export default {
        name: "Ball",
        props:{
            list: {
                type: Array,
                default() {
                    return [0, 1, 2, 3, 4, 5, 6];
                }
            },
            listCount: {
                type: Number,
                default: 8
            },
            control: {
                type: Boolean,
                default: true
            }
        },
        created() {
            if(this.control) {
                this.loopRandom(true);
            }
        },
        data() {
            const count = this.listCount;
            var arr = this.list;
            return {
                count,  //歌手数量;
                arr,    //歌手列表;
                posList: [], //元素位置集合;
                ballSize:60,
                timer: 1,
                speed: 2,
                msg:1,
                active: -1,
                loadingSpeed: 35,
                loadingCount: 0
            }
        },
        methods: {
            dragStart(arg) {    //手指按下;
                this.active = arg['index'];
            },
            dragEnd(index, isClick) {      //手指抬起;
                if(!isClick) {
                    var dirX = this.posList[index].dirX,
                        dirY = this.posList[index].dirY;
                    this.posList[index].dirX = 10;
                    this.posList[index].dirY = 10;
                    dataChange(this.posList);
                    var timer = setTimeout(() => {
                        this.posList[index].dirX = dirX;
                        this.posList[index].dirY = dirY;
                    }, 3000);
                }else {
                    //子组件向父组件传值, 实现路由跳转;
                    this.$emit("singerChange", index);
                }
                this.active = -1;
            },
            dragMove(arg) {     //手指移动;
                this.posList[arg.index].x = arg.x;
                this.posList[arg.index].y = arg.y;
                this.moveCheck(false);
                dataChange(this.posList);
            },
            
            bugCheck(obj1, obj2) {
                return circleCheck(obj1, obj2);
            },
            moveCheck(isMove) {
                var _obj = {},  //临时存放变量;
                    obj1 = {},
                    obj2 = {};
                for(let i = 0, len = this.posList.length; i < len; i ++) {
                    if(i != this.active && isMove) {
                        this.posList[i]['x'] += this.posList[i]['dirX'];
                        this.posList[i]['y'] += this.posList[i]['dirY'];
                    }
                    obj1 = {
                        x: this.posList[i]['x'],
                        y: this.posList[i]['y'],
                        w: this.ballSize,
                        h: this.ballSize
                    }
                    if(obj1.x <= 0 || obj1.x + obj1.w >= getWidth()) {      //x边界碰撞;
                        if(obj1.x <= 0) {
                            this.posList[i].x -= this.posList[i].x;
                        }else {
                            this.posList[i].x -= (this.posList[i].x + this.ballSize - getWidth()); 
                        }
                        if(obj1.y >= getHeight() * 0.125 && obj1.y <= getHeight() * 0.875) {    
                            this.posList[i]['dirX'] = - this.posList[i]['dirX'];   
                            this.posList[i]['x'] += 2 * this.posList[i]['dirX'];
                        }else {
                            this.posList[i]['dirX'] = - this.posList[i]['dirX'];
                            this.posList[i]['dirY'] = - this.posList[i]['dirY'];
                            this.posList[i]['x'] += this.posList[i]['dirX'];
                            this.posList[i]['y'] += this.posList[i]['dirY'];
                        }
                    }
                    if(obj1.y <= 50 || obj1.y + obj1.h >= getHeight() - 50) {   //y轴边界碰撞;
                        if(obj1.y <= 50) {
                            this.posList[i].y += (50 - this.posList[i].y);
                        }else {
                            this.posList[i].y -= (this.posList[i].y + this.ballSize - getHeight() + 50); 
                        }
                        if(obj1.x >= getWidth() * 0.125 && obj1.x <= getWidth() * 0.875) {
                            this.posList[i]['dirY'] = - this.posList[i]['dirY'];
                            this.posList[i]['y'] += 2 * this.posList[i]['dirY'];
                        }else {
                            this.posList[i]['dirX'] = - this.posList[i]['dirX'];
                            this.posList[i]['dirY'] = - this.posList[i]['dirY'];
                            this.posList[i]['x'] += this.posList[i]['dirX'];
                            this.posList[i]['y'] += this.posList[i]['dirY'];
                        }
                    }
                    obj1.x = this.posList[i].x;
                    obj1.y = this.posList[i].y;
                    for(let j = 0; j < len && j != i; j ++) {       //物体间碰撞;
                        obj2 = {
                            x: this.posList[j]['x'],
                            y: this.posList[j]['y'],
                            w: this.ballSize,
                            h: this.ballSize
                        }
                        if(impactCheck(obj1, obj2)) {
                            this.posList[j]['dirX'] = - this.posList[j]['dirX'];
                            this.posList[j]['dirY'] = - this.posList[j]['dirY'];
                            if(!isMove) {
                                this.posList[j]['x'] += 5;
                                this.posList[j]['y'] += 5;
                            }else {
                                this.posList[i]['dirX'] = - this.posList[i]['dirX'];
                                this.posList[i]['dirY'] = - this.posList[i]['dirY'];
                                this.posList[j]['x'] += this.posList[j]['dirX'];
                                this.posList[j]['y'] += this.posList[j]['dirY'];
                                this.posList[i]['x'] += this.posList[i]['dirX'];
                                this.posList[i]['y'] += this.posList[i]['dirY'];
                                const ar = Math.random();
                                if(ar > 0.5) {
                                    this.posList[i]['dirX'] = - this.posList[i]['dirX'];
                                }else {
                                    this.posList[i]['dirY'] = - this.posList[i]['dirY'];
                                }
                            }
                        }
                        obj1.x = this.posList[i].x;
                        obj1.y = this.posList[i].y;
                        obj2.x = this.posList[j].x;
                        obj2.y = this.posList[j].y;
                        if(this.bugCheck(obj1, obj2) && this.bugCheck(obj1, obj2) >= 1) {
                            const area = this.bugCheck(obj1, obj2) * 3;
                            if(this.posList[i].x > this.posList[j].x) {
                                this.posList[i].x += area;
                                this.posList[j].x -= area;
                            }else {
                                this.posList[i].x -= area;
                                this.posList[j].x += area;
                            }
                        }
                    }
                }
                _obj = this.posList.pop();
                this.posList.push(_obj);
            },
            check() {   //初始碰撞检测及解决;
                var obj1 = {},
                    obj2 = {},
                    errIndex = 0,
                    j = 0;
                for(let i = 0, len = this.listCount; i < len; i ++) {
                    this.posList[i] = {
                        x: Math.random() * (getWidth() - this.ballSize),
                        y: retNumForArea(getHeight() - this.ballSize - 50, 50),
                        dirX: Math.random() > 0.5 ? this.speed * Math.random() + 1 : - this.speed * Math.random() - 1,
                        dirY: Math.random() > 0.5 ? this.speed *Math.random() + 1 : - this.speed * Math.random() - 1
                    }
                    obj1 = {
                        x: this.posList[i].x,
                        y: this.posList[i].y,
                        w: this.ballSize,
                        h: this.ballSize
                    }
                    j = 0;
                    errIndex = 0;
                    while(j < i) {
                        obj2 = {
                            x: this.posList[j].x,
                            y: this.posList[j].y,
                            w: this.ballSize,
                            h: this.ballSize
                        }
                        if(impactCheck(obj1, obj2)) {
                            this.posList[i].x = Math.random() * (getWidth() - this.ballSize);
                            this.posList[i].y = retNumForArea(getHeight() - this.ballSize - 50, 50);
                            obj1.x = this.posList[i]['x'];
                            obj1.y = this.posList[i]['y'];
                            j = 0;
                        }else {
                            j++;
                        }
                        errIndex++;
                    }
                }
            },
            loopRandom(first) {  //随机运动;
                if(first) {
                    this.check();
                }
                this.timer = setInterval(() => {
                    if(this.control) {
                        this.moveCheck(true);
                    }else {
                        clearInterval(this.timer);
                    }
                }, 150);
            }
        },
        watch: {
            'control'() {
                var index = 0,
                    arr = [];
                if(!this.control) {
                    index = 0;
                    var timer = setInterval(() => {
                        for(let i = 0, len = this.posList.length; i < len; i ++) {
                            this.posList[i].y -= this.loadingSpeed;
                            if(this.posList[i].y < - this.ballSize && arr.indexOf(i) == -1) {
                                index ++;
                                arr.push(i);
                            }
                            if(arr.length == this.posList.length) {
                                this.$emit('completed', true);
                                clearInterval(timer);
                                break;
                            }
                        }
                        this.loadingCount ++;
                    }, 1000 / 60);
                }else {
                    var timer = setInterval(() => {
                        if(this.loadingCount > 0) {
                            for(let j = 0, len = this.posList.length; j < len; j ++) {
                                this.posList[j].y += this.loadingSpeed;
                            }
                        }else {
                            clearInterval(timer);
                            dataChange(this.posList);
                            this.loopRandom(false);
                            this.$emit('completed', true);
                        }
                        this.loadingCount --;
                    }, 1000 / 60);
                }
            }
        }
    }
</script>
<style scope>
    .ball{
        width:100%;
        height:100%;
        background-color:linen;
    }
    .ball .content{
        width:100%;
        height:100%;
        overflow:hidden;
        position:relative;
    }
    .ball .content li{
        width:1.2rem;
        height:1.2rem;
        border-radius:50%;
        display:block;
        overflow:hidden;
        position:absolute;
        box-shadow:0 0 10px black;
    }
    .ball .content li a{
        width:100%;
        height:100%;
        display:inline-block;
        position:relative;
        left:0;
        top:0;
    }
    .ball .content li a img{
        width:100%;
        height:100%;
    }
</style>