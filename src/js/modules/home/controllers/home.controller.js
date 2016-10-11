"use strict";

const Marionette = require('backbone.marionette'),
    UsersCollection = require("modules/home/models/users.collection.js"),
    UsersView = require("modules/home/views/users.view.js"),
    UsersFetchFailedTemplate = require("modules/home/templates/users.fetch.failed.template.ejs"),
    UsersFailedTemplate = require("modules/home/templates/users.failed.template.ejs");


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
        return new Marionette.View({
            template: UsersFetchFailedTemplate
        });
    },

    getFailedView: function () {
        return new Marionette.View({
            className: "modal-body",
            template: UsersFailedTemplate
        });
    },

    showHome: function () {
        this.channel.request("service:users:fetch")
            .done(this._onFetchUsersSuccess.bind(this))
            .fail(this._onFetchUsersFail.bind(this));
    },

    // TODO: finally move to users service
    parseFormData: function (formData) {
        var data = { };

        formData.forEach(function (field) {
            data[field.name] = field.value;
        });

        return data;
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

    createUser: function (formData) {
        this.channel.request("service:user:create", formData)
            .done(this._onCreateUserSuccess.bind(this))
            .fail(this._onCreateUserFail.bind(this));
    },

    _onCreateUserSuccess: function (res) {
        this.users.add(res.data);

        this.channel.trigger("modal:close");
    },

    _onCreateUserFail: function () {
        this.channel.trigger("modal:close", this._showFailedModal.bind(this));
    },

    _showFailedModal: function (title) {
        this.channel.trigger("modal:show", {
            title: "Operation failed!",
            body: this.getFailedView()
        });
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
