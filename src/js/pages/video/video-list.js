/**
 * @description 家长学校
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


    init();

    function init() {
        // 获取列表数据
        getHighmarkList();
        // 设置定时器，当第一次获取列表数据成功后，才设置分页信息
        paginate_param.timer = setInterval(function () {
            if (paginate_param.count) {
                paginate();
                clearInterval(paginate_param.timer);
            }

        }, 200);

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
            start: (paginate_param.current - 1) * paginate_param.limit,
            length: paginate_param.limit
        }

        $.ajax({
            url: _HOST.add_rort + _HOST.video.list,
            type: 'POST',
            data: send_data,
            complete: function () {
                layui.layer.close(layer_index);
                // 设置fotter margin-top
                $.setFooterMargin();

            },
            success: (res) => {
                console.log(res)
                if(res.Result) {
                    let data = res.Data;
                    paginate_param.setCount(res.recordsTotal);
    
                    let $list = $('.high-mark-wrap .list');
                    $list.empty();
                    data.forEach((ele, index) => {
                        $list.append(`
                            <div class="item">
                                <a href="${_HOST.root}video/play-video.html" target="_blank" data-video="${ele.VideoURL || ''}" data-rich-text="${ele.Richtext || ''}">
                                    <img src="${ele.ImgURL}" alt="">
                                </a>
                                <div class="description">${ele.Description}</div>
                            </div>
                        `);
                    });
                    $list.on('click', 'a img', (e) => {
                        var $current = $(e.target);
                        // 设置video数据
                        sessionStorage.setItem('video_src', $current.parent().data('video'));
                        // 设置富文本数据
                        sessionStorage.setItem('video_rich_text', $current.parent().data('rich-text'));
                        sessionStorage.setItem('video_title', $current.parent().siblings('.description').text());
                    })
                }
            }
        });

    }

})