/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */


(function(tinymce) {
	
var deployJava={
	runApplet:function(attributes,parameters,minimumVersion){
		deployJava.writeAppletTag(attributes,parameters);
	},
	writeAppletTag:function(attributes,parameters){
		var div = document.createElement('div');
		document.body.appendChild(div);
		var s='<'+'applet ';
		for(var attribute in attributes){
			s+=(' '+attribute+'="'+attributes[attribute]+'"');
		}

		s+='>';
		if(parameters!='undefined'&&parameters!=null){
			var codebaseParam=false;
			for(var parameter in parameters){
				if(parameter=='codebase_lookup'){
					codebaseParam=true;
				}

				s +='<param name="'+parameter+'" value="'+
				parameters[parameter]+'">';
			}

			if(!codebaseParam){
				s += ('<param name="codebase_lookup" value="false">');
			}
		}

		s += ('<'+'/'+'applet'+'>');
		div.innerHTML = s;
	}
};
	function imagePaste(e, ed){
		if(!document.screenshotApplet)return;
		var result = document.screenshotApplet.paste();
		var isSafari = (navigator.vendor) && (navigator.vendor.toLowerCase().indexOf('apple')!=-1)
				&& navigator.userAgent.toLowerCase().indexOf('safari')!=-1;
		if(!isSafari && result===false){
			//alert('剪贴板中没有图片内容');
			return true;
		}
		if(!isSafari && result!=true){
			//alert('粘贴发生异常！'+result);
			return true;
		}
		result = document.screenshotApplet.submit();
		if(!isSafari && result===false){
			//alert('剪贴板中没有图片内容');
			return true;
		}
		if(!isSafari && result!=true){
			//alert('上传发生异常！'+result);
			return true;
		}
		ed._avoidunload = true;
		window.uploadSucc = function uploadSucc(imgSrc){
			imgSrc = imgSrc.split(";");
			imgSrc = imgSrc[0];
			ed.execCommand('mceInsertContent', false, '<img src="'+imgSrc+'"/>');
			ed._avoidunload = false;
		}
		try{
			tinymce.dom.Event.cancel(e);
		}catch(err){
		}
		return false;
	}
	
	function runApplet(codebase, post, after){
		var version = '1.5';
		var attributes = {
			codebase: codebase,
			name : 'screenshotApplet',
			code:	"com.baidu.screenshot.ScreenshotApplet.class",
			archive:"screenshot.jar",
			width:0,
			height:0
		};
		var parameters = {
			post: post,
			after: "uploadSucc"
		};
		if(!document.screenshotApplet){
			deployJava.runApplet(attributes, parameters, version);
		}
	}
	tinymce.create('tinymce.plugins.AppletPastePlugin', {
		init : function(ed, url) {
			var baseUrl = ed.getParam('appletpaste_base'), codeBase = ed.getParam('appletpaste_codebase'),
				postUrl = ed.getParam('appletpaste_post');
			baseUrl = baseUrl.replace(/\/$/, '') + '/';
			if(!codeBase)codeBase=baseUrl+'public/screenshot/';
			if(!postUrl)postUrl=baseUrl+'api/images/';
			runApplet(codeBase, postUrl);
			var isFf = navigator.userAgent.toLowerCase().indexOf('firefox')!=-1 && 
				navigator.userAgent.toLowerCase().indexOf('gecko')!=-1;
			if(!isFf || /Firefox\/2/.test(navigator.userAgent)){
				ed.onKeyDown.add(function(ed, e) {
					if (((e.ctrlKey) && e.keyCode == 86))
						try{
							return imagePaste(e, ed);
						}catch(err){}
				});
			}else{
				ed.onPaste.addToTop(function(ed, e) {
					return imagePaste(e, ed);
				});
			}
		},

		getInfo : function() {
			return {
				longname : 'Applet Paste Image',
				author : 'baidu iit',
				authorurl : 'http://ecmp.baidu.com',
				infourl : 'http://ecmp.baidu.com',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add("appletpaste", tinymce.plugins.AppletPastePlugin);
})(tinymce);
