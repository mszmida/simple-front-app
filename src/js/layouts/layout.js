"use strict";

const Marionette = require("backbone.marionette"),
    MainLayoutController = require("layouts/main/layout.controller.js");


module.exports = Marionette.Object.extend({
    channelName: "global",

    radioEvents: {
        "layout:show": "showLayout"
    },

    initialize: function () {
        this.layoutController = null;
    },

    getLayoutController: function (callback) {
        return new MainLayoutController({
            region: this.getOption("rootRegion"),
            callback: callback
        });
    },

    showLayout: function (callback) {
        if (!this.layoutController) {
            this.layoutController = this.getLayoutController(callback);
        }
    }
});
