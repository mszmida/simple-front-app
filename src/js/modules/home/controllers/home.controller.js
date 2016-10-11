"use strict";

const Marionette = require('backbone.marionette'),
    UsersCollection = require("modules/home/models/users.collection.js"),
    UsersView = require("modules/home/views/users.view.js"),
    UsersFetchFailedView = require("modules/home/views/users.fetch.failed.view.js");


module.exports = Marionette.Object.extend({
    channelName: "global",

    radioEvents: {
        "user:create": "createUser",
        "user:edit": "editUser",
        "user:remove": "removeUser"
    },

    initialize: function () {
        this.channel = this.getChannel();
        this.users = new UsersCollection();
    },

    getUsersView: function (users) {
        return new UsersView({ collection: users });
    },

    getUsersFetchFailedView: function () {
        return new UsersFetchFailedView();
    },

    showHome: function () {
        console.log("show home");
        this.channel.request("service:users:fetch")
            .done(this._onFetchUsersSuccess.bind(this))
            .fail(this._onFetchUsersFail.bind(this));
    },

    _onFetchUsersSuccess: function (res) {
        var self = this;

        this.users.add(res.data);

        this.channel.trigger("layout:show", function (contentRegion) {
            contentRegion.show(self.getUsersView(self.users));
        });
    },

    _onFetchUsersFail: function (res) {
        var self = this;

        this.channel.trigger("layout:show", function (contentRegion) {
            contentRegion.show(self.getUsersFetchFailedView());
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
