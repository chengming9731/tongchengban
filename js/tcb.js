/**
 * Created by YZTC on 2017/6/7.
 */
$(function () {
// 顶部
    $(".has-sub").on('mouseover',function () {
        $(".has-sub").css({
            "width": "74px",
            "display": "block",
            "border": "1px solid #999",
            "background": "#fff"
        });
        $(".sub").css({
            "width":"48px",
            "margin-left": "10px",
            "display": "block"
        })
    });
    $(".has-sub").on('mouseout',function () {
        $(".has-sub").css({
            "background": "#f7f7f7",
            "border":"1px solid transparent",
            "border-bottom":"1px solid #c7c7c7"
        });
        $(".sub").css({
            "display": "none"
        })
    });
//  轮播图
    var mySwiper = new Swiper(".swiper-container",{
        loop:true,
        autoplay:1000,
        // 如果需要分页器
        pagination: '.swiper-pagination',
        autoplayDisableOnInteraction:false
    });

// 隐藏菜单
    $.getJSON("json/problem.json",function (res) {
        index(res.result);
    });
    function index(arr) {
        for(var i=0; i<arr.length; i++){
            var obj1 = arr[i];
            var text = obj1.name;
            var divs = $("" +
                "<div class='row'>" +
                "<div class='left-fixed'>"+text+"<span>></span></div>" +
                "<div class='right-cnt'></div>" +
                // "<div class='right-cnt'><a href='javascript:'></a><a href='javascript:'></a><a href='javascript:'></a><a href='javascript:'></a></div>" +
            "</div>");

           for(var k=0; k<obj1.list.length; k++){
               var obj2 = obj1.list[k];
               var a = $("<a href='#'></a>");
               // a.text(obj2.name);
               // 插标签
               divs.find('.right-cnt').append(a);
               // 插内容
               divs.find('a').eq(k).text(obj2.name);
           }
            $(".list-sub").append(divs);
        }
    }

    // 鼠标移入显示菜单
    $(".cate-list-main>.pngfix").on("mouseover",function () {
        $(".list-sub").show();
        $(this).css('background','#185')
    });
    $(".cate-list-main>.pngfix").on('mouseout',function () {
        $(".list-sub").hide();
        $(this).css({
            'background':'url(https://p.ssl.qhimg.com/t01c035e0988a964a21.png) no-repeat 0 0'
        })
    });
    $(".list-sub").on("mouseover",function () {
        $(this).show();
    });
    $(".list-sub").on("mouseout",function () {
        $(this).hide();
    });

//  热门手机回收
    $.getJSON("json/returnphone.json",function (res) {
        shouji(res.result);
    });
    function shouji(arr) {
        for(var i=0; i<arr.length; i++){
            var obj1 = arr[i];
            var asbq = $("<a href='javascript:'><div class='p-img'><img src=''></div><div class='p-name'></div></a>");
            asbq.find('img').attr('src',obj1.img_url);
            asbq.find('div').eq(1).text(obj1.model_alis);
            $(".item-first").eq(i).append(asbq)
        }
    }

//  点击显示地图
    $(".extra").on("click",function () {
        $(".mask").show();
        $(".zezao").show();
    });
    // 点击隐藏地图
    $(".close").on("click",function () {
        $(".mask").hide();
        $(".zezao").hide();
    });

    // 显示地图
    var arrMarkers = [];
    var map = new AMap.Map('cont',{
        zoom: 11
    });

//  数据请求
    $.getJSON('json/店家信息0.json',function(res){
        initData(res);
    });
    function initData(res){
        var arr = res.shop_data;
        //分页数
        var pageCount = res.page_count;
//  店家信息
        for(var i=0; i<arr.length; i++) {
            var shop_ico = arr[i].shop_ico;  // 图
            var shop_name = arr[i].shop_name; // 店名
            var main = arr[i].main;  // 主营
            var addr = arr[i].addr;  // 地址
            $(".shop-list .list-item").eq(i).find('img').attr('src',shop_ico);
            $(".shop-list .cout").eq(i).find('a').eq(0).text(shop_name);
            $(".shop-list .cout .desc").eq(i).text('主营 : '+main);
            $(".shop-list .cout .addr").eq(i).text('地址 : '+addr);

            // 根据数据创建相应的marker
            var marker = new AMap.Marker({
                position:[arr[i].map_longitude, arr[i].map_latitude],
                map:map,
                icon:"https://p.ssl.qhimg.com/t01647448c59c844934.png"
            });
            arrMarkers.push(marker);
            // 绑定点击事件,弹出信息窗体
            (function (k) {
                marker.on("click",function () {
                    //创建信息窗体
                    var infowdow = new AMap.InfoWindow({
                        content:"<div class='mapinfo'><div class='mp-hd'>"+arr[k].shop_name+"</div><div class='mp-bd'><p>"+arr[k].main+"</p><p>"+arr[k].addr+"</p><p class='mp-shop'></p></div></div>"
                    });
                    infowdow.open(map, [arr[k].map_longitude, arr[k].map_latitude]);
                })
            })(i)
        }

        //设置分页
        $('#page').Page({
            totalPages: pageCount,//总页数
            liNums: 5,//分页的数字按钮数(建议取奇数)
            activeClass: 'active' ,//active类
            firstPage: '首页',//首页按钮名称
            lastPage: '末页',//末页按钮名称
            prv: '«',//前一页按钮名称
            next: '»',//后一页按钮名称
            hasFirstPage: true,//是否有首页按钮
            hasLastPage: true,//是否有末页按钮
            hasPrv: true,//是否有前一页按钮
            hasNext: true,//是否有后一页按钮
            callBack : function(page){
                $('#list').empty();
                $.getJSON('json/店家信息'+ (page-1) +'.json',function(res){
                    var arr = res.shop_data;
                    for(var i=0; i<arr.length; i++){
                        var shop_ico = arr[i].shop_ico;  // 图
                        var shop_name = arr[i].shop_name; // 店名
                        var main = arr[i].main;  // 主营
                        var addr = arr[i].addr;  // 地址
                        $(".shop-list .list-item").eq(i).find('img').attr('src',shop_ico);
                        $(".shop-list .cout").eq(i).find('a').eq(0).text(shop_name);
                        $(".shop-list .cout .desc").eq(i).text('主营 : '+main);
                        $(".shop-list .cout .addr").eq(i).text('地址 : '+addr);
                    }
                })
            }
        });


        //设置地图上的分页
        //用的是另一个插件
        var result = [];
        for(var k=0; k<pageCount*5; k++){
            result.push(k);
        }
        //地图的分页用pagination
        $('.page').pagination({
            dataSource:result,
            pageSize:5,
            callback:function(a){
                var pageNum = a[0]/5;
                map.remove(arrMarkers);
                arrMarkers = [];
                $.getJSON('json/店家信息'+ pageNum +'.json',function(res){
                    for(var i=0; i<res.shop_data.length; i++) {
                        var arr = res.shop_data;
                        // 根据数据创建相应的marker
                        var marker = new AMap.Marker({
                            position:[arr[i].map_longitude, arr[i].map_latitude],
                            map:map,
                            icon:"https://p.ssl.qhimg.com/t01647448c59c844934.png"
                        });
                        arrMarkers.push(marker);
                        // 绑定点击事件,弹出信息窗体
                        (function (k) {
                            marker.on("click",function () {
                                //创建信息窗体
                                var infowdow = new AMap.InfoWindow({
                                    content:"<div class='mapinfo'><div class='mp-hd'>"+arr[k].shop_name+"</div><div class='mp-bd'><p>"+arr[k].main+"</p><p>"+arr[k].addr+"</p><p class='mp-shop'></p></div></div>"
                                });
                                infowdow.open(map, [arr[k].map_longitude, arr[k].map_latitude]);
                            })
                        })(i)
                    }
                })
            }
        })
    }

//  城市切换
    $.getJSON("json/city.json",function (res) {
        initCity(res.result.hotcity);
        initCitypy(res.result.citylist);
    });
    // 热门城市
    function initCity(arr) {
        for(var i=0; i<arr.length; i++){
            var a = $("<a href='javascript:'></a>");
            a.text(arr[i].name);
            $(".city-list>ul>li").eq(0).append(a);
        }
    }
    // 拼音
    function initCitypy(obj) {
        // 添加字母
        for(var kay in obj){
            var a = $("<a href='javascript:'>"+kay+"</a>");
            $(".filter_bar").append(a);
            //添加点击事件
            $(".filter_bar>a").on("click",function () {
                $(this).removeClass("");
                $(this).addClass("current");
                $(this).siblings().addClass("");
                $(this).siblings().removeClass("current")
            });
            //切换字母对应城市
            $(".city_wrap").empty();
            var curren = $(this).find('a').text();
            var arrCity = obj[curren];
          //  console.log(arrCity);
        }
        // 初始化状态
        $(".filter_bar").find('a').eq(0).addClass('current');

    }




});