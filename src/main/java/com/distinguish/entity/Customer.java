package com.distinguish.entity;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Customer {

	private String inTime;
	
	private String cName;
	
	private String cardID;
	
	private String roomNum;
	
	private int chargeAndDeposit;
	
	private String paymentMethod;

	public Customer() {
		super();
	}

	public Customer(String inTime,String cName, String cardID, String roomNum,int chargeAndDeposit,String paymentMethod) {
		super();
		this.inTime = inTime;
		this.cName = cName;
		this.cardID = cardID;
		this.roomNum = roomNum;
		this.chargeAndDeposit=chargeAndDeposit;
		this.paymentMethod=paymentMethod;
	}

	public String getinTime() {
		return inTime;
	}

	public void setinTime(String inTime) {
		this.inTime = inTime;
	}

	public String getcName() {
		return cName;
	}

	public void setcName(String cName) {
		this.cName = cName;
	}

	public String getcardID() {
		return cardID;
	}

	public void setcardID(String cardID) {
		this.cardID = cardID;
	}
	
	public String getroomNum() {
		return roomNum;
	}

	public void setroomNum(String roomNum) {
		this.roomNum = roomNum;
	}
	
	public int getChargeAndDeposit() {
		return chargeAndDeposit;
	}

	public void setChargeAndDeposit(int chargeAndDeposit) {
		this.chargeAndDeposit = chargeAndDeposit;
	}
	
	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	
	//我重写了toString()方法,为了将从数据库拿出的数据直接格式化为JSON格式,可以直接传到前台
	@Override
	public String toString() {
		//解决时间.0问题
		SimpleDateFormat myFmt=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = null;
		try {
			date = myFmt.parse(inTime);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		String inDate = myFmt.format(date);
		
		return "{\"inTime\":\""+inDate+"\",\"cName\":\""+cName+
				"\",\"cardID\":"+cardID+ ",\"roomNum\":\""+
				roomNum+"\",\"chargeAndDeposit\":"+chargeAndDeposit+",\"paymentMethod\":\""+paymentMethod+"\"}";
	}

}

