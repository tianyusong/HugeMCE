/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 *       
 */
(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('formatbrush');

	tinymce.create('tinymce.plugins.FormatBrushPlugin', {
		cssText:"",
		tagnames: {},
		root:null,
		ignoreTags:["div","p","table","tr","td","th","tbody"],
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

			// load content css
			ed.onInit.add(function() {
				if (ed.settings.content_css !== false)
					ed.dom.loadCSS(url + "/css/content.css");
			});

			// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceformatbrush');
			ed.addCommand('mceformatbrush', function() {
				// get selected html element, e.g:strong, li
				var ele = ed.selection.getStart();
				t.cssText = t._mergeStyle(ele, "");
				t.tagnames = t._mergeTagname(ele, []);
				while ((ele = ele.parentNode) && ele != null && !(/^(?:body|html)$/i).test(ele.tagName)) {
					t.cssText = t._mergeStyle(ele, t.cssText);
					t.tagnames = t._mergeTagname(ele, t.tagnames);
				}
				t.root = ele;
				//t.root.style.cursor='url('+url+'/img/formatbrush.cur'+'),auto';
				ed.dom.addClass(t.root, "formatbrushing");
			});
			// mouse up, format the content
			ed.onMouseUp.add(function(ed, e) {
				try {
					if (!t.root) return;
					var html = ed.selection.getContent();
					if(html && t.tagnames.length > 0) {
						var changed = false;
						for(var i = 0; i < t.tagnames.length; i++) {
							var tagname = t.tagnames[i];
							var ignored = false;
							// ignore some block element, or formated area will be changed
							for(var j = 0; j < t.ignoreTags.length; j++) {
								if (tagname.toLowerCase() == t.ignoreTags[j]) {
									ignored = true;
									break;
								}
							}
							if (ignored) continue;
							html = "<"+tagname+(i==0?(" style='"+t.cssText+"'"):"")+">" + html + "</"+tagname+">";
							changed = true;
						}
						// if no tag will be added, add default span element and attach style css to it
						if (!changed && t.cssText) {
							html = "<span style='" + t.cssText + "'>" + html + "</span>";
						}
					}
					ed.selection.setContent(html);
					t.tagnames = [];
					t.cssText = "";
					ed.dom.removeClass(t.root, "formatbrushing");
					t.root = null;
				} catch (e) {
				}
			});

			// process Esc key
			ed.onKeyUp.add(function(ed, e) {
				try {
					if (e.keyCode == 27) {
						ed.dom.removeClass(t.root, "formatbrushing");						
						t.root = null
					}
				} catch (e) {
				}
			});

			// Register formatbrush button
			ed.addButton('formatbrush', {
				title : 'formatbrush.desc',
				cmd : 'mceformatbrush',
				image : url + '/img/formatbrush.png'
			});
		},
		// merge css text
		_mergeStyle: function(node, cssText) {
			if (node) {
				var ct = node.style.cssText || "";
				var cts = ct.split(":") || [];
				if (cts.length > 0) {
					if ((":"+cssText).indexOf(":"+cts[0] + ":") < 0) {
						cssText += ct;
					}
				} else cssText += ct;
			}
			return cssText;
		},
		// merge tagname
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