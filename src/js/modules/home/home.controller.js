"use strict";

const Marionette = require('backbone.marionette'),
    UsersCollection = require("modules/home/models/users.collection.js"),
    UsersTableView = require("modules/home/views/table.view.js");


module.exports = Marionette.Object.extend({
    channelName: "global",

    showHome: function () {
        var channel = this.getChannel(),
            users = new UsersCollection([
                { name: "John Snow", email: "john@snow.com" },
                { name: "Edward Nożycoręki", email: "edi@noz.com" },
                { name: "Mr Anderson", email: "mr@anderson.com" }
            ]);

        channel.trigger("layout:show", function (contentRegion) {
            contentRegion.show(new UsersTableView({ collection: users }));
        });
    }
});
