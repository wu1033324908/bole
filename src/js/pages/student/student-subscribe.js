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
                        <button type="button" class="btn btn-default size-S btn-modify" data-modify='${JSON.stringify(row)}' title="修改">修改</button>
                            <button type="button" class="btn btn-default size-S btn-delete" data-modify='${JSON.stringify(row)}' title="删除">删除</button>
                            
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
        let formInput = $('.layui-form-item')
        // 函数内部传递的数据
        let fun_data = {};
        let Stage = {}
        $('.tool-container').on('click', '.btn-add', () => {
            // 获取可预约课程
            function getClassInfo() {
                $.ajax({
                    type: "post",
                    url: _HOST.add_rort + _HOST.stage_course.get_stage,
                    data: {
                        studentid: sessionStorage.getItem('user_id')
                    },
                    success: function (res) {
                        let Data = res.data;

                        formInput.find('input[name=stage]').val(Data.Stage.Describe)
                        formInput.find('input[name=course]').val(Data.Course.Describe)
                        sessionStorage.setItem('sentCourseId', Data.Course.Id)
                        // $('#time-beginAt').empty()
                        // $('#time-beginAt').append(`
                        //     <option value="">请选择</option>   
                        // `)
                        // for (let i in Data.CouresTime) {
                        //     $('#time-beginAt').append(`
                        //         <option value="${Data.CouresTime[i].CouresTimeId}">${Data.CouresTime[i].BeginTime.replace('T'," ")}</option> 
                        //     `)
                        // }
                        
                        // layui.form.render('select')

                        // layui.form.on('select(beginAt)', function (data) {
                        //     console.log(data.value); //得到被选中的时间ID
                        //     for(let i in Data.CouresTime){
                        //         if(Data.CouresTime[i].CouresTimeId == data.value){
                        //             formInput.find('input[name=endAt]').val(Data.CouresTime[i].EndTime.replace('T', " "))
                        //             layui.form.render('select')

                        //             sessionStorage.setItem('studentSubscribeBeginTime',Data.CouresTime[i].BeginTime.replace('T', " "))

                        //             break;
                                    
                        //         }
                        //     }
                        // });
                    }
                });
            }

            getClassInfo()

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

                for (let i in data.field) {
                    sendData[i] = data.field[i];
                }

                sendData['studentId'] = sessionStorage.getItem("user_id")
                sendData['courseId'] = sessionStorage.getItem('sentCourseId')
                delete sendData.course
                delete sendData.stage
                if(sendData.hour < 0 || sendData.hour >24){
                    layui.layer.msg('请输入正确的小时（24小时制）')
                    return ;
                }
                if(sendData.minute < 0 || sendData.minute >60){
                    layui.layer.msg('请输入正确的时间（分钟）')
                    return ;
                }


                console.log(sendData)
                $.ajax({
                    type: "post",
                    url: _HOST.add_rort + _HOST.subscribe.add,
                    data: sendData,
                    success: function (res) {
                        if (res.result) {
                            layer.msg("提交成功！")
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        } else {
                            layer.msg(res.Desc || '网络繁忙,请稍后再试！')
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
            console.log("======================")
            console.log(fun_data.modify)
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
                
                sendData['studentId'] = sessionStorage.getItem("user_id")
                sendData['courseId'] = sessionStorage.getItem('sentCourseId')
                delete sendData.course
                delete sendData.stage
                if(sendData.hour < 0 || sendData.hour >24){
                    layui.layer.msg('请输入正确的小时（24小时制）')
                    return ;
                }
                if(sendData.minute < 0 || sendData.minute >60){
                    layui.layer.msg('请输入正确的时间（分钟）')
                    return ;
                }

                $.ajax({
                    type: "post",
                    url: _HOST.add_rort + _HOST.subscribe.mod,
                    data: sendData,
                    success: function (res) {
                        if (res.result) {
                            layer.msg("提交成功！")
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
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
            let Data = fun_data.modify
            console.log(Data)
            let formInput = $('.layui-form-item')
            formInput.find('input[name=stage]').val(Data.StageDescribe)
            formInput.find('input[name=course]').val(Data.CourseDescribe)
            formInput.find('input[name=hour]').val(Data.Hour)
            formInput.find('input[name=minute]').val(Data.Minute)
            formInput.find('select[name=week]').val(Data.Week)

            layui.form.render('select')
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
                            Id: Id,
                            studentId:sessionStorage.getItem('user_id')
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