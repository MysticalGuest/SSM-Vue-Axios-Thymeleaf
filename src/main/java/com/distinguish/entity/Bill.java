package com.distinguish.entity;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.persistence.Entity;

@Entity
public class Bill {
	
	private String roomNum;
	private String inTime;
	private String cName;
	private String mineral;
	private String pulsation;
	private String greenTea;
	private String tea;
	private String noodles;
	private String WLJJDB;
	private int chargeAndDeposit;
	private int refund;

	public Bill() {
		super();
	}
	
	public Bill(String roomNum, String inTime) {
		super();
		this.roomNum = roomNum;
		this.inTime = inTime;
	}

	public String getRoomNum() {
		return roomNum;
	}

	public void setRoomNum(String roomNum) {
		this.roomNum = roomNum;
	}

	public String getInTime() {
		return inTime;
	}

	public void setInTime(String inTime) {
		this.inTime = inTime;
	}

	public String getcName() {
		return cName;
	}

	public void setcName(String cName) {
		this.cName = cName;
	}

	public String getMineral() {
		return mineral;
	}

	public void setMineral(String mineral) {
		this.mineral = mineral;
	}

	public String getPulsation() {
		return pulsation;
	}

	public void setPulsation(String pulsation) {
		this.pulsation = pulsation;
	}

	public String getGreenTea() {
		return greenTea;
	}

	public void setGreenTea(String greenTea) {
		this.greenTea = greenTea;
	}

	public String getTea() {
		return tea;
	}

	public void setTea(String tea) {
		this.tea = tea;
	}

	public String getNoodles() {
		return noodles;
	}

	public void setNoodles(String noodles) {
		this.noodles = noodles;
	}

	public String getWLJJDB() {
		return WLJJDB;
	}

	public void setWLJJDB(String wLJJDB) {
		WLJJDB = wLJJDB;
	}

	public int getChargeAndDeposit() {
		return chargeAndDeposit;
	}

	public void setChargeAndDeposit(int chargeAndDeposit) {
		this.chargeAndDeposit = chargeAndDeposit;
	}

	public int getRefund() {
		return refund;
	}

	public void setRefund(int refund) {
		this.refund = refund;
	}

//	@Override
//	public String toString() {
//		return "Bill [roomNum=" + roomNum + ", inTime=" + inTime + ", cName=" + cName + ", mineral=" + mineral
//				+ ", pulsation=" + pulsation + ", greenTea=" + greenTea + ", tea=" + tea + ", noodles=" + noodles
//				+ ", WLJJDB=" + WLJJDB + ", chargeAndDeposit=" + chargeAndDeposit + ", refund=" + refund + "]";
//	}

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
		
		return "{\"roomNum\":\"" + roomNum + "\", \"inTime\":\"" + inDate + "\", \"cName\":\"" + cName + "\", \"mineral\":" + mineral
				+ ", \"pulsation\":" + pulsation + ", \"greenTea\":" + greenTea + ", \"tea\":" + tea + ", \"noodles\":" + noodles
				+ ", \"WLJJDB\":" + WLJJDB + ", \"chargeAndDeposit\":" + chargeAndDeposit + ", \"refund\":" + refund + "}";
	}

}

