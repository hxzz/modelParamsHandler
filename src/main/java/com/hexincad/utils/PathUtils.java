package com.hexincad.utils;

import javax.servlet.http.HttpServletRequest;

public class PathUtils {
	public static String getResourcesPath(HttpServletRequest request,String fromProjectRootPath){
		if(request==null)   return "./src/"+fromProjectRootPath;
		return request.getSession().getServletContext().getRealPath( "")+"/WEB-INF/classes/"+fromProjectRootPath;
	}
	
	public static String getWebClassPath(HttpServletRequest request){
		return request.getSession().getServletContext().getRealPath("")+"/WEB-INF/classes/";
	}
	

}
