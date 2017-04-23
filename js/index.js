

window.onload = function () {
        // 0. 求出屏幕的尺寸
        var screenW = document.documentElement.clientWidth;
        var screenH = document.documentElement.clientHeight;

        /*alert(screenW + ',' + screenH);*/

        // 1. 动态创建星星
        for(var i=0; i<150; i++){
            var span = document.createElement('span');
            document.body.appendChild(span);

            // 1.1 随机坐标
            var left = Math.random() * screenW;
            var top = Math.random() * screenH;
            span.style.left = left + 'px';
            span.style.top = top + 'px';

            // 1.2 随机的缩放
            var scale = Math.random() * 2;
            span.style.transform = 'scale('+ scale +', '+ scale +')';

            // 1.3 频率
            var rate = Math.random() * 1.5;
            span.style.animationDelay = rate + 's';
        }
        //设置主体内容高度
       document.getElementsByClassName("con")[0].style.height = screenH - 64 + "px";

}

