/**
 * @description 客服中心
 * @author zhengshenli
 */
var _GLOBAL = require('tool/global');
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {


    $.showResourceInBrowser();

    /**
     * 富文本对应的类型
     */
    var rich_text_type = $.GetQueryString('t');
    /**
     * 对应类型的富文本title
     */
    var rich_text_title = '';
    /**
     * 富文本所有对应的title
     * type:代表不同的富文本
     *  
     */
    var title_arr = [{
            type: 1,
            name: '关于我们'
        },
        {
            type: 2,
            name: '友情链接'
        },
        {
            type: 3,
            name: '联系我们'
        },
        {
            type: 4,
            name: '关于我们'
        },
    ];

    // forEach 只能使用通过抛出 foreach.break异常才能停止循环
    try {
        title_arr.forEach((ele, index) => {
            if (rich_text_type == ele.type) {
                rich_text_title = ele.name;
                foreach.break = new Error("StopIteration");
            }
        });
    } catch (e) {
        // return;
    }


    getDetail();

    /**
     * 获取详细数据
     */
    function getDetail() {
        let layer_index = layui.layer.load();

        $.ajax({
            url: _HOST.add_rort + _HOST.rich_text.get,
            type: 'POST',
            data: {
                type: rich_text_type
            },
            complete: function () {
                layui.layer.close(layer_index);
            },
            success: (res) => {
                var $container = $('.left-container');
                if (res.Result) {
                    // var data = res.Data[0];
                    $container.find('.header h1').html(rich_text_title);
                    // $container.find('.header .name').html(data.NickName);
                    // $container.find('.header .publish-time').html(data.CreatedAt.replace('T', ' ').substring(0, 19));

                    var $container_body = $container.find('.body');
                    if (res.RichText) {
                        $container_body.append(Base.decode(res.RichText));
                    }
                }

            }
        });
    }

    /**
     * 分享模块
     */
    function shareContent() {
        console.log('dfjla')
        var user_tel = sessionStorage.getItem('user_tel') || '';
        sosh('#soshid', {
            // 分享的链接，默认使用location.href
            url: `${location.origin}${_VIEW.index}?i=${user_tel}`,
            // 分享的标题，默认使用document.title
            title: '伯乐想象作文',
            // 分享的摘要，默认使用<meta name="description" content="">content的值
            digest: '',
            // 分享的图片，默认获取本页面第一个img元素的src
            pic: '',
            // 选择要显示的分享站点，顺序同sites数组顺序，
            // 支持设置的站点有weixin,yixin,weibo,qzone,tqq,douban,renren,tieba
            sites: ['weixin']
        })
    }

});