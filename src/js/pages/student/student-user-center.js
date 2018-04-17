/**
 * @description 学生用户个人中心首页
 * @author zhengshenli
 * @createAt 2018-03-09
 */
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {
    // 加载遮罩层，请求结束后可以隐藏 isShowStartStudyButton();
    var $loading = $('.right-container');
    $.pageLoading($loading);
    init();
    
    function init() {
        isShowStartStudyButton();

        getUserInfo();


        // 点击修改资料按钮，前往我的信息页面
        $('.btn-modify-user-info').click((e) => {
            location.href = _VIEW.user_center.student.complete_info;
        });

        // 点击开始学习按钮，前往学习界面
        $('.right-container .study-schedule').find('.btn-goto-study').on('click', (e) => {
            // 课时不足，不能进行学习
            if(sessionStorage.getItem('study_hour') == 0) {
                layui.layer.open({
                    type:0,
                    content: '课时不足，可以通过第一次完善信息或者邀请他人获得！',
                    offset: '20%'
                })
            }else{
                location.href = _VIEW.play.index;
            }
        });
        // 点击学习记录按钮，前往学习记录界面
        $('.right-container .study-schedule').find('.btn-goto-study-record').on('click', (e) => {
            location.href = _VIEW.user_center.student.study_record;
        });

    }

    /**
     * 显示用户的信息
     */
    function showUserInfo() {
        // 我的信息
        $('.home .user-info').find('.nick-name').text(sessionStorage.getItem('user_nick_name'));
        $('.home .user-info').find('.tel').text(sessionStorage.getItem('user_tel'));
        $('.home .user-info').find('.study-hour').text(sessionStorage.getItem('study_hour'));

        // 学习进度
        $('.home .study-schedule').find('.stage').text(sessionStorage.getItem('stage_desc'));
        $('.home .study-schedule').find('.section').text(sessionStorage.getItem('section_desc'));

    }

    /**
     * 页面加载后，获取学生用户的数据
     */
    function getUserInfo() {
        // 获取学生用户信息
        $.ajax({
            url: _HOST.add_rort + _HOST.user.student.get_info,
            type: 'POST',
            data: {
                id: sessionStorage.getItem('user_id')
            },
            success: function (res) {
                if (res.Result) {
                    // 将用户数据存储在sessionStorage中
                    sessionStorage.setItem('user_type', res.Data[0].Type || '')
                    sessionStorage.setItem('user_nick_name', res.Data[0].NickName || '')
                    sessionStorage.setItem('user_province', res.Data[0].AddressCapital || '')
                    sessionStorage.setItem('user_city', res.Data[0].AddressDistrict || '')
                    sessionStorage.setItem('user_area', res.Data[0].AddrssElement || '')
                    sessionStorage.setItem('user_school', res.Data[0].School || '')
                    sessionStorage.setItem('user_email', res.Data[0].Mail || '')
                    sessionStorage.setItem('user_grade', res.Data[0].Grade || '')
                    sessionStorage.setItem('course_id', res.Data[0].CourseId || '');
                    sessionStorage.setItem('section_desc', res.Data[0].CouresDescribe || '');
                    sessionStorage.setItem('stage_desc', res.Data[0].StageDescribe || '');
                    sessionStorage.setItem('study_hour', res.Data[0].Hour || 0);

                    // 用户数据存储成功后，显示用户信息
                    showUserInfo();
                }
            }
        })
    }

    /**
     * 判断这节课是否处于开启状态
     */
    function isShowStartStudyButton() {
        // 开始学习按钮
        var $study_button = $('.right-container .btn-goto-study');
        var $left_container = $('.right-container .left');
        $.ajax({
            url: _HOST.add_rort + _HOST.student.course_can_use,
            type: 'POST',
            data: {
                courseid: sessionStorage.getItem('course_id')
            },
            success: function (res) {
                // 隐藏遮罩层
                $loading.loading_finish = true;
                // 课程未开启
                if (!res.Result) {
                    // 移除开始学习按钮，阶段、课次进度
                    $study_button.remove();
                    $left_container.find('.stage').remove();
                    $left_container.find('.section').remove();
                }else {
                    // 移除课程未开启提示
                    $left_container.find('.other').remove();
                }
            }
        })
    }


});