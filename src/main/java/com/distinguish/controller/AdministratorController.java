package com.distinguish.controller;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.distinguish.controller.AdministratorController;

@Controller
@RequestMapping("administrator")
public class AdministratorController {
	private static final Logger LOG = Logger.getLogger(AdministratorController.class);
	
	// 经理主页面
	@RequestMapping(value = "HomeOfAdm", method = RequestMethod.GET)
	public String HomeOfFront(HttpSession session) {
		LOG.info("HomeOfAdm...");
		session.getAttribute("thisAdministrator");
		return "HomeOfAdm";
	}
	
	// 顾客信息统计
	@RequestMapping(value = "/GuestInfoForAdm", method = RequestMethod.GET)
	public String GuestInfoForFront() {
		LOG.info("administrator/GuestInfoForAdm...");
		return "GuestInfoForAdm";
	}
	
	// 综合管理
	@RequestMapping(value = "/IntegratedManagement", method = RequestMethod.GET)
	public String IntegratedManagement() {
		LOG.info("administrator/IntegratedManagement...");
		return "IntegratedManagement";
	}
	
	// 客房管理界面
	@RequestMapping(value = "/ApartmentForAdm", method = RequestMethod.GET)
	public String ApartmentManageAdm(HttpSession session) {
		LOG.info("administrator/ApartmentForAdm...");
		return "ApartmentForAdm";
	}
	
	// 客房管理界面
	@RequestMapping(value = "/Account", method = RequestMethod.GET)
	public String Account() {
		LOG.info("administrator/Account...");
		return "Account";
	}
	
	// 账目统计界面
	@RequestMapping(value = "/Statistics", method = RequestMethod.GET)
	public String Statistics(RedirectAttributes redirectAttributes) {
		LOG.info("administrator/Statistics...");
		// 定向到CommonOperationController层,重定向传参
		redirectAttributes.addFlashAttribute("flag", "adm");
		return "redirect:../commonOperation/Statistics";
	}

}
