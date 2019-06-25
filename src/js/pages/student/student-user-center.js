/**
 * @description 学生用户个人中心首页
 * @author zhengshenli
 * @createAt 2018-03-09
 */
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {

    $('.howToUse').click(function () {
       window.open(_VIEW.showUse.to) 
    })

    // 加载遮罩层，请求结束后可以隐藏 isShowStartStudyButton();
    var $loading = $('.right-container');
    $.pageLoading($loading);
    init();
    setTimeout(function () {
        courseTimeInfo(sessionStorage.getItem('user_id'))
    },1000)
    function init() {
        // isShowStartStudyButton();

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
        let _user_nick_name = sessionStorage.getItem('user_nick_name')
        if (_user_nick_name && _user_nick_name.length > 0) {
            $('.home .user-info').find('.nick-name').text("欢迎您，" + _user_nick_name);
        }
        
        $('.home .user-info').find('.tel').text(sessionStorage.getItem('user_tel'));
        $('.home .user-info').find('.study-hour').text(sessionStorage.getItem('study_hour'));
        $('.home .user-info').find('.CompositionCount').text(sessionStorage.getItem('CompositionCount'));
        let isVip = sessionStorage.getItem('IsVip')
        if (isVip != "null") {
            $('.home .user-info').find('.isvip').text("VIP用户");
        }
        let Is_Info = sessionStorage.getItem('IsInfo')
        console.log('Is_Info : ' + Is_Info)
        if (Is_Info == 'true') {
            $('.IsInfo').text('修改资料')
            // $('.IsInfo').text('完善资料，赠送5次课')
        }else{
            $('.IsInfo').text('完善资料，赠送5次课')
        }
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
                    sessionStorage.setItem('IsVip', res.Data[0].IsVip || null);
                    sessionStorage.setItem('CompositionCount', res.Data[0].CompositionCount || 0);
                    sessionStorage.setItem('IsInfo', res.Data[0].IsInfo || false);

                    // 用户数据存储成功后，显示用户信息
                    showUserInfo();

                    // 分享
                    shareTo()
                }
                isShowStartStudyButton();
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
                courseid: sessionStorage.getItem('course_id'),
                studentid: sessionStorage.getItem('user_id')
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

    function courseTimeInfo(studentId){
        $.ajax({
            type: "post",
            url:  _HOST.add_rort + _HOST.courseTimeInfo.get,
            data: {
                studentId:studentId
            },
            success: function (res) {
                if (res.Result) {
                    if (!res.IsRead) {
                        layui.layer.open({
                            content: '<div>' + res.Info +'</div>'
                            ,btn: ['我知道了']
                            ,yes: function(index, layero){
                                $.ajax({
                                    type: "post",
                                    url:  _HOST.add_rort + _HOST.i_konw.to,
                                    data: {
                                        studentId:studentId
                                    },
                                    success: function (res) {
                                        
                                    }
                                });
                                layui.layer.close(index);
                            }
                          });
                    }     
                }
            }
        });
    }


    function shareTo(){


        $('.shareto').click(function () {
            let urltoshare = 'http://' + window.location.host + _VIEW.login.register + "?" + encodeURI(sessionStorage.getItem('user_tel'));
            $('.copy-content').text(urltoshare).css('display','none')
            copyUrl2()
        })

        
        
    }
    // 复制
    function copyUrl2(){

        var Url2=$('.copy-content').text()
        var oInput = document.createElement('input');
        oInput.value = Url2;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy");
        oInput.className = 'oInput';
        oInput.style.display='none';
        layui.layer.msg('已复制，请将链接黏贴给你的朋友！')
    }
});