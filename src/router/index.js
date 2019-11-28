import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/home'
import NewSong from '@/components/newSong/newSong'
import Rank from '@/components/rank/rank'
import Recommend from '@/components/recommend/recommend'
import Singer from '@/components/singer/singer'
import Search from '@/components/search/search'
import Player from '@/components/player/player'
import Mine from '@/components/mine/mine'
import NewSongTwo from '@/components/newSong/newSongTwo'
import RankTwo from '@/components/rank/rankTwo'
import RecommendTwo from '@/components/recommend/recommendTwo'
import SingerTwo from '@/components/singer/singerTwo'
import Login from '@/components/mine/login'
import Broadcast from '@/components/broadcast/broadcast'
import BroadcastTwo from '@/components/broadcast/broadcastTwo'
import BroadThree from '@/components/broadcast/broadcastThree'
import Comment from '@/components/comment/comment'
import SingerList from '@/components/singer/singerList'
import SingerAlbum from '@/components/singer/singerAlbum'
import SingerIntroduce from '@/components/singer/singerIntroduce'
import AlertList from '@/common/alertList'
// import { listenerCount } from 'cluster';
Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',  //默认;
      name: 'Home',
      component: Home
    },
    // {
    //   path: "/home",  //主页;
    //   name: "Home",
    //   component:Home
    // },
    {
      path: '/home/newsong',  //新碟上架;
      name: 'NewSong',
      component: NewSong
    },
    {
      path: '/home/newsong/:id',  //新碟上架二层;
      name: 'NewSongTwo',
      component:NewSongTwo
    },
    {
      path: '/home/broadcast',    //电台;
      name:'Broadcast',
      component: Broadcast
    },
    {
      path: '/home/broadcast/:id',    //电台二层;
      name:'BroadcastTwo',
      component: BroadcastTwo
    },
    {
      path: '/home/broadcast/detail/:id',  //电台三层;
      name: 'BroadcastThree',
      component: BroadThree
    },
    {
      path: '/home/rank',   //排行榜;
      name: 'Rank',
      component: Rank
    },
    {
      path: '/home/rank/:index',   //排行榜二层;
      name: 'RankTwo',
      component: RankTwo
    },
    {
      path: '/home/recommend',  //推荐;
      name: 'Recommend',
      component: Recommend
    },
    {
      path: '/home/recommend/:id&:mine?ismine',  //推荐二层;
      name: 'RecommendTwo',
      component:RecommendTwo,
    },
    {
      path: '/home/singer',   //歌手;
      name: 'Singer',
      component: Singer
    },
    {
      path: '/home/singer/:id',   //歌手二层;
      component: SingerTwo,
      children: [
        {
          path:'',      //默认界面;
          component: SingerList
        },
        {
          path:'list',    //单曲列表界面;
          name: 'SingerList',
          component: SingerList
        },
        {
          path:'album',   //歌手专辑界面;
          name: 'SingerAlbum',
          component:SingerAlbum
        },
        {
          path: 'introduce',    //歌手介绍界面;
          name: 'SingerIntroduce',
          component:SingerIntroduce
        },
      ]
    },
    {
      path: '/home/search',    //搜索;
      name: 'Search',
      component: Search
    },
    {
      path: "/player/:id",    //播放器;
      name: "Player",
      component: Player
    },
    {
      path: "/home/mine",  //我的;
      name: "Mine",
      component: Mine
    },
    {
      path: "/home/login/:id",  //我的;
      name: "Login",
      component: Login
    },
    {
      path: "/home/commont/:id&:name",   //评论;
      name: "Comment",
      component: Comment
    },
    {
      path: "/home/alertlist/:id&?isdj",    //添加歌单页面;
      name: "AlertList",
      component: AlertList   
    }
  ]
})
