"use strict";

const Marionette = require("backbone.marionette"),
    HeaderTemplate = require("layouts/main/templates/header.template.ejs");


module.exports = Marionette.View.extend({
    template: HeaderTemplate
});
