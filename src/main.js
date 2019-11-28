// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import _defaultCss from './common/默认样式清除.css'
import {getWidth, getHeight} from './common/tools.js'
import store from './store/store'
import Axios from 'axios'
import moment from 'moment'
import { Header, 
  Button, 
  Tabbar, 
  Navbar,
  TabItem, 
  Spinner, 
  Swipe, 
  SwipeItem,
  Loadmore,
  Search,
  InfiniteScroll,
  Toast,
  Cell,
  MessageBox,
  Popup
} from 'mint-ui';
import 'mint-ui/lib/style.css'    //mint-ui的css样式;
Vue.component(Header.name, Header); //顶部固定栏;
Vue.component(Tabbar.name, Tabbar);  //底部固定栏;
Vue.component(TabItem.name, TabItem);  //底部固定栏选项;
Vue.component(Button.name, Button);  //按钮;
Vue.component(Spinner.name, Spinner); //加载;
Vue.component(Swipe.name, Swipe);   //轮播图;
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Loadmore.name, Loadmore); //懒加载;
Vue.component(Search.name, Search); //搜索栏;
Vue.component(Navbar.name, Navbar);
Vue.component(Cell.name, Cell);
Vue.component(Popup.name, Popup);
Vue.config.productionTip = false
Vue.prototype.$axios = Axios
Vue.prototype.$toast = Toast;
Vue.prototype.$messageBox = MessageBox
Vue.use(InfiniteScroll);  //无限滚动;
Vue.filter('musicTime', function(arg) {
  return moment(arg).format("mm:ss");
});
Vue.filter("getTime", function(arg) {
  moment.locale('zh-cn');
  return moment(arg).format("MMMDD日");
});
Vue.filter("setNum", function(arg, unit=1) {  
  var result;
  switch(unit) {
    case 1: result = arg; break;
    case 4: result = arg / 10000 + '万';break;
    case 5: result = arg / 100000 + '十万'; break;
    case 6: result = arg / 1000000 + '百万'; break;
    case 7: result = arg / 10000000 + '千万'; break;
    case 8: result = arg / 100000000 + '亿'; break;
  }
  return result;
});
Vue.filter("setTextContent", function(arg, defaultText) {
  if(document.documentElement.scrollTop > 0 && arg) {  
    return arg;
  }else {
    return defaultText;
  }
});
Vue.filter('setTextLen', function(arg, important=false) {   //控制文字长度;
  if(!typeof arg === "string") {
    return;
  }
  var limit = 12;
  if(important) {
    limit = 15;
  }
  if(arg.length > limit) {
    return (arg.substr(0, limit) + '...');
  }else {
    return arg;
  }
});
Vue.filter('ago', function(arg) {
  moment.locale('zh-cn');
  var now = new Date().getTime(),
      date = moment(arg);
  return date.from(now);
});
Vue.directive("drag", function(el, binding) {   //自定义组件--拖拽;
    var arg = {};
    el.ontouchstart = function(e) {
        var prevLeft = e.changedTouches[0].clientX,
            prevTop = e.changedTouches[0].clientY,
            offLeft = prevLeft - this.offsetLeft,
            offTop = prevTop - this.offsetTop,
            nowLeft = 0,
            nowTop = 0,
            _x = 0,
            _y = 0,
            areaX = 0,
            areaY = 0,
            moveX = prevLeft,
            moveY = prevTop;
        arg = {
          index: binding.value['index'], 
          x: this.offsetLeft, 
          y: this.offsetTop
        };
        binding.value['dragStart'](arg);
        document.ontouchmove = function(e) {
            nowLeft = e.changedTouches[0].clientX;
            nowTop = e.changedTouches[0].clientY;
            _x = nowLeft - offLeft;
            _y = nowTop - offTop;
            areaX += Math.abs(moveX - nowLeft);
            areaY += Math.abs(moveY - nowTop);
            moveX = nowLeft;
            moveY = nowTop;
            if(_x <= 0) {
              _x = 0;
            }else if(_x + el.offsetWidth >= getWidth()) {
                _x = getWidth() - el.offsetWidth;
            }
            if(_y <= 0) {
              _y = 0;
            }else if(_y + el.offsetHeight >= getHeight() - 50){
              _y = getHeight() - 50 - el.offsetHeight;
            }
            arg['x'] = _x;
            arg['y'] = _y;
            binding.value['dragMove'](arg);
            el.style.left = _x / 50 + 'rem';
            el.style.top = _y / 50 + 'rem';
        };
        document.ontouchend = function(e) {
          document.ontouchmove = false;
          if(Math.sqrt(Math.pow(areaX, 2) + Math.pow(areaY, 2)) <= 2) {
              binding.value['dragEnd'](binding.value.index, true);
          }else {
              binding.value['dragEnd'](binding.value.index, false);
          }
          document.ontouchend = false;
          return false;
        }
    };
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
