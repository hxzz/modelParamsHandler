$(function(){
	var	isOut=false;
	$("#params_btn").on("click",function(){
		if(isOut){			
			$("#params").animate({right:"-62%"}); 
			/*$("#swipIcon").text(">");*/
			isOut=false;
		}else{
			$("#params").animate({right:"0%"}); 
			/*$("#swipIcon").text("<");*/
			isOut=true;
		}
	});
	
	var docs_show=false;
	$("#docs_btn").on("click",function(){
		if(docs_show){
			$("#docs_iframe").hide();
			$("body").css("overflow-y","auto");
			docs_show=false;
			$("#params_btn").removeAttr("disabled");
			$("#assembling_btn").removeAttr("disabled");
			$("#fullScreen").removeAttr("disabled");
		}else{
			$("#docs_iframe").show();
			$("body").css("overflow-y","hidden");
			docs_show=true;
			$("#params_btn").attr("disabled","disabled");
			$("#assembling_btn").attr("disabled","disabled");
			$("#fullScreen").attr("disabled","disabled");
		}
		
	});
	
	var assembling_show=false;
	$("#assembling_btn").on("click",function(){
		if(assembling_show){
			$("#assembling_div").hide();
			assembling_show=false;
		}else{			
			$("#assembling_div").show();
			assembling_show=true;
		}
	});
	
	var btns_show=false;
	$("#settings_btn").on("click",function(){
		if(btns_show){
			$("#assembling_btn").hide();
			$("#docs_btn").hide();
			$("#params_btn").hide();
			$("#fullScreen").hide();
			btns_show=false;
		}else{
			$("#assembling_btn").show();
			$("#docs_btn").show();
			$("#params_btn").show();
			$("#fullScreen").show();
			btns_show=true;
		}
		
	});
	var  normalSizeConfig={};
	function setSize(callback){
		var  container=$("#display_container_div");
		
		//模型展示区域div的位置
		var  con_offset=container.offset();
		//var  con_x=con_offset.x;
		var  con_y=con_offset.top;
		
		//底部footer标签的位置
		/*var  foot_offset=$("#foot").offset();
		//var  foot_x=foot_offset.x;
		var  foot_y=foot_offset.top;*/
		
		var  restHeight=$(window).height()-con_y;
		restHeight*=0.9;
		container.height(restHeight);
				
		//设定模型展示区域div的高度
		$("#model").height(restHeight);
		$("#params").height(restHeight);
		$("#btns_wrap_div").css("height","");
		$("#swiper").css("height","");
		
		/*//点击展开模型参数的图标
		$("#swipIcon").css("height","");
		var icon_height=$("#swipIcon").height();
		var top_offset=(restHeight-icon_height)/2;
		$("#swipIcon").css("margin-top",top_offset+"px");*/
		
		
		if(!normalSizeConfig['inited']){			
			normalSizeConfig['x']="0px";
			normalSizeConfig['y']=con_y+'px';
			normalSizeConfig['height']=restHeight+"px";
			normalSizeConfig['inited']=true;
		}
		
		callback&&callback(container);
	}
	
	
	function launchFullscreen(element) {
		  if(element.requestFullscreen) {
		    element.requestFullscreen();
		  } else if(element.mozRequestFullScreen) {
		    element.mozRequestFullScreen();
		  } else if(element.webkitRequestFullscreen) {
		    element.webkitRequestFullscreen();
		  } else if(element.msRequestFullscreen) {
		    element.msRequestFullscreen();
		  } else if(element.msRequestFullscreen){
			  element.msRequestFullscreen();
		  }
	}
	
	/*function makeFullScreen(){
		var  container=$("#display_container_div");
		container.css("position","absolute")
		.css("top","0px").width("100%")
		.height($(window).height());
		
		setSize(function(container){
			renderer.setSize( $(container).width(), $(container).height() );
		});
		//$("body").css("overflow-y","hidden") ;
	}*/
	
	function exitFullscreen() {
		  if(document.exitFullscreen) {
		    document.exitFullscreen();
		  } else if(document.mozCancelFullScreen) {
		    document.mozCancelFullScreen();
		  } else if(document.webkitExitFullscreen) {
		    document.webkitExitFullscreen();
		  } else if(element.msExitFullscreen){
			  element.msExitFullscreen();
		  }
	}
	
	/*function cancelFullScreen(){
		//exitFullscreen();
		var  container=$("#display_container_div");
		var  w=$(container).width();
		container.css("position","")
		.css("top","").width("100%");
		container.css("height",normalSizeConfig.height);
		$("body").css("overflow-y","auto") ;
		
		setSize(function(container){
			renderer.setSize( w, $(container).height() );
		});
		
	}*/
	
	var fullScreenHandler=function(){
		var isFullScreen=document.mozFullScreen||document.webkitIsFullScreen||document.isFullScreen||document.fullScreen;
		var  container=$("#display_container_div");
		if(isFullScreen){
			container.css("position","absolute")
			.css("top","0px").width("100%")
			.height($(window).height());
			 $("#fullScreen").html("退出<br/>全屏");
		}else{
			container.css("position","")
			.css("top","").width("100%");
			container.css("height",normalSizeConfig.height);
			$("body").css("overflow-y","auto") ;
			 $("#fullScreen").text("全屏");
		}
		setSize(function(container){
			var  w=$(container).width();
			renderer.setSize( w, $(container).height() );
		});
	}
	 
	document.onfullscreenchang=document.onwebkitfullscreenchange=document.onmozfullscreenchange=fullScreenHandler;
	
	$("#fullScreen").on("click",function(){
		var isFullScreen=document.mozFullScreen||document.webkitIsFullScreen||document.isFullScreen||document.fullScreen;

		 if(!isFullScreen){
			 //$("#screen_status").val('1');
			 launchFullscreen(container=document.getElementById("display_container_div"));
//			 $("#fullScreen").html("退出<br/>全屏");
		 }else{
			 //$("#screen_status").val('0');
			// $("#fullScreen").text("全屏");
			 exitFullscreen();
		 }
	});
	
	
	setSize();
	
	function createDom(tagName,text,attrs){
		if(!tagName||$.trim(tagName)==''){
			return;
		}
		var tag=document.createElement(tagName);
		if(text&&$.trim(text)!=''){
			tag.appendChild(document.createTextNode(text));
		}
		if(attrs&&typeof(attrs)=='object'){
			for(var attrName in attrs){
				$(tag).attr(attrName,attrs[attrName]);
			}
		}
	}
	
	
	function generateParamsInfoList(paramsInfoList){
		if(!paramsInfoList||$.trim(paramsInfoList)==''){
			return;
		}
		var paramList=$("#params_list")
		for(var i=0; i<paramsInfoList.length;i++){
			var p=paramsInfoList[i];
			var tr=createDom("tr");
			var td=createDom("td");
			tr.appendChild(td);
			td.appendChild(createDom("label",p.name,{id:"param_label_"+i}));
			var input=createDom("input",null,{"class":"param_input","value":p.value,id:"param_input_value"+i});
			td=createDom("td");
			tr.appendChild(td);
			td.appendChild(input);
			input=createDom("input",null,{"class":"param_input","value":p.value,id:"param_input_type"+i,"style":"display:none;"});
			td.appendChild(input);
		}
		
	}
	
	function fillParamsValues(paramsValues){
		if(!paramsValues||$.trim(paramsValues)==''){
			return;
		}
		
		if(typeof(paramsValues)=="object"){
			for(var i=0;i<paramsValues.length;i++){
				var ob=paramsValues[i];
				
			}
		}
	}
	
	
	
	
	//threejs显示模型部分的代码
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	var container, stats;

	var camera, controls, scene, renderer;

	var cross;

	init();
	animate();

	function init() {

		camera = new THREE.PerspectiveCamera( 60,$("#model").width()/$("#model").height(), 0.01, 1e10 );
		camera.position.z = 16;
		camera.position.x = 0;
		

		//controls.enableZoom = true;   //滚动鼠标时，变焦
		//controls.enablePan = true;    //启用方向键调整模型x，y轴位置

		scene = new THREE.Scene();
		scene.add( camera );

		// light

		var dirLight = new THREE.DirectionalLight( 0xffffff );
		dirLight.position.set( 200, 200, 1000 ).normalize();

		camera.add( dirLight );
		camera.add( dirLight.target );

		var loader = new THREE.VRMLLoader();
		loader.load( '/web-resources/models/house.wrl', function ( object ) {
			//object.position.x=-3;
			scene.add( object );

		} );
		

		// renderer

		renderer = new THREE.WebGLRenderer( { antialias: false } );
		renderer.setPixelRatio( window.devicePixelRatio );
		container = document.getElementById( 'model' );
		renderer.setSize( $(container).width(), $(container).height() );
		//renderer.domElement.style["margin-left"]="10%";
		
		container.appendChild( renderer.domElement );
		
		controls = new THREE.OrbitControls( camera ,renderer.domElement );
		controls.rotateSpeed = 5.0;
		controls.zoomSpeed = 5;

		/*stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = $(container).offset().top;;
		container.appendChild( stats.dom );*/

		//

		window.addEventListener( 'resize', onWindowResize, false );

	}

	function onWindowResize() {
		var w=$(container).width(), h=$(container).height();
		camera.aspect = w/h;
		camera.updateProjectionMatrix();

		renderer.setSize(w, h );
		//setSize();
		//renderer.setSize();
		//controls.handleResize();

	}

	function animate() {

		requestAnimationFrame( animate );

		controls.update();
		renderer.render( scene, camera );

		//stats.update();

	}
	
	
	
	//评论
	$("#comment_words").on("change",function(){
		var content=$(this).val();
		var len=content&&content.length||0;
		$("#inputed_words").text(len);
		$("#rest_words").text(500-len);
		if(len>500){
			$('#tip_content').popover('show');
			window.setTimeout(function(){
				$('#tip_content').popover('hide');
			}, 3000);
		}
	});
	
	
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


