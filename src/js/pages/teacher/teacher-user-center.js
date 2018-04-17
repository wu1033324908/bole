/**
 * @description 教师个人中心首页
 * @author zhengshenli
 * @createAt 2018-03-09
 */
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {
    // 加载遮罩层
    var $loading = $('.right-container');
    $.pageLoading($loading);

    init();

    function init() {


        getUserInfo();

        // 点击修改资料按钮，前往我的信息页面
        $('.btn-modify-user-info').click((e) => {
            location.href = _VIEW.user_center.teacher.complete_info;
        });
        // 点击批改作文按钮，前往批改作文页面
        $('.btn-goto-comments').click((e) => {
            location.href = _VIEW.user_center.teacher.comments;
        });
        // 点击批改记录按钮，查看已经批改过的记录
        $('.btn-goto-comments-record').click((e) => {
            location.href = _VIEW.user_center.teacher.comments_record;
        });
    }

    /**
     * 显示用户的信息
     */
    function showUserInfo() {
        // 我的信息
        $('.home .user-info').find('.nick-name').text(sessionStorage.getItem('user_nick_name') || '');
        $('.home .user-info').find('.tel').text(sessionStorage.getItem('user_tel'));
        $('.home .user-info').find('.official').text(sessionStorage.getItem('teacher_is_official'));
        $('.home .user-info').find('.email').text(sessionStorage.getItem('user_email') || '');

        // 批改信息
        $('.home .comments-info').find('.stage span').text(sessionStorage.getItem('teacher_yet_comments'));
        // 是否时正式教师
        var if_official = sessionStorage.getItem('teacher_is_official') || 'false';

        // 是正式教师
        if (if_official == 'true') {
            $('.home .comments-info').find('.section span').text('正式教师');
            $('.home .comments-info').find('.need-comments').remove();
        } else {
            var need = sessionStorage.getItem('teacher_should_comments') - sessionStorage.getItem('teacher_yet_comments');
            $('.home .comments-info').find('.need-comments span').text(need);
            $('.home .comments-info').find('.section span').text('实习教师');
        }

    }

    /**
     * 页面加载后，获取用户的数据
     */
    function getUserInfo() {
        // 获取个人信息
        $.ajax({
            url: _HOST.add_rort + _HOST.user.teacher.get_info,
            type: 'POST',
            data: {
                // 教师id
                teacherid: sessionStorage.getItem('user_id')
            },
            success: function (res) {
                // 隐藏加载层
                $loading.loading_finish = true;
                if (res.Result) {
                    console.log(res.Data[0])
                    // 将用户数据存储在sessionStorage中
                    sessionStorage.setItem('user_tel', res.Data.Phone || '');
                    sessionStorage.setItem('user_nick_name', res.Data.NickName || '');
                    sessionStorage.setItem('user_email', res.Data.Mail || '');
                    sessionStorage.setItem('teacher_is_official', res.Data.IsOfficial);
                    sessionStorage.setItem('teacher_should_comments', res.Data.ArticleCount);
                    sessionStorage.setItem('teacher_yet_comments', res.Data.CorrectYes);

                    // 用户数据存储成功后，显示用户信息
                    showUserInfo();
                }
            }
        })
    }

});