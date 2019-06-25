/**
 * @description 学生play-free界面
 * @author zhengshenli
 * @createAt 2018-01-17
 */
var _GLOBAL = require('tool/global');
var _HOST = require('tool/host');
var _VIEW = require('tool/view');
require('tool/jquery-extend');
$(function () {
    // 设置 page content container height
    $('.page-content-container').css('height', $(window).height() - $('.page-header-wrap').height() + 'px');
    init();




    /**
     * @description 页面初始化
     */
    function init() {

        var page_header_molude = new pageHeaderMolude();
        page_header_molude.init();

        // 载入背景图片
        $('.page-background').css('top', '0');

        // 背景图片加载后，自动加载开始上课按钮
        setTimeout(() => {

            // 开始上课按钮
            var begin_class_module = new beginClassModule({
                complete: function () {
                // 初始化拼图模块
                var jigsaw_module = new jigsawModule({})
                jigsaw_module.init();
                }
            });
            begin_class_module.init();
        }, get_transition_time($('.page-background')));


    }

    /**
     * @description 获取transition对象的duration
     * @param obj jQuery对象或者DOM对象
     * @return 对象transition-duration 的毫秒值
     */
    function get_transition_time(obj) {
        let $obj = $(obj);
        let time = $obj.css('transition-duration');

        if (time && time.toLowerCase().indexOf('ms') > -1) {
            return parseFloat(time);
        } else {
            return parseFloat(time) * 1000;
        }
    }

    /**
     * page header
     */
    function pageHeaderMolude() {
        var _this = this;

        // page header jquery object
        var $page_header = $('.page-header-container');

        this.init = function () {
            _this.gotoUserCenter();
        }

        /**
         * 点击个人中心按钮
         */
        this.gotoUserCenter = function () {
            $page_header.find('.goto-user-center').on('click', (e) => {
                location.href = _HOST.root + 'student/student-user-center.html';
            });
        }
    }
    /**
     * 开始上课
     */
    function beginClassModule(opt) {
        var _this = this;

        this.$ele = $('.btn-begin-class');

        /**
         * 完成此模块的后续操作
         */
        this.complete = opt.complete || function () {}

        /**
         * 初始化
         */
        this.init = function () {

            // 显示此模块
            _this.show();
            // 点击开始上课按钮
            _this._clickBeginClassButton();
        }

        /**
         * 点击开始上课按钮
         */
        this._clickBeginClassButton = function () {
            // 开始上课按钮点击事件
            $('.btn-begin-class').on('click', (e) => {
                // 当前事件对象
                let $this = $(e.currentTarget);

                // 点击后，隐藏开始上课按钮
                $this.css('top', '100%');


                // 开始上课按钮隐藏后，显示播放的语音提示图标
                setTimeout(() => {
                    // 移除开始上课按钮
                    $this.off('click');
                    $this.remove();
                    _this.complete();
                }, get_transition_time($this));
            });
        }

        /**
         * 显示此模块
         */
        this.show = function () {
            // 显示上课按钮
            _this.$ele.css('top', '36%');
        }


        /**
         * @description 获取transition对象的duration
         * @param obj jQuery对象或者DOM对象
         * @return 对象transition-duration 的毫秒值
         */
        function get_transition_time(obj) {
            let $obj = $(obj);
            let time = $obj.css('transition-duration');

            if (time && time.toLowerCase().indexOf('ms') > -1) {
                return parseFloat(time);
            } else {
                return parseFloat(time) * 1000;
            }

        }

    }
    /**
     * 拼图模块
     */
    function jigsawModule(opt) {
        var _this = this;

        // 拼图模块wrap
        let $jigsaw_wrap = $('.jigsaw-wrap');

        /**
         * 以个点集合的最大半径
         */
        this.point_set_max_radius = 0;


        /**
         * 所有组合的点集合
         */
        this.point_sets = [];

        /**
         * 是否在点击完成按钮后显示canvas画圆
         */
        this.is_show_canvas = true;


        this.complete = opt.complete || function () {};


        /**
         *  激励后的拼图数
         */
        var jigsaw_after_stimulate_count = 0;



        this.init = function () {
            // 贴图完成后是否画圈
            this.setIsShowCanvas();
            // 获取课程数据
            this.getCourseData();
            // 显示拼图模块
            $jigsaw_wrap.addClass('show');
            
            
            
            // 设置top,产生动画效果
            setTimeout(() => {
                $jigsaw_wrap.css('top', 0);
                this.setImageHeight();
            }, 100);

            // drag和drop样式
            this.setDragAndDropStyle();
            this.dropEvent();
            this.dragEvent();
            // 点击完成按钮
            this.clickCompleteButton();
        }

        /**
         * 贴图完成后是否画圈
         */
        this.setIsShowCanvas = function () {
            // 是否画圆
            _this.is_show_canvas = false;
        }

        /**
         * 获取课程数据，阶段，课次，和拼图内容
         */
        this.getCourseData = function () {
            
        }

        /**
         * 设置drag-container img height
         */
        this.setImageHeight = function () {

            $('.drag-container .item').each((index, ele) => {
                let $this = $(ele);
                let width = $this.width();
                $this.find('img').css('width', width + 'px');
            });
        }

        /**
         * 设置一个点集合最大的半径
         */
        this.setPointsSetRadius = function (radius) {
            this.point_set_max_radius = radius;
        }

        /**
         * 设置drag 和drop style，主要是按照实际纸张的宽高比来计算屏幕中纸张的宽高
         */
        this.setDragAndDropStyle = function () {
            var height = $('.page-content-container').height();
            // 根据纸张宽高比：7/10 计算出宽度
            var width = height * 7 / 10;
            // 如果宽度过大
            if (width > 575) {
                width = 575;
                // 重新根据宽度计算高度
                height = width * 10 / 7;
            }

            // 设置激励是画圆圈的半径，可以根据需求更改
            _this.setPointsSetRadius(width / 3);
            $('.drag-container').css('height', height + 'px');
            $('.drop-container').css('height', height + 'px')
            $('.drag-container').css('width', width + 'px');
            $('.drop-container').css('width', width + 'px');
        }
        /**
         * drop event
         */
        this.dropEvent = function () {
            // drop-container 中的克隆对象，包括克隆对象的draggable对象
            var clone_list = [];

            /**
             * 上一个触发drop事件的点，只有在下一次克隆图形后才能把上一次最后操作的点保存到点集中
             */
            var prev_point = {};

            /**
             * 当前触发drop事件的点
             */
            var current_point = {}

            /**
             * 是否是第一个克隆图形
             */
            var is_first_clone = true;

            // 放置形状的容器
            $(".drop-container").droppable({
                activeClass: "ui-state-default",
                /**
                 * @param {any} event 
                 * @param {any} ui 
                 */
                drop: function (event, ui) {
                    // ui.position 当前css中的位置
                    // drop后的新点
                    // position对象中的值是相对与drop-container左上角的点，需要加上图形宽高一半的值才是对象的中心点
                    var point = {
                        x: ui.position.left + ui.draggable.width() / 2,
                        y: ui.position.top + ui.draggable.height() / 2
                    }

                    // 设置当前点
                    current_point = point;
                    // 不是克隆
                    if (ui.draggable.parent().hasClass('drop-container')) {} else { // 是克隆
                        // 只有在克隆时才将上一个点添加到点集合中

                        /**
                         * 设置克隆的点集
                         * （可抽为方法）
                         */
                        // 如果是第一次克隆一个点
                        if (is_first_clone) {
                            // 将标志设置为false
                            is_first_clone = false;
                        } else {
                            // 组合中的点集合只需找到3个
                            if (_this.point_sets.length !== 4) {

                                // 如果组合集合中没有数据
                                if (_this.point_sets.length === 0) {
                                    // 创建一个点集合
                                    createPointSet(_this.point_sets, prev_point);

                                } else {
                                    // 否则将这个点加入最后一个点集中

                                    // 组合集合的length
                                    let point_sets_length = _this.point_sets.length;

                                    // 将新点添加到最后一个点集合中
                                    _this.point_sets[point_sets_length - 1].points.push(prev_point);

                                    // 计算并设置最后一个点集合的中心点
                                    let center_point = getPointsCenter(_this.point_sets[point_sets_length - 1].points);
                                    _this.point_sets[point_sets_length - 1].center = center_point;

                                    // 计算圆心半径
                                    _this._computeCircleRadius();

                                    // 如果组合集合中最后一个点集合的半径大于设置的最大半径
                                    if (_this.point_sets[point_sets_length - 1].radius >= _this.point_set_max_radius) {
                                        // 移除刚才添加的点
                                        _this.point_sets[point_sets_length - 1].points.pop();

                                        // 重新计算并设置最后一个点集合的中心点
                                        let center_point = getPointsCenter(_this.point_sets[point_sets_length - 1].points);
                                        _this.point_sets[point_sets_length - 1].center = center_point;
                                        // 创建一个新点集合
                                        createPointSet(_this.point_sets, prev_point);
                                    }
                                }
                            }
                        }

                        // 因为图形从`.drag-container`克隆到`.drop-container`后，在`.drop-container`中还能进行拖拽（不是克隆）
                        // 每次克隆一个新图形，都是将先前克隆点添加到点集中（这个点可以做拖拽操作）,
                        // 所以此次克隆添加上一个克隆点后，需要将此次克隆的点设置为下一次添加的点
                        prev_point = current_point;


                        /**
                         * 设置克隆点的位置，旋转
                         * （可抽为方法）
                         */
                        // 克隆一个对象
                        var $clone = ui.draggable.clone();
                        ui.draggable.remove();
                        // 设置克隆对象的位置
                        $clone.css({
                            position: 'absolute',
                            left: ui.position.left,
                            top: ui.position.top
                        });

                        // 添加旋转按钮
                        $clone.append('<div class="tool-container"><i class="btn-rotate fa fa-rotate-left"></i></div>')

                        // 将克隆对象添加到drop-container
                        $(this).append($clone);

                        // 旋转中心点
                        let center_X = $clone.offset().left + $clone.width() / 2;
                        let center_Y = $clone.offset().top + $clone.height() / 2;
                        // 按住旋转的点与中心点之间的角度
                        let default_deg = null;
                        // 按钮旋转中心点后鼠标移动的角度
                        let move_deg = null;
                        // 中心点与鼠标之间的距离（半径）
                        let r = null;
                        // 是否可以拖动
                        var is_move = false;
                        // 以旋转的角度
                        var oldRotate = null;
                        // 鼠标短点击还是长按
                        var long_click = false;

                        /**
                         * 根据三角函数计算旋转的角度
                         * 这里以坐标系的右下角作为第一象限，y轴正方向向下，x正半轴向右，y轴正方向为0度，逆时针旋转为二三四象限
                         * 这里使用acos函数计算角度，利用两点y方向上的距离与半径,再根据象限判断出具体的角度
                         */

                        // 点击旋转按钮
                        $clone.on('mousedown', '.tool-container', function (e) {
                            // 设置可以旋转
                            is_move = true;
                            r = Math.sqrt((e.pageY - center_Y) * (e.pageY - center_Y) + (e.pageX - center_X) * (e.pageX - center_X));
                            default_deg = 180 / (Math.PI / Math.acos((e.pageY - center_Y) / r));
                            return false;
                        });
                        $clone.on('mousedown', function () {
                            // 每次点击默认为短点击
                            long_click = false;
                            // 过一秒后判断为长按
                            setTimeout(() => {
                                long_click = true;
                            }, 1000);
                        });
                        $clone.on('mouseup', function (e) {
                            // 当鼠标按下和抬起的时间小于1秒时，判断为click事件,且不在移动状态。显示旋转按钮
                            if (!long_click) {
                                $(this).find('.tool-container').toggleClass('hidden');
                            }
                            center_X = $clone.offset().left + $clone.width() / 2;
                            center_Y = $clone.offset().top + $clone.height() / 2;
                        });
                        $('html').mousemove(function (e) {
                            if (is_move) {
                                r = Math.sqrt((e.pageY - center_Y) * (e.pageY - center_Y) + (e.pageX - center_X) * (e.pageX - center_X));
                                let moveX = e.pageX;
                                let moveY = e.pageY;
                                move_deg = 180 / (Math.PI / Math.acos((e.pageY - center_Y) / r));
                                if (moveX == center_X && moveY > center_Y) { //鼠标在y轴正方向上
                                    move_deg = 0;
                                }
                                if (moveX == center_X && moveY < center_Y) { //鼠标在y轴负方向
                                    move_deg = 180;
                                }

                                if (moveX > center_X && moveY == center_Y) { //鼠标在x轴正方向上
                                    move_deg = 90;
                                }
                                if (moveX < center_X && moveY == center_Y) { //鼠标在x轴负方向
                                    move_deg = 270;
                                }
                                if (moveX > center_X && moveY > center_Y) { //鼠标在第一象限
                                    move_deg = move_deg;
                                }
                                if (moveX > center_X && moveY < center_Y) { //鼠标在第二象限
                                    move_deg = move_deg;
                                }

                                if (moveX < center_X && moveY < center_Y) { //鼠标在第三象限
                                    move_deg = 360 - move_deg;
                                }
                                if (moveX < center_X && moveY > center_Y) { //鼠标在第四象限
                                    move_deg = 360 - move_deg;
                                }
                                $clone.find('.inner').css("transform", "rotate(" + ((move_deg - default_deg) * (-1) + oldRotate || 0) + "deg)");
                            }
                        });
                        $('html').mouseup(function (e) {
                            is_move = false;
                            oldRotate = parseInt(getTransformRotate($clone.find('.inner').css('transform')));
                        });

                        // 设置克隆的对象能够拖拽
                        var drag_shap = $clone.draggable({
                            appendTo: '.drop-container',
                            containment: '.drop-container'
                        });

                        let clone_obj = {
                            clone: $clone,
                            draggable: drag_shap
                        }

                        // 只允许当前克隆的能够拖拽
                        if (clone_list.length > 0) {
                            clone_list[clone_list.length - 1].draggable.draggable('disable');
                            clone_list[clone_list.length - 1].clone.off('mousedown');
                            clone_list[clone_list.length - 1].clone.off('mouseup');
                            clone_list[clone_list.length - 1].clone.children('.tool-container').addClass('hidden');
                        }
                        // drop-container 中的克隆对象
                        clone_list.push(clone_obj);
                    }

                }

            });
        }

        /**
         * drap event
         */
        this.dragEvent = function () {
            // 拖拽列表里的形状
            $('.drag-container .shap').draggable({
                appendTo: '.drop-container',
                helper: 'clone',
                start: function (event, ui) {}
            });
        }

        /**
         * 计算要画的圆心半径
         */
        this._computeCircleRadius = function () {

            _this.point_sets.forEach(function (ele, index) {
                ele.radius = 0;
                if (ele.points.length === 1) {
                    ele.radius = $('.drag-container .shap-container').eq(0).height() * 0.7;
                } else {
                    ele.points.forEach(function (item, i) {
                        let distance = pointsDistance(ele.center, item);
                        if (distance >= ele.radius) {
                            ele.radius = distance + $('.drag-container .shap-container').eq(0).height() * 0.7;
                        }
                    });
                }
                if (ele.radius >= _this.point_set_max_radius) {
                    ele.radius = _this.point_set_max_radius;
                }
            });
        }

        /**
         * 在drop-container 中创建一个canvas，并画出3个组合的圆
         * @param width drop-contaienr的width
         * @param height drop-contaienr的height
         */
        this._createDropcontainerCanvas = function (width, height) {

            // 计算要画的圆心半径
            _this._computeCircleRadius();
            // 在drop-container 中添加 canvas
            // 宽高在style中设置，会出现失真效果
            $('.drop-container').append(`
                <canvas id="drop-canvas" width="${width}px" height="${height}px"></canvas>
            `);

            // 设置canvas
            var drop_canvas = document.getElementById("drop-canvas");
            var ctx = drop_canvas.getContext('2d');
            ctx.strokeStyle = '#f00';

            //  遍历组合集合，画出3个圆
            _this.point_sets.forEach((ele, index) => {
                if (index < 3) {
                    ctx.beginPath();
                    ctx.arc(ele.center.x, ele.center.y, ele.radius, 0, 2 * Math.PI, false);
                    ctx.stroke();
                }
            });
            playAudio(_this.point_sets);


            /**
             * 根据点集画圈
             * @param {Array} arr 点集数组
             */
            function playAudio(arr) {

                if (arr[0]) {
                    let ele = arr[0];
                    ctx.beginPath();
                    ctx.arc(ele.center.x, ele.center.y, ele.radius, 0, 2 * Math.PI, false);
                    ctx.stroke();

                }
            }
        }

        /**
         * 点击完成按钮
         */
        this.clickCompleteButton = function (callback) {
            // 作图完成的按钮
            $('.drop-container .btn-complete').on('click', (e) => {
                let $this = $(e.currentTarget);

                // 如果要画圈，则设置画圈后继续拼图个数
                let count = parseInt($this.data('count')) || 0;
                $this.data('count', ++count);

                // 需要显示canvas来画圆
                if (_this.is_show_canvas) {
                    // 设置为false，下次点击不进行画圆
                    _this.is_show_canvas = false;
                    // 隐藏旋转按钮
                    $('.drop-container .tool-container').addClass('hidden');
                    // 语音激励后，记录继续拼图的数量
                    $('.page-content-container .drop-container').on('drop', (e) => {
                        jigsaw_after_stimulate_count++;
                    });

                    // 在drop-container 中创建一个canvas，并画出3个组合的圆
                    _this._createDropcontainerCanvas($('.drop-container').width(), $('.drop-container').height());
                    // 隐藏完成按钮
                    $('.drop-container').find('.btn-complete').removeClass('hidden');

                } else {
                    layui.layer.open({
                        type: 0,
                        title: '提示',
                        content: '是否完成贴图?',
                        offset: '20%',
                        btn: ['确认', '取消'],
                        yes: function (index, layero) {
                            // 隐藏旋转按钮
                            $('.drop-container .tool-container').addClass('hidden');
                            // 隐藏我完成了按钮
                            $('.drop-container').find('.btn-complete').addClass('hidden');
                            // 移除画圆的canvas
                            $('.drop-container').find('canvas').remove();

                            let write = new writingModule({})
                            write.init()
                            
                            // 删除drag dom element
                            $('.jigsaw-wrap .drag-container').remove();
                            
                            _this.complete();
                            layui.layer.close(index);
                        },
                        btn2: function (index, layero) {
                            layui.layer.close(index);
                        }
                    })
                }
            });
        }

        /**
         * @description 获取transform ratate
         */
        function getTransformRotate(tr) {
            if (tr !== 'none') {
                var values = tr.split('(')[1].split(')')[0].split(',');
                var a = values[0];
                var b = values[1];
                var c = values[2];
                var d = values[3];
                var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
                return angle;
            } else {
                return 0;
            }
        }


        /**
         * 创建一个新的点集合
         * @param sets 组合点集合
         * @param point 新的一个点
         */
        function createPointSet(sets, point) {
            // 创建一个点集和
            var point_set = {
                points: [],
                center: {}
            }
            // 设置中心点和添加点
            point_set.points.push(point);
            point_set.center = point;

            // 将这个点集合添加到组合集合中
            sets.push(point_set)
        }

        /**
         * 判断两点之间的距离
         * @param p1 一个点对象
         * @param p2 另一个点对象
         * 
         * 返回两点之间的距离
         */
        function pointsDistance(p1, p2) {
            var cal_x = p1.x - p2.x;
            var cal_y = p1.y - p2.y;
            var length = 0;

            // 如果两点的x或者y相同，则直接算距离
            // 否则根据算术平方根来计算距离
            if (p1.x == p2.x) {
                length = Math.abs(p2.y - p1.y);
            } else if (p1.y == p2.y) {
                length = Math.abs(p1.x - p2.x);
            } else {
                length = Math.pow((cal_x * cal_x + cal_y * cal_y), 0.5);
            }
            return length;
        }

        /**
         * 两点之间的中心点
         * @param points 两个点的数组
         * 
         * 返回一个点对象
         */
        function centerForTwoPoints(points) {
            // 点1和点2
            var p1 = points[0];
            var p2 = points[1];

            var min_x = 0,
                min_y = 0,
                half_x = 0,
                half_y = 0;

            if (p1.x > p2.x) {
                min_x = p2.x;
                half_x = (p1.x - p2.x) / 2;
            } else if (p1.x < p2.x) {
                min_x = p1.x;
                half_x = (p2.x - p1.x) / 2;
            } else {
                min_x = p1.x;
                half_x = p1.x;
            }

            if (p1.y > p2.y) {
                min_y = p2.y;
                half_y = (p1.y - p2.y) / 2;
            } else if (p1.y < p2.y) {
                min_y = p1.y;
                half_y = (p2.y - p1.y) / 2;
            } else {
                min_y = p1.y;
                half_y = p1.y;
            }

            return {
                x: min_x + half_x,
                y: min_y + half_y
            }

        }

        /**
         * 计算一个点集合的中心点
         * @param points 点集合
         * 
         * 返回一个点对象{x:xx,y:yy}
         */
        function getPolygonAreaCenter(points) {

            /**
             * 计算点集合的中心点需要的函数
             */
            function Area(p0, p1, p2) {
                var area = 0.0;
                area = p0.x * p1.y + p1.x * p2.y + p2.x * p0.y - p1.x * p0.y - p2.x * p1.y - p0.x * p2.y;
                return area / 2;
            }

            var sum_x = 0;
            var sum_y = 0;
            var sum_area = 0;
            var p1 = points[1];
            for (let i = 2; i < points.length; i++) {
                let p2 = points[i];
                let area = Area(points[0], p1, p2);
                sum_area += area;
                sum_x += (points[0].x + p1.x + p2.x) * area;
                sum_y += (points[0].y + p1.y + p2.y) * area;
                p1 = p2;
            }
            var xx = sum_x / sum_area / 3;
            var yy = sum_y / sum_area / 3;
            return {
                x: xx,
                y: yy
            };
        }

        /**
         * 获取点集合的中心点
         * @param points 点集合
         * 
         * 返回中心点对象
         */
        function getPointsCenter(points) {
            var point = {};
            if (points.length === 1) {
                point = points[0]
            } else if (points.length == 2) {
                point = centerForTwoPoints(points);
            } else if (points.length > 2) {
                point = getPolygonAreaCenter(points);
            }

            return point;
        }

    }

    /**
     * 写作模块
     */
    function writingModule(opt) {
        var _this = this;

        // 写作模块
        let $composition_container = $('.writing-composition-container');
        // drop container
        let $drop_container = $('.drop-container');

        /**
         * 完成此模块的后续操作
         */
        this.complete = opt.complete || function () {}

        this.setting = {
            // 模块进度
            progress: {
                READY: -1,
                START: 0,
                UPLOAD: 1,
                FINISH: 2,
                // 当前进度
                current: -1
            }
        }


        this.init = function () {
            // 样式
            this._moduleStyle();
            
            // 结束上课（离开按钮）
            this._clickFinishClassButton();

        }


        /**
         * 判断当前操作是否符合模块的进度（暂时没用）
         * @returns {Boolean} true||false 
         * 
         */
        this._judgeProgress = function (string) {

            // 当前时开始写作状态
            if (_this.setting.progress.current === _this.setting.progress.READY && string == '开始写作') {
                return true;
            } else if (_this.setting.progress.current === _this.setting.progress.START && string == '上传作文') {
                return true;
            } else if (_this.setting.progress.current === _this.setting.progress.UPLOAD && string == '结束上课') {
                return true;
            }
            return false;
        }

        

        /**
         * 模块样式设置
         */
        this._moduleStyle = function () {

            $composition_container.css({
                display: 'block',
                width: $drop_container.width() + 'px',
                height: $drop_container.height() + 'px',
                'margin-left': $drop_container.outerWidth() + 50 + 'px'
            });
        }

        /**
         * 点击结束上课按钮（离开按钮）
         */
        this._clickFinishClassButton = function () {
            $composition_container.find('.finish button').on('click', (e) => {
                let sumTime = $('.time').find('.h').text() + ":"+  $('.time').find('.m').text() + ":" + $('.time').find('.s').text();
                layui.layer.open({
                    type: 0,
                    title: '注意',
                    content: '确定放回学生后台？',
                    offset: '20%',
                    btn: ['确认', '取消'],
                    yes: function () {
                        location.href = _HOST.root + 'student/student-user-center.html';
                    },
                    btn2: function (index, layero) {
                        layui.layer.close(index);
                    }
                });
            });

        }

        /**
         * 点击开始上课按钮
         */
        this._clickStartWritingButton = function () {
            $composition_container.find('.start button').on('click', (e) => {
                _this.setting.progress.current = _this.setting.progress.START;
                $composition_container.find('.start').remove();
                
            });
        }


        /**
         * @description 获取transition对象的duration
         * @param obj jQuery对象或者DOM对象
         * @return 对象transition-duration 的毫秒值
         */
        function get_transition_time(obj) {
            let $obj = $(obj);
            let time = $obj.css('transition-duration');

            if (time && time.toLowerCase().indexOf('ms') > -1) {
                return parseFloat(time);
            } else {
                return parseFloat(time) * 1000;
            }

        }

    }
});