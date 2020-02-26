package com.distinguish.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.distinguish.dao.CustomerDao;
import com.distinguish.entity.Customer;
import com.distinguish.service.CustomerService;

@Service
public class CustomerServiceImpl implements CustomerService {
	
	@Autowired
	private CustomerDao customerDao;
	
	@Override
	public List<Customer> getAllCustomers() {
		return customerDao.getAllCustomers();
	}
	
	@Override
	public List<Customer> conditionalSearch(Customer customer) {
		return customerDao.conditionalSearch(customer);
	}
	
	@Override
	public int insert(Customer customer) {
		return customerDao.insert(customer);
	}
	
	@Override
	public int getNumOfBillPerDay() {
		return customerDao.getNumOfBillPerDay();
	}
	
	@Override
	public int getNumOfBill() {
		return customerDao.getNumOfBill();
	}
	
	@Override
	public List<String> getNumOfRoomPerDay() {
		return customerDao.getNumOfRoomPerDay();
	}
	
	@Override
	public List<String> getNumOfRoom() {
		return customerDao.getNumOfRoom();
	}
	
	@Override
	public int getSumOfFeePerDay() {
		return customerDao.getSumOfFeePerDay();
	}
	
	@Override
	public int getSumOfFee() {
		return customerDao.getSumOfFee();
	}
	
	@Override
	public int getProfit(Customer customer) {
		return customerDao.getProfit(customer);
	}

}
