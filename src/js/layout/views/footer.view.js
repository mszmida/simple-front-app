"use strict";

const Marionette = require("backbone.marionette"),
    FooterTemplate = require("layout/templates/footer.template.ejs");


module.exports = Marionette.View.extend({
    template: FooterTemplate
});
