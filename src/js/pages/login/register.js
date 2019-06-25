/**
 * @description 注册
 * @author zhengshenli
 */
var _GLOBAL = require('tool/global');
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {

    // 表单验证
    formVerify();
    // 注册
    registerSubmit();

    // 设置邀请人手机号
    $('form').find('input[name=referrer]').val(sessionStorage.getItem('introducer_phone'));

    

    // 获取手机验证码
    $('.get-code').on('click', (e) => {
        // 发送验证码对象
        let $this = $(e.currentTarget);

        // 用户名（手机号）
        let username = $('input[name=username]').val();

        if (username) {

            // 下次可以重新发送验证码的倒计时，单位秒
            let sending_time = 60;

            // 设置发送验证码按钮不可用
            $this.attr('disabled', 'disabled');

            // 设置定时器，倒计时下次可以发送验证码的时间
            let sending_timer = setInterval(() => {
                sending_time--;
                // 设置文本
                $this.html(sending_time + '秒');

                // 倒计时结束，清除定时器，并设置文本和可用状态
                if (sending_time === 0) {
                    clearInterval(sending_timer);
                    $this.html('获取验证码');
                    $this.removeAttr('disabled');
                }
            }, 1000);

            // 发送验证码请求
            $.ajax({
                url: _HOST.add_rort + _HOST.login.phone_msg,
                type: 'POST',
                data: {
                    phonenum: username,
                    way: 1
                },
                success: function (res) {
                    console.log(res)
                    if (!res.Result) {
                        layui.layer.open({
                            type: 0,
                            content: res.desc || res.Desc,
                            offset: '20%',
                            anim: 2,
                        });
                    }
                }
            })
        }
    });
    
    /**
     * 注册的submit事件
     */
    function registerSubmit() {
        var sendData = {};

        let file_upload_arr = [];

        //文件上传url
        var uploadUrl = _HOST.add_rort + _HOST.resource.upload_file;
        /*
         * 文件上传的配置及返回结果
         */
        $("#file_upload").fileInputInit({
            uploadUrl: uploadUrl,
            extendName: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'TGA']
        }, function (res) {
            // 上传成功，保存上传数据
            file_upload_arr.push(res);
            console.log(file_upload_arr)
        }, function (id) {
            // 移除图片，删除保存的数据
            file_upload_arr.forEach((ele, index) => {
                console.log(ele.previewId)
                console.log(id)
                if (ele.previewId == id) {
                    file_upload_arr.splice(index, 1);
                }
            })
            console.log(file_upload_arr)
        });

        layui.form.on('submit(register)', function (data) {
            console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}

            sendData.imgid = [];

            // 判断教室注册是否有上传图片
            // if (data.field.type == 2 && file_upload_arr.length === 0) {
            //     layui.layer.open({
            //         type: 0,
            //         content: '请先上传图片',
            //         offset: '20%',
            //         anim: 2,
            //     });
            //     return false;
            // }
            // 请求数据
            for (var i in data.field) {
                sendData[i] = data.field[i];
            }

            // 教师注册请求图片id
            file_upload_arr.forEach((ele, index) => {
                sendData.imgid.push(ele.id);
            })

            // 请求进度提示
            let layer_index = layui.layer.load();
            // 获得公钥
            $.ajax({
                url: _HOST.add_rort + _HOST.login.get_public_key,
                type: 'POST',
                data: {
                    username: sendData.username
                },
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
                            url: _HOST.add_rort + _HOST.login.register,
                            type: 'POST',
                            data: sendData,
                            complete: function () {
                                // 注册请求成功，关闭请求进度提示
                                layui.layer.close(layer_index);
                            },
                            success: function (res) {
                                if (res.Result) {
                                    layui.layer.open({
                                        type: 0,
                                        content: '注册成功',
                                        offset: '20%',
                                        anim: 2,
                                        end: () => {
                                            // 注册成功，页面跳转到首页
                                            location.href = _VIEW.index;
                                        }
                                    });
                                } else {
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
            'double-pass': function (value, item) {
                let pass = $('input[name=password]').val();
                if (value != pass) {
                    return '两次密码输入不正确';
                }
            }
        });
    }
    shareHere()
    // 注册时选择注册类型，显示不同的操作界面
    layui.form.on('select(type)', function (data) {
        console.log(data.value); //得到被选中的值
        if (data.value == 1) {
            // 显示学生注册界面
            $('.student-group').css('display', 'block').siblings('.change-group').css('display', 'none');
        } else if (data.value == 2) {
            // 显示教师注册界面
            $('.student-group').css('display', 'none');
        } else {
            // 显示管理员注册界面
            $('.change-group').css('display', 'none');
        }
    });


    function shareHere() {
        var loc=location.href;
        var n1=loc.length;
        var n2=loc.indexOf("?");
        var tel=decodeURI(loc.substr(n2+1, n1-n2));
        if (tel.length == 11) {
            $('select[name=type]').val(1)
            
            layui.form.render('select')

            $('.student-group').css('display', 'block').siblings('.change-group').css('display', 'none');
            $('input[name=referrer]').val(tel)
        }
    }

})