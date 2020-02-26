package com.distinguish.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.distinguish.entity.Administrator;
import com.distinguish.service.AdministratorService;

import org.apache.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("")
public class LoginController {

	private static final Logger LOG = Logger.getLogger(LoginController.class);
	
	@Autowired
	private AdministratorService administratorService;
	
	// 登录
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String login() {
		LOG.info("login...");
		return "login";
	}
	
	// 登录页面
	@RequestMapping(value = "/login",method = RequestMethod.POST)
	public String login(@RequestParam("AdmId")String AdmId,@RequestParam("aPassword")String aPassword,
			HttpServletRequest req,HttpSession session,RedirectAttributes redirectAttributes,Model model) {
		String limit = req.getParameter("rdo");
		System.out.println("AdmId: "+AdmId);
		System.out.println("aPassword: "+aPassword);
		System.out.println("limit: "+limit);
		Administrator administrator = new Administrator(AdmId, aPassword, limit);
		Administrator loginor = administratorService.login(administrator);
		System.out.println("loginor:"+loginor);
		if (loginor != null && limit.equals("front")) {
			session.setAttribute("loginor", loginor);
			System.out.println("frontInterface...");
			return "redirect:front/HomeOfFront";
		}
		else if(loginor != null && limit.equals("administrator")) {
			session.setAttribute("loginor", loginor);
			System.out.println("administratorInterface...");
			return "redirect:administrator/HomeOfAdm";
		}
		else{
			return "redirect:login";
		}
	}
	
	// 用户名验证
	@RequestMapping(value = "/validateId",method = RequestMethod.POST)
	@ResponseBody
	public Boolean validateId(HttpServletRequest req) {
		LOG.info("validateId...");
		String AdmId = req.getParameter("AdmId");
		System.out.println("AdmId: "+AdmId);
		Administrator administrator = new Administrator(AdmId);
		if( administratorService.validateId(administrator) == null ) { // 用户名不存在
			return false;
		}
		return true;
	}
	
	// 用户名密码验证
	@RequestMapping(value = "/validatePassword",method = RequestMethod.POST)
	@ResponseBody
	public Boolean validatePassword(HttpServletRequest req) {
		LOG.info("validatePassword...");
		String AdmId = req.getParameter("AdmId");
		System.out.println("AdmId: "+AdmId);
		String aPassword = req.getParameter("aPassword");
		System.out.println("aPassword: "+aPassword);
		Administrator administrator = new Administrator(AdmId,aPassword,"");
		if( administratorService.login(administrator) == null ) { // 密码错误
			return false;
		}
		return true;
	}
	
	// 权限验证
	@RequestMapping(value = "/validateLimit",method = RequestMethod.POST)
	@ResponseBody
	public Boolean validateLimit(HttpServletRequest req) {
		LOG.info("validateLimit...");
		String AdmId = req.getParameter("AdmId");
		System.out.println("AdmId: "+AdmId);
		String aPassword = req.getParameter("aPassword");
		System.out.println("aPassword: "+aPassword);
		String limit = req.getParameter("limit");
		Administrator administrator = new Administrator(AdmId,aPassword,limit);
		if( administratorService.login(administrator) == null ) { // 权限错误
			return false;
		}
		return true;
	}
	
	// 注册
	@RequestMapping(value = "/register", method = RequestMethod.GET)
	public String register() {
		LOG.info("register...");
		return "register";
	}
	
	// 退出
	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	public String logout() {
		LOG.info("logout...");
		return "login";
	}
}
