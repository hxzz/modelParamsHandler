$(function(){
	var zNodes =[
	 			{ id:1, pId:null, name:"基本", t:"基本类型", open:true},
	 			{ id:11, pId:1, name:"长方体", t:"普通长方体"},
	 			{ id:12, pId:1, name:"球体", t:"普通球体"},
	 			{ id:13, pId:1, name:"棱锥", t:"各种棱锥", open:false},
	 			{ id:14, pId:1, name:"棱柱", isParent:true,t:"普通棱柱",open:false},
	 			{ id:131, pId:13, name:"三棱锥", t:"普通的三棱锥"}
	 		];

	var setting = {
			view: {
				selectedMulti: false
			},
			data: {
				key: {
					title:"t"
				},
				simpleData: {
					enable: true,
					idKey:"id",
					pidKey:"pId",
					rootPId:"1"
				}
			},
			callback: {
				//beforeClick: beforeClick,

			}
		};

	$.fn.zTree.init($("#ul_tree"), setting, zNodes);
	var tree=$.fn.zTree.getZTreeObj("ul_tree");
	
	function createTag(tagName,attrs,text){
		if(!tagName&&!text){
			return;
		}else if(!tagName&&text){
			return  document.createTextNode(text);
		}
		
		var tag=document.createElement(tagName);
		if(attrs){
			for(key in attrs){
				tag.setAttribute(key, attrs[key]);
			}
		}
		
		if(text){
			tag.appendChild(document.createTextNode(text));
		}
		
		return tag;
	}
	
	function initRowsDom(id,rows,cols){
		var container=document.getElementById(id);
		for(var i=0;i<rows;i++){
			var tr=createTag("tr",{"style":"display:none;"});
			container.appendChild(tr);
			for(var j=0;j<cols;j++){
				var td=createTag("td");
				tr.appendChild(td);
			}
		}
	}
	
	 /*<div class="col-sm-6 col-md-3" style="text-align:center;">
		 <a href="javascript:void(0);" class="thumbnail" title="这是测试缩略图">
		<img src="../../resources/images/moon-light.png" alt="通用的占位符缩略图">
		 </a>
		 <button type="button" class="btn btn-primary">加入收藏</button>
	 </div>*/
	function fillRows(data,container){
		if(data&&data.constructor==Array){
			var rows=$(container).find("tr");
			var i=0;
			var count=0;
			for(;i<rows.length;i++){
				 var row=rows[i];
				 var tds=$(row).find("td");
				 var rowdata=null;
				 if(tds&&tds.length>0){
					 for(var j=0;j<tds.length&&count<data.length;j++){
						 rowdata=data[count];
					     count++;
						 var td=tds[j];
						 var desc=rowdata.desc;
						 if(desc&&desc.length>30){
							 desc=desc.substring(0,30)+"...";
						 }
						 var a=createTag("a",{"href":"../designcenter/designcenter.html?id="+rowdata.id,
							 				  "class":"thumbnail",
							 				  "style":"text-align:center;margin-bottom:10px;",
							 				  "title":rowdata.desc
							 				  });
						 var img=new Image();
						 img.src=rowdata.thumbnail;
						/* img.style["padding-left"]="10%";
						 img.style["padding-right"]="10%";*/
						 img.alt="测试缩略图";
						 var div=createTag("div",{"class":"col-sm-6 col-md-3","style":"text-align:center;padding-bottom:5px;width:100%;"});
						 var btn=createTag("button",{"type":"button","class":"btn btn-primary","style":"margin-left:20px;"},"加入收藏");
						 div.appendChild(a);
						 div.appendChild(createTag("span",{"style":"text-align:center;font-size:20px;"},rowdata.name));
						 div.appendChild(btn);
						 a.appendChild(img);
						 td.appendChild(div);
					 }
				 }
				 $(row).css("display","");
			}
			for(;i<rows.length;i++){
				$(rows[i]).css("display","none");
			}
		}
		setSize();
	}
	
	var data=[{
			id:"000000001",
			desc:"缩略图测试",
			thumbnail:"../../resources/images/moon-light.png",
			name:"月亮"
		},{
			id:"000000001",
			desc:"缩略图测试",
			thumbnail:"../../resources/images/moon-light.png",
			name:"月亮"
		},{
			
			id:"000000001",
			desc:"缩略图测试",
			thumbnail:"../../resources/images/moon-light.png",
			name:"月亮"
			
		},{
			
			id:"000000001",
			desc:"缩略图测试",
			thumbnail:"../../resources/images/moon-light.png",
			name:"月亮"
			
		}
		,{
					
				id:"000000001",
				desc:"缩略图测试",
				thumbnail:"../../resources/images/moon-light.png",
				name:"月亮"
					
		}
		,{
			
			id:"000000001",
			desc:"缩略图测试",
			thumbnail:"../../resources/images/moon-light.png",
			name:"月亮"
			
		}
		,{
			
			id:"000000001",
			desc:"缩略图测试",
			thumbnail:"../../resources/images/moon-light.png",
			name:"月亮"
			
		}

		];
	initRowsDom("tbody_models_list",5,3);
	fillRows(data,$("#tbody_models_list"));

	function setSize(){
		var h=$(window).height();
		var top=$("#div_main").offset().top;
		h=h-top-5;
		$("#div_modelTree").height(h);
		$("#div_modelViewer").height(h);
	}
	
	window.addEventListener("resize",setSize);
	
	setSize();
	$("#ul_tree").css("font-size","16px");
	
	
	//模态框
	$("#loginout").on("click",function(){
		$("#model_body_login").css("margin-top","300px");
		if($.trim($("#loginout").text())=="登录"){
			$('#modal_login').modal({
			    keyboard: true,
			});
		}else{
			
		}
	});
	
});