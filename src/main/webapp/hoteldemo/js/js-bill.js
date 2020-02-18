/**!
 * js-bill.js
 * 
 */

// 房号树形下拉框
var dataROOM;

// 加载时间
var hourRoomPrice;

/*! 房号树形下拉框 */
//bootstrap的dropdown-menu(下拉菜单)点击选项后不关闭的方法 data-stopPropagation="true"
//指定要操作的元素的click事件停止传播—定义属性值data-stopPropagation的元素点击时停止传播事件
$("body").on('click','[data-stopPropagation]',function (e) {
	e.stopPropagation();
});
$(function() {
	$('#apartment').bootstrapTable({
		dataField: "roomNum",
		columns: [
			{
				checkbox: true,
				formatter: function (i,row) {// 每次加载 checkbox 时判断当前 row 的 id 是否已经存在全局 Set() 里
					if($.inArray(row.roomNum,overAllIds)!=-1){// 因为 判断数组里有没有这个 id
						return {
							checked : true               // 存在则选中
						}
					}
				}
			},
		],
		pagination: true,//是否分页
		pageSize: 10,//单页记录数
		clickToSelect: true,//是否启用点击选中行
		paginationDetailHAlign:' hidden',//下面的分页信息不显示
		data:dataROOM,
	}) 
});

$('#apartment').on('uncheck.bs.table check.bs.table check-all.bs.table uncheck-all.bs.table',
function(e,rows){
	var datas = $.isArray(rows) ? rows : [rows];	// 点击时获取选中的行或取消选中的行
	examine(e.type,datas);							// 保存到全局 Array() 里
});
 

var overAllIds = new Array();  //全局数组 其他script标签可以直接使用
 
function examine(type,datas){
	if(type.indexOf('uncheck')==-1){
		$.each(datas,function(i,v){
		   // 添加时，判断一行或多行的 id 是否已经在数组里 不存则添加
		 overAllIds.indexOf(v.roomNum) == -1 ? overAllIds.push(v.roomNum) : -1;　　　　});
	}
	else{
		$.each(datas,function(i,v){
			overAllIds.splice(overAllIds.indexOf(v.roomNum),1);	//删除取消选中行
		});
	}
}

/*! 
	加载时间的函数 
*/
//页面加载调用
window.onload=function(){
	//每1秒刷新时间
	setInterval("NowTime()",1000);
}
function NowTime(){
	//获取年月日
	var time=new Date();
	var year=time.getFullYear();
	//月份是从0开始计算的，取值为0-11，所以会小1
	var month=time.getMonth()+1;
	var day=time.getDate();
	
	//获取时分秒
	var h=time.getHours();
	var m=time.getMinutes();
	var s=time.getSeconds();
	
	//检查是否小于10
	h=check(h);
	m=check(m);
	s=check(s);
	document.getElementById("nowtime").innerHTML=h+":"+m+":"+s;
	document.getElementById("nowdate").innerHTML=year+"-"+month+"-"+day;
	
	//时间数字小于10，则在之前加个“0”补位。
	function check(i){
		//方法一，用三元运算符
		var num;
		i<10?num="0"+i:num=i;
		return num;
		
		//方法二，if语句判断
		//if(i<10){
		//    i="0"+i;
		//}
		//return i;
	}
	
	//根据房间apartment表格输出房间数
	var count=0;
	// var arr=[];    //定义一个数组存放判断后不重复的元素
	
	document.getElementById('room').value=overAllIds;
	
	//根据房间apartment表格输出房价
	var type=$("input[name='roomType']:checked").val();
	
	var price=0;
	for(var i=0;i<overAllIds.length; i++){
		for(var j=0;j<dataROOM.length; j++){
			if(dataROOM[j].roomNum==overAllIds[i]){
				if(type=="hour"){
					price+=hourRoomPrice;
				}
				else{
					price+=dataROOM[j].price;
				}
				break;
			}
				
		}
	}
	
	//计算押金
	var chargeAndDeposit = $("#chargeAndDeposit").html();
	
	if(type=="allDay"){
		document.getElementById("sumOfRooms1").innerHTML=count;
		document.getElementById("sumOfPrice1").innerHTML=price;
		document.getElementById("deposit1").innerHTML=chargeAndDeposit-price;
		document.getElementById("sumOfRooms2").innerHTML='';
		document.getElementById("sumOfPrice2").innerHTML='';
		document.getElementById("deposit2").innerHTML='';
	}
	else if(type=="hour"){
		document.getElementById("sumOfRooms1").innerHTML='';
		document.getElementById("sumOfPrice1").innerHTML='';
		document.getElementById("deposit1").innerHTML='';
		document.getElementById("sumOfRooms2").innerHTML=count;
		document.getElementById("sumOfPrice2").innerHTML=price;
		document.getElementById("deposit2").innerHTML=chargeAndDeposit-price;
	}
	else{}
	
}

new Vue({
	el: '.tserver-list2',
	data: {},
	methods: {
		datasubmit:function(){
			//身份证和支付方式
			let paymentMethod=$("input[name='paymentMethod']:checked").val();
			let cardID=document.getElementById("cardID").value;
			if(typeof(paymentMethod) == "undefined"){
				let paymentMethod="";
			}
			//发票
			let cName = $("#cName").html();
			let chargeAndDeposit = $("#chargeAndDeposit").html();
			let roomNum = document.getElementById("room").value;
			if(cName==''||cName==null){
				BootstrapDialog.show({
					type: BootstrapDialog.TYPE_INFO,
					title: '提示',
					message: '请填写客户姓名!',
					buttons: [{
						label: '确定',
						cssClass: 'btn-info',
						action: function(dialogItself){
							dialogItself.close();
						}
					}]
				});
			}
			else if(overAllIds==''){
				BootstrapDialog.show({
					title: '提示',
				    message: '请选择房间!',
				    buttons: [{
				        label: '确定',
				        cssClass: 'btn-primary',
				        action: function(dialogItself){
				            dialogItself.close();
				        }
				    }]
				});
			}
			else{
				let param = new URLSearchParams();
				param.append("paymentMethod", paymentMethod);
				param.append("cardID", cardID);
				param.append("cName", cName);
				param.append("chargeAndDeposit", chargeAndDeposit);
				param.append("roomNum", roomNum);
				axios({
					url:'../front/Bill',
					method:'post',
					data: param,
					header: {'Content-Type':'application/json'}
				})
				.then(function (response) {
					console.log(response);
					$("#apartment").bootstrapTable('load', response.data);
				})
				.catch(function (error) {
					console.log(error);
				})
				//打印的时候将按钮隐藏
				document.getElementById('button').style.display='none';
				window.print();
				
				//将所填信息清空或还原
				document.getElementById("cName").innerHTML='';
				overAllIds=[];
				document.getElementById("room").innerHTML='';
				document.getElementById("chargeAndDeposit").innerHTML=200;
				document.getElementById("cardID").value='';
				$("input[name='paymentMethod']:checked").prop("checked",false);
				//再将隐藏的按钮显示出来
				document.getElementById('button').style.display='block';
			}
		}
	},
})