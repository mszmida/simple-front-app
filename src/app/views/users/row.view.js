"use strict";

var Marionette = require("backbone.marionette"),
	UserTemplate = require("../../templates/users/row.template.ejs");


module.exports = Marionette.View.extend({
	tagName: "tr",
    template: UserTemplate
});
