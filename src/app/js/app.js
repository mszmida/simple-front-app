"use strict";

document.addEventListener('DOMContentLoaded', function() {

    var Backbone = require("backbone"),
        Marionette = require("backbone.marionette");


    var App = Marionette.Application.extend({
        initialize: function(options) {
            console.log("Initialize");
        },

        onBeforeStart: function(options) {
            console.log("Before start");

        },

        onStart: function(options) {
            Backbone.history.start();
        }
    });

    // application initialization
    var app = new App();
    app.start();
});
