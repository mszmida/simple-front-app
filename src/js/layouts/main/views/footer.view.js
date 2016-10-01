"use strict";

const Marionette = require("backbone.marionette"),
    FooterTemplate = require("layouts/main/templates/footer.template.ejs");


module.exports = Marionette.View.extend({
    template: FooterTemplate
});
