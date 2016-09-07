"use strict";

var Marionette = require("backbone.marionette"),
	RootViewTemplate = require("../templates/root.view.template.ejs");


module.exports = Marionette.View.extend({
	template: RootViewTemplate
});
