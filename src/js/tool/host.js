var project_config = require('../../../projectConfig.js');
var Host = module.exports = {}

/**
 * @description 接口服务器地址
 */
Host.add_rort = project_config.add_root;

/**
 * 项目根路径
 */
Host.root = project_config.root;

Host.home = {
    banner: {
        list: 'Index/CarouselImgShow'
    },
    video: {
        list: 'Index/CarouselVideoShow'
    },
    title: {
        // 获取首页标题信息:GetIndexInfo()
        get: 'Index/GetIndexInfo',
    }
}

Host.student = {
    // 百分榜
    high_mark: {
        // 前台学生后台
        // 学生上传百分版：UploadHundred(int studentid, string headline, int[] imgid, string addresscapital, string addressdistrict, string grade)  学生Id，文章标题，图片资源id数组，省市，地区，年级
        add: 'Student/UploadHundred',
        // 学生查看百分榜：HundredShow(DataTablesParameters dps, int studentid)  ，学生id
        list_self: 'Student/HundredQuey',
        // 学生删除百分榜作文：HundredDel(int hundredid,int studentid)  百分榜作文id，学生id
        revocation: 'Student/HundredDel',

        // 
        // 百分榜通过：HundredYes(int hundredid) 作文id
        pass: 'Admin/HundredYes',
        // 百分榜未通过：HundredNo(int hundredid) 作文id
        refuse: 'Admin/HundredNo',
        // 未审核百分榜作文： HundredNoAudit(DataTablesParameters dps)
        list_check: 'Admin/HundredNoAudit',

        // 前台展示
        // 获取百分榜：GetHundred(int start,int length, string addresscapital, string addressdistrict, string grade,string addresselement,string school)     地区，省份，年级,区，学校
        list_all: 'Hundred/GetHundred',
        // 根据百分榜作文Id获取作文详情：GetHundredById(int hundredid)  百分榜作文Id
        get_detail: 'Hundred/GetHundredById',
        // 获取百分榜作文中的地区与省份：GetSeekData()
        get_search_key: 'Hundred/GetSeekData'

    },
    // 拼图
    jigsaw: {
        // 添加拼图：PuzzleAdd(int studentid, int courseid, int imgid)  学生id，课次id，拼图id
        add: 'Student/PuzzleAdd',
        // 获得学生拼图：PuzzleQuey(DataTablesParameters dps,int studentid) 学生id
        list_self: 'Student/PuzzleQuey',
        // 获取当前课次是否画圈:GetCourseIsCircle(int courseid)  课次Id
        is_draw_circle: 'Index/GetCourseIsCircle'
    },
    // 作文
    composition: {
        // 添加作文：ArticleAdd(int studentid, int courseid, int[] imgid) 学生id，课次id，作文图片id
        add: 'Student/ArticleAdd',
        // 查询学生作文：ArticleQuey(DataTablesParameters dps, int studentid)  学生id
        list_self: 'Student/ArticleQuey',
        // 根据作文id查询作文批改详情:GetArticleCorrect(int articleid,int correctid)  作文id,批改者id
        commented_image: 'Admin/GetArticleCorrectById'
    },
    // 获取学生成长记录：GetGrowth(int studentid) 学生id
    study_record: 'Student/GetGrowth',
    // 获得当前课次是否可用：GetCourseBegin(int courseid)  课次id
    course_can_use: 'Student/GetCourseBegin'
}


Host.class = {
    // 结束课程： OverCourse(int studentid ,int courseid, int grade)学生id，课次id，课程分数
    finish: 'Student/OverCourse'
}

// 用户信息
Host.user = {
    student: {
        // 完善信息： CompleteInfo(int id,string nickname,string mail,string addresscapital,string addressdistrict,string grade,string school,string addrsselement) 学生id，昵称，邮箱，省份，地区，年级,区，学校
        complete_info: 'Student/CompleteInfo',
        // 获取学生信息：GetStudentInfo(int id) 学生id
        get_info: 'Student/GetStudentInfo'
    },
    teacher: {
        // 获取教师个人信息：GetTeacherInfo(int teacherid) 教师id
        get_info: 'Teacher/GetTeacherInfo',
        // 更新教师信息:UpdateTeacherInfo(int teacherid,string NickName, string Mail)
        complete_info: 'Teacher/UpdateTeacherInfo',
        // 获取所有未批改的文章：GetArticleNo(DataTablesParameters dps)
        wait_comments_composition_lsit: 'Teacher/GetArticleNo',
        // 选取批改文章:ChooseArticle(int teacherid,int articleid) 教师id 文章id
        choose_composition: 'Teacher/ChooseArticle',
        // 获取以前批改的文章：GetArticleBefore(DataTablesParameters dps, int teacherid) 教师id
        comments_composition_record: 'Teacher/GetArticleBefore',
        // 获取当前要批改的作文：GetIsCrrectInfo(int teacherid) 教师id
        get_current_comments_composition: 'Teacher/GetIsCrrectInfo',
        // 上传教师批改作文的数据：TeacherCorrect(int teacherid,int articleid ,int grade,int[] imgid)  教师id，文章id，分数，图片资源id
        submit_comments_info: 'Teacher/TeacherCorrect',
        // 获取图片资源压缩包:GetZipFile(int[] imgid)  图片资源Id
        download_image: 'Teacher/GetZipFile'
    }
}

Host.login = {
    //用户注册：UserRegister(UserModel model, string code,int[] imgid)  用户信息模板，验证码，教师注册所需模板图片资源Id
    register: 'Login/UserRegister',
    // 用户登录： UserLogin(string username, string password) 用户名称，密码
    login: 'Login/UserLogin',
    // 获取验证码:Verify(string phonenum,int way)  手机号,验证码用途(1:注册,2:修改密码)
    phone_msg: 'Login/Verify',
    // 获取公钥：GetPublicKey(string username)
    get_public_key: 'Login/GetPublicKey',
    // 验证修改验证码:ChangeVerifiedCode(string phonenum, string code)
    check_when_modify_pwd: 'Login/ChangeVerifiedCode',
    // 修改密码:ChangePassword(string phonenum,string password,string code)  电话号码,密码,验证码
    modif_pwd: 'Login/ChangePassword',
    // 获得教师注册模板:GetTemplate()
    get_register_template: 'Teacher/GetTemplate'
}

Host.resource = {
    upload_file: 'Admin/UploadFill'
}

/**
 * 课程管理
 */
Host.course = {
    // 成语管理
    phrase: {
        // PhraseAdd(string phrase,int couid) 成语，课次id
        add: 'Admin/PhraseAdd',
        // 修改成语：PhraseUpdate(int id, string phrase,int courseid) 成语id，成语内容，课程id
        modify: 'Admin/PhraseUpdate',
        // 删除成语：PhraseDel(int id) 成语id
        delete: 'Admin/PhraseDel',
        // 查询全部成语： PhraseQuey(DataTablesParameters dps)
        list: 'Admin/PhraseQuey',
        
        get: '',
        // 获取成语：GetPhrase(int courseid)  课次id
        get_phrase_by_section_id: 'Admin/GetPhraseCourse',
        // 当前课次是否闪卡:GetCourseIsFlash(int courseid) 课次id
        is_flash: 'Index/GetCourseIsFlash'
    },
    // 阶段管理
    stage: {
        // CourseAdd(string describe,int sortcode) 描述，课次排序码
        add: 'Admin/CourseAdd',
        // 修改课程：CourseUpdate(int id,string describe,int sortcode) 课程id，描述，课程排序码
        modify: 'Admin/CourseUpdate',
        // 删除课程：CourseDel(int id)  课程id
        delete: 'Admin/CourseDel',
        // 查询全部课程：CourseQuey(DataTablesParameters dps)
        list: 'Admin/CourseQuey',
        get: '',
        // 获得所有阶段
        all: 'Admin/CourseShow'
    },
    // 课次管理
    section: {
        // 添加阶段课次：ModuleAdd(string describe,int coursemakeid,int modules,bool isbegin)  描述，课程id，当前课次，课次是否可用
        add: 'Admin/ModuleAdd',
        // 修改课次： ModuleUpdate(int id,string describe, int coursemakeid, int modules,bool isbegin)id，描述，课程id，当前课次，是否开始		
        modify: 'Admin/ModuleUpdate',
        // 删除课次：ModuleDel(int id)  课次id
        delete: 'Admin/ModuleDel',
        // 查询全部课次：ModuleQuey(DataTablesParameters dps)
        list: 'Admin/ModuleQuey',
        get: '',
        // 根据阶段id获得课次： ModuleByCouresid(int id)  阶段id
        get_section_by_stage_id: 'Admin/ModuleByCouresid',
        // 课程设置
        setting: 'Admin/SettingQuey'
    },
    // 课次管理
    record: {
        // 语音添加：RecordAdd(int courseid, int frontclassid, int phrasecardid, int phrasethiefid,int puzzleid, int stimulateid)  课次id，课前规范，成语闪卡，成语捉小偷，拼图前，拼图激励
        add: 'Admin/RecordAdd',
        // 修改录音：RecordUpdate(int id,int courseid, int frontclassid, int phrasecardid, int phrasethiefid, int puzzleid, int stimulateid)录音id，课次id，课前规范，成语闪卡，成语捉小偷，拼图前，拼图激励
        modify: 'Admin/RecordUpdate',
        // 删除录音：RecordDel(int id) 录音id
        delete: 'Admin/RecordDel',
        // 查询全部录音：RecordQuey(DataTablesParameters dps)
        list: 'Admin/RecordQuey',
        get: '',
        // 根据课次id查询录音：RecordQueyByCId(int courseid) 课次id
        get_record_by_section_id: 'Admin/RecordQueyByCId'
    }
}

Host.play = {
    // 根据Id获取当前课次信息:GetCourseById(int courseid)   课次Id
    get_course: 'Student/GetCourseById',
    // 获取上次课作文批改内容:GetListArticle(int studentid, int courseid) 学生Id 课次Id 
    get_prev_commented_composition: 'Student/GetListArticle'
}

Host.video = {
    // 获取视频:GetVideoQuey(int start, int length) 
    list: 'Index/GetVideoQuey'
}

// 设置富文本内容
Host.rich_text = {
    // 获取其他详细信息:GetRests(int type) 1:关于我们 2:友情链接  3:联系我们 4:加入我们
    get: 'Admin/GetRests',
    // UpdateRests(int type,string richtext)     类型,富文本
    modify: 'Admin/UpdateRests'
}

Host.logo = {
    url:"Index/GetLogo"
}
// 自动保存
Host.auto_save = {
    set:"Student/PuzzleRecord",

    get:"Student/GetPuzzleRecord"
}
// 分享记录
Host.share = {
    list:"Student/ReferrerList",

}
// 预约上课
Host.subscribe = {
    list:"Student/AppointmentQuey",

    add:"Student/AddAppointment",

    mod:"Student/UpdateAppointment",

    del:"Student/DelAppointment"
}
// 获取阶段和课次
Host.stage_course = {
    get_stage:"Student/GetStage",

    get_course:"Student/GetCourse"

}
// 获取阶段和课次
Host.GetIsAudit = {
    is:"Teacher/GetIsAudit",

}
// 获取未上传作文列表
Host.noUpload = {
    list:"Student/GetNoUpArticleCourse",

    add:"Student/ArticleAdd"
}

// 获取当前课次是否更新
Host.courseTimeInfo = {
    get:"Student/CourseTimeInfo"
}
Host.i_konw = {
    to:"Student/YesCourseTimeInfo"
}
Host.im = {
    to:"IM/GetIMRecord"
}
Host.qa = {
    to:"IM/GetHostPos"
}