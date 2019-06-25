/**
 * @description 学生play界面
 * @author zhengshenli
 * @createAt 2018-01-17
 */
var _GLOBAL = require('tool/global');
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {
    let timeadd;
    /**
     * 离开或关闭此页面时的标识，true：有提示
     */
    window.is_confirm = false;

    let isopen = true;

    function auto_save_canvas(isopen) {
        var setautosave = setInterval(() => {
            html2canvas($('.drop-container')[0]).then(function (canvas) {

                // 将`.drop-container`转换为二进制，上传到服务器
                canvas.toBlob(function (blob) {
                    var fd = new FormData();
                    fd.append("file", blob);
                    $.ajax({
                        url: _HOST.add_rort + _HOST.resource.upload_file,
                        type: 'POST',
                        data: fd,
                        // 不加工原始数据，确保图片上传成功
                        processData: false,
                        contentType: false,
                        success: function (res) {
                            
                            if (res.Result) {
                                console.log('自动保存')
                                // 图片id
                                var id = res.Id;
                                // 图片上传成功后保存记录
                                $.ajax({
                                    url: _HOST.add_rort + _HOST.auto_save.set,
                                    type: 'POST',
                                    data: {
                                        studentid: sessionStorage.getItem('user_id'),
                                        courseid: sessionStorage.getItem('course_id'),
                                        puzzleid: id
                                    }
                                })
                            }
                        }
                    })
                });

            },{
                backgroundColor:null,useCORS:true,width:$('.drop-container').width(),height:$('.drop-container').height()
            });
        }, 30000)

        if (isopen == 'false') {
            clearInterval(setautosave)
        }
    }
    auto_save_canvas(isopen)
    $(window).on('beforeunload', function () {
            // 只有在标识变量is_confirm不为false时，才弹出确认提示     
            if (window.is_confirm !== false)
                return '您可能有数据没有保存';
        })
        // mouseleave mouseover事件也可以注册在body、外层容器等元素上 
        .on('mousemove', function (event) {　　
            window.is_confirm = true;
        });


    /**
     * 页面header分数的jq 对象
     */
    var $score = $('.page-header-container .score span');


    // 设置 page content container height
    $('.page-content-container').css('height', $(window).height() - $('.page-header-wrap').height() + 'px');

    /**
     * 录音数据
     */
    var recorde_data = {
        // 课前
        front_class: '',
        // 成语闪卡
        phrase_banner: '',
        // 成语抓小偷
        phrase_remove_and_banner: '',
        // 拼图
        jigsaw: '',
        // 拼图激励
        stimulate: '',
        // 写作
        writing: '',
        // 结束课程
        class_over: ''
    }

    /**
     * 数据的全局设置
     */
    var global_setting = {
        // 成语闪卡速度
        phrase_banner_speed: 0.75,
        // 成语闪卡次数
        phrase_banner_count: 1,
        // 成语抓小偷速度
        phrase_remove_banner_speed: 0.75,
        // 成语抓小偷次数
        phrase_remove_banner_count: 1,
        // 成语抓小偷选择正确的分数
        phrase_remove_score: 2,
        // 拼图时间
        jigsaw_duration: '00:20:00',
        // 拼图分数
        jigsaw_score: 2,
        // 激励后的分数
        stimulate_score: 1,
        // 写作时间
        writing_duration: '00:20:00',
        // 准时完成写作的分数
        writing_score: 1

    };

    /**`
     * 被选中移除的成语
     */
    var choose_remove = [];

    /**
     * 每个模块要增加的分数
     */
    var module_score = {
        // 成语抓小偷
        phrase_remove: global_setting.phrase_remove_score,
        // 拼图
        jigsaw: global_setting.jigsaw_score,
    }


    // 获取课程录音
    getRecordData();
    // 获取课程设置
    getCourseSetting();
    // init();

    /**
     * 获取当前课次的所有录音
     */
    function getRecordData() {

        var index = layui.layer.load(); //又换了种风格，并且设定最长等待10秒 
        $.ajax({
            url: _HOST.add_rort + _HOST.course.record.get_record_by_section_id,
            type: 'POST',
            data: {
                courseid: sessionStorage.getItem('course_id')
            },
            success: function (res) {
                layui.layer.close(index);
                if (res.Result && res.Data.length > 0) {
                    // 课前语音
                    recorde_data.front_class = res.Data[0].FrontClassUrl || '';
                    // 成语闪卡模块说明
                    recorde_data.phrase_banner = res.Data[0].PhraseCardUrl || '';
                    // 成语抓小偷模块说明
                    recorde_data.phrase_remove_and_banner = res.Data[0].PhraseThiefUrl || '';
                    // 拼图模块说明
                    recorde_data.jigsaw = res.Data[0].PuzzleUrl || '';
                    // 拼图激励
                    recorde_data.stimulate = res.Data[0].StimulateUrl || '';
                    // 写作模块说明
                    recorde_data.writing = res.Data[0].CompositionFontUrl || '';
                    // 课程结束
                    recorde_data.class_over = res.Data[0].CompositionLaterUrl || '';
                }
                init();
            }
        })
    }

    /**
     * 获取课程设置
     */
    function getCourseSetting() {
        $.ajax({
            url: _HOST.add_rort + _HOST.course.section.setting,
            type: 'POST',
            success: function (res) {
                if (res.Result && res.Data[0]) {

                    // 闪卡速度
                    global_setting.phrase_banner_speed = res.Data[0].FlashSpeed || 1;
                    // 闪卡次数
                    global_setting.phrase_banner_count = res.Data[0].FlashRepeatedly || 1;
                    // 成语抓小偷速度
                    global_setting.phrase_remove_banner_speed = res.Data[0].ThiefSpeed || 1;
                    // 成语抓小偷次数
                    global_setting.phrase_remove_banner_count = res.Data[0].ThiefRepeatedly || 1;
                    // 成语抓小偷选择正确的分数
                    global_setting.phrase_remove_score = res.Data[0].ThiefGrade || 1;
                    // 拼图时间
                    global_setting.jigsaw_duration = res.Data[0].PuzzleDuration || '00:20:00';
                    // 拼图分数
                    global_setting.jigsaw_score = res.Data[0].PuzzleGrade || 1;
                    // 激励后的分数
                    global_setting.stimulate_score = res.Data[0].StimulateGrade || 1;
                    // 写作时间
                    global_setting.writing_duration = res.Data[0].ArtideDuration || '00:20:00';
                    // 准时完成写作的分数
                    global_setting.writing_score = res.Data[0].ArtideGrade || 1;
                }
            }
        })
    }


    /**
     * @description 页面初始化
     */
    function init() {

        var page_header_molude = new pageHeaderMolude();
        page_header_molude.init();

        // 载入背景图片
        $('.page-background').css('top', '0');

        // 背景图片加载后，自动加载开始上课按钮
        setTimeout(() => {

            // 开始上课按钮
            var begin_class_module = new beginClassModule({
                complete: function () {

                    // 展示上节课批改的作文
                    prev_commented_composition.init();
                }
            });


            // 课前展示上节课批改的作文
            var prev_commented_composition = new showPrevCommentedComposition({
                complete: function () {
                    // 播放语音说明课程内容
                    showRecord(recorde_data.front_class, '课前规范', () => {

                        // 加载提示
                        let layer_index = layui.layer.load();

                        // 判断这节课是否要进行成语闪卡
                        $.ajax({
                            url: _HOST.add_rort + _HOST.course.phrase.is_flash,
                            type: 'POST',
                            data: {
                                courseid: sessionStorage.getItem('course_id')
                            },
                            complete: () => {
                                layui.layer.close(layer_index)
                            },
                            success: (res) => {
                                // 可以进行闪卡
                                if (res.Result && res.IsFlash) {
                                    // 播放语音说明成语内容
                                    showRecord(recorde_data.phrase_banner, '成语闪卡', () => {
                                        //  初始化卡片banner
                                        phrase_module.init();

                                    });
                                } else {
                                    // 否则跳过成语闪卡模块，进入拼图模块
                                    // 播放语音说明拼图内容
                                    showRecord(recorde_data.jigsaw, '贴图', () => {
                                        // 初始化拼图模块
                                        jigsaw_module.init();
                                        // console.log("开始贴图")
                                    });
                                }
                            }
                        })

                    });
                }
            });

            // 成语模块
            var phrase_module = new phraseModule({
                complete: function () {
                    // 显示成语抓小偷前的语音
                    showRecord(recorde_data.jigsaw, '贴图', () => {
                        // 初始化拼图模块
                        jigsaw_module.init();

                    });
                }
            });

            // 拼图模块
            var jigsaw_module = new jigsawModule({
                complete: function () {
                    showRecord(recorde_data.writing, '自主作文', function () {
                        writing_module.init();
                    });
                }
            });

            // 写作模块
            var writing_module = new writingModule({});

            begin_class_module.init();
            // jigsaw_module.init();
        }, get_transition_time($('.page-background')));


    }

    /**
     * @description 获取transition对象的duration
     * @param obj jQuery对象或者DOM对象
     * @return 对象transition-duration 的毫秒值
     */
    function get_transition_time(obj) {
        let $obj = $(obj);
        let time = $obj.css('transition-duration');

        if (time && time.toLowerCase().indexOf('ms') > -1) {
            return parseFloat(time);
        } else {
            return parseFloat(time) * 1000;
        }

    }

    /**
     * page header
     */
    function pageHeaderMolude() {
        var _this = this;

        // page header jquery object
        var $page_header = $('.page-header-container');

        this.init = function () {
            _this.gotoUserCenter();
        }

        /**
         * 点击个人中心按钮
         */
        this.gotoUserCenter = function () {
            $page_header.find('.goto-user-center').on('click', (e) => {
                location.href = _HOST.root + 'student/student-user-center.html';
            });
        }
    }

    /**
     * 获取上节课批改过的作文
     */
    function showPrevCommentedComposition(opt) {

        var _this = this;

        /**
         * 完成此模块的后续操作
         */
        this.complete = opt.complete || function () {}

        getData();

        /**
         * 初始化
         */
        this.init = function () {
            // 显示此模块
            $('.prev-comments-contianer').css('display', 'block');

            // 点击继续按钮，进入下一个模块
            $('.prev-comments-contianer .next').click((e) => {
                $('.prev-comments-wrap').remove();
                _this.complete();
            });

            // 如果没有批改过的内容，则直接进入下一个模块
            setTimeout(() => {
                console.log($('.prev-comments-contianer ul li'))
                if ($('.prev-comments-contianer ul li').length == 0) {
                    $('.prev-comments-contianer .next').click();
                }
            }, 100);
        }



        /**
         * 获取上节课的批改作文
         */
        function getData() {
            $.ajax({
                url: _HOST.add_rort + _HOST.play.get_prev_commented_composition,
                type: 'POST',
                data: {
                    studentid: sessionStorage.getItem('user_id'),
                    courseid: sessionStorage.getItem('course_id')
                },
                success: (res) => {
                    var $ul = $('.prev-comments-contianer ul');
                    if (res.Result && res.Data[0]) {
                        console.log('before')
                        res.Data[0].CorrectUrl.forEach((ele, index) => {
                            $ul.append(`
                                <li>
                                    <img src="${ele}"/>
                                </li>
                            `);
                        });
                    }

                }
            })
        }
    }

    /**
     * 开始上课
     */
    function beginClassModule(opt) {
        var _this = this;

        this.$ele = $('.btn-begin-class');
        console.log(opt)

        /**
         * 完成此模块的后续操作
         */
        this.complete = opt.complete || function () {}

        /**
         * 初始化
         */
        this.init = function () {

            // 显示此模块
            _this.show();
            // 点击开始上课按钮
            _this._clickBeginClassButton();
        }

        /**
         * 点击开始上课按钮
         */
        this._clickBeginClassButton = function () {
            // 开始上课按钮点击事件
            $('.btn-begin-class').on('click', (e) => {
                // 当前事件对象
                let $this = $(e.currentTarget);

                // 点击后，隐藏开始上课按钮
                $this.css('top', '100%');
                let s = 0;
                let m = 0;
                let h = 0;
                timeadd = setInterval(function () {
                    s++;
                    // console.log(s)
                    if(s >= 60){
                        m++;
                        s = 0
                    }
                    if (m >= 60) {
                        h++;
                        m = 0;
                    }
                    if (s<10) {
                        $('.time').find('.s').text("0"+s)
                    }else{
                        $('.time').find('.s').text(s)
                    }
                    if (m<10) {
                        $('.time').find('.m').text("0"+m)
                    }else{
                        $('.time').find('.m').text(m)
                    }
                    if(h<10){
                        $('.time').find('.h').text("0"+h)
                    }else{
                        $('.time').find('.h').text(h)
                    }
                },1000)


                // 开始上课按钮隐藏后，显示播放的语音提示图标
                setTimeout(() => {
                    // 移除开始上课按钮
                    $this.off('click');
                    $this.remove();
                    _this.complete();
                }, get_transition_time($this));
            });
        }

        /**
         * 显示此模块
         */
        this.show = function () {
            // 显示上课按钮
            _this.$ele.css('top', '36%');
        }


        /**
         * @description 获取transition对象的duration
         * @param obj jQuery对象或者DOM对象
         * @return 对象transition-duration 的毫秒值
         */
        function get_transition_time(obj) {
            let $obj = $(obj);
            let time = $obj.css('transition-duration');

            if (time && time.toLowerCase().indexOf('ms') > -1) {
                return parseFloat(time);
            } else {
                return parseFloat(time) * 1000;
            }

        }

    }

    /**
     * @description 播放语音提示
     * @param {String} src 音频src
     * @param {String} title 弹出框title
     * @param {Function} callback 弹出框关闭后的回调
     */
    function showRecord(src, title, callback) {
        // 音频对象
        var audio = null;
        // 打开一个弹出框
        layui.layer.open({
            type: 0,
            content: `
                <div class="">
                    <div style="font-size: 22px;
                    text-align: center;
                    margin-bottom: 10px;">${title}</div>
                    <audio src="${src}" controls preload="auto" autoplay="autoplay"></audio>
                </div>
            `,
            offset: '20%',
            btn: ['我知道了,下一步'],
            success: function (layero, index) {
                audio = $(layero).find('audio')[0];
                // 播放完毕后跳过
                // audio.loop = false;
                audio.addEventListener('ended', function () {
                    layer.close(index);
                }, false);
                // 如果需要在弹出提示框后自动播放
                // audio.play();
                // $(layero).find('audio').load();
            },
            end: function () {
                audio.pause();
                callback && callback();
            }
        });
    }

    /**
     * 成语模块
     */
    function phraseModule(opt) {
        var _this = this;

        // 卡片banner
        var $banner_wrap = $('.card-banner-wrap');
        // 成语闪卡
        var $animate_container = $('.card-banner-container');
        // 成语抓小偷
        var $remove_animate_container = $('.remove-card-animate-container');

        // 选择成语抓小偷移除的卡片
        var $choose_remove_card_container = $('.choose-remove-card-container');


        /**
         * 成语数据
         */
        this.phrase_data = [];

        // 获取成语和对应的语音
        getPhraseData();

        this.complete = opt.complete || function () {};

        /**
         * 初始化
         */
        this.init = function () {
            // 设置 banner wrap display to block,使它内部的元素transition效果生效
            $banner_wrap.addClass('show');

            setTimeout(function () {
                // 成语闪卡
                _this.phraseBanner();
            }, 100);

        }

        /**
         * 成语闪卡
         * 动画的目的是使层级在前面的一个元素显示出来
         * 若要测试动画过程，找到每次点击下一张按钮的 interval ,$animate_container.find('.btn-next').click()，注释它
         * 然后在html中找到这个按钮，暂时修改css,使能够手动触发
         */
        this.phraseBanner = function () {
            // 设置卡片成语闪卡的动画
            $animate_container.css('transition', 'all 1s linear');
            $animate_container.css('opacity', 1);
            $animate_container.css('left', '50%');

            // 动画的周期时长
            let animation_duration = 500;
            // 卡片切换的间隔
            let change_time = global_setting.phrase_banner_speed * 1000 > 750 ? global_setting.phrase_banner_speed * 1000 : 750;
            // 卡片的index
            let card_zindex = 2;
            // 卡片banner重复的次数
            let banner_count = global_setting.phrase_banner_count;

            // banenr 里的所有 item
            let $banner_item = $animate_container.find('.item').css('animation-duration', animation_duration + 'ms');
            // 为第一个和最后item设置标识，并且显示最后一个item，`.active`为标识
            // 因为两者要切换到下一个成语的动画是不一样的
            $banner_item.first().addClass('first');
            $banner_item.last().addClass('active last');

            // 成语闪卡内容显示后
            setTimeout(() => {
                let $active_item = $animate_container.find('.item.active');

                /**
                 * 设置成语轮播时同时播放的语音
                 */
                var audio = $active_item.find('audio')[0];
                audio.play();

                // 下一个item按钮的点击事件
                $animate_container.on('click', '.btn-next', (e) => {
                    // 触发事件对象
                    let $this = $(e.currentTarget);

                    // 获取当前显示的item
                    let $active_item = $animate_container.find('.item.active');

                    // 当前显示的是第一个卡片
                    if ($active_item.hasClass('first')) {
                        if (--banner_count <= 0) {
                            audio.pause();
                            console.log(banner_count)
                            clearInterval(timer);

                            // 隐藏成语闪卡
                            $animate_container.css('left', '150%');

                            // 成语闪卡结束后
                            setTimeout(() => {
                                $animate_container.addClass('hidden');
                                // 显示成语抓小偷前的语音
                                showRecord(recorde_data.phrase_remove_and_banner, '成语抓小偷', () => {
                                    _this.phraseRemoveBanner();
                                });
                            }, get_transition_time($animate_container));
                            return;
                        }
                        // 下一个要显示的item
                        let $next_item = $banner_item.last();


                        audio.pause();
                        audio = $next_item.find('audio')[0];
                        audio.play();

                        $next_item.addClass('active reset-animate');
                        // item切换动画结束后
                        setTimeout(() => {
                            $active_item.removeClass('active');
                        }, animation_duration);
                    } else {
                        let $next_item = $active_item.prev();

                        audio.pause();
                        audio = $next_item.find('audio')[0];
                        audio.play();

                        $next_item.addClass('active prev-animate');
                        setTimeout(() => {
                            $active_item.removeClass('active');
                        }, animation_duration);
                    }

                });
                // 持续点击下一个item按钮
                let timer = setInterval(() => {
                    $animate_container.find('.btn-next').click();
                }, change_time)

            }, get_transition_time($animate_container));

        }

        /**
         * 成语抓小偷
         */
        this.phraseRemoveBanner = function () {
            // 设置成语抓小偷入场的动画
            $remove_animate_container.css('transition', 'all 1s linear');
            $remove_animate_container.css('opacity', 1);
            $remove_animate_container.css('left', '50%');

            // 首先移除一张卡片
            setTimeout(() => {
                // 要移除的卡片item
                let remove_item = parseInt(Math.random() * 1000) % $remove_animate_container.find('.item').length;
                let $remove_obj = $remove_animate_container.find('.item').eq(remove_item);
                $remove_obj.addClass('transition').css('top', window.innerHeight + 'px');

                // 保存被移除的卡片id
                choose_remove.push($remove_obj.find('.word').data('id'));

                // 卡片移除动画结束后
                setTimeout(() => {
                    // 删除被移除的card
                    $remove_animate_container.find('.item').eq(remove_item).remove();
                    // 重新设置card的backgroud
                    $remove_animate_container.find('.item').css('background-image', `url(${_GLOBAL.root}assets/img/test_card_bg.png)`);
                    $remove_animate_container.find('.item').css('background-color', `transparent`).removeClass('active');
                    $remove_animate_container.find('.shadow').css('display', 'none');

                    // 动画的周期时长 
                    let animation_duration = 500;
                    // 卡片切换的间隔
                    let change_time = global_setting.phrase_remove_banner_speed * 1000 > 750 ? global_setting.phrase_remove_banner_speed * 1000 : 750;
                    // 卡片的index
                    let card_zindex = 2;
                    // 卡片banner重复的次数
                    let banner_count = global_setting.phrase_remove_banner_count;

                    // banenr 里的所有 item
                    let $banner_item = $remove_animate_container.find('.item').css('animation-duration', animation_duration + 'ms');
                    // 为第一个和最后item设置标识，并且显示最后一个item，`.active`为标识
                    $banner_item.first().addClass('first');
                    $banner_item.last().addClass('active last');

                    // 成语闪卡内容显示后
                    setTimeout(() => {
                        let $active_item = $animate_container.find('.item.active');
                        /**
                         * 设置成语轮播时同时播放的语音
                         */
                        var audio = $active_item.find('audio')[0];
                        audio.play();

                        // 下一个item按钮的点击事件
                        $remove_animate_container.on('click', '.btn-next', (e) => {
                            // 触发事件对象
                            let $this = $(e.currentTarget);

                            // 获取当前显示的item
                            let $active_item = $remove_animate_container.find('.item.active');

                            // 当前显示的是第一个卡片
                            if ($active_item.hasClass('first')) {
                                if (--banner_count <= 0) {
                                    audio.pause();
                                    console.log(banner_count)
                                    clearInterval(timer);

                                    $remove_animate_container.css('opacity', 0);
                                    $choose_remove_card_container.addClass('show');

                                    // 成语抓小偷闪卡隐藏动画结束后
                                    setTimeout(() => {
                                        $remove_animate_container.addClass('hidden');

                                        $choose_remove_card_container.css('opacity', 1);

                                        $choose_remove_card_container.on('click', '.item', (e) => {
                                            let $this = $(e.currentTarget);
                                            choose_remove.forEach((ele, index) => {
                                                console.log(ele, $this.find('.word').data('id'))
                                                if (ele == $this.find('.word').data('id')) {
                                                    choose_remove.splice(index, 1);
                                                    // 如果所有被移除的成语都被选中
                                                    if (choose_remove.length === 0) {
                                                        // 选择正确后加的分数
                                                        $score.text(parseInt($score.text()) + module_score.phrase_remove);
                                                        $banner_wrap.append(`
                                                            <div class="bg-rotate" >
                                                                <img src="${_GLOBAL.root}assets/img/bg-rotate.png" style="" />
                                                            </div>
                                                        `);
                                                        let $bg = $banner_wrap.find('.bg-rotate img');
                                                        let rotate = 0;
                                                        var bg_rotate_interval = setInterval(function () {
                                                            console.log(rotate)
                                                            rotate += 1;
                                                            $bg.css('transform', 'rotate(' + rotate + 'deg)');
                                                        }, 25);
                                                        layer.msg('选择正确', () => {
                                                            $banner_wrap.removeClass('show').addClass('fadeOut');


                                                            // 成语抓小偷结束
                                                            setTimeout(() => {
                                                                clearInterval(bg_rotate_interval);
                                                                _this.complete();

                                                            }, get_transition_time($banner_wrap));
                                                        });
                                                    } else {
                                                        layer.msg('请继续选择', () => {});
                                                    }
                                                    return false;
                                                } else {

                                                    layer.msg('选择错了，再接再厉', () => {});
                                                    // 选择错误后分数只加一
                                                    module_score.phrase_remove = 1;
                                                }
                                            });
                                        });

                                    }, get_transition_time($remove_animate_container));

                                    // // 隐藏成语闪卡
                                    // $remove_animate_container.css('left', '150%');

                                    // setTimeout(() => {
                                    //     $remove_animate_container.addClass('hidden');
                                    //     // 显示成语抓小偷前的语音
                                    //     begin_class_voice();
                                    // }, get_transition_time($remove_animate_container));
                                    return;
                                }
                                // 下一个要显示的item
                                let $next_item = $banner_item.last();

                                audio.pause();
                                audio = $next_item.find('audio')[0];
                                audio.play();

                                $next_item.addClass('active reset-animate');
                                // item切换动画结束后
                                setTimeout(() => {
                                    $active_item.removeClass('active');
                                }, animation_duration);
                            } else {
                                let $next_item = $active_item.prev();

                                audio.pause();
                                audio = $next_item.find('audio')[0];
                                audio.play();

                                $next_item.addClass('active prev-animate');
                                setTimeout(() => {
                                    $active_item.removeClass('active');
                                }, animation_duration);
                            }

                        });
                        // 持续点击下一个item按钮
                        let timer = setInterval(() => {
                            $remove_animate_container.find('.btn-next').click();
                        }, change_time)

                    }, get_transition_time($remove_animate_container));

                }, get_transition_time($remove_animate_container.find('.item').eq(remove_item)));

            }, get_transition_time($remove_animate_container));

        }


        /**
         * @description 获取transition对象的duration
         * @param obj jQuery对象或者DOM对象
         * @return 对象transition-duration 的毫秒值
         */
        function get_transition_time(obj) {
            let $obj = $(obj);
            let time = $obj.css('transition-duration');

            if (time && time.toLowerCase().indexOf('ms') > -1) {
                return parseFloat(time);
            } else {
                return parseFloat(time) * 1000;
            }

        }


        /**
         * 获取当前课次的所有成语
         */
        function getPhraseData() {
            $.ajax({
                url: _HOST.add_rort + _HOST.course.phrase.get_phrase_by_section_id,
                type: 'POST',
                data: {
                    courseid: sessionStorage.getItem('course_id')
                },
                success: function (res) {
                    if (res.Result && res.Data.length > 0) {
                        // 成语名称、语音、id数组
                        let name_arr = [],
                            url_arr = [],
                            id_arr = [];

                        // 语音id
                        res.Data[0].RecordingId.forEach((ele, index) => {
                            id_arr.push(ele);
                        });
                        // 语音url
                        res.Data[0].RecordingUrl.forEach((ele, index) => {
                            url_arr.push(ele);
                        });
                        // 成语名称
                        res.Data[0].Idiom.split(',').forEach((ele, index) => {
                            name_arr.push(ele);
                        });

                        // 将成语以及对应的语音数据保存下来
                        name_arr.forEach((ele, index) => {
                            let item = {
                                id: '',
                                url: '',
                                name: ''
                            };

                            item.id = id_arr[index];
                            item.url = url_arr[index];
                            item.name = name_arr[index];
                            // 保存成语相关数据
                            _this.phrase_data.push(item);

                        });
                        // 设置成语列表中的成语
                        setPhraseLsit();
                    }
                }
            })
        }

        /**
         * 设置成语列表中的成语，同时设置语音和语音
         */
        function setPhraseLsit() {
            _this.phrase_data.forEach((ele, index) => {
                $('.card-banner-container').find('.list').append(`
                    <div class="item">
                        <span class="word" data-id="${ele.id}" data-voiceurl="${ele.url}">${ele.name}</span>
                        <audio src="${ele.url}" controls preload="auto" style="display: none;" autoplay="autoplay"></audio>
                    </div>
                `);
                $('.remove-card-animate-container').find('.list').append(`
                    <div class="item active">
                        <span class="word" data-id="${ele.id}" data-voiceurl="${ele.url}">${ele.name}</span>
                        <audio src="${ele.url}" controls preload="auto" style="display: none;" autoplay="autoplay"></audio>
                    </div>
                `);
                $('.choose-remove-card-container').find('.list').append(`
                    <div class="item">
                        <span class="word" data-id="${ele.id}">${ele.name}</span>
                    </div>
                `);
            });
            $('.remove-card-animate-container').find('.list').append(`
                <div class="shadow"></div>
            `);
        }

    }

    /**
     * 拼图模块
     */
    function jigsawModule(opt) {
        var _this = this;

        // 拼图模块wrap
        let $jigsaw_wrap = $('.jigsaw-wrap');

        /**
         * 以个点集合的最大半径
         */
        this.point_set_max_radius = 0;


        /**
         * 所有组合的点集合
         */
        this.point_sets = [];

        /**
         * 是否在点击完成按钮后显示canvas画圆
         */
        this.is_show_canvas = true;


        this.complete = opt.complete || function () {};


        /**
         *  激励后的拼图数
         */
        var jigsaw_after_stimulate_count = 0;



        this.init = function () {
            // 贴图完成后是否画圈
            this.setIsShowCanvas();
            // 获取课程数据
            this.getCourseData();
            // 显示拼图模块
            $jigsaw_wrap.addClass('show');

            // 先判断是否有断电保存
            
            
            this.autoSave = function (isopen) {
                // let istitle = true;
                // let is = true;
                $.ajax({
                    type: "post",
                    url: _HOST.add_rort + _HOST.auto_save.get,
                    data: {
                        studentid: sessionStorage.getItem('user_id'),
                        courseid: sessionStorage.getItem('course_id')
                    },
                    success: function (res) {
                        if (res.Data && res.Data.length > 0) {
                            
                            if(isopen == 'true'){
                                // $('.drop-header').empty();
                                // $('.drop-body').empty();
                                isopen = false;
                            }
                            $('.drop-container').css("background-image","url( "+ res.Data[0].Url + ")")
                            $('.drop-container').css("background-size","100%")
                            // auto_save_canvas(isopen)
                        } else {
                            auto_save_canvas(isopen)
                        }
                    }
                });
            }
            
            // 设置top,产生动画效果
            setTimeout(() => {
                $jigsaw_wrap.css('top', 0);
                this.setImageHeight();
            }, 100);

            // 倒计时
            // this.time();
            // drag和drop样式
            this.setDragAndDropStyle();
            this.dropEvent();
            this.dragEvent();
            // 点击完成按钮
            this.clickCompleteButton();
        }

        /**
         * 贴图完成后是否画圈
         */
        this.setIsShowCanvas = function () {
            $.ajax({
                url: _HOST.add_rort + _HOST.student.jigsaw.is_draw_circle,
                type: 'POST',
                data: {
                    courseid: sessionStorage.getItem('course_id')
                },
                success: (res) => {
                    if (res.Result) {
                        _this.is_show_canvas = res.IsCircle;
                    }
                }
            })
        }

        /**
         * 获取课程数据，阶段，课次，和拼图内容
         */
        this.getCourseData = function () {
            $.ajax({
                url: _HOST.add_rort + _HOST.play.get_course,
                type: 'POST',
                data: {
                    courseid: sessionStorage.getItem('course_id')
                },
                success: (res) => {
                    if (res.Result) {
                        let $container = $('.drop-container');
                        $container.find('.drop-header .stage').html(res.Data[0].CouresDescribe);
                        $container.find('.drop-header .section').html(res.Data[0].ModuleDescribe);
                        if (res.Data[0].Description) {
                            $container.find('.drop-body').html(Base.decode(res.Data[0].Description));
                        }
                    }
                }
            })
        }

        /**
         * 设置drag-container img height
         */
        this.setImageHeight = function () {

            $('.drag-container .item').each((index, ele) => {
                let $this = $(ele);
                let width = $this.width();
                console.log(width)
                $this.find('img').css('width', width + 'px');
            });
        }

        /**
         * 设置一个点集合最大的半径
         */
        this.setPointsSetRadius = function (radius) {
            this.point_set_max_radius = radius;
        }

        /**
         * 设置drag 和drop style，主要是按照实际纸张的宽高比来计算屏幕中纸张的宽高
         */
        this.setDragAndDropStyle = function () {
            // console.log($(window).innerHeight() / 14)
            // console.log($(".drop-container").css('height'))
            // // 将屏幕高度分为14份
            // let each_height = $(window).innerHeight() / 14;

            // page content container height 就是纸张的高度
            var height = $('.page-content-container').height();
            // 根据纸张宽高比：7/10 计算出宽度
            var width = height * 7 / 10;
            // 如果宽度过大
            if (width > 575) {
                width = 575;
                // 重新根据宽度计算高度
                height = width * 10 / 7;
            }

            // 设置激励是画圆圈的半径，可以根据需求更改
            _this.setPointsSetRadius(width / 3);

            console.log(height, width)
            $('.drag-container').css('height', height + 'px');
            $('.drop-container').css('height', height + 'px')
            $('.drag-container').css('width', width + 'px');
            $('.drop-container').css('width', width + 'px');
            // $('.drag-container img').each(function (index, ele) {
            //     let height = $(this).height();
            //     let container_height = $('.drag-container').height();
            //     $(this).css('height', height / $('.drag-container').height() * each_height * 2)
            // });
            // $(".drop-container").css('width', parseInt($(".drop-container").css('height')) * 210 / 297 + 'px')
        }

        /**
         * 设置计时
         */
        // 倒计时
        this.time = function () {

            // 初始化计时
            // _this.time_changing = $('.page-header-container .time').timeChanging({
            //     time: global_setting.jigsaw_duration
            // });

            // 开始计时
            // _this.time_changing.start();

            // // 时间到了的提示
            // _this.timer = setInterval(function () {
            //     if (_this.time_changing.isTimeOver()) {
            //         clearInterval(_this.timer)
            //         layui.layer.open({
            //             type: 0,
            //             content: '时间到了',
            //             offset: '20%',
            //         });
            //     }
            // }, 1000);

        }

        /**
         * drop event
         */
        this.dropEvent = function () {
            // drop-container 中的克隆对象，包括克隆对象的draggable对象
            var clone_list = [];

            /**
             * 上一个触发drop事件的点，只有在下一次克隆图形后才能把上一次最后操作的点保存到点集中
             */
            var prev_point = {};

            /**
             * 当前触发drop事件的点
             */
            var current_point = {}

            /**
             * 是否是第一个克隆图形
             */
            var is_first_clone = true;

            // 放置形状的容器
            $(".drop-container").droppable({
                activeClass: "ui-state-default",
                /**
                 * 
                 * 
                 * @param {any} event 
                 * @param {any} ui 
                 */
                drop: function (event, ui) {
                    // ui.position 当前css中的位置

                    // drop后的新点
                    // position对象中的值是相对与drop-container左上角的点，需要加上图形宽高一半的值才是对象的中心点
                    var point = {
                        x: ui.position.left + ui.draggable.width() / 2,
                        y: ui.position.top + ui.draggable.height() / 2
                    }

                    // 设置当前点
                    current_point = point;
                    // 不是克隆
                    if (ui.draggable.parent().hasClass('drop-container')) {} else { // 是克隆
                        // 只有在克隆时才将上一个点添加到点集合中

                        /**
                         * 设置克隆的点集
                         * （可抽为方法）
                         */
                        // 如果是第一次克隆一个点
                        if (is_first_clone) {
                            // 将标志设置为false
                            is_first_clone = false;
                        } else {
                            // 组合中的点集合只需找到3个
                            if (_this.point_sets.length !== 4) {

                                // 如果组合集合中没有数据
                                if (_this.point_sets.length === 0) {
                                    // 创建一个点集合
                                    createPointSet(_this.point_sets, prev_point);

                                } else {
                                    // 否则将这个点加入最后一个点集中

                                    // 组合集合的length
                                    let point_sets_length = _this.point_sets.length;

                                    // 将新点添加到最后一个点集合中
                                    _this.point_sets[point_sets_length - 1].points.push(prev_point);

                                    // 计算并设置最后一个点集合的中心点
                                    let center_point = getPointsCenter(_this.point_sets[point_sets_length - 1].points);
                                    _this.point_sets[point_sets_length - 1].center = center_point;

                                    // 计算圆心半径
                                    _this._computeCircleRadius();

                                    // 如果组合集合中最后一个点集合的半径大于设置的最大半径
                                    if (_this.point_sets[point_sets_length - 1].radius >= _this.point_set_max_radius) {
                                        // 移除刚才添加的点
                                        _this.point_sets[point_sets_length - 1].points.pop();

                                        // 重新计算并设置最后一个点集合的中心点
                                        let center_point = getPointsCenter(_this.point_sets[point_sets_length - 1].points);
                                        _this.point_sets[point_sets_length - 1].center = center_point;
                                        // 创建一个新点集合
                                        createPointSet(_this.point_sets, prev_point);
                                    }
                                }
                            }
                        }

                        // 因为图形从`.drag-container`克隆到`.drop-container`后，在`.drop-container`中还能进行拖拽（不是克隆）
                        // 每次克隆一个新图形，都是将先前克隆点添加到点集中（这个点可以做拖拽操作）,
                        // 所以此次克隆添加上一个克隆点后，需要将此次克隆的点设置为下一次添加的点
                        prev_point = current_point;


                        /**
                         * 设置克隆点的位置，旋转
                         * （可抽为方法）
                         */
                        // 克隆一个对象
                        var $clone = ui.draggable.clone();
                        ui.draggable.remove();
                        // 设置克隆对象的位置
                        $clone.css({
                            position: 'absolute',
                            left: ui.position.left,
                            top: ui.position.top
                        });
                        // // 当前形状的剩余个数
                        // let count = parseInt(ui.draggable.siblings('.count').text()) - 1;
                        // // 如果已经没有剩余的形状了
                        // if (count === 0) {
                        //     ui.draggable.parent('.container').remove();
                        // } else {
                        //     // 设置当前形状的剩余个数
                        //     ui.draggable.siblings('.count').text(count);
                        // }

                        // 添加旋转按钮
                        $clone.append('<div class="tool-container"><i class="btn-rotate fa fa-rotate-left"></i></div>')

                        // 将克隆对象添加到drop-container
                        $(this).append($clone);

                        // 旋转中心点
                        let center_X = $clone.offset().left + $clone.width() / 2;
                        let center_Y = $clone.offset().top + $clone.height() / 2;
                        // 按住旋转的点与中心点之间的角度
                        let default_deg = null;
                        // 按钮旋转中心点后鼠标移动的角度
                        let move_deg = null;
                        // 中心点与鼠标之间的距离（半径）
                        let r = null;
                        // 是否可以拖动
                        var is_move = false;
                        // 以旋转的角度
                        var oldRotate = null;
                        // 鼠标短点击还是长按
                        var long_click = false;

                        /**
                         * 根据三角函数计算旋转的角度
                         * 这里以坐标系的右下角作为第一象限，y轴正方向向下，x正半轴向右，y轴正方向为0度，逆时针旋转为二三四象限
                         * 这里使用acos函数计算角度，利用两点y方向上的距离与半径,再根据象限判断出具体的角度
                         */

                        // 点击旋转按钮
                        $clone.on('mousedown', '.tool-container', function (e) {
                            // 设置可以旋转
                            is_move = true;
                            r = Math.sqrt((e.pageY - center_Y) * (e.pageY - center_Y) + (e.pageX - center_X) * (e.pageX - center_X));
                            default_deg = 180 / (Math.PI / Math.acos((e.pageY - center_Y) / r));
                            return false;
                        });
                        $clone.on('mousedown', function () {
                            // 每次点击默认为短点击
                            long_click = false;
                            // 过一秒后判断为长按
                            setTimeout(() => {
                                long_click = true;
                            }, 1000);
                        });
                        $clone.on('mouseup', function (e) {
                            // 当鼠标按下和抬起的时间小于1秒时，判断为click事件,且不在移动状态。显示旋转按钮
                            if (!long_click) {
                                $(this).find('.tool-container').toggleClass('hidden');
                            }
                            center_X = $clone.offset().left + $clone.width() / 2;
                            center_Y = $clone.offset().top + $clone.height() / 2;
                        });
                        $('html').mousemove(function (e) {
                            if (is_move) {
                                r = Math.sqrt((e.pageY - center_Y) * (e.pageY - center_Y) + (e.pageX - center_X) * (e.pageX - center_X));
                                let moveX = e.pageX;
                                let moveY = e.pageY;
                                move_deg = 180 / (Math.PI / Math.acos((e.pageY - center_Y) / r));
                                console.log(move_deg)
                                if (moveX == center_X && moveY > center_Y) { //鼠标在y轴正方向上
                                    move_deg = 0;
                                }
                                if (moveX == center_X && moveY < center_Y) { //鼠标在y轴负方向
                                    move_deg = 180;
                                }

                                if (moveX > center_X && moveY == center_Y) { //鼠标在x轴正方向上
                                    move_deg = 90;
                                }
                                if (moveX < center_X && moveY == center_Y) { //鼠标在x轴负方向
                                    move_deg = 270;
                                }
                                if (moveX > center_X && moveY > center_Y) { //鼠标在第一象限
                                    move_deg = move_deg;
                                }
                                if (moveX > center_X && moveY < center_Y) { //鼠标在第二象限
                                    move_deg = move_deg;
                                }

                                if (moveX < center_X && moveY < center_Y) { //鼠标在第三象限
                                    move_deg = 360 - move_deg;
                                }
                                if (moveX < center_X && moveY > center_Y) { //鼠标在第四象限
                                    move_deg = 360 - move_deg;
                                }
                                $clone.find('.inner').css("transform", "rotate(" + ((move_deg - default_deg) * (-1) + oldRotate || 0) + "deg)");
                            }
                        });
                        $('html').mouseup(function (e) {
                            is_move = false;
                            oldRotate = parseInt(getTransformRotate($clone.find('.inner').css('transform')));
                        });

                        // 设置克隆的对象能够拖拽
                        var drag_shap = $clone.draggable({
                            appendTo: '.drop-container',
                            containment: '.drop-container'
                        });

                        let clone_obj = {
                            clone: $clone,
                            draggable: drag_shap
                        }

                        // 只允许当前克隆的能够拖拽
                        if (clone_list.length > 0) {
                            clone_list[clone_list.length - 1].draggable.draggable('disable');
                            clone_list[clone_list.length - 1].clone.off('mousedown');
                            clone_list[clone_list.length - 1].clone.off('mouseup');
                            clone_list[clone_list.length - 1].clone.children('.tool-container').addClass('hidden');
                        }
                        // drop-container 中的克隆对象
                        clone_list.push(clone_obj);
                    }

                    console.log(_this.point_sets)
                }

            });
        }

        /**
         * drap event
         */
        this.dragEvent = function () {
            // 拖拽列表里的形状
            $('.drag-container .shap').draggable({
                appendTo: '.drop-container',
                helper: 'clone',
                start: function (event, ui) {}
            });
        }

        /**
         * 计算要画的圆心半径
         */
        this._computeCircleRadius = function () {

            _this.point_sets.forEach(function (ele, index) {
                ele.radius = 0;
                if (ele.points.length === 1) {
                    ele.radius = $('.drag-container .shap-container').eq(0).height() * 0.7;
                } else {
                    ele.points.forEach(function (item, i) {
                        let distance = pointsDistance(ele.center, item);
                        console.log(distance)
                        if (distance >= ele.radius) {
                            ele.radius = distance + $('.drag-container .shap-container').eq(0).height() * 0.7;
                        }
                    });
                }
                if (ele.radius >= _this.point_set_max_radius) {
                    ele.radius = _this.point_set_max_radius;
                }
            });
        }

        /**
         * 在drop-container 中创建一个canvas，并画出3个组合的圆
         * @param width drop-contaienr的width
         * @param height drop-contaienr的height
         */
        this._createDropcontainerCanvas = function (width, height) {

            // 计算要画的圆心半径
            _this._computeCircleRadius();


            // 在drop-container 中添加 canvas
            // 宽高在style中设置，会出现失真效果
            $('.drop-container').append(`
                <canvas id="drop-canvas" width="${width}px" height="${height}px"></canvas>
            `);

            // 设置canvas
            var drop_canvas = document.getElementById("drop-canvas");
            var ctx = drop_canvas.getContext('2d');
            ctx.strokeStyle = '#f00';

            //  遍历组合集合，画出3个圆
            _this.point_sets.forEach((ele, index) => {
                if (index < 3) {
                    ctx.beginPath();
                    ctx.arc(ele.center.x, ele.center.y, ele.radius, 0, 2 * Math.PI, false);
                    ctx.stroke();
                }
            });
            console.log(_this.point_sets)
            _this.audio = document.createElement('audio');
            playAudio(_this.point_sets);


            /**
             * 根据点集画圈
             * @param {Array} arr 点集数组
             */
            function playAudio(arr) {

                if (arr[0]) {
                    let ele = arr[0];
                    ctx.beginPath();
                    ctx.arc(ele.center.x, ele.center.y, ele.radius, 0, 2 * Math.PI, false);
                    ctx.stroke();

                    // 激励语音
                    _this.audio.src = recorde_data.stimulate;
                    _this.audio.play();
                    // console.log(_this.audio.readyState)
                    // 有可播放的音频,则直接进行画图
                    if (_this.audio.readyState == 0) {
                        // 将这个点集移除
                        arr.shift();
                        // 递归
                        playAudio(arr);
                    } else {
                        // 播放结束的监听事件
                        _this.audio.addEventListener('ended', function () {
                            arr.shift();
                            playAudio(arr);
                        }, false);
                    }
                }
            }
        }

        /**
         * 点击完成按钮
         */
        this.clickCompleteButton = function (callback) {
            // 作图完成的按钮
            $('.drop-container .btn-complete').on('click', (e) => {
                let $this = $(e.currentTarget);

                // 如果要画圈，则设置画圈后继续拼图个数
                let count = parseInt($this.data('count')) || 0;
                $this.data('count', ++count);
                // console.log(count)

                

                // 需要显示canvas来画圆
                if (_this.is_show_canvas) {
                    // 设置为false，下次点击不进行画圆
                    _this.is_show_canvas = false;
                    // 隐藏旋转按钮
                    $('.drop-container .tool-container').addClass('hidden');
                    // 语音激励后，记录继续拼图的数量
                    $('.page-content-container .drop-container').on('drop', (e) => {
                        console.log(e)
                        jigsaw_after_stimulate_count++;
                    });

                    // 在drop-container 中创建一个canvas，并画出3个组合的圆
                    _this._createDropcontainerCanvas($('.drop-container').width(), $('.drop-container').height());
                    // 隐藏完成按钮
                    $('.drop-container').find('.btn-complete').removeClass('hidden');

                } else {
                    _this.audio.pause();
                    layui.layer.open({
                        type: 0,
                        title: '提示',
                        content: '是否完成贴图?',
                        offset: '20%',
                        btn: ['确认', '取消'],
                        yes: function (index, layero) {
                            // 隐藏旋转按钮
                            $('.drop-container .tool-container').addClass('hidden');
                            // 隐藏我完成了按钮
                            $('.drop-container').find('.btn-complete').addClass('hidden');
                            // 移除画圆的canvas
                            $('.drop-container').find('canvas').remove();
                            console.log("上传贴图至服务器")
                            // 将贴图转换成canvas，然后上传到服务器
                            html2canvas($('.drop-container')[0]).then(function (canvas) {
                                // console.log(canvas)
                                console.log("上传贴图至服务器")

                                // 将`.drop-container`转换为二进制，上传到服务器
                                canvas.toBlob(function (blob) {
                                    console.log("转换二进制")
                                    var fd = new FormData();
                                    fd.append("file", blob);
                                    $.ajax({
                                        url: _HOST.add_rort + _HOST.resource.upload_file,
                                        type: 'POST',
                                        data: fd,
                                        // 不加工原始数据，确保图片上传成功
                                        processData: false,
                                        contentType: false,
                                        success: function (res) {
                                            console.log(res)
                                            if (res.Result) {
                                                console.log('上传成功！')
                                                // 图片id
                                                var id = res.Id;
                                                // 图片上传成功后保存记录
                                                $.ajax({
                                                    url: _HOST.add_rort + _HOST.student.jigsaw.add,
                                                    type: 'POST',
                                                    data: {
                                                        studentid: sessionStorage.getItem('user_id'),
                                                        courseid: sessionStorage.getItem('course_id'),
                                                        imgid: id
                                                    }
                                                })
                                                isopen = false
                                                auto_save_canvas(isopen)
                                            }
                                        }
                                    })
                                    console.log("调用ajax完成")
                                });

                            });

                            // 拼图完成了，如果激励后拼图数量>=5，则算算上额外分数
                            if (jigsaw_after_stimulate_count >= 5) {
                                module_score.jigsaw = global_setting.jigsaw_score + global_setting.stimulate_score;
                            }
                            $score.text(parseInt($score.text()) + module_score.jigsaw)
                            // 删除drag dom element
                            $('.jigsaw-wrap .drag-container').remove();
                            // 停止定时器
                            // _this.time_changing.stop();
                            _this.complete();
                            layui.layer.close(index);
                        },
                        btn2: function (index, layero) {
                            layui.layer.close(index);
                        }
                    })
                }


            });
        }

        /**
         * @description 获取transform ratate
         */
        function getTransformRotate(tr) {
            if (tr !== 'none') {
                var values = tr.split('(')[1].split(')')[0].split(',');
                var a = values[0];
                var b = values[1];
                var c = values[2];
                var d = values[3];
                var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
                return angle;
            } else {
                return 0;
            }
        }


        /**
         * 创建一个新的点集合
         * @param sets 组合点集合
         * @param point 新的一个点
         */
        function createPointSet(sets, point) {
            // 创建一个点集和
            var point_set = {
                points: [],
                center: {}
            }
            // 设置中心点和添加点
            point_set.points.push(point);
            point_set.center = point;

            // 将这个点集合添加到组合集合中
            sets.push(point_set)
        }

        /**
         * 判断两点之间的距离
         * @param p1 一个点对象
         * @param p2 另一个点对象
         * 
         * 返回两点之间的距离
         */
        function pointsDistance(p1, p2) {
            var cal_x = p1.x - p2.x;
            var cal_y = p1.y - p2.y;
            var length = 0;

            // 如果两点的x或者y相同，则直接算距离
            // 否则根据算术平方根来计算距离
            if (p1.x == p2.x) {
                length = Math.abs(p2.y - p1.y);
            } else if (p1.y == p2.y) {
                length = Math.abs(p1.x - p2.x);
            } else {
                length = Math.pow((cal_x * cal_x + cal_y * cal_y), 0.5);
            }
            return length;
        }

        /**
         * 两点之间的中心点
         * @param points 两个点的数组
         * 
         * 返回一个点对象
         */
        function centerForTwoPoints(points) {
            // 点1和点2
            var p1 = points[0];
            var p2 = points[1];

            var min_x = 0,
                min_y = 0,
                half_x = 0,
                half_y = 0;

            if (p1.x > p2.x) {
                min_x = p2.x;
                half_x = (p1.x - p2.x) / 2;
            } else if (p1.x < p2.x) {
                min_x = p1.x;
                half_x = (p2.x - p1.x) / 2;
            } else {
                min_x = p1.x;
                half_x = p1.x;
            }

            if (p1.y > p2.y) {
                min_y = p2.y;
                half_y = (p1.y - p2.y) / 2;
            } else if (p1.y < p2.y) {
                min_y = p1.y;
                half_y = (p2.y - p1.y) / 2;
            } else {
                min_y = p1.y;
                half_y = p1.y;
            }

            return {
                x: min_x + half_x,
                y: min_y + half_y
            }

        }

        /**
         * 计算一个点集合的中心点
         * @param points 点集合
         * 
         * 返回一个点对象{x:xx,y:yy}
         */
        function getPolygonAreaCenter(points) {

            /**
             * 计算点集合的中心点需要的函数
             */
            function Area(p0, p1, p2) {
                var area = 0.0;
                area = p0.x * p1.y + p1.x * p2.y + p2.x * p0.y - p1.x * p0.y - p2.x * p1.y - p0.x * p2.y;
                return area / 2;
            }

            var sum_x = 0;
            var sum_y = 0;
            var sum_area = 0;
            var p1 = points[1];
            for (let i = 2; i < points.length; i++) {
                let p2 = points[i];
                let area = Area(points[0], p1, p2);
                sum_area += area;
                sum_x += (points[0].x + p1.x + p2.x) * area;
                sum_y += (points[0].y + p1.y + p2.y) * area;
                p1 = p2;
            }
            var xx = sum_x / sum_area / 3;
            var yy = sum_y / sum_area / 3;
            return {
                x: xx,
                y: yy
            };
        }

        /**
         * 获取点集合的中心点
         * @param points 点集合
         * 
         * 返回中心点对象
         */
        function getPointsCenter(points) {
            var point = {};
            if (points.length === 1) {
                point = points[0]
            } else if (points.length == 2) {
                point = centerForTwoPoints(points);
            } else if (points.length > 2) {
                point = getPolygonAreaCenter(points);
            }

            return point;
        }

    }

    /**
     * 写作模块
     */
    function writingModule(opt) {
        var _this = this;

        // 写作模块
        let $composition_container = $('.writing-composition-container');
        // drop container
        let $drop_container = $('.drop-container');

        /**
         * 完成此模块的后续操作
         */
        this.complete = opt.complete || function () {}

        this.setting = {
            // 模块进度
            progress: {
                READY: -1,
                START: 0,
                UPLOAD: 1,
                FINISH: 2,
                // 当前进度
                current: -1
            }
        }


        this.init = function () {
            // 样式
            this._moduleStyle();
            // 开始上课
            this._clickStartWritingButton();
            // 上传作文
            this._clickUploadButton();
            // 结束上课
            this._clickFinishClassButton();
            // 倒计时
            // this._time();
        }


        /**
         * 判断当前操作是否符合模块的进度（暂时没用）
         * @returns {Boolean} true||false 
         * 
         */
        this._judgeProgress = function (string) {

            // 当前时开始写作状态
            if (_this.setting.progress.current === _this.setting.progress.READY && string == '开始写作') {
                return true;
            } else if (_this.setting.progress.current === _this.setting.progress.START && string == '上传作文') {
                return true;
            } else if (_this.setting.progress.current === _this.setting.progress.UPLOAD && string == '结束上课') {
                return true;
            }

            // if (_this.setting.progress.current === _this.setting.progress.READY) {
            //     layui.layer.open({
            //         type: 0,
            //         content: '接下来需要点击<b>开始写作</b>按钮',
            //         offset: '20%',
            //         time: 3000
            //     });
            // } else if (_this.setting.progress.current === _this.setting.progress.START) {
            //     layui.layer.open({
            //         type: 0,
            //         content: '接下来需要点击<b>上传作文</b>按钮',
            //         offset: '20%',
            //         time: 3000
            //     });
            // } else if (_this.setting.progress.current === _this.setting.progress.UPLOAD) {
            //     layui.layer.open({
            //         type: 0,
            //         content: '接下来需要点击<b>结束上课</b>按钮',
            //         offset: '20%',
            //         time: 3000
            //     });
            // }

            return false;
        }

        /**
         * 设置计时
         */
        this._time = function () {


            // // 初始化计时
            // _this.time_changing = $('.page-header-container .time').timeChanging({
            //     time: global_setting.writing_duration
            // });


            // 时间到了的提示
            // _this.timer = setInterval(function () {
            //     if (_this.time_changing.isTimeOver()) {
            //         clearInterval(_this.timer)
            //         layui.layer.open({
            //             type: 0,
            //             content: '时间到了',
            //             offset: '20%',
            //         });
            //     }
            // }, 1000);

        }

        /**
         * 模块样式设置
         */
        this._moduleStyle = function () {

            $composition_container.css({
                display: 'block',
                width: $drop_container.width() + 'px',
                height: $drop_container.height() + 'px',
                'margin-left': $drop_container.outerWidth() + 50 + 'px'
            });
        }

        /**
         * 点击上传按钮
         */
        this._clickUploadButton = function () {

            $composition_container.find('.upload button').on('click', (e) => {
                let file_upload_arr = [];
                // if (_this._judgeProgress('上传作文')) {
                layui.layer.open({
                    type: 1,
                    title: '上传作文',
                    offset: '20%',
                    content: `
                            <form class="layui-form">
                                <div class="file-upload-wrap" style="width: 600px; margin: 50px auto;">
                                    <input id="file_upload" type="file" name="file" multiple />
                                    <button type="button" class="btn-submit btn btn-primary" lay-filter="submit" style="margin-top: 20px;">确认</button>
                                </div>
                            </form>
                        `,
                    success: function (layero, index) {
                        layui.layer.full(index);
                        //文件上传url
                        var uploadUrl = _HOST.add_rort + _HOST.resource.upload_file;
                        /*
                         * 文件上传的配置及返回结果
                         */
                        $("#file_upload").fileInputInit({
                            uploadUrl: uploadUrl,
                            extendName: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'TGA']
                        }, function (res) {
                            // data.Id += res.data.response.Id + ',';     //产品展示图片id
                            file_upload_arr.push(res);
                            console.log(file_upload_arr)
                        }, function (id) {
                            file_upload_arr.forEach((ele, index) => {
                                console.log(ele.previewId)
                                console.log(id)
                                if (ele.previewId == id) {
                                    file_upload_arr.splice(index, 1);
                                }
                            })
                            console.log(file_upload_arr)
                        });

                        $(layero).find('.btn-submit').click(function (e) {

                            let sendData = {
                                studentid: sessionStorage.getItem('user_id'),
                                courseid: sessionStorage.getItem('course_id'),
                                imgid: []
                            };

                            // 图片id
                            file_upload_arr.forEach((ele, index) => {
                                sendData.imgid.push(ele.id);
                            });
                            console.log(sendData)
                            if (sendData.imgid.length <= 0) {
                                layui.layer.open({
                                    type: 0,
                                    content: '请先上传图片',
                                    offset: '20%',
                                    time: 3000
                                });
                            } else {
                                $.ajax({
                                    url: _HOST.add_rort + _HOST.student.composition.add,
                                    type: 'POST',
                                    data: sendData,
                                    success: function (res) {
                                        if (res.Result) {
                                            _this.setting.progress.current++;
                                            layui.layer.open({
                                                type: 0,
                                                content: '上传成功',
                                                offset: '20%',
                                                end: function () {
                                                    layui.layer.close(index);
                                                }
                                            });
                                        } else {
                                            layui.layer.open({
                                                type: 0,
                                                content: '上传失败',
                                                offset: '20%',
                                                end: function () {
                                                    // layui.layer.close(index);
                                                }
                                            });
                                        }
                                    }
                                })
                            }
                        });
                    }
                });
                // }
            });


        }

        /**
         * 点击结束上课按钮
         */
        this._clickFinishClassButton = function () {
            $composition_container.find('.finish button').on('click', (e) => {
                let sumTime = $('.time').find('.h').text() + ":"+  $('.time').find('.m').text() + ":" + $('.time').find('.s').text();
                console.log(sumTime)
                layui.layer.open({
                    type: 0,
                    title: '注意',
                    content: '是否要结束上课',
                    offset: '20%',
                    btn: ['确认', '取消'],
                    yes: function () {
                        // 页面跳转不需要提示
                        // window.is_confirm = false;
                        // location.href = _HOST.root + 'student/student-user-center.html';
                        // 清除定时器
                        clearInterval(timeadd)
                        // let bool =true;
                        // auto_save_canvas(bool)
                        // 请求提示
                        let layer_index = layui.layer.load();
                        
                        $.ajax({
                            url: _HOST.add_rort + _HOST.class.finish,
                            type: 'POST',
                            data: {
                                studentid: sessionStorage.getItem('user_id'),
                                courseid: sessionStorage.getItem('course_id'),
                                grade: $.trim($('.page-header-container .score span').text()),
                                courseTime:sumTime
                            },
                            complete: () => {
                                // 请求成功，清除请求提示
                                layui.layer.close(layer_index);
                            },
                            success: function (res) {
                                if (res.Result) {
                                    layui.layer.open({
                                        type: 0,
                                        content: '本节课结束！' + '<br />' + res.info,
                                        offset: '20%',
                                        end: function () {
                                            // 页面跳转不需要提示
                                            window.is_confirm = false;
                                            location.href = _HOST.root + 'student/student-user-center.html';
                                        }
                                    });
                                } else {
                                    layui.layer.open({
                                        type: 0,
                                        content: '请重试',
                                        offset: '20%',
                                        end: function () {
                                            // layui.layer.close(index);
                                        }
                                    });
                                }
                            }
                        })
                    },
                    btn2: function (index, layero) {
                        layui.layer.close(index);
                    }
                });
            });

        }

        /**
         * 点击开始上课按钮
         */
        this._clickStartWritingButton = function () {
            $composition_container.find('.start button').on('click', (e) => {
                _this.setting.progress.current = _this.setting.progress.START;
                $composition_container.find('.start').remove();
                // _this.time_changing.start();--
                // $()
            });
        }


        /**
         * @description 获取transition对象的duration
         * @param obj jQuery对象或者DOM对象
         * @return 对象transition-duration 的毫秒值
         */
        function get_transition_time(obj) {
            let $obj = $(obj);
            let time = $obj.css('transition-duration');

            if (time && time.toLowerCase().indexOf('ms') > -1) {
                return parseFloat(time);
            } else {
                return parseFloat(time) * 1000;
            }

        }

    }
});