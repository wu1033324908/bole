/**
 * @description 操作手册
 * @author zhengshenli
 * @createAt 2018-03-09
 */
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');

$(function () {

    $.ajax({
        type: "post",
        url: "http://47.100.33.5:60001/Admin/GetStudentCTRL",
        data: {

        },
        success: function (res) {
            var fullText = res.data[0].RichText;
            // console.log("fullText = " + fullText)
            if (fullText.length > 0) {

                let _DETIAL = Base.decode(fullText)
                $('.show-use-content').html(_DETIAL)
            } else {
                $('.show-use-content').html("<h1>暂无数据</h1>")

            }
        }
    });
});