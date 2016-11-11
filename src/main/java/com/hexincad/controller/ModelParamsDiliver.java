package com.hexincad.controller;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.hexincad.msgPost.HxMsg;
import com.hexincad.msgPost.HxPost;
import com.hexincad.utils.JacksonUtil;

/**
 * Servlet implementation class ModelParamsDiliver
 */
@WebServlet("/ModelParamsDiliver")
public class ModelParamsDiliver extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ModelParamsDiliver() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)   {
		// TODO Auto-generated method stub
		
		try {		
				String msg=request.getParameter("msg");
				HxMsg hxMsg;
				System.out.println("test服务器： "+msg+"-------------------------------------------\n");
		 
				hxMsg = JacksonUtil.json2Bean(msg, HxMsg.class);
				HxPost post=HxPost.getInstance( request);
				post.addtoQueue(hxMsg);
				OutputStream out=response.getOutputStream();
				out.write("recieved".getBytes());
				out.flush();
				out.close();
			} catch (IOException e) {
				e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)   {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
