"use strict";

var Backbone = require("backbone"),
    Marionette = require("backbone.marionette"),
    RootView = require("../views/root.view.js"),
    HeaderView = require("../views/header.view.js"),
    FooterView = require("../views/footer.view.js"),
    UsersTableView = require("../views/users/table.view.js");


var App = Marionette.Application.extend({
    channelName: "global",
    region: "#root-region",

    initialize: function(options) {
        this.channel = this.getChannel();

        console.log("Initialized");
    },

    onBeforeStart: function(options) {
        this.collection = new Backbone.Collection([
            { name: "John Snow", email: "john@snow.com" },
            { name: "Edward Nożycoręki", email: "edi@noz.com" },
            { name: "Mr Anderson", email: "mr@anderson.com" }
        ]);

        console.log("Before start");
    },

    onStart: function(options) {
        Backbone.history.start();

        this.showView(new RootView());

        this.channel.trigger("root:header:show", new HeaderView());
        this.channel.trigger("root:content:show", new UsersTableView({ collection: this.collection }));
        this.channel.trigger("root:footer:show", new FooterView());
    }
});

// application initialization
var app = new App();
app.start();
