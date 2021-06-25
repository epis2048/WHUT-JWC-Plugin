// ==UserScript==
// @name        武汉理工大学教务系统助手
// @namespace   WHUT-JWC-Plugin
// @description 武汉理工大学 学分制选课系统 辅助插件
// @namespace   WHUT-JWC-Plugin
// @author      epis2048
// @run-at      document-end
// @version     0.2


// 选课系统要干的
if(/218.197.102.183\/Course\/login.do\?msg/g.test(window.location.href)){
	initScript();
	$('title').text("选课-武汉理工大学教务管理系统");
	
}