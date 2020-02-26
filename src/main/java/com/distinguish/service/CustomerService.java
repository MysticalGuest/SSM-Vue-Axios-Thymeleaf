package com.distinguish.service;

import java.util.List;

import com.distinguish.entity.Customer;

public interface CustomerService {
	
	List<Customer> getAllCustomers();
	
	List<Customer> conditionalSearch(Customer customer);
	
	int insert(Customer customer);
	
	int getNumOfBillPerDay();
	
	int getNumOfBill();
	
	List<String> getNumOfRoomPerDay();
	
	List<String> getNumOfRoom();
	
	int getSumOfFeePerDay();
	
	int getSumOfFee();
	
	int getProfit(Customer customer);

}
