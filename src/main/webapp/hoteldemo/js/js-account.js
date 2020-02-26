/*!
 * js-account.js
 * Create by MysticalGuest
 * https://github.com/MysticalGuest
 */

//---------------------------//
//   JS FILE RECEIVES HTML   //
//     PAGE PARAMETERS       //
//---------------------------//
// "其他消费"值
var total;
// 传来表格数据
var billData;

//---------------------------//
//      FUNCTION CODE        //
//---------------------------//
/**
 * 页面中间消费信息样式
 * @param canvasObj canvas标签对象
 * @param text 填充canvas标签的文本
 * @param textBeginX 开始显示文本的位置
 * @param lineEndX 结束显示文本的位置
 */
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

/**
 * 合并行
 * @param data 原始数据（在服务端完成排序）
 * @param fieldName 合并属性名称数组
 * @param colspan 列数
 * @param target 目标表格对象
 */
function mergeCells(data, fieldName, colspan, target) {
	if (data.length == 0) { // 空数据
		return;
	}
	var numArr = [];
	var value = data[0][fieldName];
	var num = 0;
	for (var i = 0; i < data.length; i++) {
		if (value != data[i][fieldName]) {
			numArr.push(num);
			value = data[i][fieldName];
			num = 1;
			continue;
		}
		num++;
	}
	var merIndex = 0;
	for (var i = 0; i < numArr.length; i++) {
		$(target).bootstrapTable('mergeCells', { index: merIndex, field: fieldName, colspan: colspan, rowspan: numArr[i] })
		merIndex += numArr[i];
	}
}

//---------------------------//
//        LOGIC CODE         //
//---------------------------//
// After the DOM is loaded, the entire content of the page (such as pictures) is executed before it is completely loaded.
$(function(){
	// 调用drawLayer02Label(canvasObj,text,textBeginX,lineEndX)函数
	drawLayer02Label($("#layer02_01 canvas").get(0),"截止目前开出的房间",60,200);
	drawLayer02Label($("#layer02_02 canvas").get(0),"截止目前开出的发票",60,200);
	drawLayer02Label($("#layer02_03 canvas").get(0),"截止目前的营业额",60,200);
	drawLayer02Label($("#layer02_04 canvas").get(0),"截止目前的净营业额",60,300);
	drawLayer02Label($("#layer02_05 canvas").get(0),"已收押金",60,200);
	drawLayer02Label($("#layer02_06 canvas").get(0),"其他消费",60,200);
	
	// 页面"其他消费"赋值
	document.getElementById('forTotal').innerHTML = total;
	
	$('#billList').bootstrapTable({
		dataField: "roomNum",
		height: $(window).height() - 200,
		pagination: true,
		paginationDetailHAlign: ' hidden',
		pageSize: 10,
		pageList: [10, 20, 50],
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		method: "get",
		data: billData,
		columns: [
			[
				{title: "房客姓名",field: "cName",align: "center",valign: "middle",rowspan: 2},
				{title: "房号",field: "roomNum",align: "center",valign: "middle",rowspan: 2},
				{title: "收款",field: "chargeAndDeposit",align: "center",valign: "middle",rowspan: 2},
				{title: "开房时间",field: "inTime",align: "center",valign: "middle",rowspan: 2},
				{title: "应退押金",field: "refund",align: "center",valign: "middle",rowspan: 2},
				{title: "-",field: "occupied",align: "center",colspan: 2}
			],
			[
				{title: "-",field: "occupied1"},
				{title: "-",field: "occupied2"},
			]
		],
		locale: "zh-CN",
		onPageChange: function() {
			let thispage = $('#billList').bootstrapTable('getOptions').pageNumber;
			$('#expenseInfo').bootstrapTable('selectPage',thispage);
			$('#allExpenseInfo').bootstrapTable('selectPage',thispage);
		}
	});
	
	// 执行合并行函数
	mergeCells(billData, "cName", 1, $('#billList'));
	mergeCells(billData, "chargeAndDeposit", 1, $('#billList'));
	mergeCells(billData, "inTime", 1, $('#billList'));
	mergeCells(billData, "refund", 1, $('#billList'));
	
	$('#expenseInfo').bootstrapTable({
		dataField: "roomNum",
		height: $(window).height() - 200,
		pagination: true,
		paginationDetailHAlign: ' hidden',
		onlyInfoPagination: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		method: "get",
		data: billData,
		columns: [
			[
				{
					title: "其他消费(以数量计)",
					field: "otherCost",
					align: "center",
					valign: "middle",
					colspan: 6,
					editable : true
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
		locale: "zh-CN",
		onClickCell: function(field, value, row, $element) {
			$element.attr('contenteditable', true);
			// 监听,设置了contenteditable=true属性,限制只能输入数字
			$element.attr('id', 'editor');
			document.getElementById('editor').oninput = function () {
				this.innerHTML = this.innerHTML.replace(/[\D]/g, '');
				keepLastIndex(this)
			}
			function keepLastIndex(obj) {
				if (window.getSelection) {
					obj.focus();
					var range = window.getSelection();
					range.selectAllChildren(obj);
					range.collapseToEnd();
				}
				else if (document.selection) {
					var range = document.selection.createRange();
					range.moveToElementText(obj);
					range.collapse(false);
					range.select();
				}
			}
			$element.blur(function() {
				let index = $element.parent().data('index');
				let tdValue = $element.html();
				$('#expenseInfo').bootstrapTable('updateCell', {
					index: index,		//行索引
					field: field,		//列名
					value: tdValue		//cell值
				});
				$.ajax({
					url: 'doAccounts',
					type: 'post',
					data: {'field':field,'value':tdValue,'roomNum':row.roomNum,'inTime':row.inTime},
					dataType:'json',
					traditional:true,
					success:function(data){
						// 提交其他消费的数量后,动态改变页面上的数值
						document.getElementById('forTotal').innerHTML = data.total;
					},
					error:function(xhr,type,errorThrown){
						console.log(errorThrown);
						BootstrapDialog.show({
							type: BootstrapDialog.TYPE_INFO,
							title: '提示',
							message: '保存失败!',
							buttons: [{
								label: '确定',
								cssClass: 'btn-info',
								action: function(dialogItself){
									dialogItself.close();
									location.reload([true]);
								}
							}]
						});
					}
				});
			})
		}
	});

	$('#allExpenseInfo').bootstrapTable({
		dataField: "roomNum",
		height: $(window).height() - 200,
		pagination: true,
		paginationDetailHAlign: ' hidden',
		onlyInfoPagination: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		method: "get",
		data: billData,
		columns: [
			[
				{
					title: "其他消费(以数量计)",
					field: "otherCost",
					align: "center",
					valign: "middle",
					colspan: 6,
					editable : true
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
		locale: "zh-CN",
	});
});


// 根据窗口调整表格高度
$(window).resize(function() {
	$('.table').bootstrapTable('resetView', {
		height: $(window).height() - 200
	})
})