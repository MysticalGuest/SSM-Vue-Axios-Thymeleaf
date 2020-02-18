package com.distinguish.dao;

import java.util.List;
import java.util.Map;

import com.distinguish.entity.Bill;

public interface BillDao {

	int insert(Bill bill);
	
	Map<String, Integer> getPerKindsTotalPerDay();
	
	List<Map<String, Object>> getRoomChargePerCustomerPerDay();
	
	List<Map<String, Integer>> getTurnoverPerDayThisWeek();
	
	List<Map<String, Integer>> getTurnoverPerDayLastWeek();
	
	List<Map<String, Integer>> getTurnoverPerWeekLastMonth();
	
	List<Map<String, Integer>> getTurnoverPerWeekThisMonth();
	
	List<Map<String, Integer>> getTurnoverPerQuarterThisYear();
	
	List<Map<String, Integer>> getTurnoverTheseYears();
	
	List<Bill> getBillPerDay();
	
}
