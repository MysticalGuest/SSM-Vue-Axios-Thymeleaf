package com.distinguish.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.distinguish.dao.ApartmentDao;
import com.distinguish.entity.Apartment;
import com.distinguish.service.ApartmentService;

@Service
public class ApartmentServiceImpl implements ApartmentService {
	
	@Autowired
	private ApartmentDao apartmentDao;
	
	@Override
	public List<Apartment> getSpareApartment() {
		return apartmentDao.getSpareApartment();
	}

	@Override
	public List<Apartment> getAllApartment() {
		return apartmentDao.getAllApartment();
	}
	
	@Override
	public List<Apartment> searchApartment(Map<String,Object> map){
		return apartmentDao.searchApartment(map);
	}
	
	@Override
	public List<Integer> getPrice() {
		return apartmentDao.getPrice();
	}
	
	@Override
	public int checkIn(Apartment apartment) {
		return apartmentDao.checkIn(apartment);
	}
	
	@Override
	public int checkOut(Apartment apartment) {
		return apartmentDao.checkOut(apartment);
	}
	
	@Override
	public int allCheckOut() {
		return apartmentDao.allCheckOut();
	}
}
