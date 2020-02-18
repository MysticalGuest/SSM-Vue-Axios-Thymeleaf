package com.distinguish.service;

import java.util.List;
import java.util.Map;

import com.distinguish.entity.Apartment;

public interface ApartmentService {

	List<Apartment> getAllApartment();
	
	List<Apartment> getSpareApartment();
	
	List<Apartment> searchApartment(Map<String,Object> map);
	
	List<Integer> getPrice();
	
	int checkIn(Apartment apartment);
	
	int checkOut(Apartment apartment);
	
	int allCheckOut();
}
