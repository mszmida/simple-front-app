"use strict";

var Marionette = require("backbone.marionette"),
    HeaderTemplate = require("../templates/header.template.ejs");


module.exports = Marionette.View.extend({
    template: HeaderTemplate
});
