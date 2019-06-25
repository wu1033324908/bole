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
    imgUpload ()

    function imgUpload () {
        var sendData = {};
        let file_upload_arr = [];
        var uploadUrl = _HOST.add_rort + _HOST.resource.upload_file;
        $("#file_upload").fileInputInit({
            uploadUrl: uploadUrl,
            extendName: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'TGA']
        }, function (res) {
            // 上传成功，保存上传数据
            file_upload_arr.push(res);
            // console.log("===========================")
            // console.log(res)
            // console.log("===========================")
            
        }, function (id) {
            // 移除图片，删除保存的数据
            file_upload_arr.forEach((ele, index) => {
                // console.log(ele.previewId)
                // console.log(id)
                if (ele.previewId == id) {
                    file_upload_arr.splice(index, 1);
                }
            })
            // console.log(file_upload_arr)
            
        });
        $('#kvFileinputModal').hide()
        layui.form.on('submit(complete)', function (data) {
            // console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}

            sendData.imgid = [];

            // 判断教师注册是否有上传图片
            if (data.field.type == 2 && file_upload_arr.length === 0) {
                layui.layer.open({
                    type: 0,
                    content: '请先上传图片',
                    offset: '20%',
                    anim: 2,
                });
                return false;
            }
            // 请求数据
            for (var i in data.field) {
                sendData[i] = data.field[i];
            }

            // 教师注册请求图片id
            file_upload_arr.forEach((ele, index) => {
                sendData.imgid.push(ele.id);
            })
            // console.log("wancheng")
            // console.log(sendData)
            $.ajax({
                type: "post",
                url: "http://47.100.33.5:60001/Teacher/UploadTemplate",
                data: {
                    teacherId:sessionStorage.getItem('user_id'),
                    imgid:sendData.imgid[0]
                },
                success: function (res) {
                    if(res.result){
                        layer.msg("提交成功！")
                        setTimeout(()=>{
                            window.location.href = _HOST.root + "teacher/teacher-user-center.html"
                        },1000)
                    }
                }
            });
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    }

});