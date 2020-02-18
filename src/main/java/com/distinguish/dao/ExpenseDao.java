package com.distinguish.dao;

import java.util.List;

import com.distinguish.entity.Expense;

public interface ExpenseDao {
	
	//为了可以修改钟点房价格,我用expense表存了一个钟点房价格,所以查询其他商品时,我将钟点房除去
	List<Expense> getAllKinds();
	
	//我用expense表存了一个钟点房价格,查询钟点房
	int getHourRoom();

}
