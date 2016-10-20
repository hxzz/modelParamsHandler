/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin 	/ http://mark-lundin.com
 * @author Simone Manini / http://daron1337.github.io
 * @author Luca Antiga 	/ http://lantiga.github.io
 */

THREE.HxzzTrackballControls = function ( config) {
	var _this = this;
	this.config={
			camera: null,
			domElement : document,
			target:new THREE.Vector3(),
			enabled : true,   //是否启用HxzzTrackballControls
			
			rotateSpeed : 1.0,  //旋转速度
			zoomSpeed : 1.2,  //放缩速度
			panSpeed : 0.3,   //移动速度

			noRotate : false,  //鼠标拖动时旋转
			noZoom : false,  //鼠标滚动时放缩
			noPan : false,   //右键点击移动模型
			
			staticMoving : false,  
			
			enableDampingFactor: false,   //是否设置阻尼参数
			dynamicDampingFactor : 0.2,
			
			enableRaycaster:false,     //是否启用光线投射
			raycastTarget:null,   //光线投射的目标，通常是Group或Scene对象
			enableClick:false,
			enableMouseover:false,
			enableMouseout:false,
			
			autoRotateSpeed:0.05,   //自动旋转的角速度
			enableAutoRotate:false,  //是否启用自动旋转
			defaultRotateAxis:new THREE.Vector3(0.92,0.17,-0.34).normalize(),
			minAngle:0.05,
			
			copy:function(object){
				if(object&&typeof(object)=="object"){
					 for(key in object){
						 _this.config[key]=object[key];
					 }
				}
			},
	}
	
	this.init=function(config){
		_this.config.copy(config);
		_this.object = _this.config.camera||null;
		_this.domElement = _this.config.domElement||document;
		_this.raycastTarget=_this.config.raycastTarget||null;
		_this.enabled =_this.config.enabled||true;
		_this.screen = { left: 0, top: 0, width: 0, height: 0 };

		_this.rotateSpeed =_this.config.rotateSpeed || 1.0;
		_this.zoomSpeed = _this.config.zoomSpeed||1.2;
		_this.panSpeed = _this.config.panSpeed||0.3;

		_this.noRotate = _this.config.noRotate||false;
		_this.noZoom = _this.config.noZoom||false;
		_this.noPan = _this.config.noPan||false;

		_this.staticMoving =_this.config.staticMoving || false;  
		
		_this.enableDampingFactor= _this.config.enableDampingFactor||false;   //是否设置阻尼参数
		_this.dynamicDampingFactor =_this.config.dynamicDampingFactor|| 0.2;

		_this.minDistance = 0;
		_this.maxDistance = Infinity;

		_this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];


		_this.target =_this.config.target || new THREE.Vector3();
		
		_this.enableRaycaster=_this.config.enableRaycaster||false;     //是否启用光线投射
		_this.raycastTarget=_this.config.raycastTarget||null;   //光线投射的目标，通常是Group或Scene对象
		_this.enableMouseout=_this.config.enableMouseout||false;
		_this.enableMouseover=_this.config.enableMouseover||false;
		_this.enableClick=this.config.enableClick||false;
		
		_this.autoRotateSpeed=_this.config.autoRotateSpeed||0.05;   //自动旋转的角速度
		_this.enableAutoRotate=_this.config.enableAutoRotate||false;  //是否启用自动旋转
		_this.defaultRotateAxis=_this.config.defaultRotateAxis.normalize()||new THREE.Vector3(0.92,0.17,-0.34).normalize();
		

		_this.minAngle=_this.config.minAngle||0.05;  //每次转动的最小角度
		
		// for reset
		_this.target0 = _this.target.clone();
		_this.position0 = _this.object.position.clone();
		_this.up0 = _this.object.up.clone();
		

	}
	 
	

	// internals
	var STATE = { NONE: - 1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };
	var EPS = 0.000001;
	
	var _autoRotateBreak=false;
	var lastPosition = new THREE.Vector3();

	var _state = STATE.NONE,
	_prevState = STATE.NONE,
	

	_eye = new THREE.Vector3(),

	_movePrev = new THREE.Vector2(),
	_moveCurr = new THREE.Vector2(),

	_lastAxis = new THREE.Vector3(),
	_lastAngle = 0,

	_zoomStart = new THREE.Vector2(),
	_zoomEnd = new THREE.Vector2(),

	_touchZoomDistanceStart = 0,
	_touchZoomDistanceEnd = 0,

	_panStart = new THREE.Vector2(),
	_panEnd = new THREE.Vector2();
	
	var _mousedown_coord=null;
	var _mouseup_coord=null;
	var _isClick=false;
	var _dragend=false;

	// events

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start' };
	var endEvent = { type: 'end' };

	
	this.init(config);   //初始化

	// methods

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.screen.left = 0;
			this.screen.top = 0;
			this.screen.width = window.innerWidth;
			this.screen.height = window.innerHeight;

		} else {

			var box = this.domElement.getBoundingClientRect();
			// adjustments come from similar code in the jquery offset() function
			var d = this.domElement.ownerDocument.documentElement;
			this.screen.left = box.left + window.pageXOffset - d.clientLeft;
			this.screen.top = box.top + window.pageYOffset - d.clientTop;
			this.screen.width = box.width;
			this.screen.height = box.height;

		}

	};

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	var getMouseOnScreen = ( function () {

		var vector = new THREE.Vector2();

		return function getMouseOnScreen( pageX, pageY ) {

			vector.set(
				( pageX - _this.screen.left ) / _this.screen.width,
				( pageY - _this.screen.top ) / _this.screen.height
			);

			return vector;

		};

	}() );

	var getMouseOnCircle = ( function () {

		var vector = new THREE.Vector2();

		return function getMouseOnCircle( pageX, pageY ) {

			vector.set(
				( ( pageX - _this.screen.width * 0.5 - _this.screen.left ) / ( _this.screen.width * 0.5 ) ),
				( ( _this.screen.height + 2 * ( _this.screen.top - pageY ) ) / _this.screen.width ) // screen.width intentional
			);

			return vector;

		};

	}() );
	
	var getMouse=(function(){
		var mouse = new THREE.Vector2();
		var d = _this.domElement.ownerDocument.documentElement;
		return function(){
			mouse.x = ((event.clientX - _this.domElement.offsetLeft -d.clientLeft) /_this.domElement.clientWidth ) * 2 - 1;
			mouse.y =  -(((event.clientY - _this.domElement.offsetTop -d.clientTop) / _this.domElement.clientHeight ) * 2 - 1);
			return mouse;
		}
		
	})();
	
	
	getMouseOnScreen=getMouseOnCircle=getMouse;


	this.rotateCamera = ( function() {

		var axis = new THREE.Vector3(),
			quaternion = new THREE.Quaternion(),
			eyeDirection = new THREE.Vector3(),
			objectUpDirection = new THREE.Vector3(),
			objectSidewaysDirection = new THREE.Vector3(),
			moveDirection = new THREE.Vector3(),
			angle;

		return function rotateCamera() {

			moveDirection.set( _moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y, 0 );		
			angle = moveDirection.length();
			
			if ( angle && Math.abs(angle)>EPS) {
				_autoRotateBreak=true;
				_eye.copy( _this.object.position ).sub( _this.target );

				eyeDirection.copy( _eye ).normalize();
				objectUpDirection.copy( _this.object.up ).normalize();
				objectSidewaysDirection.crossVectors( objectUpDirection, eyeDirection ).normalize();

				objectUpDirection.setLength( _moveCurr.y - _movePrev.y );
				objectSidewaysDirection.setLength( _moveCurr.x - _movePrev.x );
				

				moveDirection.copy( objectUpDirection.add( objectSidewaysDirection ) );

				axis.crossVectors( moveDirection, _eye ).normalize();

				angle *= _this.rotateSpeed;
				quaternion.setFromAxisAngle( axis, angle );

				_eye.applyQuaternion( quaternion );
				_this.object.up.applyQuaternion( quaternion );

				_lastAxis.copy( axis );
				_lastAngle = angle;
				

				_this.object.position.addVectors( _this.target, _eye );

				_this.checkDistances();

				_this.object.lookAt( _this.target );

				if ( lastPosition.distanceToSquared( _this.object.position ) > EPS ) {

					_this.dispatchEvent( changeEvent );

					lastPosition.copy( _this.object.position );

				}

			} 
			_movePrev.copy( _moveCurr );

		};

	}() );
	
	
	
	this.autoRotateCamera=(function(){
			
			quaternion = new THREE.Quaternion();
			return function(axis,speed){
				if(!axis||!speed){
					return;
				}
				
				if ( ! _this.staticMoving && axis &&_this.enableDampingFactor==true && _autoRotateBreak==true){
					axis *= Math.sqrt( 1.0 - _this.dynamicDampingFactor );
					_lastAngle=axis;
				}
				
				_eye.copy( _this.object.position ).sub( _this.target );
				
				quaternion.setFromAxisAngle( axis,speed );

				_eye.applyQuaternion( quaternion );
				_this.object.up.applyQuaternion( quaternion );
				
				
				_this.object.position.addVectors( _this.target, _eye );

				_this.checkDistances();

				_this.object.lookAt( _this.target );

				if ( lastPosition.distanceToSquared( _this.object.position ) > EPS ) {

					_this.dispatchEvent( changeEvent );

					lastPosition.copy( _this.object.position );

				}
			}
				
					
	})();


	this.zoomCamera = function () {

		var factor;

		if ( _state === STATE.TOUCH_ZOOM_PAN ) {

			factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
			_touchZoomDistanceStart = _touchZoomDistanceEnd;
			_eye.multiplyScalar( factor );

		} else {

			factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * _this.zoomSpeed;

			if ( factor !== 1.0 && factor > 0.0 ) {

				_eye.multiplyScalar( factor );

				if ( _this.staticMoving ) {

					_zoomStart.copy( _zoomEnd );

				} else {

					_zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.dynamicDampingFactor;

				}

			}

		}

	};

	this.panCamera = ( function() {

		var mouseChange = new THREE.Vector2(),
			objectUp = new THREE.Vector3(),
			pan = new THREE.Vector3();

		return function panCamera() {

			mouseChange.copy( _panEnd ).sub( _panStart );

			if ( mouseChange.lengthSq() ) {

				mouseChange.multiplyScalar( _eye.length() * _this.panSpeed );

				pan.copy( _eye ).cross( _this.object.up ).setLength( mouseChange.x );
				pan.add( objectUp.copy( _this.object.up ).setLength( mouseChange.y ) );

				_this.object.position.add( pan );
				_this.target.add( pan );

				if ( _this.staticMoving ) {

					_panStart.copy( _panEnd );

				} else {

					_panStart.add( mouseChange.subVectors( _panEnd, _panStart ).multiplyScalar( _this.dynamicDampingFactor ) );

				}

			}

		};

	}() );

	this.checkDistances = function () {

		if ( ! _this.noZoom || ! _this.noPan ) {

			if ( _eye.lengthSq() > _this.maxDistance * _this.maxDistance ) {

				_this.object.position.addVectors( _this.target, _eye.setLength( _this.maxDistance ) );
				_zoomStart.copy( _zoomEnd );

			}

			if ( _eye.lengthSq() < _this.minDistance * _this.minDistance ) {

				_this.object.position.addVectors( _this.target, _eye.setLength( _this.minDistance ) );
				_zoomStart.copy( _zoomEnd );

			}

		}

	};

	this.update = function () {

		_eye.subVectors( _this.object.position, _this.target );
		
		if( ! _this.noRotate&&_this.enableAutoRotate==true&&_this.autoRotateSpeed>0&&_autoRotateBreak==false){
			_this.autoRotateCamera( _this.defaultRotateAxis, _this.autoRotateSpeed );
		}else if(_dragend && Math.abs(_lastAngle) >_this.minAngle){
			_this.autoRotateCamera( _lastAxis, _lastAngle );
		}

	};

	this.reset = function () {

		_state = STATE.NONE;
		_prevState = STATE.NONE;

		_this.target.copy( _this.target0 );
		_this.object.position.copy( _this.position0 );
		_this.object.up.copy( _this.up0 );

		_eye.subVectors( _this.object.position, _this.target );

		_this.object.lookAt( _this.target );

		_this.dispatchEvent( changeEvent );

		lastPosition.copy( _this.object.position );

	};

	// listeners

	function keydown( event ) {

		if ( _this.enabled === false ) return;

		window.removeEventListener( 'keydown', keydown );

		_prevState = _state;

		if ( _state !== STATE.NONE ) {

			return;

		} else if ( event.keyCode === _this.keys[ STATE.ROTATE ] && ! _this.noRotate ) {

			_state = STATE.ROTATE;

		} else if ( event.keyCode === _this.keys[ STATE.ZOOM ] && ! _this.noZoom ) {

			_state = STATE.ZOOM;

		} else if ( event.keyCode === _this.keys[ STATE.PAN ] && ! _this.noPan ) {

			_state = STATE.PAN;

		}

	}

	function keyup( event ) {

		if ( _this.enabled === false ) return;

		_state = _prevState;

		window.addEventListener( 'keydown', keydown, false );

	}

	function mousedown( event ) {

		if ( _this.enabled === false ) return;
		event.preventDefault();
		event.stopPropagation();
		
		var mouseCoord=getMouseOnCircle( event.pageX, event.pageY );
		_mousedown_coord=(mouseCoord);
		//console.info("mousedown:"+JSON.stringify(_mousedown_coord));
		
		if ( _state === STATE.NONE ) {

			_state = event.button;

		}

		
		if ( _state === STATE.ROTATE && ! _this.noRotate ) {
			_moveCurr.copy( getMouseOnCircle( event.pageX, event.pageY ) );
			_movePrev.copy( _moveCurr );
			_dragend=false;

		} else if ( _state === STATE.ZOOM && ! _this.noZoom ) {

			_zoomStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
			_zoomEnd.copy( _zoomStart );

		} else if ( _state === STATE.PAN && ! _this.noPan ) {

			_panStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
			_panEnd.copy( _panStart );

		}
		
		_this.dispatchEvent( startEvent );

	}

	function mousemove( event ) {
		
		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.ROTATE && ! _this.noRotate ) {

			_movePrev.copy( _moveCurr );
			_moveCurr.copy( getMouseOnCircle( event.pageX, event.pageY ) );
			_this.rotateCamera();

		} else if ( _state === STATE.ZOOM && ! _this.noZoom ) {

			_zoomEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );
			_this.zoomCamera();

		} else if ( _state === STATE.PAN && ! _this.noPan ) {

			_panEnd.copy( );
			_this.panCamera();

		}
		if(_this.enableRaycaster===true){
			raycast(getMouseOnCircle( event.pageX, event.pageY ));
		}

	}

	function mouseup( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();
		_mouseup_coord=getMouseOnCircle( event.pageX, event.pageY);
		 
		 if(_mousedown_coord&&_mouseup_coord&&
					_mousedown_coord.x==_mouseup_coord.x&&_mousedown_coord.y==_mouseup_coord.y){
			_isClick=true;
		}
		 
		if(_lastAngle<_this.minAngle){
			_lastAngle=0;
		}

		if(_state==STATE.ROTATE && !_isClick){
			_dragend=true;
		}
		_state = STATE.NONE;
		
		if(_this.enableRaycaster===true){
			raycast(getMouseOnCircle( event.pageX, event.pageY ));
		}

		_this.dispatchEvent( endEvent );

	}
	
	function stopRotate(){
		_this.enableAutoRotate=false;
		lastPosition
	}

	function mousewheel( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if ( event.wheelDelta ) {

			// WebKit / Opera / Explorer 9

			delta = event.wheelDelta / 40;

		} else if ( event.detail ) {

			// Firefox

			delta = - event.detail / 3;

		}

		_zoomStart.y += delta * 0.01;
		_this.dispatchEvent( startEvent );
		_this.dispatchEvent( endEvent );

	}

	function touchstart( event ) {

		if ( _this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				_state = STATE.TOUCH_ROTATE;
				_moveCurr.copy( getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				_movePrev.copy( _moveCurr );
				break;

			default: // 2 or more
				_state = STATE.TOUCH_ZOOM_PAN;
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );

				var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
				var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
				_panStart.copy( getMouseOnScreen( x, y ) );
				_panEnd.copy( _panStart );
				break;

		}

		_this.dispatchEvent( startEvent );

	}

	function touchmove( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {

			case 1:
				_movePrev.copy( _moveCurr );
				_moveCurr.copy( getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				break;

			default: // 2 or more
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy );

				var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
				var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
				_panEnd.copy( getMouseOnScreen( x, y ) );
				break;

		}

	}

	function touchend( event ) {

		if ( _this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 0:
				_state = STATE.NONE;
				break;

			case 1:
				_state = STATE.TOUCH_ROTATE;
				_moveCurr.copy( getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				_movePrev.copy( _moveCurr );
				break;

		}

		_this.dispatchEvent( endEvent );

	}

	function contextmenu( event ) {

		event.preventDefault();

	}
	
	
	
	var raycast=(function (){
		var raycaster;  //投射光线者对象
		var intersects; //当前光线投射到的对象
		var INTERSECTED=null; //之前光线投射到的对象
		//raycaster = new THREE.Raycaster(_this.object.position, _this.raycastTarget.position.sub(_this.object.position).normalize());
		
		/*var vector=new THREE.Vector3();
		var camera=_this.object;*/
		
		raycaster = new THREE.Raycaster();
		
		
		return function findIntersections(mouse) {
			
			/*vector.set( mouse.x, mouse.y, 0.5 );
			vector.unproject( camera );

			raycaster.set( camera.position, vector.sub( camera.position ).normalize() );*/
			
			// find intersections	
			if(mouse.x){
				raycaster.setFromCamera( mouse, _this.object );
				intersects = raycaster.intersectObjects( _this.raycastTarget.children )||[];
			}

			
			console.info(JSON.stringify(mouse));
			
			if ( intersects.length > 0 ) { 
				_lastAngle=0;
				_autoRotateBreak=true;
				
				if(_this.enableClick&&_isClick){
					INTERSECTED.dispatchEvent({type:"click"});
				}
				if ( INTERSECTED != intersects[ 0 ].object ) {
					
					if ( INTERSECTED &&_this.enableMouseout) {
						INTERSECTED.dispatchEvent({type:"mouseout"});
					}
		
					INTERSECTED = intersects[ 0 ].object;
					
					if(_this.enableMouseover){
						INTERSECTED.dispatchEvent({type:"mouseover"});
					}
				}
				
				
		
			} else {
				if(_this.enableMouseout&&INTERSECTED){
					INTERSECTED.dispatchEvent({type:"mouseout"});
				}
				INTERSECTED=null;
				
		
			}
			_mousedown_coord=null;
			_mouseup_coord=null;
			_isClick=false;
			 
		}
	})();
	
	
	this.dispose = function() {

		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
		this.domElement.removeEventListener( 'mousedown', mousedown, false );
		this.domElement.removeEventListener( 'mousewheel', mousewheel, false );
		this.domElement.removeEventListener( 'MozMousePixelScroll', mousewheel, false ); // firefox

		this.domElement.removeEventListener( 'touchstart', touchstart, false );
		this.domElement.removeEventListener( 'touchend', touchend, false );
		this.domElement.removeEventListener( 'touchmove', touchmove, false );

		this.domElement.removeEventListener( 'mousemove', mousemove, false );
		this.domElement.removeEventListener( 'mouseup', mouseup, false );

		window.removeEventListener( 'keydown', keydown, false );
		window.removeEventListener( 'keyup', keyup, false );

	};

	
	
	this.domElement.addEventListener( 'contextmenu', contextmenu, false );
	this.domElement.addEventListener( 'mousedown', mousedown, false );
	this.domElement.addEventListener( 'mousewheel', mousewheel, false );
	this.domElement.addEventListener( 'MozMousePixelScroll', mousewheel, false ); // firefox
	this.domElement.addEventListener( 'mousemove', mousemove, false );
	this.domElement.addEventListener( 'mouseup', mouseup, false );

	this.domElement.addEventListener( 'touchstart', touchstart, false );
	this.domElement.addEventListener( 'touchend', touchend, false );
	this.domElement.addEventListener( 'touchmove', touchmove, false );

	window.addEventListener( 'keydown', keydown, false );
	window.addEventListener( 'keyup', keyup, false );
	
	

	this.handleResize();

	// force an update at start
	this.update();

};

THREE.HxzzTrackballControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.HxzzTrackballControls.prototype.constructor = THREE.HxzzTrackballControls;
