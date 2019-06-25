/**
 * @description 学生预约上课
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
    var form = layui.form
    /**
     * 初始化时间日期选择器
     */
    function initDatePicker(min, max) {
        layui.laydate.render({
            elem: '#school-time',
            min: min,
            max: max,
            type: 'datetime'
        });

        layui.laydate.render({
            elem: '#school-time2',
            min: min,
            max: max,
            type: 'datetime'
        });

    }

    function initDatePicker2(min, max) {

        layui.laydate.render({
            elem: '#school-time-mod',
            min: min,
            max: max,
            type: 'datetime'
        });

        layui.laydate.render({
            elem: '#school-time-mod2',
            min: min,
            max: max,
            type: 'datetime'
        });
    }

    function getTime(courseData) {
        form.on('select(course)', function (data) {
            let courseId = data.value
            let max, min;
            for (let i in courseData) {
                if (courseId == courseData[i].Id) {
                    min = courseData[i].BeginAt.replace("T", " ")
                    max = courseData[i].EndAt.replace("T", " ")
                }
            }
            initDatePicker(min, max);
        })

        form.on('select(course-mod)', function (data) {
            let courseId = data.value
            let max, min;
            for (let i in courseData) {
                if (courseId == courseData[i].Id) {
                    min = courseData[i].BeginAt.replace("T", " ")
                    max = courseData[i].EndAt.replace("T", " ")
                }
            }
            initDatePicker2(min, max);
        })
    }

    function onClickTime(obj, modifyData) {
        obj.mouseenter(function () {
            let min = modifyData.CourseBeginAt.replace("T", " ")
            let max = modifyData.CourseEndAt.replace("T", " ")
            initDatePicker2(min, max);
        })
    }
    // 初始化表格
    initTable();
    // 表格搜索
    $.initSearchTable(_TABLE, _HOST.add_rort + _HOST.subscribe.list);
    // 初始化添加
    initAddModule()

    // 初始化修改
    initModifyModule()
    // 删除模块
    initDeleteModule()
    /**
     * @description 初始化表格
     */
    function initTable() {
        _TABLE = $('#table').dataTable({
            ajax: {
                url: _HOST.add_rort + _HOST.subscribe.list,
                type: 'POST',
                data: {
                    studentId: sessionStorage.getItem('user_id')
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
                },
                {
                    title: '操作',
                    data: '',
                    orderable: false,
                    searchable: false,
                    className: 'btn-td show-detail-td',
                    render: (data, type, row, meta) => {
                        var result = ` 
                        <button type="button" class="btn btn-default size-S btn-modify" data-modify='${JSON.stringify(row)}' title="修改"><i class="fa fa-edit"></i></button>
                        <button type="button" class="btn btn-default size-S btn-delete" data-modify='${JSON.stringify(row)}' title="删除"><i class="fa fa-trash-o"></i></button>
                        `;
                        return result;
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
                    data: 'CourseDescribe',
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
                    title: '预约时间（开始时间）',
                    data: 'BeginAt',
                    className: 'show-detail-td',
                    render: (data, type, row, meta) => {
                        return `<div class="td-ellipsis" title="${data.replace('T', ' ').substring(0, 19)}">${data.replace('T', ' ').substring(0, 19)}</div>`;
                    }
                },
                {
                    title: '预约时间（结束时间）',
                    data: 'EndAt',
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
        let Stage = {}
        $('.tool-container').on('click', '.btn-add', () => {
            // 获取阶段
            $.ajax({
                type: "post",
                url: _HOST.add_rort + _HOST.stage_course.get_stage,
                data: {
                    studentid:sessionStorage.getItem('user_id')
                },
                success: function (res) {
                    let Data = res.Stage
                    for (let i = 0; i < Data.length; i++) {
                        $('#stage').append(`
                            <option value="${Data[i].Id}">${Data[i].Describe}</option>
                        `);
                    }
                    layui.form.render('select'); //重新渲染

                    form.on('select(stage)', function (data) {

                        let stageid = data.value
                        $.ajax({
                            type: "post",
                            url: _HOST.add_rort + _HOST.stage_course.get_course,
                            data: {
                                stageid: stageid,
                                studentid: sessionStorage.getItem('user_id'),
                            },
                            success: function (res) {
                                let res_data = res.Course;
                                res_data.forEach((ele, index) => {

                                    $('#course').append(`
                                        <option value="${ele.Id}">${ele.Describe}</option>
                                    `);

                                });
                                layui.form.render('select');
                                // 初始化日期
                                getTime(res_data)
                            }
                        });
                    })
                }


            });
            layui.layer.open({
                type: 1,
                title: '添加',
                content: $('#add-module'),
                area: ['1000px', '750px'],
                offset: '10%',
                maxmin: false,
                anim: 2,
                success: (layero, index) => {

                },
                cancel: (index, layero) => {
                    // 主要是为了隐藏content
                    $('.layer-content-molude').css('display', 'none');
                    layui.layer.close(index);
                }
            });
            formSubmit(fun_data);
        });

        /**
         * @description 表单提交
         */
        function formSubmit(fun_data) {
            let sendData = {};

            //监听提交
            layui.form.on('submit(add)', function (data) {

                sendData['studentId'] = sessionStorage.getItem("user_id")
                sendData['beginAt'] = data.field.beginAt
                sendData['endAt'] = data.field.endAt
                sendData['courseId'] = data.field.course

                $.ajax({
                    type: "post",
                    url: _HOST.add_rort + _HOST.subscribe.add,
                    data: sendData,
                    success: function (res) {
                        if (res.result) {
                            layer.msg("提交成功！")
                            setTimeout(() => {
                                window.location.reload();
                            }, 3000);
                        } else {
                            layer.msg("res.Desc")
                        }
                    }
                });
                return false;
            });
        }


    }

    /**
     * @description 初始化修改模块
     */
    function initModifyModule() {
        var fun_data = {};
        $('.dataTables_wrapper').on('click', 'tbody .btn-modify', (e) => {
            let $this = $(e.currentTarget);
            // 在函数内部需要用到的数据
            fun_data.modify = $this.data('modify');
            // console.log(fun_data)
            let $school_time_mod = $('#school-time-mod')
            let $school_time_mod2 = $('#school-time-mod2')
            // console.log("-----------------------------------")
            // console.log(fun_data.modify)
            // console.log("-----------------------------------")
            onClickTime($school_time_mod, fun_data.modify)
            onClickTime($school_time_mod2, fun_data.modify)
            let res_data = fun_data.modify
            getTime(res_data)
            // 获取阶段
            // $.ajax({
            //     type: "post",
            //     url: _HOST.add_rort + _HOST.stage_course.get_stage,
            //     data: {},
            //     success: function (res) {
            //         let Data = res.Stage
            //         for (let i = 0; i < Data.length; i++) {
            //             // 初始化阶段ID
            //             if(fun_data.modify.StageId == Data[i].Id){
            //                 $('#stage-mod').append(`
            //                     <option value="${Data[i].Id}" selected>${Data[i].Describe}</option>
            //                 `);
            //                 // 初始化完成后 => 初始化课次
            //                 $.ajax({
            //                     type: "post",
            //                     url: _HOST.add_rort + _HOST.stage_course.get_course,
            //                     data: {
            //                         stageid: Data[i].Id,
            //                         studentid: sessionStorage.getItem('user_id'),
            //                     },
            //                     success: function (res) {
            //                         // console.log(res);
            //                         let res_data = res.Course;
            //                         // console.log(res_data);

            //                         res_data.forEach((ele, index) => {

            //                             if(fun_data.modify.CourseId == ele.Id){
            //                                 $('#course-mod').append(`
            //                                     <option value="${ele.Id}" selected>${ele.Describe}</option>
            //                                 `);
            //                             }else{
            //                                 $('#course-mod').append(`
            //                                     <option value="${ele.Id}">${ele.Describe}</option>
            //                                 `);
            //                             }
            //                         });
            //                         layui.form.render('select');
            //                         // 初始化日期
            //                         getTime(res_data)
            //                     }
            //                 });
            //             }else{
            //                 $('#stage-mod').append(`
            //                     <option value="${Data[i].Id}">${Data[i].Describe}</option>
            //                 `);
            //             }

            //         }
            //         layui.form.render('select');//重新渲染

            //         form.on('select(stage-mod)', function (data) {
            //             let stageid = data.value
            //             $.ajax({
            //                 type: "post",
            //                 url: _HOST.add_rort + _HOST.stage_course.get_course,
            //                 data: {
            //                     stageid: stageid,
            //                     studentid: sessionStorage.getItem('user_id'),
            //                 },
            //                 success: function (res) {
            //                     // console.log(res);
            //                     let res_data = res.Course;
            //                     // console.log(res_data);
            //                     res_data.forEach((ele, index) => {
            //                         if(fun_data.modify.CourseId == Data[i].Id){
            //                             $('#course-mod').append(`
            //                                 <option value="${ele.Id}" selected>${ele.Describe}</option>
            //                             `);

            //                         }else{
            //                             $('#course-mod').append(`
            //                                 <option value="${ele.Id}">${ele.Describe}</option>
            //                             `);
            //                         }
            //                     });
            //                     layui.form.render('select');
            //                     // 初始化日期
            //                     getTime(res_data)

            //                 }
            //             });
            //         })
            //     }
            // });

            layui.layer.open({
                type: 1,
                title: '修改',
                content: $('#modify-module'),
                area: ['1000px', '750px'],
                offset: '10%',
                maxmin: false,
                anim: 2,
                success: (layero, index) => {


                },
                cancel: (index, layero) => {
                    $('.layer-content-molude').css('display', 'none');
                    layui.layer.close(index);
                }
            });
            // 初始化表单
            initForm(fun_data);
            // 表单提交
            formSubmit(fun_data);
        });


        /**
         * @description 表单提交
         */
        function formSubmit(fun_data) {
            let sendData = {
                id: fun_data.modify.Id,
                // courseId:fun_data.modify.Course,
            };

            //监听提交
            layui.form.on('submit(modify)', function (data) {



                for (let i in data.field) {
                    sendData[i] = data.field[i];

                }
                sendData['courseId'] = fun_data.modify.CourseId;
                console.log("sendData");
                // console.log(fun_data)
                console.log(sendData);

                $.ajax({
                    type: "post",
                    url: _HOST.add_rort + _HOST.subscribe.mod,
                    data: sendData,
                    success: function (res) {
                        if (res.result) {
                            layer.msg("提交成功！")
                            // setTimeout(() => {
                            //     window.location.reload();
                            // }, 1000);
                        }
                    }
                });
                return false;
            });
        }

        /**
         * @description 初始化表单内容
         */
        function initForm(fun_data) {
            // 修改模块表单
            let form = $('#modify-module form');
            // 预约上课时间（开始时间）（结束时间）
            form.find('input[name=beginAt]').val(fun_data.modify.BeginAt.replace("T", " "));
            form.find('input[name=endAt]').val(fun_data.modify.EndAt.replace("T", " "));

            layui.form.render();
        }
    }

    /**
     * @description 删除模块
     */
    function initDeleteModule() {
        $('.dataTables_wrapper').on('click', 'tbody .btn-delete', (e) => {
            let $this = $(e.currentTarget);
            console.log($this.data('modify'))
            let Id = $this.data('modify').Id;
            layui.layer.open({
                title: '删除',
                content: '确认删除该记录',
                btn: ['确认', '取消'],
                yes: (index, layero) => {
                    $.ajax({
                        type: "post",
                        url: _HOST.add_rort + _HOST.subscribe.del,
                        data: {
                            Id: Id
                        },
                        success: function (res) {
                            if (res.result) {
                                layer.msg("删除成功！")
                                setTimeout(() => {
                                    window.location.reload()
                                }, 1000);
                            }
                        }
                    });
                }
            })
        });
    }




});