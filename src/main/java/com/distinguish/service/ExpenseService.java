package com.distinguish.service;

import java.util.List;

import com.distinguish.entity.Expense;

public interface ExpenseService {
	
	List<Expense> getAllKinds();

	int getHourRoom();
}
