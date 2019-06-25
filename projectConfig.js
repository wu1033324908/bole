// Export project setting to orther modules
var gmiProject = module.exports = {}

// Project name used in error log
gmiProject.project_name = '伯乐想象作文'
// project port used in local development
gmiProject.port = '9090'
// project version used in version control
gmiProject.version = '1.1.1'
// project root used in local server
// gmiProject.root = '/bole_zuowen/'
gmiProject.root = '/'
// 接口地址
gmiProject.add_root = 'http://47.100.33.5:60001/'
// gmiProject.add_root = 'http://localhost:62707/'
// 最紧凑的输出
gmiProject.jsBeautify = true
// 删除所有的注释
gmiProject.jsComments = true
// 在UglifyJs删除没有用到的代码时不输出警告
gmiProject.jsWarnings = false
// 删除所有的 `console` 语句
gmiProject.jsDrop_console = true
// 内嵌定义了但是只用到一次的变量
gmiProject.jsCollapse_vars = false
// 提取出出现多次但是没有定义成变量去引用的静态值
gmiProject.jsReduce_vars = false


// project template mode
gmiProject.normalTemplateUrl = 'http://storage001.gemini-galaxy.com/admin.zip'
gmiProject.adminTemplateUrl = 'http://storage001.gemini-galaxy.com/admin.zip'