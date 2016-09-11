"use strict";

const Marionette = require('backbone.marionette'),
    UsersCollection = require("modules/users/models/users.collection.js"),
    UsersTableView = require("modules/users/views/table.view.js");


module.exports = Marionette.Object.extend({
    channelName: "global",

    radioEvents: {
        "users:show": "showUsers"
    },

    initialize: function(options) {
        this.channel = this.getChannel();

        this.collection = new UsersCollection([
            { name: "John Snow", email: "john@snow.com" },
            { name: "Edward Nożycoręki", email: "edi@noz.com" },
            { name: "Mr Anderson", email: "mr@anderson.com" }
        ]);
    },

    showUsers: function () {
        this.channel.trigger("layout:content:show", new UsersTableView({ collection: this.collection }));
    }
});
