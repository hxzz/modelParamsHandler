package com.hexincad.filters;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;

/**
 * Servlet Filter implementation class EncodingFilter
 */
@WebFilter(filterName="/EncodingFilter",urlPatterns="/*")
public class EncodingFilter implements Filter {

    /**
     * Default constructor. 
     */
    public EncodingFilter() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		String s=request.getParameter("msg");
		if(s!=null){
		//	s = s.replaceAll("%(?![0-9a-fA-F]{2})", "%25");  
		//	s=URLDecoder.decode(s,"UTF-8");
		}
		System.out.println(s+"\n****************************");
		if(s!=null){
			s=getUTF8Str(s);
			System.out.println(s+"#########################################");
		}
		
		
		HttpServletRequest req=(HttpServletRequest)request;
		String uri=req.getRequestURI();
		
		if(uri.endsWith(".html")){
			response.setContentType("text/html;charset=UTF-8");
		} 
		chain.doFilter(request, response);
	}
	
	
	private String getUTF8Str(String s){
		String[] encodings={
				"ISO-8859-1",
				"UTF-8",
				"US-ASCII",
				"UTF-16BE",
				"UTF-16LE",
				"UTF-16",
				"GBK",
				"GB2312",
				"Windows-1252",
				"Windows-1256",
				"ISO-8859-6",
				"ISO-8859-4",
				"ISO-8859-13",
				"Windows-1257",
			//	"ISO-8859-14",
				"ISO-8859-2",
				"Windows-1250",
				"gb18030",
				"Big5",
				"ISO-8859-5",
				"Windows-1251",
				"KOI8-R",
				"KOI8-U",
				"IBM866",
				"ISO-8859-7",
				"Windows-1253",
				"Windows-1255",
				//"ISO-8859-8-1",
				"ISO-8859-8",
				"Shift_JIS",
				"EUC-JP"
				};
		
		for(String en:encodings){
				try {
					String ss=new String(s.getBytes(en),"UTF-8");
					if(s.equals(ss))ss+="----------------------------------------";
					System.out.println(en+":  "+ss);
				} catch (UnsupportedEncodingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		}
		return s;
		 
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

}
