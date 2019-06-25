/**
 * @description 用户个人中心左侧菜单栏点击事件
 * @author zhengshenli
 * @createAt 22018-03-09
 */
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {
    
    // li jQuery对象
    var $lis = $('.user-center-wrap .left-container ul').find('li');
    // console.log($lis)
    // 右边可变化的内容
    var $right_container = $('.user-center-wrap .right-container');
    // 左边的nav
    var $left_container = $('.user-center-wrap .left-container');

    // 设置右边的最小高度
    $right_container.css('min-height', $left_container.outerHeight());

    // 控制左侧nav显示
    if (sessionStorage.getItem('user_type') == 1) {
        $left_container.find('.student-nav-wrap').css('display', 'block').siblings('.change-nav-wrap').css('display', 'none');
    } else if (sessionStorage.getItem('user_type') == 2) {
        $left_container.find('.teacher-nav-wrap').css('display', 'block').siblings('.change-nav-wrap').css('display', 'none');
    }



    // 点击左侧nav,跳转到指定的页面
    $lis.on('click', (e) => {
        let $this = $(e.currentTarget);

        let url = $this.data('url');

        location.href = _HOST.root + url;
    });

    // 如果侧边栏`li`的 data-url 和 右侧的 `.right-contaienr` data-url 相等，则此侧边栏的样式为active状态
    // `.right-contaienr`的data-url需要在具体的页面里设置，如studetn-user-center.html页面找到 `.right-container`进行设置
    $lis.each((index, ele) => {
        let $this = $(ele);
        if ($this.data('url') === $right_container.data('url')) {
            // console.log($this.data('url'))
            $this.addClass('active').siblings().removeClass('active');
            return false;
        }
    });
    function IsAudit () {
        setTimeout(() => {
            let IsAudit = sessionStorage.getItem('IsAudit')
        if (!IsAudit) {
            console.log("隐藏")
            // // $lis.eq(2).css("display","none")
            // $lis.eq(1).hide()
            // teacher/teacher-comments-composition.html teacher/teacher-comments-record.html
            $lis.each((index, ele) => {
                let $this = $(ele);
                if ($this.data('url') ==="teacher/teacher-comments-composition.html") {
                    $this.css('display','none')
                    // return false;
                }
                if ($this.data('url') ==="teacher/teacher-comments-record.html") {
                    $this.css('display','none')
                    return false;
                }
            });
        }
        }, 100);
    }
    IsAudit ()


    // $('#student-password-mod').click(function (e) {
    //     e.preventDefault()
    //     window.location.href = _VIEW.password.to;
    // })
});