window.Banner = function (id,url,duration,interval) {
    //this Banner的实例
    this.banner = document.getElementById(id);
    this.bannerInner = this.banner.getElementsByClassName('bannerInner')[0];
    this.focusList = this.banner.getElementsByClassName('focusList')[0];
    this.imgList = this.bannerInner.getElementsByTagName('img');
    this.list = this.focusList.getElementsByTagName('li');
    this.left = this.banner.getElementsByClassName('left')[0];
    this.right = this.banner.getElementsByClassName('right')[0];
    this.data = null;
    this.timer = null;
    this.time = 0;
    this.isClick = true;
    this.step = 0;
    this.url = url;
    if(duration > interval)[duration,interval]=[interval,duration];
    this.duration = duration || 1000;
    this.interval = interval || 2000;

    document.addEventListener('visibilitychange',()=>{
        if(document.visibilityState == 'hidden'){
            window.clearInterval(this.timer);
        }else{
            this.timer = window.setInterval(()=>{
                this.move();
            },this.interval);
        }
    })
};

Banner.prototype.getData = function () {
    //this当前实例
    //let _this = this;
    let xhr = new XMLHttpRequest();
    xhr.open('GET',this.url,false);
    xhr.onreadystatechange = ()=> {
        if(xhr.status == 200 && xhr.readyState == 4){
            this.data = JSON.parse(xhr.responseText);
        }
    };
    xhr.send(null);
};
Banner.prototype.bindHTML = function () {
    console.log(this.data);
    //this：当前实例
    let str1 = ``,str2 = ``;
    this.data.forEach((item,index)=>{
        str1 += `<div><img src="${item.src}" alt=""></div>`;
        str2 += index == 0 ? `<li class="selected"></li>` : `<li></li>`;
    });
    this.bannerInner.innerHTML = str1;
    this.focusList.innerHTML = str2;
    $.css(this.imgList[0].parentNode,'zIndex',1);
    this.imgList[0].animation({opacity:1},this.duration);
};

Banner.prototype.move = function () {
    //this->实例
    if(this.step == this.data.length -1){
        this.step = -1;
    }
    this.step++;
    this.imgChange();
};

Banner.prototype.autoMove = function () {
    //this->当前实例
    this.timer = window.setInterval(()=>{
        //箭头函数没有this，这里面的this是上一级的this是实例
        this.move();
    },this.interval);
    //只有指向了autoMove才会有自动轮播，才需要给Banner绑定鼠标滑过事件
    this.mouseEvent();
    return this;
}

Banner.prototype.imgChange = function () {
    let _this = this;//变量_this 当前实例
    let s = $.siblings(this.imgList[this.step].parentNode);
    for (let i = 0; i < s.length; i++) {
        $.css(s[i], 'zIndex', 0);
    }
    $.css(this.imgList[this.step].parentNode, 'zIndex', 1);
    this.imgList[this.step].animation({opacity: 1}, _this.duration, function () {
        //this：执行动画的元素
        for (let i = 0; i < _this.imgList.length; i++) {
            if (_this.imgList[i] !== this) {
                $.css(_this.imgList[i], 'opacity', 0);
            }
        }
        _this.isClick = true;
    });
    //焦点对齐
    for (let i = 0; i < this.list.length; i++) {
        this.list[i].className = i == this.step ? "selected" : "";
    }
}

//鼠标滑过
Banner.prototype.mouseEvent = function(){
    this.banner.onmouseover =()=> {
      window.clearInterval(this.timer);
    };
    this.banner.onmouseout =()=> {
        this.timer = window.setInterval(()=>{
        this.move();
    },this.interval)
    };
};
//左右切换
Banner.prototype.LRChange = function () {
    this.left.onclick = ()=> {
        if(this.isClick){
            this.isClick = false;
            if(this.step == 0){
                this.step = this.data.length;
            }
            this.step--;
            this.imgChange();
        }
    };
    this.right.onclick = ()=> {
        if(this.isClick){
            this.isClick = false;
            this.move();
        }
    };
    return this;
}

//焦点点击
Banner.prototype.focusChange = function () {
    for (let i = 0; i < this.list.length; i++) {
        this.list[i].onclick = ()=> {
            if(this.isClick){
                isClick = false;
                this.step = i;
                this.imgChange();
            }
        }
    }
    return this;
}
//初始化：获取数据绑定数据
Banner.prototype.init = function () {
    this.getData();
    this.bindHTML();
    return this;
};