package com.hexincad.msgPost;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map.Entry;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingDeque;

import javax.servlet.http.HttpServletRequest;

import com.hexincad.utils.HttpConnectUtil;
import com.hexincad.utils.JacksonUtil;
import com.hexincad.utils.PathUtils;
import com.hexincad.utils.StringUtils;

public class HxPost {
	
	private static HxPost post=null;  
	private final LinkedBlockingDeque<HxMsg> msgQueue=new LinkedBlockingDeque<HxMsg>();   //消息队列
	
	private ExecutorService fixedThreadPoolSend = null;  //发送消息的线程池
	
	//private ServerManager manager=new ServerManager();
	
	private final HashMap<String,ServerStatus> allServers=new HashMap<String,ServerStatus>();
	private final HashMap<String,ServerStatus> busyServers=new HashMap<String,ServerStatus>();
	private final HashMap<String,ServerStatus> freeServers=new HashMap<String,ServerStatus>();
	private final LinkedList<String>allFreeKeys=new LinkedList<String>();
	private String hostsFilePath=null;
	
	
	
	private HxPost(){}
	
	public static  HxPost getInstance(HttpServletRequest request){
		if(post==null){
			post = new HxPost();
			post.setHostsFilePath(PathUtils.getResourcesPath(request, "config/hosts.txt"));
			post.init();
			post.start();
		}
	//	post = new HxPost(port); //测试
		return post;
	}
	
	private void start(){
		 new Thread(){
			 public void run(){
				 while(true){			
						try {
							send(msgQueue.take());
						} catch (InterruptedException e) {
							e.printStackTrace();
						}
				 }
			 }
		 }.start();
	}
 
	private void init(){
		try {
			allServers.clear();
			String path=this.getHostsFilePath();
			List<String> list=Files.readAllLines(Paths.get(path));
			if(list!=null&&list.size()>0){
				int rowcount=0;
				for(String line:list){
					String []strArray=line.trim().split(" +");
					if(strArray!=null&&strArray.length==2){
						if(!StringUtils.isEmpty(strArray[0])&&!StringUtils.isEmpty(strArray[1])){
							String ip=strArray[0].trim();
							String pt=strArray[1].trim();
							if(!allServers.containsKey(ip+":"+pt)){
								allServers.put(ip+":"+pt, new ServerStatus(ip,Integer.valueOf(pt),null));
							}
							
						}
					}else{
						System.out.println("第"+rowcount+"行格式有误！");
					}
				}
			}
			freeTest();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void send(HxMsg msg){
		if(fixedThreadPoolSend==null){
			fixedThreadPoolSend=Executors.newFixedThreadPool(10);  
		}
		
		Runnable target = new Runnable(){
			public void run(){
				try {
					System.out.println("发送消息："+JacksonUtil.bean2Json(msg));
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
				ServerStatus ss=getRandFreeServer();
				String ip=ss.getAddress();
				int port =ss.getPort();
				String url="http://"+ip+":"+port+"/modelBuilder/ModeleBuidlerServlet";
				HttpConnectUtil.postHttp(url,msg);
			}
		};
		fixedThreadPoolSend.execute(target);
	}
	
	public void addtoQueue(HxMsg msg){
		if(msg!=null){
			msgQueue.add(msg);
			try {
				System.out.println(JacksonUtil.bean2Json(msg)+"加入消息队列");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	private void freeTest(){
		for(Entry<String,ServerStatus> e:allServers.entrySet()){
			ServerStatus ss=e.getValue();
			String key=e.getKey();
			if(checkFree(ss)){			//List<String> list=Files.readAllLines(Paths.get("./hosts.txt"));
				ss.setBusy(false);
				freeServers.put(key, ss);
				allFreeKeys.add(key);
			}else{
				ss.setBusy(true);
				busyServers.put(key, ss);
			}
			
		}
	}
	
	private boolean checkFree(ServerStatus ss){
		return true;
	}
	
	private ServerStatus getRandFreeServer(){
		int size=allFreeKeys.size();
		int index=(int)(Math.random()*size);
		String key=allFreeKeys.get(index);
		return freeServers.get(key);
	}
	
	private void removeBusyFromFreeServers(String key){
		ServerStatus s=freeServers.remove(key);
		allFreeKeys.remove(key);
		busyServers.put(key, s);
	}
	
	
	public static void main(String[] args) {
			HxPost.getInstance(null);
	
	}

	public String getHostsFilePath() {
		return hostsFilePath;
	}

	public void setHostsFilePath(String hostsFilePath) {
		this.hostsFilePath = hostsFilePath;
	}
	
}
