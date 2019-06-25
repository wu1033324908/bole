/**
 * @description 播放音频
 * 支持显示视频或者富文本或者两者一起
 * @author zhengshenli
 */
var _GLOBAL = require('tool/global');
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {

    // 播放器对象
    var player = null;
    
    // 视频链接
    var video_src = sessionStorage.getItem('video_src');
    // 富文本数据
    var rich_text = sessionStorage.getItem('video_rich_text');
    // 标题
    var title = sessionStorage.getItem('video_title');

    init();
    /**
     * 页面初始化
     */
    function init() {
        // 标题
        $('.title').html(title);
        // 如果有视频src
        if(video_src) {
            // 初始化视频
            initPlayer();
        }else {
            // 移除视频播放器
            $('#video-player').remove();
        }

        // 如果有富文本
        if(rich_text) {
            // 填入富文本
            initRichText();
        }

        // $.setFooterMargin();
        
    }

    /**
     * 初始化播放器
     */
    function initPlayer() {
        player = new Aliplayer({
            id: 'video-player',
            width: '100%',
            height: '400px',
            autoplay: true,

            //支持播放地址播放,此播放优先级最高
            source: video_src,

        });

        player.on('ready', function () {
            console.log('播放器创建好了。');
            //				player.player();
            // player.getDuration();
            console.log(player.getDuration())
            // player.seek(10)
            // console.log(player.getCurrentTime())

            player.on('startSeek', function () {
                console.log(arguments)
            });
        });
    }
    /**
     * 初始化富文本
     */
    function initRichText() {
        $('.rich-text').html(Base.decode(rich_text));
    }
})