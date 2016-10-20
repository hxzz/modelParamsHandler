package com.hexincad.msgPost;

public class ServerStatus {
	private String address;
	private Integer port;
	private Boolean isBusy;
	
	public ServerStatus(){};
	public ServerStatus(String address,Integer port,Boolean isBusy){
		this.address=address;
		this.port=port;
		this.isBusy=isBusy;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public Integer getPort() {
		return port;
	}
	public void setPort(Integer port) {
		this.port = port;
	}
	public Boolean isBusy() {
		return isBusy;
	}
	public void setBusy(Boolean isBusy) {
		this.isBusy = isBusy;
	}

}
