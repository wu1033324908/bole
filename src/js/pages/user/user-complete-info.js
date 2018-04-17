/**
 * @description 用户个人中心修改个人信息
 * @author zhengshenli
 * @createAt 2018-03-09
 */
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {
    // 设置html属性 fontsize
    $.setPageFontSize();
    // 设置footer margin-top
    $.setFooterMargin();



    initForm();
    formSubmit();

    /**
     * 前往个人中心页面
     */
    function gotoUserCenter() {
        $('.btn-goto-user-center').click(function () {
            location.href = _HOST.root + 'user/user-center.html';
        });
    }

    /**
     * 表单初始化
     */
    function initForm() {
        let $form = $('form');
        $form.find('.tel').text(sessionStorage.getItem('user_tel'));
        $form.find('input[name=mail]').val(sessionStorage.getItem('user_email'));
        $form.find('input[name=nickname]').val(sessionStorage.getItem('user_nick_name'));
        $form.find('input[name=addresscapital]').val(sessionStorage.getItem('user_province'));
        $form.find('input[name=addressdistrict]').val(sessionStorage.getItem('user_city'));
        $form.find('input[name=grade]').val(sessionStorage.getItem('user_grade'));
    }

    /**
     * 表单提交
     */
    function formSubmit() {
        let sendData = {};
        // 学生id
        sendData.id = sessionStorage.getItem('user_id');

        layui.form.on('submit(modify)', function (data) {
            for (let i in data.field) {
                sendData[i] = data.field[i];
            }
            console.log(sendData)
            $.ajax({
                url: _HOST.add_rort + _HOST.user.student.complete_info,
                type: 'POST',
                data: sendData,
                success: function (res) {
                    if (res.Result) {
                        layui.layer.open({
                            type: 0,
                            title: '结果',
                            offset: '20%',
                            content: '操作成功',
                            btn: ['确认'],
                            yes: (index, layero) => {
                                layui.layer.close(index);
                                location.href = _HOST.root + 'user/user-center.html';
                            },
                            closeBtn: 2
                        });
                    } else {
                        layui.layer.open({
                            type: 0,
                            title: '结果',
                            offset: '20%',
                            content: res.Desc || '操作失败',
                            btn: ['确认'],
                            yes: (index, layero) => {
                                layui.layer.close(index);
                            },
                            closeBtn: 2
                        });
                    }
                },
                error: function (err) {
                    layui.layer.open({
                        type: 0,
                        title: '结果',
                        offset: '20%',
                        content: '请求失败',
                        btn: ['确认'],
                        yes: (index, layero) => {
                            layui.layer.close(index);
                        },
                        closeBtn: 2
                    });
                }
            })
        });
    }
})