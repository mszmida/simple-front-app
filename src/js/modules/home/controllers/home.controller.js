"use strict";

const Marionette = require('backbone.marionette'),
    UsersCollection = require("modules/home/models/users.collection.js"),
    UsersView = require("modules/home/views/users.view.js");


module.exports = Marionette.Object.extend({
    channelName: "global",

    initialize: function () {
        var channel = this.getChannel();

        this.listenTo(channel, "user:create", this.createUser);
        this.listenTo(channel, "user:edit", this.editUser);
    },

    showHome: function () {
        var channel = this.getChannel(),
            users = new UsersCollection([
                { name: "John Snow", email: "john@snow.com" },
                { name: "Edward Nożycoręki", email: "edi@noz.com" },
                { name: "Mr Anderson", email: "mr@anderson.com" }
            ]);

        channel.trigger("layout:show", function (contentRegion) {
            contentRegion.show(new UsersView({ users: users }));
        });
    },

    createUser: function () {
        console.log("CONTROLLER: create user");
    },

    editUser: function () {
        console.log("CONTROLLER: edit user");
    }
});
