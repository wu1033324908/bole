/**
 * @description 学生课堂上传作文
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
    $.initSearchTable(_TABLE, _HOST.add_rort + _HOST.student.composition.list_self);
    // 详细详细
    initModifyModule();
    // 在浏览器中显示大图
    $.showResourceInBrowser();

    // uploadFileModule();

    /**
     * @description 初始化表格
     */
    function initTable() {
        _TABLE = $('#table').dataTable({
            ajax: {
                url: _HOST.add_rort + _HOST.student.composition.list_self,
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
                        return `
                            <button type="button" class="btn btn-default btn-sm btn-modify" data-modify='${JSON.stringify(row)}' title="详情">详情</button>
                            
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
                    title: '批改状态',
                    data: 'IsCorrect',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = '已批改';
                        if (!data) {
                            result = '未批改';
                        }
                        return `<div class="td-ellipsis" title="${result}">${result}</div>`;
                    }
                },
                {
                    title: '图片',
                    data: 'ThumbnailUrl',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        if (data.length > 0) {
                            return `<img class="show_resource_in_browser" title="${row.Url[0]}" src="${data[0]}" data-src="${row.Url[0]}"/>`;
                        } else {
                            return '无';
                        }
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
     * @description 详细信息
     */
    function initModifyModule() {

        // 函数内部传递的数据
        let fun_data = {};
        $('.dataTables_wrapper').on('click', 'tbody .btn-modify', (e) => {
            let $this = $(e.currentTarget);
            // 在函数内部需要用到的数据
            fun_data.modify = $this.data('modify');

            initForm(fun_data);

            layui.layer.open({
                type: 1,
                title: '详细信息',
                content: $('#modify-module'),
                maxmin: false,
                anim: 2,
                success: (layero, index) => {
                    layui.layer.full(index);
                },
                cancel: (index, layero) => {
                    // 主要是为了隐藏content
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
            let form = $('#modify-module form');
            // 阶段
            form.find('.stage').text(fun_data.modify.StageDescribe);
            // 课次
            form.find('.section').text(fun_data.modify.CouresDescribe);

            // 课堂作文
            var $composition_img_box = form.find('.composition-img-box');
            $composition_img_box.empty();
            fun_data.modify.ThumbnailUrl.forEach((ele, index) => {
                $composition_img_box.append(`
                    <div class="item">
                        <img class="origin-image show_resource_in_browser" src="${ele}" data-src="${fun_data.modify.Url[index]}" title="查看大图" alt="">
                    </div>
                `)
            });

            // 是否有批改过的作文
            var $commented_img_box = form.find('.commented-img-box');
            $commented_img_box.empty();
            // 有批改过
            if (fun_data.modify.IsCorrect) {
                $.ajax({
                    url: _HOST.add_rort + _HOST.student.composition.commented_image,
                    type: 'POST',
                    data: {
                        articleid: fun_data.modify.ArticleId,
                        correctid: fun_data.modify.IsCorrectId,
                    },
                    success: (res) => {
                        if (res.Result) {

                            res.Data[0].ThumbnailUrl.forEach((ele, index) => {
                                $commented_img_box.append(`
                                    <div class="item">
                                        <img class="origin-image show_resource_in_browser" src="${ele}" data-src="${res.Data[0].Url[index]}" title="查看大图" alt="">
                                    </div>
                                `)
                            });
                        }
                    }
                })
            }
        }
    }

});