package com.hexincad.utils;

import java.util.List;

import com.hexincad.msgPost.HxMsg;
import com.hexincad.msgPost.ModelParams;
import com.hexincad.msgPost.Param;

public class HxMsgUtils {
	public static String createSendString(HxMsg msg){
		if(msg==null){
			return null;
		}
		
		StringBuffer sb=new StringBuffer();
		sb.append(msg.getCmd()).append(" ")    //cmd
		  .append(msg.getJobID()).append(" ");  //jobID
		
		ModelParams params=msg.getParams();
		sb.append(params.getId()).append(" ") ;  //id
		ModelParams mp=msg.getParams();   
		List<Param> plist=mp.getParams();
		int count =3;
		for(Param p:plist){
		   String[] values=	p.values;
		   for(String v:values){
			   sb.append(" ").append(v);   //params
			   count ++;
		   }
		}
		return count+" "+sb.toString();
	}

	


}
