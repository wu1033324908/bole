/**
 * @description 用户个人中心首页
 * @author zhengshenli
 * @createAt 2018-03-09
 */
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {
    // 设置html属性 fontsize
    $.setPageFontSize();
    // 设置fotter margin-top
    $.setFooterMargin();

    getUserInfo();

    /**
     * 显示用户的信息
     */
    function showUserInfo() {
        // 我的信息
        $('.home .user-info').find('.nick-name').text(sessionStorage.getItem('user_nick_name'));
        $('.home .user-info').find('.tel').text(sessionStorage.getItem('user_tel'));
        $('.home .user-info').find('.email').text(sessionStorage.getItem('user_email'));
        
        // 学习进度
        $('.home .study-schedule').find('.stage').text(sessionStorage.getItem('stage_desc'));
        $('.home .study-schedule').find('.section').text(sessionStorage.getItem('section_desc'));

    }

    // 点击修改资料按钮，前往我的信息页面
    $('.btn-modify-user-info').click((e) => {
        location.href = _HOST.root + 'user/user-complete-info.html';
    })

    
    /**
     * 页面加载后，获取用户的数据
     */
    function getUserInfo() {
        $.ajax({
            url: _HOST.add_rort + _HOST.user.student.get_info,
            type: 'POST',
            data: {
                id: sessionStorage.getItem('user_id')
            },
            success: function (res) {
                if (res.Result) {
                    // 将用户数据存储在sessionStorage中
                    sessionStorage.setItem( 'user_type', res.Data[0].Type)
                    sessionStorage.setItem('user_nick_name', res.Data[0].NickName)
                    sessionStorage.setItem('user_province', res.Data[0].AddressCapital)
                    sessionStorage.setItem('user_city', res.Data[0].AddressDistrict)
                    sessionStorage.setItem('user_email', res.Data[0].Mail)
                    sessionStorage.setItem('user_grade', res.Data[0].Grade)
                    sessionStorage.setItem('course_id', res.Data[0].CourseId);
                    sessionStorage.setItem('section_desc', res.Data[0].CouresDescribe);
                    sessionStorage.setItem('stage_desc', res.Data[0].StageDescribe);
                    
                    // 用户数据存储成功后，显示用户信息
                    showUserInfo();
                }
            }
        })
    }

    // 点击开始学习按钮，前往学些界面
    $('.right-container .study-schedule').find('.btn-goto-study').on('click', (e) => {
        location.href = _HOST.root + 'play/play.html';
    })

});