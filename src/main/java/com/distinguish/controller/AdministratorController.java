package com.distinguish.controller;

import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.alibaba.fastjson.JSONObject;
import com.distinguish.controller.AdministratorController;
import com.distinguish.custommethods.MyClass;
import com.distinguish.entity.Apartment;
import com.distinguish.entity.Bill;
import com.distinguish.entity.Customer;
import com.distinguish.entity.Expense;
import com.distinguish.service.ApartmentService;
import com.distinguish.service.BillService;
import com.distinguish.service.CustomerService;
import com.distinguish.service.ExpenseService;

@Controller
@RequestMapping("administrator")
public class AdministratorController {
	private static final Logger LOG = Logger.getLogger(AdministratorController.class);
	
	@Autowired
	private ApartmentService apartmentService;
	
	@Autowired
	private BillService billService;
	
	@Autowired
	private CustomerService customerService;
	
	@Autowired
	private ExpenseService expenseService;
	
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
	
	// 客房信息管理界面,url顾客信息
	@RequestMapping(value = "/IntegratedInfo")
	@ResponseBody
	public String IntegratedInfo(Model model) {
		LOG.info("administrator/IntegratedInfo...");
		// 钟点房价格
		int hourRoomPrice = expenseService.getHourRoom();
		model.addAttribute("hourRoomPrice", hourRoomPrice);
		
		// expense表格数据
		List<Expense> expenseList = expenseService.getAllKinds();
		model.addAttribute("expenseList", expenseList);
		
		// 将钟点房加入数据
		Expense expense = new Expense("hourRoomPrice", "钟点房", hourRoomPrice);
		expenseList.add(expense);
		
		return expenseList.toString();
	}
	
	// 综合管理界面,编辑其他消费的价格
	@RequestMapping(value = "/ResetExpense", method = RequestMethod.POST)
	@ResponseBody
	public String ResetExpense(HttpServletRequest request) {
		LOG.info("administrator/ResetExpense...");
		String kind = request.getParameter("kind");
		
		String price = request.getParameter("price");
		int aprice = Integer.parseInt(price);
		
		Expense expense = new Expense(kind, aprice);
		expenseService.updatePrice(expense);
		
		return null;
	}
	
	// 客房管理界面
	@RequestMapping(value = "/ApartmentForAdm", method = RequestMethod.GET)
	public String ApartmentManageAdm(Model model) {
		LOG.info("administrator/ApartmentForAdm...");
		List<Apartment> apartmentList = apartmentService.getAllApartment();
		model.addAttribute("apartmentList", apartmentList);
		
		List<Integer> priceList = apartmentService.getPrice();
		model.addAttribute("priceList", priceList);
		
		return "ApartmentForAdm";
	}

	// 账目管理界面
	@RequestMapping(value = "/Account", method = RequestMethod.GET)
	public String Account(Model model) throws ParseException{
		LOG.info("administrator/AccountDay...");
		/***********************
		 	***===页面的统计数据===**
		 	***********************/
		// 开出的发票数量
		int numOfBill = customerService.getNumOfBill();
		model.addAttribute("numOfBill", numOfBill);
		int numOfRoom;
		int SumOfFee;
		int profit;
		// 如果开出的房间为空，SumOfFee = customerServiceimpl.getSumOfFeePerDay()会出错
		// select语句返回为空,'空'并不是int型
		if(numOfBill==0){
			numOfRoom=0;
			SumOfFee=0;
			profit=0;
		}
		else{
			// 开出的房间数量
			List<String> roomList = customerService.getNumOfRoom();
			String roomString=roomList.toString();
			String[] roomArray = roomString.split(","); // 用,分割
			numOfRoom=roomArray.length;
			// 截止目前的营业额
			SumOfFee = customerService.getSumOfFee();
			// 截止目前的净营业额
			Customer allRoomPerDay = new Customer();
			// 替换前roomString是[6012,6011, 6016,8014,8023, 6008,8012]
			// 数据库读不出[]所以()替换
			roomString=roomString.replace("[", "(");
			roomString=roomString.replace("]", ")");
			allRoomPerDay.setroomNum(roomString);
			profit = customerService.getProfit(allRoomPerDay);
		}
		
		model.addAttribute("numOfRoom", numOfRoom);
		
		model.addAttribute("ChargeAndDeposit", SumOfFee);
		
		model.addAttribute("profit", profit);
		// 押金
		int deposit = SumOfFee-profit;
		model.addAttribute("deposit", deposit);
		// 其他消费
		// 其他消费单价列表
		List<Expense> expenseList = expenseService.getAllKinds();
		Map<String, Integer> priceList = new HashMap<String, Integer>();
		for (int i = 0; i < expenseList.size(); i++){
			//一下获得方法获得的都是价格
			priceList.put(expenseList.get(i).getKinds(), expenseList.get(i).getPrice());
		}
		
		//其他消费数量列表
		Map<String, Integer> sumList = billService.getPerKindsTotal();
		
		int total = MyClass.getExpenseTotalConsumption(sumList, priceList);
		model.addAttribute("total", total);
		/***********************
			***===页面的统计数据===结束**
			***********************/
		
		/***********************
			***===表格数据===**
			***********************/
		//算账每个客人的房费
		List<Map<String, Object>> roomChargeList = billService.getRoomChargePerCustomer();
		// 将数据转为JSON格式,易于获取
		JSONObject jsonCharge = new JSONObject();
		for(int i=0;i<roomChargeList.size();i++){
			String timeString = String.valueOf(roomChargeList.get(i).get("inTime"));
			jsonCharge.put(MyClass.zoneToLocalTime(timeString), roomChargeList.get(i).get("sumPrice"));
		}
		
		// 表格billList
		List<Bill> billList = billService.getBill();

		MyClass.mergenceOfTotalConsumptionPerCustomer(billList,priceList,jsonCharge);
		model.addAttribute("billList", billList);
		
		/***********************
			***===页面的统计数据===结束**
			***********************/
		
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
