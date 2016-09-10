"use strict";

var Marionette = require("backbone.marionette"),
    FooterTemplate = require("../templates/footer.template.ejs");


module.exports = Marionette.View.extend({
    template: FooterTemplate
});
