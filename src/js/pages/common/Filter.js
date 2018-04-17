/**
 * 创建实例：
 *      var filter = $('.filter-content').highMarkFilter();
 * 
 * 每次新增选择列表，都要调用一次 initNewChooseList()方法
 *      filter.initNewChooseList();
 * 
 * 选择的结果
 *      filter.choose_filter_result
 */
;
(function ($, window, document, undefined) {

    var _CLASS_NAME = {
        // 清空条件
        EMPTY_FILTER: '.empty',
        // 搜索按钮
        SEARCH_BUTTON: '.filter-btn',
        // 已选择的条件列表
        FILTER_RESULT_LIST: '.filter-result',
        // 能够选择的条件容器
        FILTER_CHOOSE_CONTENT: '.filter-main-part'
    }

    // filter条件选择的结果
    var _CHOOSE_FILTER_RESULT = {

    }

    function Filter(ele, option) {
        this.ele = ele;
        // filter条件选择的结果
        this.choose_filter_result = {};
        this.init();
    }


    Filter.prototype.construct = Filter;

    /** 
     * @description 初始化新的可选择列表
     */
    Filter.prototype.initNewChooseList = function () {
        var _THIS = this;
        // 清空按钮，在此元素前插入选择的结果
        var $filter_empty = _THIS.ele.find(_CLASS_NAME.EMPTY_FILTER);
        // filter结果列表
        var $filter_show_list = _THIS.ele.find(_CLASS_NAME.FILTER_RESULT_LIST);

        _THIS.ele.find(_CLASS_NAME.FILTER_CHOOSE_CONTENT).children('dl').each(function (index, ele) {
            var $dl = $(ele);
            // dl列表是新添加的，为其添加事件的样式
            if ($dl.hasClass('new_dl')) {
                // 往filter结果中添加此字段
                _THIS.choose_filter_result[$dl.data('title')] = {
                    id: $dl.data('id'),
                    name: ''
                };
                // 新列表项的点击事件
                $dl.on('click', 'li', function (e) {
                    var $li = $(this);
                    // 样式切换
                    $li.children('a').addClass('current').end().siblings().children('a').removeClass('current');

                    // filter结果设置
                    var dl_title = $li.parents('dl').data('title');
                    // 选择的值
                    var a_text = $.trim($li.children('a').text());
                    // 设置指定title的name
                    _THIS.choose_filter_result[dl_title].name = a_text;
                    console.log(_THIS.choose_filter_result[dl_title])

                    // 设置显示选择的条件
                    var filter_result_item = isExistFilter(_THIS, dl_title);
                    // 点击不限
                    if (a_text === '不限') {
                        // 如果此字段在filter结果中已出现，则在filter结果中移除
                        if (filter_result_item) {
                            // 遍历filter结果中的ciel，并移除
                            $filter_show_list.find('.ceil').each(function (index, ele) {
                                if ($(ele).data('title') === dl_title) {
                                    removeSingleSelectItem(_THIS, $(ele), dl_title);
                                }
                            });
                        } else {
                            removeSingleSelectItem(_THIS, null, dl_title);
                        }

                    } else if (filter_result_item) { // 如果此字段在filter结果中已出现
                        filter_result_item.children('span').text(a_text);
                    } else { // 此字段在filter结果中未出现
                        $filter_empty.before(`
                            <span class="l_ceil ceil" data-title="${dl_title}">
                                <span>${a_text}</span>
                                <a href="#"><i class="l_ceil_i"></i></a>
                            </span>
                        `);
                    }
                    console.log(_THIS)
                });

                $dl.removeClass('new_dl');
            }
        });
    }

    /**
     * 初始化filter实例
     */
    Filter.prototype.init = function () {
        var _THIS = this;
        console.log(_THIS)
        // 可选择的条件dl列表
        var $filter_choose_dl = _THIS.ele.find(_CLASS_NAME.FILTER_CHOOSE_CONTENT).children('dl');
        // 清空按钮，在此元素前插入选择的结果
        var $filter_empty = _THIS.ele.find(_CLASS_NAME.EMPTY_FILTER);
        // filter结果列表
        var $filter_show_list = _THIS.ele.find(_CLASS_NAME.FILTER_RESULT_LIST);

        _THIS.initNewChooseList();

        // filter结果列表项移除按钮点击事件
        $filter_show_list.on('click', '.ceil i', function (e) {
            var $this = $(this);

            // 要重置结果的字段
            var title = $this.parents('.ceil').data('title');

            removeSingleSelectItem(_THIS, $this.parents('.ceil'), title);
        });

        removeAllSelectItem(_THIS);

    }


    /**
     *  判断filter的结果是否已显示
     * @param {Object} Filter实例
     * @param {String} compare_str 要比较的字符串
     * @returns 返回已显示的jq对象或者false
     */
    function isExistFilter(_THIS, compare_str) {
        var flag = false;

        // 判断filter结果列表是否存在此项
        _THIS.ele.find(_CLASS_NAME.FILTER_RESULT_LIST).children('.ceil').each(function (index, ele) {
            if ($(this).data('title') === compare_str) {
                flag = $(this);
                // 跳出each循环
                return;
            }
        });
        return flag;
    }

    /** 
     *  移除单个filter结果项
     * @param {Object} Filter实例
     * @param {Object} $filter_result_item filter结果中的要移除的项
     * @param {String} title dl列表title
     */
    function removeSingleSelectItem(_THIS, $filter_result_item, title) {
        // 重置此字段的选择结果
        _THIS.choose_filter_result[title].name = '';
        // 重置此字段的选择列表样式
        _THIS.ele.find(_CLASS_NAME.FILTER_CHOOSE_CONTENT).children('dl').each(function (index, ele) {
            if ($(this).data('title') === title) {
                $(this).find('a').removeClass('current');
                $(this).find('li').eq(0).children('a').addClass('current');
                return;
            }
        });

        // filter结果列表移除此项
        $filter_result_item && $filter_result_item.remove();
    }


    /** 
     * @description 清空所有filter结果
     * @param {Object} Filter实例
     */
    function removeAllSelectItem(_THIS) {
        // 清空按钮，在此元素前插入选择的结果
        var $filter_empty = _THIS.ele.find(_CLASS_NAME.EMPTY_FILTER);
        // filter结果列表
        var $filter_show_list = _THIS.ele.find(_CLASS_NAME.FILTER_RESULT_LIST);

        $filter_empty.on('click', function (index, ele) {
            var i = 0;
            // filter结果重置
            for (i in _THIS.choose_filter_result) {
                _THIS.choose_filter_result[i].name = '';
            }
            // 样式重置
            _THIS.ele.find(_CLASS_NAME.FILTER_CHOOSE_CONTENT).children('dl').each(function (index, ele) {
                $(this).find('a').removeClass('current');
                $(this).find('li').eq(0).children('a').addClass('current');
                return;
            });

            // filter结果列表
            $filter_show_list.children('.ceil').remove();

        });
    }

    $.fn.highMarkFilter = function (option) {
        return new Filter($(this), option);
    }

})(jQuery, window, document);