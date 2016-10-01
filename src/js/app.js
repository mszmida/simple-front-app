"use strict";

const Backbone = require("backbone"),
    Marionette = require("backbone.marionette"),
    Layout = require("layouts/layout.js"),
    Modal = require("common/modal/modal.js"),
    HomeModule = require("modules/home/home.module.js");


module.exports = Marionette.Application.extend({
    channelName: "global",

    region: "#root-layout-region",

    initialize: function(options) {
        this.channel = this.getChannel();

        console.log("App initialized");
    },

    onBeforeStart: function(options) {
        this.channel.on("navigate", function (route, options) {
            Backbone.history.navigate(route, options);
        });

        // init layout
        // it must be defined before routers
        new Layout({ rootRegion: this.getRegion() });

        // init modal mechanism
        new Modal();

        // init home module
        new HomeModule();
    },

    onStart: function(options) {
        // history should be start after the routers and modules initialization
        Backbone.history.start();

        if (Backbone.history.fragment === "") {
            this.channel.trigger("home:show");
        }

        console.log("Application started");
    }
});
