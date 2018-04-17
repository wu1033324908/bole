/**
 * 时间变化
 * 
 * 初始化
 * var time = $('.time').timeChanging({
 *      time: '00:20:00'
 * })
 * 设置时分秒
 *  方法：showTime()
 * 
 * 判断时间结束
 * time.isTimeOver();
 * 
 * 当一个模块结束后，调用 stop();方法来停止倒计时
 */
function timeChanging($ele, opt) {
    this.$ele = $ele;
    // 默认传入的时间字符串
    this.time_string = opt.time || '00:00:00';
    // 将时间转换为秒
    this.time_count = 0;
    // 计时是否结束
    this.time_out = false;
    // 是否开始计时
    this.is_start = false;

    this.init();

}
/**
 * 初始化
 */
timeChanging.prototype.init = function () {
    var _this = this;
    var time_arr = _this.time_string.split(':');

    // 将时分秒字符串转换为秒数
    _this.time_count = parseInt(time_arr[0]) * 3600 + parseInt(time_arr[1]) * 60 + parseInt(time_arr[2]);
    //  _this.timelapse();

}

/**
 * 倒计时中
 */
timeChanging.prototype.timelapse = function () {
    var _this = this;
    // 判断倒计时是否结束
    _this.isTimeOver();
    // 如果倒计时还在进行中
    if (!_this.time_out) {
        setTimeout(function () {
            // 总秒数减少1
            _this.time_count--;
            // 显示计算后的时间
            _this.showTime();
            // 递归
            _this.timelapse();
        }, 1000);
    }

}
/**
 * 倒计时是否结束
 */
timeChanging.prototype.isTimeOver = function () {
    var _this = this;
    // 如果总秒数为0，设置时间结束为true
    if (_this.time_count === 0) {
        _this.time_out = true;
    }
}
/**
 * 显示剩余时间
 */
timeChanging.prototype.showTime = function () {
    var _this = this;
    // 根据秒数，计算出时分秒
    var h = parseInt(_this.time_count / 3600);
    var m = parseInt(_this.time_count % 3600 / 60);
    var s = parseInt(_this.time_count % 3600 % 60);

    // 位数不足2位，补0
    h = h.toString().length == 2 ? h : '0' + h;
    m = m.toString().length == 2 ? m : '0' + m;
    s = s.toString().length == 2 ? s : '0' + s;

    // 设置时间显示在指定的位置
    _this.$ele.find('.h').text(h);
    _this.$ele.find('.m').text(m);
    _this.$ele.find('.s').text(s);
}

/**
 * 停止时间变化
 */
timeChanging.prototype.stop = function () {
    // 设置时间结束为true
    this.time_out = true;
}
/**
 * 开始倒计时
 * 不能重复开始
 */
timeChanging.prototype.start = function () {
    // 如果计时还未开始
    if(!this.is_start) {
        // 设置计时开始标记为true
        this.is_start = true;
        // 倒计时
        this.timelapse();
    }
}


$.fn.timeChanging = function (opt) {
    return new timeChanging($(this), opt);
}