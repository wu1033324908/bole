/**
 * @description 学生上传百分榜
 * @author zhengshenli
 * @createAt 2018-03-09
 */
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {

    /**
     * @description datatable 对象
     */
    var _TABLE;

    // 初始化表格
    initTable();
    // 表格搜索
    $.initSearchTable(_TABLE, _HOST.add_rort + _HOST.student.high_mark.list_self);
    // 在浏览器中打开缩略图的大图
    $.showResourceInBrowser();
    // 添加
    initAddModule();
    // 详细信息
    initDescModule();
    // 主动撤回未审核记录
    revocationOperate();

    // uploadFileModule();

    /**
     * @description 初始化表格
     */
    function initTable() {
        _TABLE = $('#table').dataTable({
            ajax: {
                url: _HOST.add_rort + _HOST.student.high_mark.list_self,
                type: 'POST',
                data: {
                    studentid: sessionStorage.getItem('user_id')
                },
                dataSrc: (res) => {
                    return res.Data;
                }
            },
            columns: [{
                    title: '序号',
                    data: '',
                    orderable: false,
                    searchable: false,
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return '';
                    }
                }, {
                    title: '操作',
                    data: '',
                    orderable: false,
                    searchable: false,
                    className: 'btn-td show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = `<a type="button" class="btn btn-default btn-sm btn-desc" data-modify='${JSON.stringify(row)}' title="详情">详情</a>`;

                        // 如果此记录还未审核
                        if (!row.IsAudit && row.IsCorrect) {
                            result += `<a type="button" class="btn btn-default btn-sm btn-back" data-modify='${JSON.stringify(row)}' title="撤回">撤回</a>`;
                        }
                        return result;
                    }
                },
                {
                    title: '作文标题',
                    data: 'Headline',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: '年级',
                    data: 'Grade',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data}">${data}</div>`;
                    }
                },
                {
                    title: '审核',
                    data: 'IsAudit',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '通过';

                        // false表示被拒绝
                        if (!row.IsCorrect) {
                            result = '未通过';

                        } else if (!data) {
                            // false 表示待审核
                            result = '待审核';
                        }

                        return `<div class="td-ellipsis">${result}</div>`;
                    }
                },
                {
                    title: '图片',
                    data: 'ThumbnailUrl',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<a type="button" class="btn btn-default btn-sm btn-desc" data-modify='${JSON.stringify(row)}' title="详情">详情</a>`;
                    }
                },
                {
                    title: '创建时间',
                    data: 'CreatedAt',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data.replace('T', ' ').substring(0, 19)}">${data.replace('T', ' ').substring(0, 19)}</div>`;
                    }
                }
            ],
            drawCallback: function (settings) {
                var api = this.api();

                var startIndex = api.context[0]._iDisplayStart; //获取到本页开始的条数
                　　
                api.column(0).nodes().each(function (cell, i) {　　　　
                    cell.innerHTML = startIndex + i + 1;　　
                });

                // 往分页中添加跳页输入框和按钮
                $.datatablesSkipPagigate(this);
            }
        });
        // datatables 的样式设置
        $.datatablesStyle();

    }


    /**
     * @description 初始化添加模块
     */
    function initAddModule() {

        // 函数内部传递的数据
        let fun_data = {};
        $('.tool-container').on('click', '.btn-add', () => {
            formSubmit(fun_data);

            layui.layer.open({
                type: 1,
                title: '添加',
                content: $('#add-module'),
                area: ['1000px', '750px'],
                offset: '10%',
                maxmin: false,
                anim: 2,
                success: (layero, index) => {
                    // layui.layer.full(index);
                },
                cancel: (index, layero) => {
                    // 主要是为了隐藏content
                    $('.layer-content-molude').css('display', 'none');
                    layui.layer.close(index);
                }
            });
        });

        /**
         * @description 表单提交
         */
        function formSubmit(fun_data) {
            let sendData = {
                // 学生id
                studentid: sessionStorage.getItem('user_id'),
                // 上传的图片id
                imgid: []
            };

            /**
             * 文件上传的临时数据
             */
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
                // data.Id += res.data.response.Id + ',';     //产品展示图片id
                file_upload_arr.push(res);
                console.log(file_upload_arr)
            }, function (id) {
                file_upload_arr.forEach((ele, index) => {
                    console.log(ele.previewId)
                    console.log(id)
                    if (ele.previewId == id) {
                        file_upload_arr.splice(index, 1);
                    }
                })
                console.log(file_upload_arr)
            });

            //监听提交
            layui.form.on('submit(add)', function (data) {

                for (let i in data.field) {
                    if (i.indexOf('isbegin') <= -1) {
                        sendData[i] = data.field[i];
                    }
                }
                console.log(sendData)
                if (file_upload_arr.length === 0) {
                    layui.layer.open({
                        type: 0,
                        content: '请先上传图片',
                        offset: '20%',
                        anim: 2,
                        time: 3000
                    });
                } else {
                    file_upload_arr.forEach((ele, index) => {
                        sendData.imgid.push(ele.id);
                    });
                    // 如果省份,城市,年级字段没有手动添加,则从sesstionStorage中获取
                    sendData.addresscapital = sendData.addresscapital || sessionStorage.getItem('user_province');
                    sendData.addressdistrict = sendData.addressdistrict || sessionStorage.getItem('user_city');
                    sendData.grade = sendData.grade || sessionStorage.getItem('user_grade');


                    console.log(sendData)
                    $.ajaxRequestTemplate({
                        url: _HOST.add_rort + _HOST.student.high_mark.add,
                        data: sendData
                    });

                }


                return false;
            });
        }


    }


    /**
     * @description 详情
     */
    function initDescModule() {
        // 函数内部传递的数据
        let fun_data = {};

        $('.dataTables_wrapper').on('click', 'tbody .btn-desc', (e) => {
            let $this = $(e.currentTarget);
            // 在函数内部需要用到的数据
            fun_data.modify = $this.data('modify');

            // 初始化表单
            initForm(fun_data);

            // 打开一个弹出层
            layui.layer.open({
                type: 1,
                title: '详情',
                content: $('#desc-module'),
                area: ['1000px', '650px'],
                // offset: '10%',
                anim: 2,
                success: (layero, index) => {
                    // 最大化layer
                    // layui.layer.full(index);
                },
                cancel: (index, layero) => {
                    $('.layer-content-molude').css('display', 'none');
                    layui.layer.close(index);
                }
            });
        });

        /**
         * @description 初始化表单内容
         */
        function initForm(fun_data) {
            // 修改模块表单
            let form = $('#desc-module form');
            // 标题
            form.find('input[name=Headline]').val(fun_data.modify.Headline);
            // 省份
            form.find('input[name=AddressCapital]').val(fun_data.modify.AddressCapital);
            // 城市
            form.find('input[name=AddressDistrict]').val(fun_data.modify.AddressDistrict);
            // 年级
            form.find('input[name=Grade]').val(fun_data.modify.Grade);
            // 是否审核通过
            form.find('input[name=IsAudit]').val(fun_data.modify.IsAudit ? '通过' : '未通过');

            // 百分榜作文图片
            let $img_box = form.find('.img-box');
            $img_box.empty();
            fun_data.modify.ThumbnailUrl.forEach((ele, index) => {
                $img_box.append(`
                        <div class="item">
                        <img class="origin-image show_resource_in_browser" title="${fun_data.modify.Url[index]}" src="${ele}" data-src="${fun_data.modify.Url[index]}">
                        </div>
                    `);
            });
        }
    }


    function uploadFileModule() {
        //文件上传url
        var uploadUrl = _HOST.add_rort + _HOST.resource.upload_file;
        /*
         * 文件上传的配置及返回结果
         */
        $("#file_upload").fileInputInit({
            uploadUrl: uploadUrl,
            extendName: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'TGA']
        }, function (res) {
            console.log(res);
            if (res.data.response.Result) {
                // data.Id += res.data.response.Id + ',';     //产品展示图片id
            }
        });
    }

    /**
     * 撤回审核未通过记录
     */
    function revocationOperate() {
        let fun_data = {};
        $('.dataTables_wrapper').on('click', 'tbody .btn-back', (e) => {
            let $this = $(e.currentTarget);
            fun_data.modify = $this.data('modify');
            let sendData = {
                hundredid: fun_data.modify.HundredId,
                studentid: sessionStorage.getItem('user_id')
            }
            // 显示提示框，确认操作
            layui.layer.open({
                type: 0,
                title: '提示',
                content: '是否撤回这条记录?',
                btn: ['确认', '取消'],
                yes: function (index, layero) {
                    $.ajaxRequestTemplate({
                        url: _HOST.add_rort + _HOST.student.high_mark.revocation,
                        data: sendData
                    });
                },
                btn2: function (index, layero) {
                    layui.layer.close(index);
                }
            })
        });
    }



});