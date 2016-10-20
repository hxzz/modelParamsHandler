THREE.HxzzControls = function ( container,group,camera ) {
	var EPS = 0.000001;
	raycaster = new THREE.Raycaster();
	var intersects=[],INTERSECTED;
	var INTERSECTED=null;
	var mouse=new THREE.Vector3();
	var tmouse={};
	var MOUSE_BUTTONS={L:0,M:1,R:2};
	var MOUSE_EVENT={LEFT_DOWN:0,LEFT_UP:1,LEFT_DOWN_MOVE:2,RIGHT_DOWN:3,RIGHT_UP:4,RIGHT_DOWN_MOVE:5,MOVE:6};
	var mouseState=null;
	
	var autoRotateSpeed=new THREE.Vector3(0.015,0.015,0.015);
	
	this.rotateSpeed=autoRotateSpeed;
	this.rotate=false;
	this.isRotating=false;
	
	var that=this;
	
	var ratio=(function(){
		var h=window.innerHeight;
		var w=window.innerWidth;
		var ratio={x:1,y:1};
		var minLen=Math.min(h,w);
		
		var ratio={x:1,y:1,z:1};
		if(minLen<400){
			ratio.x=w/400;
			ratio.y=h/400;
			ratio.z=(ratio.y+ratio.x)/2;
		}
		return ratio;
	})();
	
	function onDocumentMouseUp( event ) {
			event.preventDefault();
			
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			
			if(tmouse.x == mouse.x && tmouse.y == mouse.y){
				mouse.isClick=true;
			}
			
			
			
			if(event.button==MOUSE_BUTTONS.L){
				mouseState=MOUSE_EVENT.LEFT_UP;
			}else if(event.button==MOUSE_BUTTONS.R){
				mouseState=MOUSE_EVENT.RIGHT_UP;
			}
			
	}
	container.addEventListener( 'mouseup', onDocumentMouseUp, false );
	
	function onDocumentMouseDown( event ) {
		event.preventDefault();
		tmouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		tmouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		//mouse.trigger="click";
		
		if(event.button==MOUSE_BUTTONS.L){
			mouseState=MOUSE_EVENT.LEFT_DOWN;
		}else if(event.button==MOUSE_BUTTONS.R){
			mouseState=MOUSE_EVENT.RIGHT_DOWN;
		}
	}
	container.addEventListener( 'mousedown', onDocumentMouseDown, false );
	
	function onDocumentMouseMove(event){
		
		event.preventDefault();
		var  lastMouse={};
		lastMouse.x=mouse.x;
		lastMouse.y=mouse.y;
		lastMouse.z=mouse.z;
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		
		
		if(mouseState==MOUSE_EVENT.LEFT_DOWN_MOVE){
			mouseState=MOUSE_EVENT.LEFT_DOWN_MOVE
		}else if(mouseState==MOUSE_EVENT.RIGHT_DOWN_MOVE){
			mouseState=MOUSE_EVENT.RIGHT_DOWN_MOVE
		}else if(mouseState==MOUSE_EVENT.LEFT_DOWN){
			mouseState=MOUSE_EVENT.LEFT_DOWN_MOVE;
		}else if(mouseState==MOUSE_EVENT.LEFT_DOWN){
			mouseState=MOUSE_EVENT.RIGHT_DOWN_MOVE;
		}else{
			mouseState=MOUSE_EVENT.MOVE;
		}
	
		if(mouseState==MOUSE_EVENT.LEFT_DOWN_MOVE&&!mouse.isClick){
try{
			var z_last=lastMouse.z;
			var z=Math.sqrt(3-mouse.x*mouse.x-mouse.y*mouse.y);
			mouse.z=z;
			
			var h=window.innerHeight;
			var w=window.innerWidth;
			
			var x_distance=mouse.x-lastMouse.x;
			var y_distance=mouse.y-lastMouse.y;
			var z_distance=z-z_last;
			
			var x_change=x_distance/w*2*Math.PI*ratio.x;
			var y_change=y_distance/h*2*Math.PI*ratio.y;
			var z_change=z_distance/h*2*Math.PI*ratio.z;
			
			
			that.rotateSpeed.set(x_change,y_change,z_change);
			var len=that.rotateSpeed.length();
			var thata=Math.asin(len/3.4641016151377544);
			var dir_vector=mouse.clone();
			dir_vector=dir_vector.cross(that.rotateSpeed);
			dir_vector.normalize();
			dir_vector.multiplyScalar(thata*1000);
			that.rotateSpeed=dir_vector;
			
			console.info(JSON.stringify(dir_vector));
			
			if(len<EPS){
				that.stopRotate();
			}else if(!that.isRotating){
				that.rotateStart();
			}
			
			
}catch(e){
	console.info(e);
}			
			
		}
	}
	
	container.addEventListener( 'mousemove', onDocumentMouseMove, false );

	function onDocumentMouseOut(event){
		container.removeEventListener('mousemove', onDocumentMouseMove, false);
		container.removeEventListener('mousedown', onDocumentMouseDown, false);
		container.removeEventListener('mouseup', onDocumentMouseUp, false);
		
		mouse.x=null;
		mouse.y=null;
		tmouse={};
		mouseState=null;
	}
	
	container.addEventListener( 'mouseout', onDocumentMouseOut, false );
	
	function onDocumentMouseOver(){
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		container.addEventListener( 'mousemove', onDocumentMouseMove, false );
		container.addEventListener( 'mousedown', onDocumentMouseDown, false );
		container.addEventListener( 'mouseup', onDocumentMouseUp, false );
	}
	container.addEventListener( 'mouseover', onDocumentMouseOver, false );
	
   this.resetAutoRotate=function (){
	   autoRotateSpeed.x=0.015;
	   autoRotateSpeed.y=0.015;
	   autoRotateSpeed.z=0.015;
   };
   
   
   this.rotateStart=function(){
	    var m1=new THREE.Matrix4();
	    var m2=new THREE.Matrix4();
	    var m3=new THREE.Matrix4();
	    var m=new THREE.Matrix4();
	      
	    m1.makeRotationY(that.rotateSpeed.y);
	    m2.makeRotationX(that.rotateSpeed.x);
	    m3.makeRotationZ(that.rotateSpeed.z);
	    m.multiplyMatrices(m1,m2);
	    m.multiply( m3 );
	    group.applyMatrix(m);
	    
	    //group.rotateY(that.rotateSpeed.x);
	    //group.rotateX(that.rotateSpeed.y);
	   // group.rotateZ(that.rotateSpeed.z);
	    
	    that.isRotating=true;
	    that.rotate=true;
	      
   }   
   
   this.stopRotate=function(){
	   that.rotateSpeed.x=0;
	   that.rotateSpeed.y=0;
	   that.rotateSpeed.z=0;
	   that.isRotating=false;
	   that.rotate=false;
   }
	
	this.findIntersections=function () {
	
		// find intersections	
		if(mouse.x){
			raycaster.setFromCamera( mouse, camera );
			intersects = raycaster.intersectObjects( group.children )||[];
		}
		
		//console.info("mouse:"+JSON.stringify(mouse));
	
		if ( intersects.length > 0 ) { 
			
			that.stopRotate();
			if ( INTERSECTED != intersects[ 0 ].object ) {
	
				if ( INTERSECTED ) {
					INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
				}
	
				INTERSECTED = intersects[ 0 ].object;
				INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
				INTERSECTED.material.emissive.setHex( 0xff0000 );
				
			}
			if(/*INTERSECTED.onclick&&*/mouse.isClick){
				//INTERSECTED.onclick();
				
				INTERSECTED.dispatchEvent({type:"click"});
				tmouse={};
			}
			mouse.isClick=false;
	
		} else {
	
			if ( INTERSECTED ) {
				INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
			}
			INTERSECTED = null;
			mouse.isClick=false;
	
		}
	}
}


