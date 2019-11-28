<template>
    <div class="polygon">
        <ul>
            <li v-for="value, index in titleLists"
                :key=index
                :style="{left: listPos[index]['x'] / 50 + 'rem',
                    top: listPos[index]['y'] / 50 + 'rem'}"
                :class="{'active': listPos[index]['index'] == 0}"
                @click="changeUrl(value)">
               <a href="javascript:;">
                   <span :style="{backgroundImage: iconList.length ? 'url(' + iconList[index]['img'] + ')' : ''}"></span>{{value}}
                </a> 
            </li>
        </ul>
    </div>
</template>
<script>
    import {changeArray} from '@/common/tools'
    export default {
        name: "gpolygon",
        props: {
            iconList: {
                type: Array,
            },
            boxWidth: {
                type: Number,
                default:300
            },
            boxHeight: {
                type: Number,
                default:300
            },
            titleList: {
                type: Array,
                default() {
                    return [];
                }
            },
            isMove: {
                type: Boolean,
                default: true
            }
        },
        watch: {
            'isMove'(newV, oldV) {
                if(newV) {
                    this.loopPlay();
                }else {
                    clearInterval(this.timer);
                }
            }
        },
        created() {
            this.loopPlay();
        },
        data() {
            var titleLists = this.titleList;
            return {
                timer: 1,
                titleLists,
                width:50,
                height:Math.sqrt(3) * 50,
                listPos: [
                    {   
                        index: 0,
                        x: this.boxWidth * 0.5 - 50 * 0.5,      //中间
                        y: this.boxHeight * 0.5 - Math.sqrt(3) * 50 * 0.5,
                    },
                    {
                        index: 1,
                        x: this.boxWidth * 0.5 + 50, //右上;
                        y:this.boxHeight * 0.5 - Math.sqrt(3) * 50,
                    },
                    {
                        index: 2,
                        x: this.boxWidth * 0.5 + 50 * 2.5,  //右外;
                        y: this.boxHeight * 0.5 - Math.sqrt(3) * 50 * 0.5,
                    },
                    {
                        index: 3,
                        x: this.boxWidth * 0.5 + 50, //右下;
                        y: this.boxHeight * 0.5 ,
                    },
                    {
                        index: 4,
                        x: this.boxWidth * 0.5 - 50 * 0.5,      //下;
                        y: this.boxHeight * 0.5 + Math.sqrt(3) * 50 * 0.5,
                    },
                    {
                        index: 5,
                        x: this.boxWidth * 0.5 - 50 * 2,     //左下;
                        y: this.boxHeight * 0.5,
                    },
                    {
                        index: 6,
                        x: this.boxWidth * 0.5 - 50 * 3.5,    //左外;
                        y: this.boxHeight * 0.5 - Math.sqrt(3) * 50 * 0.5,
                    },
                    {
                        index: 7,
                        x: this.boxWidth * 0.5 - 50 * 2,
                        y: this.boxHeight * 0.5 - Math.sqrt(3) * 50,     //左上;

                    },
                    {
                        index: 8,
                        x: this.boxWidth * 0.5 - 50 * 0.5,      //上;
                        y: this.boxHeight * 0.5 - Math.sqrt(3) * 50 * 1.5,
                    }
                ],
            }
        },
        methods: {
            getData() {
                return document.documentElement.clientWidth * 0.8;
            },
            getWidth() {
                return this.width;
            },
            getHeight() {
                return this.height;
            },
            getSize() {
                return 35;
            },
            loopPlay() {
                var that = this,
                    _arr;
                this.timer = setInterval(() => {
                    _arr = this.listPos.shift();
                    this.listPos.push(_arr);
                }, 3000);
            },
            changeUrl(index) {
                this.$emit("changeIndex", index);
            },
            randomColor() {     //随机颜色;
                return "#" + Math.random().toString(16).slice(-6);
            }
        },
        computed: {
            
        }
    }
</script>
<style scope>
    .polygon{
        width:100%;
        height:100%;
    }
    .polygon ul{
        width:100%;
        height:100%;
        position:relative;
        left:0;
        top:0;
    }
    .polygon ul li{
        width:1rem;
        height:1.732rem;
        float:left;
        position:absolute;
        transition:.5s;
        background-color:darksalmon;
    }
    .polygon ul li:before{
        content: "";
        position:absolute;
        right:1rem;
        top:0;
        border-width:0.866rem 0.5rem;
        border-style:solid;
        border-color:transparent darksalmon transparent transparent;
    }
    .polygon ul li.active{
        background-color:coral;
    }
    .polygon ul li.active:after{
        border-color:transparent transparent transparent coral;
    }
    .polygon ul li.active:before{
        border-color:transparent coral transparent transparent;
    }
    .polygon ul li:after{
        content: "";
        position:absolute;
        left:1rem;
        top:0;
        border-width:0.866rem 0.5rem;
        border-style:solid;
        border-color:transparent transparent transparent darksalmon;
    }
    .polygon ul li a{
        display:inline-block;
        width:100%;
        height:100%;
        text-align:center;
        font-size:0.2rem;
        line-height:1.732rem;
        color:white;
        position:relative;
        left:0;
        top:0;
    }
    .polygon ul li a span{
        width:.1rem;
        height:.32rem;
        display:block;
        position:absolute;
        margin-left:-0.05rem;
        left:50%;
        background-size:100%;
        top:.3rem;
    }
</style>