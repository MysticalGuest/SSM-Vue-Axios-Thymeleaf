/**!
 * js-customerinfo.js
 * 
 */


$(function() {
	$("#timegroup").datetimepicker({
		language: 'zh-CN',
		format: 'yyyy-mm-dd',
		todayBtn: true,  // 显示当天按钮，点击则选择当天时间
		autoclose: true,  // 选完时间自动关闭
		todayHighlight: true,
		showMeridian: true,
		startView: 4,
		minView:2,
	});
    //根据窗口调整表格高度
    // $(window).resize(function() {
    //     $('#customerInfo').bootstrapTable('resetView', {
    //         height: tableHeight()
    //     })
    // })
	
	$('#customerInfo').bootstrapTable({
		url: "../commonOperation/CustomerInfo",//数据源
        dataField: "inTime",//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
        height: tableHeight(),//高度调整
        pagination: true,//是否分页
        pageSize: 10,//单页记录数
        pageList: [10, 20, 50],//分页步进值
        // sidePagination: "server",//服务端分页
        contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
        dataType: "json",//期待返回数据类型
        method: "get",//请求方式
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
                width: 20,//宽度
                align: "center",//水平
                valign: "middle"//垂直
            },
            {
                title: "入住时间",//标题
                field: "inTime",//键名
                sortable: true,//是否可排序
				align: "center",//水平
				valign: "middle"//垂直
                // order: "desc"//默认排序方式
            },
            {title: "姓名",field: "cName",align: "center",valign: "middle"},
            {title: "身份证号",field: "cardID",align: "center",valign: "middle"},
            // {
            //     field: "房号",
            //     title: "roomNum[using-formatter]",
            //     formatter: 'infoFormatter',//对本列数据做格式化
            // }
			{
			    title: "房号",
			    field: "roomNum",
			},
			{title: "收款",field: "chargeAndDeposit",align: "center",valign: "middle"},
			{title: "支付方式",field: "paymentMethod",align: "center",valign: "middle"},
        ],
        // onClickRow: function(row, $element) {
        //     //$element是当前tr的jquery对象
        //     $element.css("background-color", "green");
        // },//单击row事件
        locale: "zh-CN", //中文支持
        // detailView: false, //是否显示详情折叠
        detailFormatter: function(index, row, element) {
            var html = '';
            $.each(row, function(key, val){
                html += "<p>" + key + ":" + val +  "</p>"
            });
            return html;
        }
    });

    // $("#addRecord").click(function(){
    //     alert("name:" + $("#name").val() + " age:" +$("#age").val());
    // });
})

function tableHeight() {
    return $(window).height() - 150;
}
/**
 * 列的格式化函数 在数据从服务端返回装载前进行处理
 * @param  {[type]} value [description]
 * @param  {[type]} row   [description]
 * @param  {[type]} index [description]
 * @return {[type]}       [description]
 */
// function infoFormatter(value, row, index)
// {
//     return "id:" + row.id + " name:" + row.name + " age:" + row.age;
// }




new Vue({
	el: '.form-group',
	data: {},
	methods: {
		//搜索函数
		doSearch:function(){
			let inTime = $("#checkInTime").val();
			let roomNum = $("#roomNum").val();
			let cName = $("#cName").val();
			let param = new URLSearchParams();
			param.append("inTime", inTime);
			param.append("roomNum", roomNum);
			param.append("cName", cName);
			axios({
				url:'../commonOperation/SearchCustomerInfo',
				method:'post',
				data: param,
				header: {'Content-Type':'application/json'}
			})
			.then(function (response) {
				console.log(response);
				console.log(response.data);
				$("#customerInfo").bootstrapTable('load', response.data);
			})
			.catch(function (error) {
				console.log(error);
			})
		},
		//显示全部调用函数
		showAll:function(){
			//将搜索框的输入清空,还原input的状态
			$("#checkInTime").val("");
			$("#cName").val("");
			$("#roomNum").val("");
			let param = new URLSearchParams();
			axios({
				url:'../commonOperation/ShowAllCustomerInfo',
				method:'post',
				data: param,
				header: {'Content-Type':'application/json'}
			})
			.then(function (response) {
				$("#customerInfo").bootstrapTable('load', response.data);
			})
			.catch(function (error) {
				BootstrapDialog.show({
					type: BootstrapDialog.TYPE_INFO,
					title: '提示',
					message: '显示失败!',
					buttons: [{
						label: '确定',
						cssClass: 'btn-primary',
						action: function(dialogItself){
							dialogItself.close();
							location.href='./front/GuestInfoForFront'
						}
					}]
				});
				console.log(error);
			})
		}
	},
})