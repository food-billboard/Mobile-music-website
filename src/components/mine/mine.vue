<template>
    <div class="mine">
        <div class="isget">
            <mt-spinner :type="3" v-show="!isGet" :size="40"></mt-spinner>
        </div>
        <div class="unlogin">
            <h2>
                <a href="javascript:;"
                    @click='back'>返回</a>
                你还没有登录
            </h2>
            <form>
                <ul>
                    <li>
                       <label>用户名: </label> 
                       <input type="text" ref="username" />
                    </li>
                    <li>
                        <label>密码: </label>
                        <input type="password" ref="password" /> 
                    </li>
                    <li>
                        <button @click="toLogin" type="button">登录</button>
                    </li>
                </ul>
            </form>
            <div class="img"></div>
        </div>
    </div>
</template>
<script>
    import {getData, setItem, getItem, removeItem} from '@/common/tools.js'
    export default {
        name: "Mine",
        data() {
            return {
                isGet: true
            }
        },
        mounted() {
            if(this.$store.state.isLogin) {
                this.$router.push({ name: 'Login', params: {id: this.$store.state.userInfo[0]['id']}});
            }
        },
        methods: {
            back() {
                this.$router.go(-1);
            },
            toLogin() {   //登录;
                this.isGet = false;
                const username =  this.$refs.username.value,
                      password = this.$refs.password.value;
                if(username == "" || password == "") {
                    this.$toast({
                        message: '请输入用户名或密码',
                        position: 'middle',
                        duration: 2000
                    });
                    this.isGet = true;
                    return;
                }
                const url = `http://localhost:3000/login/cellphone?phone=${username}&password=${password}`;
                getData(this, url, res => {
                    this.$store.commit("login", true);
                    this.login = true;
                    this.$toast({
                        message: '登录成功',
                        position:'middle',
                        duration:3000
                    });
                    this.uid = res.data.account.id;
                    this.isGet = true;
                    const userInfo = {id: this.uid, username: username, passwod: password};
                    this.$store.commit('setUserInfo', userInfo);      //将个人信息存储在vuex中;
                    setItem("users", userInfo);
                    this.goMine(this.uid);
                }, err => {
                    console.log("出错了: " + err);
                });
            },
            goMine(id) {
                if(this.$store.state.prevRoute) {
                    this.$router.go(-1);
                    this.$store.commit('setPrevRoute', false);
                }else {
                    this.$router.push({ name: 'Login', params: {id: this.uid}});
                }
            }
        },
        beforeRouteLeave(to, from, next) {
            next();
        }
    }
</script>
<style>
    .mine {
        background-color:lightgoldenrodyellow;
        margin-top:1rem;
    }
    .mine .isget{
        position:absolute;
        left:50%;
        top:150px;
        margin-left:-20px;
    }
    .mine .unlogin{
        width:100%;
        height:100%;
    }
    .mine .unlogin h2{
        text-align:center;
        line-height:.8rem;
        font-size:.6rem;
        position:relative;
        left:0;
        top:0;
    }
    .mine .unlogin h2 a{
        position:absolute;
        left:0;
        top:0;
        width:1.5rem;
        height:.8rem;
        color:black;
        font-size:.2rem;
    }
    .mine .unlogin form{
        width:100%;
        height:3rem;
    }
    .mine .unlogin form ul{
        width:100%;
    }
    .mine .unlogin form ul li{
        width:100%;
        box-sizing:border-box;
        padding:0 1rem;
    }
    .mine .unlogin form ul li{
        margin-top:.28rem;
        border:none;
        text-align:center;
    }
    .mine .unlogin form ul li label{
        font-size:.4rem;
    }
    .mine .unlogin form ul li input{
        float:right;
        width:3rem;
        height:.4rem;
    }
    .mine .unlogin form ul li button{
        width:3.5rem;
        height:1rem;
        font-size:.5rem;
        color:gray;
        background-color:lightcyan;
        border:none;
        font-weight:bold;
        border-radius:10px;
        position:relative;
        left:0;
        top:0;
        margin:0 auto;
    }
    .mine .unlogin .img{
        width:100%;
        height:7.6rem;
    }
</style>