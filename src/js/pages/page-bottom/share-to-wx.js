/**
 * @description 微信分享
 * @author zhengshenli
 */
var _GLOBAL = require('tool/global');
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {

    shareContent();

    /**
     * 分享模块
     */
    function shareContent() {
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