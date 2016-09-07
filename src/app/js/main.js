"use strict";

var Backbone = require("backbone"),
    Marionette = require("backbone.marionette"),
    RootView = require("../views/root.view.js");


var App = Marionette.Application.extend({
    channelName: "global",
    region: "#root-region",

    initialize: function(options) {
        console.log("Initialized");
    },

    onBeforeStart: function(options) {
        console.log("Before start");
    },

    onStart: function(options) {
        Backbone.history.start();

        this.showView(new RootView());
    }
});

// application initialization
var app = new App();
app.start();
