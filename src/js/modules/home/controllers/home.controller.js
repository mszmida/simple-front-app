"use strict";

const Marionette = require('backbone.marionette'),
    UsersCollection = require("modules/home/models/users.collection.js"),
    UsersView = require("modules/home/views/users.view.js");


module.exports = Marionette.Object.extend({
    channelName: "global",

    radioEvents: {
        "user:create": "createUser",
        "user:edit": "editUser",
        "user:remove": "removeUser"
    },

    initialize: function () {
        this.channel = this.getChannel();
        this.users = new UsersCollection([
            { name: "John Snow", email: "john@snow.com" },
            { name: "Edward Nożycoręki", email: "edi@noz.com" },
            { name: "Mr Anderson", email: "mr@anderson.com" }
        ]);
    },

    getUsersView: function (users) {
        return new UsersView({ collection: users });
    },

    showHome: function () {
        var self = this;

        this.channel.trigger("layout:show", function (contentRegion) {
            contentRegion.show(self.getUsersView(self.users));
        });
    },

    parseFormData: function (formData) {
        var data = { };

        formData.forEach(function (field) {
            data[field.name] = field.value;
        });

        return data;
    },

    createUser: function (formData) {
        this.users.add(this.parseFormData(formData));

        this.channel.trigger("modal:close");
    },

    editUser: function (formData, userModel) {
        userModel.set(this.parseFormData(formData));

        this.channel.trigger("modal:close");
    },

    removeUser: function (model, collection) {
        collection.remove(model);

        this.channel.trigger("modal:close");
    },

    onBeforeDestroy: function () {
        this.users.reset();

        delete this.users;

        delete this.channel;
    }
});
