"use strict";

const Marionette = require("backbone.marionette"),
    LayoutTemplate = require("layout/templates/layout.template.ejs");


module.exports = Marionette.View.extend({
    template: LayoutTemplate,

    regions: {
        headerRegion: "#header-region",
        contentRegion: "#content-region",
        footerRegion: "#footer-region"
    }
});
