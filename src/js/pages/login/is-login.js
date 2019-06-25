/**
 * @description Index page logic
 * @author Liam
 */
var _GLOBAL = require('tool/global');
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {
    // 加载遮罩层
    var $loading = $('body');
    $.pageLoading($loading);
    if(sessionStorage.getItem('user_id')) {
        
        $loading.loading_finish = true;
    }else {
        layui.layer.open({
            type: 0,
            content: '暂未登录，请先登录或注册',
            end: () => {
                window.is_confirm = false;
                location.href = _VIEW.index;
            }
        })
    }
});