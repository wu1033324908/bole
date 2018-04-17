/**
 * @description 注册教师的教程
 * @author zhengshenli
 * @createAt 2018-03-20
 */
var _GLOBAL = require('tool/global');
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {

    let layer_index = layui.layer.load();
    $.ajax({
        url: _HOST.add_rort + _HOST.login.get_register_template,
        type: 'POST',
        complete: () => {
            layui.layer.close(layer_index)
        },
        success: (res) => {
            if (res.Result) {
                if (res.Data[0].Describe) {
                    $('.richtext-content').html(Base.decode(res.Data[0].Describe));

                    let $img_box = $('#resource').find('.img-box');
                    res.Data[0].ThumbnailUrl.forEach((ele, index) => {
                        $img_box.append(`
                            <div class="item">
                                <img class="origin-image show_resource_in_browser" src="${ele}" data-src="${res.Data[0].Url[index]}" title="点击下载" data-index="${index+1}" alt="">
                            </div>
                        `)
                    });

                    $img_box.find('img').click((e) => {
                        let $this = $(e.currentTarget);
                        let url = $this.data('src');
                        let index = $this.data('index');

                        $.getBase64(url)
                            .then(function (base64) {
                                $.downloadFile('批改模板' + index + '.png', base64);
                            }, function (err) {
                                console.log(err);
                            });

                    });
                }
            }
            $.setFooterMargin();
        }
    })


});