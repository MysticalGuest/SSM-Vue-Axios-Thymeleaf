package com.distinguish.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.distinguish.dao.AdministratorDao;
import com.distinguish.entity.Administrator;
import com.distinguish.service.AdministratorService;

@Service
public class AdministratorServiceImpl implements AdministratorService{
	
	// 注入Service依赖
	@Autowired
	private AdministratorDao administratorDao;
	
	@Override
	public List<Administrator> getAllAdministrators(){
		return administratorDao.getAllAdministrators();
	}
	
	@Override
	public Administrator login(Administrator administrator){
		return administratorDao.login(administrator);
	}
	
	@Override
	public Administrator validateId(Administrator administrator) {
		return administratorDao.validateId(administrator);
	}

}