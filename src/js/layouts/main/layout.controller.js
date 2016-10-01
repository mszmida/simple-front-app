"use strict";

const Marionette = require("backbone.marionette"),
    LayoutView = require("layouts/main/views/layout.view.js"),
    HeaderView = require("layouts/main/views/header.view.js"),
    FooterView = require("layouts/main/views/footer.view.js");


module.exports = Marionette.Object.extend({
    channelName: "global",

    radioEvents: {
        "layout:header:show": "showHeader",
        "layout:content:show": "showContent",
        "layout:footer:show": "showFooter"
    },

    initialize: function(options) {
        this.region = this.getOption("region");
        this.layoutView = new LayoutView();

        this.showLayout(this.getOption("callback"));
    },

    isLayoutShown: function () {
        return this.region.hasView();
    },

    getContentRegion: function () {
        return this.layoutView.getRegion("contentRegion");
    },

    showLayout: function (done) {
        if (!this.region) {
            throw new Error("Layout 'region' must be defined!");
        }

        if (typeof done !== "function") {
            throw new Error("Argument is not a funcion!");
        }

        if (!this.isLayoutShown()) {
            this.region.show(this.layoutView);
            this.layoutView.showChildView("headerRegion", new HeaderView());
            this.layoutView.showChildView("footerRegion", new FooterView());
        }

        done(this.getContentRegion());
    },

    showHeader: function (view) {
        this.layoutView.showChildView("headerRegion", view);
    },

    showContent: function (view) {
        this.layoutView.showChildView("contentRegion", view);
    },

    showFooter: function (view) {
        this.layoutView.showChildView("footerRegion", view);
    },

    onBeforeDestroy: function () {
        this.layoutView.destroy();
    }
});
