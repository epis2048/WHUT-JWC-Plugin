// ==UserScript==
// @name        武汉理工大学教务系统助手
// @namespace   WHUT-JWC-Plugin
// @description 武汉理工大学 学分制选课系统 辅助插件
// @namespace   WHUT-JWC-Plugin
// @author      epis2048
// @run-at      document-end
// @version     0.2


// 修改剩下几个系统的名字
if(/202.114.50.130\/DailyMgt\/login.do\?msg/g.test(window.location.href)){
	initScript();
	$('title').text("课表-武汉理工大学教务管理系统");
}
if(/202.114.50.130\/Examination\/login.do\?msg/g.test(window.location.href)){
	initScript();
	$('title').text("考试-武汉理工大学教务管理系统");
}
if(/202.114.50.130\/SchoolRoll\/login.do\?token/g.test(window.location.href)){
	initScript();
	$('title').text("学籍-武汉理工大学教务管理系统");
}
if(/202.114.50.130\/CostSyn\/login.do\?msg/g.test(window.location.href)){
	initScript();
	$('title').text("学费-武汉理工大学教务管理系统");
}
