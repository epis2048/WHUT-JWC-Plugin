// ==UserScript==
// @name        武汉理工大学教务系统助手
// @namespace   WHUT-JWC-Plugin
// @description 武汉理工大学 学分制选课系统 辅助插件
// @namespace   WHUT-JWC-Plugin
// @author      epis2048
// @run-at      document-end
// @version     0.2


// 成绩系统要干的
if(/202.114.50.130\/Score\/login.do\?msg/g.test(window.location.href)){
	initScript();
	$('title').text("成绩-武汉理工大学教务管理系统");
	
	$($("ul.nav").children()[4]).after(`<li id="myuser"><input type="submit" class="myuserconfig" value="自我安慰" style="background: #2866bd;
        color: #fff;text-align: center;border: 2px solid #E5E5E5;display: none;cursor:pointer;"></li>`);
    $(".accordionContent:eq(0)>ul>li:eq(0)>ul:eq(0)>li:eq(0) a").click(
        function(){
            $($(".myuserconfig")[0]).css("display","inline-block");//点亮图标
            $($(".myuserconfig")[0]).val("自我安慰");
        }
    );
    $($('*[href="xskwxfList.do"]')[0]).click(
        function(){
            $($(".myuserconfig")[0]).css("display","inline-block");//点亮图标
            $($(".myuserconfig")[0]).val("计算课外学分总和");
        }
    );
    $($("ul.nav").children()[5]).click(
        function(){
            if($($(".myuserconfig")[0]).val()=="自我安慰"){
                let trs=$("tr",$("tbody")[1]);
                $(trs).each(
                    function(){
                        let tds = $("td",this)
                        $(tds[6]).text(100);
                        $(tds[8]).text(100);
                        $(tds[9]).text(100);
                        $(tds[13]).text("5.0");
                        }
                )
            }
            else if($($(".myuserconfig")[0]).val()=="计算课外学分总和"){
                let trs=$("tr",$("tbody")[1]);
                let sum=0;
                $(trs).each(
                    function(){
                        sum+=parseFloat($($("td",this)[5]).text());
                        //console.log($($("td",this)[5]).text());
                    }
                );
                toastr.success("课外学分总和为：" + sum);
				//alert(sum);
            }
        }
    )
}
