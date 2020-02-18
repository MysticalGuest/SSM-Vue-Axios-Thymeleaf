package com.distinguish.dao;

import java.util.List;

import com.distinguish.entity.Administrator;;

public interface AdministratorDao {
	
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
