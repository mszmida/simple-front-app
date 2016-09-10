"use strict";

const Marionette = require("backbone.marionette"),
	UserTemplate = require("modules/users/templates/row.template.ejs");


module.exports = Marionette.View.extend({
	tagName: "tr",
    template: UserTemplate
});
