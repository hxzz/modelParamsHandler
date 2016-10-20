package com.hexincad.utils;

import java.io.IOException;
import java.io.StringWriter;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.annotate.JsonSerialize.Inclusion;


public class JacksonUtil {
    private static ObjectMapper mapper = new ObjectMapper();
    
    public static String bean2Json(Object obj) throws IOException {
    	mapper.setSerializationInclusion(Inclusion.ALWAYS);
        StringWriter sw = new StringWriter();
        JsonGenerator gen = new JsonFactory().createJsonGenerator(sw);
        mapper.writeValue(gen, obj);
        gen.close();
        return sw.toString();
    }
    
    public static String bean2Json(Object obj,boolean excludeNull) throws IOException {
    	if(excludeNull){    		
    		mapper.setSerializationInclusion(Inclusion.NON_NULL);
    	}
        StringWriter sw = new StringWriter();
        JsonGenerator gen = new JsonFactory().createJsonGenerator(sw);
        mapper.writeValue(gen, obj);
        gen.close();
        return sw.toString();
    }

    public static <T> T json2Bean(String jsonStr, Class<T> objClass)
            throws JsonParseException, JsonMappingException, IOException {
        return mapper.readValue(jsonStr, objClass);
    }
    
    /*public static void main(String[] args) {
		
    	HashMap map=new HashMap();
    	map.put("a", "ddsandjasjkl");
    	map.put("b", new String[]{"兔子","狮子","老虎"});
    	HxMsg msg=new HxMsg();
    	msg.setCmd("cmd");
    	msg.setJobID("dsankldjsanlidhnliwuh");
    	ModelParams params=new ModelParams();
    	params.setId("000000001");
    	List<Param> plist=new LinkedList<Param> ();
    	plist.add(new Param("长","+d",new String[]{"10"}));
    	plist.add(new Param("宽","+d",new String[]{"10"}));
    	plist.add(new Param("高","+d",new String[]{"10","20","30"}));
    	params.setParams(plist);
    	msg.setParams(params);
    	map.put("model", msg);
    	try {
			System.out.println(JacksonUtil.bean2Json(map,true));
		} catch (IOException e) {
			e.printStackTrace();
		}
    	
	}*/
}