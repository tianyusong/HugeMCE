﻿/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('formatbrush');

	tinymce.create('tinymce.plugins.FormatBrushPlugin', {
		cssText:"",
		tagnames: {},
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			var t = this;

			// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceformatbrush');
			ed.addCommand('mceformatbrush', function() {
				// 获取当前选中的所有html标签，目的是为了提取当前选中对象的外围样式，如：strong, li等，so需要遍历父结点并保留下来
				var ele = ed.selection.getStart();
				t.cssText = t._mergeStyle(ele, "");
				t.tagnames = t._mergeTagname(ele, []);
				while ((ele = ele.parentNode) && ele != null && !(/^(?:body|html)$/i).test(ele.tagName)) {
					t.cssText = t._mergeStyle(ele, t.cssText);
					t.tagnames = t._mergeTagname(ele, t.tagnames);
				}
			});
			
			// 鼠标up的时候，使用格式刷的样式进行格式化被选择的内容
			ed.onMouseUp.add(function(ed, e) {
				var html = ed.selection.getContent();
				if(html && t.tagnames.length > 0) {
					for(var i = 0; i < t.tagnames.length; i++) {
						var tagname = t.tagnames[i];
						if (tagname == "div" || tagname == "p" || tagname == "table" || tagname == "ul") continue; 
						html = "<"+tagname+(i==0?(" style='"+t.cssText+"'"):"")+">" + html + "</"+tagname+">";
					}
					ed.selection.setContent(html);
					t.tagnames = [];
					t.cssText = "";
				}
			});

			// Register formatbrush button
			ed.addButton('formatbrush', {
				title : 'formatbrush.desc',
				cmd : 'mceformatbrush',
				image : url + '/img/formatbrush.gif'
			});
		},
		// 提取结点的cssText
		_mergeStyle: function(node, cssText) {
			if (node) {
				cssText += node.style.cssText;
			}
			return cssText;
		},
		// 提取节点tagname
		_mergeTagname: function(node, tagnames) {
			if (node) {
				var tagname = node.tagName.toLowerCase();
				if((","+tagnames.join(",")+",").indexOf(","+tagname+",") < 0) tagnames.push(tagname);
			}
			return tagnames;
		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'formatbrush plugin',
				author : 'wujinliang',
				authorurl : 'http://www.baidu.com',
				infourl : 'http://www.baidu.com',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('formatbrush', tinymce.plugins.FormatBrushPlugin);
})();