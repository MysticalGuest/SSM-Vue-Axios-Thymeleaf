/**!
 * js-apartment.js
 * 
 */


// 房价下拉框
var priceList;
let priceJSON=[];
function addSerialNum(item, index){
	let data = {}
	data.num=index+1;
	data.price=item;
	priceJSON.push(data);
}
priceList.forEach(addSerialNum);
$(function() {
	$('#priceList').bootstrapTable({
		dataField: "num",
		pagination: true,					//是否分页
		pageSize: 10,						//单页记录数
		clickToSelect: true,				//是否启用点击选中行
		paginationDetailHAlign:'hidden',	//下面的分页信息不显示
		data:priceJSON,
		onClickRow: function(row) {
			document.getElementById('roomPrice').value=row.price;
		},									//单击row事件
	}) 
});

function formatData(data){
	var state='';
	var rows = [];
	for(var i=0; i<data.length; i++){
		if(data[i].state==false)
			state="未开出";
		else if(data[i].state==true)
			state="已开出";
		rows.push({
			roomNum: data[i].roomNum,
			price: data[i].price,
			state: state,
		});
	}
	return rows;
}

// 页面左边的搜索框等对应的方法
new Vue({
	el: '.form-group',
	data: {},
	methods: {
		doSearch:function(){
			let roomNum = $("#roomNum").val();
            let price = $("#roomPrice").val();
            let state = $("input[name='state']:checked").val();
//            console.log("state:",state);
			let param = new URLSearchParams();
			param.append("roomNum", roomNum);
			param.append("price", price);
			param.append("state", state);
			axios({
				url:'../commonOperation/SearchApartmentInfo',
				method:'post',
				data: param,
				header: {'Content-Type':'application/json'}
			})
			.then(function (response) {
				$("#apartment").bootstrapTable('load', formatData(response.data));
			})
			.catch(function (error) {
				console.log(error);
			})
		},
		//显示全部,将所有输入置空
		showAll:function(){
			//将搜索框的输入清空,还原input的状态
			$(" #roomNum").val("");
//			$("input[name='state']:checked").attr("checked",false);
			$(":radio[name=state]:checked").prop("checked",false);
			$("#roomPrice").val("");
			let param = new URLSearchParams();
			param.append("roomNum", "");
			param.append("price", "");
			param.append("state", "");
			axios({
				url:'../commonOperation/SearchApartmentInfo',
				method:'post',
				data: param,
				header: {'Content-Type':'application/json'}
			})
			.then(function (response) {
				$("#apartment").bootstrapTable('load', formatData(response.data));
			})
			.catch(function (error) {
				console.log(error);
				BootstrapDialog.show({
					title: '提示',
				    message: '显示失败!',
				    buttons: [{
				        label: '确定',
				        cssClass: 'btn-primary',
				        action: function(dialogItself){
				            dialogItself.close();
				            location.href='/SSMHotel/front/ApartmentForFront'
				        }
				    }]
				});
			})
    	},
    	//多选退房
    	checkOutChecked:function(){
    		let checkedItems = $('#apartment').bootstrapTable('getAllSelections');
    		console.log(checkedItems);
    		let rooms = [];
			$.each(checkedItems, function (index, item) {
				rooms.push(item.roomNum);
			});
			//将rooms数组转为字符串传到后台
			var strRoom=rooms.join(",")
			if(rooms==""){
				BootstrapDialog.show({
					title: '提示',
				    message: '您未选中任何房间!',
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
				param.append("strRoom", strRoom);
				axios({
					url:'../commonOperation/checkOutChecked',
					method:'post',
					data: param,
					header: {'Content-Type':'application/json'}
				})
				.then(function (response) {
					BootstrapDialog.show({
						title: '提示',
					    message: '选中退房成功!',
					    buttons: [{
					        label: '确定',
					        cssClass: 'btn-primary',
					        action: function(dialogItself){
					            dialogItself.close();
					        }
					    }]
					});
					$("#apartment").bootstrapTable('load', formatData(response.data));
				})
				.catch(function (error) {
					console.log(error);
					BootstrapDialog.show({
						title: '提示',
					    message: '选中退房失败!',
					    buttons: [{
					        label: '确定',
					        cssClass: 'btn-primary',
					        action: function(dialogItself){
					            dialogItself.close();
					            location.href='/SSMHotel/front/ApartmentForFront'
					        }
					    }]
					});
				})
			}
    	},
    	//全部退房调用函数
    	allCheckOut:function(){
    		axios({
				url:'../commonOperation/allCheckOut',
				method:'post',
				header: {'Content-Type':'application/json'}
			})
			.then(function (response) {
				$("#apartment").bootstrapTable('load', formatData(response.data));
			})
			.catch(function (error) {
				console.log(error);
				BootstrapDialog.show({
					title: '提示',
				    message: '退房失败!',
				    buttons: [{
				        label: '确定',
				        cssClass: 'btn-primary',
				        action: function(dialogItself){
				            dialogItself.close();
				            location.href='/SSMHotel/front/ApartmentForFront'
				        }
				    }]
				});
			})
    	}
	}
})

// 表格中的按钮对应方法
//new Vue({
//	el: '#apartment',
//	data: {},
//	methods: {
//		//全部退房调用函数
//    	checkOut:function(){
//    		axios({
//				url:'../commonOperation/checkOut',
//				method:'post',
//				header: {'Content-Type':'application/json'}
//			})
//			.then(function (response) {
//				$("#apartment").bootstrapTable('load', formatData(response.data));
//			})
//			.catch(function (error) {
//				console.log(error);
//				BootstrapDialog.show({
//					title: '提示',
//				    message: '退房失败!',
//				    buttons: [{
//				        label: '确定',
//				        cssClass: 'btn-primary',
//				        action: function(dialogItself){
//				            dialogItself.close();
//				            location.href='/SSMHotel/front/ApartmentForFront'
//				        }
//				    }]
//				});
//			})
//    	}
//	}
//})

// 传来表格数据
var apartmentData;

$(function() {
	
	$('#apartment').bootstrapTable({
		dataField: "roomNum",	//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
		height: tableHeight(),	//高度调整
		pagination: true,		//是否分页
		pageSize: 10,			//单页记录数
		pageList: [10, 20, 50],	//分页步进值
		// sidePagination: "server",//服务端分页
		contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
		dataType: "json",		//期待返回数据类型
		method: "get",			//请求方式
		// load: data,
		// searchAlign: "left",//查询框对齐方式
		// queryParamsType: "limit",//查询参数组织方式
		// queryParams: function getParams(params) {
		//     //params obj
		//     params.other = "otherInfo";
		//     return params;
		// },
		// searchOnEnterKey: false,//回车搜索
		// showRefresh: true,//刷新按钮
		// showColumns: true,//列选择按钮
		// buttonsAlign: "left",//按钮对齐方式
		// toolbar: "#toolbar",//指定工具栏
		// toolbarAlign: "right",//工具栏对齐方式
		columns: [
			{
				title: "全选",
				field: "select",
				checkbox: true,
				width: 20,			//宽度
				align: "center",	//水平
				valign: "middle"	//垂直
			},
			{
				title: "房号",		//标题
				field: "roomNum",	//键名
				sortable: true,		//是否可排序
				align: "center",	//水平
				valign: "middle"	//垂直
			},
			{title: "价格",field: "price",align: "center",valign: "middle"},
			{title: "房间状态",field: "state",align: "center",valign: "middle"},
			{
				title: "修改",
				field: "action",
				align: "center",
				valign: "middle",
				formatter: 'formatAction',	//对本列数据做格式化
			}
		],
		locale: "zh-CN",	//中文支持
		
	});
	// 加载数据
	$('#apartment').bootstrapTable('load', formatData(apartmentData));
})


function tableHeight() {
	return $(window).height() - 110;
}

function formatAction(value,row,index){
	var checkOut = '<button onclick="a()" style="cursor:pointer;border:1px solid #ccc;border-radius: 2px;">退房</button>';
	if(row.state=="未开出")
		return ;
	else if(row.state=="已开出")
		return checkOut;
}

function a(){
	alert("LKLLKL");
}