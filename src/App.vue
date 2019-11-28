<template>
  <div id="app">
    <div class="top">
        <mt-header fixed title="我的音乐" class="top-content">
            <router-link to="/" slot="left" class="top-left" v-show="isHome"><</router-link>
        </mt-header>
    </div>
    <router-view/>
    <div class="bottom">
      <mt-tabbar v-model="selected" fixed
        value=0 class="tabbar">
        <mt-tab-item v-for="value, index in bottomList" id="value['id']" :key='index' class="select">
          <a href="javascript:;" @click="changeRoute(index, value)">
            <span class="app-tab-font" v-if="index!=1">{{value['content']}}</span>
            <img v-if="index==1" :src="value['content']" />
          </a>
        </mt-tab-item>
      </mt-tabbar>
    </div>  
  </div>
</template>
<script>
import {
  getItem, 
  setItem, 
  getData,
  isLogin} from '@/common/tools.js'
export default {
  name: 'App',
  mounted() {
    window.addEventListener('beforeunload', this.setUser, false);
  },
  created() {
    if(getItem('users')) {     //登录状态判断;
        this.$store.commit('login', true);
        this.$store.commit('getUserInfo');
    }else {
        this.$store.commit('login', false);
    }    
    if(getItem('songLists')) {    //是否存在歌单缓存;
      this.$store.commit("getSongList");
      if(getItem('song')) {   //是否存在正在播放的歌曲;
        this.$store.commit('getSongCache');
      }
    }else {
      const url = `${this.$store.state.baseUrl._url}/personalized/newsong`;
      getData(this, url, res => { 
        this.$store.commit('playSong', res.data.result[0].id);
      }, err => {
        this.$toast({
          message: '出错了呢',
          position:'middle',
          duration:2000
        });
      }); 
    }
  },
  data() {
    return {
        bottomList: [
          {
            id: 0,
            link: "/",
            content: "主页"
          },
          {
            id: 1,
            link: `/player/${this.$store.state.playing}`,
            content: "../static/icon_2.png"
          },
          {
            id: 2,
            link: "/home/mine",
            content: "我的"
          }
        ]
    }
  },
  methods: {
    setUser() {
      if(this.$store.state.isLogin) {
        // setItem('users', this.$store.state.userInfo[0]);
      }
    },
    selected() {
      return 0;
    },
    changeRoute(index, value) {   //路由跳转;
      if(index != 1) {
        this.$router.push({path:value['link']});
      }else {
        var id = this.$store.state.playing;
        this.$router.push({name: 'Player',params:{id}});
      }
    }
  },
  computed: {
    isHome() {
        return this.$route.path != '/' && this.$router.path != '/home';
    }    
  }
}
</script>
<style>
#app {
    width:100%;
    height:100%;
}
#app .top{
  width:100%;
  height:1rem;
  position:fixed;
  left:0;
  top:0;
  z-index:99;
}
#app .top .top-content{
  height:1rem;
  background-color:#ff6600;
  line-height:1rem;
  text-align:center;
}
#app .top .top-content .top-left{
  float:left;
  color:white;
  font-weight:bold;
  font-size:0.4rem;
  line-height:1rem;
  position:absolute;
  left:0.2rem;
  top:0;
}
#app .bottom{
  width:100%;
  height:1rem;
  position:fixed;
  left:0;
  bottom:0;
  z-index:99;
}
#app .bottom .tabbar{
  display:flex;
  justify-content:center;
  align-items:center;
  height:1rem;
}
#app .bottom .select{
  background-color:#ff6600;
  font-size:0.4rem;
  font-weight:bold;
  line-height:1rem;
  float:left;
  width:33%;
  height:1rem;
  display:flex;
  align-items:center;
  justify-content: center;
  padding:0;
}
#app .bottom .select img{
  border:none;
  width:45%;
  height:45%;
}
#app .bottom .select .app-tab-font{
  font-size:15px;
  color:white;
}
</style>
