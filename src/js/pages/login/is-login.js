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
            content: '登录信息已失效，请重新登录！',
            end: () => {
                window.is_confirm = false;
                location.href = _VIEW.index;
            }
        })
    }
});