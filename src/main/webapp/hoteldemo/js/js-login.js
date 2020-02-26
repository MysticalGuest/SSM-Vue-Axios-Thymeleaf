/*!
 * js-login.js
 * Create by MysticalGuest
 * https://github.com/MysticalGuest
 */

//---------------------------//
//      FUNCTION CODE        //
//---------------------------//
/**
 * 前端验证函数
 */
function validateLimit(){
	let AdmId = $("#loginForm input[name='AdmId']").val();
	let aPassword = $("#loginForm input[name='aPassword']").val();
	let limit = $('input:radio[name="rdo"]:checked').val();
	let booldata = '';
	if(AdmId!='' && aPassword!=''){
		$.ajax({
			url: 'validateLimit',
			type: 'post',
			data:{'AdmId':AdmId,"aPassword":aPassword,"limit":limit},
			dataType:'json',
			async:false,// 同步请求
			success:function(data){
				booldata=data;
			},
			error:function(xhr,type,errorThrown){
				console.log(errorThrown);
			}
		});
		if(booldata==false){
			// create the notification
			var notification = new NotificationFx({
				message : '无效登录!',
				layout : 'growl',
				effect : 'jelly',
				type : 'notice', // notice, warning, error or success
				onClose : function() {
				}
			});
			// show the notification
			notification.show();
			return false;
		}
	}
	return booldata;
}

// 打开字滑入效果
window.onload = function(){
	$(".connect p").eq(0).animate({"left":"0%"}, 600);
	$(".connect p").eq(1).animate({"left":"0%"}, 400);
	// 在最新的H5 API里已经有了对粘贴事件的支持, 事件名为paste,没有onpaste,但仍可以使用
	$(".aPassword").bind('paste',false);  // 禁止在密码框中使用粘贴
	$(".confirm_password").bind('paste',false);
	$(".email").bind('paste',false);
};

// jquery.validate表单验证
$(document).ready(function(){
	//登陆表单验证
	$("#loginForm").validate({
		rules:{
			AdmId:{
				required:true,			//必填
				minlength:3, 			//最少3个字符
				maxlength:32,			//最多32个字符
				// 使用ajax方法调用映射方法验证输入值
				remote:{
					url:"validateId",	//用户名有效性检查，别跨域调用
					type:"post",
				},
			},
			aPassword:{
				required:true,
				minlength:3, 
				maxlength:32,
				remote:{
					url:"validatePassword",	//该用户的密码有效性检查，别跨域调用
					type:"post",
					data:{
						AdmId:function() {return $("#loginForm input[name='AdmId']").val();},
						aPassword:function() {return $("#loginForm input[name='aPassword']").val();}
					},
				},
			},
		},
		// 错误信息提示
		messages:{
			AdmId:{
				required:"必须填写用户名",
				minlength:"用户名至少为3个字符",
				maxlength:"用户名至多为32个字符",
				remote: "用户名不存在",
			},
			aPassword:{
				required:"必须填写密码",
				minlength:"密码至少为3个字符",
				maxlength:"密码至多为32个字符",
				remote: "密码错误",
			},
		},

	});
	// 注册表单验证
	$("#registerForm").validate({
		rules:{
			AdmId:{
				required:true,
				minlength:3,
				maxlength:32,
				remote:{
					url:"",		//用户名重复检查，别跨域调用
					type:"post",
				},
			},
			aPassword:{
				required:true,
				minlength:3, 
				maxlength:32,
			},
			confirm_password:{
				required:true,
				minlength:3,
				equalTo:'.aPassword'
			},
		},
		// 错误信息提示
		messages:{
			AdmId:{
				required:"必须填写用户名",
				minlength:"用户名至少为3个字符",
				maxlength:"用户名至多为32个字符",
				remote: "用户名已存在",
			},
			aPassword:{
				required:"必须填写密码",
				minlength:"密码至少为3个字符",
				maxlength:"密码至多为32个字符",
			},
			confirm_password:{
				required: "请再次输入密码",
				minlength: "确认密码不能少于3个字符",
				equalTo: "两次输入密码不一致",//与另一个元素相同
			},
		},
	});
	
	// 参数{input类名，选择类型(单选or多选)}
	$(".rdolist").labelauty("rdolist", "rdo");
});

/**!
 * labelauty.js
 * 
 */
(function($){
	$.fn.labelauty=function(tag,tag2){
		rdochecked(tag);
		if(tag2=="rdo"){
			$(".rdobox").click(function(){
				$(this).prev().prop("checked","checked");
				rdochecked(tag);
			});
		}else{
			$(".chkbox").click(function(){
				if($(this).prev().prop("checked")==true){
					$(this).prev().removeAttr("checked");
				}
				else{$(this).prev().prop("checked","checked");}
				rdochecked(tag);
			});
		}
		function rdochecked(tag){
			$('.'+tag).each(function(i){
				var rdobox=$('.'+tag).eq(i).next();
				if($('.'+tag).eq(i).prop("checked")==false){
					rdobox.removeClass("checked");rdobox.addClass("unchecked");
					rdobox.find(".check-image").css("background","url(hoteldemo/img/login/input-unchecked.png)");
				}else{
					rdobox.removeClass("unchecked");
					rdobox.addClass("checked");
					rdobox.find(".check-image").css("background","url(hoteldemo/img/login/input-checked.png)");
				}});
		}
	}
}(jQuery));

/**!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

	'use strict';

	function classReg( className ) {
		return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
	}

	// classList support for class management
	// altho to be fair, the api sucks because it won't accept multiple classes at once
	var hasClass, addClass, removeClass;

	if ( 'classList' in document.documentElement ) {
		hasClass = function( elem, c ) {
			return elem.classList.contains( c );
		};
		addClass = function( elem, c ) {
			elem.classList.add( c );
		};
		removeClass = function( elem, c ) {
			elem.classList.remove( c );
		};
	}
	else {
		hasClass = function( elem, c ) {
			return classReg( c ).test( elem.className );
		};
		addClass = function( elem, c ) {
		if ( !hasClass( elem, c ) ) {
			elem.className = elem.className + ' ' + c;
		}
		};
		removeClass = function( elem, c ) {
			elem.className = elem.className.replace( classReg( c ), ' ' );
		};
	}

	function toggleClass( elem, c ) {
		var fn = hasClass( elem, c ) ? removeClass : addClass;
		fn( elem, c );
	}

	var classie = {
		// full names
		hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
		toggleClass: toggleClass,
		// short names
		has: hasClass,
		add: addClass,
		remove: removeClass,
		toggle: toggleClass
	};

	// transport
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( classie );
	} else {
		// browser global
		window.classie = classie;
	}
})( window );


/*!
 * notificationFx.js
 */
( function( window ) {
	
	'use strict';

	var docElem = window.document.documentElement,
		support = { animations : Modernizr.cssanimations },
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];
	
	/**
	 * extend obj function
	 */
	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	/**
	 * NotificationFx function
	 */
	function NotificationFx( options ) {	
		this.options = extend( {}, this.options );
		extend( this.options, options );
		this._init();
	}

	/**
	 * NotificationFx options
	 */
	NotificationFx.prototype.options = {
		// element to which the notification will be appended
		// defaults to the document.body
		wrapper : document.body,
		// the message
		message : 'yo!',
		// layout type: growl|attached|bar|other
		layout : 'growl',
		// effects for the specified layout:
		// for growl layout: scale|slide|genie|jelly
		// for attached layout: flip|bouncyflip
		// for other layout: boxspinner|cornerexpand|loadingcircle|thumbslider
		// ...
		effect : 'slide',
		// notice, warning, error, success
		// will add class ns-type-warning, ns-type-error or ns-type-success
		type : 'error',
		// if the user doesn´t close the notification then we remove it 
		// after the following time
		ttl : 6000,
		// callbacks
		onClose : function() { return false; },
		onOpen : function() { return false; }
	}

	/**
	 * init function
	 * initialize and cache some vars
	 */
	NotificationFx.prototype._init = function() {
		// create HTML structure
		this.ntf = document.createElement( 'div' );
		this.ntf.className = 'ns-box ns-' + this.options.layout + ' ns-effect-' + this.options.effect + ' ns-type-' + this.options.type;
		var strinner = '<div class="ns-box-inner">';
		strinner += this.options.message;
		strinner += '</div>';
		strinner += '<span class="ns-close"></span></div>';
		this.ntf.innerHTML = strinner;

		// append to body or the element specified in options.wrapper
		this.options.wrapper.insertBefore( this.ntf, this.options.wrapper.firstChild );

		// dismiss after [options.ttl]ms
		var self = this;
		this.dismissttl = setTimeout( function() {
			if( self.active ) {
				self.dismiss();
			}
		}, this.options.ttl );

		// init events
		this._initEvents();
	}

	/**
	 * init events
	 */
	NotificationFx.prototype._initEvents = function() {
		var self = this;
		// dismiss notification
		this.ntf.querySelector( '.ns-close' ).addEventListener( 'click', function() { self.dismiss(); } );
	}

	/**
	 * show the notification
	 */
	NotificationFx.prototype.show = function() {
		this.active = true;
		classie.remove( this.ntf, 'ns-hide' );
		classie.add( this.ntf, 'ns-show' );
		this.options.onOpen();
	}

	/**
	 * dismiss the notification
	 */
	NotificationFx.prototype.dismiss = function() {
		var self = this;
		this.active = false;
		clearTimeout( this.dismissttl );
		classie.remove( this.ntf, 'ns-show' );
		setTimeout( function() {
			classie.add( self.ntf, 'ns-hide' );
			
			// callback
			self.options.onClose();
		}, 25 );

		// after animation ends remove ntf from the DOM
		var onEndAnimationFn = function( ev ) {
			if( support.animations ) {
				if( ev.target !== self.ntf ) return false;
				this.removeEventListener( animEndEventName, onEndAnimationFn );
			}
			self.options.wrapper.removeChild( this );
		};

		if( support.animations ) {
			this.ntf.addEventListener( animEndEventName, onEndAnimationFn );
		}
		else {
			onEndAnimationFn();
		}
	}

	/**
	 * add to global namespace
	 */
	window.NotificationFx = NotificationFx;

} )( window );
