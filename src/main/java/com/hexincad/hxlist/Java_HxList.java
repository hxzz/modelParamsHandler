package com.hexincad.hxlist;

import java.util.List;

import com.hexincad.msgPost.Param;

public class Java_HxList {

	private String id;
	private String [] subId;
	private String modelName;
	private List<Param> paramsList ;
	private String desc;
	private String path;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	
	public String getModelName() {
		return modelName;
	}
	public void setModelName(String modelName) {
		this.modelName = modelName;
	}
	
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public List<Param> getParamsList() {
		return paramsList;
	}
	public void setParamsList(List<Param> paramsList) {
		this.paramsList = paramsList;
	}
	public String [] getSubId() {
		return subId;
	}
	public void setSubId(String [] subId) {
		this.subId = subId;
	}
	
}
