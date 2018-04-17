/**
 * @description 作文百分榜
 * @author zhengshenli
 */
var _GLOBAL = require('tool/global');
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {


    // 设置html属性 fontsize
    $.setPageFontSize();

    /**
     * 可选择的搜索条件数组，用于在filter中创建列表
     */
    var search_key_arr = [];

    /**
     * filter实例，里面存储着搜索数据
     */
    var filter = null;

    /**
     * 分页的各项参数
     */
    var paginate_param = {
        // 总共多少条数据
        count: null,
        // 当前页码
        current: 1,
        // 每页限制记录条数
        limit: 15,
        // 总共页数
        pages: null,

        // 设置总记录条数
        setCount: function (data) {
            this.count = data;
        },
        // 设置当前页码
        setCurrent: function (data) {
            this.current = data;
        }
    }

    console.log(paginate_param)

    // 首先获取到有哪些搜索条件，再进行搜索
    get_search_key(() => {
        init();
    });

    function init() {
        getHighmarkList();
        // 设置定时器，直到第一次请求列表数据返回后，才设置分页信息
        paginate_param.timer = setInterval(function () {
            if (paginate_param.count) {
                paginate();
                clearInterval(paginate_param.timer);
            }

        }, 200);

        clickSearchButton();

        filter = $('.filter-content').highMarkFilter();

        createFilterItem();
    }

    /**
     * @description 分页
     */
    function paginate() {
        layui.laypage.render({
            elem: 'paginate-ele',
            // 主题颜色
            theme: '#dd4250',
            // 显示完整功能
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            // 每页显示数据个数
            limit: paginate_param.limit,
            //数据总数，从服务端得到
            count: paginate_param.count,
            jump: function (obj, first) {
                console.log(obj)
                paginate_param.setCurrent(obj.curr);

                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                //首次不执行
                if (!first) {
                    //do something
                    getHighmarkList();
                    $('html,body').scrollTop($('.list-box')[0].offsetTop)
                    console.log($('.list-box')[0].offsetTop)
                }
            }
        });
    }

    /**
     * @description 获取数据
     */
    function getHighmarkList() {
        let layer_index = layui.layer.load();

        // 请求需要的数据包括分页的搜索
        let send_data = {
            // 数据的开始下标
            start: (paginate_param.current - 1) * paginate_param.limit,
            // 从开始下标往后的指定个数
            length: paginate_param.limit
        }

        // 搜索数据
        let search_send_data = {};

        // 如果有搜索对象，则设置请求的搜索数据
        // 从filter对象中获取到搜索数据
        if(filter) {
            search_send_data.AddressCapital = filter.choose_filter_result['省份'].name;
            search_send_data.AddressDistrict = filter.choose_filter_result['城市'].name;
            search_send_data.AddressElement = filter.choose_filter_result['区'].name;
            search_send_data.School = filter.choose_filter_result['学校'].name;
            search_send_data.Grade = filter.choose_filter_result['年级'].name;
        }

        // 根据指定的搜索key，设置对应的搜索value
        for(let i in search_send_data) {
            if(search_send_data[i]) {
                send_data[i] = search_send_data[i];
            }
        }

        // 请求列表数据
        $.ajax({
            url: _HOST.add_rort + _HOST.student.high_mark.list_all,
            type: 'POST',
            data: send_data,
            complete: function () {
                layui.layer.close(layer_index);
                // 设置fotter margin-top
                $.setFooterMargin();

            },
            success: (res) => {
                // console.log(res)
                if(res.Result) {
                    let data = res.Data;
                    // 设置数据总页数
                    paginate_param.setCount(res.recordsTotal);
    
                    // 每次请求清空list的子元素，然后添加新的内容
                    let $list = $('.high-mark-wrap .list');
                    $list.empty();
                    data.forEach((ele, index) => {
                        $list.append(`
                            <div class="item">
                                <a href="${_VIEW.high_mark.detail}?compositionid=${ele.HundredId}" target="_blank">
                                    <div class="desc desc-animate">
                                        <span>${ele.Headline}</span>
                                    </div>
                                    <img src="${ele.Url[0]}" alt="">
                                </a>
                            </div>
                        `);
                    });
                }
            }
        });

    }

    /** 
     * @description 创建筛选项
     * 这个模块按理是可以整合到Filter.js文件中，只要写个方法，将搜索数据设置进去，然后执行以下操作即可
     */
    function createFilterItem() {
        let $filter_main_part = $('.filter-main-part');
        console.log($filter_main_part)

        // 往筛选列表里添加一个单元的数据
        // 类 new_dl 表示是新添加的列表，只有时新添加的搜索列表才会再初始化时添加事件
        // 所以支持在html上写死和js动态添加两种
        search_key_arr.forEach((ele, index) => {
            $filter_main_part.append(`
                <dl class="new_dl clearfix" data-title="${ele.name}" data-id="${ele.id}">
                    <dt>${ele.name}：</dt>
                    <dd>
                        <ul class="clearfix">
                            <li><a href="javascript:;" class="current">不限</a></li>
                        </ul>
                    </dd>
                </dl>
            `);

            // 获取刚刚添加的ul jQuery对象
            let $ul = $filter_main_part.find('ul').last();
            // 往ul对象里添加刷选单元下具体项
            ele.data.forEach((ele1, idnex1) => {
                $ul.append(`
                    <li><a href="javascript:;">${ele1}</a></li>
                `);
            });
        });
        filter.initNewChooseList();
    }

    /**
     * 点击搜索按钮事件
     */
    function clickSearchButton() {
        $('.filter-btn').click((e) => {
            // 将分页控件置空
            $('#paginate-ele').empty();
            // 重新请求新的数据
            getHighmarkList();
            // 重新生成分页控件
            paginate();
        });
    }

    /**
     * 获取搜索目录
     * 
     */
    function get_search_key(callback) {
        // 加载中提示
        let layer_index = layui.layer.load();
        // 请求搜索目录数据
        $.ajax({
            url: _HOST.add_rort + _HOST.student.high_mark.get_search_key,
            type: 'POST',
            complete: () => {
                layui.layer.close(layer_index);
            },
            success: (res) => {
                if(res.Result) {
                    // 首先创建一个搜索列表的对象
                    // name: 在页面显示的搜索条件
                    // id: 搜索条件对应的key，也就是发送到服务器的搜索的key
                    // data: 搜索条件的一组值
                    let province = {
                        name: '省份',
                        id: 'AddressCapital',
                        data: res.AddressCapital.slice()
                    }
                    let city = {
                        name: '城市',
                        id: 'AddressDistrict',
                        data: res.AddressDistrict.slice()
                    }
                    let area = {
                        name: '区',
                        id: 'AddressElement',
                        data: res.AddressElement.slice()
                    }
                    let school = {
                        name: '学校',
                        id: 'School',
                        data: res.School.slice()
                    }
                    let grade = {
                        name: '年级',
                        id: 'Grade',
                        data: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级']
                    }

                    // 将上述创建的搜索列表对象添加到此数组中
                    search_key_arr.push(province);
                    search_key_arr.push(city);
                    search_key_arr.push(area);
                    search_key_arr.push(school);
                    search_key_arr.push(grade);

                    // 请求成功后的回调
                    callback && callback();

                }
            }
        })
    }
})