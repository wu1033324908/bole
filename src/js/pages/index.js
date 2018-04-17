/**
 * @description index页面
 * @author zhengshenli
 * 
 */
var _GLOBAL = require('tool/global');
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {
    $(document).keydown(function(event){
        if(event.keyCode==13){
            $(".btn-login").click();
        }
    }); 
    $.setPageFontSize();

    /**
     * 首页视频模块vue
     */
    var video_vue_obj = new Vue({
        el: '#video-vue',
        data: {
            // 视频数据
            videoModule: {}
        },
        methods: {
            // 前往播放视频页面操作
            goto_play_video: function (e) {
                console.log(e)
                var $current = $(e.target);
                // 设置video数据
                sessionStorage.setItem('video_src', $current.parent().data('video'));
                // 设置富文本数据
                sessionStorage.setItem('video_rich_text', $current.parent().data('rich-text'));
                sessionStorage.setItem('video_title', $current.parent().siblings('.description').text());
            }
        }
    });

    setVideoListData();

    setBannerData();

    loginSubmit();

    setIntroducerPhone();

    setTitle();



    /**
     * 设置banner的数据
     */
    function setBannerData() {
        // 获取banner数据
        $.ajax({
            url: _HOST.add_rort + _HOST.home.banner.list,
            type: 'POST',
            success: function (res) {
                if (res.Result) {
                    let data = res.Data;
                    let $wrap = $('.banner-container .swiper-wrapper');
                    data.forEach((ele, index) => {
                        $wrap.append(`
                            <div class="swiper-slide">
                                <a href="${_VIEW.banner.detail}?c=${ele.RichText || ''}&t=${ele.Title? Base.encode(ele.Title): ''}" target="_blank">
                                    <img src="${ele.Url}" alt="">
                                    <div class="info">
                                        <div class="title">${ele.Title || ''}</div>
                                        <div class="desc">${ele.Description || ''}</div>
                                    </div>
                                </a>
                            </div>
                        `);

                    });
                    initBannerSwiper();
                }
            }

        });
    }

    /**
     * 设置video 列表的数据
     */
    function setVideoListData() {
        // 默认数据
        var videoModule = {
            title: 'VIDEO',
            subTitle: '作文课程视频，全方位提升写作水平',
            data: [{
                    img: 'assets/img/video.jpg',
                    title: '如何让孩子爱上写作文',
                    video: 'http://gemini-disk.oss-cn-shanghai.aliyuncs.com/Lqy/81971dcd1c284da8b7de9985bdda060c.mp4'
                },
                {
                    img: 'assets/img/video.jpg',
                    title: '关于想象能力的培养',
                    video: 'http://gemini-disk.oss-cn-shanghai.aliyuncs.com/Lqy/81971dcd1c284da8b7de9985bdda060c.mp4'
                },
                {
                    img: 'assets/img/video.jpg',
                    title: '经常写错别字的习惯怎么改',
                    video: 'http://gemini-disk.oss-cn-shanghai.aliyuncs.com/Lqy/81971dcd1c284da8b7de9985bdda060c.mp4'
                },
                {
                    img: 'assets/img/video.jpg',
                    title: '生活是写作的灵感源泉',
                    video: 'http://gemini-disk.oss-cn-shanghai.aliyuncs.com/Lqy/81971dcd1c284da8b7de9985bdda060c.mp4'
                }
            ]
        };

        // 请求视频数据
        $.ajax({
            url: _HOST.add_rort + _HOST.home.video.list,
            type: 'POST',
            success: function (res) {
                if (res.Result) {
                    let data = res.Data;
                    videoModule.data = data.slice(0, 4);
                    video_vue_obj.videoModule = videoModule;
                    console.log(video_vue_obj.videoModule)
                }
            }

        });

    }


    /**
     * 初始化banner swiper
     */
    function initBannerSwiper() {
        // 使用swiper插件初始化banner
        var mySwiper = new Swiper('.index-swiper', {
            direction: 'horizontal',
            autoplay: {
                delay: 2500,
                stopOnLastSlide: false,
                disableOnInteraction: false,
            },
            loop: true,

            // 如果需要分页器
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },

            // 如果需要前进后退按钮
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',

            // 如果需要滚动条
            scrollbar: '.swiper-scrollbar',
        });
    }


    // var mySwiper = new Swiper('.video-swiper', {
    //     direction: 'horizontal',
    //     // 设置slider最多同时显示的slides数量
    //     slidesPerView: 4,
    //     // slider之间的距离
    //     spaceBetween: 30,
    //     // autoplay: {
    //     //     delay: 2500,
    //     //     stopOnLastSlide: false,
    //     //     disableOnInteraction: false,
    //     // },
    //     autoplay: false,
    //     // loop: true,

    //     // 如果需要分页器
    //     // pagination: {
    //     //     el: '.swiper-pagination',
    //     //     clickable: true
    //     // },

    //     // // 如果需要前进后退按钮
    //     // nextButton: '.swiper-button-next',
    //     // prevButton: '.swiper-button-prev',

    //     // // 如果需要滚动条
    //     // scrollbar: '.swiper-scrollbar',
    // });


    /**
     * 登录的submit事件
     */
    function loginSubmit() {
        // 注册按钮跳转事件
        $('.login-container').on('click', '.btn-register', function () {
            location.href = _VIEW.login.register;
        });


        // 监听登录按钮
        layui.form.on('submit(login)', function (data) {
            
            // console.log(data.field) 
            //当前容器的全部表单字段，名值对形式：{name: value}

            var sendData = {}

            for (var i in data.field) {
                sendData[i] = data.field[i];
            }
            // console.log(sendData)
            let layer_index = layui.layer.load();

            // 获得公钥
            $.ajax({
                url: _HOST.add_rort + _HOST.login.get_public_key,
                type: 'POST',
                data: {
                    username: sendData.username
                },
                success: function (res) {
                    if (res.Result) {
                        //设置最大位数
                        setMaxDigits(131);
                        //获得公钥
                        var key = new RSAKeyPair(res.Exponent, '', res.Modulus);
                        //对密码进行RSA加密
                        sendData.password = encryptedString(key, base64encode(sendData.password));

                        // 登录请求
                        $.ajax({
                            url: _HOST.add_rort + _HOST.login.login,
                            type: 'POST',
                            data: sendData,
                            complete: function () {
                                layui.layer.close(layer_index);
                            },
                            success: function (res) {
                                console.log(res)
                                if (res.Result) {
                                    sessionStorage.setItem('user_tel', res.Phonenum);
                                    sessionStorage.setItem('user_id', res.UserId);
                                    sessionStorage.setItem('user_type', res.Type);
                                    layui.layer.open({
                                        type: 0,
                                        content: '登录成功',
                                        offset: '20%',
                                        anim: 2,
                                        time: 1500,
                                        end: function () {
                                            // location.href = _HOST.root + 'user/user-center.html';
                                            if (res.Type == 1) {
                                                sessionStorage.setItem('course_id', res.CourseId);
                                                location.href = _VIEW.user_center.student.index;
                                            } else if (res.Type == 2) {
                                                location.href = _VIEW.user_center.teacher.index;
                                            } else if (res.Type == 3) {
                                                sessionStorage.setItem('role_id', res.Data[0].Id);
                                                sessionStorage.setItem('role_name', res.Data[0].Name);
                                                location.href = _VIEW.admin.index + '?i=' + Base.encode(res.UserId.toString()) + '&u=' + Base.encode(res.Phonenum);
                                            }
                                        }
                                    });
                                } else {
                                    layui.layer.open({
                                        type: 0,
                                        content: res.Desc || '登录失败',
                                        offset: '20%',
                                        anim: 2,
                                    });
                                }
                            }
                        })

                    }
                }
            });

            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    }

    /**
     * 如果是从分享页面进入此页面，且学生分享前有登录过，设置介绍人的电话号码
     */
    function setIntroducerPhone() {
        // 从url上获取介绍人手机
        var introducer_phone = $.GetQueryString('i');

        if (introducer_phone) {
            sessionStorage.setItem('introducer_phone', introducer_phone);
        }
    }

    /**
     * 设置标题名称
     */
    function setTitle() {
        var $title_up = $('.topbar-title .top');
        var $title_down = $('.topbar-title .bottom');
        var $middle_up = $('.welfare-wrap .top');
        var $middle_down = $('.welfare-wrap .middle');
        var $video_up = $('.video-container .top .title');
        var $video_down = $('.video-container .top .sub-title');

        $.ajax({
            url: _HOST.add_rort + _HOST.home.title.get,
            type: 'POST',
            success: (res) => {
                if (res.Result) {
                    var data = res.Data[0];
                    if (data) {
                        $title_up.html(data.TitleUp || '');
                        $title_down.html(data.TitleDown || '');
                        $middle_up.html(data.MiddleUp || '');
                        $middle_down.html(data.MiddleDown || '');
                        $video_up.html(data.VideoUp || '');
                        $video_down.html(data.VideoDown || '');

                    }
                }
            }
        })
    }
    $('.footer-wrap').css('margin-top', 0);
})