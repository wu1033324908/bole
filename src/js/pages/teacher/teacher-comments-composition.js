/**
 * @description 教师批改作文
 * @author zhengshenli
 * @createAt 2018-03-23
 */
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {

    /**
     * @description datatable 对象
     */
    var _TABLE;

    /**
     * 教师是否有待批改的作文
     */
    var is_choosed_composition = true;

    /**
     * 要批改的作文信息
     */
    var composition_data = {};


    // 加载遮罩层
    var $loading = $('.right-container');
    $.pageLoading($loading);

    getCurrentCommentsData();

    // init();
    /**
     * 初始化页面
     */
    function init() {
        // 有作文仍在批改中
        if (is_choosed_composition) {
            // 显示批改中作文信息
            $('.teacher-submit-comments-container').removeClass('hidden');
            uploadCommentsReource();

        } else {
            // 显示表格选择作文批改
            $('.table-container').removeClass('hidden');
            $('.table-search-container').removeClass('hidden');
            // 初始化表格
            initTable();
            // 表格搜索
            $.initSearchTable(_TABLE, _HOST.add_rort + _HOST.user.teacher.get_current_comments_composition);
            // 查看详情
            selectStudentComposition();
            // 在浏览器中打开缩略图的大图
            $.showResourceInBrowser();
        }
    }


    /**
     * 获取当前教师要批改的作文数据
     */
    function getCurrentCommentsData() {
        $.ajax({
            url: _HOST.add_rort + _HOST.user.teacher.get_current_comments_composition,
            type: 'POST',
            data: {
                teacherid: sessionStorage.getItem('user_id')
            },
            success: function (res) {
                // 隐藏加载层
                $loading.loading_finish = true;
                if (res.Result) {
                    // 已经选择了作文,但是未批改
                    is_choosed_composition = true;
                    // 设置要批改的作文数据
                    composition_data = res.Data[0];
                } else {
                    // 还没有作文在批改中
                    is_choosed_composition = false;
                }

                init();
            }
        })
    }

    // uploadFileModule();

    /**
     * @description 初始化表格
     */
    function initTable() {
        _TABLE = $('#table').dataTable({
            ajax: {
                url: _HOST.add_rort + _HOST.user.teacher.wait_comments_composition_lsit,
                type: 'POST',
                data: {
                    teacherid: sessionStorage.getItem('user_id')
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
                        return `
                            <button type="button" class="btn btn-default btn-sm btn-modify" data-modify='${JSON.stringify(row)}'>详情</button>
                            
                            `;
                        // <button type="button" class="btn btn-default btn-sm btn-delete" data-modify='${JSON.stringify(row)}' title="删除"><i class="fa fa-trash-o"></i></button>
                    }
                },
                {
                    title: '阶段名称',
                    data: 'StageDescribe',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '';
                        if (data) {
                            result = data;
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                {
                    title: '课次名称',
                    data: 'CouresDescribe',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '';
                        if (data) {
                            result = data;
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                {
                    title: '作文图片',
                    data: 'ThumbnailUrl',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<a class="btn-modify" style="cursor: pointer;" data-modify='${JSON.stringify(row)}'>查看</a>`;
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
     * @description 初始化上传批注模块
     */
    function uploadCommentsReource() {

        // 函数内部传递的数据
        let fun_data = {
            // 文件上传的返回数据：{id: 资源id, previewId: 预览id}
            file_upload_arr: [],
            modify: composition_data
        };

        console.log(fun_data)

        initForm();
        formSubmit();

        //文件上传url
        var uploadUrl = _HOST.add_rort + _HOST.resource.upload_file;
        /*
         * 文件上传的配置及返回结果
         */
        $("#file_upload").fileInputInit({
            uploadUrl: uploadUrl,
            extendName: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'TGA'],
        }, function (res) {
            // data.Id += res.data.response.Id + ',';     //产品展示图片id
            fun_data.file_upload_arr.push(res);
        }, function (id) {
            fun_data.file_upload_arr.forEach((ele, index) => {
                console.log(ele.previewId)
                console.log(id)
                if (ele.previewId == id) {
                    fun_data.file_upload_arr.splice(index, 1);
                }
            })
        });

        /**
         * @description 表单提交
         */
        function formSubmit() {
            let sendData = {
                articleid: fun_data.modify.AticleId,
                teacherid: sessionStorage.getItem('user_id'),
                imgid: []
            };

            //监听提交
            layui.form.on('submit(upload-comments)', function (data) {

                if (fun_data.file_upload_arr.length === 0) {
                    layui.layer.open({
                        type: 0,
                        content: '请先上传批注图片',
                        offset: '20%',
                    });
                } else {
                    // 作文评分
                    sendData.grade = data.field.score;
                    // 批注图片
                    fun_data.file_upload_arr.forEach((ele, index) => {
                        sendData.imgid.push(ele.id);
                    });

                    console.log(sendData)
                    $.ajaxRequestTemplate({
                        url: _HOST.add_rort + _HOST.user.teacher.submit_comments_info,
                        data: sendData
                    })
                }


                return false;
            });
        }

        /**
         * 初始化表单数据
         */
        function initForm() {
            let form = $('.teacher-submit-form');

            form.find('.stage-text').text(fun_data.modify.StageDescribe);
            form.find('.section-text').text(fun_data.modify.CouresDescribe);
            // form.find('.download-text').attr('href', fun_data.modify.Url[0]);

            let $img_box = form.find('.img-box');
            composition_data.ThumbnailUrl.forEach((ele, index) => {
                $img_box.append(`
                <div class="item">
                    <img class="origin-image show_resource_in_browser" src="${ele}" data-src="${composition_data.Url[index]}" title="${composition_data.Url[index]}" data-index="${index+1}" alt="">
                </div>
                `)
            });

            $img_box.find('img').click((e) => {
                let $this = $(e.currentTarget);
                let url = $this.data('src');
                let index = $this.data('index');

                $.getBase64(url)
                    .then(function (base64) {
                        $.downloadFile('作文图片' + index + '.png', base64);
                    }, function (err) {
                        console.log(err);
                    });

            });

        }
    }


    /**
     * @description 显示作文详细数据，以供教师选择学生作文
     */
    function selectStudentComposition() {
        /**
         * 函数内部传递的数据
         */
        let fun_data = {};

        $('.dataTables_wrapper').on('click', 'tbody .btn-modify', (e) => {
            let $this = $(e.currentTarget);
            // 在函数内部需要用到的数据
            fun_data.modify = $this.data('modify');

            // 初始化表单
            initForm(fun_data);
            // 表单提交
            formSubmit(fun_data);

            // 打开一个弹出层
            layui.layer.open({
                type: 1,
                title: '详情',
                content: $('#modify-module'),
                area: ['1000px', '500px'],
                maxmin: false,
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
         * @description 表单提交
         */
        function formSubmit(fun_data) {
            let sendData = {};
            // 文章id
            sendData.articleid = fun_data.modify.Id;
            // 教师id
            sendData.teacherid = sessionStorage.getItem('user_id');

            //监听提交
            layui.form.on('submit(get-comments)', function (data) {
                layui.layer.open({
                    type: 0,
                    title: '请选择',
                    content: '是否选择这篇作文进行批改？',
                    btn: ['确认', '取消'],
                    yes: function (index, layero) {
                        console.log(arguments)
                        $.ajaxRequestTemplate({
                            url: _HOST.add_rort + _HOST.user.teacher.choose_composition,
                            data: sendData
                        })
                    },
                    btn2: function (index, layero) {
                        layui.layer.close(index);
                    }

                })
                return false;
            });
        }

        /**
         * @description 初始化表单内容
         */
        function initForm(fun_data) {
            // 修改模块表单
            let form = $('#modify-module form');
            form.find('.stage-text').text(fun_data.modify.StageDescribe);
            form.find('.section-text').text(fun_data.modify.CouresDescribe);


            var $img_box = form.find('.img-box');
            if ($img_box.children().length === 0) {
                fun_data.modify.ThumbnailUrl.forEach((ele, index) => {
                    $img_box.append(`
                        <div class="item">
                            <img class="origin-image show_resource_in_browser" src="${ele}" data-src="${fun_data.modify.Url[index]}" title="${fun_data.modify.Url[index]}" alt="">
                        </div>
                    `)
                });
            }
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




});