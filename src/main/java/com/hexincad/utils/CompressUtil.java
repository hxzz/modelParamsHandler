package com.hexincad.utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.UUID;
import java.util.zip.Adler32;
import java.util.zip.CheckedOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletResponse;

public class CompressUtil {

	public static void compress(String inputFileName, HttpServletResponse response) {
		try {
 
			response.setContentType("application/zip;charset=utf-8");
			response.setHeader("content-disposition", "attachment;filename="+UUID.randomUUID()+".zip");
			
			OutputStream dest = response.getOutputStream();
			
			
			/*response.setContentType("text/plain;charset=utf-8");
			dest.write(("{\"checksum\":     "+"\"dsajdiowuadhowai\",\"file\":\"").getBytes());
			FileInputStream fi = new FileInputStream(inputFileName);
			final int BUFFER=2048;
			byte data[] = new byte[BUFFER];

	        BufferedInputStream origin = new BufferedInputStream(fi, BUFFER);

	        int count;
	        while((count = origin.read(data, 0, BUFFER)) != -1) {
	               dest.write(data, 0, count);
	         }*/
			
			
			CheckedOutputStream checksum = new   CheckedOutputStream(dest, new Adler32());
			ZipOutputStream out = new     ZipOutputStream(new   BufferedOutputStream(checksum));
			
			//ZipOutputStream out = new ZipOutputStream(new BufferedOutputStream(dest));
			final int BUFFER=2048;
			 byte data[] = new byte[BUFFER];
	         // get a list of files from current directory
			 FileInputStream fi = new FileInputStream(inputFileName);

	         BufferedInputStream origin = new BufferedInputStream(fi, BUFFER);
	         ZipEntry entry = new ZipEntry("moon.png");
	         out.putNextEntry(entry);
	         int count;
	         while((count = origin.read(data, 0, BUFFER)) != -1) {
	               out.write(data, 0, count);
	         }
	         origin.close();
	         out.flush();
	         out.close();
	         
	         
	        /*origin.close();
	        dest.write("\"}".getBytes());
	        dest.flush();*/
	         
	         
 
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}catch(Exception e){
			e.printStackTrace();
		}
	}

}
