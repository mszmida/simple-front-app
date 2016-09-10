"use strict";

var Marionette = require("backbone.marionette"),
    RootViewTemplate = require("../templates/root.template.ejs"),
    Radio = require('backbone.radio');


module.exports = Marionette.View.extend({
    template: RootViewTemplate,

    regions: {
        headerRegion: "#header-region",
        contentRegion: "#content-region",
        footerRegion: "#footer-region"
    },

    initialize: function (options) {
        this.channel = Radio.channel("global");

        this.listenTo(this.channel, "root:header:show", this.showHeader);
        this.listenTo(this.channel, "root:content:show", this.showContent);
        this.listenTo(this.channel, "root:footer:show", this.showFooter);
    },

    showHeader: function (view) {
        this.showChildView("headerRegion", view);
    },

    showContent: function (view) {
        this.showChildView("contentRegion", view);
    },

    showFooter: function (view) {
        this.showChildView("footerRegion", view);
    }
});
