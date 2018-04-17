/**
 * @description 表格搜索
 * @author zhengshenli
 * @createAt 2018-03-06
 */


var _HOST = require('tool/host');
var _VIEW = require('tool/view');
// require('tool/error');
require('tool/jquery-extend');

$(function () {

    var searchByAll = ''; //没有搜索条件
    var searchByCreateTime = 'CreatedAt'; //搜索按照创建时间的字段
    var searchByContractTime = 'ContractAt'; //搜索按照合同时间的字段
    var searchByDuring = 'DuringTime'; //搜索按照范围时间的字段

    var $search_select = $('select[name=searchSelect]'); //选择不同搜索条件的下拉框
    var $search_input_box = $('.search-input-box'); //搜索内容
    var $datetime_box = $('.datetime-box'); //搜索条件需要时间(精确到天)

    // 课次是否开启
    var is_begin = 'IsBegin';
    var $is_begin = $('.isbegin-box');

    // 是否是正式教师
    var $is_official = $('.IsOfficial-box');
    var is_official = 'IsOfficial';

    // 是否画圈
    var $is_circle = $('.iscircle-box');
    var is_circle = 'IsCircle';

    // 作文是否批改
    var $is_correct = $('.iscorrect-box');
    var is_correct = 'IsCorrect';


    $search_select.on('change', function (e) {
        if ($(this).val() == searchByAll) {
            //选择全部
            $('.change-box').addClass('hidden');
        } else if ($(this).val() == searchByCreateTime || $(this).val() == searchByContractTime) {
            //选择创建时间和合同时间
            $datetime_box.removeClass('hidden').siblings('.change-box').addClass('hidden');
        } else if ($(this).val() == is_begin) {
            // 是否开启
            $is_begin.removeClass('hidden').siblings('.change-box').addClass('hidden');
        } else if ($(this).val() == is_official) {
            $is_official.removeClass('hidden').siblings('.change-box').addClass('hidden');
        } else if ($(this).val() == is_circle) {
            $is_circle.removeClass('hidden').siblings('.change-box').addClass('hidden');
        } else if ($(this).val() == is_correct) {
            $is_correct.removeClass('hidden').siblings('.change-box').addClass('hidden');
        } else {
            $search_input_box.removeClass('hidden').siblings('.change-box').addClass('hidden');
        }
    });
});