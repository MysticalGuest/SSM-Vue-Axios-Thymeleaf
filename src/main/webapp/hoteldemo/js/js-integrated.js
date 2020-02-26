/*!
 * js-integrated.js
 * Create by MysticalGuest
 * https://github.com/MysticalGuest
 */

$(function() {
	$('#integratedInfo').bootstrapTable({
		url: "../administrator/IntegratedInfo",			//数据源
		dataField: "name",
		height: $(window).height() - 130,
		pagination: true,
		paginationDetailHAlign: ' hidden',
		pageSize: 10,
		pageList: [10, 20, 50],
		contentType: "application/x-www-form-urlencoded",
		dataType: "json",
		method: "get",
		columns: [
			{title: "修改项",field: "name",align: "center",valign: "middle"},
			{title: "价格",field: "price",align: "center",valign: "middle"},
		],
		locale: "zh-CN",
		onClickCell: function(field, value, row, $element) {
			console.log(row);
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
					index: index,       //行索引
					field: field,       //列名
					value: tdValue      //cell值
				});
				$.ajax({
					url: 'ResetExpense',
					type: 'post',
					data: {'price':tdValue,'kind':row.kinds},
					dataType:'json',
					traditional:true,
					success:function(data){
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
})

$(window).resize(function() {
	$('#integratedInfo').bootstrapTable('resetView', {
		height: $(window).height() - 130
	})
})