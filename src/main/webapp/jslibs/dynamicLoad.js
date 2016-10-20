(function (){
	function loadJS(url,callback) {
		var domScript = document.createElement('script');
		domScript.src = url;
		document.getElementsByTagName('head')[0].appendChild(domScript);
		
		domScript.onload = domScript.onreadystatechange = function() {
			callback();
			if (!this.readyState || 'loaded' === this.readyState
					|| 'complete' === this.readyState) {
				this.onload = this.onreadystatechange = null;
				this.parentNode.removeChild(this);
			}
		}
	}

	function recursionLoad(urls,callback) {
		if (!urls || urls.length == 0) {
			callback&&callback();
			return;
		}
		var domScript = document.createElement('script');
		var url = urls.pop();
		domScript.src = url;
		
		document.getElementsByTagName('head')[0].appendChild(domScript);
		domScript.onload = domScript.onreadystatechange = function() {
			recursionLoad(urls,callback);
			if (!this.readyState || 'loaded' === this.readyState
					|| 'complete' === this.readyState) {
				this.onload = this.onreadystatechange = null;
				this.parentNode.removeChild(this);
			}
		}
		
	}


	
	var jsAjaxLoader= function (urls, callback) {
		alert(callback);
		if (urls.constructor == String) {
			loadJs(urls,callback);
			return;
		} else if (urls.constructor == Array) {
			recursionLoad(urls.reverse(),callback);
		}else {
			alert("url格式错误!");
		}
	}
	var my={};
	my['jsAjaxLoader']=jsAjaxLoader;
	
	$['my']=my;
})();


