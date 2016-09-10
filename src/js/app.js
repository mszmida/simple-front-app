"use strict";

const Backbone = require("backbone"),
    Marionette = require("backbone.marionette"),
    RootView = require("layout/views/root.view.js"),
    HeaderView = require("layout/views/header.view.js"),
    FooterView = require("layout/views/footer.view.js"),
    UsersTableView = require("modules/users/views/table.view.js"),
    UsersCollection = require("modules/users/models/users.collection.js");


module.exports = Marionette.Application.extend({
    channelName: "global",
    region: "#root-region",

    initialize: function(options) {
        this.channel = this.getChannel();

        console.log("App initialized");
    },

    onBeforeStart: function(options) {
        this.collection = new UsersCollection([
            { name: "John Snow", email: "john@snow.com" },
            { name: "Edward Nożycoręki", email: "edi@noz.com" },
            { name: "Mr Anderson", email: "mr@anderson.com" }
        ]);
    },

    onStart: function(options) {
        Backbone.history.start();

        this.showView(new RootView());

        this.channel.trigger("root:header:show", new HeaderView());
        this.channel.trigger("root:content:show", new UsersTableView({ collection: this.collection }));
        this.channel.trigger("root:footer:show", new FooterView());

        console.log("Application started");
    }
});
