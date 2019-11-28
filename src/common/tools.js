//公用方法;
/*
    数组位置切换;
    index: 0 -- 0->0
           1 -- 0->last
           2 -- last->last
           3 -- last->0
*/
const changeArray = (arr, index) => {
    var _arr;
    switch(index) {
        case 0:
            _arr = arr.shift();
            arr.unshift(_arr);
            break;
        case 1:
            _arr = arr.shift();
            arr.push(_arr);
            break;
        case 2:
            _arr = arr.pop();
            arr.push(_arr);
            break;
        case 3:
            _arr = arr.pop();
            arr.unshift(_arr);
            break;
        default:
            arr.push(0);
            arr.pop();
            break;
    }
    var _arr;
    if(index >= 0) {    //指定切换状态;
        _arr = arr.pop();
        arr.unshift(_arr);
    }else {     //自动状态;
        _arr = arr.pop();
        arr.push(_arr);
    }
}
/*
    获取窗口宽度;
*/
const getWidth = () => {
    return document.documentElement.clientWidth;
}
/*
    获取窗口高度;
*/
const getHeight = () => {
    return document.documentElement.clientHeight;
}
/*
    碰撞检测;
 */
const impactCheck = (obj1, obj2) => {
    if(obj1.x <= (obj2.x + obj2.w) && (obj1.x + obj1.w) >= obj2.x && obj1.y <= (obj2.y + obj2.h) && (obj1.y + obj1.h) >= obj2.y) {
        return true;
    }
    return false;
}
/** 
 * 
 * 圆形碰撞检测;
*/
const circleCheck = (obj1, obj2) => {
    if(Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2)) < (obj1.w / 2 + obj2.w / 2)) {
        return (obj1.w / 2 + obj2.w / 2) - (Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2)));
    }
    return false;
}
/**
 * 生成范围内随机数;
 */
const retNumForArea = (maxNum,minNum) =>{                          
	var x = Math.floor(Math.random()*(maxNum-minNum+1)+minNum);
	return x;
}
/**
 * 数据即时改变;
 */
const dataChange = (arr) => {
    var _arr;
    _arr = arr.pop();
    arr.push(_arr);
}
/**
 * 数据获取;
 */
const getData = (proxy, url, success, error) => {
    proxy.$axios(url).
    then(res => {
        success(res);
    }).
    catch(err => {
        error(err);
    });
}
/**
 * 设置缓存;
 */
const setItem = (key,value) => {
    var curTime = new Date().getTime();
    localStorage.setItem(key,JSON.stringify({data:value,time:curTime}));
}
/**
 * 获取缓存;
 */
const getItem = (key, exp=86400000) => {
    var data = localStorage.getItem(key);
    var dataObj = JSON.parse(data);
    if(!data) {
        return null;
    }
    if (new Date().getTime() - dataObj.time > exp) {
        removeItem(key);
        return null;
    }else{
        var dataObjDatatoJson = dataObj.data;
        return dataObjDatatoJson;
    }
}
/**
 * 置顶;
 */
const toTop = (speed=100, callback) => {
    var scrollTop = document.documentElement.scrollTop;
    var timer = setInterval(() => {
        if(document.documentElement.scrollTop > 0) {
            scrollTop -= speed;
            document.documentElement.scrollTo(0, scrollTop);
        }else {
            clearInterval(timer);
            document.documentElement.scrollTo(0, 0);
            callback();
        }
    }, 1000 / 60);
}
/**
 * 删除缓存;
 */
const removeItem = (key) => {
    localStorage.removeItem(key);
}
/**
 *  通用检测url是否可用;
 */
const toPlayer = (id, proxy) => {
    const url = `http://localhost:3000/check/music?id=${id}`;
    getData(proxy, url, res => {
        const mes = res.data.message,
            success = res.data.success;
        if(success) {
            proxy.$router.push({name: "Player", params: {id}});
        }else {
            proxy.$toast({
                message: mes,
                position: 'middle',
                duration: 2000
            });
        }
    }, err => {
        proxy.$toast({
            message: "这是vip歌曲",
            position: 'middle',
            duration: 2000
        });
    });
}
const addStatus = () => {
    return '+';
}
/**
 * 判断是否登录;
 */
const isLogin = (key, time) => {
    if(getItem(key, time, false)) {
        this.$store.commit('login', true);
    }else {
        this.$store.commit('login', false);
    }
}
/**
 * 判断输入字符串是否全为空格;
 */
const isSpace = (str) => {
    if ( str == "" ) {
        return true;
      }
      var regu = "^[ ]+$";
      var re = new RegExp(regu);
    return re.test(str);
}
export{
    changeArray,
    getWidth,
    getHeight,
    impactCheck,
    retNumForArea,
    circleCheck,
    dataChange,
    getData,
    toTop,
    setItem,
    getItem,
    removeItem,
    toPlayer,
    addStatus,
    isLogin,
    isSpace
}