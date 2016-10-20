package com.hexincad.hxlist;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import com.hexincad.msgPost.Param;
import com.hexincad.utils.StringUtils;

public class HxListHandler{

	public static List<Java_HxList> makeHxList(List<String> fileList) throws IOException, Exception{
		if(fileList!=null&&fileList.size()>0){
			List<Java_HxList> list=new LinkedList<Java_HxList>();
			for(String path:fileList){
				if(StringUtils.isEmpty(path)){
					continue;
				}
				HxListHandler.makeHxList(path,list);
			}
			return list;
		}
		return null;
	}
	
	public static List<Java_HxList>  makeHxList(String path) throws IOException, Exception{
		List<Java_HxList> list=new LinkedList<Java_HxList>();
		HxListHandler.makeHxList(path,list);
		return list;
	}
	
	public static void  makeHxList(String path,List<Java_HxList> list) throws IOException,Exception {
		File f=new File(path);
		if(!f.exists()){
			throw new Exception("找不到文件： "+f.getPath());
		}
		BufferedReader reader = new BufferedReader(  
			    new InputStreamReader(new FileInputStream(f),"GBK"));  
		
		String str=null;
		
		final String startStr="{";
		final String endStr="}";
		int rowCount=0;
		int rowNumber=0;
		Java_HxList hxlist=null;
		while((str=reader.readLine())!=null){
			rowNumber++;
			if(StringUtils.isEmpty(str)){
				if(rowCount!=0&&rowCount!=8){					
					rowCount++;
				}
				continue;
			}
			str=new String(str.getBytes(),"UTF8");
			if(str.equals(startStr)){
				if(rowCount==0||rowCount==8){					
					rowCount=1;
				}else {
					reader.close();
					throw new Exception("第"+rowNumber+"行错误，参数记录结束异常，缺少结束符号“}”");
				}
				hxlist=new Java_HxList();
				continue;
			}else if(str.equals(endStr)){
				rowCount++;
				if(rowCount==8){
					list.add(hxlist);
				}else{
					reader.close();
					throw new Exception("第"+rowNumber+"行错误，参数记录结束异常，缺少或多出行数！");
				}
				continue;
			}
			if(hxlist!=null){
				switch(rowCount){
					case 1:	if(StringUtils.isEmpty(str)){
								reader.close();
								throw new Exception("第"+rowNumber+"行错误，模型主id号不能为空!");
							}else if(!StringUtils.isNumberString(str, 9, 9)){
								reader.close();
								throw new Exception("第"+rowNumber+"行错误，模型主id号必须是由9位0-9的数字组成的纯数字字符串！");
							}
							hxlist.setId(str.trim());
							rowCount++;
							break;
					case 2:	if(!StringUtils.isEmpty(str)){
								String[] subIds=str.split(" ");
								for(int i=0;i<subIds.length;i++){
									if(hxlist.getId().equals(subIds[i])){
										reader.close();
										throw new Exception("第"+rowNumber+"行错误，子id和主id相等!");
									}
									if(!StringUtils.isNumberString(subIds[i], 9, 9)){
										reader.close();
										throw new Exception("第"+rowNumber+"行错误，模型子id号必须是由9位0-9的数字组成的纯数字字符串！");
									}
								}
								
								hxlist.setSubId(subIds);
							}
							rowCount++;
							break;
					case 3:	if(!StringUtils.isEmpty(str)){
								hxlist.setModelName(str.trim());
							}
							rowCount++;
							break;
					case 4:	if(StringUtils.isEmpty(str)){
								rowCount++;
								break;
							}
							String [] array=str.trim().split(" ");
							if(array!=null&&array.length!=0){
								List<Param> paramsList=new ArrayList<Param>();
								for(String s:array){
									String [] ar=s.split(":");
									if(ar.length<3){ 
										reader.close();
										throw new Exception("第"+rowNumber+"行错误，参数格式错误!");
									}
									if(StringUtils.isEmpty(ar[0])||StringUtils.isEmpty(ar[1])||StringUtils.isEmpty(ar[2])){
										reader.close();
										throw new Exception("第"+rowNumber+"行错误，参数格式错误!");
									}
									String type=ar[0].trim();
									for(int k=2;k<ar.length;k++){
										if(!(("+d".equals(type)&&StringUtils.isPositiveNumber(ar[k]))
											||("-d".equals(type)&&StringUtils.isNegetiveNumber(ar[k]))
											||("d".equals(type)&&StringUtils.isNumber(ar[k]))
											||("s".equals(type))
											||("m".equals(type)))){
												reader.close();
												throw new Exception("第"+rowNumber+"行错误，参数类型与参数的值不匹配!");
										}
									}
									Param p=new Param(ar[1].trim(),type,Arrays.copyOfRange(ar, 2, ar.length));
									paramsList.add(p);
									hxlist.setParamsList(paramsList);
	
								}
									
							}
							rowCount++;
							break;
					  case 5:if(StringUtils.isEmpty(str)){
						  		hxlist.setDesc(str.trim());
					  		}
					  		rowCount++;
					  		break;
					  case 6:if(StringUtils.isEmpty(str)){
					  		hxlist.setDesc(str.trim());
				  			}
					  		rowCount++;
					  		break;
					 default:break;
					}
				
			}else{
				reader.close();
				throw new Exception("第"+rowNumber+"行错误，没有检测到模型记录开始标志！");
			}
		}
		reader.close();
		if(rowCount!=8&&rowCount!=0){
			list=null;
			throw new Exception("第"+rowNumber+"行错误，文件格式错误，缺少结束符");
		}
		
	}
	
	public static String makeMsgFormHxlist(Java_HxList list){
		String s="";
		int count=2;
		s+=list.getId() ;
		String[] subids=list.getSubId();
		for(String ss:subids){
			s+=" "+ss;
		}
		String name=list.getModelName();
		if(!StringUtils.isEmpty(name)){
			s+=" "+name;
			count++;
		}
		List<Param> plist=list.getParamsList();
		if(plist!=null&&plist.size()>0){
			for(Param p:plist){
				String[] ps=p.values;
				for(String v:ps){
					if(!StringUtils.isEmpty(v)){
						s+=" "+v;
						count++;
					}
				}
			}
		}
		
		String path=list.getPath();
		if(!StringUtils.isEmpty(path)){
			s+=" "+path;
			count++;
		}
		return count+s;
	}
	
	
	public static void main(String[] args) throws Exception {
		System.out.println(7-'a');
		
		List<Java_HxList> list=HxListHandler.makeHxList("/home/mzl/workspace/test/src/com/hxzz/hxList/BMod.HXLIST");
		
		StringBuffer s=new StringBuffer();
		s.append("hxlist:[");
		for(Java_HxList hxlist:list){
			s.append("{\n\"id\":\"").append(hxlist.getId()).append("\",\n");
			s.append("\"subId\":[");
			String [] subIds=hxlist.getSubId();
			if(subIds!=null&&subIds.length>0){
				for(String subId:subIds){
					s.append("\""+subId+"\",");
				}
			    s.substring(0,s.length()-2);
			}
			
			s.append("],\n");
			s.append("\"modelName\":\"").append(hxlist.getModelName()).append("\",");
		    List<Param> pList=hxlist.getParamsList();
		    s.append("\"params\":[\n");
		    if(pList!=null&&pList.size()>0){
		    	for(Param p:pList){		    	
			    	s.append("{").append("\"name\":\"").append(p.name+"\",\n");
			    	s.append("\"type\":\"").append(p.type+"\",\n");
			    	String[] values=p.values;
			    	s.append("\"values\":[\n");
			    	if(values!=null&&values.length>0){
			    		for(String v:values){
			    			s.append(v+",");
			    		}
			    		s.substring(0, s.length()-2);
			    	}
			    	s.append("]\n},\n");
			    }
		    	s.substring(0,s.length()-2);
		    }
		    s.append("],\n");
		    s.append("\"des\":\"").append(hxlist.getDesc()+"\",\n");
		    s.append("\"path\":\"").append(hxlist.getPath()+"\"\n");
		    s.append("},\n");
		}
		if(s.charAt(s.length()-1)==','){
			s.substring(0, s.length()-2);
		}
		s.append("]");
		System.out.println(s.toString());
	}
}
