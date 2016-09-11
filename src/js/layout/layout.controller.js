"use strict";

const Marionette = require('backbone.marionette'),
    LayoutView = require("layout/views/layout.view.js"),
    HeaderView = require("layout/views/header.view.js"),
    FooterView = require("layout/views/footer.view.js");


module.exports = Marionette.Object.extend({
    channelName: "global",

    radioEvents: {
        "layout:show": "showLayout",
        "layout:header:show": "showHeader",
        "layout:content:show": "showContent",
        "layout:footer:show": "showFooter"
    },

    initialize: function(options) {
        this.region = this.getOption("region");
        this.layoutView = new LayoutView();
    },

    showLayout: function () {
        if (!this.region) {
            throw new Error("Layout 'region' must be defined!");
        }

        this.region.show(this.layoutView);
        this.layoutView.showChildView("headerRegion", new HeaderView());
        this.layoutView.showChildView("footerRegion", new FooterView());
    },

    showHeader: function (view) {
        this.layoutView.showChildView("headerRegion", view);
    },

    showContent: function (view) {
        this.layoutView.showChildView("contentRegion", view);
    },

    showFooter: function (view) {
        this.layoutView.showChildView("footerRegion", view);
    }
});
