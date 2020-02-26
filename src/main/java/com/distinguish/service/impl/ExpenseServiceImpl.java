package com.distinguish.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.distinguish.dao.ExpenseDao;
import com.distinguish.entity.Expense;
import com.distinguish.service.ExpenseService;

@Service
public class ExpenseServiceImpl implements ExpenseService {

	@Autowired
	private ExpenseDao expenseDao;
	
	@Override
	public List<Expense> getAllKinds() {
		return expenseDao.getAllKinds();
	}
	
	@Override
	public int getHourRoom() {
		return expenseDao.getHourRoom();
	}
	
	@Override
	public int updatePrice(Expense expense) {
		return expenseDao.updatePrice(expense);
	}
}
