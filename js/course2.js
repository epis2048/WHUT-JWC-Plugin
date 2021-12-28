// ==UserScript==
// @name        武汉理工大学教务系统助手
// @namespace   WHUT-JWC-Plugin
// @description 武汉理工大学 学分制选课系统 辅助插件
// @namespace   WHUT-JWC-Plugin
// @author      epis2048
// @run-at      document-end
// @version     0.2

function djs(){}

// 选课系统要干的
if(/218.197.102.183\/Course\/login.do\?msg/g.test(window.location.href) || /202.114.50.131\/Course\/login.do\?msg/g.test(window.location.href)){
	initScript();
	// 去除悬浮窗和遮罩
	document.querySelector("#fade").style.display='none';
	document.querySelector("#MyDiv").style.display='none';
	//添加悬浮窗关闭按钮
	var e = document.getElementById("MyDiv").children[0];
    e.outerHTML = `<div style="text-align: right; cursor: default; height: 15px;">
    <h2 style="text-align: right; font-size: 16px; margin-right: 20px; margin-top: 20px;"
    onclick="CloseDiv('MyDiv','fade')">关闭</h2></div>`;

	//生成第二个MyDiv
	let mydiv2 = document.createElement("div");
	mydiv2.className = "Mydiv2";
	mydiv2.innerHTML = `
		<div id="MyDiv2" class="white_content">
			<div style="cursor: default; height: 15px;">
				<h1 style="text-align: right; font-size: 16px; margin-right: 20px; margin-top: 20px;"
					onclick="CloseDiv('MyDiv2','fade')">关闭</h1>
			</div>
			<div>
				<h1 style="height: 36px;font-size: 20px;">插件说明</h2><br>
				<div style="text-align: left; font-size: 14px; margin-left: 40px;">
					<h3 style="font-size: 16px;">模块：</h3><br>
					<p style="font-size: 14px;">	1. 选课系统</p><br>
					<p style="font-size: 14px;">	2. 成绩查询</p><br>
					<p style="font-size: 14px;">	3. 评教</p><br>
					<h3 style="font-size: 16px;">功能：</h3><br>
					<p style="font-size: 14px;">	1. 选课系统自动隐藏20s提示框（右上角可以显示）</p><br>
					<p style="font-size: 14px;">	2. 显示排课班级</p><br>
					<p style="font-size: 14px;">	3. 抢课（循环抢课是指轮次提交选课列表中的课程；队列抢课是指优先提交选课列表中第一门课程，第一门课程选课成功后再提交后面的课程。）</p><br>
					<p style="font-size: 14px;">	4. 抢补退选</p><br>
					<p style="font-size: 14px;">	5. 自动将时间冲突的课程变红</p><br>
					<p style="font-size: 14px;">	6. 网页右上角可以查看选课日志和课表</p><br>
					<p style="font-size: 14px;">	7. 把所有成绩改成100分（娱乐）</p><br>
					<p style="font-size: 14px;">	8. 计算课外学分总和</p><br>
					<p style="font-size: 14px;">	9. 评教课程列表显示更加详细的评教状态</p><br>
					<p style="font-size: 14px;">	10. 评教页面全选A/B</p><br>
					<p style="font-size: 14px;">	11. 评教页面自动以全A提交</p><br>
					<p></p></br>
					<p></p></br>
				</div>
			</div> 
		</div> 
	`
	
	
	body = document.querySelector("body");
	let divBox = document.createElement("div");
	divBox.className = "frame";
	divBox.id="queueTable"
	divBox.innerHTML = `
		<h1 class="title">
            抢课队列
        </h1>
        <div class="current-table">
            <div class="show-date">
                <div class="date">课程名称</div>
                <div class="date">上课老师</div>
                <div class="date">上课时间</div>
                <div class="date">上课地点</div>
                <div class="date2">操作</div>
            </div>
			<!--
            <div class="show-count">
                <div class="count">一</div>
                <div class="count">二</div>
                <div class="count">三</div>
                <div class="count">四</div>
                <div class="count">五</div>
            </div>-->
			<div class="show-lesson">
                <div class="slist" id="queueTable_title">
                    <div class="lesson" id="queueTable_title_1"></div>
                    <div class="lesson" id="queueTable_title_2"></div>
                    <div class="lesson" id="queueTable_title_3"></div>
                    <div class="lesson" id="queueTable_title_4"></div>
                    <div class="lesson" id="queueTable_title_5"></div>
                </div>
                <div class="slist" id="queueTable_teacher">
                    <div class="lesson" id="queueTable_teacher_1"></div>
                    <div class="lesson" id="queueTable_teacher_2"></div>
                    <div class="lesson" id="queueTable_teacher_3"></div>
                    <div class="lesson" id="queueTable_teacher_4"></div>
                    <div class="lesson" id="queueTable_teacher_5"></div>
                </div>
                <div class="slist" id="queueTable_time">
                    <div class="lesson" id="queueTable_time_1"></div>
                    <div class="lesson" id="queueTable_time_2"></div>
                    <div class="lesson" id="queueTable_time_3"></div>
                    <div class="lesson" id="queueTable_time_4"></div>
                    <div class="lesson" id="queueTable_time_5"></div>
                </div>
                <div class="slist" id="queueTable_place">
                    <div class="lesson" id="queueTable_place_1"></div>
                    <div class="lesson" id="queueTable_place_2"></div>
                    <div class="lesson" id="queueTable_place_3"></div>
                    <div class="lesson" id="queueTable_place_4"></div>
                    <div class="lesson" id="queueTable_place_5"></div>
                </div>
                <div class="slist2" id="queueTable_option">
                    <div class="lesson" id="queueTable_option_1"><a>移出</a></div>
                    <div class="lesson" id="queueTable_option_2"><a>移出</a></div>
                    <div class="lesson" id="queueTable_option_3"><a>移出</a></div>
                    <div class="lesson" id="queueTable_option_4"><a>移出</a></div>
                    <div class="lesson" id="queueTable_option_5"><a>移出</a></div>
                </div>
            </div>
		</div>

	`;
	body.appendChild(divBox);
	$("#queueTable_option_1 > a").click(function () {
		deleteLessonQueue(0);
	});
	$("#queueTable_option_2 > a").click(function () {
		deleteLessonQueue(1);
	});
	$("#queueTable_option_3 > a").click(function () {
		deleteLessonQueue(2);
	});
	$("#queueTable_option_4 > a").click(function () {
		deleteLessonQueue(3);
	});
	$("#queueTable_option_5 > a").click(function () {
		deleteLessonQueue(4);
	});


	
	body = document.querySelector("body");
	body.appendChild(mydiv2);
	$($("ul.nav").children()[6]).after(`<li><a href="javascript:ShowDiv('MyDiv2','fade');">插件说明</a></li>`);
	$($("ul.nav").children()[9]).html("");
	$($("ul.nav").children()[10]).html("");

	// 课程位置映射：
	let dayToX = {
		周一: 1,
		周二: 2,
		周三: 3,
		周四: 4,
		周五: 5,
		周六: 6,
		周日: 7,
	};
	// 课程
	let lessonToY = {
		"第1-2节": 1,
		"第3-4节": 2,
		"第3-5节": 2,
		"第6-7节": 3,
		"第6-8节": 3,
		"第9-10节": 4,
		"第11-12节": 5,
		"第11-13节": 5,
	};
	// 检查已选课程
	setInterval(() => {
		// 匹配
		let selectedLesson = document.querySelectorAll(".gridTbody tr");
		let yixuan = [];
		let daixuan = [];
		for (let i = 0; i < selectedLesson.length; i++) {
			// 去除空
			let current = String(selectedLesson[i].outerText)
				.trim()
				.replace(new RegExp(/\t/g), "==");
			current = current.split("==");
			let temp = {};
			temp["name"] = current[0].trim();
			temp["teacher"] = current[1].trim();
			// 寻找位置
			temp["placeX"] = [];
			temp["placeY"] = [];
			//获取设置周数
			temp["time"] = []; //第几节课
			temp["week"] = []; //上几周
			temp["day"] = []; //周几
			temp["search_time"] = current[2];
			temp["search_place"] = current[3];
			temp["rongliang"] = parseInt(current[4]);
			temp["xuanshang"] = parseInt(current[5]);
			// 
			let currentTime = current[2]
				.trim()
				.split(";")
				.filter((item) => {
					if (item != "" || item != undefined) {
						return item;
					}
				});
			// 进行则匹配选择位置
			for (let timeString of currentTime) {
				// 进行x y 的寻找
				// 首先查找周*
				let day = timeString.match(/周[一二三四五六日]/g);
				if (day != null) {
					for (let d of day) {
						let x = dayToX[d];
						temp["placeX"].push(x);
						temp["day"].push(x);
					}
				}
				// 查找y
				// 寻找上述
				let time = timeString.match(/第[\d]*-[\d]*节/g);
				if (time != null) {
					for (let t of time) {
						let y = lessonToY[t];
						temp["placeY"].push(y);
						temp["time"].push(y);
					}
				}
				//时间周数
				let weeks = timeString.match(/第[\d]*-[\d]*周/g);
				if (weeks != null) {
					for (let w of weeks) {
						let t = w;
						let t2 = t.match(/[\d]*-[\d]*/g)[0];
						temp["week"].push(t2);
					}
				}
			}
			// 用是否作为区分
			if (
				current.join("").match(/[是否]/g) != null &&
				current.join("").match(/[是否]/g).length > 0
			) {
				
				// 把temp放进res
				yixuan.push(temp);
			}
			else{
				daixuan.push(temp);
			}
		}
		//在前面把重复的标红
		daixuan.forEach((item_daixuan) => {
			// 如果有的话
			if (item_daixuan["day"].length > 0) {
				var isChongfu = false;
				//看看底下的有没有
				yixuan.forEach((item_yixuan) => {
					//如果一门课一周好几次，分别比较每次的
					for (let i = 0; i < item_daixuan["day"].length; i++) {
						//如果一门课一周好几次，分别比较每次的
						for (let j = 0; j < item_yixuan["week"].length; j++){
							//先看周数有没有重复
							var weekChongfu = false;
							if(parseInt(item_daixuan["week"][i].split('-')[0]) == parseInt(item_yixuan["week"][j].split('-')[0])) {
								//两个课同一周开始
								weekChongfu = true;
							} else if (parseInt(item_daixuan["week"][i].split('-')[0]) > parseInt(item_yixuan["week"][j].split('-')[0])) {
								//待选开始的晚
								if (parseInt(item_daixuan["week"][i].split('-')[0]) <= parseInt(item_yixuan["week"][j].split('-')[1])) {
									weekChongfu = true;
								}
							} else if (parseInt(item_daixuan["week"][i].split('-')[0]) < parseInt(item_yixuan["week"][j].split('-')[0])) {
								//待选开始的早
								if (parseInt(item_yixuan["week"][j].split('-')[0]) <= parseInt(item_daixuan["week"][i].split('-')[1])) {
									weekChongfu = true;
								}
							}
							if(weekChongfu) { // 如果周数有重复
								//再看周几有没有重复
								if (item_yixuan["day"][j] == item_daixuan["day"][i]){
									//再看课有没有重复
									if (item_yixuan["time"][j] == item_daixuan["time"][i]) {
										isChongfu = true;
									}
								}
							}
							
						}
					}
				});
				//console.log(item_daixuan);
				if(item_daixuan["xuanshang"] >= item_daixuan["rongliang"]){ //已经选满
					for (let i = 0; i < selectedLesson.length; i++) {
						// 在前面找这个
						let current = String(selectedLesson[i].outerText)
							.trim()
							.replace(new RegExp(/\t/g), "==");
						current2 = current.split("==");
						if(current2[2] == item_daixuan["search_time"] && current2[3] == item_daixuan["search_place"]){
							//selectedLesson[i].querySelectorAll("td:nth-child(2) > div > a")[0].style.background = 'gray';
							//selectedLesson[i].querySelectorAll("td:nth-child(3) > div > a")[0].style.background = 'gray';
						}
					}
				}
				if(isChongfu){ //重复了
					for (let i = 0; i < selectedLesson.length; i++) {
						// 在前面找这个
						let current = String(selectedLesson[i].outerText)
							.trim()
							.replace(new RegExp(/\t/g), "==");
						current2 = current.split("==");
						if(current2[2] == item_daixuan["search_time"] && current2[3] == item_daixuan["search_place"]){
							selectedLesson[i].querySelectorAll("td:nth-child(2) > div > a")[0].style.background = 'red';
							//selectedLesson[i].querySelectorAll("td:nth-child(3) > div > a")[0].style.background = 'red';
						}
					}
				}
				//console.log(item_daixuan);
			}
		});
	}, 2500);
}
