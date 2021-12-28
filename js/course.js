// ==UserScript==
// @name        武汉理工大学教务系统助手
// @namespace   WHUT-JWC-Plugin
// @description 武汉理工大学 学分制选课系统 辅助插件
// @namespace   WHUT-JWC-Plugin
// @author      epis2048
// @run-at      document-end
// @version     0.2


// 选课系统要干的
if(/218.197.102.183\/Course\/login.do\?msg/g.test(window.location.href) || /202.114.50.131\/Course\/login.do\?msg/g.test(window.location.href)){
	initScript();
	$('title').text("选课-武汉理工大学教务管理系统");
	
	// 变量声明
	// var requestInterval = 500; // 请求时间间隔（毫秒）
	var requestInterval = 10000; // 请求时间间隔（毫秒）
	var count = 0;
	var needXk = false; //记一下要不要选课
	var postData;
	var buxuan = false;
	var lessons =new Array();
	var isQueue = true;
	var loopIndex = 0;

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
			// 如果添加队列按钮还没有被初始化，执行初始化
			if ($("#add-lesson").attr("exist") !== "exist") {
				// 初始化抢课按钮
				var btn = $(
					"<li><a class='add' id='add-lesson' exist='exist' target='ajax'><span id='add-lesson-label'>添加到抢课列表</span></a></li>"
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
					addQueue();
				});
				//结束一下选课，切换页面了
				if(needXk){
					needXk = false;
					toastr.info("切换页面时选课任务自动停止！如需继续请手动开始！");
				}
			}
			// 如果队列抢课按钮还没有被初始化，执行初始化
			if ($("#choose-lesson-queue").attr("exist") !== "exist") {
				// 初始化抢课按钮
				var btn = $(
					"<li><a class='add' id='choose-lesson-queue' exist='exist' target='ajax'><span id='choose-lesson-queue-label'>开始队列抢课</span></a></li>"
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
					chooseLessonQueue();
				});
			}
			// 如果循环抢课按钮还没有被初始化，执行初始化
			if ($("#choose-lesson-loop").attr("exist") !== "exist") {
				// 初始化抢课按钮
				var btn = $(
					"<li><a class='add' id='choose-lesson-loop' exist='exist' target='ajax'><span id='choose-lesson-loop-label'>开始循环抢课</span></a></li>"
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
					chooseLessonLoop();
				});
			}
			// 如果抢补选按钮还没有被初始化，执行初始化进程
			if ($("#choose-lesson-buxuan").attr("exist") !== "exist") {
				// 初始化抢课按钮
				var btn = $(
					"<li><a class='add' id='choose-lesson-buxuan' exist='exist' target='ajax'><span id='choose-lesson-buxuan-label'>一键补选</span></a></li>"
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
					chooseLessonBuxuan();
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


	function addQueue() {
		if(lessons.length >=5){
			toastr.warning("不要太贪心哦！");
			return;
		}
		// 正则表达式注册（贪婪匹配）
		var infoRegExp = /[A-Z0-9\-]{4,32}/g;
		// 通过正则表达式获取相关数据
		var info = $(
			"#jbsxBox > div:nth-child(3) > div.j-resizeGrid.panelContent > div:nth-child(1) > ul:nth-child(1) > div > ul > li:nth-child(1) > a"
		).attr("href").match(infoRegExp);

		// 若用户没有选择课程
		if ($("tr.selected").attr("rel") === undefined) {
			toastr.warning("请选择课程！");
			return;
		}
		// 准备待发送的数据
		postData = {
			xnxq: info[0], // 学年学期
			kcdm: info[1], // 课程代码
			jxjhh: info[2],
			addid: $("tr.selected").attr("rel"),
			gsdm: "", // 保持为空
			keyinfo: info[3],
			_: parseInt(new Date().getTime() / 1000), // 当前时间
		};
		lessons.push({
			"postData": postData, 
			"title": $("tr.selected > td:nth-child(2) > div > a").attr("title"), 
			"teacher": $("tr.selected > td:nth-child(3) > div > a").html(), 
			"time" : $("tr.selected > td:nth-child(4) > div").html(), 
			"place": $("tr.selected > td:nth-child(5) > div").html()
		});
		updateLessonsQueueTable();
		//console.log(lessons);
		toastr.success("已添加到抢课队列！");
	}
	
	function chooseLessonLoop() {
		buxuan = false;
		isQueue = false;
		loopIndex = 0;
		if(!needXk){//目前不在选课
			toastr.success("抢课已开始！循环提交抢课列表中的每一项！");
			needXk = true;
			$("#choose-lesson-loop-label").html("停止循环抢课");
			$("#choose-lesson-queue-label").html("开始队列抢课");
		}
		else{
			needXk = false;//如果现在在选课那就停止
			toastr.success("选课任务已停止！");
			$("#choose-lesson-loop-label").html("开始循环抢课");
			$("#choose-lesson-queue-label").html("开始队列抢课");
			initScript();
		}
	}
	
	function chooseLessonQueue() {
		buxuan = false;
		isQueue = true;
		if(!needXk){//目前不在选课
			toastr.success("抢课已开始！优先提交抢课列表中的第一项！");
			needXk = true;
			$("#choose-lesson-queue-label").html("停止队列抢课");
			$("#choose-lesson-loop-label").html("开始循环抢课");
		}
		else{
			needXk = false;//如果现在在选课那就停止
			toastr.success("选课任务已停止！");
			$("#choose-lesson-queue-label").html("开始队列抢课");
			$("#choose-lesson-loop-label").html("开始循环抢课");
			initScript();
		}
	}

	function chooseLessonBuxuan() {
		// 正则表达式注册（贪婪匹配）
		var infoRegExp = /[A-Z0-9\-]{4,32}/g;
		// 通过正则表达式获取相关数据
		var info = $(
			"#jbsxBox > div:nth-child(3) > div.j-resizeGrid.panelContent > div:nth-child(1) > ul:nth-child(1) > div > ul > li:nth-child(1) > a"
		).attr("href").match(infoRegExp);
		buxuan = true;
		if(!needXk){//目前不在选课
			// 若用户没有选择课程
			if ($("tr.selected").attr("rel") === undefined) {
				toastr.warning("请选择课程！");
				return;
			}
			var buxuanly = prompt("请输入补选理由：");
			if (buxuanly == null) {
				toastr.warning("取消补选！");
				return;
			}
			if (buxuanly == "") {
				toastr.warning("补选理由不能为空！");
				return;
			}
			// 准备待发送的数据
			postData = {
				xnxq: info[0], // 学年学期
				kcdm: info[1], // 课程代码
				jxjhh: info[2],
				addid: $("tr.selected").attr("rel"),
				gsdm: "", // 保持为空
				keyinfo: info[3],
				rand: Math.random()+"",
				bxly: buxuanly,
				_: parseInt(new Date().getTime() / 1000), // 当前时间
			};
			toastr.success("补选任务已开始！");
			needXk = true;
			$("#choose-lesson-buxuan-label").html("停止补选");
		}
		else{
			needXk = false;//如果现在在选课那就停止
			toastr.success("补选任务已停止！");
			$("#choose-lesson-buxuan-label").html("一键补选");
			initScript();
		}
	}

	function sendData() {
		var obj = postData;
		//toastr.info("当前选课开始，请等待");
		setInterval(function (obj) {
			if(needXk){
				// 重定义提示栏
				toastr.options = {
					timeOut: 6000,
				};
				// 发包
				if(buxuan){
					uurl = "/Course/gxkbxsq.do";
				}
				else{
					uurl = "/Course/zykxkAdd.do";
					if(isQueue == true){
						postData = lessons[0]["postData"];
					}
					else{
						if(lessons[loopIndex]!=null){
							postData = lessons[loopIndex]["postData"];
							loopIndex++;
						}
						else{
							loopIndex = 0;
							postData = lessons[loopIndex]["postData"];
						}
					}
				}
				if(postData!=null){
					$.ajax({
						type: "POST",
						url: uurl,
						data: postData,
						dataType: "json",
						success: function (data) {
							// 200代码 选课成功
							// 300代码 选课失败
							// 301代码 服务器挂了
							if (data["statusCode"] == undefined) {
								toastr.success("恭喜你选课成功！");
								console.log("恭喜你选课成功！");
								toastr.options = {
									timeOut: 10000,
								};
								// 重加载
								//initScript();
								if(!buxuan){
									lessons.shift();
									updateLessonsQueueTable();
									//console.log(lessons);
								}
							} else if (data["statusCode"] === "300") {
								toastr.info("当前选课失败，原因为：" + data["message"]);
								console.log("当前选课失败，原因为：" + data["message"]);
							} else if (data["statusCode"] === "301") {
								toastr.info("当前选课失败，原因为：" + data["message"]);
								console.log("当前选课失败，原因为：" + data["message"]);
								toastr.info("建议刷新后重试！");
							}
						},
						error: function() {
							toastr.success("恭喜你选课成功！");
								console.log("恭喜你选课成功！");
								toastr.options = {
									timeOut: 10000,
								};
								// 重加载
								//initScript();
								if(!buxuan){
									lessons.shift();
									updateLessonsQueueTable();
									//console.log(lessons);
							}
						},
					});
				}
				else{
					toastr.info("选课队列中已经没有课程！");
				}
			}
		}, requestInterval);
	}
	
	function updateLessonsQueueTable(){
		//console.log(lessons);
		if(lessons.length <= 0){
			document.querySelector("#queueTable").style.display='none';
		}
		else{
			document.querySelector("#queueTable").style.display='block';
			for(var i = 1; i <= 5; i++){
				if(lessons[i-1]!=null){
					$("#queueTable_title_"+i).html(lessons[i-1]["title"]);
					$("#queueTable_place_"+i).html(lessons[i-1]["place"]);
					$("#queueTable_teacher_"+i).html(lessons[i-1]["teacher"]);
					$("#queueTable_time_"+i).html(lessons[i-1]["time"]);
				}
				else{
					$("#queueTable_title_"+i).html("");
					$("#queueTable_place_"+i).html("");
					$("#queueTable_teacher_"+i).html("");
					$("#queueTable_time_"+i).html("");
				}
			}
		}
	}
	
	
	function deleteLessonQueue(num){
		lessons.splice(num,1);
		toastr.success("移出成功！");
		updateLessonsQueueTable();
	}

	
	//开启sendData
	sendData();
	$($("ul.nav").children()[3]).after(`<li><a href="javascript:ShowDiv('MyDiv','fade');">选课提示框</a></li>`);
	$($("ul.nav").children()[3]).after(`<li><a href="grkbList.do" target="dialog" width="1200" height="600" mask="true">个人课表</a></li>`);
	$($("ul.nav").children()[3]).after(`<li><a href="xkrzList.do" target="dialog" width="1200" height="600" mask="true">选课日志</a></li>`);

	// 提示用户
	toastr.success(
			"请先选择要抢的课，然后点击抢课按钮进行抢课！"
	);
	toastr.info(`点击后将于每${requestInterval/1000}秒执行一次抢课操作`);

	// 控件注入
	setInterval(function () {
		// console.log("第" + count++ + "次尝试注入工具栏");
		initButton();
	}, 700);

}