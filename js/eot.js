// ==UserScript==
// @name        武汉理工大学教务系统助手
// @namespace   WHUT-JWC-Plugin
// @description 武汉理工大学 学分制选课系统 辅助插件
// @namespace   WHUT-JWC-Plugin
// @author      epis2048
// @run-at      document-end
// @version     0.2


// 评教系统要干的
if(/202.114.50.130\/EOT\/login.do\?msg/g.test(window.location.href)){
	initScript();
	$('title').text("评教-武汉理工大学教务管理系统");
	$($('*[href="pjkcList.do"]')[0]).click(
        function(){
            $($(".mybutton")[0]).css("display","inline-block");//点亮图标
            $($(".mybutton")[1]).css("display","inline-block");//点亮图标
        }
    );
	
	var css = document.createElement('style');
    css.type='text/css';
    css.innerHTML=`.mybutton{background: #2866bd;color: #fff;text-align: center;border: 2px solid #E5E5E5; display: none;cursor:pointer;}`;
    document.getElementsByTagName('head')[0].appendChild(css);
    $($("ul.nav").children()[4]).after(`<li id="myuser"><input type="submit" class="mybutton" value="查看状态"></li>`);
    $($("ul.nav").children()[5]).click(
        function(){
            $('tr',$('tbody')[1]).each(function(){
                let start = $('td',this)[3].textContent;
                let end = $('td',this)[4].textContent;
                let state = $('td',this)[5];
				let nowData = new Date();
                current = formatDate(nowData);
				//console.log(current);
                if(current>end){
					if(state.textContent=="未评") state.innerHTML='<div style="background-color:red;">评教时间已过</div>';
                    return;
                }
                else if(current>start){
                    if(state.textContent=="未评") state.innerHTML='<div style="background-color:green;">可以评教</div>';
					if(state.textContent=="已评") state.innerHTML='可修改';
                    return;
                }
                else{
                    if(state.textContent=="未评") state.innerHTML='<div style="background-color:gray;">评教未开始</div>';
                    return;
                }
            })
        }
    )
    $($("ul.nav").children()[5]).after(`<li id="yijianpingjiao"><input type="submit" class="mybutton" value="一键评教"><span id="setting" style="
        background-color: #2866bd;color: white;border: 2px solid #E5E5E9; display: inline-block;line-height: 20px;padding-top: 1px;cursor: pointer;">▼</span></li>`);
    $('body').append(`
            <div id="setting-container" style="position: fixed;top: 3.7vw;right: 8.8vw; ">
                <div id="setting-content" style="display:none;">
                    <div id = "setting-main" style="background: -webkit-gradient(linear,0 0,0 100%,from(#ffffff),to(#ffffff));">
                        <fieldset id = "setting-field" style = "display:block;">
                            <legend class="iframe-father"><a class="linkhref">一键评教设置</a></legend>
                            <ul class="setting-main">
                                <li title="选择方式">
                                    <label title="全选A"><input name="sl-method" id="pingjiao-A" type="radio" checked="">全选A</label>
                                    <label title="全选B"><input name="sl-method" id="pingjiao-B" type="radio">全选B</label>
                                </li>
                            </ul>
                        </fieldset>
                    </div>
                </div>
            </div>
    `)
    let setting = $($("ul.nav").children()[6]).children()[1];
    let pj_action = $($("ul.nav").children()[6]).children()[0];
    $(setting).click(function(){let content = $('#setting-content');
		if(content.css("display")=="none")
			content.css("display","block");
		else
			content.css("display","none");
    });
    $(pj_action).click(function(){let sel = $('input[name="sl-method"]').index($('input[name="sl-method"]:checked'));
        let items = $(".unit",$('.pageFormContent'));
        for (let i = 0; i < 10; i++) {
            $(items[i].children[sel]).click()
        }
		if(confirm("选完后自动提交？(自动提交只会提交全A)")){
			document.getElementById("bt_div").style.display="none";
			document.getElementById("js_div").style.display="none";
			document.getElementById("content_div").style.display="none";
			document.getElementById("bt_div_submit").style.display="block";
			//$(".pageForm").submit();
			$.ajax({
				type: "POST",
				url: "rwpjUpdate.do",
				data:"pjrwdm="+$("[name='pjrwdm']").val()+"&cpdxdm=&zbtmdm=1&zb1=A&zbtmdm=10&zb10=A&zbtmdm=2&zb2=A&zbtmdm=3&zb3=A&zbtmdm=4&zb4=A&zbtmdm=5&zb5=A&zbtmdm=6&zb6=A&zbtmdm=7&zb7=A&zbtmdm=8&zb8=A&zbtmdm=9&zb9=A&py=&wjwtdm=1&xzwdt=&xzwdttm=1&xzwdtxx=E&wjwtdm=2&wjwtdm=3&wjwtdm=4&wjwtdm=5&wjwtdm=6&wjwtdm=7&wjwtdm=8&wjwtdm=9&xzwdt=&xzwdttm=9&xzwdtxx=G&wdttm=10&wdt=",
				success: function(result,status){
					//setTimeout(function(){navTab.closeCurrentTab(result.navTabId);}, 100);
					/*
					var tmp = document.body.onload; //保存原来的事件句柄
					document.body.setAttribute("onload","validateCallback(result, navTabAjaxDone)");
					console.log(document.body.onload);
					document.body.onload();
					document.body.onload=tmp; //恢复原来的事件句柄
					location.href="javascript:validateCallback(result, navTabAjaxDone); void 0";*/
					alert("保存成功！");
					
				}
			});
		}
    });
}
