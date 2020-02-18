package com.distinguish.controller;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import com.distinguish.dao.AdministratorDao;
import com.distinguish.dao.BillDao;
import com.distinguish.entity.Administrator;
import com.distinguish.entity.Apartment;
import com.distinguish.entity.Bill;
import com.distinguish.entity.Customer;
import com.distinguish.entity.Expense;
import com.distinguish.service.ApartmentService;
import com.distinguish.service.BillService;
import com.distinguish.service.CustomerService;
import com.distinguish.service.ExpenseService;
import com.distinguish.custommethods.MyClass;

@Controller
@RequestMapping("front")
public class FrontController {
	
	private static final Logger LOG = Logger.getLogger(FrontController.class);
	
	@Autowired
	private ApartmentService apartmentService;
	
	@Autowired
	private BillService billService;
	
	@Autowired
	private CustomerService customerService;
	
	@Autowired
	private ExpenseService expenseService;
	
	// 前台主页面
	@RequestMapping(value = "HomeOfFront", method = RequestMethod.GET)
	public String HomeOfFront() {
		LOG.info("HomeOfFront...");
		return "HomeOfFront";
	}
	
	// 顾客信息统计
	@RequestMapping(value = "/GuestInfoForFront", method = RequestMethod.GET)
	public String GuestInfoForFront() {
		LOG.info("front/GuestInfoForFront...");
		return "GuestInfoForFront";
	}
	
	// 发票页面
	@RequestMapping(value = "/Bill", method = RequestMethod.GET)
	public String Bill(Model model) {
		LOG.info("front/Bill...");
		List<Apartment> apartmentList = apartmentService.getSpareApartment();
		model.addAttribute("apartmentList", apartmentList);
		int hourRoomPrice = expenseService.getHourRoom();
		model.addAttribute("hourRoomPrice", hourRoomPrice);
		return "Bill";
	}
	
	// 打印发票
	@RequestMapping(value = "/Bill", method = RequestMethod.POST)
	@ResponseBody
	public String PrintBill(HttpServletRequest request) {
		LOG.info("front/PrintBill...");
		Customer customer = new Customer();
		//获取当前时间
		Date date = new Date();
		SimpleDateFormat dateFormat= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String strDate=dateFormat.format(date);
		customer.setinTime(strDate);
		
		String room = request.getParameter("roomNum");
		System.out.println("room:"+room);
		customer.setroomNum(room);
		
		String cName = request.getParameter("cName");
		customer.setcName(cName);
		System.out.println("cName:"+cName);
		
		String cardID = request.getParameter("cardID");
		// 如果cardID里带有英文,比如最后一位为x,直接传到前台会出错,现将其处理一下
		if(cardID==""){
			cardID=null;
		}
		else{
			if(((cardID.charAt(cardID.length()-1)=='x')||(cardID.charAt(cardID.length()-1)=='X')))
				cardID="\""+cardID+"\"";
		}
		customer.setcardID(cardID);
		
		String paymentMethod = request.getParameter("paymentMethod");
		customer.setPaymentMethod(paymentMethod);
		System.out.println("paymentMethod:"+paymentMethod);
		
		String chargeAndDeposit = request.getParameter("chargeAndDeposit");
		int fee = Integer.parseInt(chargeAndDeposit);
		customer.setChargeAndDeposit(fee);
		System.out.println("fee:"+fee);
		
		String[] roomArray = room.split(","); // 用,分割
		for(String roomNum:roomArray){
			System.out.println("thisroom" + roomNum);
			
			// 对开出的房间进行开房处理
			LOG.info("CheckIn...");
			Apartment thisapartment = new Apartment();
			thisapartment.setroomNum(roomNum);
			apartmentService.checkIn(thisapartment);
			System.out.println(thisapartment);
		}
		System.out.println(customer);
		customerService.insert(customer);
		for(String roomNum:roomArray){
			//对每个开出的房间进行bill登记
			LOG.info("recordBill...");
			Bill bill = new Bill();
			bill.setRoomNum(roomNum);
			bill.setInTime(strDate);
			billService.insert(bill);
		}
		//房号树形下拉框
		List<Apartment> apartmentList = apartmentService.getSpareApartment();
		
		return apartmentList.toString();
	}

	// 客房管理
	@RequestMapping(value = "/ApartmentForFront", method=RequestMethod.GET)
	public String ApartmentForFront(Model model) {
		LOG.info("fornt/ApartmentForFront");
		List<Apartment> apartmentList = apartmentService.getAllApartment();
		model.addAttribute("apartmentList", apartmentList);
		System.out.println(apartmentList);
		List<Integer> priceList = apartmentService.getPrice();
		model.addAttribute("priceList", priceList);
		System.out.println("price"+priceList);
		return "ApartmentForFront";
	}
	
	// 账目管理界面
	@RequestMapping(value = "/AccountDay", method = RequestMethod.GET)
	public String AccountDay(Model model) throws ParseException{
		LOG.info("front/AccountDay...");
		//开出的发票数量
		int numOfBill = customerService.getNumOfBillPerDay();
		System.out.println("numOfBill:"+numOfBill+"张");
		model.addAttribute("numOfBill", numOfBill);
		int numOfRoom;
		int SumOfFee;
		int profit;
		//如果开出的房间为空，SumOfFee = customerServiceimpl.getSumOfFeePerDay()会出错
		//select语句返回为空,'空'并不是int型
		if(numOfBill==0){
			numOfRoom=0;
			SumOfFee=0;
			profit=0;
		}
		else{
			//开出的房间数量
			List<String> roomList = customerService.getNumOfRoomPerDay();
			System.out.println("roomList:"+roomList);
			String roomString=roomList.toString();
			String[] roomArray = roomString.split(","); // 用,分割
			numOfRoom=roomArray.length;
			//截止目前的营业额
			SumOfFee = customerService.getSumOfFeePerDay();
			//截止目前的净营业额
			Customer allRoomPerDay = new Customer();
			roomString=roomString.replace("[", "(");//替换前roomString是[6012,6011, 6016,8014,8023, 6008,8012]
			roomString=roomString.replace("]", ")");//数据库读不出[]所以()替换
			allRoomPerDay.setroomNum(roomString);
			System.out.println("allRoomPerDay:"+allRoomPerDay.getroomNum());
			profit = customerService.getProfit(allRoomPerDay);
		}
		
		System.out.println("numOfRoom:"+numOfRoom+"间");
		model.addAttribute("numOfRoom", numOfRoom);
		
		System.out.println("SumOfFee:"+SumOfFee+"元");
		model.addAttribute("ChargeAndDeposit", SumOfFee);
		
		System.out.println("profit:"+profit+"元");
		model.addAttribute("profit", profit);
		//押金
		int deposit = SumOfFee-profit;
		System.out.println("deposit:"+deposit+"元");
		model.addAttribute("deposit", deposit);
		//其他消费
		//其他消费单价列表
		List<Expense> expenseList = expenseService.getAllKinds();
		Map<String, Integer> priceList = new HashMap<String, Integer>();
		for (int i = 0; i < expenseList.size(); i++){
			//一下获得方法获得的都是价格
			priceList.put(expenseList.get(i).getKinds(), expenseList.get(i).getPrice());
		}
		
		//其他消费数量列表
		Map<String, Integer> sumList = billService.getPerKindsTotalPerDay();
		System.out.println("sumList:"+sumList);
		
		int total = MyClass.getExpenseTotalConsumption(sumList, priceList);
		System.out.println("total:"+total+"元");
		model.addAttribute("total", total);
		
		//算账每个客人的房费
		List<Map<String, Object>> roomChargeList = billService.getRoomChargePerCustomerPerDay();
		System.out.println("roomChargeList:"+roomChargeList);
		//将数据转为JSON格式,易于获取
		JSONObject jsonCharge = new JSONObject();
		for(int i=0;i<roomChargeList.size();i++){
			String timeString = String.valueOf(roomChargeList.get(i).get("inTime"));
			System.out.println("timeString:"+timeString);
			jsonCharge.put(MyClass.zoneToLocalTime(timeString), roomChargeList.get(i).get("sumPrice"));
		}
		System.out.println("jsonCharge:"+jsonCharge);
		
		//表格billList
		List<Bill> billList = billService.getBillPerDay();

		MyClass.mergenceOfTotalConsumptionPerCustomer(billList,priceList,jsonCharge);
		model.addAttribute("billList", billList);
		System.out.println("billList:"+billList);
		
		return "AccountDay";
	}
	
	// 账目统计界面
	@RequestMapping(value="/Statistics",method = RequestMethod.GET)
	public String Statistics(RedirectAttributes redirectAttributes) {
		LOG.info("front/Statistics...");
		// 定向到CommonOperationController层,重定向传参
		redirectAttributes.addFlashAttribute("flag", "front");
		return "redirect:../commonOperation/Statistics";
	}
}
