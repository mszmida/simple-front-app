"use strict";

const Marionette = require("backbone.marionette"),
    HeaderTemplate = require("layout/templates/header.template.ejs");


module.exports = Marionette.View.extend({
    template: HeaderTemplate
});
