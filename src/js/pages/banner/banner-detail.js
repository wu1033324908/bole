/**
 * @description banner 详情
 * @author zhengshenli
 */
var _GLOBAL = require('tool/global');
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {

    // 设置html属性 fontsize
    $.setPageFontSize();

    // getDetail();
    $.showResourceInBrowser();

    // 从url处获取title和content
    var title = $.GetQueryString('t');
    var content = $.GetQueryString('c');
    console.log(title)
    console.log(content)

    var $container = $('.left-container');
    var $container_body = $container.find('.body');

    if(title) {
        $container.find('.header h1').html(Base.decode(title));
    }
    if(content) {
        $container_body.html(Base.decode(content));;
    }


});