/**
 * @description 登录
 * @author zhengshenli
 */
var _GLOBAL = require('tool/global');
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {
    formVerify();
    loginSubmit();

    console.log(layui.form)

    /**
     * 登录的submit事件
     */
    function loginSubmit() {
        
        layui.form.on('submit(login)', function (data) {
            console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
            // alert("我在登录")

            var sendData = {}

            for (var i in data.field) {
                sendData[i] = data.field[i];
            }
            console.log(sendData)
            
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

                        // 登录请求
                        $.ajax({
                            url: _HOST.add_rort + _HOST.login.login,
                            type: 'post',
                            data: sendData,
                            complete: function () {
                                layui.layer.close(layer_index);
                            },
                            success: function (res) {
                                // console.log(res)
                                if (res.Result) {
                                    sessionStorage.setItem('user_tel', res.Phonenum);
                                    sessionStorage.setItem('user_id', res.UserId);
                                    sessionStorage.setItem('user_type', res.Type);
                                    layui.layer.open({
                                        type: 0,
                                        content: '登录成功',
                                        offset: '20%',
                                        anim: 2,
                                        time: 3000,
                                        end: function () {
                                            // location.href = _HOST.root + 'user/user-center.html';
                                            if (res.Type == 1) {
                                                location.href = _VIEW.user_center.student.index;
                                                sessionStorage.setItem('course_id', res.CourseId);
                                            } else if (res.Type == 2) {
                                                location.href = _VIEW.user_center.teacher.index;
                                            } else if (res.Type == 3) {
                                                sessionStorage.setItem('role_id', res.Data[0].Id);
                                                sessionStorage.setItem('role_name', res.Data[0].Name);
                                                location.href = _VIEW.admin.index + '?i=' + Base.encode(res.UserId.toString()) + '&u=' + Base.encode(res.Phonenum);
                                            }
                                        }
                                    });
                                }else {
                                    layui.layer.open({
                                        type: 0,
                                        content: res.Desc || '登录失败',
                                        offset: '20%',
                                        anim: 2,
                                    });
                                }
                            }
                        })

                    }
                }
            });



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
            ]
        });
    }

})