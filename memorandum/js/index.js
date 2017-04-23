

$(function () {

    /*1.获取当前导航条距离窗口的y值*/
    var nav_top = $('.nav').offset().top;

    /*2.监听窗口的滚动*/
    $(window).on('scroll',function () {

        /*2.1 获取当前滚动的top方向偏移量*/
        var scroll_top = $(window).scrollTop();

        /*2.2 如果滚动的偏移量大于导航距离顶部的高度*/
        if (scroll_top > nav_top) {

            /*2.2.1 把导航的定位设置为fixed*/
            $('.nav').css({
                'position':'fixed',
                'top':0,
                'box-shadow':'0 1px 3px rgba(0, 0, 0, .3)'
            });

            /*2.2.2 把图片的透明度改为1,让其显示*/
            $('.nav img').css({opacity:1});

        }else {
            /*2.2.3 把导航的定位设置为absolute  */
            $('.nav').css({
                'position':'absolute',
                'top':nav_top,
                'border-bottom':'none',
                'box-shadow':'none'
            });
            
            /*2.2.4 把图片的透明度改为0,让其变透明*/
            $('.nav img').css({opacity:0});
        }

    });

    /*
     * 二.处理tab标签切换
     * */
    /*1.监听tab点击*/
    $('.header li').click(function () {
        $(this).addClass('cur').siblings().removeClass('cur');
        /*2.切换内容*/
        /*2.1 获取当前点击的角标*/
        var index = $(this).index();
        /*2.1 根据角标,查找到对应的内容*/
        $('.list_body').eq(index).addClass('active').siblings().removeClass('active');

    });

    /*
    * 三.处理返回顶部逻辑
    * */
     /*1.指定一个值*/
    var ori_num = 100;
     /*2.监听窗口滚动*/
    $(window).on('scroll',function () {
        /*2.1 如果当前滚动值大于窗口的高度, 让其显示否则隐藏*/
        var scroll_top  = $(window).scrollTop();

        if (scroll_top > ori_num) {
            $('.back_top').stop().fadeTo(200,1);
        }else {
            $('.back_top').stop().fadeTo(200,0);
        }

    });

     /*3.监听返回顶部点击*/
    $('.back_top').click(function () {
        /*3.1 让窗口滚动到顶部*/
        $('html body').animate({scrollTop:0});
    });

    /*
    * 四.添加任务
    * */
    /*初始化*/
    var itemArray; //保存所有的item
    /*初始化*/
    function init() {

        /*初始化数据,从本地获取数据.把获取的数给数据*/
        itemArray = store.get('itemArray') || [];

        /*渲染View*/
        rend_view();

        /*让列表下拉展示*/
        $('.task li').hide().slideDown();

    }
    init();
    /*
    * 保存数据到本地, 并渲染View
    * */
    function rend_view() {
        /*保存数据到本地*/
        store.set('itemArray',itemArray);
        console.log(itemArray);
        /*清空以前的内容*/
        $('.task').empty();
        $('.finish_task').empty();

        /*刷新界面 */
        for(var i = 0; i < itemArray.length;i++){

            var item = itemArray[i];
            if (item== undefined || !item) {
                continue;
            }

            /*创建模板标签*/
            var tpl = '<li class="item" data-index="'+i+'">'+
                '<input type="checkbox" '+(item.checked?'checked':'')+'>'+    /*设置选中状态*/
                '<span class="item_content">'+item.title+'</span>'+
                '<span class="del">删除</span>'+
                '<span class="detail">详情</span>'+
                '</li>';

            /*如果为check则添加在已经完成当中*/
            if (item.checked) {
                
                $('.finish_task').prepend($(tpl));

            }else {

                $('.task').prepend($(tpl));
            }
        }
    }


    /*2.监听添加按钮点击*/
    $('input[type=submit]').on('click',function (e) {
        /*阻止事件默认行为*/
        e.preventDefault();

        /*获取输入的内容*/
        var content = $('input[type=text]').val();
        if($.trim(content) == '') {
            alert("请输入内容");
            return;
        }
        $('input[type=text]').val("");
        var newItem = {
            title : '',
            checked : false,
            content : '',
            time : '',
            is_notice:false
        };
        newItem.title = content;

        /*保存输入的内容*/
        itemArray.push(newItem);
        /*渲染View*/
        rend_view();
        /*让添加的第一个下拉展示*/
        $('.task li:first').hide().slideDown();
    });


    /*
    * 五.监听删除按钮点击
    * 注意, 是使用事件委托的方式添加事件的. 因为
    * */
    $('.list_body').on('click','.del',function () {
        /*获取当前点击item*/
        var item = $(this).parent();

        /*获取当前点击所在的角标*/
        var index = item.data('index');

        /*冗错处理*/
        if (index == undefined || !itemArray[index])return;
        /*itemArray数组当中删除指定的index元素*/

        /*
        * delete删除掉数组中的元素后，会把该下标出的值置为undefined,数组的长度不会变
        * */
        delete itemArray[index];

        item.slideUp();
        $(this).parent().remove();

        /*保存到本地*/
        store.set('itemArray',itemArray);
    });

    /*
    * 六.监听执行框点的点击
    * */
    $('.list_body').on('click',"input[type=checkbox]",function () {

        /*获取当前点击item*/
        var item = $(this).parent();
        /*获取item标签当中绑定的data-index*/
        var index = item.data('index');
        /*根据index获取对应的item对象*/
        var item = itemArray[index];

        /*判断当前是否为选中状态*/
        var isCheck = $(this).is(':checked');

        /*设置状态*/
        item.checked = isCheck;

        /*刷新视图*/
        rend_view();


    });


    /*设置日期选择框*/
    $.datetimepicker.setLocale('ch');//设置中文
    $('.date_time').datetimepicker();//显示日期

    /*
    * 七.监听详情弹出
    * */
    var update_index;
    $('.list_body').on('click','.detail',function () {

        /*弹出详情*/
        $('.mask').fadeIn();
        /*获取当前点击item*/
        var item = $(this).parent();
        /*获取item标签当中绑定的data-index*/
        var index = item.data('index');
        update_index = index;
        /*根据index获取对应的item对象*/
        var item = itemArray[index];
        /*设置详情内容*/
        $('.detail_title').text(item.title);
        $('.detail_body textarea').val(item.content);
        $('.date_time').val(item.time);
        console.log(item.time);

    });

    $('.mask').click(function () {
        $(this).fadeOut();
    });
    $('.content_detail').click(function (e) {
        /*阻止事件冒泡*/
        e.stopPropagation();
    });
    $('.close').click(function () {
        $('.mask').fadeOut();
    });


    /*
    * 第八 点击更新按钮
    * */
    $('#update').click(function () {

        /*更新数据*/
        /*获取当前的index*/
        var item = itemArray[update_index];
        item.content =  $('.detail_body textarea').val();
        item.time = $('.date_time').val();
        itemArray[update_index] = item;
        item.is_notice = false;
        rend_view();
        $('.mask').fadeOut();

    });


    /*第九 提醒功能*/
    setInterval(function () {

        for(var i = 0; i < itemArray.length;i++){
            var item = itemArray[i];

            if (!item || item.time.length < 1 || item.is_notice) {
                continue;
            }

            var cur_time = (new Date()).getTime();
            var item_time = new Date(item.time).getTime();
            /*提醒*/
            if (cur_time - item_time >= 1) {
                item.is_notice = true;
                itemArray[i] = item;
                rend_view();
                notice(item.title);
            }
        }

    },300);
    
    function notice(title) {
        $('.notice_title').text(title)
        $('.notice').slideDown();
        $('video').get(0).loop = "loop";
        $('video').get(0).play();

    }

    $('.notice button').click(function () {
        $(this).parent().slideUp();
        $('video').get(0).pause();
    });



});
