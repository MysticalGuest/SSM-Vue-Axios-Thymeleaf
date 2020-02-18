package com.distinguish.service;

import java.util.List;

import com.distinguish.entity.Administrator;

public interface AdministratorService {
	
	/**
	 * 获得全部管理员
	 * 
	 * @param
	 * @return
	 */
	
	List<Administrator> getAllAdministrators();
	
	Administrator login(Administrator administrator);
	
	Administrator validateId(Administrator administrator);

}
