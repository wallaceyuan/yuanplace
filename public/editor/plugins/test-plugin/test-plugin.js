<<<<<<< HEAD
/*!
 * Test plugin for Editor.md
 *
 * @file        test-plugin.js
 * @author      pandao
 * @version     1.2.0
 * @updateTime  2015-03-07
 * {@link       https://github.com/pandao/editor.md}
 * @license     MIT
 */

(function() {

    var factory = function (exports) {

		var $            = jQuery;           // if using module loader(Require.js/Sea.js).

		exports.testPlugin = function(){
			alert("testPlugin");
		};

		exports.fn.testPluginMethodA = function() {
			/*
			var _this       = this; // this == the current instance object of Editor.md
			var lang        = _this.lang;
			var settings    = _this.settings;
			var editor      = this.editor;
			var cursor      = cm.getCursor();
			var selection   = cm.getSelection();
			var classPrefix = this.classPrefix;

			cm.focus();
			*/
			//....

			alert("testPluginMethodA");
		};

	};
    
	// CommonJS/Node.js
	if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    { 
        module.exports = factory;
    }
	else if (typeof define === "function")  // AMD/CMD/Sea.js
    {
		if (define.amd) { // for Require.js

			define(["editormd"], function(editormd) {
                factory(editormd);
            });

		} else { // for Sea.js
			define(function(require) {
                var editormd = require("./../../editormd");
                factory(editormd);
            });
		}
	} 
	else
	{
        factory(window.editormd);
	}

})();
=======
/*!
 * Test plugin for Editor.md
 *
 * @file        test-plugin.js
 * @author      pandao
 * @version     1.2.0
 * @updateTime  2015-03-07
 * {@link       https://github.com/pandao/editor.md}
 * @license     MIT
 */

(function() {

    var factory = function (exports) {

		var $            = jQuery;           // if using module loader(Require.js/Sea.js).

		exports.testPlugin = function(){
			alert("testPlugin");
		};

		exports.fn.testPluginMethodA = function() {
			/*
			var _this       = this; // this == the current instance object of Editor.md
			var lang        = _this.lang;
			var settings    = _this.settings;
			var editor      = this.editor;
			var cursor      = cm.getCursor();
			var selection   = cm.getSelection();
			var classPrefix = this.classPrefix;

			cm.focus();
			*/
			//....

			alert("testPluginMethodA");
		};

	};
    
	// CommonJS/Node.js
	if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    { 
        module.exports = factory;
    }
	else if (typeof define === "function")  // AMD/CMD/Sea.js
    {
		if (define.amd) { // for Require.js

			define(["editormd"], function(editormd) {
                factory(editormd);
            });

		} else { // for Sea.js
			define(function(require) {
                var editormd = require("./../../editormd");
                factory(editormd);
            });
		}
	} 
	else
	{
        factory(window.editormd);
	}

})();
>>>>>>> 0d3ea3112a579e19f29e07586fa6906c63c92ef5
