/**
 * @description 百分榜详情
 * @author zhengshenli
 */
var _GLOBAL = require('tool/global');
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {

    // 设置html属性 fontsize
    $.setPageFontSize();
    // 设置fotter margin-top
    $.setFooterMargin();

    getDetail();
    $.showResourceInBrowser();

    /**
     * 获取详细数据
     */
    function getDetail() {
        let layer_index = layui.layer.load();

        $.ajax({
            url: _HOST.add_rort + _HOST.student.high_mark.get_detail,
            type: 'POST',
            data: {
                hundredid: $.GetQueryString('compositionid')
            },
            complete: function () {
                layui.layer.close(layer_index);
            },
            success: (res) => {
                var $container = $('.left-container');
                if (res.Result) {
                    var data = res.Data[0];
                    $container.find('.header h1').html(data.Headline);
                    $container.find('.header .name').html(data.NickName);
                    $container.find('.header .publish-time').html(data.CreatedAt.replace('T', ' ').substring(0, 19));

                    var $container_body = $container.find('.body');
                    data.Url.forEach((ele, index) => {
                        $container_body.append(`
                            <div class="img-box">
                                <img class="show_resource_in_browser" src="${ele}" data-src="${ele}">
                            </div>
                        `);
                    });
                }
                // 设置fotter margin-top
                $.setFooterMargin();
            }
        });
    }

});