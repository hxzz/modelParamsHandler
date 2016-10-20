package com.hexincad.msgPost;

import java.util.List;

import com.hexincad.utils.StringUtils;

public class Java_HxzzMsg {
	
	private String msgString;
	private List<String> indexList;
	private List<String>  valuesList;
	

	public List<String> getIndexList() {
		return indexList;
	}

	public void setIndexList(List<String> indexList) {
		this.indexList = indexList;
	}

	public List<String> getValuesList() {
		return valuesList;
	}

	public void setValuesList(List<String> valuesList) {
		this.valuesList = valuesList;
	}

	public String getMsgString() {
		return this.msgString;
	}

	public void setMsgString(String msgString) {
		this.msgString = msgString;
	}
	
	public Java_HxzzMsg(String msgString){
		this.msgString=msgString;
	}
	
	public String makeMsgString(){
		if(valuesList!=null&&valuesList.size()>0){
			String msgString=valuesList.size()+1+" ";
				for(String s:valuesList){
					 if(!StringUtils.isEmpty(s)){					 
						 s=s.trim();
						 s=s.replace("\\", "\\\\");
						 s=s.replace(" ", "\\ ");
						 msgString+=s+" ";
				}else{
						System.out.println("参数中存在空值！");
						return null;
				}
			}
				return " "+msgString.trim();
		}
		System.out.println("参数列表为空！");
		return null;
	}
	
	public Java_HxzzMsg(){}

	
}
