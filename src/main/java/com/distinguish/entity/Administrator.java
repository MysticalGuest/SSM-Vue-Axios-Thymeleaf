package com.distinguish.entity;

public class Administrator {
	
	private String AdmId;
	private String aName;
	private String aPassword;
	private String aSex;
	private String limit;
	
	public Administrator() {
		super();
	}
	
	// 这个构造方法用于LoginController.java里的validateId方法
	public Administrator(String AdmId) {
		super();
		this.AdmId = AdmId;
	}
	
	// 这个构造方法用于LoginController.java里的validatePassword方法
	public Administrator(String AdmId, String aPassword) {
		super();
		this.AdmId = AdmId;
	}
	
	// 这个构造方法用于LoginController.java里的login方法
	public Administrator(String AdmId, String aPassword, String limit) {
		super();
		this.AdmId = AdmId;
		this.aPassword = aPassword;
		this.limit = limit;
	}

	public Administrator(String AdmId, String aName, String aPassword, String aSex, String limit) {
		super();
		this.AdmId = AdmId;
		this.aName = aName;
		this.aPassword = aPassword;
		this.aSex = aSex;
		this.limit = limit;
	}

	public String getAdmId() {
		return AdmId;
	}

	public void setAdmId(String AdmId) {
		this.AdmId = AdmId;
	}

	public String getaName() {
		return aName;
	}

	public void setaName(String aName) {
		this.aName = aName;
	}

	public String getaPassword() {
		return aPassword;
	}

	public void setaPassword(String aPassword) {
		this.aPassword = aPassword;
	}

	public String getaSex() {
		return aSex;
	}

	public void setaSex(String aSex) {
		this.aSex = aSex;
	}
	
	public String getlimit() {
		return limit;
	}

	public void setlimit(String limit) {
		this.limit = limit;
	}

//	@Override
//	public String toString() {
//		return "Administrators [AdmId=" + AdmId + ", aName=" + aName + ", aPassword=" + aPassword + ", aSex=" + aSex + ", limit="+limit+"]";
//	}
	
	@Override
	public String toString() {
		return "{\"AdmId\":\"" + AdmId + "\", \"aName\":\"" + aName + "\", \"aPassword\":\"" +
				aPassword + "\", \"aSex\":\"" + aSex + "\", \"limit\":\""+limit+"\"}";
	}

}

