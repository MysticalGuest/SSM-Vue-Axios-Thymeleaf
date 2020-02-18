package com.distinguish.dao;

import java.util.List;

import com.distinguish.entity.Customer;

public interface CustomerDao {
	
	List<Customer> getAllCustomers();
	
	List<Customer> conditionalSearch(Customer customer);
	
	int insert(Customer customer);
	
	int getNumOfBillPerDay();
	
	List<String> getNumOfRoomPerDay();
	
	int getSumOfFeePerDay();
	
	int getProfit(Customer customer);

}
