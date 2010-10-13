/**
 * editor_plugin_src.js
 *
 * Copyright 2010, HugeMCE Organization
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function(tinymce) {
	
	var DOM = tinymce.DOM;
	
    tinymce.create("tinymce.plugins.More", {

    	/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
    	 * 
    	 * @method init
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
    	 */
		init: function(ed, url) {
			var self = this, settings = ed.settings;
			
			// Set default value to show advanced settings
			if (typeof settings.more_show_advanced === "undefined") {
				settings.more_show_advanced = showAdvanced = true;
			} else {
				showAdvanced = settings.more_show_advanced;
			}
			
			self.editor = ed;
			
			// Register the 'more' button
			ed.addButton("more", {
				title: "more.advanced",
				onclick: function() {
					self._toggleAdvancedToolbars(showAdvanced);
					showAdvanced = !showAdvanced;
				}
			});
			
			// Hide advanced toolbars on editor initialized.
			ed.onInit.add(function(ed) {
				self._toggleAdvancedToolbars(!showAdvanced);
			});
		},
		
		/**
		 * Toggle show advanced toolbars.
		 * 
		 * @method _toggleAdvancedToolbars
		 * @param show {boolean} Whether show advanced buttons
		 * @private
		 */
		_toggleAdvancedToolbars: function(show) {
			var i, ed = this.editor, settings = ed.settings;
			for (i = 2; settings["theme_advanced_buttons" + i]; i++) {
				DOM.setStyle(ed.id + "_toolbar" + i, "display", (show ? "block" : "none"));
			}
		},

        getInfo: function() {
			return {
				longname: 'More plugin',
				author: 'GuoLin',
				authorurl: 'http://github.com/fallenlord',
				infourl: 'http://github.com/fallenlord/HugeMCE',
				version: tinymce.majorVersion + "." + tinymce.minorVersion
			};
        }
    });

    tinymce.PluginManager.add("more", tinymce.plugins.More);
})(tinymce);
