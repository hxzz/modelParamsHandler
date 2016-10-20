package com.hexincad.utils;

import java.io.IOException;

import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;

import com.hexincad.msgPost.HxMsg;

public class HttpConnectUtil {
		
		
		/**
		 * get方式
		 * @param url
		 * @author www.yoodb.com
		 * @return
		 */
		public static String getHttp(final String URL) {
			String responseMsg = "";
			HttpClient httpClient = new HttpClient();
			GetMethod getMethod = new GetMethod(URL);
			getMethod.getParams().setParameter(HttpMethodParams.RETRY_HANDLER,new DefaultHttpMethodRetryHandler());
			try {
				httpClient.executeMethod(getMethod);
				/*ByteArrayOutputStream out = new ByteArrayOutputStream();
				InputStream in = getMethod.getResponseBodyAsStream();
				int len = 0;
				byte[] buf = new byte[1024];
				while((len=in.read(buf))!=-1){
					out.write(buf, 0, len);
				}
				responseMsg = out.toString("UTF-8");*/
			} catch (HttpException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			} finally {
				//释放连接
				getMethod.releaseConnection();
			}
			return responseMsg;
		}

		/**
		 * post方式
		 * @param url
		 * @param code
		 * @param type
		 * @author www.yoodb.com
		 * @return
		 */
		public static String postHttp(final String URL,final HxMsg msg) {
			String responseMsg = "";
			HttpClient httpClient = new HttpClient();
			httpClient.getParams().setContentCharset("UTF-8");
			PostMethod postMethod = new PostMethod(URL);
			try {
				postMethod.addParameter("msg", JacksonUtil.bean2Json(msg));
				System.out.println("发送： "+JacksonUtil.bean2Json(msg)+"\n***************************************");
				httpClient.executeMethod(postMethod);
				/*ByteArrayOutputStream out = new ByteArrayOutputStream();
				InputStream in = postMethod.getResponseBodyAsStream();
				int len = 0;
				byte[] buf = new byte[1024];
				while((len=in.read(buf))!=-1){
					out.write(buf, 0, len);
				}
				responseMsg = out.toString("UTF-8");
				if(responseMsg.equals("success")){
					
				}*/
			} catch (HttpException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			} finally {
				postMethod.releaseConnection();
			}
			return responseMsg;
		}
}
