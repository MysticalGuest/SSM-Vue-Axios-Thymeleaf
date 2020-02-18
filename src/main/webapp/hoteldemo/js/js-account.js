/**!
 * Create by MysticalGuest
 * js-account.js
 * 
 */

$(function(){
	drawLayer02Label($("#layer02_01 canvas").get(0),"截止目前开出的房间",60,200);
	drawLayer02Label($("#layer02_02 canvas").get(0),"截止目前开出的发票",60,200);
	drawLayer02Label($("#layer02_03 canvas").get(0),"截止目前的营业额",60,200);
	drawLayer02Label($("#layer02_04 canvas").get(0),"截止目前的净营业额",60,300);
	drawLayer02Label($("#layer02_05 canvas").get(0),"已收押金",60,200);
	drawLayer02Label($("#layer02_06 canvas").get(0),"其他消费",60,200);
});

function drawLayer02Label(canvasObj,text,textBeginX,lineEndX){
	var colorValue = 'grey';

	var ctx = canvasObj.getContext("2d");

	ctx.beginPath();
	ctx.arc(35,55,2,0,2*Math.PI);
	ctx.closePath();
	ctx.fillStyle = colorValue;
	ctx.fill();

	ctx.moveTo(35,55);
	ctx.lineTo(60,80);
	ctx.lineTo(lineEndX,80);
	ctx.lineWidth = 1;
	ctx.strokeStyle = colorValue;
	ctx.stroke();

	ctx.font='15px Georgia';
	ctx.fillStyle = colorValue;
	ctx.fillText(text,textBeginX,92);
}

//传来表格数据
var billData;

$(function() {
	
	$('#billList').bootstrapTable({
		dataField: "roomNum",	//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
		height: tableHeight(),	//高度调整
		pagination: true,		//是否分页
		pageSize: 10,			//单页记录数
		pageList: [10, 20, 50],	//分页步进值
		// sidePagination: "server",//服务端分页
		contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
		dataType: "json",		//期待返回数据类型
		method: "get",			//请求方式
		columns: [
			[
				{
					title: "房客姓名",		//标题
					field: "cName",		//键名
					align: "center",	//水平
					valign: "middle",	//垂直
					rowspan: 2
				},
				{
					title: "房号",		//标题
					field: "roomNum",	//键名
					align: "center",	//水平
					valign: "middle",	//垂直
					rowspan: 2
				},
				{title: "收款",field: "chargeAndDeposit",align: "center",valign: "middle",rowspan: 2},
				{title: "开房时间",field: "inTime",align: "center",valign: "middle",rowspan: 2},
				{title: "应退押金",field: "refund",align: "center",valign: "middle",rowspan: 2},
				{title: "",field: "occupied",colspan: 2}
			],
			[
				{title: "",field: "occupied1"},
				{title: "",field: "occupied2"}
			]
			
		],
		locale: "zh-CN",				//中文支持
		
	});
	// 加载数据
	$('#billList').bootstrapTable('load', billData);
	
	$('#expenseInfo').bootstrapTable({
		dataField: "roomNum",	//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
		height: tableHeight(),	//高度调整
		pagination: true,		//是否分页
		pageSize: 10,			//单页记录数
		pageList: [10, 20, 50],	//分页步进值
		// sidePagination: "server",//服务端分页
		contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
		dataType: "json",		//期待返回数据类型
		method: "get",			//请求方式
		columns: [
			[
				{
					title: "其他消费(以数量计)",
					field: "otherCost",
					align: "center",
					valign: "middle",
					colspan: 6
				},
				{
					title: "编辑",
					field: "editer",
					align: "center",
					valign: "middle",
					rowspan: 2
				}
			],
			[
				{title: "矿泉水",field: "mineral",align: "center",valign: "middle"},
				{title: "脉动",field: "pulsation",align: "center",valign: "middle"},
				{title: "绿茶",field: "greenTea",align: "center",valign: "middle"},
				{title: "茶叶",field: "tea",align: "center",valign: "middle"},
				{title: "泡面",field: "noodles",align: "center",valign: "middle"},
				{title: "王老吉/加多宝",field: "wljjdb",align: "center",valign: "middle"},
			]
			
		],
		locale: "zh-CN",				//中文支持
		
	});
	// 加载数据
	$('#expenseInfo').bootstrapTable('load', billData);
})


function tableHeight() {
	return $(window).height() - 200;
}