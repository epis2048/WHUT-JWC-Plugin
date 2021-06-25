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


	/*
	* @function initButton 初始化按钮
	*/
	function initButton() {
		// 避免在首页初始化按钮的时候始终初始化失败造成死循环
		if (
			$(
				"#navTab > div.navTab-panel.tabsPageContent.layoutBox > div:nth-child(2) > div > div > div:nth-child(1)"
			).html() !== null
		) {
			// 如果显示排课班级按钮还没有被初始化，执行初始化
			if ($("#show-banji").attr("exist") !== "exist") {
				// 初始化抢课按钮
				var btn = $(
					"<li><a class='add' id='show-banji' exist='exist' target='ajax'><span id='show-banji-label'>显示排课班级</span></a></li>"
				);
				btn.appendTo(
					"#jbsxBox > div:nth-child(3) > div.j-resizeGrid.panelContent > div:nth-child(1) > ul"
				);
				// 添加抢课按钮样式
				btn.hover(
					function () {
						$(this).addClass("hover");
					},
					function () {
						$(this).removeClass("hover");
					}
				);
				// 绑定按钮点击事件
				btn.click(function () {
					showBanji();
				});
			}
		}
	}

	function showBanji(){
		$("div[title='备注']").first().text("排课班级");
        $('tr[target="suid_obj"]').each(
            function(){
                let tr = $(this).contents()
                function commentFilter(){
                    var str = "";
                    tr.filter(function() {
                        if(this.nodeType==8) str = this.data;
                    })
                    return str;
                }
                let banji = commentFilter().match(/>(.*)</gs)[0].slice(1,-1);
                $("td",$(this)).eq(-2).text(banji);
            }
        )
	}





	$($("ul.nav").children()[3]).after(`<li><a href="javascript:ShowDiv('MyDiv','fade');">选课提示框</a></li>`);
	$($("ul.nav").children()[3]).after(`<li><a href="grkbList.do" target="dialog" width="1200" height="600" mask="true">个人课表</a></li>`);
	$($("ul.nav").children()[3]).after(`<li><a href="xkrzList.do" target="dialog" width="1200" height="600" mask="true">选课日志</a></li>`);


	// 控件注入
	setInterval(function () {
		// console.log("第" + count++ + "次尝试注入工具栏");
		initButton();
	}, 700);

}
