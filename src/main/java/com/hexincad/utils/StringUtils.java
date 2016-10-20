package com.hexincad.utils;

public class StringUtils {

	public static boolean  isEmpty(String str){
		if (str==null)return true;
		if (str.trim().length()==0)return true;
		return false;
	}
	
	public static boolean  isNegetiveNumber(String str){
		if(StringUtils.isNumber(str)){			
			String s=str.trim();
			return s.charAt(0)=='-';
		}
		return false;
	
	}
	
	public static boolean isNumberString(String str,int minLen,int maxLen){
		if(!StringUtils.isEmpty(str)){
			 return str.trim().matches("[0-9]{"+minLen+","+maxLen+"}");
		}
		return false;
	}
	
	public static boolean isNumberString(String str){
		if(!StringUtils.isEmpty(str)){
			 return str.trim().matches("[0-9]+");
		}
		return false;
	}
	
	public static boolean  isPositiveNumber(String str){
		 if(StringUtils.isNumber(str)){
			 char s=str.trim().charAt(0);
			 return s=='+'||s!='-';
		 }
		 return false;
	}
	
	public static boolean isNegetiveDecimal(String str){
		if(StringUtils.isDecimal(str)){
			String s=str.trim();
			return s.charAt(0)=='-';
		}
		return false;
	}
	
	public static boolean isPositiveDecimal(String str){
		if(StringUtils.isDecimal(str)){
			char s=str.trim().charAt(0);
			return s=='+'||s!='-';
		}
		return false;
	}
	
	
	public static boolean  isDecimal(String str){
		if(StringUtils.isEmpty(str)){
			return false;
		}
		String reg2="[\\+\\-]?0\\.\\d+";  //小于1的小数
		String reg3="[\\+\\-]?[1-9]\\.\\d+";  //小数点在第一位之后且大于1的小数
		String reg4="[\\+\\-]?[1-9]\\d+\\.\\d+";//小数点在第二位之后或者第二位之后的小数
		String reg1=reg2+"|"+reg3+"|"+reg4;
		String s=str.trim();
		return s.matches(reg1);
	}
	
	public static boolean isInteger(String str){
		if(StringUtils.isEmpty(str)){
			return false;
		}
		return  str.trim().matches("[\\+\\-]?[1-9]\\d*");
	}
	
	public static boolean isNegetiveInteger(String str){
		if(StringUtils.isInteger(str)){
			String s=str.trim();
			return s.charAt(0)=='-';
		}
		return false;
	}
	
	public static boolean isPositiveInteger(String str){
		if(StringUtils.isInteger(str)){
			char s=str.trim().charAt(0);
			return s=='+'||s!='-';
		}
		return false;
	}
	
	
	public static boolean isNumber(String str){
		if(StringUtils.isEmpty(str)){
			return false;
		}
		 
		String reg1="[\\+\\-]?[1-9]\\d*";  //整数
		String reg2="[\\+\\-]?0\\.\\d+";  //小于1的小数
		String reg3="[\\+\\-]?[1-9]\\.\\d+";  //小数点在第一位之后且大于1的小数
		String reg4="[\\+\\-]?[1-9]\\d+\\.\\d+";//小数点在第二位之后或者第二位之后的小数
		String reg=reg1+"|"+reg2+"|"+reg3+"|"+reg4;
		String s=str.trim();
		return s.matches(reg)||"0".equals(s);
	}
	
		
	
	public static boolean isZero(String str){
		if(!StringUtils.isEmpty(str)){
			return str.trim().equals("0");
		}
		return false;
	}
	
	
	public static void main(String[] args) {
		System.out.println(StringUtils.isPositiveInteger("a"));
		System.out.println(StringUtils.isNumberString("2",1,9));
	}
	
}
