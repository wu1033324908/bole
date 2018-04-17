/**
 * @description Index page logic
 * @author Liam
 */
var _GLOBAL = require('tool/global');
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {

    formVerify();
    registerSubmit();

    console.log(layui.form)


    // 获取手机验证码
    $('.get-code').on('click', (e) => {
        let $this = $(e.currentTarget);

        let username = $('input[name=username]').val();

        if (username) {

            let sending_time = 60;
            let sending_timer = null;

            $this.attr('disabled', 'disabled');
            sending_timer = setInterval(() => {
                sending_time--;
                $this.html(sending_time + '秒');

                if (sending_time === 0) {
                    clearInterval(sending_timer);
                    $this.html('获取验证码');
                    $this.removeAttr('disabled');
                }
            }, 1000);

            $.ajax({
                url: _HOST.add_rort + _HOST.login.phone_msg,
                type: 'POST',
                data: {
                    phonenum: username,
                    way: 2
                },
                success: function (res) {
                    console.log(res)
                    if(res.Result) {
                    }else {
                        layui.layer.open({
                            type: 0,
                            content: res.desc,
                            offset: '20%',
                            anim: 2,
                        });
                    }
                }
            })
        } else {
            console.log('获取失败')
        }
    });

    /**
     * 注册的submit事件
     */
    function registerSubmit() {
        var sendData = {};

        layui.form.on('submit(register)', function (data) {
            console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}

            for (var i in data.field) {
                sendData[i] = data.field[i];
            }
            sendData.phonenum = sendData.username;

            console.log(sendData)
            
            let layer_index = layui.layer.load();

            // 获得公钥
            $.ajax({
                url: _HOST.add_rort + _HOST.login.get_public_key,
                type: 'POST',
                data: { username: sendData.username},
                success: function (res) {
                    if (res.Result) {
                        //设置最大位数
                        setMaxDigits(131);
                        //获得公钥
                        var key = new RSAKeyPair(res.Exponent, '', res.Modulus);
                        //对密码进行RSA加密
                        sendData.password = encryptedString(key, base64encode(sendData.password));
                        
                        // 注册请求
                        $.ajax({
                            url: _HOST.add_rort + _HOST.login.modif_pwd,
                            type: 'POST',
                            data: sendData,
                            complete: function () {
                                layui.layer.close(layer_index);
                            },
                            success: function (res) {
                                if (res.Result) {
                                    layui.layer.open({
                                        type: 0,
                                        content: '修改成功',
                                        offset: '20%',
                                        anim: 2,
                                        end: () => {
                                            location.href = _VIEW.index;
                                        }
                                    });
                                }else {
                                    layui.layer.open({
                                        type: 0,
                                        content: res.desc || '操作失败',
                                        offset: '20%',
                                        anim: 2,
                                    });
                                }
                            }
                        })

                    }
                }
            })

            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    }

    /**
     * form 表单验证
     */
    function formVerify() {
        layui.form.verify({
            username: function (value, item) { //value：表单的值、item：表单的DOM对象
                    if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                        return '用户名不能有特殊字符';
                    }
                    if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                        return '用户名首尾不能出现下划线\'_\'';
                    }
                    if (/^\d+\d+\d$/.test(value)) {
                        return '用户名不能全为数字';
                    }
                }

                //我们既支持上述函数式的方式，也支持下述数组的形式
                //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
                ,
            pass: [
                /^[\S]{6,12}$/, '密码必须大于等于6位，且不能出现空格'
            ],
            'double-pass': function(value, item) {
                let pass = $('input[name=password]').val();
                if(value != pass) {
                    return '两次密码输入不正确';
                }
            }
        });
    }

    layui.form.on('select(type)', function (data) {
        console.log(data.value); //得到被选中的值
        if (data.value == 1) {
            $('.student-group').css('display', 'block').siblings('.change-group').css('display', 'none');
        } else if (data.value == 2) {
            $('.teacher-group').css('display', 'block').siblings('.change-group').css('display', 'none');
        } else {
            $('.change-group').css('display', 'none');
        }
    });

})