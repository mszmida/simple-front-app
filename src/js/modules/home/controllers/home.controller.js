"use strict";

const Marionette = require('backbone.marionette'),
    UsersCollection = require("modules/home/models/users.collection.js"),
    UsersView = require("modules/home/views/users.view.js");


module.exports = Marionette.Object.extend({
    channelName: "global",

    radioEvents: {
        "user:create": "createUser",
        "user:edit": "editUser"
    },

    getUsersView: function (users) {
        return new UsersView({ users: users });
    },

    showHome: function () {
        var channel = this.getChannel(),
            users = new UsersCollection([
                { name: "John Snow", email: "john@snow.com" },
                { name: "Edward Nożycoręki", email: "edi@noz.com" },
                { name: "Mr Anderson", email: "mr@anderson.com" }
            ]),
            self = this;

        channel.trigger("layout:show", function (contentRegion) {
            contentRegion.show(self.getUsersView(users));
        });
    },

    createUser: function (data) {
        console.log("CONTROLLER: create user", data);
    },

    editUser: function (data) {
        console.log("CONTROLLER: edit user", data);
    }
});
