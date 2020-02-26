/*!
 * js-apartment.js
 * Create by MysticalGuest
 * https://github.com/MysticalGuest
 */

//---------------------------//
//   JS FILE RECEIVES HTML   //
//     PAGE PARAMETERS       //
//---------------------------//
// 房价下拉框
var priceList;
// 定义数组
let priceJSON=[];
// 表格数据
var apartmentData;

//---------------------------//
//      FUNCTION CODE        //
//---------------------------//
/**
 * 对数据加序号
 * @param item 被加序号的对象
 * @param index 序号
 */
function addSerialNum(item, index){
	let data = {}
	data.num=index+1;
	data.price=item;
	priceJSON.push(data);
}

/**
 * 自定义格式化数据
 * @param data 被格式化的数据
 */
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

/**
 * 自定义格式化数据
 * @param row 对应行数据
 * 必须放在表格初始化之前
 */
function formatAction(value,row,index){
	var checkOut = '<button id="bind" style="cursor:pointer;border:1px solid #ccc;border-radius: 2px;">退房</button>';
	if(row.state=="未开出")
		return null;
	else if(row.state=="已开出"){
		return checkOut;
	}
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
		// 显示全部,将所有输入置空
		showAll:function(){
			// 将搜索框的输入清空,还原input的状态
			$(" #roomNum").val("");
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
							location.reload([true]);
						}
					}]
				});
			})
		},
		// 多选退房
		checkOutChecked:function(){
			let checkedItems = $('#apartment').bootstrapTable('getAllSelections');
			console.log(checkedItems);
			let rooms = [];
			$.each(checkedItems, function (index, item) {
				rooms.push(item.roomNum);
			});
			// 将rooms数组转为字符串传到后台
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
								location.reload([true]);
							}
						}]
					});
				})
			}
		},
		// 全部退房调用函数
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
							location.reload([true]);
						}
					}]
				});
			})
		}
	}
})

//根据窗口调整表格高度
$(window).resize(function() {
	$('#apartment').bootstrapTable('resetView', {
		height: $(window).height() - 130
	})
})

window.operateEvents = {
	'click #bind': function (e, value, row, index) {
		let param = new URLSearchParams();
		param.append("roomNum", row.roomNum);
		axios({
			url:'../commonOperation/checkOut',
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
				message: '退房失败!',
				buttons: [{
					label: '确定',
					cssClass: 'btn-primary',
					action: function(dialogItself){
						dialogItself.close();
						location.reload([true]);
					}
				}]
			});
		})
	}
};

$(function() {
	// 对价格列表添加序号
	priceList.forEach(addSerialNum);
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
	
	$('#apartment').bootstrapTable({
		dataField: "roomNum",
		height: $(window).height() - 130,
		pagination: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		method: "get",
		columns: [
			{title: "全选",field: "select",checkbox: true,width: 20,align: "center",valign: "middle"},
			{title: "房号",field: "roomNum",sortable: true,align: "center",valign: "middle"},
			{title: "价格",field: "price",align: "center",valign: "middle"},
			{title: "房间状态",field: "state",align: "center",valign: "middle"},
			{
				title: "修改",
				field: "action",
				align: "center",
				valign: "middle",
				formatter: 'formatAction',	//对本列数据做格式化
				events: operateEvents,		//给按钮注册事件
			}
		],
		locale: "zh-CN",
	});
	// 加载数据
	$('#apartment').bootstrapTable('load', formatData(apartmentData));
})