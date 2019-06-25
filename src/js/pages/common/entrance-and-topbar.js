/**
 * @description 顶部入口和菜单栏
 * @author zhengshneli
 * @createAt 2018-02-01
 */
var _GLOBAL = require('tool/global');
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
$(function () {

    /**
     * 顶部菜单栏数据
     * title是菜单标题
     * url为null时不进行跳转
     * 
     */
    
    var arr_demo1 = [{
            title: '家长学校',
            url: 'video/video-list.html'
        },
        {
            title: '作文百分榜',
            url: 'high-mark/high-mark.html'
        },
        {
            title: '作文助手',
            url: 'play/play-free.html'
        },
        {
            title: '客服中心',
            url: 'service/customer-service.html'
        }
    ];
    // 菜单栏列表jQuery对象
    var $topbar_list = $('.topbar-contaienr .topbar-nav .list');

    // 在上述列表中添加菜单数据
    arr_demo1.forEach((item, index) => {
        $topbar_list.append(`
            <div class="item">
                <a href="${item.url ? _HOST.root + item.url :'javascript:;'}" target="_blank">${item.title}</a>
            </div>
        `);
    });


    // 判断顶部的区域要显示的登录还是个人中心
    // 根据是否登录来判断
    if (!sessionStorage.getItem('user_type')) {
        $('.entrance-container').find('.login-entrance').addClass('show').siblings('.item').removeClass('show');
    } else {
        $('.entrance-container').find('.user-center-entrance').addClass('show').siblings('.item').removeClass('show');
    }

    // 点击个人中心，跳转到个人中心首页
    // type:
    //   1:学生个人中心。2：教师个人中心
    $('.entrance-container').find('.user-center-entrance').on('click', (e) => {
        if (sessionStorage.getItem('user_type') == 1) {
            location.href = _VIEW.user_center.student.index;
        } else if (sessionStorage.getItem('user_type') == 2) {
            location.href = _VIEW.user_center.teacher.index;
        }
    })

    // 前端获取LOGO
    $.ajax({
        type: "post",
        url: _HOST.add_rort + _HOST.logo.url,
        data: {
        },
        success: function (res) {
            // console.log(res)
            if (res.Result) {
                $('.topbar-logo').find('a').append(`
                    <img src="${res.Data[0].Url}" alt="" >             
                `) 
            }
        }
    });
})