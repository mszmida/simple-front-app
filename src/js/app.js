"use strict";

const Backbone = require("backbone"),
    Marionette = require("backbone.marionette"),
    LayoutController = require("layout/layout.controller.js"),
    UsersController = require("modules/users/users.controller.js");


module.exports = Marionette.Application.extend({
    channelName: "global",
    region: "#root-region",

    initialize: function(options) {
        this.channel = this.getChannel();

        console.log("App initialized");
    },

    onBeforeStart: function(options) {
        new LayoutController({ region: this.getRegion() });
        new UsersController();
    },

    onStart: function(options) {
        Backbone.history.start();

        this.channel.trigger("layout:show");
        this.channel.trigger("users:show");

        console.log("Application started");
    }
});
