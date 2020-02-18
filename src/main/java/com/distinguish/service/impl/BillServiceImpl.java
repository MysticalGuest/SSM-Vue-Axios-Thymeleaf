package com.distinguish.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.distinguish.dao.BillDao;
import com.distinguish.entity.Bill;
import com.distinguish.service.BillService;

@Service
public class BillServiceImpl implements BillService {
	
	@Autowired
	private BillDao billDao;
	
	@Override
	public Map<String, Integer> getPerKindsTotalPerDay() {
		return billDao.getPerKindsTotalPerDay();
	}
	
	@Override
	public List<Map<String, Object>> getRoomChargePerCustomerPerDay() {
		return billDao.getRoomChargePerCustomerPerDay();
	}
	
	@Override
	public List<Map<String, Integer>> getTurnoverPerDayThisWeek() {
		return billDao.getTurnoverPerDayThisWeek();
	}
	
	@Override
	public List<Map<String, Integer>> getTurnoverPerDayLastWeek() {
		return billDao.getTurnoverPerDayLastWeek();
	}
	
	@Override
	public List<Map<String, Integer>> getTurnoverPerWeekLastMonth() {
		return billDao.getTurnoverPerWeekLastMonth();
	}
	
	@Override
	public List<Map<String, Integer>> getTurnoverPerWeekThisMonth() {
		return billDao.getTurnoverPerWeekThisMonth();
	}
	
	@Override
	public List<Map<String, Integer>> getTurnoverPerQuarterThisYear() {
		return billDao.getTurnoverPerQuarterThisYear();
	}
	
	@Override
	public List<Map<String, Integer>> getTurnoverTheseYears() {
		return billDao.getTurnoverTheseYears();
	}

	@Override
	public int insert(Bill bill) {
		return billDao.insert(bill);
	}
	
	@Override
	public List<Bill> getBillPerDay() {
		return billDao.getBillPerDay();
	}
}
