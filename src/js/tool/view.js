var projectConfig = require ("../../../projectConfig.js");

var View = module.exports = {};


View.rootor = projectConfig.root
// 学生学习
View.play = {
    index: projectConfig.root + 'play/play.html'
}

View.index = projectConfig.root;

View.admin = {
    index: projectConfig.root + 'admin'
}

View.login = {
    register: projectConfig.root + 'login/register.html'
}
View.forget = {
    url: projectConfig.root + 'login/find-pwd.html'
}
View.high_mark= {
    index: '',
    detail: projectConfig.root + 'high-mark/high-mark-detail.html'
}
View.banner= {
    detail: projectConfig.root + 'banner/banner-detail.html'
}

// 用户中心
View.user_center = {
    // 学生
    student: {
        // 首页
        index: projectConfig.root + 'student/student-user-center.html',
        // 学习记录
        study_record: projectConfig.root + 'student/student-study-record.html',
        // 完善信息
        complete_info: projectConfig.root + 'student/student-user-complete-info.html'

    },
    // 教师
    teacher: {
        index: projectConfig.root + 'teacher/teacher-user-center.html',
        complete_info: projectConfig.root + 'teacher/teacher-user-complete-info.html',
        comments: projectConfig.root + 'teacher/teacher-comments-composition.html',
        comments_record: projectConfig.root + 'teacher/teacher-comments-record.html',
    }
}

View.password = {
    to : projectConfig.root + "login/find-pwd.html",
}
View.entrust = {
    to : projectConfig.root + "student/student-entrust.html",
}
View.showUse = {
    to : projectConfig.root + "student/student-howToUse.html",
}
View.watchVideo = {
    to : projectConfig.root + "video/play-video.html",
}


