package com.hexincad.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.Socket;
import java.util.Arrays;

import com.hexincad.msgPost.Java_HxzzMsg;

public class SocketUtil {

	public static Java_HxzzMsg recieveMsg(final Socket so) {
		if(so==null){
			return null;
		}
		try {
			return recieveMsg(so.getInputStream());
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			if(so!=null){
				try {
					so.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return null;

	}
	
	public static Java_HxzzMsg recieveMsg(final InputStream in) {
		BufferedReader reader=null;
		final int LENGTH = 1024;
		final char[] buf = new char[LENGTH];
		int len = -1;
		StringBuffer sb = null;
		try {
			reader = new BufferedReader(new InputStreamReader(in));
			sb = new StringBuffer();
			while ((len = reader.read(buf)) != -1) {
				if (len < LENGTH) {
					sb.append(new String(Arrays.copyOf(buf, len)));
				} else {
					sb.append(new String(buf));
				}
			}
			return new Java_HxzzMsg(sb.toString());
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			if(reader!=null){
				try {
					reader.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		
		return null;

	}
	
	public static  boolean sendMsg(Socket client,final String msg) {
		OutputStream out=null;
		try {
			 out=client.getOutputStream();
			 out.write(msg.getBytes());			 
			 return true;
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			if(out!=null){
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if(client!=null){
				try {
					client.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return false;
	 }
	
	public static  boolean sendMsg(final OutputStream out,final String msg) {
		try {
			 out.write(msg.getBytes());			 
			 return true;
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			if(out!=null){
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return false;
	 }
	
}
